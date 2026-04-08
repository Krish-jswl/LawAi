import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdvisoryMode from './pages/AdvisoryMode';
import ExecutorMode from './pages/ExecutorMode'; // We will create this next
import NavigatorMode from './pages/NavigatorMode'; // And this

function App() {
    return (
        <Routes>
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