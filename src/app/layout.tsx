import type { Metadata } from "next";
import "@deftai/deft-components/styles.css";
import "./globals.css";
import { AppProviders } from "@/components/app/AppProviders";
import { themeInitScript } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "DeftConsensus",
  description: "Consensus-as-Code platform for cross-functional delivery alignment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set the theme class before hydration to avoid a flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
