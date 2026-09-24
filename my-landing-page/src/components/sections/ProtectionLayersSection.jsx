import React from 'react';
import { Paw } from '../ui/Icons';

export default function ProtectionLayersSection() {
  const journeySteps = [
    {
      num: '01',
      title: 'Tiếp cận an toàn',
      desc: 'Giữ cự ly 3–5m, hạ thấp người và kiểm tra an toàn giao thông trước khi bước tới.'
    },
    {
      num: '02',
      title: 'Sơ cứu & ủ ấm',
      desc: 'Cấp nước sạch từ xa, che chắn mưa gió và ủ ấm thân nhiệt bằng khăn mềm hoặc hộp xốp.'
    },
    {
      num: '03',
      title: 'Kết nối trạm cứu hộ',
      desc: 'Chụp ảnh hiện trạng và gửi tọa độ chính xác tới mái ấm bảo trợ gần nhất để hỗ trợ y tế.'
    },
    {
      num: '04',
      title: 'Mái ấm trọn đời',
      desc: 'Phục hồi sức khỏe, hoàn thành vaccine, triệt sản và kết nối người nhận nuôi nhân văn.'
    }
  ];

  return (
    <section className="landing-section landing-section--layers" id="protection-layers">
      <div className="section-container">
        {/* Section Header: 1 headline + 1 short supporting sentence */}
        <div className="section-header">
          <h2 className="section-title">
            Phát Triển Theo Từng Lớp Bảo Vệ
          </h2>
          <p className="section-subtitle">
            Hành trình từ lúc một bé được phát hiện ngoài đường cho đến khi tìm được mái ấm hạnh phúc được bảo bọc qua 4 vòng an toàn khoa học.
          </p>
        </div>

        {/* 4-Step Journey: 01 -> 02 -> 03 -> 04 with subtle paw-path */}
        <div className="journey-steps-container">
          <div className="journey-steps-track" aria-hidden="true">
            <span className="paw-node"><Paw size={12} fill="#ff7e54" /></span>
            <span className="paw-node"><Paw size={12} fill="#52a37b" /></span>
            <span className="paw-node"><Paw size={12} fill="#8e72cf" /></span>
            <span className="paw-node"><Paw size={12} fill="#f6a623" /></span>
          </div>

          <div className="journey-steps-grid">
            {journeySteps.map((step, idx) => (
              <div key={step.num} className="journey-step-item">
                <div className="journey-step-circle-wrap">
                  <span className="journey-step-num">{step.num}</span>
                  {idx < journeySteps.length - 1 && (
                    <span className="journey-step-arrow" aria-hidden="true">→</span>
                  )}
                </div>
                <h3 className="journey-step-title">{step.title}</h3>
                <p className="journey-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
