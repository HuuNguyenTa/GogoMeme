import React from 'react';
import { Check, X, Paw } from '../ui/Icons';

export default function ComparisonSection() {
  const comparisonItems = [
    {
      category: 'Khi tiếp cận',
      traditional: 'Chụp ảnh kêu cứu vu vơ, vây đông khiến con vật hoảng loạn',
      tramYeuThuong: 'Giữ cự ly an toàn 3–5m, hạ thấp người và nhẹ nhàng trấn an'
    },
    {
      category: 'Sơ cứu & Dinh dưỡng',
      traditional: 'Cho uống sữa bò có đường, ném thức ăn mặn nhiều dầu mỡ',
      tramYeuThuong: 'Cấp nước sạch từ xa, ủ ấm thân nhiệt bằng khăn mềm hoặc hộp xốp'
    },
    {
      category: 'Kết nối cứu trợ',
      traditional: 'Bỏ lại tại chỗ hoặc chờ đợi người khác đến giúp',
      tramYeuThuong: 'Gửi tọa độ và ảnh chụp hiện trường trực tiếp tới trạm cứu hộ gần nhất'
    }
  ];

  return (
    <section className="landing-section landing-section--comparison" id="comparison">
      <div className="section-container">
        {/* Section Header: 1 headline + 1 short supporting sentence */}
        <div className="section-header">
          <h2 className="section-title">
            Đừng chỉ xót xa, hãy cứu giúp đúng cách.
          </h2>
          <p className="section-subtitle">
           Can thiệp bằng kiến thức khoa học và sự bình tĩnh chính là chìa khóa mở ra cơ hội sống sót cao nhất cho một sinh mệnh gặp nạn.
          </p>
        </div>

        {/* Clean, Restrained Comparison Board */}
        <div className="comparison-board-wrap">
          <div className="comparison-table-card">
            {/* Table Header */}
            <div className="comparison-table-header">
              <div className="comp-col comp-col--category">Tiêu chí</div>
              <div className="comp-col comp-col--traditional">
                <span className="comp-header-badge comp-badge--gray">Cách làm cảm tính / Thụ động</span>
              </div>
              <div className="comp-col comp-col--ours">
                <span className="comp-header-badge comp-badge--primary">
                  <Paw size={14} fill="currentColor" style={{ display: 'inline', marginRight: 6 }} />
                  Giải pháp GoGo & MeMe
                </span>
              </div>
            </div>

            {/* Table Rows (3 clear, high-readability rows) */}
            <div className="comparison-table-body">
              {comparisonItems.map((row, idx) => (
                <div key={idx} className="comparison-row">
                  <div className="comp-col comp-col--category">
                    <span className="comp-mobile-label">Tình huống</span>
                    <span className="comp-category-tag">{row.category}</span>
                  </div>
                  <div className="comp-col comp-col--traditional">
                    <span className="comp-mobile-label comp-mobile-label--avoid">Tránh</span>
                    <div className="comp-item-inner">
                      <div className="comp-icon-indicator comp-icon--negative">
                        <X size={15} />
                      </div>
                      <p className="comp-desc">{row.traditional}</p>
                    </div>
                  </div>
                  <div className="comp-col comp-col--ours">
                    <span className="comp-mobile-label comp-mobile-label--recommended">Nên làm</span>
                    <div className="comp-item-inner">
                      <div className="comp-icon-indicator comp-icon--positive">
                        <Check size={15} />
                      </div>
                      <p className="comp-desc comp-desc--highlight">{row.tramYeuThuong}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
