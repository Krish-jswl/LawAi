import { AnimatedAIChat } from "@/components/ui/animated-ai-chat"
import { Header } from "@/components/ui/header-01";

export default function AnalysisPage() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden bg-[#0A0A0B] text-white">
      <Header /> 
      <main className="flex-1 w-full flex items-center justify-center pt-16 relative z-10">
        <AnimatedAIChat />
      </main>
    </div>
  );
}
