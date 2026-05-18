import { Outlet } from "react-router-dom";
import { TopNav } from "../app/components/TopNav";

export function AppShell() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background text-foreground font-sans relative">
      <TopNav />
      <main className="flex-1 flex overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
}
