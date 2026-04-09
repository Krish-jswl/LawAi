import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdvisoryMode from './pages/AdvisoryMode';
import ExecutorMode from './pages/ExecutorMode';
import NavigatorMode from './pages/NavigatorMode';
import Login from './pages/Login'; // <-- 1. IMPORT THE LOGIN PAGE HERE

function App() {
    return (
        <Routes>
            {/* The new Login route */}
            <Route path="/login" element={<Login />} /> {/* <-- 2. ADD THIS ROUTE */}

            {/* The default page when you load localhost:5173/ */}
            <Route path="/" element={<AdvisoryMode />} />

            {/* The Civil Action path */}
            <Route path="/executor" element={<ExecutorMode />} />

            {/* The Criminal/Safety path */}
            <Route path="/navigator" element={<NavigatorMode />} />
        </Routes>
    );
}

export default App;
