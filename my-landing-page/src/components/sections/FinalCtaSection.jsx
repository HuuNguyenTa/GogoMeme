import React from 'react';
import { Heart, ArrowRight, MapPin, Sparkles } from '../ui/Icons';

export default function FinalCtaSection({ onOpenJourney, companions }) {
  const scrollToSupport = () => {
    const el = document.getElementById('support');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToChoose = () => {
    const el = document.getElementById('choose-friend') || document.getElementById('choose');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenJourney) {
      onOpenJourney();
    }
  };

  return (
    <section className="landing-section landing-section--final-cta" id="final-cta">
      <div className="section-container">
        <div className="final-cta-card-unified">
          <div className="section-badge section-badge--dark">
            <span>Chung tay vì cộng đồng bốn chân</span>
          </div>

          <h2 className="final-cta-title">
            Cùng GoGo & MeMe <br />
            Thắp Sáng Mái Nhà Cho Các Bé.
          </h2>

          <p className="final-cta-desc">
            Một lời chúc chân thành, một cẩm nang sơ cứu được ghi nhớ, hay một chia sẻ đúng lúc đều có thể trở thành điểm tựa hồi sinh một sinh linh nhỏ bé.
          </p>

          <div className="final-cta-btn-group">
            <button className="btn-primary-warm" onClick={scrollToChoose}>
              <Heart size={18} fill="currentColor" />
              <span>Gặp gỡ & Gửi lời chúc</span>
              <ArrowRight size={18} />
            </button>

            <button className="btn-secondary-dark" onClick={scrollToSupport}>
              <MapPin size={18} />
              <span>Tìm trạm cứu trợ gần bạn</span>
            </button>
          </div>

          <div className="final-cta-mascot-grounded">
            {companions}
          </div>
        </div>
      </div>
    </section>
  );
}
