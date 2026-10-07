import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ExternalLink } from '../ui/Icons';
import peekingCat from '../../assets/decor/peeking-cat.png';
import peekingDog from '../../assets/decor/peeking-dog.png';
import { exportKeepsakeCard } from './keepsakeExport';
import './gogo-sharing.css';

const MAX_PHOTO_SIZE = 10 * 1024 * 1024;
const SUPPORTED_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const SESSION_KEY = 'gogomeme-sharing-v2';
const LIVE_SITE_URL = 'https://gogomeme.vercel.app';

const CAPTION_STYLES = {
  short: `🐾 Mình vừa hoàn thành một hành trình nhỏ cùng GogoMeme để học cách đồng hành an toàn với những người bạn bốn chân.

Mỗi hành động nhỏ đều có thể lan tỏa thêm một chút yêu thương. 🧡

🌐 Khám phá GogoMeme: ${LIVE_SITE_URL}

#GogoMeme #BaoVeDongVat #ViCongDong`,
  warm: `🐾 CÙNG GOGOMEME LAN TỎA YÊU THƯƠNG

Mình vừa có một hành trình nhỏ cùng GogoMeme — nơi mỗi lời chúc, mỗi điều được học và mỗi lượt chia sẻ đều có thể giúp câu chuyện về những bé chó mèo cần được yêu thương đi xa hơn. 🧡

Bạn cũng có thể ghé thăm GogoMeme, gửi một lời chúc và thử sức với 4 tình huống để biết cách phản ứng phù hợp khi gặp một bé cần giúp đỡ.

✨ Một hành động nhỏ cũng có thể bắt đầu một thay đổi lớn.

Fanpage: Chạm Bốn Chân GogoMeme
Email: chambonchan.gogomeme@gmail.com

🌐 Khám phá GogoMeme: ${LIVE_SITE_URL}

#GogoMeme #BaoVeDongVat #CuuTroChoMeo #AdoptDontShop`,
  full: `🐾 CÙNG GOGOMEME LAN TỎA YÊU THƯƠNG
ĐẾN NHỮNG NGƯỜI BẠN BỐN CHÂN

Mình vừa có một hành trình nhỏ cùng GogoMeme — nơi mỗi lời chúc, mỗi điều được học và mỗi lượt chia sẻ đều có thể giúp câu chuyện về những bé chó mèo cần được yêu thương đi xa hơn. 🧡

Bạn cũng có thể đồng hành cùng GogoMeme:

1️⃣ Ghé thăm website GogoMeme: ${LIVE_SITE_URL}

2️⃣ Khám phá những câu chuyện về các bé chó mèo và gửi một lời chúc vào Khu Vườn Yêu Thương.

3️⃣ Thử sức với 4 tình huống để biết cách phản ứng phù hợp khi gặp một bé cần giúp đỡ.

4️⃣ Tạo tấm ảnh của riêng bạn và chia sẻ hành trình này đến mọi người.

✨ Một hành động nhỏ cũng có thể bắt đầu một thay đổi lớn.

📬 Kết nối với GogoMeme

Fanpage: Chạm Bốn Chân GogoMeme
Email: chambonchan.gogomeme@gmail.com

#GogoMeme #BaoVeDongVat #CuuTroThuCung #CuuTroChoMeo #AdoptDontShop #ViCongDong`
};

function readSession() {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(SESSION_KEY));
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}

function writeSession(next) {
  try {
    const current = readSession();
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...current, ...next }));
  } catch {
    // In-memory state still keeps the experience intact if storage is unavailable.
  }
}

