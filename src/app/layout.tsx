import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Aether Academy — AI-Integrated Education Workspace",
  description: "An advanced academic management system powered by contextual insights, predicting student success, tracking learning flows, and assisting teacher grading.",
};

const themeInitScript = `
(function() {
  try {
    var mode = localStorage.getItem('edu_theme_mode') || 'light';
    var color = localStorage.getItem('edu_theme_color') || 'teal';
    var font = localStorage.getItem('edu_theme_font') || 'sans';
    var scale = localStorage.getItem('edu_theme_scale') || 'medium';
    var radius = localStorage.getItem('edu_theme_radius') || 'rounded';
    
    var isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    document.documentElement.setAttribute('data-color', color);
    document.documentElement.setAttribute('data-font', font);
    document.documentElement.setAttribute('data-scale', scale);
    document.documentElement.setAttribute('data-radius', radius);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-background text-foreground flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
