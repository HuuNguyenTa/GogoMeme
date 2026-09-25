import React, { useState } from 'react';
import HeroSection from './components/hero/HeroSection';
import AboutSection from './components/sections/AboutSection';
import ComparisonSection from './components/sections/ComparisonSection';
import ChooseFriendPreview from './components/sections/ChooseFriendPreview';
import RescueStationPreview from './components/sections/RescueStationPreview';
import ProtectionLayersSection from './components/sections/ProtectionLayersSection';
import LearnToHelpSection from './components/sections/LearnToHelpSection';
import FindSupportSection from './components/sections/FindSupportSection';
import ProjectJourneySection from './components/sections/ProjectJourneySection';
import FaqSection from './components/sections/FaqSection';
import FinalCtaSection from './components/sections/FinalCtaSection';
import Footer from './components/sections/Footer';
import AmbientBackgroundLayer from './components/motion/AmbientBackgroundLayer';
import LandingMotionController from './components/motion/LandingMotionController';
import useLandingTheme from './hooks/useLandingTheme';
import ThemeToggle from './components/theme/ThemeToggle';
import FinalCtaCompanions3D from './components/sections/FinalCtaCompanions3D';
import PixelPetsOverlay from './components/pixel-pets/PixelPetsOverlay';
import './styles/landing.css';
import './styles/night-theme.css';
import './styles/mobile.css';

export default function App() {
  const { theme, toggleTheme } = useLandingTheme();
  const [newWish, setNewWish] = useState(null);

  const handleNavigateToChoose = () => {
    const el = document.getElementById('choose-friend') || document.getElementById('choose');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToGarden = () => {
    const el = document.getElementById('garden') || document.getElementById('station');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWishSubmitted = (wish) => {
    setNewWish(wish);
  };

  const handleGoToScenarios = () => {
    const el = document.getElementById('learn');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-shell">
      <AmbientBackgroundLayer />
      <LandingMotionController />
      <PixelPetsOverlay />
      {/* 1. 3D WebGL Hero Experience */}
      <HeroSection
        theme={theme}
        themeControl={<ThemeToggle theme={theme} onToggle={toggleTheme} />}
        onOpenJourney={handleNavigateToChoose}
        onExploreGarden={handleNavigateToGarden}
      />

      {/* 2. Section B: Chọn một người bạn bốn chân & Viết thư trao gửi yêu thương */}
      <ChooseFriendPreview
        onWishSubmitted={handleWishSubmitted}
      />

      {/* 3. Section D: Trạm Cứu Hộ Ảo (Khu Vườn Yêu Thương) */}
      <RescueStationPreview
        newWish={newWish}
        onGoToScenarios={handleGoToScenarios}
      />

      {/* 4. Section A: Về GoGo & MeMe Yêu Thương & Sứ Mệnh */}
      <AboutSection onOpenJourney={handleNavigateToChoose} />

      {/* 5. Section Comparison: "Đúng lúc quan trọng hơn đông thật nhiều" (Inspiration from SavePet) */}
      <ComparisonSection />

      {/* 6. Section Protection Layers: "Phát triển theo từng lớp bảo vệ" (Inspiration from SavePet) */}
      <ProtectionLayersSection />

      {/* 7. Section E: Cẩm nang DỪNG - NHÌN - GIÚP - GỌI */}
      <LearnToHelpSection />

      {/* 8. Section F: Mạng lưới hỗ trợ theo khu vực (NO MAP, directory style) */}
      <FindSupportSection />

      {/* 9. Section G: Hành trình dự án SSG105 */}
      <ProjectJourneySection />

      {/* 10. Section FAQ: "Giải đáp trước khi bạn đồng hành" (Inspiration from SavePet) */}
      <FaqSection />

      {/* 11. Section H: Lời kêu gọi cuối trang */}
      <FinalCtaSection onOpenJourney={handleNavigateToChoose} companions={<FinalCtaCompanions3D theme={theme} />} />

      {/* 12. Chân trang Footer */}
      <Footer />
    </div>
  );
}
