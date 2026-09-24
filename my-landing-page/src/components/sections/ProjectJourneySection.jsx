import React from 'react';
import { Check } from '../ui/Icons';
import { PROJECT_STATS } from '../../data/mockData';

export default function ProjectJourneySection() {
  const verifiedStats = [
    { num: PROJECT_STATS.totalWishes || '2.400+', label: 'Lời chúc ấm áp từ cộng đồng' },
    { num: PROJECT_STATS.participants || '1.250+', label: 'Người tham gia chiến dịch nhận thức' },
    { num: '6+', label: 'Trạm cứu trợ xác minh tại 4 thành phố' },
    { num: '100%', label: 'Dự án sinh viên phi lợi nhuận' }
  ];

  return (
    <section className="landing-section landing-section--cream" id="journey">
      <div className="section-container">
        {/* Section Header: 1 headline + short support copy */}
        <div className="section-header">
          <h2 className="section-title">
            Hành Trình Dự Án SSG105
          </h2>
          <p className="section-subtitle">
            Sáng kiến truyền thông cộng đồng của nhóm sinh viên nhằm nâng cao nhận thức bảo vệ thú cưng và kết nối hỗ trợ các trạm cứu hộ địa phương.
          </p>
        </div>

        {/* Clean 4 Verified Stats Row */}
        <div className="journey-verified-grid">
          {verifiedStats.map((stat, idx) => (
            <div key={idx} className="journey-verified-card">
              <div className="journey-verified-num">{stat.num}</div>
              <div className="journey-verified-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Real Student Project Evidence & Mission Manifesto (No stock photo filler) */}
        <div className="journey-evidence-box">
          <h3 className="journey-evidence-title">Từ Giảng Đường Đến Hành Động Thực Tế</h3>
          <p className="journey-evidence-desc">
            Dự án SSG105 khởi xướng từ mong muốn giản dị: Biến sự quan tâm trên mạng xã hội thành kiến thức sơ cứu khoa học và sự hỗ trợ thiết thực cho các mái ấm bảo trợ thú cưng. Chúng tôi xây dựng Trạm Yêu Thương như một không gian giáo dục tương tác, giúp mỗi người trẻ hiểu rõ cách xử lý an toàn khi gặp một sinh linh cơ nhỡ.
          </p>

          <div className="journey-commitments-clean">
            <span className="journey-clean-tag">
              <Check size={14} />
              <span>Dữ liệu trạm cứu trợ xác thực thực địa</span>
            </span>
            <span className="journey-clean-tag">
              <Check size={14} />
              <span>Kiến thức thú y tham vấn bác sĩ chuyên môn</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
