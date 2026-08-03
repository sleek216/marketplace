import { useTheme } from "@emotion/react";
import { X as Clear } from "lucide-react";
import { Box, Dialog, Stack } from "@mui/material";
import PropTypes from "prop-types";
const CustomModal = (props) => {
  const {
    openModal,
    handleClose,
    disableAutoFocus,
    closeButton,
    children,
    maxWidth,
    borderRadius = "2px",
  } = props;
  const handleCloseModal = (event, reason) => {
    if (reason && reason === "backdropClick") {
      if (disableAutoFocus) {
        return true;
      } else {
        handleClose?.();
      }
    } else {
      handleClose?.();
    }
  };
  const theme = useTheme();
  return (
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      sx={{
        ".MuiDialog-paper": {
          margin: "16px",
          maxWidth: maxWidth,
          borderRadius,
          overflow: "hidden",
        },
      }}
    >
      {closeButton && (
        <Stack direction="row" justifyContent="flex-end">
          <Box
            onClick={handleCloseModal}
            sx={{
              cursor: "pointer",
              color: theme.palette.text.primary,
              mt: 1.3,
              mr: 1.3,
            }}
          >
            <Clear size={16} />
          </Box>
        </Stack>
      )}
      {children}
    </Dialog>
  );
};

CustomModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CustomModal;
