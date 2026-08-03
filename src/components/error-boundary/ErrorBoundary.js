import React from "react";
import { Box, Button, Paper, Stack, Typography, alpha } from "@mui/material";
import { RefreshCw, AlertTriangle, RotateCcw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    if (
      error?.message?.includes("destroy is not a function") ||
      error?.message?.includes("reading 'destroy'") ||
      error?.message?.includes("dispose is not a function") ||
      error?.message?.includes("cleanup is not a function")
    ) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (
      error?.message?.includes("destroy is not a function") ||
      error?.message?.includes("reading 'destroy'") ||
      error?.message?.includes("dispose is not a function") ||
      error?.message?.includes("cleanup is not a function")
    ) {
      if (this.state.hasError) {
        this.setState({ hasError: false, error: null });
      }
      return;
    }
    console.warn("[ErrorBoundary caught error]:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 3,
            background:
              "radial-gradient(circle at 50% 20%, rgba(255, 107, 107, 0.12) 0%, rgba(18, 18, 20, 0.95) 100%), #0f0f12",
            color: "#ffffff",
          }}
        >
          <Paper
            elevation={24}
            sx={{
              maxWidth: "520px",
              width: "100%",
              padding: { xs: "32px 24px", sm: "48px 40px" },
              borderRadius: "24px",
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 24px 64px -16px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 107, 107, 0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glow effect */}
            <Box
              sx={{
                position: "absolute",
                top: "-40%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "200px",
                height: "200px",
                background: "radial-gradient(circle, rgba(255, 107, 107, 0.3) 0%, transparent 70%)",
                filter: "blur(40px)",
                zIndex: 0,
              }}
            />

            <Stack spacing={3} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 107, 107, 0.05) 100%)",
                  border: "1px solid rgba(255, 107, 107, 0.3)",
                  color: "#ff6b6b",
                }}
              >
                <AlertTriangle size={32} />
              </Box>

              <Stack spacing={1}>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    background: "linear-gradient(90deg, #ffffff 0%, #a0a0b0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Oops! Something went wrong
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "15px", lineHeight: 1.6 }}>
                  We encountered an unexpected rendering glitch. Don&apos;t worry, your data and session are completely safe.
                </Typography>
                {this.state.error && (
                  <Box
                    sx={{
                      width: "100%",
                      p: 2,
                      borderRadius: "14px",
                      background: "rgba(255, 0, 0, 0.12)",
                      border: "1px solid rgba(255, 107, 107, 0.3)",
                      textAlign: "left",
                      maxHeight: "180px",
                      overflow: "auto",
                      fontFamily: "monospace",
                      fontSize: "13px",
                      color: "#ff8080",
                      wordBreak: "break-word",
                    }}
                  >
                    <Typography variant="caption" fontWeight={700} color="#ff6b6b" display="block" gutterBottom>
                      ERROR DETAILS:
                    </Typography>
                    {this.state.error?.message || this.state.error?.toString()}
                  </Box>
                )}
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ width: "100%", pt: 1 }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  onClick={this.handleRetry}
                  startIcon={<RotateCcw size={18} />}
                  sx={{
                    py: 1.5,
                    borderRadius: "14px",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "15px",
                    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                    boxShadow: "0 8px 24px -4px rgba(99, 102, 241, 0.4)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 32px -4px rgba(99, 102, 241, 0.5)",
                    },
                  }}
                >
                  Try Again
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={this.handleReload}
                  startIcon={<RefreshCw size={18} />}
                  sx={{
                    py: 1.5,
                    borderRadius: "14px",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "15px",
                    color: "#ffffff",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    background: "rgba(255, 255, 255, 0.03)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.08)",
                      borderColor: "rgba(255, 255, 255, 0.4)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Refresh Page
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
