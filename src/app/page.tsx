"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header-01";
import { HeroSection } from "@/components/blocks/hero-section";
import LoginCardSection from "@/components/ui/login-signup";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <Header />
      <main className="flex-1">
        <HeroSection
          title="Meet your Autonomous Legal Agent"
          description="Upload any legal document. We don't just summarize—we audit risks, simulate &quot;what-if&quot; scenarios, and execute legal pushback on your behalf."
          actions={[
            {
              text: "Login",
              href: "/analysis",
              variant: "default",
              onClick: () => setShowLogin(true),
            },
          ]}
          image={{
            light: "/app-light.png",
            dark: "/app-dark.png",
            alt: "Law AI Dashboard Preview",
          }}
        />
      </main>

      {showLogin && (
        <LoginCardSection onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}
