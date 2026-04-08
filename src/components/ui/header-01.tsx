"use client";

import { Menu, X, Moon, Sun, Scale } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const menuItems = [
  { name: "Features", href: "#" },
  { name: "Solutions", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Contact", href: "#" },
];

const Header = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 4);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className={cn(
          "fixed z-50 w-full px-3 md:px-4 transition-colors duration-300",
          isScrolled ? "border-transparent" : "border-b"
        )}
      >
        <div
          className={cn(
            "mx-auto mt-2 transition-all duration-300",
            isScrolled &&
              "bg-[oklch(0.141_0.005_285.823)]/50 max-w-5xl rounded-2xl border backdrop-blur-xl px-3"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex w-full justify-between lg:w-auto">
              <a
                href="#"
                aria-label="home"
                className="flex gap-2 items-center"
              >
                <Scale className="h-7 w-7 text-brand" />
                <span className="text-lg font-bold tracking-tight">
                  Law<span className="text-brand">AI</span>
                </span>
              </a>
              <div className="flex gap-2">
                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState ? "Close Menu" : "Open Menu"}
                  className="relative z-20 pr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu
                    className={cn(
                      "m-auto size-6 duration-200",
                      menuState && "rotate-180 scale-0 opacity-0"
                    )}
                  />
                  <X
                    className={cn(
                      "absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200",
                      menuState && "rotate-0 scale-100 opacity-100"
                    )}
                  />
                </button>
              </div>
            </div>

            <div className="absolute inset-0 m-auto hidden lg:block size-fit">
              <Menus />
            </div>

            <div
              className={cn(
                "border backdrop-blur-2xl hidden w-full flex-wrap items-center justify-end space-y-8 rounded-sm p-3 shadow-3xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent",
                menuState && "block"
              )}
            >
              <div className="lg:hidden block p-3">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="text-muted-foreground hover:text-primary text-sm block duration-150"
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-2 sm:space-y-0">
                <ModeToggle />
                <Button
                  variant={"secondary"}
                  asChild
                  className={cn(isScrolled && "lg:hidden")}
                >
                  <a href="#">
                    <span>Get Early Access</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Document Analysis",
    href: "/analysis",
    description:
      "AI-powered contract and document review with instant risk identification.",
  },
  {
    title: "Risk Assessment",
    href: "#",
    description:
      "Automated legal risk scoring with actionable mitigation recommendations.",
  },
  {
    title: "What-If Scenarios",
    href: "#",
    description:
      "Simulate clause changes to understand downstream legal implications.",
  },
  {
    title: "Legal Pushback",
    href: "#",
    description:
      "Auto-generated redlines and counter-proposals backed by precedent.",
  },
  {
    title: "Compliance Check",
    href: "#",
    description:
      "Cross-reference documents against regulatory frameworks instantly.",
  },
  {
    title: "API Access",
    href: "#",
    description:
      "Integrate autonomous legal review directly into your existing workflows.",
  },
];

export function Menus() {
  return (
    <NavigationMenu viewport={true}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent text-xs"
            )}
          >
            <a href="#">Features</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent text-xs"
            )}
          >
            <a href="#">Use Cases</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent text-xs"
            )}
          >
            <a href="#">Pricing</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-xs">
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-2">
            <ul className="grid gap-3 md:grid-cols-3 max-w-xl lg:w-3xl">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent text-xs"
            )}
          >
            <a href="#">Docs</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent text-xs"
            )}
          >
            <a href="#">Contact</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <a className="p-3 block" href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-xs leading-snug mt-1">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div className="flex flex-col justify-center">
      <div>
        <Toggle
          className="group bg-secondary dark:bg-secondary data-[state=on]:hover:bg-muted cursor-pointer size-9 data-[state=on]:bg-transparent"
          pressed={theme === "dark"}
          onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <Moon
            size={16}
            className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
            aria-hidden="true"
          />
          <Sun
            size={16}
            className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
            aria-hidden="true"
          />
        </Toggle>
      </div>
    </div>
  );
}

export { Header };
