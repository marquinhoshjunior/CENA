import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TheatreOpening } from "@/components/TheatreOpening";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cena — Descubra produções teatrais",
  description:
    "Descubra oportunidades teatrais e candidaturas para personagens.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var theme=localStorage.getItem('cena-theme');if(!theme){theme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=theme}catch(e){}})();",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <TheatreOpening />
        {children}
      </body>
    </html>
  );
}
