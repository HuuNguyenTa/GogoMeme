import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Heart, Send } from '../ui/Icons';
import { ANIMALS } from '../../data/mockData';
import { submitWish } from '../../services/wishService';
import {
  navigateToChoose,
  navigateToRescueStation,
  navigateToWriteWish,
  normalizeLegacyPathname,
  parseJourneyLocation
} from '../../utils/journeyLocation';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=900&auto=format&fit=crop&q=82';

const WISH_SUGGESTIONS = [
  'Mong em sớm tìm được mái ấm trọn đời!',
  'Mùa đông này em sẽ không còn cô đơn nữa.',
  'Chúc em luôn ăn ngoan, chóng lớn và khỏe mạnh!'
];

function PetImage({ animal, className, loading = 'eager' }) {
  return (
    <img
      className={className}
      src={animal.avatar}
      alt={`${animal.name}, ${animal.breed}`}
      loading={loading}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = FALLBACK_IMAGE;
      }}
    />
  );
}

export default function ChooseFriendPreview({ onWishSubmitted, initialAnimalId = null }) {
  const [selectedAnimal, setSelectedAnimal] = useState(() => {
    if (typeof window !== 'undefined') {
      const parsed = parseJourneyLocation(window.location, ANIMALS);
      if (parsed.type === 'write' && parsed.animal) {
        return parsed.animal;
      }
    }
    if (initialAnimalId) {
      const found = ANIMALS.find((a) => a.id === initialAnimalId);
      if (found) return found;
    }
    return ANIMALS[0];
  });
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const parsed = parseJourneyLocation(window.location, ANIMALS);
      if (parsed.type === 'write' && parsed.animal) {
        return 'write';
      }
    }
    return 'choose';
  });
  const [wishText, setWishText] = useState(
    'Mong em sớm tìm được một mái nhà ngập tràn tình yêu thương và luôn được chở che.'
  );
  const [senderName, setSenderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatusText, setSubmitStatusText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Synchronize with direct hash routing: #/write-wish/:animalId and #/rescue-station
  useEffect(() => {
    normalizeLegacyPathname();

    const handleLocationChange = () => {
      const loc = parseJourneyLocation(window.location, ANIMALS);

      if (loc.type === 'write') {
        setSelectedAnimal(loc.animal);
        setMode('write');
        requestAnimationFrame(() => {
          document.getElementById('choose-friend')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }

      if (loc.type === 'invalid_animal') {
        // Fall back safely to choose mode and canonical URL
        setMode('choose');
        navigateToChoose({ replace: true });
        return;
      }

      if (loc.type === 'station') {
        setMode('choose');
        requestAnimationFrame(() => {
          document.getElementById('station')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }

      if (loc.type === 'choose') {
        setMode('choose');
        if (window.location.hash === '#choose' || window.location.hash === '#choose-friend') {
          requestAnimationFrame(() => {
            document.getElementById('choose-friend')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const identityLine = useMemo(() => {
    const species = selectedAnimal.type === 'dog' ? 'Bé cún' : 'Bé mèo';
    return `${species} · ${selectedAnimal.age} · ${selectedAnimal.status}`;
  }, [selectedAnimal]);

  const handleSelectAnimal = (animal) => {
    setSelectedAnimal(animal);
    setErrorMessage('');
  };

  const handleContinueToWrite = (animal = selectedAnimal) => {
    setSelectedAnimal(animal);
    setMode('write');
    setErrorMessage('');
    setSubmitStatusText('');

    navigateToWriteWish(animal.id);

    requestAnimationFrame(() => {
      document.getElementById('choose-friend')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleBackToChoose = () => {
    setMode('choose');
    setErrorMessage('');
    setSubmitStatusText('');

    navigateToChoose();

    requestAnimationFrame(() => {
      document.getElementById('choose-friend')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleSubmitWish = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const message = wishText.trim();
    if (message.length < 2) {
      setErrorMessage('Lời chúc cần ít nhất 2 ký tự.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSubmitStatusText('Đang đưa lời chúc của bạn vào khu vườn…');

    try {
      const createdWish = await submitWish({
        animalId: selectedAnimal.id,
        animalName: selectedAnimal.name,
        animalType: selectedAnimal.type,
        animalBreed: selectedAnimal.breed,
        animalAvatar: selectedAnimal.avatar,
        message,
        senderDisplayName: senderName
      });

      onWishSubmitted?.(createdWish);
      setWishText('');
      setSenderName('');

      navigateToRescueStation();

      // Smooth direct navigation to Wish Garden
      setTimeout(() => {
        setSubmitStatusText('');
        setIsSubmitting(false);
        setMode('choose');
        const stationEl = document.getElementById('station');
        if (stationEl) {
          stationEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 450);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Chưa thể gửi lời chúc. Hãy thử lại nhé.');
      setSubmitStatusText('');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="landing-section landing-section--cream" id="choose-friend" data-mode={mode}>
      <div id="choose" className="section-scroll-anchor" />
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header pet-choice-header">
          <div className="section-badge section-badge--soft">
            <Heart size={14} fill="currentColor" />
            <span>{mode === 'choose' ? 'Gặp một người bạn nhỏ' : 'Gửi một lời chúc'}</span>
          </div>
          <h2 className="section-title">
            {mode === 'choose' ? 'Chọn một người bạn nhỏ' : `Viết lời chúc cho ${selectedAnimal.name}`}
          </h2>
          <p className="section-subtitle">
            {mode === 'choose'
              ? 'Làm quen với các bé đang được chăm sóc tại trạm và chọn một người bạn để gửi lời yêu thương.'
              : `Một lời nhắn chân thành từ bạn sẽ xuất hiện ngay trong Khu Vườn Yêu Thương của ${selectedAnimal.name}.`}
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="pet-choice-layout">
          {/* LEFT: Pet Photo */}
          <div className="pet-choice-photo-card">
            <PetImage animal={selectedAnimal} className="pet-choice-photo" />

          </div>

          {/* RIGHT: Content View (Choose vs Write Wish) */}
          <div className="pet-choice-content">
            {mode === 'choose' ? (
              <>
                <div className="pet-profile-copy">
                  <h3>{selectedAnimal.name}</h3>
                  <p className="pet-profile-identity">{identityLine}</p>
                  <p className="pet-profile-story">{selectedAnimal.story}</p>
                  <div className="pet-profile-tags" aria-label="Tính cách nổi bật">
                    {selectedAnimal.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="pet-selector">
                  <p className="pet-selector-label">Các bé khác tại trạm</p>
                  <div className="pet-selector-grid">
                    {ANIMALS.map((animal) => {
                      const isSelected = animal.id === selectedAnimal.id;
                      return (
                        <button
                          key={animal.id}
                          type="button"
                          className={`pet-selector-card ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleSelectAnimal(animal)}
                          aria-pressed={isSelected}
                        >
                          <PetImage animal={animal} className="pet-selector-image" loading="lazy" />
                          <span className="pet-selector-copy">
                            <strong>{animal.name}</strong>
                            <small>{animal.type === 'dog' ? 'Cún' : 'Mèo'} · {animal.age.replace('Khoảng ', '')}</small>
                          </span>
                          {isSelected ? (
                            <span className="pet-selector-check" aria-hidden="true"><Check size={12} /></span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  className="choose-continue-cta"
                  onClick={() => handleContinueToWrite(selectedAnimal)}
                >
                  <Heart size={18} fill="currentColor" />
                  <span>Viết lời chúc cho {selectedAnimal.name}</span>
                  <ArrowRight size={18} />
                </button>
              </>
            ) : (
              <form className="wish-compose-card" onSubmit={handleSubmitWish}>
                <div className="wish-compose-heading">
                  <div>
                    <h3>Thân gửi {selectedAnimal.name},</h3>
                    <p>{selectedAnimal.breed} · {selectedAnimal.age}</p>
                  </div>
                  <PetImage animal={selectedAnimal} className="wish-compose-avatar" />
                </div>

                <label className="wish-compose-field">
                  <span>Lời chúc của bạn</span>
                  <textarea
                    value={wishText}
                    onChange={(event) => {
                      setWishText(event.target.value.slice(0, 200));
                      if (errorMessage) setErrorMessage('');
                    }}
                    rows={5}
                    maxLength={200}
                    placeholder={`Viết điều bạn muốn gửi đến ${selectedAnimal.name}...`}
                  />
                  <small className="wish-compose-count">{wishText.length}/200</small>
                </label>

                <div className="wish-compose-suggestions" aria-label="Gợi ý lời chúc">
                  {WISH_SUGGESTIONS.map((suggestion) => (
                    <button key={suggestion} type="button" onClick={() => setWishText(suggestion)}>
                      {suggestion}
                    </button>
                  ))}
                </div>

                <label className="wish-compose-field wish-compose-name">
                  <span className="wish-compose-label-row">
                    <strong>Tên hiển thị của bạn</strong>
                    <small>(Không bắt buộc)</small>
                  </span>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(event) => setSenderName(event.target.value.slice(0, 30))}
                    maxLength={30}
                    autoComplete="nickname"
                    placeholder="Ví dụ: Minh Anh"
                  />
                  <small className="wish-compose-help-text">
                    Tên này sẽ xuất hiện cùng lời chúc của bạn trong Khu Vườn Yêu Thương. Để trống nếu bạn muốn gửi ẩn danh.
                  </small>
                </label>

                {errorMessage ? <p className="wish-compose-error" role="alert">{errorMessage}</p> : null}

                <div className="wish-compose-actions">
                  <button type="button" className="letter-back-btn" onClick={handleBackToChoose}>
                    <ArrowLeft size={16} />
                    <span>Chọn bé khác</span>
                  </button>
                  <button
                    type="submit"
                    className="letter-submit-cta"
                    disabled={isSubmitting || wishText.trim().length < 2}
                  >
                    <Send size={16} />
                    <span>
                      {isSubmitting
                        ? (submitStatusText || 'Đang đưa vào khu vườn...')
                        : 'Gửi vào Khu Vườn Yêu Thương'}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
