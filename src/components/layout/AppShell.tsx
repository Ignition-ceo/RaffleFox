import { useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <SidebarNav collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuToggle={() => setCollapsed(!collapsed)} />
        <main className="flex-1 p-6 max-w-[1200px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
