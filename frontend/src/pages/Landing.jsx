import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MiniComparator from '../components/MiniComparator/MiniComparator';
import RoadmapSection from '../components/RoadmapSection';
import BenefitsGrid from '../components/BenefitsGrid';
import PartnershipSection from '../components/PartnershipSection';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MiniComparator />
        <RoadmapSection />
        <BenefitsGrid />
        <PartnershipSection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
