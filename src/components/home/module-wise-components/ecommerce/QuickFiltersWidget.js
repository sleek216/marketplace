import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Chip,
  Rating,
  Slider,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const WidgetCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "12px 16px",
  boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.08)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: "32px",
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.primary.main,
    height: "2px",
    borderRadius: "2px",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "13px",
  color: theme.palette.text.secondary,
  minWidth: "auto",
  padding: "4px 12px",
  minHeight: "32px",
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
}));

const ApplyButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "13px",
  padding: "6px 20px",
  borderRadius: "6px",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: "none",
  },
}));

const QuickFiltersWidget = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [priceRange, setPriceRange] = useState([100, 5000]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedRating, setSelectedRating] = useState(4);
  const [deals, setDeals] = useState({ onSale: true, freeDelivery: false, newArrivals: true });

  const popularBrands = ["Apple", "Samsung", "HP", "Dell", "Nike", "Adidas", "Sony", "Logitech"];

  const renderFilterContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box>
            <Box sx={{ px: 1, mt: 1 }}>
              <Slider value={priceRange} onChange={(e, v) => setPriceRange(v)} valueLabelDisplay="auto" min={0} max={10000} size="small"
                sx={{ "& .MuiSlider-thumb": { width: 14, height: 14, backgroundColor: "#fff", border: "2px solid currentColor" } }} />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="caption" color="text.secondary">Min: <b>{priceRange[0]}</b></Typography>
              <Typography variant="caption" color="text.secondary">Max: <b>{priceRange[1]}</b></Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {[[0,1000,"Under 1K"],[1000,3000,"1K-3K"],[3000,7000,"3K-7K"],[7000,10000,"7K+"]].map(([min,max,label]) => (
                <Chip key={label} label={label} size="small" onClick={() => setPriceRange([min, max])}
                  variant={priceRange[0]===min && priceRange[1]===max ? "filled" : "outlined"} color="primary" clickable
                  sx={{ fontSize: "11px", height: "24px" }} />
              ))}
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="body2" fontWeight={600} fontSize="12px" mb={1}>Choose a Brand</Typography>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {popularBrands.map((brand) => (
                <Chip key={brand} label={brand} size="small" onClick={() => setSelectedBrand(brand === selectedBrand ? "" : brand)}
                  color={selectedBrand === brand ? "primary" : "default"} variant={selectedBrand === brand ? "filled" : "outlined"}
                  clickable sx={{ fontSize: "11px", height: "24px" }} />
              ))}
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="body2" fontWeight={600} fontSize="12px" mb={0.5}>Special Offers</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[["onSale","On Sale"],["freeDelivery","Free Delivery"],["newArrivals","New Arrivals"]].map(([key, label]) => (
                <FormControlLabel key={key} sx={{ m: 0, "& .MuiFormControlLabel-label": { fontSize: "12px" } }}
                  control={<Switch size="small" checked={deals[key]} onChange={() => setDeals(p => ({...p, [key]: !p[key]}))} color="primary" />}
                  label={<Typography variant="caption" fontWeight={500}>{label}</Typography>} />
              ))}
            </Box>
          </Box>
        );
      default: return null;
    }
  };

  return (
    <WidgetCard>
      <StyledTabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto">
        <StyledTab label="Price Range" />
        <StyledTab label="Popular Brands" />
        <StyledTab label="Hot Deals" />
      </StyledTabs>
      <Box sx={{ pt: 1, pb: 0.5 }}>{renderFilterContent()}</Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 0.5 }}>
        <ApplyButton variant="contained" size="small">Apply Filters</ApplyButton>
      </Box>
    </WidgetCard>
  );
};

export default QuickFiltersWidget;
