import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Automatically loads your .env file

// Import your routes
import chatRoutes from './routes/chat.routes.js';
import executeRoutes from './routes/execute.routes.js';
const app = express();

// --- Middleware ---
// Allow cross-origin requests from your frontend
// Replace your current app.use(cors()) with this:
app.use(cors({
    origin: '*', // Allows all origins - perfect for hackathons
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
// Parse incoming JSON payloads
app.use(express.json());

// --- Routes ---
// Mount the chat routes under the /api/chat prefix
app.use('/api/chat', chatRoutes);
app.use('/api/execute', executeRoutes);

// A simple health check route to verify the server is up
app.get('/health', (req, res) => {
    res.json({ status: 'KALPA AI Backend is online and ready.' });
});

// --- Server Startup ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[LawAi] Server is running on http://localhost:${PORT}`);
});
