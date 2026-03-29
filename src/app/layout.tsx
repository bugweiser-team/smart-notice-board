import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AppShell from "@/components/layout/AppShell";
import NotificationToast from "@/components/NotificationToast";
import PushNotificationManager from "@/components/PushNotificationManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Student Dashboard",
  description: "A personalized smart digital notice board and dashboard for college campuses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]`}>
        <ThemeProvider>
          <AuthProvider>
            {/* AppShell handles the Sidebar, TopBar, and BottomNav routing logic */}
            <AppShell>
              {children}
            </AppShell>
            <PushNotificationManager />
            <NotificationToast />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
