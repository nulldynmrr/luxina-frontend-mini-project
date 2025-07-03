import "./globals.css";
import { Inter } from "next/font/google";
import ClientToaster from "@/components/ClientToaster/page";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Luxina",
  description: "App booking film terbaik",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ClientToaster />
        {children}
      </body>
    </html>
  );
}
