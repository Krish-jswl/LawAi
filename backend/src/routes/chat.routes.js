import { Router } from 'express';
import multer from 'multer';
import { analyzeDocument } from '../agents/ragAgent.js';

const router = Router();

// Configure Multer to keep the uploaded file in RAM (perfect for hackathons)
const upload = multer({ storage: multer.memoryStorage() });

// Notice we added `upload.single('document')` as middleware
router.post('/analyze', upload.single('document'), async (req, res) => {
    try {
        const userQuestion = req.body.question;
        const file = req.file; // Multer puts the file here

        // Validation
        if (!file) {
            return res.status(400).json({ error: "Please upload a PDF or image." });
        }
        if (!userQuestion) {
            return res.status(400).json({ error: "Please ask a question." });
        }

        console.log(`Analyzing file: ${file.originalname} (${file.mimetype})`);

        // Pass the file buffer and the mimeType (e.g., 'application/pdf' or 'image/jpeg') to the Agent
        const answer = await analyzeDocument(userQuestion, file.buffer, file.mimetype);

        // Return the AI's answer
        res.json({
            status: "success",
            answer: answer
        });

    } catch (error) {
        console.error("RAG Analysis Error:", error);
        res.status(500).json({ error: "Failed to analyze the document." });
    }
});

export default router;
