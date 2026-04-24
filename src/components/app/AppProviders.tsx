"use client";

import { Toaster, TooltipProvider } from "@deftai/deft-components";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

/**
 * Single client-component boundary for app-wide providers. Keeps the root
 * layout a server component while still letting React Context-backed
 * providers mount at the top of the tree.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
