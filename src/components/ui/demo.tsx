"use client";

import { InsuranceCard } from "@/components/ui/insurance-card";

export function InsuranceCardDemo() {
  return (
    <div className="flex justify-center items-start pt-10 w-full">
      <div className="w-full mx-auto px-2 md:px-4 flex flex-col gap-6">
        <InsuranceCard 
          initialComplaint="The tenant has repeatedly failed to pay rent on time for the past three months despite multiple notices."
          legalCategory="Rent Dispute"
          severityScore={8.5}
          isExecutable={true}
          aiReasoning="The issue has been classified as consumer fraud based on transaction inconsistencies and user complaint patterns. Negligible severity due to minimal financial impact."
        />
        <InsuranceCard 
          executionSteps={`Step 1: Send Informal Message (Today)\nStep 2: Send Formal Email (If no response in 3 days)\nStep 3: Send Formal Legal Notice (If no response in 15 days)`}
        />
        <InsuranceCard isDraftingCanvas={true} />
      </div>
    </div>
  );
}
