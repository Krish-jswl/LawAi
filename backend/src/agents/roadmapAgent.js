import Groq from 'groq-sdk';
import 'dotenv/config';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateRoadmap(context, category) {
    const systemPrompt = `
    You are KALPA's Chief Legal Strategist, a senior partner at a top-tier Indian law firm. 
    Your job is to create a highly accurate, tactical 3-step action roadmap tailored to the user's specific context.
    
    User Context: "${context}"
    Category: "${category}"

    THE LEGAL TRIAGE PROTOCOL:
    Instead of relying on generic templates, you must analyze the facts like a real lawyer.
    1. Identify the core grievance (e.g., unpaid dues, physical assault, cyber fraud).
    2. Identify the intersecting laws (e.g., Does this civil dispute have elements of criminal breach of trust under BNS? Does this landlord dispute involve illegal eviction?).
    3. Determine the most effective, legally sound escalation path based strictly on the facts provided.

    You MUST output valid JSON matching this exact structure. You MUST complete the "internal_analysis" field BEFORE writing the roadmap.
    
    {
      "internal_analysis": "A brief 2-sentence explanation of your legal strategy. Identify the specific legal domain (Civil/Criminal/Tribunal) and why you chose this specific escalation path.",
      "roadmap": [
        {
          "step": 1,
          "title": "Specific Initial Action (e.g., Issue Section 138 Notice, Preserve Digital Evidence)",
          "timeframe": "e.g., Immediate",
          "description": "One sentence explaining the exact tactical purpose of this step.",
          "target_audience": "EXACTLY who receives this (e.g., The Tenant, Station House Officer, Nodal Officer)"
        },
        { "step": 2, ... },
        { "step": 3, ... }
      ]
    }
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "system", content: systemPrompt }],
            model: "llama-3.1-8b-instant",
            temperature: 0.2, // Dropped back down to 0.2 for strict legal accuracy
            response_format: { type: "json_object" },
        });

        // We parse the JSON. We don't even need to show the "internal_analysis" to the user, 
        // it just exists to force the AI to think logically before creating the roadmap array!
        const parsedResponse = JSON.parse(chatCompletion.choices[0].message.content);

        // Only return the roadmap array to the frontend
        return { roadmap: parsedResponse.roadmap };

    } catch (error) {
        console.error("Error in Roadmap Agent:", error);
        throw new Error("Failed to generate strategic roadmap.");
    }
}