import { Box, Container, Grid, Skeleton, Stack } from "@mui/material";

const CardSkeleton = () => (
  <Stack spacing={1}>
    <Skeleton
      animation="wave"
      variant="rounded"
      height={168}
      sx={{ borderRadius: "12px" }}
    />
    <Skeleton animation="wave" variant="text" width="88%" height={16} />
    <Skeleton animation="wave" variant="text" width="46%" height={14} />
    <Skeleton animation="wave" variant="text" width="32%" height={18} />
  </Stack>
);

/** Daraz / Google-style content placeholder while a page boots or navigates. */
const PageRouteSkeleton = ({ showHeader = true }) => (
  <Box
    sx={{
      width: "100%",
      minHeight: "100vh",
      bgcolor: "background.default",
    }}
  >
    {showHeader && (
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          px: 2,
          py: 1.25,
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Skeleton animation="wave" variant="rounded" width={86} height={30} />
            <Skeleton
              animation="wave"
              variant="rounded"
              sx={{ flex: 1, height: 40, borderRadius: "10px" }}
            />
            <Skeleton animation="wave" variant="circular" width={34} height={34} />
            <Skeleton animation="wave" variant="rounded" width={70} height={34} />
          </Stack>
        </Container>
      </Box>
    )}
    <Container maxWidth="lg" sx={{ py: { xs: 1.5, md: 2.5 }, px: { xs: 2, md: 3 } }}>
      <Skeleton
        animation="wave"
        variant="rounded"
        sx={{
          height: { xs: 132, md: 210 },
          borderRadius: "14px",
          mb: 2.5,
        }}
      />
      <Stack
        direction="row"
        spacing={2}
        sx={{ overflow: "hidden", mb: 3 }}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <Stack key={index} alignItems="center" spacing={1} sx={{ minWidth: 64 }}>
            <Skeleton animation="wave" variant="circular" width={54} height={54} />
            <Skeleton animation="wave" variant="text" width={44} height={12} />
          </Stack>
        ))}
      </Stack>
      <Grid container spacing={2}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <CardSkeleton />
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default PageRouteSkeleton;
