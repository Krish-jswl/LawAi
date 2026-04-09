"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, ShieldCheck, Loader2, RefreshCw, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function InsuranceCard({
  initialComplaint,
  legalCategory,
  severityScore,
  isExecutable,
  aiReasoning,
  executionSteps,
  isDraftingCanvas,
  draftContent: externalDraft,
  setDraftContent: externalSetDraft,
  activeTab: externalTab,
}: {
  initialComplaint?: string;
  legalCategory?: string;
  severityScore?: number;
  isExecutable?: boolean;
  aiReasoning?: string;
  executionSteps?: string;
  isDraftingCanvas?: boolean;
  draftContent?: string;
  setDraftContent?: (val: string) => void;
  activeTab?: "informal" | "email" | "legal";
} = {}) {
  const [copied, setCopied] = useState(false);
  const isOriginalIssue = !!initialComplaint;
  const isProgressIndicator = !!executionSteps;
  
  // Drafting Canvas specific state
  const [internalTab, setInternalTab] = useState<"informal" | "email" | "legal">("informal");
  const currentTab = externalTab || internalTab;
  
  const [internalDraft, setInternalDraft] = useState("Hi there,\n\nJust reaching out to kindly request that you address the pending rent payment from the last three months. Please let me know when we can expect this to be resolved.\n\nBest,\nAniket");
  const draftContent = externalDraft ?? internalDraft;
  const setDraftContent = externalSetDraft || setInternalDraft;

  const [refinement, setRefinement] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  
  useEffect(() => {
    if (isDraftingCanvas && !externalDraft) {
      if (currentTab === "email") setInternalDraft("Subject: Urgent: Overdue Rent Payment Notice\n\nDear Tenant,\n\nThis formal email serves as a notice regarding your overdue rent for the past three months. Immediate payment is required to avoid further consequences.\n\nSincerely,\nManagement");
      else if (currentTab === "legal") setInternalDraft("NOTICE TO QUIT\n\nTO: Tenant\n\nPLEASE TAKE NOTICE that your rent is strictly overdue. You are hereby legally notified that failure to comply within 15 days will result in formal eviction proceedings under the standard jurisdiction.");
      else setInternalDraft("Hi there,\n\nJust reaching out to kindly request that you address the pending rent payment from the last three months. Please let me know when we can expect this to be resolved.\n\nBest,\nAniket");
      setIsApproved(false);
    }
  }, [currentTab, isDraftingCanvas, externalDraft]);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setDraftContent("Based on: '" + refinement + "'\n\n" + draftContent);
      setIsGenerating(false);
      setRefinement("");
    }, 1500);
  };

  const policyNumber = legalCategory || "POL-2024-9X82T";

  const handleCopy = () => {
    navigator.clipboard.writeText(policyNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="border-white/10 bg-black/60 backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-6 bg-gradient-to-br from-violet-500/10 to-transparent border-b border-white/5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {isDraftingCanvas 
                    ? "The Drafting Canvas & HITL"
                    : isProgressIndicator 
                    ? "Progress Indicator" 
                    : isOriginalIssue 
                    ? "Original Issue Context" 
                    : "Active Policy"}
                </h3>
              </div>
            </div>
            {isDraftingCanvas || isProgressIndicator ? null : isOriginalIssue ? (
              <p className="text-sm text-muted-foreground max-w-xs line-clamp-2 text-right">
                {initialComplaint}
              </p>
            ) : (
              <div className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {isDraftingCanvas ? (
            <div className="space-y-4">
              {/* Tabs */}
              <div className="flex gap-2 border-b border-white/10 pb-3">
                {(['informal', 'email', 'legal'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => { externalSetDraft ? undefined : setInternalTab(tab) }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${currentTab === tab ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
                  >
                    {tab === 'informal' ? 'Informal Message' : tab === 'email' ? 'Formal Email' : 'Legal Notice'}
                  </button>
                ))}
              </div>

              {/* Critic Agent Badge */}
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium pt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                Critic Agent Verified (Aligned with Indian Law & Uploaded Docs)
              </div>

              {/* Draft Viewer Main Area */}
              <div className="relative mt-2">
                <textarea
                  className="w-full h-48 rounded-lg border border-white/10 bg-black/40 p-4 text-sm leading-relaxed text-slate-300 resize-none focus:outline-none focus:border-violet-500 transition-colors"
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  disabled={isApproved || isGenerating}
                />
                <AnimatePresence>
                  {isGenerating && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col gap-3 items-center justify-center rounded-lg border border-violet-500/30"
                    >
                      <Loader2 className="h-6 w-6 text-violet-400 animate-spin" />
                      <span className="text-xs text-violet-300 font-medium">Refining draft...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* HITL Action Bar */}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/5">
                <input
                  type="text"
                  placeholder="Refine tone (e.g., Make it more urgent...)"
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-50"
                  value={refinement}
                  onChange={(e) => setRefinement(e.target.value)}
                  disabled={isApproved || isGenerating}
                  onKeyDown={(e) => e.key === 'Enter' && refinement.trim() && !isApproved && !isGenerating && handleRegenerate()}
                />
                
                <div className="flex gap-3 justify-end mt-2">
                  <Button 
                    variant="outline" 
                    onClick={handleRegenerate}
                    disabled={isApproved || isGenerating || !refinement.trim()}
                    className="bg-transparent border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry / Regenerate
                  </Button>
                  <Button 
                    onClick={() => setIsApproved(true)}
                    disabled={isApproved || isGenerating}
                    className="bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                  >
                    {isApproved ? <Check className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                    {isApproved ? "Approved & Saved" : "Approve & Save"}
                  </Button>
                </div>
              </div>
            </div>
          ) : isProgressIndicator ? (
            <div className="bg-white/5 rounded-lg border border-white/10 p-4 space-y-3 mt-2">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                Execution Plan
              </p>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line tracking-normal">
                {executionSteps}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {isOriginalIssue ? "LEGAL CATEGORY" : "Policy Number"}
                </p>
                <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-lg p-3">
                  <span className="font-mono text-sm tracking-widest text-slate-300">{policyNumber}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {isOriginalIssue ? "SEVERITY SCORE" : "Effective Date"}
                  </p>
                  <p className="text-sm text-white">
                    {isOriginalIssue ? `${severityScore}/10` : "Oct 15, 2024"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {isOriginalIssue ? "STATUS BADGE" : "Expiration"}
                  </p>
                  {isOriginalIssue ? (
                    isExecutable ? (
                      <span className="text-emerald-400 font-medium text-sm">Execution Allowed</span>
                    ) : (
                      <span className="text-red-400 font-medium text-sm">Execution Blocked</span>
                    )
                  ) : (
                    <p className="text-sm text-white">Oct 15, 2025</p>
                  )}
                </div>
              </div>

              {isOriginalIssue ? (
                <div className="space-y-2 border-t border-white/5 pt-4 pb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    AI Reasoning
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed max-w-prose">
                    {aiReasoning}
                  </p>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/5 pb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Insured Driver</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarImage src="https://i.pravatar.cc/150?img=11" />
                        <AvatarFallback className="bg-slate-800 text-white">AS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">Aniket Singh</p>
                        <p className="text-xs text-slate-400">Primary Holder</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : 10 }}
        className="mt-4 pointer-events-none"
      >
        <div className="mx-auto w-fit bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-2 shadow-lg backdrop-blur-sm">
          <Check className="h-3.5 w-3.5" />
          Copied to clipboard
        </div>
      </motion.div>
    </motion.div>
  );
}

const FileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
);
