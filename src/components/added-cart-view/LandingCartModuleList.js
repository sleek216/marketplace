import React, { useMemo } from "react";
import {
  alpha,
  Box,
  Badge,
  Chip,
  Typography,
  Stack,
  useTheme,
} from "@mui/material";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CustomImageContainer from "../CustomImageContainer";
import { useTranslation } from "react-i18next";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { cartItemsTotalAmount } from "utils/CustomFunctions";
import { getCartQuantityCount } from "helper-functions/cartTotals";
import useGetModule from "api-manage/hooks/react-query/useGetModule";

/**
 * Matches a single cart item to a module.
 * Checks module_id first, then falls back to module_type string match.
 */
const itemBelongsToModule = (item, module) => {
  const itemModuleId =
    item?.module_id ||
    item?.module?.id ||
    item?.item?.module_id ||
    item?.item?.module?.id;
  const itemModuleType =
    item?.module_type ||
    item?.module?.module_type ||
    item?.item?.module_type;

  if (itemModuleId != null && module?.id != null) {
    return String(itemModuleId) === String(module.id);
  }
  if (itemModuleType && module?.module_type) {
    return itemModuleType === module.module_type;
  }
  return false;
};

/**
 * Builds a list of module groups using allModules as the source of truth.
 * Every module from the API is always included.
 * Cart items are matched to each module.
 */
const buildModuleGroups = (allModules, cartList) => {
  if (!Array.isArray(allModules)) return [];
  const safeCart = Array.isArray(cartList) ? cartList : [];

  return allModules.map((module) => {
    const items = safeCart.filter((item) => itemBelongsToModule(item, module));
    return {
      moduleId: module?.id,
      moduleName: module?.module_name || module?.module_type || "Module",
      moduleIcon: module?.icon_full_url || null,
      moduleType: module?.module_type,
      moduleInfo: module,
      items,
    };
  });
};

const LandingCartModuleList = ({ cartList, onSelectModule }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: allModules } = useGetModule();

  // Always build from allModules — never from cartList grouping
  const moduleGroups = useMemo(
    () => buildModuleGroups(allModules, cartList),
    [allModules, cartList]
  );

  if (!allModules || moduleGroups.length === 0) return null;

  return (
    <Box sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
      <SimpleBar
        style={{
          height: "100%",
          maxHeight: "100%",
          width: "100%",
          padding: "16px 14px",
        }}
      >
        <Typography
          fontSize="12px"
          fontWeight={600}
          color="text.secondary"
          textTransform="uppercase"
          letterSpacing="0.6px"
          mb={1.5}
        >
          {t("Select a module to view cart")}
        </Typography>

        <Stack spacing={1.25}>
          {moduleGroups.map((group) => {
            const qtyCount = getCartQuantityCount(group.items);
            const hasItems = qtyCount > 0;
            const subtotal = cartItemsTotalAmount(group.items);

            return (
              <Box
                key={group.moduleId ?? group.moduleType}
                onClick={() => onSelectModule(group)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.75,
                  p: 1.5,
                  borderRadius: "10px",
                  border: `1.5px solid ${
                    hasItems
                      ? alpha(theme.palette.primary.main, 0.3)
                      : alpha(theme.palette.divider, 0.45)
                  }`,
                  bgcolor: hasItems
                    ? alpha(theme.palette.primary.main, 0.03)
                    : theme.palette.background.paper,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  opacity: hasItems ? 1 : 0.65,
                  "&:hover": {
                    borderColor: alpha(theme.palette.primary.main, 0.55),
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    opacity: 1,
                    transform: "translateX(2px)",
                    boxShadow: `0 4px 14px ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                  },
                }}
              >
                {/* Module Icon with item-count badge */}
                <Badge
                  badgeContent={hasItems ? qtyCount : null}
                  color="primary"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "10px",
                      fontWeight: 700,
                      minWidth: "18px",
                      height: "18px",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: hasItems
                        ? alpha(theme.palette.primary.main, 0.1)
                        : alpha(theme.palette.divider, 0.15),
                      border: `1px solid ${
                        hasItems
                          ? alpha(theme.palette.primary.main, 0.2)
                          : alpha(theme.palette.divider, 0.3)
                      }`,
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {group.moduleIcon ? (
                      <CustomImageContainer
                        src={group.moduleIcon}
                        width="34px"
                        height="34px"
                        objectfit="contain"
                      />
                    ) : (
                      <ShoppingCartOutlinedIcon
                        sx={{
                          fontSize: 26,
                          color: hasItems
                            ? theme.palette.primary.main
                            : theme.palette.text.disabled,
                        }}
                      />
                    )}
                  </Box>
                </Badge>

                {/* Module Info */}
                <Stack flex={1} minWidth={0} spacing={0.4}>
                  <Typography
                    fontSize="14px"
                    fontWeight={700}
                    color={hasItems ? "text.primary" : "text.secondary"}
                    textTransform="capitalize"
                    noWrap
                  >
                    {group.moduleName}
                  </Typography>

                  {hasItems ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontSize="12px" color="text.secondary">
                        {qtyCount}{" "}
                        {qtyCount === 1 ? t("item") : t("items")}
                      </Typography>
                      <Box
                        sx={{
                          width: 3,
                          height: 3,
                          borderRadius: "50%",
                          bgcolor: "text.disabled",
                        }}
                      />
                      <Typography
                        fontSize="12px"
                        fontWeight={600}
                        color="primary.main"
                      >
                        {getAmountWithSign(subtotal)}
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography fontSize="12px" color="text.disabled">
                      {t("No items in cart")}
                    </Typography>
                  )}
                </Stack>

                {/* Arrow */}
                <ChevronRightIcon
                  sx={{
                    fontSize: 20,
                    color: hasItems
                      ? theme.palette.text.secondary
                      : theme.palette.text.disabled,
                    flexShrink: 0,
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      </SimpleBar>
    </Box>
  );
};

export default LandingCartModuleList;
