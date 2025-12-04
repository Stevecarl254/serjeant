import Member from "../models/Member.js";

export async function generateMembershipNumber() {
  // Sort by membershipNumber descending (highest first)
  const lastMember = await Member.findOne().sort({ membershipNumber: -1 });

  let nextSeq = 1;

  if (lastMember && lastMember.membershipNumber) {
    const match = lastMember.membershipNumber.match(/SAA\/(\d{4})\/(\d{2})/);
    if (match) {
      nextSeq = parseInt(match[1], 10) + 1;
    }
  }

  const padded = String(nextSeq).padStart(4, "0");
  const year = new Date().getFullYear().toString().slice(-2);

  return `SAA/${padded}/${year}`;
}
