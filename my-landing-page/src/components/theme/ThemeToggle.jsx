export default function ThemeToggle({ theme, onToggle }) {
  const isNight = theme === 'night';
  return (
    <button
      type="button"
      className="dock-item theme-toggle"
      aria-pressed={isNight}
      aria-label={isNight ? 'Chuyển sang chế độ ban ngày' : 'Chuyển sang chế độ ban đêm'}
      onClick={onToggle}
    >
      <svg className="theme-icon--sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5" />
      </svg>
      <svg className="theme-icon--moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7Z" />
      </svg>
    </button>
  );
}
