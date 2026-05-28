import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/Providers";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className + " bg-gray-50 text-gray-900"}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
