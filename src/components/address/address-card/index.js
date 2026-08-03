import React, { useState } from "react";
import { alpha, Chip, Typography, Box } from "@mui/material";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { Edit, Trash2, MapPin } from "lucide-react";
import { Stack } from "@mui/system";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
import DeleteAddress from "../DeleteAddress";
import { useTheme } from "@emotion/react";

const AddressCard = (props) => {
  const { item, refetch, setEditAddress, setAddAddress } = props;
  const { address_type, address, id } = item;
  const { t } = useTranslation();
  const theme = useTheme();
  const [openDelete, setOpenDelete] = useState(false);
  const isDefault =
    item?.is_default === 1 ||
    item?.is_default === true ||
    String(address_type || "").toLowerCase() === "home";

  const handleClick = () => {
    setEditAddress(item);
    setAddAddress((prevState) => !prevState);
  };

  return (
    <Box
      sx={{
        borderRadius: "2px",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.divider, 0.55)}`,
        overflow: "hidden",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.35),
          boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.06)}`,
        },
      }}
    >
      <CustomStackFullWidth spacing={0}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          padding={{ xs: "12px 14px", md: "13px 16px" }}
          spacing={1}
          sx={{
            background: alpha(theme.palette.primary.main, 0.05),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.45)}`,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.1}
            sx={{ minWidth: 0, flex: 1 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: "2px",
                flexShrink: 0,
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
              }}
            >
              <MapPin size={15} strokeWidth={2} />
            </Box>
            <Typography
              fontWeight={700}
              fontSize={{ xs: "13px", md: "14px" }}
              color={theme.palette.neutral[1000]}
              textTransform="capitalize"
              noWrap
              title={t(address_type)}
            >
              {t(address_type)}
            </Typography>
            {isDefault && (
              <Chip
                size="small"
                label={t("Default")}
                sx={{
                  height: 20,
                  fontSize: "10px",
                  fontWeight: 700,
                  borderRadius: "2px",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "& .MuiChip-label": { px: 0.9 },
                }}
              />
            )}
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.15} flexShrink={0}>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{
                padding: "6px",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
              aria-label={t("Edit")}
            >
              <Edit size={15} color={theme.palette.primary.main} />
            </IconButton>
            <IconButton
              onClick={() => setOpenDelete(true)}
              size="small"
              sx={{
                padding: "6px",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                },
              }}
              aria-label={t("Delete")}
            >
              <Trash2 size={15} color={theme.palette.error.main} />
            </IconButton>
          </Stack>
        </Stack>

        <Stack padding={{ xs: "12px 14px 14px", md: "14px 16px 16px" }}>
          <Typography
            component="p"
            fontWeight={400}
            fontSize={{ xs: "13px", md: "14px" }}
            color={theme.palette.neutral[700]}
            lineHeight={1.55}
            sx={{ margin: 0 }}
          >
            {address}
          </Typography>
        </Stack>
      </CustomStackFullWidth>
      {openDelete && (
        <DeleteAddress
          open={openDelete}
          handleClose={() => setOpenDelete(false)}
          addressId={id}
          refetch={refetch}
        />
      )}
    </Box>
  );
};

AddressCard.propTypes = {};

export default AddressCard;
