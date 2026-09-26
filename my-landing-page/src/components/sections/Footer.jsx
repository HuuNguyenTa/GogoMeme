import React from 'react';
import { Heart, Paw } from '../ui/Icons';

// Footer component - SSG105 GoGo & MeMe community project

export default function Footer() {
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="landing-footer" id="footer">
      <div className="section-container">
        <div className="footer-main-grid">
          {/* Cột 1: Thương hiệu & Sứ mệnh */}
          <div className="footer-brand">
            <div className="footer-brand-badge">
              <Paw size={13} fill="#ff8a5c" color="#ff8a5c" />
              <span>Dự án cộng đồng SSG105</span>
            </div>
            <h3 className="footer-brand-title">GoGo & MeMe</h3>
            <p className="footer-brand-desc">
              Dự án nhận thức cộng đồng về bảo vệ chó mèo cơ nhỡ, được phát triển bởi nhóm sinh viên Trường Đại học FPT TP.HCM. Hướng tới một cộng đồng nhân văn, nơi mọi sinh mệnh bốn chân đều được tôn trọng và chở che.
            </p>
            <div className="footer-meta-tags">
              <span className="footer-meta-pill">Đại học FPT TP.HCM</span>
              <span className="footer-meta-pill">Vì động vật cơ nhỡ</span>
            </div>
          </div>

          {/* Cột 2: Trải Nghiệm */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Trải Nghiệm</h4>
            <ul className="footer-links-list">
              <li><a href="#about" onClick={scrollTo('about')}>Về GoGo & MeMe</a></li>
              <li><a href="#choose-friend" onClick={scrollTo('choose-friend')}>Chọn người bạn nhỏ</a></li>
              <li><a href="#station" onClick={scrollTo('station')}>Khu vườn lời chúc</a></li>
              <li><a href="#protection-layers" onClick={scrollTo('protection-layers')}>Tầng bảo vệ thú cưng</a></li>
            </ul>
          </div>

          {/* Cột 3: Cẩm Nang & Trạm */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Hành Động</h4>
            <ul className="footer-links-list">
              <li><a href="#learn" onClick={scrollTo('learn')}>Cẩm nang cứu hộ 4 bước</a></li>
              <li><a href="#support" onClick={scrollTo('support')}>Mạng lưới trạm cứu trợ</a></li>
              <li><a href="#journey" onClick={scrollTo('journey')}>Tiến độ gây quỹ</a></li>
              <li><a href="#faq" onClick={scrollTo('faq')}>Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Cột 4: Lan Tỏa Yêu Thương */}
          <div className="footer-nav-col footer-highlight-col">
            <h4 className="footer-col-title">Lan Tỏa</h4>
            <div className="footer-quote-card">
              <p className="footer-quote-text">
                &ldquo;Mỗi hành động nhỏ, mỗi lời chúc gửi trao đều tiếp thêm hy vọng cho các bé bốn chân.&rdquo;
              </p>
              <a href="#final-cta" onClick={scrollTo('final-cta')} className="footer-quote-link">
                <span>Tham gia cùng chúng mình</span>
                <span className="footer-quote-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Đường kẻ ngăn cách thanh mảnh duy nhất */}
        <div className="footer-divider" />

        {/* Thanh chân trang (Copyright & Credit) */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} GoGo & MeMe · Đại học FPT TP.HCM. Tất cả quyền được bảo lưu.
          </div>
          <div className="footer-heart-credit">
            <span>Được kiến tạo với</span>
            <Heart size={14} fill="#ff7e54" color="#ff7e54" />
            <span>vì tình yêu thương loài vật</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
