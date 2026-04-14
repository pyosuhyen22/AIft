import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "AIft Community",
  description: "Built with Next.js and Neon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
            <footer className="border-t py-6 text-center text-gray-500">© 2026 AIft Community.</footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
