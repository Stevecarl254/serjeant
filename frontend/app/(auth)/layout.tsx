import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002366] to-[#9e9210] flex items-center justify-center">
      {children}
    </div>
  );
}