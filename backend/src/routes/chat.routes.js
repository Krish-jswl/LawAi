import { Router } from 'express';
import multer from 'multer';
import { analyzeDocument } from '../agents/ragAgent.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('document'), async (req, res) => {
    try {
        const userQuestion = req.body.question;
        const file = req.file; // This might be undefined now, and that's okay!

        if (!userQuestion) {
            return res.status(400).json({ error: "Please ask a question or describe your issue." });
        }

        // Pass nulls if no file was uploaded
        const fileBuffer = file ? file.buffer : null;
        const mimeType = file ? file.mimetype : null;

        // Update the response block:
        const result = await analyzeDocument(userQuestion, fileBuffer, mimeType);

        res.json({
            status: "success",
            answer: result.answer, // The AI's response
            documentText: result.extractedText || null // The raw PDF text (if a file was uploaded)
        });

    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: "Failed to process the request." });
    }
});

export default router;