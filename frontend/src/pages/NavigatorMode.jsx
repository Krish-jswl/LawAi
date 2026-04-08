import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NavigatorMode() {
    const location = useLocation();
    const navigate = useNavigate();
    const { fullContext, caseId } = location.state || {};

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-10 font-sans">
            <h1 className="text-3xl font-bold mb-4 border-b border-neutral-800 pb-2 text-red-500">KALPA AI / Navigator Mode</h1>
            <p className="text-neutral-400 max-w-2xl">
                This issue has been flagged as a serious criminal matter. Digital execution is disabled for user safety. Please refer to the offline paperwork generators and the Bharatiya Nyaya Sanhita (BNS) guidelines below.
            </p>
            <button
                onClick={() => navigate('/')}
                className="mt-6 bg-neutral-800 border border-neutral-700 text-white px-4 py-2 rounded hover:bg-neutral-700"
            >
                ← Back to Advisory Mode
            </button>
        </div>
    );
}