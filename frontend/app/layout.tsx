// app/layout.tsx
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthWrapper from "@/components/AuthWrapper"; // Client wrapper for pathname

export const metadata = {
  title: "Serjeant At Arms",
  description: "Connect with Us",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}