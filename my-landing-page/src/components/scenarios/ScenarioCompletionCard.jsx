// ScenarioCompletionCard.jsx - Completion and Reflection State for DỪNG - NHÌN - GIÚP - GỌI Journey
import React from 'react';
import { Heart, Compass, ShieldCheck, ArrowRight, RotateCcw } from '../ui/Icons';
import MascotIllustration from '../garden/MascotIllustration';

export default function ScenarioCompletionCard({ onRestart, onGoToSupport }) {
  const handleScrollToSupport = () => {
    if (onGoToSupport) {
      onGoToSupport();
    } else {
      const el = document.getElementById('support') || document.querySelector('.support-filter-bar');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleScrollToTopFramework = () => {
    if (onRestart) onRestart();
    const el = document.getElementById('learn');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="scenario-completion-card">
      <div className="completion-top-ornament">
        <div className="completion-avatar-group">
          <div className="completion-avatar-circle cat">
            <MascotIllustration type="cat" variant="calico" size={62} />
          </div>
          <div className="completion-avatar-circle dog">
            <MascotIllustration type="dog" variant="corgi" size={62} />
          </div>
        </div>
      </div>

      <div className="completion-badge-pill">
        <ShieldCheck size={16} />
        <span>HÀNH TRÌNH HOÀN THÀNH</span>
      </div>

      <h3 className="completion-headline">
        Bạn đã hoàn thành hành trình DỪNG – NHÌN – GIÚP – GỌI!
      </h3>

      <p className="completion-takeaway">
        “Không phải lúc nào chúng ta cũng có thể tự mình cứu một bé. Biết khi nào cần tìm người có kinh nghiệm cũng là một cách giúp đỡ trọn vẹn nhất.”
      </p>

      {/* 4 Pillars Summary Reminder */}
      <div className="completion-pillars-grid">
        <div className="pillar-item">
          <span className="pillar-token token-dung">DỪNG</span>
          <span className="pillar-desc">An toàn giao thông trước tiên & không lao tới vồ bắt</span>
        </div>
        <div className="pillar-item">
          <span className="pillar-token token-nhin">NHÌN</span>
          <span className="pillar-desc">Quan sát thương tật, thân nhiệt & không cho uống sữa bò</span>
        </div>
        <div className="pillar-item">
          <span className="pillar-token token-giup">GIÚP</span>
          <span className="pillar-desc">Đặt nước sạch từ xa, xoa dịu nỗi sợ & hạ nhiệt</span>
        </div>
        <div className="pillar-item">
          <span className="pillar-token token-goi">GỌI</span>
          <span className="pillar-desc">Gửi tọa độ cho trạm cứu hộ khi ca bệnh vượt tầm tay</span>
        </div>
      </div>

      {/* Actions Row */}
      <div className="completion-actions-row">
        <button
          type="button"
          className="completion-primary-cta"
          onClick={handleScrollToSupport}
        >
          <Compass size={18} />
          <span>Tìm nơi hỗ trợ gần bạn</span>
          <ArrowRight size={16} />
        </button>

        <button
          type="button"
          className="completion-secondary-cta"
          onClick={handleScrollToTopFramework}
        >
          <RotateCcw size={16} />
          <span>Xem lại cách ghi nhớ</span>
        </button>
      </div>
    </div>
  );
}

