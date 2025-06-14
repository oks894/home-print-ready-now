
interface FortuneDisplayProps {
  hasUsedToday: boolean;
  showFortune: boolean;
  isRotating: boolean;
  fortune: string;
}

export const FortuneDisplay = ({ hasUsedToday, showFortune, isRotating, fortune }: FortuneDisplayProps) => {
  // Instructions when fortune hasn't been used today
  if (!hasUsedToday && !showFortune) {
    return (
      <div className="absolute top-4 left-4 right-4 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-pink-900/40 backdrop-blur-lg rounded-2xl border border-white/20 p-4 text-white shadow-2xl max-w-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">🔮</div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Fortune Crystal
          </h3>
        </div>
        <p className="text-sm text-purple-100">
          Touch the mystical orb to reveal your daily fortune!
        </p>
      </div>
    );
  }

  // Loading state while consulting the stars
  if (isRotating) {
    return (
      <div className="absolute top-4 left-4 right-4 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-pink-900/40 backdrop-blur-lg rounded-2xl border border-white/20 p-4 text-white shadow-2xl max-w-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl animate-spin">🔮</div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Consulting the Stars...
          </h3>
        </div>
        <p className="text-sm text-purple-100 animate-pulse">
          The cosmic energies are aligning for you...
        </p>
      </div>
    );
  }

  // Daily fortune display
  if (showFortune) {
    return (
      <div className="absolute top-4 left-4 right-4 bg-gradient-to-br from-purple-900/30 via-indigo-900/30 to-pink-900/30 backdrop-blur-lg rounded-2xl border border-white/20 p-4 text-white shadow-2xl max-w-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl animate-pulse">🔮</div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Your Daily Fortune
          </h3>
          <div className="text-2xl animate-pulse">⭐</div>
        </div>
        
        <p className="text-sm leading-relaxed text-purple-100 font-medium mb-3">
          {fortune}
        </p>
        
        <div className="text-xs text-purple-200/70 text-center">
          {hasUsedToday ? "✨ Come back tomorrow for a new fortune ✨" : "✨ Your fortune updates daily ✨"}
        </div>
      </div>
    );
  }

  // Already used today message
  if (hasUsedToday && !showFortune) {
    return (
      <div className="absolute top-4 left-4 right-4 bg-gradient-to-br from-gray-800/40 via-slate-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl border border-white/20 p-4 text-white shadow-2xl max-w-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">🌙</div>
          <h3 className="text-lg font-bold text-gray-300">
            Fortune Used Today
          </h3>
        </div>
        <p className="text-sm text-gray-300">
          The crystal's power has been exhausted for today. Return tomorrow for a new fortune!
        </p>
      </div>
    );
  }

  return null;
};
