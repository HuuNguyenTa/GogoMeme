import React from 'react';
import { Heart } from '../ui/Icons';

export default function Footer() {
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="landing-footer">
      <div className="section-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h3 className="footer-brand-title">TRẠM YÊU THƯƠNG</h3>
            <p className="footer-brand-desc">
              Dự án nhận thức cộng đồng về bảo vệ chó mèo cơ nhỡ, được phát triển bởi nhóm sinh viên SSG105. Hướng tới một cộng đồng nhân văn, nơi mọi sinh mệnh bốn chân đều được tôn trọng và chở che.
            </p>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-col-title">Trải Nghiệm</h4>
            <ul className="footer-links-list">
              <li><a href="#about" onClick={scrollTo('about')}>Về Trạm Yêu Thương</a></li>
              <li><a href="#choose-friend" onClick={scrollTo('choose-friend')}>Chọn người bạn nhỏ</a></li>
              <li><a href="#station" onClick={scrollTo('station')}>Khu vườn lời chúc</a></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-col-title">Hành Động</h4>
            <ul className="footer-links-list">
              <li><a href="#learn" onClick={scrollTo('learn')}>Cẩm nang cứu hộ 4 bước</a></li>
              <li><a href="#support" onClick={scrollTo('support')}>Mạng lưới trạm cứu trợ</a></li>
              <li><a href="#journey" onClick={scrollTo('journey')}>Tiến độ gây quỹ SSG105</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} Trạm Yêu Thương · Dự án học phần SSG105. Tất cả quyền được bảo lưu.
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
