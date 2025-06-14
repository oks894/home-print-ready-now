
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
            Ancient Oracle
          </h3>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed mb-4">
          Behold the mystical sphere of infinite wisdom. Within swirl the words of destiny, 
          waiting to reveal the secrets of your path.
        </p>
        <div className="text-xs text-purple-300 italic text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-400/20">
          "Click to unlock the mysteries within..."
        </div>
        <div className="mt-4 flex items-center justify-center">
          <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full border border-purple-400/30">
            <span className="text-xs font-medium text-purple-200">One revelation per day</span>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced loading state with mystical atmosphere
  if (isRotating) {
    return (
      <div className="absolute top-6 left-6 right-6 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl border border-white/20 p-6 text-white shadow-2xl max-w-sm mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-3xl animate-spin">🌟</div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
            Awakening Ancient Powers...
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <p className="text-sm text-slate-200 animate-pulse">The mystical words are stirring...</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <p className="text-sm text-slate-200 animate-pulse" style={{ animationDelay: '0.3s' }}>Ancient spirits whisper secrets...</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            <p className="text-sm text-slate-200 animate-pulse" style={{ animationDelay: '0.6s' }}>Your destiny unfolds...</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full border border-purple-400/40">
            <span className="text-xs text-purple-200 font-medium">✨ Divination in progress ✨</span>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced fortune display with mystical elements
  if (showFortune) {
    return (
      <div className="absolute top-6 left-6 right-6 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl border border-white/20 p-6 text-white shadow-2xl max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl animate-pulse">🔮</div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
              The Oracle Speaks
            </h3>
          </div>
          <div className="text-2xl animate-pulse">✨</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 rounded-2xl p-4 border border-purple-400/20 mb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 animate-pulse"></div>
          <p className="text-base leading-relaxed text-slate-100 font-medium text-center relative z-10">
            {fortune}
          </p>
        </div>
        
        <div className="text-center mb-4">
          <div className="inline-block text-xs text-purple-300 italic bg-gradient-to-r from-slate-800/50 to-purple-800/50 rounded-lg px-3 py-2 border border-purple-400/20">
            "The mystical words have chosen their message"
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800/50 to-purple-800/50 rounded-full border border-slate-600/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-slate-300">
              {hasUsedToday ? "The oracle rests until dawn" : "Ancient wisdom renewed daily"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
