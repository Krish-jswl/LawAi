import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- 1. Import the Router
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* 2. Wrap your App inside the BrowserRouter */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)