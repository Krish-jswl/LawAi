import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Send, FileText, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient'; // Ensure you created this file!

export default function AdvisoryMode() {
    const navigate = useNavigate();

    // State Management
    const [selectedFile, setSelectedFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [chatHistory, setChatHistory] = useState([
        { role: 'assistant', content: 'Describe your legal issue below, or upload a document/image to begin analysis.' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTriaging, setIsTriaging] = useState(false);
    const [caseId, setCaseId] = useState(null); // Supabase tracking ID

    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => { scrollToBottom(); }, [chatHistory]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
            setSelectedFile(file);
            setPdfUrl(URL.createObjectURL(file));
            setChatHistory([{ role: 'assistant', content: 'File loaded. What specific risks or clauses would you like me to analyze?' }]);
        } else {
            alert("Please upload a valid PDF or Image document.");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = inputText;
        setInputText('');

        // 1. Update UI immediately
        const updatedChatForUser = [...chatHistory, { role: 'user', content: userMessage }];
        setChatHistory(updatedChatForUser);
        setIsLoading(true);

        const formData = new FormData();
        if (selectedFile) formData.append('document', selectedFile);
        formData.append('question', userMessage);

        try {
            // 2. Get AI Response
            const response = await fetch('/api/chat/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            // 3. Compile the final chat array
            const finalChatHistory = data.status === 'success'
                ? [...updatedChatForUser, { role: 'assistant', content: data.answer }]
                : [...updatedChatForUser, { role: 'assistant', content: `Error: ${data.error}` }];

            setChatHistory(finalChatHistory);

            // 4. Supabase Sync (Memory Track)

            // 4a. Prepare the payload dynamically
            const dbPayload = { chat_history: finalChatHistory };

            // 4b. If the backend sent us document text, attach it to the payload!
            if (data.documentText) {
                dbPayload.document_text = data.documentText;
            }

            if (!caseId) {
                // First message? Create a new case
                const { data: newCase, error } = await supabase
                    .from('cases')
                    .insert([dbPayload])
                    .select()
                    .single();

                if (error) console.error("Supabase Insert Error:", error);
                if (newCase) setCaseId(newCase.id);
            } else {
                // Existing case? Update the chat array AND the document text if we just received it
                const { error } = await supabase
                    .from('cases')
                    .update(dbPayload)
                    .eq('id', caseId);

                if (error) console.error("Supabase Update Error:", error);
            }

        } catch (error) {
            console.error("API Error:", error);
            setChatHistory(prev => [...prev, { role: 'assistant', content: 'Network failure: Unable to reach the KALPA AI orchestration server.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConvertToAction = async () => {
        // Prevent clicking if there is no chat history to analyze
        if (chatHistory.length <= 1) {
            alert("Please describe your issue or chat with KALPA before converting to an action path.");
            return;
        }

        setIsTriaging(true);

        // Compile the chat history
        const conversationTranscript = chatHistory
            .map(msg => `${msg.role}: ${msg.content}`)
            .join('\n');

        try {
            // Send to the Triage API
            const response = await fetch('/api/execute/triage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context: conversationTranscript })
            });

            if (!response.ok) throw new Error("Triage API failed");

            const triageData = await response.json();

            // Bifurcation Routing
            if (triageData.severity === 'civil') {
                navigate('/executor', {
                    state: {
                        entity: triageData.entity,
                        fullContext: conversationTranscript,
                        caseId: caseId // Pass the case ID to the next screen!
                    }
                });
            } else {
                navigate('/navigator', {
                    state: {
                        fullContext: conversationTranscript,
                        caseId: caseId
                    }
                });
            }
        } catch (error) {
            console.error("Triage routing failed:", error);
            alert("Failed to analyze the action path. Please ensure the backend triage route is running.");
        } finally {
            setIsTriaging(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-neutral-800">

            {/* Header */}
            <header className="flex items-center px-6 py-4 border-b border-neutral-900 bg-neutral-950 shadow-sm z-10">
                <h1 className="text-sm tracking-widest font-semibold text-neutral-400 uppercase">KALPA <span className="text-neutral-600">/</span> Advisory Mode</h1>
            </header>

            {/* Main Split Layout */}
            <div className="flex flex-1 overflow-hidden">

                {/* Left Pane: Document Viewer (60%) */}
                <div className="w-[60%] h-full border-r border-neutral-900 bg-neutral-950 relative flex flex-col">
                    {!selectedFile ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="border border-dashed border-neutral-800 rounded-lg p-12 w-full max-w-md bg-neutral-900/50 hover:bg-neutral-900 transition-colors group cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="application/pdf, image/png, image/jpeg, image/jpg"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <UploadCloud className="w-10 h-10 mx-auto mb-4 text-neutral-500 group-hover:text-neutral-400 transition-colors" />
                                <h3 className="text-neutral-300 font-medium mb-1">Upload a legal document or photo</h3>
                                <p className="text-sm text-neutral-600">Supported formats: .pdf, .png, .jpg, .jpeg</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 w-full h-full bg-neutral-900 p-4">
                            {selectedFile.type.startsWith('image/') ? (
                                <img
                                    src={pdfUrl}
                                    alt="Uploaded Document"
                                    className="w-full h-full object-contain border border-neutral-800 rounded-sm bg-neutral-900"
                                />
                            ) : (
                                <iframe
                                    src={pdfUrl}
                                    title="Legal Document Viewer"
                                    className="w-full h-full border border-neutral-800 rounded-sm bg-white"
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Right Pane: Chat Interface (40%) */}
                <div className="w-[40%] h-full flex flex-col bg-neutral-950">

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800">
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-md p-4 text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-neutral-800 text-neutral-100 border border-neutral-700'
                                    : 'bg-transparent border border-neutral-900 text-neutral-300 prose prose-invert prose-sm max-w-none'
                                    }`}>
                                    {msg.role === 'assistant' && <FileText className="w-4 h-4 mb-2 text-neutral-500 inline-block mr-2" />}
                                    {msg.role === 'assistant' ? (
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[85%] rounded-md p-4 bg-transparent border border-neutral-900 text-neutral-500 flex items-center gap-3">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm uppercase tracking-wider text-xs">Analyzing Clause Vectors...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-neutral-950 border-t border-neutral-900">
                        <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                                placeholder={selectedFile ? "Query this document..." : "Describe your legal issue or upload a file..."}
                                disabled={isLoading || isTriaging}
                                rows={1}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-md py-3 px-4 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 resize-none min-h-[50px] max-h-[150px]"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || isTriaging || !inputText.trim()}
                                className="bg-neutral-200 hover:bg-white text-neutral-950 px-4 py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-[50px]"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                        <div className="text-center mt-3">
                            <button
                                onClick={handleConvertToAction}
                                disabled={isTriaging || isLoading}
                                className="text-xs text-neutral-500 hover:text-neutral-300 uppercase tracking-widest font-semibold border-b border-transparent hover:border-neutral-500 transition-all flex items-center justify-center mx-auto gap-2 disabled:opacity-50"
                            >
                                {isTriaging && <Loader2 className="w-3 h-3 animate-spin" />}
                                {isTriaging ? 'Triaging...' : 'Convert to Action Path'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}