import Brands from "components/home/brands";
import { getToken } from "helper-functions/getToken";
import React from "react";
import { useSelector } from "react-redux";
import OrderDetailsModal from "../../../order-details-modal/OrderDetailsModal";
import PopularItemsNearby from "../../popular-items-nearby";
import SpecialFoodOffers from "../../special-food-offers";
import Stores from "../../stores";
import Banners from "../../banners";
import MarketplaceTopSection from "../../MarketplaceTopSection";
import ModuleFlashSaleSection from "../../ModuleFlashSaleSection";
import ModuleHomeShell, { ModuleSectionBand } from "../../ModuleHomeShell";

const Shop = ({ configData }) => {
  const { orderDetailsModalOpen } = useSelector((state) => state.utilsData);
  const token = getToken();

  return (
    <ModuleHomeShell>
      <MarketplaceTopSection>
        <Banners />
      </MarketplaceTopSection>

      <ModuleSectionBand variant="paper">
        <ModuleFlashSaleSection />
      </ModuleSectionBand>

      <ModuleSectionBand variant="muted">
        <PopularItemsNearby
          title="Just For You"
          subTitle="Recommended based on your preferences"
          textAlign="left"
        />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <SpecialFoodOffers title="Flash Deals" layout="grid" />
      </ModuleSectionBand>

      <ModuleSectionBand variant="paper">
        <Brands />
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

export default Shop;
