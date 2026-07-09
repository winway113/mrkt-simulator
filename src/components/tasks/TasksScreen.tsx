import { useMarketStore } from "../../store/marketStore";
import { AppHeader } from "../layout/AppHeader";

const tasks = [
  { title: "2 подарка в Бойцовском Клубе", reward: 700, time: "00:24:38", progress: "0/2", icon: "🐰" },
  { title: "2 подарка в Игре в Кальмара", reward: 700, time: "00:24:38", progress: "0/2", icon: "🟥" },
  { title: "Выиграть в Бойцовском Клубе", reward: 250, time: "02:24:38", progress: "0/1", icon: "🏆" }
];

export function TasksScreen() {
  const { analytics } = useMarketStore();

  return (
    <div className="flex h-full flex-col">
      <AppHeader />
      <div className="mx-3 mb-3 rounded-2xl bg-card p-4">
        <p className="text-sm font-bold">PlayHub Сезон 1</p>
        <p className="text-xs text-textMuted">Играйте и получайте награды</p>
        <button className="btn-yellow mt-3 w-full py-2.5 text-sm">PlayHub Сезон 1 🎮</button>
      </div>
      <div className="mx-3 mb-2 rounded-xl border border-mrkt-yellow/30 px-3 py-2 text-[10px] text-mrkt-yellow">
        Нажмите «Начать» перед выполнением задания
      </div>
      <div className="flex-1 overflow-y-auto scroll-hide px-3 safe-nav">
        <p className="mb-2 text-sm font-bold">Горящие 🔥</p>
        {tasks.map((t) => (
          <div key={t.title} className="mb-2 flex items-center gap-3 rounded-xl bg-card p-3">
            <span className="text-2xl">{t.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              <p className="text-[10px] text-textMuted">⬡ {t.reward} · {t.time} · {t.progress}</p>
            </div>
            <button className="btn-yellow-sm text-xs">Начать</button>
          </div>
        ))}
        <div className="mt-4 rounded-xl bg-card p-3 text-xs text-textMuted">
          <p>P&L симулятора: <span className="text-success font-bold">{analytics.totalProfitTon.toFixed(2)} TON</span></p>
          <p>Успешных флипов: {analytics.successfulFlips}</p>
        </div>
      </div>
    </div>
  );
}
