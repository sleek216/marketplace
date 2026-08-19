import { Box, Typography } from "@mui/material";
import PageRouteSkeleton from "./page-skeleton/PageRouteSkeleton";

/** Shown while config / landing data is loading — avoids blank white screen. */
const PageBootLoader = ({ message = "Loading...", error = false }) => {
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2,
          bgcolor: "background.default",
          px: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {message}
        </Typography>
      </Box>
    );
  }

  return <PageRouteSkeleton />;
};

export default PageBootLoader;
