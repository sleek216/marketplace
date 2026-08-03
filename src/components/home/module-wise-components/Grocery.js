import useGetNewArrivalStores from "api-manage/hooks/react-query/store/useGetNewArrivalStores";
import { useGetVisitAgain } from "api-manage/hooks/react-query/useGetVisitAgain";
import { getModuleId } from "helper-functions/getModuleId";
import { getToken } from "helper-functions/getToken";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import OrderDetailsModal from "../../order-details-modal/OrderDetailsModal";
import Banners from "../banners";
import MarketplaceTopSection from "../MarketplaceTopSection";
import RunningCampaigns from "../running-campaigns";
import Stores from "../stores";
import VisitAgain from "../visit-again";
import PaidAds from "components/home/paid-ads";
import PopularItemsNearby from "../popular-items-nearby";
import ModuleFlashSaleSection from "../ModuleFlashSaleSection";
import ModuleHomeShell, { ModuleSectionBand } from "../ModuleHomeShell";

const Grocery = ({ configData }) => {
  const token = getToken();
  const [isVisited, setIsVisited] = useState(false);
  const [storeData, setStoreData] = React.useState([]);
  const { orderDetailsModalOpen, orderInformation } = useSelector(
    (state) => state.utilsData
  );
  const {
    data: visitedStores,
    refetch: refetchVisitAgain,
    isFetching: visitIsFetching,
    isLoading: visitIsLoading,
  } = useGetVisitAgain();
  const {
    data: newStore,
    refetch: newStoreRefetch,
    isFetching,
    isLoading: newStoreIsLoading,
  } = useGetNewArrivalStores({ type: "all" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) await refetchVisitAgain();
        await newStoreRefetch();
      } catch (error) {
        console.error("Error fetching visit/new stores:", error);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (visitedStores?.length > 0 || newStore?.stores?.length > 0) {
      if (visitedStores?.length > 0 && visitedStores) {
        setStoreData(visitedStores);
        setIsVisited(true);
      } else if (newStore?.stores) {
        setStoreData(newStore?.stores);
      }
    }
  }, [visitedStores, newStore?.stores, getModuleId()]);

  return (
    <ModuleHomeShell>
      <MarketplaceTopSection>
        <Banners />
      </MarketplaceTopSection>

      <ModuleSectionBand variant="paper">
        <ModuleFlashSaleSection />
      </ModuleSectionBand>

      <ModuleSectionBand variant="muted">
        <RunningCampaigns />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <PaidAds />
      </ModuleSectionBand>

      <ModuleSectionBand variant="muted">
        <PopularItemsNearby
          title="Items For You"
          subTitle="Fresh grocery items selected for your location"
          textAlign="left"
        />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <VisitAgain
          configData={configData}
          isVisited={isVisited}
          visitedStores={storeData}
          isFetching={isFetching || visitIsFetching}
          isLoading={visitIsLoading || newStoreIsLoading}
        />
      </ModuleSectionBand>

      <ModuleSectionBand variant="muted">
        <Stores />
      </ModuleSectionBand>

      {orderDetailsModalOpen && !token && (
        <OrderDetailsModal
          orderDetailsModalOpen={orderDetailsModalOpen}
          orderInformation={orderInformation}
        />
      )}
    </ModuleHomeShell>
  );
};

export default Grocery;
