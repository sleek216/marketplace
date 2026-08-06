import { Box, CircularProgress, Typography } from "@mui/material";

/** Shown while config / landing data is loading — avoids blank white screen. */
const PageBootLoader = ({ message = "Loading..." }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      gap: 2,
      bgcolor: "background.default",
    }}
  >
    <CircularProgress size={40} thickness={4} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

export default PageBootLoader;
