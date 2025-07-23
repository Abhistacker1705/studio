"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LayoutDashboard, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "My Profile", icon: UserCircle },
  ];

  return (
    <aside className="hidden w-64 flex-col border-r bg-card p-4 sm:flex">
      <div className="flex items-center gap-2 mb-8">
        <Bot className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-primary font-headline">
          ContentFlow AI
        </h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-secondary",
              pathname === item.href && "bg-secondary text-primary font-bold"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ContentFlow AI
        </p>
      </div>
    </aside>
  );
}
