import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient'; // Make sure this path is correct!

export default function ExecutorMode() {
    const location = useLocation();
    const navigate = useNavigate();

    // Catch the hidden payload sent from AdvisoryMode
    const { entity, fullContext, caseId } = location.state || {};

    // New state to hold the full document text fetched from Supabase
    const [documentText, setDocumentText] = useState(null);
    const [isLoadingDoc, setIsLoadingDoc] = useState(false);

    // Fetch the hidden document text from Supabase when the page loads
    useEffect(() => {
        async function fetchCaseDetails() {
            setIsLoadingDoc(true);
            try {
                const { data, error } = await supabase
                    .from('cases')
                    .select('document_text')
                    .eq('id', caseId)
                    .single();

                if (error) {
                    console.error("Error fetching document text:", error);
                } else if (data && data.document_text) {
                    setDocumentText(data.document_text);
                }
            } catch (err) {
                console.error("Failed to fetch from Supabase:", err);
            } finally {
                setIsLoadingDoc(false);
            }
        }

        // Only run the fetch if we actually have a caseId from the previous screen
        if (caseId) {
            fetchCaseDetails();
        }
    }, [caseId]);

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-10 font-sans">
            <h1 className="text-3xl font-bold mb-4 border-b border-neutral-800 pb-2">KALPA AI / Executor Mode</h1>

            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 shadow-xl">
                <h2 className="text-xl text-green-400 mb-4 flex items-center gap-2">
                    ✅ Handoff Successful!
                </h2>

                {/* Meta Data Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-neutral-950 p-4 rounded border border-neutral-800">
                        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1 font-semibold">Target Entity</p>
                        <p className="font-medium text-neutral-200">{entity || 'Not identified'}</p>
                    </div>
                    <div className="bg-neutral-950 p-4 rounded border border-neutral-800">
                        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1 font-semibold">Supabase Case ID</p>
                        <p className="font-mono text-sm text-neutral-400 break-all">{caseId || 'Not synced'}</p>
                    </div>
                </div>

                {/* 1. The Summary */}
                <h3 className="mt-6 mb-2 text-neutral-300 font-semibold border-b border-neutral-800 pb-1">1. User Conversation Context:</h3>
                <pre className="bg-neutral-950 p-4 rounded text-sm text-neutral-400 overflow-auto max-h-48 border border-neutral-800 whitespace-pre-wrap">
                    {fullContext || 'No context found. Did you come from Advisory Mode?'}
                </pre>

                {/* 2. The Raw Contract */}
                <h3 className="mt-6 mb-2 text-neutral-300 font-semibold border-b border-neutral-800 pb-1">2. Full Raw Document (Hidden Pocket):</h3>
                <div className="bg-neutral-950 p-4 rounded text-sm text-neutral-500 overflow-auto max-h-48 border border-neutral-800 whitespace-pre-wrap">
                    {isLoadingDoc ? (
                        <span className="animate-pulse text-neutral-400">Fetching original contract from secure storage...</span>
                    ) : documentText ? (
                        documentText
                    ) : (
                        <span className="italic">No attached document found for this case.</span>
                    )}
                </div>

                <p className="mt-6 text-xs text-neutral-500 uppercase tracking-widest text-center">
                    System Ready for Drafting Agent Injection
                </p>
            </div>

            <button
                onClick={() => navigate('/')}
                className="mt-6 bg-neutral-200 text-neutral-950 font-medium px-6 py-2 rounded hover:bg-white transition-colors"
            >
                ← Back to Advisory Mode
            </button>
        </div>
    );
}