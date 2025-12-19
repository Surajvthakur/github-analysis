import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub Analytics",
  description: "Analyze GitHub profiles and repositories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        {/* Header */}
        <header className="border-b bg-gray">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">GitHub Analytics</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-gray">
          <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500">
            © {new Date().getFullYear()} GitHub Analytics
          </div>
        </footer>
      </body>
    </html>
  );
}
