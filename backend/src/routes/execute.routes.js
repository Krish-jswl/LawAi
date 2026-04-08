import { Router } from 'express';
const router = Router();

router.post('/triage', async (req, res) => {
    // Temporary mock response so the frontend works
    res.json({
        intent: "action",
        severity: "civil",
        entity: "Test Entity"
    });
});

export default router;