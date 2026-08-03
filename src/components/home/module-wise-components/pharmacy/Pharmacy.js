import useGetNewArrivalStores from "api-manage/hooks/react-query/store/useGetNewArrivalStores";
import { useGetVisitAgain } from "api-manage/hooks/react-query/useGetVisitAgain";
import PaidAds from "components/home/paid-ads";
import { getModuleId } from "helper-functions/getModuleId";
import { getToken } from "helper-functions/getToken";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useGetOtherBanners from "../../../../api-manage/hooks/react-query/useGetOtherBanners";
import OrderDetailsModal from "../../../order-details-modal/OrderDetailsModal";
import Banners from "../../banners";
import BestReviewedItems from "../../best-reviewed-items";
import RunningCampaigns from "../../running-campaigns";
import Stores from "../../stores";
import VisitAgain from "../../visit-again";
import CommonConditions from "./common-conditions";
import FeaturedStores from "./featured-stores";
import PharmacyStaticBanners from "./pharmacy-banners/PharmacyStaticBanners";
import TopOffersNearMe from "components/home/top-offers-nearme";
import RecommendedStore from "components/home/recommended-store";
import PopularItemsNearby from "components/home/popular-items-nearby";
import ModuleFlashSaleSection from "../../ModuleFlashSaleSection";
import MarketplaceTopSection from "../../MarketplaceTopSection";
import ModuleHomeShell, { ModuleSectionBand } from "../../ModuleHomeShell";

const menus = ["All", "New", "Baby Care", "Womans Care", "Mens"];

const Pharmacy = ({ configData }) => {
  const token = getToken();
  const [isVisited, setIsVisited] = useState(false);
  const { orderDetailsModalOpen } = useSelector((state) => state.utilsData);
  const [storeData, setStoreData] = React.useState([]);
  const { data, isLoading } = useGetOtherBanners();
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
        <RecommendedStore />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <PharmacyStaticBanners />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <VisitAgain
          configData={configData}
          visitedStores={storeData}
          isVisited={isVisited}
          isFetching={visitIsFetching || isFetching}
        />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <PaidAds />
      </ModuleSectionBand>

      <ModuleSectionBand variant="muted">
        <PopularItemsNearby
          title="Most Popular Items"
          subTitle="Trending products near you"
          textAlign="left"
        />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <BestReviewedItems
          menus={menus}
          title="Basic Medicine Nearby"
          bannerIsLoading={isLoading}
          url={`${data?.promotional_banner_url}/${data?.basic_section_nearby}`}
        />
      </ModuleSectionBand>

      <ModuleSectionBand variant="muted">
        <TopOffersNearMe title="Top offers near me" />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <FeaturedStores title="Featured Store" configData={configData} />
      </ModuleSectionBand>

      <ModuleSectionBand variant="muted">
        <RunningCampaigns />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <CommonConditions title="Common Conditions" />
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

export default Pharmacy;
