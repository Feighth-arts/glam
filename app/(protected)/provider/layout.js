import { Geist, Geist_Mono, Great_Vibes, Roboto } from "next/font/google";
import "@/app/(open)/globals.css"; 
import Sidebar from "@/components/provider/SideBar";
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
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"]
});

const sakitu = localFont({
  src: "../../../public/fonts/sakitu.woff2",
  weight: "400",
  variable: "--font-sakitu",
});

export const metadata = {
  title: "Provider Dashboard",
  description: "Provider dashboard for managing bookings and services",
};

export default function ProviderLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} ${roboto.variable} ${sakitu.variable} antialiased bg-light-gray h-screen overflow-hidden`}
      >
        {/* Desktop Layout */}
        <div className="hidden lg:flex h-screen">
          <section className="sticky top-0 h-screen flex">
            <Sidebar />
          </section>
          <main className="flex-1 flex flex-col min-h-screen">
            <div className="flex-1 px-4 py-2 overflow-y-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col h-screen">
          <Sidebar />
          <main className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] mt-14">
            <div className="flex-1 px-4 py-2 overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}