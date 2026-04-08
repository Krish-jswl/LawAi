"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { X } from "lucide-react";



export default function LoginCardSection({
  onClose,
}: {
  onClose?: () => void;
}) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors shadow-lg"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white">Welcome to Law-AI</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Sign in to your account or create a new one
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-zinc-300">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-zinc-300">
                    Password
                  </Label>
                  <a
                    href="#"
                    className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border-zinc-700 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-zinc-400 font-normal cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <Button className="w-full bg-white text-black hover:bg-zinc-200 font-semibold">
                Sign In
              </Button>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-zinc-300">
                  Full Name
                </Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-zinc-300">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-zinc-300">
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
                />
              </div>
              <Button className="w-full bg-white text-black hover:bg-zinc-200 font-semibold">
                Create Account
              </Button>
            </TabsContent>
          </Tabs>


        </div>
      </div>
    </div>
  );
}
