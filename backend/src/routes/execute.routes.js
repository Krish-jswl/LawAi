import { Router } from 'express';
import { triageIssue } from '../agents/triageAgent.js';
import { generateRoadmap } from '../agents/roadmapAgent.js';
import { generateDraft } from '../agents/draftingAgent.js';

const router = Router();

// Route 1: Triage (The Orchestrator)
// Triggered by "Convert to Action Path" in AdvisoryMode
router.post('/triage', async (req, res) => {
    try {
        const { context } = req.body;
        // Run the Groq triage agent
        const triageData = await triageIssue(context);

        // Return the JSON directly to the frontend
        res.json(triageData);
    } catch (error) {
        console.error("Triage Route Error:", error);
        res.status(500).json({ error: "Failed to run triage routing" });
    }
});

// Route 2: Generate the Dynamic Roadmap
// Triggered when ExecutorMode loads
router.post('/roadmap', async (req, res) => {
    try {
        const { context, category } = req.body;
        const roadmapData = await generateRoadmap(context, category);
        res.json(roadmapData);
    } catch (error) {
        console.error("Roadmap Route Error:", error);
        res.status(500).json({ error: "Failed to generate roadmap" });
    }
});

// Route 3: Generate the Actual Document Draft
// Triggered by the "Generate Draft" button in ExecutorMode
router.post('/draft', async (req, res) => {
    try {
        const { context, entity, step, format, refinement } = req.body;
        const draftText = await generateDraft(context, entity, step, format, refinement);
        res.json({ draft: draftText });
    } catch (error) {
        console.error("Drafting Route Error:", error);
        res.status(500).json({ error: "Failed to draft document" });
    }
});

export default router;