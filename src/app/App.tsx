import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { ChangesAttribution } from "../components/common/ChangesAttribution";
import { BottomNav } from "../components/layout/BottomNav";
import { CartScreen } from "../components/marketplace/CartScreen";
import { FeedScreen } from "../components/marketplace/FeedScreen";
import { FilterSheetModal } from "../components/marketplace/FilterSheetModal";
import { MarketScreen } from "../components/marketplace/MarketScreen";
import { NftDetail } from "../components/marketplace/NftDetail";
import { OfferModal } from "../components/marketplace/OfferModal";
import { GameHubScreen } from "../components/hub/GameHubScreen";
import { OrdersScreen } from "../components/orders/OrdersScreen";
import { StorageScreen } from "../components/storage/StorageScreen";
import { TasksScreen } from "../components/tasks/TasksScreen";
import { useMarketSimulator } from "../hooks/useMarketSimulator";
import { useCatalogStore } from "../store/catalogStore";
import { useMarketStore } from "../store/marketStore";

export default function App() {
  useMarketSimulator();
  const { activeTab, selectedNftId, setTab } = useMarketStore();

  useEffect(() => {
    try {
      WebApp.ready();
      WebApp.expand();
      WebApp.setHeaderColor("#0d0d0d");
      WebApp.setBackgroundColor("#0d0d0d");
    } catch {
      /* browser */
    }

    useCatalogStore.getState().init();
    useMarketStore.getState().initMarket();
  }, []);

  const hideNav = !!selectedNftId;
  return (
    <div className="mx-auto h-full max-w-[430px] bg-bg">
      {activeTab === "market" && <MarketScreen />}
      {activeTab === "orders" && <OrdersScreen />}
      {activeTab === "hub" && <GameHubScreen />}
      {activeTab === "tasks" && <TasksScreen />}
      {activeTab === "storage" && <StorageScreen />}

      {!hideNav && <BottomNav active={activeTab} onChange={setTab} />}
      {selectedNftId && <NftDetail />}
      <FilterSheetModal />
      <FeedScreen />
      <CartScreen />
      <OfferModal />
      <ChangesAttribution />
    </div>
  );
}
