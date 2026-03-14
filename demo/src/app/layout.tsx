import type { Metadata } from "next";
import "animark-react/styles";
import "./globals.css";

export const metadata: Metadata = {
  title: "animark demo",
  description: "Testing animark inline animation scopes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
