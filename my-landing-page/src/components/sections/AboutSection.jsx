import React from 'react';
import { Heart, Sparkles, Check, ArrowRight } from '../ui/Icons';
import DreamySleepingCard from '../ui/DreamySleepingCard';

export default function AboutSection({ onOpenJourney }) {
  const scrollToChoose = () => {
    const el = document.getElementById('choose-friend') || document.getElementById('choose');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenJourney) {
      onOpenJourney();
    }
  };

  return (
    <section className="landing-section landing-section--about" id="about">
      <div className="section-container">
        <div className="about-story-row">
          {/* Left Column: Narrative Content */}
          <div className="about-story-content">
            <div className="section-badge section-badge--soft">
              <Heart size={14} fill="currentColor" />
              <span>Sứ mệnh Trạm Yêu Thương</span>
            </div>

            <h2 className="section-title text-left">
              Biến Lòng Trắc Ẩn <br />
              Thành Hành Động Đúng Cách.
            </h2>

            <p className="section-subtitle text-left">
              Mỗi sinh mạng lang thang nơi góc phố đều mong ước một vòng tay chở che.
              Trạm Yêu Thương đồng hành cùng bạn từ sự thấu cảm đầu tiên cho đến phương pháp cứu hộ khoa học và kết nối trạm bảo trợ.
            </p>

            {/* 3 Clean Narrative Pillars (Not bulky cards) */}
            <div className="about-pillars-list">
              <div className="about-pillar-item">
                <span className="pillar-bullet-check">
                  <Check size={16} />
                </span>
                <div>
                  <strong>Đồng cảm chân thành:</strong>
                  <span> Gửi gắm tình thương và hy vọng tới những người bạn bốn chân cơ nhỡ.</span>
                </div>
              </div>

              <div className="about-pillar-item">
                <span className="pillar-bullet-check">
                  <Check size={16} />
                </span>
                <div>
                  <strong>Hiểu biết đúng đắn:</strong>
                  <span> Trang bị cẩm nang sơ cứu thú y an toàn, không gây thêm tổn thương.</span>
                </div>
              </div>

              <div className="about-pillar-item">
                <span className="pillar-bullet-check">
                  <Check size={16} />
                </span>
                <div>
                  <strong>Hành động thiết thực:</strong>
                  <span> Kết nối trực tiếp với mạng lưới trạm cứu trợ uy tín trên toàn quốc.</span>
                </div>
              </div>
            </div>

            {/* One Clear Primary Action */}
            <div className="about-cta-row">
              <button className="btn-primary-warm" onClick={scrollToChoose}>
                <span>Gặp gỡ bạn nhỏ cần giúp đỡ</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Column: Dreamy Layered Sleeping Cat Visual */}
          <div className="about-story-visual">
            <DreamySleepingCard
              src="https://images.pexels.com/photos/35128359/pexels-photo-35128359/free-photo-of-meo-con-dang-yeu-ng-tren-c-n-ng.jpeg?cs=tinysrgb&dpr=1&w=500"
              alt="Bé mèo con đáng yêu ngủ bình yên trên cỏ nắng"
              caption="Mỗi bé được cứu đều xứng đáng có một giấc ngủ an lành."
              badge="Giấc ngủ bình yên"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
