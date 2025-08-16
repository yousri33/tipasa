import HeroSection from '@/components/sections/HeroSection';
import FeaturedCategories from '@/components/sections/FeaturedCategories';
import FeaturesSection from '@/components/sections/FeaturesSection';

export default function HomePage() {

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedCategories />
      <FeaturesSection />
    </div>
  );
}
