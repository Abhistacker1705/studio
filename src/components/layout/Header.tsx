"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface HeaderProps {
  onAddContent: () => void;
}

export function Header({ onAddContent }: HeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between border-b bg-card px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-xl font-semibold font-headline">Content Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Plan, create, and flow.
        </p>
      </div>
      <Button onClick={onAddContent} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg transition-transform hover:scale-105">
        <PlusCircle className="mr-2 h-5 w-5" />
        Add New Content
      </Button>
    </header>
  );
}
