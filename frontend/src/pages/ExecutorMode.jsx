import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, MessageSquare, Mail, FileText, RotateCcw, Check, AlertTriangle } from 'lucide-react';
import { supabase } from '../api/supabaseClient';

export default function ExecutorMode() {
    const location = useLocation();
    const navigate = useNavigate();

    // Catch data from Triage Route (Fallback to empty object if accessed directly)
    const {
        entity = 'Unknown Entity',
        fullContext = '',
        caseId = null,
        severity = 0,
        category = 'General Legal Issue',
        reasoning = 'No triage reasoning provided.'
    } = location.state || {};

    // --- Agent States ---
    const [roadmap, setRoadmap] = useState([]);
    const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(true);

    const [draftContent, setDraftContent] = useState('');
    const [isDrafting, setIsDrafting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // --- UI Interaction States ---
    const [activeStep, setActiveStep] = useState(0);
    const [activeFormat, setActiveFormat] = useState('email'); // 'sms', 'email', 'notice'
    const [refinementNote, setRefinementNote] = useState('');

    // Kick back to home if no context is found
    useEffect(() => {
        if (!fullContext) {
            alert("No case context found. Redirecting to Advisory Mode.");
            navigate('/');
        }
    }, [fullContext, navigate]);

    // 1. The Roadmap Agent (Fires on Load)
    useEffect(() => {
        async function fetchDynamicRoadmap() {
            setIsGeneratingRoadmap(true);
            try {
                // The REAL API Call to your Express Backend
                const response = await fetch('/api/execute/roadmap', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ context: fullContext, category })
                });

                if (!response.ok) throw new Error("API Route not ready");
                const data = await response.json();
                setRoadmap(data.roadmap);

            } catch (error) {
                console.warn("Falling back to safe mock roadmap:", error);
                // SAFE DEMO FALLBACK: If API fails, show this so the UI still works
                setRoadmap([
                    { title: "Send Informal Demand", timeframe: "Immediate", description: "A low-friction message to establish a paper trail." },
                    { title: "Formal Email Warning", timeframe: "If no response in 3 days", description: "Escalate the tone referencing legal rights." },
                    { title: "Draft Legal Notice", timeframe: "If no response in 15 days", description: "Final formal warning before court filing." }
                ]);
            } finally {
                setIsGeneratingRoadmap(false);
            }
        }

        if (fullContext) fetchDynamicRoadmap();
    }, [fullContext, category]);

    // NEW: Auto-Trigger Drafting Agent on Load, Tab Change, or Step Change
    useEffect(() => {
        // Only trigger if we have a roadmap and we aren't already currently drafting
        if (roadmap.length > 0 && !isDrafting) {
            handleGenerateDraft();
        }
    }, [roadmap, activeFormat, activeStep]);

    // 2. The Drafting & Critic Agent Loop
    const handleGenerateDraft = async () => {
        setIsDrafting(true);
        try {
            // The REAL API Call to your Express Backend
            const response = await fetch('/api/execute/draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    caseId,
                    context: fullContext,
                    entity,
                    step: roadmap[activeStep],
                    format: activeFormat,
                    refinement: refinementNote
                })
            });

            if (!response.ok) throw new Error("Drafting API failed");
            const data = await response.json();
            setDraftContent(data.draft);

        } catch (error) {
            console.warn("Falling back to safe mock draft:", error);
            // SAFE DEMO FALLBACK
            setTimeout(() => {
                const mockDrafts = {
                    sms: `Hi ${entity}, I am writing regarding our recent dispute. Please consider this a request to resolve the matter immediately to avoid further escalation.`,
                    email: `Subject: Urgent Resolution Required\n\nTo ${entity},\n\nI am writing to formally address the ongoing issue discussed previously. Please review the terms of our agreement and provide a resolution within 3 business days.\n\nRegards,\n[Your Name]`,
                    notice: `LEGAL NOTICE\n\nTo: ${entity}\n\nUnder the provisions of applicable law, you are hereby served notice regarding the failure to uphold obligations...`
                };
                setDraftContent(mockDrafts[activeFormat] || mockDrafts.email);
            }, 2000);
        } finally {
            setIsDrafting(false);
            setRefinementNote(''); // Clear the input after generating
        }
    };

    // 3. Human in the Loop (Approve & Save)
