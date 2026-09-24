// LearnToHelpSection.jsx - Cinematic 3D Interactive Rescue Diorama
// Desktop: 58% Left 3D Rescue Scene + 42% Right Scenario Content
// Calm, uncluttered layout with unselected default state and supportive educational feedback.

import React, { useState } from 'react';
import { ArrowRight, RotateCcw } from '../ui/Icons';
import Scenario3DScene from '../scenarios/Scenario3DScene';
import { RESCUE_SCENARIOS } from '../../data/mockData';

export default function LearnToHelpSection() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const currentScenario = RESCUE_SCENARIOS[scenarioIndex] || RESCUE_SCENARIOS[0];
  const isRecommended = selectedOpt === currentScenario.recommendedAnswer;
  // Clean scenario title without redundant "Tình huống X:" prefix
  const cleanTitle = currentScenario.title ? currentScenario.title.replace(/^Tình huống \d+:\s*/i, '') : '';

  const handleSelectOption = (optId) => {
    if (isConfirmed) return; // Locked once user confirms
    setSelectedOpt(optId);
  };

  const handleConfirm = () => {
    if (!selectedOpt) return;
    setIsConfirmed(true);
  };

  const handleNext = () => {
    if (scenarioIndex < RESCUE_SCENARIOS.length - 1) {
      setScenarioIndex((prev) => prev + 1);
      setSelectedOpt(null);
      setIsConfirmed(false);
    } else {
      const el = document.getElementById('support');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRetry = () => {
    setSelectedOpt(null);
    setIsConfirmed(false);
  };

  return (
    <section className="landing-section landing-section--cream scenario-teaser-section" id="learn">
      <div className="section-container">
        {/* Section Header: 1 clear headline + short support copy */}
        <div className="section-header">
          <h2 className="section-title">
            Bạn Sẽ Làm Gì Khi Gặp Một Bé Cần Giúp Đỡ?
          </h2>
        </div>

        {/* 3D Diorama Stage: 58% 3D World + 42% Interaction Panel */}
        <div className="scenario-stage-3d-layout">
          {/* Left Column: Interactive 3D Rescue Diorama */}
          <div className="scenario-3d-column">
            <Scenario3DScene
              currentScenario={currentScenario}
              isConfirmed={isConfirmed}
              isRecommendedSelected={isRecommended}
              selectedOption={selectedOpt}
            />
          </div>

          {/* Right Column: Clean Scenario Interaction Panel */}
          <div className="scenario-panel-column">
            {/* Progress indicator */}
            <div className="scenario-progress-wrap">
              <div className="scenario-progress-info">
                <span className="scenario-step-badge">
                  Tình huống {scenarioIndex + 1} / {RESCUE_SCENARIOS.length}
                </span>
                <span className="scenario-principle-badge">
                  {currentScenario.principleTitle ? currentScenario.principleTitle.split(':')[0] : currentScenario.principle}
                </span>
              </div>
              <div className="scenario-progress-bar" role="progressbar" aria-valuenow={scenarioIndex + 1} aria-valuemin="1" aria-valuemax={RESCUE_SCENARIOS.length}>
                <div
                  className="scenario-progress-fill"
                  style={{ width: `${((scenarioIndex + 1) / RESCUE_SCENARIOS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Scenario Title & Situation */}
            <h3 className="scenario-title-clean">{cleanTitle}</h3>
            <p className="scenario-desc-clean">{currentScenario.description}</p>

            {/* 3 Answer Cards (Equal neutral weight, no spoiler before confirm) */}
            <div className="scenario-cards-list">
              {currentScenario.options.map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx); // A, B, C
                const isSelected = selectedOpt === opt.id;
                const isRec = opt.id === currentScenario.recommendedAnswer;

                let cardClass = 'scenario-choice-card';
                if (isSelected) {
                  cardClass += ' is-selected';
                }
                if (isConfirmed) {
                  cardClass += ' is-locked';
                  if (isRec) cardClass += ' is-recommended';
                  else if (isSelected) cardClass += ' is-unrecommended';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={cardClass}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isConfirmed}
                    aria-pressed={isSelected}
                  >
                    <span className="scenario-card-letter">{letter}</span>
                    <span className="scenario-card-text">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions: Confirm CTA or Educational Feedback */}
            {!isConfirmed ? (
              <div className="scenario-confirm-wrap">
                <button
                  type="button"
                  className="btn-scenario-confirm"
                  disabled={!selectedOpt}
                  onClick={handleConfirm}
                >
                  Xác nhận lựa chọn
                </button>
              </div>
            ) : (
              <div className="scenario-feedback-box-clean">
                <div className={`scenario-feedback-content ${isRecommended ? 'feedback-positive' : 'feedback-neutral'}`}>
                  <p className="scenario-feedback-text">
                    <strong>{isRecommended ? '✓ Chính xác: ' : '💡 Lưu ý an toàn: '}</strong>
                    {isRecommended
                      ? currentScenario.explanation
                      : `${currentScenario.supportiveNote} ${currentScenario.explanation}`}
                  </p>
                </div>

                <div className="scenario-actions-bar">
                  <button type="button" className="btn-scenario-advance" onClick={handleNext}>
                    <span>
                      {scenarioIndex < RESCUE_SCENARIOS.length - 1
                        ? 'Tình huống tiếp theo'
                        : 'Xem danh bạ trạm cứu trợ'}
                    </span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    className="btn-scenario-replay"
                    onClick={handleRetry}
                    title="Thử lại tình huống này"
                  >
                    <RotateCcw size={15} />
                    <span>Thử lại</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
