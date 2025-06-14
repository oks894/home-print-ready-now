
export const getDailyFortune = (): string => {
  const fortunes = [
    "✨ Today brings unexpected creative breakthroughs in your projects",
    "🌟 Your patience will be rewarded with remarkable results",
    "💫 A small decision today will lead to big opportunities",
    "🔮 Trust your instincts - they're guiding you toward success",
    "⭐ Someone will offer valuable advice that changes your perspective",
    "🌙 Embrace new technologies - they hold the key to your growth",
    "💎 Your hard work is about to pay off in surprising ways",
    "🌸 Collaboration with others will unlock hidden potential",
    "🦋 A challenge today will become tomorrow's greatest strength",
    "🌺 Focus on quality over quantity - excellence is your path",
    "🍀 Lucky encounters await in unexpected places",
    "🌈 Your creativity will inspire others around you",
    "⚡ Energy and enthusiasm will open new doors",
    "🌻 Share your knowledge - teaching others enriches your soul",
    "🎯 Precision and attention to detail will set you apart",
    "🌊 Go with the flow - adaptability is your superpower today",
    "🔥 Passion projects will gain momentum and recognition",
    "🌟 A moment of clarity will illuminate your next steps",
    "💝 Kindness to others returns to you tenfold",
    "🚀 Innovation and bold thinking lead to breakthrough moments"
  ];

  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % fortunes.length;
  
  return fortunes[index];
};

export const checkDailyUsage = (): { hasUsedToday: boolean; savedFortune: string | null } => {
  const today = new Date().toDateString();
  const lastUsed = localStorage.getItem('fortuneLastUsed');
  
  if (lastUsed === today) {
    const savedFortune = localStorage.getItem('todaysFortune');
    return { hasUsedToday: true, savedFortune };
  }
  
  return { hasUsedToday: false, savedFortune: null };
};

export const saveDailyFortune = (fortune: string): void => {
  const today = new Date().toDateString();
  localStorage.setItem('fortuneLastUsed', today);
  localStorage.setItem('todaysFortune', fortune);
};
