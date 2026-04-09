"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, RotateCcw, Check, AlertTriangle, FileText, ShieldAlert, FileSearch, Navigation } from 'lucide-react';
// import { supabase } from '../api/supabaseClient'; // Adjusted for Next.js

import { Header } from "@/components/ui/header-01";
import BackgroundSnippet from "@/components/ui/background-snippets";

export default function NavigatorModePage() {
    const router = useRouter();

    // Catch data from Triage Route (Mock fallback for Next.js demo)
    const entity = 'Unknown Entity';
    const fullContext = 'The tenant has repeatedly failed to pay rent on time for the past three months despite multiple notices.';
    const caseId = null;
    const severity = 8.5;
    const category = 'Rent Dispute';
    const reasoning = 'The issue has been classified as non-compliance based on rent patterns.';

    // --- Agent States ---
    const [roadmap, setRoadmap] = useState<{title: string; timeframe: string; description: string}[]>([]);
    const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(true);

    const [draftContent, setDraftContent] = useState('');
    const [isDrafting, setIsDrafting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // --- UI Interaction States ---
    const [activeStep, setActiveStep] = useState(0);
    const [activeFormat, setActiveFormat] = useState('complaint'); // 'complaint', 'fir', 'evidence'
    const [refinementNote, setRefinementNote] = useState('');

    // Kick back to home if no context is found (disabled the redirect for demo)
    /*
    useEffect(() => {
        if (!fullContext) {
            router.push('/');
        }
    }, [fullContext, router]);
    */

    // 1. The Roadmap Agent (Fires on Load)
    useEffect(() => {
        async function fetchDynamicRoadmap() {
            setIsGeneratingRoadmap(true);
            try {
                // Mocking the backend API delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // SAFE DEMO FALLBACK
                setRoadmap([
                    { title: "Initial Complaint Filing", timeframe: "Immediate", description: "Formalize the grievance for the record." },
                    { title: "FIR Preparation", timeframe: "Within 48 Hours", description: "Draft the First Information Report to submit to authorities." },
                    { title: "Evidence Compilation", timeframe: "Week 1", description: "Collate and annotate all substantiating documentation." }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roadmap, activeFormat, activeStep]);

    // 2. The Drafting & Critic Agent Loop
    const handleGenerateDraft = async () => {
        setIsDrafting(true);
        try {
            // Mocking the backend API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const mockDrafts: Record<string, string> = {
                complaint: `FORMAL COMPLAINT\n\nTo the concerned authorities,\n\nI am writing to officially register a complaint regarding ${entity}. The following context outlines the series of events that transpired...`,
                fir: `FIRST INFORMATION REPORT (DRAFT)\n\nJurisdiction / Station: [To be assigned]\nComplainant: [Your Name]\nAccused: ${entity}\n\nDetails of the Offence:\nBased on the context provided, the accused has willfully defaulted...`,
                evidence: `EVIDENCE LOG / ANNOTATION SHEET\n\nCase reference: against ${entity}\n\nItem 1: Financial ledgers\nDescription: Bank statements indicating a clear gap in standard transactions over the past 3 months...`
            };
            
            const draftBase = mockDrafts[activeFormat] || mockDrafts.complaint;
            setDraftContent(refinementNote ? `[Applied refinement: ${refinementNote}]\n\n${draftBase}` : draftBase);

        } finally {
            setIsDrafting(false);
            setRefinementNote(''); 
        }
    };

    // 3. Human in the Loop (Approve & Save)
    const handleApproveAndSave = async () => {
        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Navigate to the dashboard after successful save
            router.push('/');
        } catch (error) {
            console.error("Save Error:", error);
            alert("Failed to save to database. Check console.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen w-full overflow-hidden relative selection:bg-red-900/50">
            {/* Theme Wrapper */}
            <BackgroundSnippet />
            <Header />
            
            <main className="flex-1 w-full mx-auto p-4 md:p-8 overflow-y-auto z-10 relative mt-20 pb-20">
                {/* Header */}
                <div className="max-w-6xl mx-auto flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
                            <Navigation className="text-red-500 w-8 h-8 fill-red-500/20" />
                            Navigator Mode
                        </h1>
                        <p className="text-slate-400 mt-1">Autonomous intelligence guiding legal preparation. HitL review required.</p>
                    </div>
                    <button onClick={() => router.push('/')} className="text-sm text-slate-500 hover:text-white transition-colors">
                        ← Abort & Return
                    </button>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Context & Roadmap */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Triage Summary Card */}
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
                            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">Triage Verified</h3>
                            <div className="bg-white/5 rounded-lg p-3 text-sm text-slate-300 mb-4 border border-white/10 max-h-32 overflow-y-auto">
                                "{fullContext ? (fullContext.split('\n').find(line => line.startsWith('user:')) || fullContext.split('\n')[0]) + '...' : 'Loading context...'}"
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Category</p>
                                    <p className="font-medium text-white">{category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Severity</p>
                                    <p className="font-bold text-red-500 text-lg">{severity}/10</p>
                                </div>
                            </div>
                            <div className="border-t border-white/10 pt-3">
                                <p className="text-xs text-slate-400 italic leading-relaxed">
                                    {reasoning}
                                </p>
                            </div>
                        </div>

                        {/* Dynamic Roadmap Timeline */}
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
                            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Action Pipeline</h3>

                            {isGeneratingRoadmap ? (
                                <div className="flex flex-col items-center gap-3 text-slate-400 text-sm py-10 justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                                    Planning optimal legal strategy...
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {roadmap.map((step, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setActiveStep(index)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all ${activeStep === index ? 'bg-white/5 border-red-500/50 shadow-inner' : 'bg-transparent border-white/10 hover:border-white/20'}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`text-sm font-bold ${activeStep === index ? 'text-white' : 'text-slate-300'}`}>
                                                    {index + 1}. {step.title}
                                                </h4>
                                                <span className="text-[10px] uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full mt-0.5">{step.timeframe}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-2">{step.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Drafting Canvas */}
                    <div className="lg:col-span-8 flex flex-col">
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl">

                            {/* Action Bar / Tabs */}
                            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                                <div className="flex gap-2">
                                    {['complaint', 'fir', 'evidence'].map((format) => (
                                        <button
                                            key={format}
                                            onClick={() => setActiveFormat(format)}
                                            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${activeFormat === format ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:bg-white/10'}`}
                                        >
                                            {format === 'complaint' && <FileText className="w-3.5 h-3.5" />}
                                            {format === 'fir' && <ShieldAlert className="w-3.5 h-3.5" />}
                                            {format === 'evidence' && <FileSearch className="w-3.5 h-3.5" />}
                                            {format === 'complaint' ? 'Complaint' : format === 'fir' ? 'FIR' : 'Evidence'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Document Editor Area */}
                            <div className="p-6 flex-1 flex flex-col relative bg-transparent">
                                {!draftContent && !isDrafting ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                                            <Navigation className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <h3 className="text-xl text-white font-medium mb-2">Initialize Navigator</h3>
                                        <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
                                            Select an action step from the roadmap on the left, choose your preferred format above, and initialize the multi-agent preparation process.
                                        </p>
                                        <button
                                            onClick={handleGenerateDraft}
                                            className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2"
                                        >
                                            Generate Preparation Document
                                        </button>
                                    </div>
                                ) : isDrafting ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                                        <Loader2 className="w-12 h-12 animate-spin text-red-500 mb-6" />
                                        <p className="text-white font-medium text-lg mb-2">Navigator & Critic Loop Active</p>
                                        <p className="text-sm text-slate-400">Agent 1: Aligning legal document format...</p>
                                        <p className="text-sm text-slate-500 mt-1">Agent 2: Verifying constraints against Supreme Court rulings...</p>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col h-full animate-in fade-in duration-500">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Critic Agent Approved
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-amber-500/80 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                                                <AlertTriangle className="w-3.5 h-3.5" /> Please review before finalizing
                                            </div>
                                        </div>

                                        {/* Editable Canvas */}
                                        <textarea
                                            value={draftContent}
                                            onChange={(e) => setDraftContent(e.target.value)}
                                            className="w-full flex-1 bg-black/40 border border-white/10 rounded-xl p-5 text-sm text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none font-sans leading-relaxed shadow-inner min-h-[300px]"
                                        />

                                        {/* HITL Controls */}
                                        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:h-12">
                                            <input
                                                type="text"
                                                placeholder="Refine (e.g. 'Ensure specific penal code is mentioned')..."
                                                value={refinementNote}
                                                onChange={(e) => setRefinementNote(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleGenerateDraft()}
                                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 placeholder-slate-500"
                                            />
                                            <button
                                                onClick={handleGenerateDraft}
                                                className="px-6 py-2 border border-white/10 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center justify-center gap-2 transition-colors font-medium"
                                            >
                                                <RotateCcw className="w-4 h-4" /> Retry
                                            </button>
                                            <button
                                                onClick={handleApproveAndSave}
                                                disabled={isSaving}
                                                className="px-8 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed rounded-lg text-sm text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                                            >
                                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                {isSaving ? 'Saving...' : 'Approve & Save'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
