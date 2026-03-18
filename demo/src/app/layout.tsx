import type { Metadata } from "next";
import Link from "next/link";
import "animark-react/styles";
import "./globals.css";

export const metadata: Metadata = {
  title: "animark — animated inline Markdown for React",
  description: "Per-scope animated inline text built on top of react-markdown.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

