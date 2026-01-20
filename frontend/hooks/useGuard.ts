"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMember } from "@/context/MemberContext";

export const useGuard = (
  step: "register" | "payment" | "profile" | "certificate"
) => {
  const router = useRouter();
  const { member, hydrated } = useMember();

  // Prevent multiple redirects within the same render cycle
  const redirected = useRef(false);

  useEffect(() => {
    if (!hydrated) return; // Wait for context

    if (redirected.current) return;

    const memberId = localStorage.getItem("memberId");
    const isRegistered = Boolean(memberId);
    const isPaid = member?.paymentConfirmed === true;

    // --------------------------------------------------------
    // RULE 1 — Not registered → Only register page is allowed
    // --------------------------------------------------------
    if (!isRegistered && step !== "register") {
      redirected.current = true;
      router.replace("/Membership/register/standard");
      return;
    }

    // --------------------------------------------------------
    // RULE 2 — Already registered → Skip register page
    // --------------------------------------------------------
    if (step === "register" && isRegistered) {
      redirected.current = true;
      router.replace("/profile");
      return;
    }

    // --------------------------------------------------------
    // RULE 3 — Payment page allowed ONLY when unpaid
    // --------------------------------------------------------
    if (step === "payment" && isPaid) {
      redirected.current = true;
      router.replace("/profile");
      return;
    }

    if (step === "payment" && !isRegistered) {
      // no memberId in storage → you shouldn’t be here
      redirected.current = true;
      router.replace("/Membership/register/standard");
      return;
    }

    // --------------------------------------------------------
    // RULE 4 — Profile allowed when registered (paid OR not)
    // --------------------------------------------------------
    if (step === "profile" && !isRegistered) {
      redirected.current = true;
      router.replace("/Membership/register/standard");
      return;
    }

    // --------------------------------------------------------
    // RULE 5 — Certificate only allowed when paid
    // --------------------------------------------------------
    if (step === "certificate" && !isPaid) {
      redirected.current = true;
      router.replace("/profile");
      return;
    }
  }, [hydrated, member, router, step]);
};
