
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
      <div className="absolute top-6 left-6 right-6 bg-gradient-to-br from-slate-900/90 via-purple-900/90 to-indigo-900/90 backdrop-blur-xl rounded-3xl border border-white/10 p-6 text-white shadow-2xl max-w-sm mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-3xl animate-pulse">🔮</div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
            Mystic Oracle
          </h3>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">
          Click the enchanted sphere to unveil your daily wisdom and guidance from the cosmic realm.
        </p>
        <div className="mt-4 flex items-center justify-center">
          <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full border border-purple-400/30">
            <span className="text-xs font-medium text-purple-200">One reading per day</span>
          </div>
        </div>
      </div>
    );
  }

  // Loading state while consulting the stars
  if (isRotating) {
    return (
      <div className="absolute top-6 left-6 right-6 bg-gradient-to-br from-slate-900/90 via-purple-900/90 to-indigo-900/90 backdrop-blur-xl rounded-3xl border border-white/10 p-6 text-white shadow-2xl max-w-sm mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-3xl animate-spin">🌟</div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
            Reading the Stars...
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <p className="text-sm text-slate-200 animate-pulse">Channeling cosmic energy...</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <p className="text-sm text-slate-200 animate-pulse" style={{ animationDelay: '0.3s' }}>Consulting the universe...</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            <p className="text-sm text-slate-200 animate-pulse" style={{ animationDelay: '0.6s' }}>Weaving your destiny...</p>
          </div>
        </div>
      </div>
    );
  }

  // Daily fortune display
  if (showFortune) {
    return (
      <div className="absolute top-6 left-6 right-6 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl border border-white/20 p-6 text-white shadow-2xl max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl animate-pulse">🔮</div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
              Your Destiny
            </h3>
          </div>
          <div className="text-2xl animate-pulse">✨</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 rounded-2xl p-4 border border-purple-400/20 mb-4">
          <p className="text-base leading-relaxed text-slate-100 font-medium text-center">
            {fortune}
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800/50 to-purple-800/50 rounded-full border border-slate-600/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-slate-300">
              {hasUsedToday ? "Return at dawn for new wisdom" : "Oracle renewed daily"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
