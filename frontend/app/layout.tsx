import "./globals.css";
import { MemberProvider } from "@/context/MemberContext";
import AuthWrapper from "@/components/AuthWrapper";

export const metadata = {
  title: "Serjeant At Arms",
  description: "Connect with Us",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <MemberProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </MemberProvider>
      </body>
    </html>
  );
}
