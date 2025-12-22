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
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
        {/* Header */}
        <header className="border-b border-gray-700 bg-gray-800/90 backdrop-blur-lg shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🚀 GitHub Analytics
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-700 bg-gray-800/90 backdrop-blur-lg mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-400">
            © {new Date().getFullYear()} GitHub Analytics - Interactive Visualizations
          </div>
        </footer>
      </body>
    </html>
  );
}
