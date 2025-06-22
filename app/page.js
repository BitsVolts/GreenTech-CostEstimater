"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import { Formik, Form, FieldArray } from "formik";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsIcon from "@mui/icons-material/Settings";
import * as Yup from "yup";
import CustomThemeProvider from "./components/ThemeProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CostEstimationModal from "./modals/CostEstimationModal";
import RateForm from "./components/RateForm";
// import useRateConfig from "./hooks/useRateConfig";

import {
  CubeIcon,
  ClipboardIcon,
  TagIcon,
  PrintIcon,
  GearIcon,
  DeleteIcon,
} from "./components/CustomIcons";
import CostEstimateForm from "./components/CostEstimateForm";

export default function MonoCartonEstimator() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <CustomThemeProvider>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          py: 4,
        }}
      >
        <Container maxWidth={tabValue === 0 ? "md" : "md"}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
              overflow: "hidden",
              minHeight:"100vh"
            }}
          >
            {/* Header */}
            <Box sx={{ p: 4, pb: 3, textAlign: "center" }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={2}
              >
                <CubeIcon />
                <Typography
                  variant="h4"
                  sx={{ fontSize: "24px", fontWeight: 600, color: "#212529" }}
                >
                  Mono Carton Costing Estimator
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#6c757d",
                  fontSize: "14px",
                  mb: 3,
                  lineHeight: 1.5,
                }}
              >
                Professional packaging cost estimation tool for sales and
                production teams
              </Typography>

              {/* Top Tabs */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: 2,
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    backgroundColor: "#f1f3f5",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.06)",
                    p: "4px",
                    width: "fit-content",
                  }}
                >
                  {/* Sliding background rectangle */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 4,
                      left: tabValue === 0 ? 4 : "calc(50% + 4px)",
                      width: "calc(50% - 8px)",
                      height: "44px",
                      backgroundColor: "#246bfd",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                      zIndex: 1,
                    }}
                  />

                  <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    TabIndicatorProps={{ style: { display: "none" } }}
                    sx={{
                      minHeight: "auto",
                      zIndex: 2,
                      "& .MuiTabs-flexContainer": {
                        position: "relative",
                        zIndex: 2,
                      },
                      "& .MuiTab-root": {
                        minWidth: "160px",
                        height: "44px",
                        fontSize: "14px",
                        fontWeight: 600,
                        textTransform: "none",
                        color: "#2f3e4d",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        minHeight: "auto",
                        padding: "8px 16px",
                        transition: "color 0.3s ease",
                        zIndex: 2,
                      },
                      "& .Mui-selected": {
                        color: "#ffffff !important",
                        "& svg": {
                          color: "#ffffff",
                        },
                      },
                    }}
                  >
                    <Tab
                      icon={<InsertChartIcon fontSize="small" />}
                      iconPosition="start"
                      label="Cost Estimator"
                      disableRipple
                    />
                    <Tab
                      icon={<SettingsIcon fontSize="small" />}
                      iconPosition="start"
                      label="Rate Configuration"
                      disableRipple
                    />
                  </Tabs>
                </Box>
              </Box>
            </Box>

            {/* Cost Estimator Form */}
            {tabValue === 0 && <CostEstimateForm/>}

            {/* Rate Configuration Form */}
            {tabValue === 1 && <RateForm />}
          </Paper>
        </Container>
      </Box>
    </CustomThemeProvider>
  );
}
