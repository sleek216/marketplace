import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import {
  alpha,
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/router";
import CustomMessageReasonBox from "components/my-orders/order-details/other-order/CustomMessageReasonBox";

const ChatWithAdmin = ({ automateMessageData, orderID }) => {
  const theme = useTheme();
  const router = useRouter();
  const [selected, setSelected] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [text, setText] = React.useState("");
  const hasReasons = automateMessageData?.length > 0;

  const handleClick = (item) => {
    setSelected(item?.id === selected ? false : item?.id);
    setValue(item?.id === selected ? "" : item?.message);
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    router.push({
      pathname: "/profile",
      query: {
        page: "inbox",
        type: "admin",
        id: "admin",
        routeName: "admin_id",
        chatFrom: "true",
        text: `${value}${text}`,
        orderId: orderID,
      },
    });
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "420px" },
        maxWidth: "100%",
        px: { xs: 1.5, md: 2 },
        pb: 2,
        pt: hasReasons ? 0 : 1,
      }}
    >
      <CustomStackFullWidth spacing={2}>
        {hasReasons && (
          <Typography
            textAlign="center"
            fontSize="15px"
            fontWeight={700}
            color={theme.palette.primary.main}
            sx={{ pt: 0.5 }}
          >
            {t("Select the Reason for Support")}
          </Typography>
        )}

        {hasReasons && (
          <CustomMessageReasonBox
            selected={selected}
            handleClick={handleClick}
            automateMessageData={automateMessageData}
          />
        )}

        <Typography
          textAlign="left"
          fontSize="13px"
          fontWeight={600}
          color={theme.palette.neutral[700]}
        >
          {hasReasons ? t("Or Custom Message") : t("Custom Message")}
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={3}
          onChange={handleChange}
          placeholder={t("Type here to write a custom message")}
          value={text}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "2px",
              fontSize: "13px",
              alignItems: "flex-start",
              bgcolor: theme.palette.background.paper,
              "& fieldset": {
                borderColor: alpha(theme.palette.divider, 0.85),
              },
              "&:hover fieldset": {
                borderColor: alpha(theme.palette.primary.main, 0.45),
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
                borderWidth: "1px",
              },
            },
          }}
        />

        <Button
          variant="contained"
          fullWidth
          disabled={value === "" && text === ""}
          onClick={handleSubmit}
          sx={{
            borderRadius: "2px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px",
            py: 1.15,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              bgcolor: theme.palette.primary.dark,
            },
            "&.Mui-disabled": {
              bgcolor: alpha(theme.palette.primary.main, 0.22),
              color: theme.palette.primary.main,
            },
          }}
        >
          {t("Send Message")}
        </Button>
      </CustomStackFullWidth>
    </Box>
  );
};

export default ChatWithAdmin;
