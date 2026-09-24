// ScenarioStage.jsx - Interactive Single-Scenario Learning Stage
// Implements 2-column desktop / stacked mobile layout with illustrated 2.5D scene,
// friendly action cards, manual confirmation, supportive non-judgmental feedback,
// and smooth 300ms transitions.

import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Heart } from '../ui/Icons';
import ScenarioIllustratedScene from './ScenarioIllustratedScene';

export default function ScenarioStage({
  scenario,
  currentIndex,
  totalCount,
  onNext,
  isTransitioning = false
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Reset state when scenario changes
  useEffect(() => {
    setSelectedOption(null);
    setIsConfirmed(false);
  }, [scenario?.id]);

  if (!scenario) return null;

  const isRecommendedSelected = isConfirmed && selectedOption === scenario.recommendedAnswer;
  const recommendedOpt = scenario.options.find((o) => o.id === scenario.recommendedAnswer);
  const userChosenOpt = scenario.options.find((o) => o.id === selectedOption);

  const handleSelectOption = (optId) => {
    if (isConfirmed) return; // Locked once confirmed
    setSelectedOption(optId);
  };

  const handleConfirm = () => {
    if (!selectedOption || isConfirmed) return;
    setIsConfirmed(true);
  };

  const handleProceedNext = () => {
    if (onNext) onNext();
  };

  return (
    <div className={`scenario-stage-shell ${isTransitioning ? 'is-fading' : ''}`}>
      {/* ── STAGE HEADER: PROGRESS TRACKER & PRINCIPLE BADGE ── */}
      <div className="scenario-stage-header">
        <div className="scenario-progress-pill">
          <span className="progress-step-counter">
            Tình huống {currentIndex + 1} / {totalCount}
          </span>
          <div className="progress-dots-track" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={totalCount}>
            {Array.from({ length: totalCount }).map((_, i) => (
              <React.Fragment key={i}>
                <span
                  className={`dot-node ${i === currentIndex ? 'active' : i < currentIndex ? 'completed' : ''}`}
                  title={`Tình huống ${i + 1}`}
                />
                {i < totalCount - 1 && (
                  <span className={`dot-connector ${i < currentIndex ? 'completed' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className={`scenario-principle-badge badge-${scenario.principle.toLowerCase()}`}>
          <span className="principle-token">{scenario.principle}</span>
          <span className="principle-title">{scenario.situationBadge || scenario.principleTitle}</span>
        </div>
      </div>

      {/* ── 2-COLUMN STAGE BODY ──────────────────────────────────────────────── */}
      <div className="scenario-stage-grid">
        {/* LEFT COLUMN: 2.5D ILLUSTRATED RESCUE SCENE */}
        <div className="stage-left-col">
          <ScenarioIllustratedScene
            sceneType={scenario.sceneType || 'roadside'}
            isConfirmed={isConfirmed}
            isRecommendedSelected={isRecommendedSelected}
            principle={scenario.principle}
          />
        </div>

        {/* RIGHT COLUMN: QUESTION & FRIENDLY ACTION CARDS */}
        <div className="stage-right-col">
          <div className="scenario-content-panel">
            {/* Situation Context Heading */}
            <h3 className="scenario-title">{scenario.title}</h3>
            <p className="scenario-desc">{scenario.description}</p>

            {/* Prompt Question */}
            <div className="scenario-prompt-box">
              <span className="prompt-label">Bạn sẽ làm gì trước tiên?</span>
            </div>

            {/* Action Cards Selection (Not Radio Buttons) */}
            <div className="scenario-actions-list" role="radiogroup" aria-label="Lựa chọn hành động">
              {scenario.options.map((opt, idx) => {
                const isSelected = selectedOption === opt.id;
                const isRecommended = isConfirmed && opt.id === scenario.recommendedAnswer;
                const isChosenAlternative = isConfirmed && isSelected && !isRecommended;

                let cardStateClass = '';
                if (isConfirmed) {
                  if (isRecommended) cardStateClass = 'state-recommended';
                  else if (isChosenAlternative) cardStateClass = 'state-alternative';
                  else cardStateClass = 'state-dimmed';
                } else if (isSelected) {
                  cardStateClass = 'state-selected';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={isConfirmed}
                    className={`action-option-card ${cardStateClass}`}
                    onClick={() => handleSelectOption(opt.id)}
                  >
                    <div className="option-indicator-cell">
                      <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                      {isSelected && !isConfirmed && (
                        <span className="option-check-dot">✓</span>
                      )}
                      {isRecommended && (
                        <span className="option-recommended-tag">An toàn nhất</span>
                      )}
                      {isChosenAlternative && (
                        <span className="option-user-tag">Lựa chọn của bạn</span>
                      )}
                    </div>

                    <div className="option-text-cell">
                      {opt.actionLabel && (
                        <span className="option-action-title">{opt.actionLabel}</span>
                      )}
                      <p className="option-action-desc">{opt.text}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── ACTION FOOTER & CONFIRM / NEXT CONTROLS ── */}
            {!isConfirmed ? (
              <div className="scenario-stage-footer">
                <button
                  type="button"
                  className="btn-confirm-action"
                  onClick={handleConfirm}
                  disabled={!selectedOption}
                >
                  <span>Xác nhận lựa chọn</span>
                  <ArrowRight size={16} />
                </button>
                <span className="confirm-tip">
                  {selectedOption ? 'Nhấn để xem phân tích an toàn' : 'Chọn 1 phương án phù hợp nhất với tình huống'}
                </span>
              </div>
            ) : (
              /* ── SUPPORTIVE NON-JUDGMENTAL FEEDBACK BOX ── */
              <div className="scenario-feedback-panel" role="region" aria-live="polite">
                <div className="feedback-header">
                  <div className="feedback-status-pill">
                    <ShieldCheck size={16} />
                    <span>
                      {isRecommendedSelected
                        ? 'Lựa chọn chuẩn xác và an toàn! 🎉'
                        : 'Ý định xuất phát từ lòng tốt, nhưng cần lưu ý:'}
                    </span>
                  </div>
                </div>

                {!isRecommendedSelected && scenario.supportiveNote && (
                  <p className="feedback-empathy-note">
                    {scenario.supportiveNote}
                  </p>
                )}

                {!isRecommendedSelected && recommendedOpt && (
                  <div className="feedback-recommendation-box">
                    <span className="rec-label">Lựa chọn an toàn hơn là:</span>
                    <strong className="rec-text">{recommendedOpt.text}</strong>
                  </div>
                )}

                <div className="feedback-explanation">
                  <span className="exp-label">💡 Ghi nhớ từ chuyên gia cứu trợ:</span>
                  <p className="exp-body">{scenario.explanation}</p>
                </div>

                <div className="feedback-footer">
                  <button
                    type="button"
                    className="btn-next-scenario"
                    onClick={handleProceedNext}
                  >
                    <span>
                      {currentIndex < totalCount - 1
                        ? 'Tình huống tiếp theo'
                        : 'Xem đúc kết hành trình'}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

