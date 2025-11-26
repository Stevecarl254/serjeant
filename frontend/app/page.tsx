import Hero from "../components/Hero";
import UpcomingEvents from "@/components/UpcomingEvents";
import AboutPage from "@/components/About";
import MembershipSection from "@/components/MembershipSection";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <UpcomingEvents/>
      <AboutPage/>
      <MembershipSection/>
      <FAQSection/>

      {/* other sections */}
    </main>
  );
}
