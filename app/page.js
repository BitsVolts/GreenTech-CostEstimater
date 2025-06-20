"use client"

import { useState } from "react"
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
} from "@mui/material"
import { Formik, Form, FieldArray } from "formik"
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsIcon from "@mui/icons-material/Settings";
import * as Yup from "yup"
import CustomThemeProvider from "./components/ThemeProvider"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


// Icons
const CubeIcon = () => (
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
)

const ClipboardIcon = () => (
  <Box sx={{ width: 16, height: 16, mr: 1, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
    📋
  </Box>
)

const TagIcon = () => (
  <Box sx={{ width: 16, height: 16, mr: 1, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
    🏷️
  </Box>
)

const PrintIcon = () => (
  <Box sx={{ width: 16, height: 16, mr: 1, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
    ⚙️
  </Box>
)

const GearIcon = () => (
  <Box sx={{ width: 16, height: 16, mr: 1, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
    🔧
  </Box>
)

const DeleteIcon = () => <Box sx={{ color: "#dc3545", fontSize: "16px", cursor: "pointer" }}>🗑️</Box>

// Validation schemas
const costEstimatorValidation = Yup.object({
  length: Yup.number().positive("Length must be positive").required("Length is required"),
  width: Yup.number().positive("Width must be positive").required("Width is required"),
  sheetLength: Yup.number().positive("Sheet length must be positive").required("Sheet length is required"),
  sheetWidth: Yup.number().positive("Sheet width must be positive").required("Sheet width is required"),
  quantity: Yup.number().positive("Quantity must be positive").required("Quantity is required"),
  gsm: Yup.number().positive("GSM must be positive").required("GSM is required"),
  materialType: Yup.string().required("Material type is required"),
  cmykColors: Yup.string().required("CMYK color count is required"),
  pantoneColors: Yup.string().required("Pantone color count is required"),
  laminationType: Yup.string().required("Lamination type is required"),
  pastingType: Yup.string().required("Pasting/Taping type is required"),
  finishingType: Yup.string().required("Finishing type is required"),
})

const rateConfigValidation = Yup.object({
  materialTypes: Yup.array()
    .of(
      Yup.object({
        type: Yup.string().required("Material type is required"),
        costPerKg: Yup.number().positive("Cost per kg must be positive").required("Cost per kg is required"),
        unit: Yup.string().required("Unit is required"),
      }),
    )
    .min(1, "At least one material type is required"),

  cmykRate: Yup.number().positive("CMYK rate must be positive").required("CMYK rate is required"),

  cmykMinSheets: Yup.number()
    .positive("Minimum threshold sheets must be positive")
    .required("Minimum threshold sheets is required"),

  pantoneRate: Yup.number().positive("Pantone rate must be positive").required("Pantone rate is required"),

  pantoneMinAmount: Yup.number().positive("Minimum amount must be positive").required("Minimum amount is required"),

  laminationRates: Yup.array().of(
    Yup.object({
      finishType: Yup.string().required("Finish type is required"),
      coldGlueRate: Yup.number().positive("Cold glue rate must be positive").required("Cold glue rate is required"),
      thermalRate: Yup.number().positive("Thermal rate must be positive").required("Thermal rate is required"),
      unit: Yup.string().required("Unit is required"),
    }),
  ),

  finishingRates: Yup.object({
    foilStamping: Yup.number()
      .positive("Foil stamping rate must be positive")
      .required("Foil stamping rate is required"),
    dripOff: Yup.number().positive("Drip off rate must be positive").required("Drip off rate is required"),
    spotUV: Yup.number().positive("Spot UV rate must be positive").required("Spot UV rate is required"),
    metpet: Yup.number().positive("Metpet rate must be positive").required("Metpet rate is required"),
  }),

  dieCutting: Yup.object({
    ratePerSheet: Yup.number().positive("Rate per sheet must be positive").required("Rate per sheet is required"),
  }),

  pastingRates: Yup.object({
    sidePasting: Yup.number().positive("Side pasting rate must be positive").required("Side pasting rate is required"),
    bottomPasting: Yup.number()
      .positive("Bottom pasting rate must be positive")
      .required("Bottom pasting rate is required"),
    taping: Yup.number().positive("Taping rate must be positive").required("Taping rate is required"),
  }),

  machineConfig: Yup.object({
    speed: Yup.number().positive("Machine speed must be positive").required("Machine speed is required"),
    costPerHour: Yup.number().positive("Cost per hour must be positive").required("Cost per hour is required"),
  }),
})

// Initial values
const costEstimatorInitialValues = {
  length: "",
  width: "",
  sheetLength: "",
  sheetWidth: "",
  quantity: "",
  gsm: "",
  materialType: "",
  cmykColors: "",
  pantoneColors: "",
  laminationType: "",
  pastingType: "",
  finishingType: "",
}

const rateConfigInitialValues = {
  materialTypes: [
    { type: "FBB", costPerKg: "45", unit: "INR/kg" },
    { type: "Kraft Brown", costPerKg: "38", unit: "INR/kg" },
    { type: "Kraft White", costPerKg: "42", unit: "INR/kg" },
    { type: "Art Card", costPerKg: "50", unit: "INR/kg" },
  ],
  cmykRate: "2.5",
  cmykMinSheets: "1000",
  pantoneRate: "3.2",
  pantoneMinAmount: "500",
  laminationRates: [
    { finishType: "Matte", coldGlueRate: "0.85", thermalRate: "1.2", unit: "INR/100 sq.inch" },
    { finishType: "Gloss", coldGlueRate: "0.90", thermalRate: "1.25", unit: "INR/100 sq.inch" },
    { finishType: "Velvet", coldGlueRate: "1.15", thermalRate: "1.45", unit: "INR/100 sq.inch" },
  ],
  finishingRates: {
    foilStamping: "8.5",
    dripOff: "4.8",
    spotUV: "6.2",
    metpet: "12.5",
  },
  dieCutting: {
    ratePerSheet: "0.75",
  },
  pastingRates: {
    sidePasting: "0.45",
    bottomPasting: "0.38",
    taping: "0.52",
  },
  machineConfig: {
    speed: "2500",
    costPerHour: "850",
  },
}

export default function MonoCartonEstimator() {
  const [tabValue, setTabValue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEstimate = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Cost estimated successfully!");
    } catch (error) {
      toast.error("Failed to estimate cost.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API or save logic
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Configurations saved successfully!");
    } catch (error) {
      toast.error("Failed to save configurations.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleCostEstimatorSubmit = (values, { setSubmitting }) => {
    console.log("Cost Estimator values:", values)
    setTimeout(() => {
      alert("Cost estimation submitted successfully!")
      setSubmitting(false)
    }, 1000)
  }

  const handleRateConfigSubmit = (values, { setSubmitting }) => {
    console.log("Rate Configuration values:", values)
    setTimeout(() => {
      alert("All configurations saved successfully!")
      setSubmitting(false)
    }, 1000)
  }

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
            }}
          >
            {/* Header */}
            <Box sx={{ p: 4, pb: 3, textAlign: "center" }}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <CubeIcon />
                <Typography variant="h4" sx={{ fontSize: "24px", fontWeight: 600, color: "#212529" }}>
                  Mono Carton Costing Estimator
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#6c757d", fontSize: "14px", mb: 3, lineHeight: 1.5 }}>
                Professional packaging cost estimation tool for sales and production teams
              </Typography>

              {/* Top Tabs */}
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2, gap: 2 }}>
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
            {tabValue === 0 && (
              <Box sx={{ px: 4, pb: 4 }}>
                <Formik
                  initialValues={costEstimatorInitialValues}
                  validationSchema={costEstimatorValidation}
                  onSubmit={handleCostEstimatorSubmit}
                >
                  {({ errors, touched, isSubmitting, values, handleChange, handleBlur }) => (
                    <Form>
                      {/* Product Specifications */}
                      <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <ClipboardIcon />
                          <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, color: "#212529" }}>
                            Product Specifications
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "#6c757d", fontSize: "13px", mb: 3, ml: 3 }}>
                          Enter the details for your mono carton packaging requirements
                        </Typography>

                        {/* Box Dimensions */}
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <TagIcon />
                            <Typography
                              variant="subtitle2"
                              sx={{ fontSize: "14px", fontWeight: 600, color: "#212529" }}
                            >
                              Box Dimensions
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item size={{ xs: 6 }}>
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "13px", color: "#6c757d", mb: 1, fontWeight: 500 }}
                              >
                                Length (mm)
                              </Typography>
                              <TextField
                                fullWidth
                                name="length"
                                placeholder="Enter length"
                                value={values.length}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.length && Boolean(errors.length)}
                                size="small"
                                sx={{ "& .MuiOutlinedInput-root": { height: "40px" } }}
                                helperText={touched.length && errors.length}
                              />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "13px", color: "#6c757d", mb: 1, fontWeight: 500 }}
                              >
                                Width (mm)
                              </Typography>
                              <TextField
                                fullWidth
                                name="width"
                                placeholder="Enter width"
                                value={values.width}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.width && Boolean(errors.width)}
                                size="small"
                                sx={{ "& .MuiOutlinedInput-root": { height: "40px" } }}
                                helperText={touched.width && errors.width}
                              />
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Sheet Size */}
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                              📄
                            </Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontSize: "14px", fontWeight: 600, color: "#212529" }}
                            >
                              Sheet Size
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item size={{ xs: 6 }}>
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "13px", color: "#6c757d", mb: 1, fontWeight: 500 }}
                              >
                                Sheet Length (mm)
                              </Typography>
                              <TextField
                                fullWidth
                                name="sheetLength"
                                placeholder="Enter sheet length"
                                value={values.sheetLength}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.sheetLength && Boolean(errors.sheetLength)}
                                size="small"
                                sx={{ "& .MuiOutlinedInput-root": { height: "40px" } }}
                                helperText={touched.sheetLength && errors.sheetLength}
                              />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "13px", color: "#6c757d", mb: 1, fontWeight: 500 }}
                              >
                                Sheet Width (mm)
                              </Typography>
                              <TextField
                                fullWidth
                                name="sheetWidth"
                                placeholder="Enter sheet width"
                                value={values.sheetWidth}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.sheetWidth && Boolean(errors.sheetWidth)}
                                size="small"
                                sx={{ "& .MuiOutlinedInput-root": { height: "40px" } }}
                                helperText={touched.sheetWidth && errors.sheetWidth}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>

                      {/* Order Information & Material Information */}
                      <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item size={{ xs: 6 }}>
                          <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, color: "#212529", mb: 2 }}>
                            Order Information
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "13px", color: "#6c757d", mb: 1, fontWeight: 500 }}
                          >
                            Quantity
                          </Typography>
                          <TextField
                            fullWidth
                            name="quantity"
                            placeholder="Enter quantity"
                            value={values.quantity}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.quantity && Boolean(errors.quantity)}
                            size="small"
                            sx={{ "& .MuiOutlinedInput-root": { height: "40px" } }}
                            helperText={touched.quantity && errors.quantity}
                          />
                        </Grid>
                        <Grid item size={{ xs: 6 }}>
                          <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, color: "#212529", mb: 2 }}>
                            Material Information
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "13px", color: "#6c757d", mb: 1, fontWeight: 500 }}
                          >
                            GSM
                          </Typography>
                          <TextField
                            fullWidth
                            name="gsm"
                            placeholder="Enter GSM"
                            value={values.gsm}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.gsm && Boolean(errors.gsm)}
                            size="small"
                            sx={{ mb: 2, "& .MuiOutlinedInput-root": { height: "40px" } }}
                            helperText={touched.gsm && errors.gsm}
                          />
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "13px", color: "#6c757d", mb: 1, fontWeight: 500 }}
                          >
                            Material Type
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Select
                              name="materialType"
                              value={values.materialType}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              displayEmpty
                              sx={{
                                height: "40px",
                                "& .MuiSelect-select": {
                                  color: values.materialType ? "#212529" : "#adb5bd",
                                },
                              }}
                              error={touched.materialType && Boolean(errors.materialType)}
                            >
                              <MenuItem value="" disabled>
                                Select material type
                              </MenuItem>
                              <MenuItem value="duplex">Duplex Board</MenuItem>
                              <MenuItem value="artcard">Art Card</MenuItem>
                              <MenuItem value="artpaper">Art Paper</MenuItem>
                              <MenuItem value="kraft">Kraft Paper</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>

                      {/* Printing Specifications */}
                      <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                          <PrintIcon />
                          <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, color: "#212529" }}>
                            Printing Specifications
                          </Typography>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item size={{ xs: 6 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "13px", color: "#6c757d", mb: 1, fontWeight: 500 }}
                            >
                              CMYK Color Count
                            </Typography>
                            <FormControl fullWidth size="small">
                              <Select
                                name="cmykColors"
                                value={values.cmykColors}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                displayEmpty
                                sx={{
                                  height: "40px",
                                  "& .MuiSelect-select": {
                                    color: values.cmykColors ? "#212529" : "#adb5bd",
                                  },
                                }}
                                error={touched.cmykColors && Boolean(errors.cmykColors)}
                              >
                                <MenuItem value="" disabled>
                                  Select CMYK colors
                                </MenuItem>
                                <MenuItem value="1">1 Color</MenuItem>
                                <MenuItem value="2">2 Colors</MenuItem>
                                <MenuItem value="3">3 Colors</MenuItem>
                                <MenuItem value="4">4 Colors (Full Color)</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item size={{ xs: 6 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "13px", color: "#6c757d", mb: 1, fontWeight: 500 }}
                            >
                              Pantone Color Count
                            </Typography>
                            <FormControl fullWidth size="small">
                              <Select
                                name="pantoneColors"
                                value={values.pantoneColors}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                displayEmpty
                                sx={{
                                  height: "40px",
                                  "& .MuiSelect-select": {
                                    color: values.pantoneColors ? "#212529" : "#adb5bd",
                                  },
                                }}
                                error={touched.pantoneColors && Boolean(errors.pantoneColors)}
                              >
                                <MenuItem value="" disabled>
                                  Select Pantone colors
                                </MenuItem>
                                <MenuItem value="0">No Pantone</MenuItem>
                                <MenuItem value="1">1 Pantone</MenuItem>
                                <MenuItem value="2">2 Pantone</MenuItem>
                                <MenuItem value="3">3 Pantone</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Lamination & Finishing and Assembly */}
                      <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item size={{ xs: 6 }}>
                          <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, color: "#212529", mb: 2 }}>
                            Lamination & Finishing
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "13px", color: "#6c757d", mb: 1, fontWeight: 500 }}
                          >
                            Lamination Type
                          </Typography>
                          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                            <Select
                              name="laminationType"
                              value={values.laminationType}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              displayEmpty
                              sx={{
                                height: "40px",
                                "& .MuiSelect-select": {
                                  color: values.laminationType ? "#212529" : "#adb5bd",
                                },
                              }}
                              error={touched.laminationType && Boolean(errors.laminationType)}
                            >
                              <MenuItem value="" disabled>
                                Select lamination
                              </MenuItem>
                              <MenuItem value="gloss">Gloss Lamination</MenuItem>
                              <MenuItem value="matt">Matt Lamination</MenuItem>
                              <MenuItem value="none">No Lamination</MenuItem>
                            </Select>
                          </FormControl>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "13px", color: "#6c757d", mb: 1, fontWeight: 500 }}
                          >
                            Finishing Type
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Select
                              name="finishingType"
                              value={values.finishingType}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              displayEmpty
                              sx={{
                                height: "40px",
                                "& .MuiSelect-select": {
                                  color: values.finishingType ? "#212529" : "#adb5bd",
                                },
                              }}
                              error={touched.finishingType && Boolean(errors.finishingType)}
                            >
                              <MenuItem value="" disabled>
                                Select finishing
                              </MenuItem>
                              <MenuItem value="uv">UV Coating</MenuItem>
                              <MenuItem value="emboss">Embossing</MenuItem>
                              <MenuItem value="foil">Foil Stamping</MenuItem>
                              <MenuItem value="none">No Finishing</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item size={{ xs: 6 }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <GearIcon />
                            <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, color: "#212529" }}>
                              Assembly
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "13px", color: "#6c757d", mb: 1, fontWeight: 500 }}
                          >
                            Pasting/Taping Type
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Select
                              name="pastingType"
                              value={values.pastingType}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              displayEmpty
                              sx={{
                                height: "40px",
                                "& .MuiSelect-select": {
                                  color: values.pastingType ? "#212529" : "#adb5bd",
                                },
                              }}
                              error={touched.pastingType && Boolean(errors.pastingType)}
                            >
                              <MenuItem value="" disabled>
                                Select assembly type
                              </MenuItem>
                              <MenuItem value="straight">Straight Line Pasting</MenuItem>
                              <MenuItem value="crash">Crash Lock Bottom</MenuItem>
                              <MenuItem value="auto">Auto Lock Bottom</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>

                      {/* Submit Button */}
                      <ToastContainer position="top-right" autoClose={3000} />

                      <Button
                        fullWidth
                        variant="contained"
                        disabled={isSubmitting}
                        onClick={handleEstimate}
                        sx={{
                          height: "48px",
                          backgroundColor: "#4285f4",
                          fontSize: "14px",
                          fontWeight: 500,
                          borderRadius: "6px",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#3367d6" },
                          "&:disabled": { backgroundColor: "#e9ecef", color: "#6c757d" },
                        }}
                      >
                        💰 {isSubmitting ? "Calculating..." : "Estimate Cost"}
                      </Button>

                    </Form>
                  )}
                </Formik>
              </Box>
            )}

            {/* Rate Configuration Form */}
            {tabValue === 1 && (
              <Box sx={{ px: 4, pb: 4 }}>
                <Formik
                  initialValues={rateConfigInitialValues}
                  validationSchema={rateConfigValidation}
                  onSubmit={handleRateConfigSubmit}
                >
                  {({ values, handleChange, handleBlur, isSubmitting, errors, touched }) => (
                    <Form>
                      {/* Material Cost Configuration */}
                      <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Box sx={{ color: "#28a745", fontSize: "16px", mr: 1 }}>💰</Box>
                          <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, color: "#212529" }}>
                            Material Cost Configuration
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "#6c757d", fontSize: "13px", mb: 3 }}>
                          Configure cost rates for different material types
                        </Typography>

                        <FieldArray name="materialTypes">
                          {({ push, remove }) => (
                            <Box>
                              {/* Header Row */}
                              <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item size={{ xs: 4 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500 }}
                                  >
                                    Material Type
                                  </Typography>
                                </Grid>
                                <Grid item size={{ xs: 3 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500 }}
                                  >
                                    Cost per Kg
                                  </Typography>
                                </Grid>
                                <Grid item size={{ xs: 3 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500 }}
                                  >
                                    Unit
                                  </Typography>
                                </Grid>
                                <Grid item size={{ xs: 2 }}></Grid>
                              </Grid>

                              {/* Material Rows */}
                              {values.materialTypes.map((material, index) => (
                                <Grid container spacing={2} sx={{ mb: 2 }} key={index}>
                                  <Grid item size={{ xs: 4 }}>
                                    <FormControl fullWidth size="small">
                                      <Select
                                        name={`materialTypes.${index}.type`}
                                        value={material.type}
                                        onChange={handleChange}
                                        sx={{ height: "36px" }}
                                        error={
                                          touched.materialTypes?.[index]?.type &&
                                          Boolean(errors.materialTypes?.[index]?.type)
                                        }
                                      >
                                        <MenuItem value="FBB">FBB</MenuItem>
                                        <MenuItem value="Kraft Brown">Kraft Brown</MenuItem>
                                        <MenuItem value="Kraft White">Kraft White</MenuItem>
                                        <MenuItem value="Art Card">Art Card</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item size={{ xs: 3 }}>
                                    <TextField
                                      fullWidth
                                      name={`materialTypes.${index}.costPerKg`}
                                      value={material.costPerKg}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        touched.materialTypes?.[index]?.costPerKg &&
                                        Boolean(errors.materialTypes?.[index]?.costPerKg)
                                      }
                                      helperText={
                                        touched.materialTypes?.[index]?.costPerKg &&
                                        errors.materialTypes?.[index]?.costPerKg
                                      }
                                      size="small"
                                      sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                    />
                                  </Grid>
                                  <Grid item size={{ xs: 3 }}>
                                    <TextField
                                      fullWidth
                                      name={`materialTypes.${index}.unit`}
                                      value={material.unit}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      size="small"
                                      sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                    />
                                  </Grid>
                                  <Grid item size={{ xs: 2 }} sx={{ display: "flex", alignItems: "center" }}>
                                    <IconButton size="small" onClick={() => remove(index)}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              ))}

                              <Button
                                variant="text"
                                size="small"
                                sx={{ color: "#4285f4", fontSize: "13px", mt: 1 }}
                                onClick={() => push({ type: "", costPerKg: "", unit: "INR/kg" })}
                              >
                                + Add Material Type
                              </Button>
                            </Box>
                          )}
                        </FieldArray>
                      </Box>

                      <Divider sx={{ my: 4 }} />

                      {/* Printing Cost Configuration */}
                      <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Box sx={{ color: "#6f42c1", fontSize: "16px", mr: 1 }}>🎨</Box>
                          <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, color: "#212529" }}>
                            Printing Cost Configuration
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "#6c757d", fontSize: "13px", mb: 3 }}>
                          Configure rates for CMYK and Pantone printing processes
                        </Typography>

                        <Grid container spacing={4}>
                          <Grid item size={{ xs: 6 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500, mb: 1 }}
                            >
                              CMYK Rate
                            </Typography>
                            <TextField
                              fullWidth
                              name="cmykRate"
                              value={values.cmykRate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              size="small"
                              sx={{ mb: 2, "& .MuiOutlinedInput-root": { height: "36px" } }}
                              error={touched.cmykRate && Boolean(errors.cmykRate)}
                              helperText={touched.cmykRate && errors.cmykRate}
                            />
                            <Typography variant="body2" sx={{ fontSize: "12px", color: "#6c757d", mb: 1 }}>
                              INR/1000 sheets/color
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500, mb: 1 }}
                            >
                              Minimum Threshold Sheets
                            </Typography>
                            <TextField
                              fullWidth
                              name="cmykMinSheets"
                              value={values.cmykMinSheets}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              size="small"
                              sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                              error={touched.cmykMinSheets && Boolean(errors.cmykMinSheets)}
                              helperText={touched.cmykMinSheets && errors.cmykMinSheets}
                            />
                          </Grid>
                          <Grid item size={{ xs: 6 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500, mb: 1 }}
                            >
                              Pantone Rate
                            </Typography>
                            <TextField
                              fullWidth
                              name="pantoneRate"
                              value={values.pantoneRate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              size="small"
                              sx={{ mb: 2, "& .MuiOutlinedInput-root": { height: "36px" } }}
                              error={touched.pantoneRate && Boolean(errors.pantoneRate)}
                              helperText={touched.pantoneRate && errors.pantoneRate}
                            />
                            <Typography variant="body2" sx={{ fontSize: "12px", color: "#6c757d", mb: 1 }}>
                              INR/1000 sheets/color
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500, mb: 1 }}
                            >
                              Minimum Amount
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={8}>
                                <TextField
                                  fullWidth
                                  name="pantoneMinAmount"
                                  value={values.pantoneMinAmount}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  size="small"
                                  sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                  error={touched.pantoneMinAmount && Boolean(errors.pantoneMinAmount)}
                                  helperText={touched.pantoneMinAmount && errors.pantoneMinAmount}
                                />
                              </Grid>
                              <Grid item size={{ xs: 4 }}>
                                <Typography variant="body2" sx={{ fontSize: "12px", color: "#6c757d", mt: 1 }}>
                                  INR
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>

                      <Divider sx={{ my: 4 }} />

                      {/* Lamination Rate Setup */}
                      <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Box sx={{ color: "#17a2b8", fontSize: "16px", mr: 1 }}>📄</Box>
                          <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, color: "#212529" }}>
                            Lamination Rate Setup
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "#6c757d", fontSize: "13px", mb: 3 }}>
                          Configure rates for different lamination finish types
                        </Typography>

                        {/* Header Row */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item size={{ xs: 3 }}>
                            <Typography variant="body2" sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500 }}>
                              Finish Type
                            </Typography>
                          </Grid>
                          <Grid item size={{ xs: 3 }}>
                            <Typography variant="body2" sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500 }}>
                              Cold Glue Rate
                            </Typography>
                          </Grid>
                          <Grid item size={{ xs: 3 }}>
                            <Typography variant="body2" sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500 }}>
                              Thermal Rate
                            </Typography>
                          </Grid>
                          <Grid item size={{ xs: 3 }}>
                            <Typography variant="body2" sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500 }}>
                              Unit
                            </Typography>
                          </Grid>
                        </Grid>

                        {values.laminationRates.map((rate, index) => (
                          <Grid container spacing={2} sx={{ mb: 2 }} key={index}>
                            <Grid item size={{ xs: 3 }}>
                              <Typography variant="body2" sx={{ fontSize: "14px", color: "#212529", mt: 1 }}>
                                {rate.finishType}
                              </Typography>
                            </Grid>
                            <Grid item size={{ xs: 3 }}>
                              <TextField
                                fullWidth
                                name={`laminationRates.${index}.coldGlueRate`}
                                value={rate.coldGlueRate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                size="small"
                                sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                error={
                                  touched.laminationRates?.[index]?.coldGlueRate &&
                                  Boolean(errors.laminationRates?.[index]?.coldGlueRate)
                                }
                                helperText={
                                  touched.laminationRates?.[index]?.coldGlueRate &&
                                  errors.laminationRates?.[index]?.coldGlueRate
                                }
                              />
                            </Grid>
                            <Grid item size={{ xs: 3 }}>
                              <TextField
                                fullWidth
                                name={`laminationRates.${index}.thermalRate`}
                                value={rate.thermalRate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                size="small"
                                sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                error={
                                  touched.laminationRates?.[index]?.thermalRate &&
                                  Boolean(errors.laminationRates?.[index]?.thermalRate)
                                }
                                helperText={
                                  touched.laminationRates?.[index]?.thermalRate &&
                                  errors.laminationRates?.[index]?.thermalRate
                                }
                              />
                            </Grid>
                            <Grid item size={{ xs: 3 }}>
                              <Typography variant="body2" sx={{ fontSize: "12px", color: "#6c757d", mt: 1 }}>
                                {rate.unit}
                              </Typography>
                            </Grid>
                          </Grid>
                        ))}
                      </Box>

                      <Divider sx={{ my: 4 }} />

                      {/* Finishing Rates */}
                      <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Box sx={{ color: "#fd7e14", fontSize: "16px", mr: 1 }}>✨</Box>
                          <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, color: "#212529" }}>
                            Finishing Rates (Vendor Approx)
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "#6c757d", fontSize: "13px", mb: 3 }}>
                          Configure approximate vendor rates for finishing processes
                        </Typography>

                        <Grid container spacing={4}>
                          <Grid item size={{ xs: 6 }}>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                              <Grid item size={{ xs: 6 }}>
                                <Typography variant="body2" sx={{ fontSize: "14px", color: "#212529" }}>
                                  Foil Stamping
                                </Typography>
                              </Grid>
                              <Grid item size={{ xs: 3 }}>
                                <TextField
                                  fullWidth
                                  name="finishingRates.foilStamping"
                                  value={values.finishingRates.foilStamping}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  size="small"
                                  sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                  error={
                                    touched.finishingRates?.foilStamping && Boolean(errors.finishingRates?.foilStamping)
                                  }
                                  helperText={
                                    touched.finishingRates?.foilStamping && errors.finishingRates?.foilStamping
                                  }
                                />
                              </Grid>
                              <Grid item size={{ xs: 3 }}>
                                <Typography variant="body2" sx={{ fontSize: "12px", color: "#6c757d", mt: 1 }}>
                                  INR/100 sq.inch
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                              <Grid item size={{ xs: 6 }}>
                                <Typography variant="body2" sx={{ fontSize: "14px", color: "#212529" }}>
                                  Drip Off
                                </Typography>
                              </Grid>
                              <Grid item size={{ xs: 3 }}>
                                <TextField
                                  fullWidth
                                  name="finishingRates.dripOff"
                                  value={values.finishingRates.dripOff}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  size="small"
                                  sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                  error={touched.finishingRates?.dripOff && Boolean(errors.finishingRates?.dripOff)}
                                  helperText={touched.finishingRates?.dripOff && errors.finishingRates?.dripOff}
                                />
                              </Grid>
                              <Grid item size={{ xs: 3 }}>
                                <Typography variant="body2" sx={{ fontSize: "12px", color: "#6c757d", mt: 1 }}>
                                  INR/100 sq.inch
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item size={{ xs: 6 }}>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                              <Grid item size={{ xs: 6 }}>
                                <Typography variant="body2" sx={{ fontSize: "14px", color: "#212529" }}>
                                  Spot UV
                                </Typography>
                              </Grid>
                              <Grid item size={{ xs: 3 }}>
                                <TextField
                                  fullWidth
                                  name="finishingRates.spotUV"
                                  value={values.finishingRates.spotUV}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  size="small"
                                  sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                  error={touched.finishingRates?.spotUV && Boolean(errors.finishingRates?.spotUV)}
                                  helperText={touched.finishingRates?.spotUV && errors.finishingRates?.spotUV}
                                />
                              </Grid>
                              <Grid item size={{ xs: 3 }}>
                                <Typography variant="body2" sx={{ fontSize: "12px", color: "#6c757d", mt: 1 }}>
                                  INR/100 sq.inch
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                              <Grid item size={{ xs: 6 }}>
                                <Typography variant="body2" sx={{ fontSize: "14px", color: "#212529" }}>
                                  Metpet
                                </Typography>
                              </Grid>
                              <Grid item size={{ xs: 3 }}>
                                <TextField
                                  fullWidth
                                  name="finishingRates.metpet"
                                  value={values.finishingRates.metpet}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  size="small"
                                  sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                  error={touched.finishingRates?.metpet && Boolean(errors.finishingRates?.metpet)}
                                  helperText={touched.finishingRates?.metpet && errors.finishingRates?.metpet}
                                />
                              </Grid>
                              <Grid item size={{ xs: 3 }}>
                                <Typography variant="body2" sx={{ fontSize: "12px", color: "#6c757d", mt: 1 }}>
                                  INR/100 sq.inch
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>

                      <Divider sx={{ my: 4 }} />

                      {/* Die Cutting / Punching and Pasting & Taping */}
                      <Grid container spacing={4} sx={{ mb: 4 }}>
                        <Grid item size={{ xs: 6 }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Box sx={{ color: "#dc3545", fontSize: "16px", mr: 1 }}>✂️</Box>
                            <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, color: "#212529" }}>
                              Die Cutting / Punching
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item size={{ xs: 6 }}>
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500, mb: 1 }}
                              >
                                Rate per Sheet
                              </Typography>
                              <TextField
                                fullWidth
                                name="dieCutting.ratePerSheet"
                                value={values.dieCutting.ratePerSheet}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                size="small"
                                sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                error={touched.dieCutting?.ratePerSheet && Boolean(errors.dieCutting?.ratePerSheet)}
                                helperText={touched.dieCutting?.ratePerSheet && errors.dieCutting?.ratePerSheet}
                              />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                              <Typography variant="body2" sx={{ fontSize: "12px", color: "#6c757d", mt: 3 }}>
                                INR/sheet
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item size={{ xs: 6 }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Box sx={{ color: "#fd7e14", fontSize: "16px", mr: 1 }}>🔗</Box>
                            <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, color: "#212529" }}>
                              Pasting & Taping Rates
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500, mb: 1 }}
                            >
                              Side Pasting
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item size={{ xs: 6 }}>
                                <TextField
                                  fullWidth
                                  name="pastingRates.sidePasting"
                                  value={values.pastingRates.sidePasting}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  size="small"
                                  sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                  error={touched.pastingRates?.sidePasting && Boolean(errors.pastingRates?.sidePasting)}
                                  helperText={touched.pastingRates?.sidePasting && errors.pastingRates?.sidePasting}
                                />
                              </Grid>
                              <Grid item size={{ xs: 6 }}>
                                <Typography variant="body2" sx={{ fontSize: "12px", color: "#6c757d", mt: 1 }}>
                                  INR/box
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500, mb: 1 }}
                            >
                              Bottom Pasting
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item size={{ xs: 6 }}>
                                <TextField
                                  fullWidth
                                  name="pastingRates.bottomPasting"
                                  value={values.pastingRates.bottomPasting}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  size="small"
                                  sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                  error={
                                    touched.pastingRates?.bottomPasting && Boolean(errors.pastingRates?.bottomPasting)
                                  }
                                  helperText={touched.pastingRates?.bottomPasting && errors.pastingRates?.bottomPasting}
                                />
                              </Grid>
                              <Grid item size={{ xs: 6 }}>
                                <Typography variant="body2" sx={{ fontSize: "12px", color: "#6c757d", mt: 1 }}>
                                  INR/box
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500, mb: 1 }}
                            >
                              Taping
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item size={{ xs: 6 }}>
                                <TextField
                                  fullWidth
                                  name="pastingRates.taping"
                                  value={values.pastingRates.taping}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  size="small"
                                  sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                  error={touched.pastingRates?.taping && Boolean(errors.pastingRates?.taping)}
                                  helperText={touched.pastingRates?.taping && errors.pastingRates?.taping}
                                />
                              </Grid>
                              <Grid item size={{ xs: 6 }}>
                                <Typography variant="body2" sx={{ fontSize: "12px", color: "#6c757d", mt: 1 }}>
                                  INR/box
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 4 }} />

                      {/* Machine Runtime Configuration */}
                      <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Box sx={{ color: "#6c757d", fontSize: "16px", mr: 1 }}>⚙️</Box>
                          <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, color: "#212529" }}>
                            Machine Runtime Configuration
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "#6c757d", fontSize: "13px", mb: 3 }}>
                          Configure machine speed and operational costs
                        </Typography>

                        <Grid container spacing={4}>
                          <Grid item size={{ xs: 6 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500, mb: 1 }}
                            >
                              Machine Speed
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={8}>
                                <TextField
                                  fullWidth
                                  name="machineConfig.speed"
                                  value={values.machineConfig.speed}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  size="small"
                                  sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                  error={touched.machineConfig?.speed && Boolean(errors.machineConfig?.speed)}
                                  helperText={touched.machineConfig?.speed && errors.machineConfig?.speed}
                                />
                              </Grid>
                              <Grid item size={{ xs: 4 }}>
                                <Typography variant="body2" sx={{ fontSize: "12px", color: "#6c757d", mt: 1 }}>
                                  Sheets/hour
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item size={{ xs: 6 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "13px", color: "#6c757d", fontWeight: 500, mb: 1 }}
                            >
                              Cost per Hour
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={8}>
                                <TextField
                                  fullWidth
                                  name="machineConfig.costPerHour"
                                  value={values.machineConfig.costPerHour}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  size="small"
                                  sx={{ "& .MuiOutlinedInput-root": { height: "36px" } }}
                                  error={
                                    touched.machineConfig?.costPerHour && Boolean(errors.machineConfig?.costPerHour)
                                  }
                                  helperText={touched.machineConfig?.costPerHour && errors.machineConfig?.costPerHour}
                                />
                              </Grid>
                              <Grid item size={{ xs: 4 }}>
                                <Typography variant="body2" sx={{ fontSize: "12px", color: "#6c757d", mt: 1 }}>
                                  INR/hour
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Save Button */}
                      <ToastContainer position="top-right" autoClose={3000} />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        sx={{
                          height: "48px",
                          backgroundColor: "#28a745",
                          fontSize: "14px",
                          fontWeight: 500,
                          borderRadius: "6px",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#218838" },
                          "&:disabled": { backgroundColor: "#e9ecef", color: "#6c757d" },
                        }}
                      >
                        💾 {isSubmitting ? "Saving..." : "Save All Configurations"}
                      </Button>

                    </Form>
                  )}
                </Formik>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </CustomThemeProvider>
  )
}
