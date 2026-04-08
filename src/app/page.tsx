"use client";

import { Header } from "@/components/ui/header-01";
import { HeroSection } from "@/components/blocks/hero-section";
import { Icons } from "@/components/ui/icons";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <Header />
      <main className="flex-1">
        <HeroSection
          title="Meet your Autonomous Legal Agent"
          description="Upload any legal document. We don't just summarize—we audit risks, simulate &quot;what-if&quot; scenarios, and execute legal pushback on your behalf."
          actions={[
            {
              text: "Get Started",
              href: "/docs/getting-started",
              variant: "default",
            },
            {
              text: "GitHub",
              href: "https://github.com/your-repo",
              variant: "glow",
              icon: <Icons.gitHub className="h-5 w-5" />,
            },
          ]}
          image={{
            light: "/app-light.png",
            dark: "/app-dark.png",
            alt: "Law AI Dashboard Preview",
          }}
        />
      </main>
    </div>
  );
}
