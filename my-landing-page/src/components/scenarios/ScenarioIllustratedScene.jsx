// ScenarioIllustratedScene.jsx - Lightweight 2.5D Layered SVG/CSS Rescue Environment
// Renders 4 distinct story-driven scenes: roadside, box, empty-lot, rooftop
// Features subtle ambient motion (breathing, wind, leaves) and reactive safe-distance / relief states.

import React from 'react';

export default function ScenarioIllustratedScene({
  sceneType = 'roadside',
  isConfirmed = false,
  selectedOptionId = null,
  isRecommendedSelected = false,
  principle = 'DỪNG'
}) {
  const isCorrect = selectedOptionId === 'B';
  const isDangerA = selectedOptionId === 'A';
  const isPanicC = selectedOptionId === 'C';

  return (
    <div
      className={`scenario-scene-stage scene-type-${sceneType} ${isConfirmed ? 'is-confirmed' : ''}`}
      role="img"
      aria-label={`Hình ảnh minh họa tình huống cứu hộ: ${sceneType}`}
    >
      {/* ── 1. ROADSIDE SCENE (DỪNG XE AN TOÀN, ĐÈN HAZARD, CỰ LY 3-5M) ──── */}
      {sceneType === 'roadside' && (
        <div className="scene-viewport scene-roadside">
          {/* Top Status Eyebrow Badge */}
          <div className="scene-top-badge">
            <span className="scene-top-badge-dot" />
            <span>Hiện trường thực tế · NGUYÊN TẮC DỪNG</span>
          </div>

          {/* Dusk Sky Gradient & Moon / Distant Lamp */}
          <div className="scene-sky-roadside">
            <div className="scene-dusk-glow" />
            <div className="scene-crescent-moon" />
            {/* Distant passing car head/tail lights (safe background highway) */}
            <div className="distant-highway-flow">
              <span className="distant-car-light white-beam" />
              <span className="distant-car-light red-beam" />
            </div>
          </div>

          {/* Roadside Barrier & Asphalt Ground */}
          <div className="scene-road-ground">
            <div className="scene-curb-line" />
            <div className="scene-road-divider" />
            <div className="scene-shoulder-strip" />
          </div>

          {/* Streetlamp with Soft Light Cone Illuminating Rescue Zone */}
          <div className="scene-streetlamp">
            <div className="lamp-post" />
            <div className="lamp-head" />
            <div className="lamp-light-cone" />
          </div>

          {/* 1. XE MÁY DỪNG SÁT LỀ AN TOÀN + ĐÈN CẢNH BÁO HAZARD NHẤP NHÁY */}
          <div className="scene-parked-vehicle" title="Xe dừng sát lề an toàn ngoài làn xe chạy">
            {/* Amber Hazard Blinker Light Glow Cone */}
            <div className="hazard-warning-cone" />
            <div className="hazard-blinker-glow" />

            {/* Vehicle Status Tag */}
            <div className="hazard-status-pill">
              <span className="hazard-pulsing-dot" />
              <span>Đèn hazard BẬT</span>
            </div>

            {/* SVG Parked Scooter/Motorbike */}
            <svg viewBox="0 0 120 90" width="110" height="82" className="vehicle-svg">
              {/* Ground Shadow */}
              <ellipse cx="60" cy="84" rx="46" ry="6" fill="rgba(20, 10, 5, 0.4)" />
              {/* Back Wheel */}
              <circle cx="28" cy="68" r="16" fill="#221e20" stroke="#484044" strokeWidth="3" />
              <circle cx="28" cy="68" r="8" fill="#d9d2cb" />
              {/* Front Wheel */}
              <circle cx="94" cy="68" r="16" fill="#221e20" stroke="#484044" strokeWidth="3" />
              <circle cx="94" cy="68" r="8" fill="#d9d2cb" />
              {/* Kickstand */}
              <line x1="42" y1="70" x2="36" y2="84" stroke="#333" strokeWidth="3" strokeLinecap="round" />
              {/* Scooter Body Frame */}
              <path d="M26 62 Q36 46 54 48 L76 48 L90 32 L82 28 L66 45 L40 50 Z" fill="#eb6b4d" />
              <path d="M42 50 L64 50 L70 66 L34 66 Z" fill="#3e3438" />
              {/* Seat */}
              <path d="M30 46 C35 40 58 42 66 48 Z" fill="#1f1b1d" />
              {/* Helmet on seat */}
              <ellipse cx="50" cy="40" rx="9" ry="7" fill="#fbd38d" stroke="#c05621" strokeWidth="1.2" />
              {/* Front Handlebar & Mirror */}
              <path d="M80 34 L88 22 L94 24" stroke="#4a5568" strokeWidth="2.5" fill="none" />
              <circle cx="94" cy="22" r="3" fill="#cbd5e0" />
              {/* Front Turn Blinker (Hazard) */}
              <circle cx="96" cy="38" r="4" fill="#ff9900" className="svg-hazard-light" />
              {/* Rear Hazard Blinker */}
              <circle cx="20" cy="56" r="4" fill="#ff9900" className="svg-hazard-light" />
            </svg>
          </div>

          {/* 2. NGƯỜI CỨU HỘ HẠ THẤP NGƯỜI · QUAN SÁT & TRẤN AN BÉ TỪ XA */}
          <div className="scene-rescuer-anchor">
            {/* Reassuring Speech / Action Indicator */}
            <div className={`rescuer-speech-bubble ${isCorrect ? 'is-calming' : ''}`}>
              {isCorrect ? (
                <span>"Ngoan nào bé ơi, tụi mình ở đây..." 💕</span>
              ) : isDangerA ? (
                <span>"Nguy hiểm! Không lao vội ra đường!" ⚠️</span>
              ) : isPanicC ? (
                <span>"Không bấm còi! Bé sẽ hoảng sợ!" ⚠️</span>
              ) : (
                <span>Hạ thấp người · Nói nhỏ nhẹ trấn an</span>
              )}
            </div>

            {/* SVG Rescuer Crouching Gently (Low non-threatening posture) */}
            <svg viewBox="0 0 80 90" width="70" height="78" className="rescuer-svg">
              {/* Shadow */}
              <ellipse cx="40" cy="85" rx="26" ry="6" fill="rgba(20, 10, 5, 0.35)" />
              {/* Crouched Legs / Boots */}
              <path d="M26 84 C22 75 24 64 36 64 C42 64 45 74 54 84 Z" fill="#2d3748" />
              <ellipse cx="28" cy="84" rx="7" ry="4" fill="#1a202c" />
              <ellipse cx="54" cy="84" rx="7" ry="4" fill="#1a202c" />
              {/* Torso / Jacket (Orange community vest) */}
              <path d="M30 46 C30 38 52 38 52 46 L50 66 C42 68 36 68 32 66 Z" fill="#ff7a59" />
              {/* Reflective Safety Stripes on Jacket */}
              <path d="M33 52 H49" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 2" />
              <path d="M34 60 H48" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 2" />
              {/* Calm Open Palm Reassuring Hand reaching low */}
              <path d="M32 54 Q20 58 14 62" stroke="#ff7a59" strokeWidth="4" strokeLinecap="round" fill="none" />
              <ellipse cx="12" cy="63" rx="4" ry="3" fill="#fbd38d" />
              {/* Head & Cap */}
              <ellipse cx="41" cy="28" rx="10" ry="11" fill="#fbd38d" />
              <path d="M30 24 C30 16 52 16 52 24 L56 26 L41 24 Z" fill="#2b6cb0" />
              {/* Gentle Warm Eye & Smile */}
              <circle cx="36" cy="28" r="1.5" fill="#2d3748" />
              <path d="M34 32 Q38 35 42 32" stroke="#2d3748" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* 3. THƯỚC ĐO CỰ LY AN TOÀN 3–5M GIỮA NGƯỜI VÀ BÉ CÚN */}
          <div className={`scene-safe-distance-meter ${isCorrect ? 'meter-active' : ''}`}>
            <div className="meter-line">
              <span className="meter-arrow-l">◀</span>
              <span className="meter-dashed-bar" />
              <span className="meter-arrow-r">▶</span>
            </div>
            <div className="meter-label-pill">
              <span className="meter-icon">↔</span>
              <strong>CỰ LY AN TOÀN 3–5M</strong>
              {isCorrect && <span className="meter-check">✓ Đạt chuẩn</span>}
            </div>
          </div>

          {/* 4. CHỦ THỂ: BÉ CÚN SÁT DẢI PHÂN CÁCH (PHẢN ỨNG LINH HOẠT) */}
          <div
            className={`scene-animal-anchor ${
              isCorrect ? 'is-relieved' : isDangerA || isPanicC ? 'is-panicked' : 'is-frightened'
            }`}
          >
            {/* Reaction Hearts when correct reassurance is applied */}
            {isCorrect && (
              <div className="calm-hearts-float" aria-hidden="true">
                <span className="heart h1">💕</span>
                <span className="heart h2">✨</span>
              </div>
            )}

            {/* SVG Illustrated Puppy */}
            <svg
              className="scene-mascot-svg mascot-pup"
              viewBox="0 0 100 100"
              width="88"
              height="88"
            >
              {/* Shadow */}
              <ellipse cx="50" cy="88" rx="34" ry="8" fill="rgba(40, 24, 18, 0.28)" />

              {/* Body */}
              <rect x="30" y="44" width="40" height="42" rx="20" fill="#e8a86b" />
              {/* Belly */}
              <ellipse cx="50" cy="68" rx="14" ry="16" fill="#fff2df" />
              {/* Paws */}
              <ellipse cx="36" cy="84" rx="7" ry="5" fill="#d9914e" />
              <ellipse cx="64" cy="84" rx="7" ry="5" fill="#d9914e" />

              {/* Head */}
              <ellipse cx="50" cy="38" rx="26" ry="22" fill="#f4b577" />
              {/* Snout */}
              <ellipse cx="50" cy="44" rx="12" ry="9" fill="#fff5e6" />
              <ellipse cx="50" cy="40" rx="4" ry="3" fill="#3a251b" />

              {/* Ears */}
              <path
                d={isCorrect ? "M24 30 C16 16, 12 28, 20 40 Z" : "M24 34 C16 26, 14 42, 20 48 Z"}
                fill="#ba7536"
                className="pup-ear-l"
              />
              <path
                d={isCorrect ? "M76 30 C84 16, 88 28, 80 40 Z" : "M76 34 C84 26, 86 42, 80 48 Z"}
                fill="#ba7536"
                className="pup-ear-r"
              />

              {/* Eyes & Expression */}
              {isCorrect ? (
                // Happy curved eyes & blush
                <>
                  <path d="M40 36 Q44 32 48 36" stroke="#3a251b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M52 36 Q56 32 60 36" stroke="#3a251b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <ellipse cx="34" cy="42" rx="4" ry="2.5" fill="#ff9999" opacity="0.6" />
                  <ellipse cx="66" cy="42" rx="4" ry="2.5" fill="#ff9999" opacity="0.6" />
                </>
              ) : isDangerA || isPanicC ? (
                // Super terrified eyes
                <>
                  <circle cx="43" cy="36" r="4.5" fill="#e53e3e" />
                  <circle cx="43" cy="36" r="2.5" fill="#1a202c" />
                  <circle cx="57" cy="36" r="4.5" fill="#e53e3e" />
                  <circle cx="57" cy="36" r="2.5" fill="#1a202c" />
                  <path d="M37 29 L46 33" stroke="#e53e3e" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M63 29 L54 33" stroke="#e53e3e" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                // Worried wide eyes
                <>
                  <circle cx="43" cy="36" r="3.5" fill="#2d1c15" />
                  <circle cx="44.5" cy="35" r="1.2" fill="#ffffff" />
                  <circle cx="57" cy="36" r="3.5" fill="#2d1c15" />
                  <circle cx="58.5" cy="35" r="1.2" fill="#ffffff" />
                  <path d="M39 31 L46 33" stroke="#8c5828" strokeWidth="2" strokeLinecap="round" />
                  <path d="M61 31 L54 33" stroke="#8c5828" strokeWidth="2" strokeLinecap="round" />
                </>
              )}

              {/* Bandage on paw indicating hurt leg */}
              <rect x="60" y="78" width="9" height="7" rx="2" fill="#ffffff" stroke="#e0c4b2" strokeWidth="1" />
              <path d="M64.5 79.5 V83.5 M62.5 81.5 H66.5" stroke="#ff7e54" strokeWidth="1" />
            </svg>

            {/* Puppy Status Bubble */}
            <div className={`scene-speech-bubble ${isCorrect ? 'bubble-happy' : isDangerA || isPanicC ? 'bubble-danger' : ''}`}>
              {isCorrect ? (
                <span>Bé an tâm nằm yên, không lao ra đường! 💕</span>
              ) : isDangerA ? (
                <span>Bé hoảng hốt lùi sát gầm xe đang chạy! ⚠️</span>
              ) : isPanicC ? (
                <span>Bé run bần bật vì tiếng còi inh ỏi! ⚠️</span>
              ) : (
                <span>Bé đang run sợ sát dải phân cách...</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 2. CARDBOARD BOX SCENE (ABANDONED KITTENS) ────────────────────── */}
      {sceneType === 'box' && (
        <div className="scene-viewport scene-box-view">
          {/* Alley Wall Backdrop */}
          <div className="scene-alley-wall">
            <div className="wall-brick-pattern" />
            <div className="wall-baseboard" />
          </div>

          {/* Cozy Cardboard Box */}
          <div className="scene-box-container">
            {/* Warmth Radiance Aura when confirmed */}
            {isConfirmed && <div className="scene-warmth-glow" />}

            {/* Cardboard Box Surface */}
            <div className="cardboard-box">
              <div className="box-flap box-flap-l" />
              <div className="box-flap box-flap-r" />
              <div className="box-label-stamp">📦 MÈO SƠ SINH</div>
              <div className="box-soft-towel" />

              {/* 3 Tiny Kittens peeking */}
              <div className="kittens-cluster">
                {/* Kitten 1 (Calico) */}
                <div className="tiny-kitten k1">
                  <div className="k-ears ear-calico" />
                  <div className="k-head">
                    <span className="k-eye l" />
                    <span className="k-eye r" />
                    <span className="k-nose" />
                  </div>
                </div>
                {/* Kitten 2 (Tabby Center) */}
                <div className="tiny-kitten k2">
                  <div className="k-ears ear-tabby" />
                  <div className="k-head">
                    <span className="k-eye l" />
                    <span className="k-eye r" />
                    <span className="k-nose" />
                  </div>
                </div>
                {/* Kitten 3 (White/Cream) */}
                <div className="tiny-kitten k3">
                  <div className="k-ears ear-cream" />
                  <div className="k-head">
                    <span className="k-eye l" />
                    <span className="k-eye r" />
                    <span className="k-nose" />
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Veterinary Advice Highlight when confirmed */}
            {isConfirmed && (
              <div className="scene-vet-milk-indicator">
                <span className="indicator-badge">Sữa KMR chuyên dụng 🍼</span>
                <span className="indicator-sub">Giữ ấm thân nhiệt số 1</span>
              </div>
            )}

            <div className="scene-speech-bubble">
              {isConfirmed ? (
                <span>Các bé đã được ủ ấm đúng cách ✨</span>
              ) : (
                <span>3 bé chưa mở mắt, run rẩy vì lạnh...</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. EMPTY LOT SCENE (FRIGHTENED CHAINED DOG) ───────────────────── */}
      {sceneType === 'empty-lot' && (
        <div className="scene-viewport scene-lot-view">
          {/* Sunny Dry Field & Wooden Fence */}
          <div className="scene-lot-sky">
            <div className="scene-hot-sun" />
          </div>
          <div className="scene-fence-line">
            <div className="fence-post p1" />
            <div className="fence-post p2" />
            <div className="fence-post p3" />
            <div className="fence-rail" />
          </div>
          <div className="scene-lot-ground" />

          {/* Subject: Tired Chained Pup */}
          <div className={`scene-animal-anchor ${isConfirmed ? 'is-relieved' : 'is-frightened'}`}>
            {/* Water Bowl Placed at Safe Distance (Appears when confirmed) */}
            {isConfirmed && (
              <div className="scene-water-bowl-prop">
                <div className="bowl-liquid" />
                <span className="bowl-label">Tô nước sạch từ xa 💧</span>
              </div>
            )}

            <svg
              className="scene-mascot-svg mascot-chained"
              viewBox="0 0 100 100"
              width="88"
              height="88"
            >
              <ellipse cx="50" cy="88" rx="34" ry="8" fill="rgba(40, 24, 18, 0.18)" />
              {/* Chain graphic */}
              <path
                d="M10 75 Q30 78 46 64"
                stroke="#8c827a"
                strokeWidth="2.5"
                strokeDasharray="4,3"
                fill="none"
              />
              <rect x="28" y="44" width="44" height="42" rx="20" fill="#c7926b" />
              <ellipse cx="50" cy="38" rx="26" ry="22" fill="#d9a57e" />
              <ellipse cx="50" cy="44" rx="12" ry="9" fill="#fff5e6" />
              <ellipse cx="50" cy="40" rx="4" ry="3" fill="#3a251b" />

              {/* Collar */}
              <rect x="36" y="56" width="28" height="6" rx="3" fill="#d9534f" />

              {/* Eyes */}
              {isConfirmed ? (
                <>
                  <path d="M40 36 Q44 32 48 36" stroke="#3a251b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M52 36 Q56 32 60 36" stroke="#3a251b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="43" cy="36" r="3.5" fill="#2d1c15" />
                  <circle cx="57" cy="36" r="3.5" fill="#2d1c15" />
                  {/* Tongue panting */}
                  <ellipse cx="50" cy="51" rx="4" ry="6" fill="#ff7675" />
                </>
              )}
            </svg>

            <div className="scene-speech-bubble">
              {isConfirmed ? (
                <span>Bé đã uống nước và bình tâm lại 💧</span>
              ) : (
                <span>Bé đang kiệt sức vì khát và say nắng...</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. ROOFTOP SCENE (TRAPPED HIGH-PERCH CAT) ──────────────────────── */}
      {sceneType === 'rooftop' && (
        <div className="scene-viewport scene-rooftop-view">
          {/* Summer Sky & High Clouds */}
          <div className="scene-roof-sky">
            <div className="scene-cloud c1" />
            <div className="scene-cloud c2" />
          </div>

          {/* Roof Ledge & Terracotta Gutter */}
          <div className="scene-roof-structure">
            <div className="roof-ridge" />
            <div className="roof-metal-tiles" />
            <div className="roof-edge-rim" />
          </div>

          {/* Ground safety net indicated below */}
          {isConfirmed && (
            <div className="scene-safety-cushion-indicator">
              <span className="cushion-badge">Đệm xốp hứng an toàn bên dưới 🛡️</span>
              <span className="cushion-sub">Đội cứu hộ đang tiếp cận bằng thang rút</span>
            </div>
          )}

          {/* Anxious Cat on Edge */}
          <div className={`scene-animal-anchor ${isConfirmed ? 'is-relieved' : 'is-frightened'}`}>
            <svg
              className="scene-mascot-svg mascot-cat-edge"
              viewBox="0 0 100 100"
              width="88"
              height="88"
            >
              <ellipse cx="50" cy="88" rx="30" ry="7" fill="rgba(40, 24, 18, 0.18)" />
              {/* Cat Body */}
              <ellipse cx="50" cy="62" rx="20" ry="24" fill="#f8b072" />
              {/* Tail hanging down edge */}
              <path
                d={isConfirmed ? "M66 70 Q76 75 74 88" : "M66 70 Q80 82 72 92"}
                stroke="#e09453"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />

              {/* Head */}
              <circle cx="50" cy="38" r="22" fill="#fabc84" />
              {/* Ears */}
              <polygon points="32,24 38,40 26,38" fill="#f09852" />
              <polygon points="68,24 62,40 74,38" fill="#f09852" />

              {/* Eyes */}
              {isConfirmed ? (
                <>
                  <path d="M40 38 Q44 34 48 38" stroke="#3a251b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M52 38 Q56 34 60 38" stroke="#3a251b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <ellipse cx="42" cy="38" rx="4" ry="5.5" fill="#3a251b" />
                  <ellipse cx="43.5" cy="36.5" rx="1.5" ry="2" fill="#ffffff" />
                  <ellipse cx="58" cy="38" rx="4" ry="5.5" fill="#3a251b" />
                  <ellipse cx="59.5" cy="36.5" rx="1.5" ry="2" fill="#ffffff" />
                </>
              )}

              {/* Whiskers */}
              <line x1="28" y1="44" x2="16" y2="42" stroke="#5a3d28" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="28" y1="47" x2="18" y2="49" stroke="#5a3d28" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="72" y1="44" x2="84" y2="42" stroke="#5a3d28" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="72" y1="47" x2="82" y2="49" stroke="#5a3d28" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <div className="scene-speech-bubble">
              {isConfirmed ? (
                <span>Bé đã bình tĩnh ngồi xuống chờ thang 🌸</span>
              ) : (
                <span>Mái trơn trượt, bé đang sợ hãi đi lùi...</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Decorative Scene Badge */}
      <div className="scene-principle-pill">
        <span className="pill-dot" />
        <span>Góc nhìn hiện trường · {principle}</span>
      </div>
    </div>
  );
}

