import { AppHeader } from "../layout/AppHeader";

const games = [
  { name: "SPIRE", desc: "Рискнёте сыграть? Победить может каждый", icon: "🧊", grad: "from-cyan-600 to-blue-900" },
  { name: "ИГРА В КАЛЬМАРА", desc: "Рискнёте сыграть?", icon: "🟥", grad: "from-pink-600 to-rose-900" },
  { name: "БОЙЦОВСКИЙ КЛУБ", desc: "Выигрывайте раунды. Поднимайтесь в лидерборде", icon: "🥊", grad: "from-orange-500 to-red-900" },
  { name: "LUCKY BUY", desc: "Покупайте подарки по меньшей цене", icon: "🍀", grad: "from-yellow-400 to-amber-700" },
  { name: "PLINKO", desc: "Бросьте шарик. Выиграйте подарки", icon: "🔺", grad: "from-orange-500 to-orange-900", badge: "🔥 HOT" },
  { name: "ROCKET", desc: "Оседлайте ракетку", icon: "🚀", grad: "from-pink-500 to-purple-900", badge: "✳️ NEW" }
];

export function GameHubScreen() {
  return (
    <div className="flex h-full flex-col">
      <AppHeader />
      <div className="mx-3 mb-3 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-900 to-indigo-950 p-4">
        <p className="text-[10px] text-textMuted">WEB Лидерборд и задания</p>
        <p className="text-lg font-bold text-mrkt-yellow">$50,000 призовой фонд</p>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2 overflow-y-auto scroll-hide px-3 safe-nav">
        {games.map((g) => (
          <div key={g.name} className="relative rounded-2xl bg-card p-3">
            <div className={`mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${g.grad} text-2xl`}>
              {g.icon}
            </div>
            <p className="text-xs font-bold leading-tight">{g.name}</p>
            <p className="mt-1 text-[10px] text-textMuted leading-snug">{g.desc}</p>
            {g.badge && <span className="mt-2 inline-block text-[9px]">{g.badge}</span>}
          </div>
        ))}
      </div>
      <p className="py-2 text-center text-[10px] text-textDim">Симулятор — игры скоро</p>
    </div>
  );
}
