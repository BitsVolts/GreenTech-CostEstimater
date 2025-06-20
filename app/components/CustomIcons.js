// components/CustomIcons.js
"use client";

import { Box } from "@mui/material";

export const CubeIcon = () => (
  <Box
    sx={{
      width: 32,
      height: 32,
      backgroundColor: "#4285f4",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mr: 2,
    }}
  >
    <Box
      sx={{
        width: 16,
        height: 16,
        border: "2px solid white",
        borderRadius: "2px",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -2,
          left: 2,
          width: 12,
          height: 12,
          border: "2px solid white",
          borderRadius: "2px",
          backgroundColor: "rgba(255,255,255,0.3)",
        },
      }}
    />
  </Box>
);

export const ClipboardIcon = () => (
  <Box
    sx={{
      width: 16,
      height: 16,
      mr: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    📋
  </Box>
);

export const TagIcon = () => (
  <Box
    sx={{
      width: 16,
      height: 16,
      mr: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    🏷️
  </Box>
);

export const PrintIcon = () => (
  <Box
    sx={{
      width: 16,
      height: 16,
      mr: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    ⚙️
  </Box>
);

export const GearIcon = () => (
  <Box
    sx={{
      width: 16,
      height: 16,
      mr: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    🔧
  </Box>
);

export const DeleteIcon = () => (
  <Box sx={{ color: "#dc3545", fontSize: "16px", cursor: "pointer" }}>🗑️</Box>
);
