import { Typography, useTheme } from '@mui/material'
import { t } from 'i18next';
import React from 'react'
import { CustomStackFullWidth } from '../../styled-components/CustomStyles.style';

const FooterBottomItems = ({ configData,handleClickToRoute }) => {
    const theme = useTheme();
    return (
        <CustomStackFullWidth
            direction="row"
            alignItems="center"
            justifyContent={{ xs: "center", sm: "flex-end" }}
            spacing={{ xs: 1.5, sm: 3 }}
            sx={{
                width: { xs: "100%", sm: "auto" },
                flexWrap: "wrap",
            }}
        >
            <Typography
                onClick={() => handleClickToRoute("/terms-and-conditions")}
                sx={{
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    textAlign: "right",
                    fontSize: { xs: "12.5px", sm: "14px" },
                    fontWeight: 500,
                    lineHeight: 1.45,
                    "&:hover": {
                        color: theme.palette.primary.main,
                    },
                }}
            >
                {t("Terms & Conditions")}
            </Typography>
            <Typography
                onClick={() => handleClickToRoute("/privacy-policy")}
                sx={{
                    cursor: "pointer",
                    textAlign: "center",
                    fontSize: { xs: "12.5px", sm: "14px" },
                    fontWeight: 500,
                    lineHeight: 1.45,
                    "&:hover": {
                        color: theme.palette.primary.main,
                    },
                }}
            >
                {t("Privacy Policy")}
            </Typography>
            {configData?.refund_policy !== 0 && (
                <Typography
                    onClick={() => handleClickToRoute("/refund-policy")}
                    sx={{
                        cursor: "pointer",
                        textAlign: "center",
                        fontSize: { xs: "12.5px", sm: "14px" },
                        fontWeight: 500,
                        lineHeight: 1.45,
                        "&:hover": {
                            color: theme.palette.primary.main,
                        },
                    }}
                >
                    {t("Refund Policy")}
                </Typography>
            )}
            {configData?.cancelation_policy !== 0 && (
                <Typography
                    onClick={() => handleClickToRoute("/cancellation-policy")}
                    sx={{
                        cursor: "pointer",
                        textAlign: "center",
                        fontSize: { xs: "12.5px", sm: "14px" },
                        fontWeight: 500,
                        lineHeight: 1.45,
                        "&:hover": {
                            color: theme.palette.primary.main,
                        },
                    }}
                >
                    {t("Cancellation Policy")}
                </Typography>
            )}
            {configData?.shipping_policy !== 0 && (
                <Typography
                    onClick={() => handleClickToRoute("/shipping-policy")}
                    sx={{
                        cursor: "pointer",
                        textAlign: "center",
                        fontSize: { xs: "12.5px", sm: "14px" },
                        fontWeight: 500,
                        lineHeight: 1.45,
                        "&:hover": {
                            color: theme.palette.primary.main,
                        },
                    }}
                >
                    {t("Shipping Policy")}
                </Typography>
            )}
        </CustomStackFullWidth>
    )
}

export default FooterBottomItems