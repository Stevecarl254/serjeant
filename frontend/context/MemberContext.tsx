"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axiosInstance from "@/lib/axiosInstance";

export interface Member {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  packageType: string;
  isActive: boolean;
  paymentConfirmed: boolean;
  membershipNumber?: string;
  createdAt?: string;
  photoUrl?: string | null;
}

interface MemberContextType {
  member: Member | null;
  loading: boolean;
  hydrated: boolean;
  setMember: React.Dispatch<React.SetStateAction<Member | null>>;
  refreshMember: () => Promise<void>;
  markPaymentConfirmed: () => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider = ({ children }: { children: ReactNode }) => {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const refreshMember = async () => {
    try {
      const storedId =
        typeof window !== "undefined" ? localStorage.getItem("memberId") : null;

      if (!storedId) {
        setMember(null);
        return;
      }

      const res = await axiosInstance.get(`/members/public/${storedId}`);
      const payload = res.data?.member ?? res.data;

      setMember(payload);

      // Ensure memberId stays consistent
      localStorage.setItem("memberId", payload._id);
    } catch (err) {
      console.error("Failed to refresh member:", err);
      setMember(null);
    } finally {
      setLoading(false);
      setHydrated(true);
    }
  };

  const markPaymentConfirmed = () => {
    if (member) {
      const updated = {
        ...member,
        paymentConfirmed: true,
        isActive: true,
      };
      setMember(updated);

      localStorage.setItem("memberId", updated._id);
    }
  };

  useEffect(() => {
    refreshMember();
  }, []);

  return (
    <MemberContext.Provider
      value={{
        member,
        loading,
        hydrated,
        setMember,
        refreshMember,
        markPaymentConfirmed,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = () => {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error("useMember must be used within a MemberProvider");
  return ctx;
};
