"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "lucide-react";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "glow";
  onClick?: (e: React.MouseEvent) => void;
}

interface HeroProps {
  badge?: {
    text: string;
    action: {
      text: string;
      href: string;
    };
  };
  title: string;
  description: string;
  actions: HeroAction[];
  image: {
    light: string;
    dark: string;
    alt: string;
  };
}

export function HeroSection({
  badge,
  title,
  description,
  actions,
  image,
}: HeroProps) {

  return (
    <section
      className={cn(
        "bg-background text-foreground",
        "py-12 sm:py-24 md:py-32 px-4",
        "overflow-hidden"
      )}
    >
      <div className="mx-auto flex max-w-container flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {/* Badge */}
          {badge && (
            <Badge variant="outline" className="animate-appear gap-2">
              <span className="text-muted-foreground">{badge.text}</span>
              <a href={badge.action.href} className="flex items-center gap-1">
                {badge.action.text}
                <ArrowRightIcon className="h-3 w-3" />
              </a>
            </Badge>
          )}

          {/* Title */}
          <h1 className="relative z-10 inline-block animate-appear bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-md relative z-10 max-w-[550px] animate-appear font-medium text-muted-foreground opacity-0 delay-100 sm:text-xl">
            {description}
          </p>

          {/* Actions */}
          <div className="relative w-full flex justify-center animate-appear opacity-0 delay-300 py-10 mt-4">
            {/* Premium Uniform Golden Glow Scattering */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
            
            <div className="relative z-10 flex justify-center gap-4">
              {actions.map((action, index) => (
                <Button key={index} variant={action.variant} size="lg" className="shadow-[0_0_50px_-12px_rgba(245,158,11,0.4)] border border-amber-500/20" asChild>
                  <a
                    href={action.href}
                    className="flex items-center gap-2"
                    onClick={action.onClick ? (e) => { e.preventDefault(); action.onClick!(e); } : undefined}
                  >
                    {action.icon}
                    {action.text}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Feature Sections */}
          <div className="relative pt-16 w-full max-w-7xl mx-auto space-y-12 pb-16 px-4">
            {/* Feature 1: Interactive Advisory */}
            <div className="rounded-2xl bg-[#f5f0e8] dark:bg-[#f5f0e8] p-8 md:p-12 animate-appear opacity-0 delay-700">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Left Image */}
                <div className="w-full md:w-1/2 shrink-0">
                  <div className="rounded-xl border border-zinc-400/30 overflow-hidden bg-[#1a1a1a] shadow-2xl">
                    <Image
                      src="/interactive-advisory.png"
                      alt="Interactive Advisory Chat"
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>

                {/* Right Text Content */}
                <div className="w-full md:w-1/2 text-left">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                    Interactive advisory
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-zinc-600 font-normal">
                    You do not need a formal document or contract to begin your journey; simply arrive at the global intake and describe your legal problem or situation in plain text. The system immediately opens an interactive chat environment where you can seek high-level advice and get a clear understanding of your legal standing.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2: Cognitive Document Analysis */}
            <div className="rounded-2xl bg-[#f5f0e8] dark:bg-[#f5f0e8] p-8 md:p-12 animate-appear opacity-0 delay-700">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Left Text Content */}
                <div className="w-full md:w-1/2 text-left">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                    Cognitive document analysis
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-zinc-600 font-normal">
                    Upload any legal document, and our AI immediately creates a secure, split-screen environment. Ask &quot;What-If&quot; scenarios, and get instant calculations on your financial and legal risks, with the AI&apos;s context limited strictly to that document for total accuracy.
                  </p>
                </div>

                {/* Right Image */}
                <div className="w-full md:w-1/2 shrink-0 flex justify-end">
                  <div className="rounded-xl border border-zinc-400/30 overflow-hidden bg-[#1a1a1a] shadow-2xl w-full max-w-[800px]">
                    <Image
                      src="/cognitive-analysis.png"
                      alt="Cognitive Document Analysis Screenshot"
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Convert to Action Method */}
            <div className="rounded-2xl bg-[#f5f0e8] dark:bg-[#f5f0e8] p-8 md:p-12 animate-appear opacity-0 delay-700">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Left Image */}
                <div className="w-full md:w-1/2 shrink-0 flex items-center justify-center">
                  <div className="rounded-xl border border-zinc-400/30 overflow-hidden bg-[#131118] shadow-2xl w-full max-w-[400px]">
                    <Image
                      src="/convert-action.png"
                      alt="Convert to Action Button"
                      width={600}
                      height={400}
                      className="w-full h-auto object-contain p-2"
                    />
                  </div>
                </div>

                {/* Right Text Content */}
                <div className="w-full md:w-1/2 text-left">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                    &quot;Convert to Action&quot; Method
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-zinc-600 font-normal">
                    When you are done understanding the risks, click one button to stop talking and start executing. This method transitions you instantly from the &quot;Advisory&quot; path to the &quot;Action&quot; path, plotting a strategic, step-by-step legal timeline on your dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4: Triage & Severity Routing */}
            <div className="rounded-2xl bg-[#f5f0e8] dark:bg-[#f5f0e8] p-8 md:p-12 animate-appear opacity-0 delay-700">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Left Text Content */}
                <div className="w-full md:w-1/2 text-left">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                    Triage &amp; Severity Routing
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-zinc-600 font-normal">
                    Our Triage Agent analyzes your crisis to calculate a Severity Score. Civil and everyday issues are routed to <em>Executor Mode</em> for autonomous execution of notice drafting, while criminal or serious threats are routed to <em>Navigator Mode</em> for safety-first guidance and offline paperwork generation.
                  </p>
                </div>

                {/* Right Image */}
                <div className="w-full md:w-1/2 shrink-0 flex justify-center">
                  <div className="rounded-xl border border-zinc-400/30 overflow-hidden bg-[#131118] shadow-2xl w-full max-w-[500px]">
                    <Image
                      src="/triage-card.png"
                      alt="Triage Score Screenshot"
                      width={600}
                      height={600}
                      className="w-full h-auto object-contain p-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 5: Autonomous Escalation Tracking */}
            <div className="rounded-2xl bg-[#f5f0e8] dark:bg-[#f5f0e8] p-8 md:p-12 animate-appear opacity-0 delay-700">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Left Image */}
                <div className="w-full md:w-1/2 shrink-0 flex justify-center">
                  <div className="rounded-xl border border-zinc-400/30 overflow-hidden bg-[#131118] shadow-2xl w-full max-w-[500px]">
                    <Image
                      src="/action-pipeline.png"
                      alt="Action Pipeline Tracker"
                      width={600}
                      height={600}
                      className="w-full h-auto object-contain p-2"
                    />
                  </div>
                </div>

                {/* Right Text Content */}
                <div className="w-full md:w-1/2 text-left">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                    Autonomous Escalation Tracking (Human-in-the-Loop)
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-zinc-600 font-normal">
                    Never miss a legal deadline again. When the AI executes a legal notice on your behalf, a persistent background timer starts. If the offending party ignores the deadline, AI automatically wakes up, flags the failure, and drafts the next stage of legal escalation, pinging you for final &quot;Human-in-the-Loop&quot; approval to fire it off.
                  </p>
                </div>
              </div>
            </div>

            {/* Future feature blocks can be stacked here */}
          </div>
        </div>
      </div>
    </section>
  );
}
