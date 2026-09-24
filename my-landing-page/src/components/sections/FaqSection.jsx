import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from '../ui/Icons';
import { FAQ_ITEMS } from '../../data/mockData';
import DreamySleepingCard from '../ui/DreamySleepingCard';

export default function FaqSection() {
  const [openId, setOpenId] = useState('faq-1');

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="landing-section landing-section--faq" id="faq">
      <div className="section-container">
        {/* Section Header: 1 headline + short support sentence */}
        <div className="section-header">
          <h2 className="section-title">
            Giải Đáp Trước Khi Bạn Đồng Hành
          </h2>
          <p className="section-subtitle">
            Những thắc mắc thường gặp nhất khi bạn gặp một bé chó mèo cơ nhỡ ngoài đường hoặc mong muốn góp sức cùng cộng đồng.
          </p>
        </div>

        {/* Minimalist Accordion List (SavePet style) */}
        <div className="faq-clean-accordion">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`faq-clean-item ${isOpen ? 'is-expanded' : ''}`}
              >
                <button
                  type="button"
                  className="faq-clean-trigger"
                  onClick={() => handleToggle(item.id)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-clean-question">{item.question}</span>
                  <span className="faq-clean-icon" aria-hidden="true">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="faq-clean-body">
                    <p className="faq-clean-answer">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Peaceful Sleeping Animal Resting Near the Bottom of FAQ */}
        <div className="faq-sleeping-anchor">
          <DreamySleepingCard
            src="https://cdn.cizucu.com/images/photos/aO1CH1BuCLsZQlH6Bwqi.jpg?w=960&fit=max&q=80&auto=format&cs=srgb"
            alt="Khoảnh khắc an lành và bình yên của thú cưng"
            caption="Bình yên là khi mỗi sinh linh đều có một giấc ngủ ấm."
            badge="Mái ấm chở che"
          />
        </div>
      </div>
    </section>
  );
}
