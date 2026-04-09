import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert, FileText, AlertTriangle, RotateCcw, Check, FileWarning, ClipboardList } from 'lucide-react';
import { supabase } from '../api/supabaseClient';

export default function NavigatorMode() {
    const location = useLocation();
    const navigate = useNavigate();

    // Catch data from Triage Route 
    const {
        entity = 'Unknown Entity',
        fullContext = '',
        caseId = null,
        severity = 0,
        category = 'Criminal / Severe Issue',
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
    const [activeFormat, setActiveFormat] = useState('complaint'); // 'complaint', 'fir', 'evidence'
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
                setRoadmap([
                    { title: "Preserve All Evidence", timeframe: "Immediate", description: "Take screenshots of all communications. Do not confront the entity directly." },
                    { title: "Draft Formal Police Complaint", timeframe: "Within 24 Hours", description: "Prepare a written complaint detailing the timeline of events and BNS violations." },
                    { title: "File FIR at Local Station", timeframe: "Within 48 Hours", description: "Visit the nearest jurisdictional police station with your drafted complaint." }
                ]);
            } finally {
                setIsGeneratingRoadmap(false);
            }
        }

        if (fullContext) fetchDynamicRoadmap();
    }, [fullContext, category]);

    // Auto-Trigger Drafting Agent on Load, Tab Change, or Step Change
    useEffect(() => {
        if (roadmap.length > 0 && !isDrafting) {
            handleGenerateDraft();
        }
    }, [roadmap, activeFormat]);

    // 2. The Drafting & Critic Agent Loop
    const handleGenerateDraft = async () => {
        setIsDrafting(true);
        try {
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
            setTimeout(() => {
                const mockDrafts = {
                    complaint: `To,\nThe Station House Officer (SHO),\n[Name of Police Station],\n[City/District]\n\nSubject: Formal Complaint regarding criminal intimidation and harassment by ${entity}.\n\nRespected Sir/Madam,\n\nI am writing to formally report severe misconduct and potential violations of the Bharatiya Nyaya Sanhita...`,
                    fir: `FIR PREPARATION SHEET\n\n- Complainant Name: [Your Name]\n- Accused Entity: ${entity}\n- Date of Incident: [Date]\n- Location: [Location]\n\nSummary of Facts for Police Officer:\n1. On [Date], the accused...\n2. Evidence available includes...`,
                    evidence: `EVIDENCE PRESERVATION CHECKLIST\n\n[ ] Screenshot all WhatsApp/SMS chats with ${entity}.\n[ ] Backup all audio/call recordings.\n[ ] Do not delete any emails.\n[ ] Identify 2 potential witnesses.`
                };
                setDraftContent(mockDrafts[activeFormat] || mockDrafts.complaint);
            }, 2000);
        } finally {
            setIsDrafting(false);
            setRefinementNote('');
        }
    };

    // 3. Human in the Loop (Approve & Save)
    const handleApproveAndSave = async () => {
        if (!caseId) {
            alert("No active case ID found. Cannot save to database.");
            return;
        }

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('cases')
                .update({
                    status: 'Offline Action Required',
                    final_document: draftContent,
                    target_entity: entity
                })
                .eq('id', caseId);

            if (error) throw error;
            navigate('/dashboard');

        } catch (error) {
            console.error("Supabase Save Error:", error);
            alert("Failed to save to database.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans p-8 overflow-y-auto selection:bg-red-900">

            {/* Header */}
            <div className="max-w-6xl mx-auto flex justify-between items-end mb-8 border-b border-neutral-900 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-red-500 flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8" />
                        Navigator: Safety Mode
                    </h1>
                    <p className="text-neutral-400 mt-1 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Digital execution locked due to severity. Follow offline safety protocols.
                    </p>
                </div>
                <button onClick={() => navigate('/')} className="text-sm text-neutral-500 hover:text-white transition-colors">
                    ← Abort & Return
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Context & Roadmap */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Triage Summary Card */}
                    <div className="bg-neutral-900 border border-red-900/30 rounded-lg p-5 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                        <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-3">Triage Verified (High Severity)</h3>
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
                                <p className="font-bold text-red-500 text-lg">{severity}/10</p>
                            </div>
                        </div>
                        <div className="border-t border-neutral-800 pt-3">
                            <p className="text-xs text-red-400/80 italic leading-relaxed">
                                {reasoning}
                            </p>
                        </div>
                    </div>

                    {/* Dynamic Roadmap Timeline */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 shadow-lg">
                        <h3 className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-4">Offline Escalation Roadmap</h3>

                        {isGeneratingRoadmap ? (
                            <div className="flex flex-col items-center gap-3 text-neutral-400 text-sm py-10 justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                                Analyzing safety protocols...
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {roadmap.map((step, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setActiveStep(index)}
                                        className={`p-4 rounded border cursor-pointer transition-all ${activeStep === index ? 'bg-neutral-950 border-red-500/50 shadow-inner' : 'bg-transparent border-neutral-800 hover:border-neutral-700'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm font-bold ${activeStep === index ? 'text-white' : 'text-neutral-300'}`}>
                                                {index + 1}. {step.title}
                                            </h4>
                                            <span className="text-[10px] uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded">{step.timeframe}</span>
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-2">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: The Drafting Canvas */}
                <div className="lg:col-span-8 flex flex-col">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg flex-1 flex flex-col overflow-hidden shadow-2xl">

                        {/* Action Bar / Tabs */}
                        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 py-3">
                            <div className="flex gap-2">
                                {['complaint', 'fir', 'evidence'].map((format) => (
                                    <button
                                        key={format}
                                        onClick={() => setActiveFormat(format)}
                                        className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${activeFormat === format ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-900'}`}
                                    >
                                        {format === 'complaint' && <FileWarning className="w-3.5 h-3.5 text-red-400" />}
                                        {format === 'fir' && <FileText className="w-3.5 h-3.5" />}
                                        {format === 'evidence' && <ClipboardList className="w-3.5 h-3.5" />}
                                        {format === 'complaint' ? 'Police Complaint' : format === 'fir' ? 'FIR Summary' : 'Evidence Checklist'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Document Editor Area */}
                        <div className="p-6 flex-1 flex flex-col relative bg-neutral-950/50">
                            {isDrafting ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <Loader2 className="w-12 h-12 animate-spin text-red-500 mb-6" />
                                    <p className="text-white font-medium text-lg mb-2">Preparing Official Documentation</p>
                                    <p className="text-sm text-neutral-400">Agent 1: Drafting based on Bharatiya Nyaya Sanhita...</p>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col h-full animate-in fade-in duration-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                                            <ShieldAlert className="w-3.5 h-3.5" /> For Offline Submission Only
                                        </div>
                                    </div>

                                    {/* Editable Canvas */}
                                    <textarea
                                        value={draftContent}
                                        onChange={(e) => setDraftContent(e.target.value)}
                                        className="w-full flex-1 bg-neutral-900 border border-neutral-800 rounded-lg p-5 text-sm text-neutral-200 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 resize-none font-mono leading-relaxed shadow-inner"
                                    />

                                    {/* HITL Controls */}
                                    <div className="mt-6 flex gap-3 items-stretch h-12">
                                        <input
                                            type="text"
                                            placeholder="Refine draft (e.g. 'Add that they threatened me yesterday')..."
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
                                            className="px-8 bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed rounded-md text-sm text-white font-semibold flex items-center gap-2 transition-colors"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            {isSaving ? 'Saving...' : 'Approve & Save Document'}
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