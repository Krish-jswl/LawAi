import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient'; // Adjust path if needed
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            let error;
            if (isLogin) {
                // Log in existing user
                const response = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                error = response.error;
            } else {
                // Sign up new user
                const response = await supabase.auth.signUp({
                    email,
                    password,
                });
                error = response.error;

                if (!error) {
                    alert("Signup successful! You can now log in.");
                    setIsLogin(true); // Switch to login view
                    setLoading(false);
                    return;
                }
            }

            if (error) throw error;

            // If successful, redirect to the main app!
            navigate('/');

        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 font-sans text-white">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <ShieldAlert className="w-12 h-12 text-white mb-4" />
                    <h1 className="text-2xl font-bold tracking-widest uppercase">KALPA AI</h1>
                    <p className="text-neutral-500 text-sm mt-1">Autonomous Legal Navigator</p>
                </div>

                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded mb-6 text-sm">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-neutral-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-neutral-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-neutral-950 font-bold py-3 rounded hover:bg-neutral-200 transition-colors uppercase tracking-widest text-sm flex justify-center items-center gap-2 mt-4"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Access System' : 'Create Account')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-neutral-500 hover:text-white text-sm transition-colors"
                    >
                        {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
                    </button>
                </div>
            </div>
        </div>
    );
}
