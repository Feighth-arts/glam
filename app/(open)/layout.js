import { Geist, Geist_Mono, Great_Vibes, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import localFont from 'next/font/local';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["400", "700"],
  variable: "--font-roboto",
  subsets: ["latin"]
});

const sakitu = localFont({
  src: "../../public/fonts/sakitu.woff2",
  weight: "400",
  variable: "--font-sakitu",
});


export const metadata = {
  title: "Glamease - Beauty Services Platform",
  description: "Book beauty services from verified providers in Kenya",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} ${roboto.variable}  ${sakitu.variable} antialiased overflow-y-auto`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
