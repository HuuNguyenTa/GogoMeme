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
import StoryModal from './components/sections/StoryModal';
import './styles/landing.css';

export default function App() {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [newWish, setNewWish] = useState(null);

  const handleNavigateToChoose = () => {
    const el = document.getElementById('choose-friend') || document.getElementById('choose');
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
      {/* 1. 3D WebGL Hero Experience */}
      <HeroSection
        onOpenJourney={handleNavigateToChoose}
        onOpenStory={() => setIsStoryOpen(true)}
      />

      {/* 2. Section A: Về Trạm Yêu Thương & Sứ Mệnh */}
      <AboutSection onOpenJourney={handleNavigateToChoose} />

      {/* 3. Section Comparison: "Đúng lúc quan trọng hơn đông thật nhiều" (Inspiration from SavePet) */}
      <ComparisonSection />

      {/* 4. Section B: Chọn một người bạn bốn chân & Viết thư trao gửi yêu thương */}
      <ChooseFriendPreview
        onWishSubmitted={handleWishSubmitted}
      />

      {/* 6. Section D: Trạm Cứu Hộ Ảo (Khu Vườn Yêu Thương) */}
      <RescueStationPreview
        newWish={newWish}
        onGoToScenarios={handleGoToScenarios}
      />

      {/* 7. Section Protection Layers: "Phát triển theo từng lớp bảo vệ" (Inspiration from SavePet) */}
      <ProtectionLayersSection />

      {/* 8. Section E: Cẩm nang DỪNG - NHÌN - GIÚP - GỌI */}
      <LearnToHelpSection />

      {/* 9. Section F: Mạng lưới hỗ trợ theo khu vực (NO MAP, directory style) */}
      <FindSupportSection />

      {/* 10. Section G: Hành trình dự án SSG105 */}
      <ProjectJourneySection />

      {/* 11. Section FAQ: "Giải đáp trước khi bạn đồng hành" (Inspiration from SavePet) */}
      <FaqSection />

      {/* 12. Section H: Lời kêu gọi cuối trang */}
      <FinalCtaSection onOpenJourney={handleNavigateToChoose} />

      {/* 13. Chân trang Footer */}
      <Footer />

      {/* Story Narrative Modal */}
      <StoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />
    </div>
  );
}