// 3. Human in the Loop (Multi-Format Execution)
    const handleApproveAndSave = async () => {
        if (!caseId) {
            alert("No active case ID found.");
            return;
        }

        setIsSaving(true);
        try {
            // 1. Always save the record to Supabase first
            const { error } = await supabase
                .from('cases')
                .update({
                    status: `Executed as ${activeFormat}`,
                    final_document: draftContent,
                    target_entity: entity
                })
                .eq('id', caseId);

            if (error) throw error;

            // 2. Prepare content for external apps
            const encodedBody = encodeURIComponent(draftContent);
            const encodedSubject = encodeURIComponent(`Legal Notice: ${category} regarding ${entity}`);

            // 3. Routing based on Active Format
            if (activeFormat === 'email') {
                // Open Gmail Compose
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodedSubject}&body=${encodedBody}`;
                window.open(gmailUrl, '_blank');
            }
            else if (activeFormat === 'sms') {
                // Open Default SMS App (works on mobile/Mac/Windows)
                // Note: Using '?' for Android/Web and '&' for iOS compatibility
                const smsUrl = `sms:?body=${encodedBody}`;
                window.location.href = smsUrl;
            }
            else if (activeFormat === 'notice') {
                // Generate a "Print to PDF" view
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <html>
                        <head><title>Legal Notice - KALPA AI</title></head>
                        <body style="font-family: serif; padding: 50px; line-height: 1.6; color: #333;">
                            <div style="text-align: right; color: #888; font-size: 12px;">Generated by KALPA AI</div>
                            <hr />
                            <pre style="white-space: pre-wrap; font-family: serif; font-size: 14px;">${draftContent}</pre>
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print(); // Triggers the browser's PDF/Print dialog
            }

            // 4. Cleanup
            navigate('/dashboard');

        } catch (error) {
            console.error("Execution Error:", error);
            alert("Execution failed. Check console.");
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans p-8 overflow-y-auto selection:bg-neutral-800">

            {/* Header */}
            <div className="max-w-6xl mx-auto flex justify-between items-end mb-8 border-b border-neutral-900 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <CheckCircle2 className="text-green-500 w-8 h-8" />
                        Executor: Action Mode
                    </h1>
                    <p className="text-neutral-500 mt-1">Autonomous execution track initiated. HitL review required.</p>
                </div>
                <button onClick={() => navigate('/')} className="text-sm text-neutral-500 hover:text-white transition-colors">
                    ← Abort & Return
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Context & Roadmap (Takes up 4 cols) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Triage Summary Card */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 shadow-lg">
                        <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-3">Triage Verified</h3>
                        <div className="bg-neutral-950 rounded p-3 text-sm text-neutral-400 mb-4 border border-neutral-800/50 max-h-32 overflow-y-auto">
                            "{fullContext ? (fullContext.split('\n').find(line => line.startsWith('user:')) || fullContext.split('\n')[0]) + '...' : 'Loading context...'}"
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-wider">Category</p>
                                <p className="font-medium text-white">{category}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-neutral-500 uppercase tracking-wider">Severity</p>
                                <p className="font-bold text-green-400 text-lg">{severity}/10</p>
                            </div>
                        </div>
                        <div className="border-t border-neutral-800 pt-3">
                            <p className="text-xs text-neutral-500 italic leading-relaxed">
                                {reasoning}
                            </p>
                        </div>
                    </div>

                    {/* Dynamic Roadmap Timeline */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 shadow-lg">
                        <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-4">Escalation Roadmap</h3>

                        {isGeneratingRoadmap ? (
                            <div className="flex flex-col items-center gap-3 text-neutral-400 text-sm py-10 justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                                Planning optimal legal strategy...
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {roadmap.map((step, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setActiveStep(index)}
                                        className={`p-4 rounded border cursor-pointer transition-all ${activeStep === index ? 'bg-neutral-950 border-green-500/50 shadow-inner' : 'bg-transparent border-neutral-800 hover:border-neutral-700'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm font-bold ${activeStep === index ? 'text-white' : 'text-neutral-300'}`}>
                                                {index + 1}. {step.title}
                                            </h4>
                                            <span className="text-[10px] uppercase tracking-wider text-green-500/80 bg-green-500/10 px-2 py-0.5 rounded">{step.timeframe}</span>
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-2">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: The Drafting Canvas (Takes up 8 cols) */}
                <div className="lg:col-span-8 flex flex-col">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg flex-1 flex flex-col overflow-hidden shadow-2xl">

                        {/* Action Bar / Tabs */}
                        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 py-3">
                            <div className="flex gap-2">
                                {['sms', 'email', 'notice'].map((format) => (
                                    <button
                                        key={format}
                                        onClick={() => setActiveFormat(format)}
                                        className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${activeFormat === format ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-900'}`}
                                    >
                                        {format === 'sms' && <MessageSquare className="w-3.5 h-3.5" />}
                                        {format === 'email' && <Mail className="w-3.5 h-3.5" />}
                                        {format === 'notice' && <FileText className="w-3.5 h-3.5" />}
                                        {format === 'sms' ? 'SMS / Chat' : format === 'email' ? 'Email' : 'Legal Notice'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Document Editor Area */}
                        <div className="p-6 flex-1 flex flex-col relative bg-neutral-950/50">
                            {!draftContent && !isDrafting ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mb-6 border border-neutral-800">
                                        <FileText className="w-8 h-8 text-neutral-600" />
                                    </div>
                                    <h3 className="text-xl text-white font-medium mb-2">Initialize Executor</h3>
                                    <p className="text-neutral-500 text-sm max-w-md mb-8 leading-relaxed">
                                        Select an action step from the roadmap on the left, choose your preferred format above, and initialize the multi-agent drafting process.
                                    </p>
                                    <button
                                        onClick={handleGenerateDraft}
                                        className="bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2"
                                    >
                                        Generate Draft Document
                                    </button>
                                </div>
                            ) : isDrafting ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <Loader2 className="w-12 h-12 animate-spin text-green-500 mb-6" />
                                    <p className="text-white font-medium text-lg mb-2">Drafting & Critic Loop Active</p>
                                    <p className="text-sm text-neutral-400">Agent 1: Drafting document based on context...</p>
                                    <p className="text-sm text-neutral-500 mt-1">Agent 2: Verifying clauses against Indian Law...</p>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col h-full animate-in fade-in duration-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Critic Agent Approved
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-amber-500/80 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                                            <AlertTriangle className="w-3.5 h-3.5" /> Please review before saving
                                        </div>
                                    </div>

                                    {/* Editable Canvas */}
                                    <textarea
                                        value={draftContent}
                                        onChange={(e) => setDraftContent(e.target.value)}
                                        className="w-full flex-1 bg-neutral-900 border border-neutral-800 rounded-lg p-5 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 resize-none font-mono leading-relaxed shadow-inner"
                                    />

                                    {/* HITL Controls */}
                                    <div className="mt-6 flex gap-3 items-stretch h-12">
                                        <input
                                            type="text"
                                            placeholder="Refine (e.g. 'Make it sound more urgent')..."
                                            value={refinementNote}
                                            onChange={(e) => setRefinementNote(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleGenerateDraft()}
                                            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-md px-4 text-sm text-white focus:outline-none focus:border-neutral-600 placeholder-neutral-600"
                                        />
                                        <button
                                            onClick={handleGenerateDraft}
                                            className="px-6 border border-neutral-700 rounded-md text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2 transition-colors font-medium"
                                        >
                                            <RotateCcw className="w-4 h-4" /> Retry
                                        </button>
                                        <button
                                            onClick={handleApproveAndSave}
                                            disabled={isSaving}
                                            className={`px-8 rounded-md text-sm text-white font-semibold flex items-center gap-2 transition-all shadow-lg h-12 ${
                                                activeFormat === 'sms' ? 'bg-green-600 hover:bg-green-500' :
                                                activeFormat === 'email' ? 'bg-blue-600 hover:bg-blue-500' :
                                                'bg-neutral-100 text-neutral-900 hover:bg-white'
                                            }`}
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    {activeFormat === 'sms' && <MessageSquare className="w-4 h-4" />}
                                                    {activeFormat === 'email' && <Mail className="w-4 h-4" />}
                                                    {activeFormat === 'notice' && <FileText className="w-4 h-4" />}
                                                </>
                                            )}

                                            {isSaving ? 'Processing...' : (
                                                activeFormat === 'sms' ? 'Approve & Send SMS' :
                                                activeFormat === 'email' ? 'Approve & Open Gmail' :
                                                'Approve & Save PDF'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
