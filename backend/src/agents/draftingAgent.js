import Groq from 'groq-sdk';
import 'dotenv/config';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateDraft(context, entity, step, format, refinement) {
    // 1. DYNAMIC SCOPE & TONE ENGINE
    let toneInstruction = "";
    let scopeInstruction = `CURRENT ACTION STEP: ${step.title} - ${step.description}\nTARGET AUDIENCE FOR THIS DOCUMENT: ${step.target_audience || 'The Opposing Party'}`;

    // EXECUTOR MODE LOGIC (Escalating Civil Steps)
    if (["sms", "email", "notice"].includes(format)) {
        if (step.step === 1) {
            toneInstruction = "TONE: Firm but polite. Establish a paper trail. Assume the opposing party might just be disorganized.";
        } else if (step.step === 2) {
            toneInstruction = "TONE: Aggressive and strictly legal. Warn of impending legal escalation. Demand immediate resolution.";
        } else {
            toneInstruction = "TONE: Ruthless, authoritative, and final. State exact legal consequences.";
        }
    }
    // NAVIGATOR MODE LOGIC (Comprehensive Criminal Documents)
    else {
        toneInstruction = "TONE: Objective, formal, strictly factual, and legally precise. Do not use threats; state facts chronologically for authorities.";
        // This is the magic line that fixes your FIR problem:
        scopeInstruction = "CRITICAL SCOPE OVERRIDE: This is a high-severity criminal/safety document. IGNORE the 'Current Action Step'. You MUST base this document on the ENTIRE CASE CONTEXT. An FIR, Complaint, or Evidence Checklist covers the whole incident, not a single step.";
    }

    // 2. STRICT FORMATTING RULES
    let formatInstructions = "";
    if (format === "sms") {
        formatInstructions = "FORMAT: WhatsApp/SMS message. STRICT RULE: MAXIMUM 40 WORDS. Be punchy, direct, and use line breaks. No emojis.";
    } else if (format === "email") {
        formatInstructions = "FORMAT: Formal corporate email. Include Subject Line, formal salutations, and clear bullet points.";
    } else if (format === "notice") {
        formatInstructions = "FORMAT: Strict Indian Legal Notice. Use standardized legal formatting ('To, [Person]', 'Sub:'). Cite applicable sections.";
    } else if (format === "complaint") {
        formatInstructions = "FORMAT: Official Police Complaint. Address to 'The Station House Officer (SHO)'. Clearly state the sequence of events and request registration of an FIR under relevant sections of the Bharatiya Nyaya Sanhita (BNS).";
    } else if (format === "fir") {
        formatInstructions = "FORMAT: FIR Preparation Summary. Create a clean, bulleted fact-sheet (Who, What, When, Where) that a citizen can hand to a police officer to make filing an FIR easier.";
    } else if (format === "evidence") {
        formatInstructions = "FORMAT: Evidence Preservation Checklist. Generate a specific, actionable checklist of digital and physical evidence the user must secure immediately.";
    }

    // 3. Handle Human-in-the-Loop tweaks
    let refinementInstruction = refinement
        ? `\nCRITICAL OVERRIDE FROM USER: Modify the draft to obey this instruction: "${refinement}"`
        : "";

    const systemPrompt = `
    You are KALPA's Lead Drafting Counsel. You write airtight, highly professional legal documents under Indian Law.
    Your ONLY job is to output the final text of the document. Do NOT output conversational filler.
    
    CASE CONTEXT: ${context}
    OPPOSING ENTITY: ${entity}
    
    ${scopeInstruction}
    
    CRITICAL DIRECTIVES:
    1. ${toneInstruction}
    2. LOOK AT THE TARGET AUDIENCE. If the audience is a Police Station or Authority, DO NOT address the letter to the opposing entity.
    3. Leave bracketed placeholders like [Your Name] or [Date] for the user to fill in.
    
    ${formatInstructions} ${refinementInstruction}
    `;
    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt }],
        model: "llama-3.1-8b-instant", // Or mixtral-8x7b if you want higher quality legal text
        temperature: 0.4,
    });

    return chatCompletion.choices[0].message.content;
}