"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, MessageSquare, Mail, FileText, RotateCcw, Check, AlertTriangle } from 'lucide-react';
// import { supabase } from '../api/supabaseClient'; // Adjusted for Next.js

import { Header } from "@/components/ui/header-01";
import BackgroundSnippet from "@/components/ui/background-snippets";

export default function ExecutorModePage() {
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
    const [activeFormat, setActiveFormat] = useState('email'); // 'sms', 'email', 'notice'
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roadmap, activeFormat, activeStep]);

    // 2. The Drafting & Critic Agent Loop
    const handleGenerateDraft = async () => {
        setIsDrafting(true);
        try {
            // Mocking the backend API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const mockDrafts: Record<string, string> = {
                sms: `Hi ${entity}, I am writing regarding our recent dispute. Please consider this a request to resolve the matter immediately to avoid further escalation.`,
                email: `Subject: Urgent Resolution Required\n\nTo ${entity},\n\nI am writing to formally address the ongoing issue discussed previously. Please review the terms of our agreement and provide a resolution within 3 business days.\n\nRegards,\n[Your Name]`,
                notice: `LEGAL NOTICE\n\nTo: ${entity}\n\nUnder the provisions of applicable law, you are hereby served notice regarding the failure to uphold obligations...`
            };
            
            const draftBase = mockDrafts[activeFormat] || mockDrafts.email;
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
        <div className="flex flex-col min-h-screen w-full overflow-hidden relative selection:bg-violet-900/50">
            {/* Keeping the Next.js Theme Wrapper */}
            <BackgroundSnippet />
            <Header />
            
            <main className="flex-1 w-full mx-auto p-4 md:p-8 overflow-y-auto z-10 relative mt-20 pb-20">
                {/* Header */}
                <div className="max-w-6xl mx-auto flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
                            <CheckCircle2 className="text-emerald-500 w-8 h-8" />
                            Executor: Action Mode
                        </h1>
                        <p className="text-slate-400 mt-1">Autonomous execution track initiated. HitL review required.</p>
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
                                    <p className="font-bold text-emerald-400 text-lg">{severity}/10</p>
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
                            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Escalation Roadmap</h3>

                            {isGeneratingRoadmap ? (
                                <div className="flex flex-col items-center gap-3 text-slate-400 text-sm py-10 justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                    Planning optimal legal strategy...
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {roadmap.map((step, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setActiveStep(index)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all ${activeStep === index ? 'bg-white/5 border-emerald-500/50 shadow-inner' : 'bg-transparent border-white/10 hover:border-white/20'}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`text-sm font-bold ${activeStep === index ? 'text-white' : 'text-slate-300'}`}>
                                                    {index + 1}. {step.title}
                                                </h4>
                                                <span className="text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-0.5">{step.timeframe}</span>
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
                                    {['sms', 'email', 'notice'].map((format) => (
                                        <button
                                            key={format}
                                            onClick={() => setActiveFormat(format)}
                                            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${activeFormat === format ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:bg-white/10'}`}
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
                            <div className="p-6 flex-1 flex flex-col relative bg-transparent">
                                {!draftContent && !isDrafting ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                                            <FileText className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <h3 className="text-xl text-white font-medium mb-2">Initialize Executor</h3>
                                        <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
                                            Select an action step from the roadmap on the left, choose your preferred format above, and initialize the multi-agent drafting process.
                                        </p>
                                        <button
                                            onClick={handleGenerateDraft}
                                            className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2"
                                        >
                                            Generate Draft Document
                                        </button>
                                    </div>
                                ) : isDrafting ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                                        <Loader2 className="w-12 h-12 animate-spin text-violet-500 mb-6" />
                                        <p className="text-white font-medium text-lg mb-2">Drafting & Critic Loop Active</p>
                                        <p className="text-sm text-slate-400">Agent 1: Drafting document based on context...</p>
                                        <p className="text-sm text-slate-500 mt-1">Agent 2: Verifying clauses against Indian Law...</p>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col h-full animate-in fade-in duration-500">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
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
                                            className="w-full flex-1 bg-black/40 border border-white/10 rounded-xl p-5 text-sm text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none font-sans leading-relaxed shadow-inner min-h-[300px]"
                                        />

                                        {/* HITL Controls */}
                                        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:h-12">
                                            <input
                                                type="text"
                                                placeholder="Refine (e.g. 'Make it sound more urgent')..."
                                                value={refinementNote}
                                                onChange={(e) => setRefinementNote(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleGenerateDraft()}
                                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 placeholder-slate-500"
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
                                                className="px-8 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 disabled:cursor-not-allowed rounded-lg text-sm text-white font-semibold flex items-center justify-center gap-2 transition-colors"
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
