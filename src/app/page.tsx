"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ContentCalendar } from "@/components/ContentCalendar";
import { AddContentModal } from "@/components/AddContentModal";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background font-body">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header onAddContent={() => setIsModalOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <ContentCalendar />
        </main>
      </div>
      <AddContentModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
}