function ProgressIndicator({ activeStep, completedSteps }) {
  const labels = ['Tạo ảnh', 'Lời chia sẻ', 'Facebook'];
  return (
    <ol className="gogo-share-progress" aria-label="Tiến trình chia sẻ">
      {labels.map((label, index) => {
        const step = index + 1;
        const isDone = completedSteps.includes(step);
        const isActive = activeStep === step;
        return (
          <li
            key={label}
            className={isDone ? 'is-done' : isActive ? 'is-active' : ''}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`${label}: ${isDone ? 'đã hoàn thành' : isActive ? 'đang thực hiện' : 'chưa thực hiện'}`}
          >
            <span className="gogo-share-progress-dot" aria-hidden="true">{isDone ? '✓' : step}</span>
            <span>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function KeepsakeCard({ photoUrl, displayName, position, zoom, onPointerDown, onPointerMove, onPointerUp }) {
  const trimmedName = displayName.trim();
  const nameLength = Array.from(trimmedName).length;
  const nameLengthClass = nameLength > 30 ? 'is-very-long' : nameLength > 20 ? 'is-long' : '';

  return (
    <div className="gogo-keepsake-card" aria-label="Xem trước ảnh kỷ niệm GogoMeme">
      <span className="gogo-card-leaf gogo-card-leaf--one" aria-hidden="true" />
      <span className="gogo-card-leaf gogo-card-leaf--two" aria-hidden="true" />
      <span className="gogo-card-flower gogo-card-flower--one" aria-hidden="true">✿</span>
      <span className="gogo-card-flower gogo-card-flower--two" aria-hidden="true">✿</span>
      <span className="gogo-card-paw" aria-hidden="true"><i /><i /><i /><i /><b /></span>
      <img className="gogo-card-logo" src="/images/brand/gogomeme-logo.png" alt="GogoMeme" />
      <div className="gogo-card-title">
        <span aria-hidden="true">✿</span>
        <h3>Một khoảnh khắc cùng GogoMeme</h3>
        <span aria-hidden="true">♡</span>
      </div>
      <div
        className={`gogo-card-photo ${photoUrl ? 'has-photo' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="gogo-card-photo-viewport">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Ảnh bạn đã chọn"
              draggable="false"
              style={{ objectPosition: `${position.x}% ${position.y}%`, transform: `scale(${zoom})` }}
            />
          ) : (
            <div className="gogo-card-photo-placeholder">
              <span aria-hidden="true">▧</span>
              <strong>Ảnh của bạn</strong>
              <small>sẽ xuất hiện tại đây</small>
            </div>
          )}
        </div>
        <img className="gogo-card-peek gogo-card-peek--cat" src={peekingCat} alt="" aria-hidden="true" />
        <img className="gogo-card-peek gogo-card-peek--dog" src={peekingDog} alt="" aria-hidden="true" />
      </div>
      {trimmedName ? <p className={`gogo-card-name ${nameLengthClass}`}>{trimmedName}</p> : null}
      <p className="gogo-card-thanks">Cảm ơn bạn đã ghé thăm GogoMeme, gửi một lời chúc và đồng hành cùng những người bạn bốn chân.</p>
      <p className="gogo-card-emotion">Mỗi hành động nhỏ đều có thể lan tỏa thêm một chút yêu thương.</p>
      <span className="gogo-card-bottom-decor" aria-hidden="true">♡&nbsp;&nbsp;✦&nbsp;&nbsp;♡</span>
    </div>
  );
}

function CollapsedStep({ step, children, onOpen }) {
  return (
    <button type="button" className="gogo-collapsed-step" onClick={onOpen}>
      <CheckCircle2 size={19} />
      <span>{children}</span>
      <small>Chỉnh sửa</small>
      <span className="gogo-collapsed-step-number" aria-hidden="true">{step}</span>
    </button>
  );
}

export default function GogoMemeSharingExperience({ onRestart }) {
  const [saved] = useState(readSession);
  const [showAcknowledgement, setShowAcknowledgement] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [displayName, setDisplayName] = useState(() => saved.displayName || '');
  const [caption, setCaption] = useState(() => saved.caption || CAPTION_STYLES.full);
  const [captionStyle, setCaptionStyle] = useState(() => saved.captionStyle || 'full');
  const [photoPosition, setPhotoPosition] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(1);
  const [fileError, setFileError] = useState('');
  const [exportStatus, setExportStatus] = useState('idle');
  const [copyStatus, setCopyStatus] = useState('idle');
  const dragState = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowAcknowledgement(false), 1550);
    return () => window.clearTimeout(timer);
  }, []);

  const persistStepState = (nextActive, nextCompleted = completedSteps) => {
    setActiveStep(nextActive);
    setCompletedSteps(nextCompleted);
    writeSession({ activeStep: nextActive, completedSteps: nextCompleted });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!SUPPORTED_PHOTO_TYPES.has(file.type)) {
      setFileError('Vui lòng chọn ảnh JPG, PNG hoặc WebP.');
      event.target.value = '';
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setFileError('Ảnh vượt quá 10 MB. Hãy chọn một ảnh nhẹ hơn.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(String(reader.result));
      setPhotoPosition({ x: 50, y: 50 });
      setZoom(1);
      setFileError('');
      setExportStatus('idle');
    };
    reader.onerror = () => setFileError('Không thể đọc ảnh này. Hãy thử một tệp khác.');
    reader.readAsDataURL(file);
  };

  const handleNameChange = (event) => {
    const value = event.target.value.slice(0, 40);
    setDisplayName(value);
    writeSession({ displayName: value });
  };

  const handleCaptionChange = (event) => {
    const value = event.target.value;
    setCaption(value);
    writeSession({ caption: value });
  };

  const selectCaptionStyle = (style) => {
    setCaptionStyle(style);
    setCaption(CAPTION_STYLES[style]);
    writeSession({ captionStyle: style, caption: CAPTION_STYLES[style] });
  };

  const handleDownload = async () => {
    if (!photoUrl || exportStatus === 'working') return;
    setExportStatus('working');
    try {
      await exportKeepsakeCard({ photoUrl, displayName, photoPosition, zoom });
      setExportStatus('success');
      const nextCompleted = completedSteps.includes(1) ? completedSteps : [...completedSteps, 1];
      persistStepState(2, nextCompleted);
      window.setTimeout(() => setExportStatus('idle'), 2200);
    } catch (error) {
      console.error('[GogoMeme] Không thể xuất ảnh:', error);
      setExportStatus('error');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopyStatus('success');
      const nextCompleted = completedSteps.includes(2) ? completedSteps : [...completedSteps, 2];
      persistStepState(3, nextCompleted);
      window.setTimeout(() => setCopyStatus('idle'), 2200);
    } catch {
      setCopyStatus('error');
    }
  };

  const handlePointerDown = (event) => {
    if (!photoUrl) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = { clientX: event.clientX, clientY: event.clientY, origin: photoPosition };
  };

  const handlePointerMove = (event) => {
    if (!dragState.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPhotoPosition({
      x: Math.min(100, Math.max(0, dragState.current.origin.x - ((event.clientX - dragState.current.clientX) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, dragState.current.origin.y - ((event.clientY - dragState.current.clientY) / rect.height) * 100))
    });
  };

  const handlePointerUp = (event) => {
    if (dragState.current && event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragState.current = null;
  };

  const handleRestart = () => {
    try { window.sessionStorage.removeItem(SESSION_KEY); } catch { /* Optional cleanup. */ }
    onRestart?.();
  };

  if (showAcknowledgement) {
    return (
      <div className="gogo-completion-moment" role="status" aria-live="polite">
        <span className="gogo-completion-paw" aria-hidden="true">🐾</span>
        <div>
          <strong>Bạn đã hoàn thành 4 tình huống!</strong>
          <p>Cảm ơn bạn đã dành thời gian đồng hành cùng những người bạn bốn chân.</p>
        </div>
        <span className="gogo-completion-spark gogo-completion-spark--one" aria-hidden="true">✦</span>
        <span className="gogo-completion-spark gogo-completion-spark--two" aria-hidden="true">✦</span>
      </div>
    );
  }

  return (
    <div className="gogo-sharing-experience">
      <header className="gogo-sharing-header">
        <div>
          <span className="gogo-sharing-kicker"> 4/4 tình huống đã hoàn thành</span>
          <h2>Lưu lại khoảnh khắc cùng GogoMeme</h2>
          <p>Một tấm ảnh nhỏ để cảm ơn bạn đã ghé thăm, gửi lời chúc và đồng hành cùng những người bạn bốn chân.</p>
        </div>
        <button type="button" className="gogo-skip-button" onClick={handleRestart}>Làm lại hành trình</button>
      </header>

      <ProgressIndicator activeStep={activeStep} completedSteps={completedSteps} />

      {completedSteps.includes(1) && activeStep !== 1 ? (
        <CollapsedStep step="1" onOpen={() => persistStepState(1)}>Ảnh GogoMeme của bạn đã sẵn sàng</CollapsedStep>
      ) : (
        <section className="gogo-share-step gogo-share-step--photo" aria-labelledby="gogo-step-one-title">
          <div className="gogo-card-preview-wrap">
            <KeepsakeCard photoUrl={photoUrl} displayName={displayName} position={photoPosition} zoom={zoom} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} />

          </div>
          <div className="gogo-photo-controls">
            <span className="gogo-step-label">Bước 1</span>
            <h3 id="gogo-step-one-title">Tạo ảnh của bạn</h3>
            <p>Ảnh chỉ được dùng ngay trên thiết bị này để xem trước và tải xuống.</p>
            <label className="gogo-file-picker">
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} />
              <span className="gogo-file-picker-plus" aria-hidden="true">+</span>
              <span><strong>{photoUrl ? 'Chọn ảnh khác' : 'Chọn ảnh từ thiết bị'}</strong><small>JPG, PNG hoặc WebP · tối đa 10 MB</small></span>
            </label>
            {fileError ? <p className="gogo-inline-message is-error" role="alert">{fileError}</p> : null}
            <label className="gogo-field-label" htmlFor="gogo-display-name">Tên hiển thị <small>(không bắt buộc)</small></label>
            <input id="gogo-display-name" className="gogo-text-input" value={displayName} onChange={handleNameChange} maxLength={40} placeholder="Tên của bạn" />
            {photoUrl ? (
              <div className="gogo-crop-controls">

                <label htmlFor="gogo-photo-zoom">Thu phóng ảnh <output>{Math.round(zoom * 100)}%</output></label>
                <input id="gogo-photo-zoom" type="range" min="1" max="1.6" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
              </div>
            ) : null}
            <button type="button" className="gogo-primary-button" onClick={handleDownload} disabled={!photoUrl || exportStatus === 'working'} aria-live="polite">
              {exportStatus === 'working' ? 'Đang tạo ảnh…' : exportStatus === 'success' ? 'Đã lưu ảnh ✓' : 'Tải ảnh của bạn'}
            </button>
            {exportStatus === 'error' ? <p className="gogo-inline-message is-error" role="alert">Chưa thể lưu ảnh. Hãy thử lại.</p> : null}
          </div>
        </section>
      )}

      {completedSteps.includes(1) ? (
        completedSteps.includes(2) && activeStep !== 2 ? (
          <CollapsedStep step="2" onOpen={() => persistStepState(2)}>Lời chia sẻ đã sẵn sàng</CollapsedStep>
        ) : (
          <section className="gogo-share-step gogo-share-step--caption" aria-labelledby="gogo-step-two-title">
            <div className="gogo-step-copy">
              <span className="gogo-step-label">Bước 2</span>
              <h3 id="gogo-step-two-title">Chuẩn bị lời chia sẻ</h3>
              <p>Bạn có thể dùng gợi ý bên dưới hoặc chỉnh lại theo cách của riêng mình.</p>
            </div>
            <div className="gogo-caption-editor">
              <div className="gogo-caption-options" aria-label="Phong cách caption">
                {[
                  ['short', 'Ngắn gọn'],
                  ['warm', 'Ấm áp'],
                  ['full', 'Đầy đủ']
                ].map(([value, label]) => (
                  <button key={value} type="button" className={captionStyle === value ? 'is-active' : ''} onClick={() => selectCaptionStyle(value)} aria-pressed={captionStyle === value}>{label}</button>
                ))}
              </div>
              <label className="gogo-field-label" htmlFor="gogo-caption">Caption Facebook</label>
              <textarea id="gogo-caption" value={caption} onChange={handleCaptionChange} rows={9} />
              <button type="button" className="gogo-secondary-button" onClick={handleCopy} aria-live="polite">{copyStatus === 'success' ? 'Đã sao chép ✓' : 'Sao chép caption'}</button>
              {copyStatus === 'error' ? <p className="gogo-inline-message is-error" role="alert">Trình duyệt chưa cho phép sao chép. Bạn có thể chọn và sao chép nội dung thủ công.</p> : null}
            </div>
          </section>
        )
      ) : null}

      {completedSteps.includes(1) && completedSteps.includes(2) ? (
        <section className="gogo-share-step gogo-share-step--facebook" aria-labelledby="gogo-step-three-title">
          <div className="gogo-facebook-celebration">
            <span className="gogo-ready-seal" aria-hidden="true">✓</span>
            <div>
              <span className="gogo-step-label">Bước 3 · Hoàn tất</span>
              <h3 id="gogo-step-three-title">Mang yêu thương đi xa hơn</h3>
              <p>Ảnh và lời chia sẻ đã ở trên thiết bị của bạn. Chỉ còn một bước nhỏ để đăng bài.</p>
            </div>
          </div>
          <div className="gogo-share-handoff">
            <ol className="gogo-share-runway" aria-label="Ba bước đăng bài lên Facebook">
              <li className="is-ready"><span aria-hidden="true">✓</span><div><strong>Ảnh</strong><small>Đã tải về</small></div></li>
              <li className="is-ready"><span aria-hidden="true">✓</span><div><strong>Caption</strong><small>Đã sao chép</small></div></li>
              <li className="is-next"><span aria-hidden="true">3</span><div><strong>Facebook</strong><small>Thêm ảnh và dán caption</small></div></li>
            </ol>
            <a className="gogo-facebook-button" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">f</span> Mở Facebook để đăng bài <ExternalLink size={17} /></a>
            <small>Chia sẻ hoàn toàn tùy chọn. GogoMeme không đăng bài hoặc truy cập tài khoản của bạn.</small>
          </div>
        </section>
      ) : null}
    </div>
  );
}
