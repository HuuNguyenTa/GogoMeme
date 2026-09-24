import React from 'react';
import { X, Heart, Sparkles, Volume2 } from '../ui/Icons';

export default function StoryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>📻</span>
            <h3 style={{ fontFamily: 'Lexend, sans-serif', fontSize: 19, margin: 0, fontWeight: 600 }}>
              Tiếng Lòng Từ Những Bạn Nhỏ
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">
            <X size={22} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center', padding: '36px 30px' }}>
          <div style={{
            position: 'relative',
            borderRadius: 20,
            overflow: 'hidden',
            height: 240,
            marginBottom: 24,
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80"
              alt="Câu chuyện Trạm Yêu Thương"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 40%, rgba(20,15,12,0.85) 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: 20,
              color: '#fff',
              textAlign: 'left'
            }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#ff9a76', textTransform: 'uppercase' }}>Podcast Radio #01</span>
                <h4 style={{ margin: '4px 0 0', fontSize: 17, fontWeight: 600 }}>Từ Góc Phố Mưa Tới Mái Ấm Trạm Yêu Thương</h4>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#554a43', textAlign: 'justify', marginBottom: 20 }}>
            “Bạn có từng nhìn vào mắt một chú chó đi lạc chưa? Đằng sau vẻ cảnh giác là sự đói lả, là nỗi nhớ một bàn tay vuốt ve đã từng thuộc về nó. Dự án Trạm Yêu Thương SSG105 được nhóm chúng mình ấp ủ không chỉ để kể những câu chuyện buồn, mà để cùng bạn thắp lên hy vọng: Bất kỳ ai trong chúng ta cũng có thể trở thành người hùng cứu lấy một sinh mạng bằng sự thấu hiểu và kiến thức đúng đắn.”
          </p>

          <div style={{
            background: '#fff3ec',
            border: '1px solid #ffd8c2',
            borderRadius: 16,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            textAlign: 'left'
          }}>
            <Volume2 size={24} color="#ff7e54" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ff7e54', display: 'block' }}>ÂM THANH BÌNH YÊN</span>
              <span style={{ fontSize: 13.5, color: '#6e645e' }}>Hãy bật loa ngoài hoặc đeo tai nghe để cảm nhận trọn vẹn thông điệp</span>
            </div>
          </div>

          <button
            className="btn-primary-warm"
            onClick={onClose}
            style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}
          >
            <Heart size={18} fill="currentColor" />
            <span>Cảm ơn vì đã lắng nghe</span>
          </button>
        </div>
      </div>
    </div>
  );
}
