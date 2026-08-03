import useGetNewArrivalStores from "api-manage/hooks/react-query/store/useGetNewArrivalStores";
import { useGetVisitAgain } from "api-manage/hooks/react-query/useGetVisitAgain";
import PaidAds from "components/home/paid-ads";
import { getModuleId } from "helper-functions/getModuleId";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useGetOtherBanners from "../../../../api-manage/hooks/react-query/useGetOtherBanners";
import { getToken } from "helper-functions/getToken";
import OrderDetailsModal from "../../../order-details-modal/OrderDetailsModal";
import Banners from "../../banners";
import BestReviewedItems from "../../best-reviewed-items";
import LoveItem from "../../love-item";
import NewArrivalStores from "../../new-arrival-stores";
import RunningCampaigns from "../../running-campaigns";
import SpecialFoodOffers from "../../special-food-offers";
import Stores from "../../stores";
import VisitAgain from "../../visit-again";
import FeaturedCategoriesWithFilter from "../ecommerce/FeaturedCategoriesWithFilter";
import TopOffersNearMe from "components/home/top-offers-nearme";
import RecommendedStore from "components/home/recommended-store";
import ModuleFlashSaleSection from "../../ModuleFlashSaleSection";
import MarketplaceTopSection from "../../MarketplaceTopSection";
import ModuleHomeShell, { ModuleSectionBand } from "../../ModuleHomeShell";

const FoodModule = ({ configData }) => {
  const token = getToken();
  const [isVisited, setIsVisited] = useState(false);
  const [storeData, setStoreData] = React.useState([]);
  const { orderDetailsModalOpen } = useSelector((state) => state.utilsData);
  const { data, refetch } = useGetOtherBanners();
  const {
    data: visitedStores,
    refetch: refetchVisitAgain,
    isFetching: visitIsFetching,
  } = useGetVisitAgain();
  const {
    data: newStore,
    refetch: newStoreRefetch,
    isFetching,
  } = useGetNewArrivalStores({ type: "all" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
        if (token) await refetchVisitAgain();
        newStoreRefetch();
      } catch (error) {
        console.error("Error fetching data:", error);
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
        <SpecialFoodOffers title="Special Food Offers" />
      </ModuleSectionBand>

      <ModuleSectionBand variant="muted">
        <LoveItem />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <VisitAgain
          configData={configData}
          visitedStores={storeData}
          isVisited={isVisited}
          isFetching={isFetching || visitIsFetching}
        />
      </ModuleSectionBand>

      <ModuleSectionBand variant="muted">
        <ModuleFlashSaleSection />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <RecommendedStore />
      </ModuleSectionBand>

      <ModuleSectionBand variant="muted">
        <PaidAds />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <TopOffersNearMe title="Top offers near me" />
      </ModuleSectionBand>

      <ModuleSectionBand variant="muted">
        <BestReviewedItems title="Best Reviewed Items" info={data} />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <NewArrivalStores />
      </ModuleSectionBand>

      <ModuleSectionBand variant="muted">
        <RunningCampaigns />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <FeaturedCategoriesWithFilter title="Featured Categories" />
      </ModuleSectionBand>

      <ModuleSectionBand variant="muted">
        <Stores />
      </ModuleSectionBand>

      {orderDetailsModalOpen && !token && (
        <OrderDetailsModal orderDetailsModalOpen={orderDetailsModalOpen} />
      )}
    </ModuleHomeShell>
  );
};

export default FoodModule;
