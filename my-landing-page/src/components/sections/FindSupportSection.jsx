import React, { useState } from 'react';
import { PhoneCall, ExternalLink, ShieldAlert, Paw } from '../ui/Icons';
import { RESCUE_CENTERS } from '../../data/mockData';
import DecorativeAsset from '../ui/DecorativeAsset';

export default function FindSupportSection() {
  const [selectedCity, setSelectedCity] = useState('all');

  const filteredCenters = RESCUE_CENTERS.filter((c) => {
    if (selectedCity === 'all') return true;
    return c.city === selectedCity;
  });

  return (
    <section className="landing-section" id="support">
      {/* Decorative Edge Peeking Dog */}
      <DecorativeAsset asset="peeking-dog" variant="edge-right" />
      <div className="section-container">
        {/* Section Header with 1 subtle animal accent */}
        <div className="section-header">
          <div className="support-header-accent" aria-hidden="true">
            <Paw size={20} fill="#ff7e54" color="#ff7e54" />
          </div>
          <h2 className="section-title">
            Nơi Hỗ Trợ Cứu Trợ
          </h2>
          <p className="section-subtitle">
            Danh bạ đầu mối hỗ trợ cứu hộ chó mèo tại Hà Nội, TP. Hồ Chí Minh và Cần Thơ.
          </p>
        </div>

        {/* Streamlined Filter Bar */}
        <div className="support-filter-bar-clean">
          <div className="support-select-wrap">
            <span className="support-filter-label">Khu vực:</span>
            <select
              className="support-select-clean"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="all">Tất cả các tỉnh / thành phố</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Cần Thơ">Cần Thơ</option>
            </select>
          </div>
          <span className="support-count-tag">
            {filteredCenters.length} trạm bảo trợ
          </span>
        </div>

        {/* Clean, Scannable Rescue Cards Grid */}
        <div className="support-cards-grid">
          {filteredCenters.map((rc) => (
            <div className="rescue-card-clean" key={rc.id}>
              <div className="rescue-card-top">
                <span className="rescue-location-tag">{rc.city}</span>
              </div>

              <h3 className="rescue-name">{rc.name}</h3>
              <div className="rescue-actions-clean">
                {rc.phone && (
                  <a href={`tel:${rc.phone.replace(/\s+/g, '')}`} className="rescue-btn-call">
                    <PhoneCall size={14} />
                    <span>{rc.phone}</span>
                  </a>
                )}
                {rc.email && <span className="rescue-email"><strong>Email:</strong> {rc.email}</span>}
                {rc.facebookUrl && (
                  <a href={rc.facebookUrl} target="_blank" rel="noopener noreferrer" className="rescue-btn-fb">
                    <ExternalLink size={14} />
                    <span>Fanpage</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Restrained Disclaimer */}
        <div className="support-disclaimer-clean">
          <ShieldAlert size={18} style={{ flexShrink: 0, color: '#e07a5f' }} />
          <p>
            Vui lòng liên hệ trước khi di chuyển thú cưng để đảm bảo trạm có đủ chỗ và cơ sở y tế tiếp nhận.
          </p>
        </div>
      </div>
    </section>
  );
}
