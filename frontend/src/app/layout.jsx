import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { FarmProvider } from "@/context/FarmContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AgroTech - Connecting Farmers and Businesses",
  description: "A platform connecting farmers and businesses for raw material procurement",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <FarmProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </FarmProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
