"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

export default function CouncilPage() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await axiosInstance.get("/council/public");
      setMembers(res.data);
    };
    load();
  }, []);

  const councilMembers = members.filter((x) => x.category === "council");
  const secretariat = members.filter((x) => x.category === "secretariat");

  return (
    <section>
      {/* your exact UI */}
    </section>
  );
}
