import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";

import {
  CubeIcon,
  ClipboardIcon,
  TagIcon,
  PrintIcon,
  GearIcon,
  DeleteIcon,
} from "./CustomIcons";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useRateConfig from "../hooks/useRateConfig";
import mapFormValuesToBackend from "../utils/mapFormvaluesTobackend";

const RateForm = () => {
  const { rateConfigInitialValues, loading, error } = useRateConfig();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ marginTop: "150px" }}
        flexDirection="column"
      >
        <CircularProgress />
        <Typography variant="body2" mt={2}>
          Loading rate configuration...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2} textAlign="center" color="error.main">
        <Typography variant="h6">Error loading config:</Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  if (!rateConfigInitialValues) {
    return (
      <Box p={2} textAlign="center">
        <Typography>No configuration data available.</Typography>
      </Box>
    );
  }

  const rateConfigValidation = Yup.object({
    materialTypes: Yup.array()
      .of(
        Yup.object({
          type: Yup.string().required("Material type is required"),
          costPerKg: Yup.number()
            .positive("Cost per kg must be positive")
            .required("Cost per kg is required"),
          unit: Yup.string().required("Unit is required"),
        })
      )
      .min(1, "At least one material type is required"),

    cmykRate: Yup.number()
      .positive("CMYK rate must be positive")
      .required("CMYK rate is required"),

    cmykMinSheets: Yup.number()
      .positive("Minimum threshold sheets must be positive")
      .required("Minimum threshold sheets is required"),

    pantoneRate: Yup.number()
      .positive("Pantone rate must be positive")
      .required("Pantone rate is required"),

    pantoneMinAmount: Yup.number()
      .positive("Minimum amount must be positive")
      .required("Minimum amount is required"),

    laminationRates: Yup.array().of(
      Yup.object({
        finishType: Yup.string().required("Finish type is required"),
        coldGlueRate: Yup.number()
          .positive("Cold glue rate must be positive")
          .required("Cold glue rate is required"),
        thermalRate: Yup.number()
          .positive("Thermal rate must be positive")
          .required("Thermal rate is required"),
        unit: Yup.string().required("Unit is required"),
      })
    ),

    finishingRates: Yup.object({
      foilStamping: Yup.number()
        .positive("Foil stamping rate must be positive")
        .required("Foil stamping rate is required"),
      dripOff: Yup.number()
        .positive("Drip off rate must be positive")
        .required("Drip off rate is required"),
      spotUV: Yup.number()
        .positive("Spot UV rate must be positive")
        .required("Spot UV rate is required"),
      metpet: Yup.number()
        .positive("Metpet rate must be positive")
        .required("Metpet rate is required"),
    }),

    dieCutting: Yup.object({
      ratePerSheet: Yup.number()
        .positive("Rate per sheet must be positive")
        .required("Rate per sheet is required"),
    }),
    punching: Yup.object({
      ratePerSheet: Yup.number()
        .positive("Rate per sheet must be positive")
        .required("Rate per sheet is required"),
    }),

    pastingRates: Yup.object({
      sidePasting: Yup.number()
        .positive("Side pasting rate must be positive")
        .required("Side pasting rate is required"),
      bottomPasting: Yup.number()
        .positive("Bottom pasting rate must be positive")
        .required("Bottom pasting rate is required"),
      taping: Yup.number()
        .positive("Taping rate must be positive")
        .required("Taping rate is required"),
    }),

    machineConfig: Yup.object({
      speed: Yup.number()
        .positive("Machine speed must be positive")
        .required("Machine speed is required"),
      costPerHour: Yup.number()
        .positive("Cost per hour must be positive")
        .required("Cost per hour is required"),
    }),
  });

  // const rateConfigInitialValues = {
  //   materialTypes: [
  //     { type: "FBB", costPerKg: "45", unit: "INR/kg" },
  //     { type: "Kraft Brown", costPerKg: "38", unit: "INR/kg" },
  //     { type: "Kraft White", costPerKg: "42", unit: "INR/kg" },
  //     { type: "Art Card", costPerKg: "50", unit: "INR/kg" },
  //   ],
  //   cmykRate: "2.5",
  //   cmykMinSheets: "1000",
  //   pantoneRate: "3.2",
  //   pantoneMinAmount: "500",
  //   laminationRates: [
  //     {
  //       finishType: "Matte",
  //       coldGlueRate: "0.85",
  //       thermalRate: "1.2",
  //       unit: "INR/100 sq.inch",
  //     },
  //     {
  //       finishType: "Gloss",
  //       coldGlueRate: "0.90",
  //       thermalRate: "1.25",
  //       unit: "INR/100 sq.inch",
  //     },
  //     {
  //       finishType: "Velvet",
  //       coldGlueRate: "1.15",
  //       thermalRate: "1.45",
  //       unit: "INR/100 sq.inch",
  //     },
  //   ],
  //   finishingRates: {
  //     foilStamping: "8.5",
  //     dripOff: "4.8",
  //     spotUV: "6.2",
  //     metpet: "12.5",
  //   },
  //   dieCutting: {
  //     ratePerSheet: "0.75",
  //   },
  //   pastingRates: {
  //     sidePasting: "0.45",
  //     bottomPasting: "0.38",
  //     taping: "0.52",
  //   },
  //   machineConfig: {
  //     speed: "2500",
  //     costPerHour: "850",
  //   },
  // };
  const handleRateConfigSubmit = async (values, { setSubmitting }) => {
    // setIsSubmitting(true);
    console.log(values);
    try {
      const payload = mapFormValuesToBackend(values);
      const response = await fetch(
        "https://greentech-api.bitsandvolts.in/api/update-rates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Rate Updated successfully!");
    } catch (error) {
      console.error("Error Updating Rate:", error);
      toast.error("Failed to Update Rate.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Box sx={{ px: 4, pb: 4 }}>
      {rateConfigInitialValues && (
        <Formik
          initialValues={rateConfigInitialValues}
          validationSchema={rateConfigValidation}
          onSubmit={handleRateConfigSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            isSubmitting,
            errors,
            touched,
          }) => (
            <Form>
              {/* Material Cost Configuration */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box sx={{ color: "#28a745", fontSize: "16px", mr: 1 }}>
                    💰
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#212529",
                    }}
                  >
                    Material Cost Configuration
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#6c757d", fontSize: "13px", mb: 3 }}
                >
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
                            sx={{
                              fontSize: "13px",
                              color: "#6c757d",
                              fontWeight: 500,
                            }}
                          >
                            Material Type
                          </Typography>
                        </Grid>
                        <Grid item size={{ xs: 3 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "13px",
                              color: "#6c757d",
                              fontWeight: 500,
                            }}
                          >
                            Cost per Kg
                          </Typography>
                        </Grid>
                        <Grid item size={{ xs: 3 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "13px",
                              color: "#6c757d",
                              fontWeight: 500,
                            }}
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
                                {rateConfigInitialValues.materialTypes.map(
                                  (item, idx) => (
                                    <MenuItem key={idx} value={item.type}>
                                      {item.type}
                                    </MenuItem>
                                  )
                                )}
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
                                Boolean(
                                  errors.materialTypes?.[index]?.costPerKg
                                )
                              }
                              helperText={
                                touched.materialTypes?.[index]?.costPerKg &&
                                errors.materialTypes?.[index]?.costPerKg
                              }
                              size="small"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: "36px",
                                },
                              }}
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
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: "36px",
                                },
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            size={{ xs: 2 }}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => remove(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}

                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: "#4285f4",
                          fontSize: "13px",
                          mt: 1,
                        }}
                        onClick={() =>
                          push({
                            type: "",
                            costPerKg: "",
                            unit: "INR/kg",
                          })
                        }
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
                  <Box sx={{ color: "#6f42c1", fontSize: "16px", mr: 1 }}>
                    🎨
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#212529",
                    }}
                  >
                    Printing Cost Configuration
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#6c757d", fontSize: "13px", mb: 3 }}
                >
                  Configure rates for CMYK and Pantone printing processes
                </Typography>

                <Grid container spacing={4}>
                  <Grid item size={{ xs: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        fontWeight: 500,
                        mb: 1,
                      }}
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
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": { height: "36px" },
                      }}
                      error={touched.cmykRate && Boolean(errors.cmykRate)}
                      helperText={touched.cmykRate && errors.cmykRate}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "12px", color: "#6c757d", mb: 1 }}
                    >
                      INR/1000 sheets/color
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        fontWeight: 500,
                        mb: 1,
                      }}
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
                      sx={{
                        "& .MuiOutlinedInput-root": { height: "36px" },
                      }}
                      error={
                        touched.cmykMinSheets && Boolean(errors.cmykMinSheets)
                      }
                      helperText={touched.cmykMinSheets && errors.cmykMinSheets}
                    />
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        fontWeight: 500,
                        mb: 1,
                      }}
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
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": { height: "36px" },
                      }}
                      error={touched.pantoneRate && Boolean(errors.pantoneRate)}
                      helperText={touched.pantoneRate && errors.pantoneRate}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "12px", color: "#6c757d", mb: 1 }}
                    >
                      INR/1000 sheets/color
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        fontWeight: 500,
                        mb: 1,
                      }}
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: "36px",
                            },
                          }}
                          error={
                            touched.pantoneMinAmount &&
                            Boolean(errors.pantoneMinAmount)
                          }
                          helperText={
                            touched.pantoneMinAmount && errors.pantoneMinAmount
                          }
                        />
                      </Grid>
                      <Grid item size={{ xs: 4 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "12px",
                            color: "#6c757d",
                            mt: 1,
                          }}
                        >
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
                  <Box sx={{ color: "#17a2b8", fontSize: "16px", mr: 1 }}>
                    📄
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#212529",
                    }}
                  >
                    Lamination Rate Setup
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#6c757d", fontSize: "13px", mb: 3 }}
                >
                  Configure rates for different lamination finish types
                </Typography>

                {/* Header Row */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item size={{ xs: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        fontWeight: 500,
                      }}
                    >
                      Finish Type
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        fontWeight: 500,
                      }}
                    >
                      Cold Glue Rate
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        fontWeight: 500,
                      }}
                    >
                      Thermal Rate
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        fontWeight: 500,
                      }}
                    >
                      Unit
                    </Typography>
                  </Grid>
                </Grid>

                {values.laminationRates.map((rate, index) => (
                  <Grid container spacing={2} sx={{ mb: 2 }} key={index}>
                    <Grid item size={{ xs: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "14px",
                          color: "#212529",
                          mt: 1,
                        }}
                      >
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: "36px",
                          },
                        }}
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: "36px",
                          },
                        }}
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
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          color: "#6c757d",
                          mt: 1,
                        }}
                      >
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
                  <Box sx={{ color: "#fd7e14", fontSize: "16px", mr: 1 }}>
                    ✨
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#212529",
                    }}
                  >
                    Finishing Rates (Vendor Approx)
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#6c757d", fontSize: "13px", mb: 3 }}
                >
                  Configure approximate vendor rates for finishing processes
                </Typography>

                <Grid container spacing={4}>
                  <Grid item size={{ xs: 6 }}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item size={{ xs: 6 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "14px", color: "#212529" }}
                        >
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: "36px",
                            },
                          }}
                          error={
                            touched.finishingRates?.foilStamping &&
                            Boolean(errors.finishingRates?.foilStamping)
                          }
                          helperText={
                            touched.finishingRates?.foilStamping &&
                            errors.finishingRates?.foilStamping
                          }
                        />
                      </Grid>
                      <Grid item size={{ xs: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "12px",
                            color: "#6c757d",
                            mt: 1,
                          }}
                        >
                          INR/100 sq.inch
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item size={{ xs: 6 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "14px", color: "#212529" }}
                        >
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: "36px",
                            },
                          }}
                          error={
                            touched.finishingRates?.dripOff &&
                            Boolean(errors.finishingRates?.dripOff)
                          }
                          helperText={
                            touched.finishingRates?.dripOff &&
                            errors.finishingRates?.dripOff
                          }
                        />
                      </Grid>
                      <Grid item size={{ xs: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "12px",
                            color: "#6c757d",
                            mt: 1,
                          }}
                        >
                          INR/100 sq.inch
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item size={{ xs: 6 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "14px", color: "#212529" }}
                        >
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: "36px",
                            },
                          }}
                          error={
                            touched.finishingRates?.spotUV &&
                            Boolean(errors.finishingRates?.spotUV)
                          }
                          helperText={
                            touched.finishingRates?.spotUV &&
                            errors.finishingRates?.spotUV
                          }
                        />
                      </Grid>
                      <Grid item size={{ xs: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "12px",
                            color: "#6c757d",
                            mt: 1,
                          }}
                        >
                          INR/100 sq.inch
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item size={{ xs: 6 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "14px", color: "#212529" }}
                        >
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: "36px",
                            },
                          }}
                          error={
                            touched.finishingRates?.metpet &&
                            Boolean(errors.finishingRates?.metpet)
                          }
                          helperText={
                            touched.finishingRates?.metpet &&
                            errors.finishingRates?.metpet
                          }
                        />
                      </Grid>
                      <Grid item size={{ xs: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "12px",
                            color: "#6c757d",
                            mt: 1,
                          }}
                        >
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ color: "#dc3545", fontSize: "16px", mr: 1 }}>
                      ✂️
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#212529",
                      }}
                    >
                      Die Cutting & Punching
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item size={{ xs: 6 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "13px",
                          color: "#6c757d",
                          fontWeight: 500,
                          mb: 1,
                        }}
                      >
                        Die Cutting Rate per Sheet
                      </Typography>
                      <TextField
                        fullWidth
                        name="dieCutting.ratePerSheet"
                        value={values.dieCutting.ratePerSheet}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: "36px",
                          },
                        }}
                        error={
                          touched.dieCutting?.ratePerSheet &&
                          Boolean(errors.dieCutting?.ratePerSheet)
                        }
                        helperText={
                          touched.dieCutting?.ratePerSheet &&
                          errors.dieCutting?.ratePerSheet
                        }
                      />
                    </Grid>
                    <Grid item size={{ xs: 6 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          color: "#6c757d",
                          mt: 3,
                        }}
                      >
                        INR/sheet
                      </Typography>
                    </Grid>
                    {/* <Grid item size={{ xs: 6 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "13px",
                                  color: "#6c757d",
                                  fontWeight: 500,
                                  mb: 1,
                                }}
                              >
                                Punching Rate per Sheet
                              </Typography>
                              <TextField
                                fullWidth
                                name="punching.ratePerSheet"
                                value={values.punching.ratePerSheet}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                size="small"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    height: "36px",
                                  },
                                }}
                                error={
                                  touched.punching?.ratePerSheet &&
                                  Boolean(errors.punching?.ratePerSheet)
                                }
                                helperText={
                                  touched.punching?.ratePerSheet &&
                                  errors.punching?.ratePerSheet
                                }
                              />
                            </Grid> */}
                    {/* <Grid item size={{ xs: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "12px",
                        color: "#6c757d",
                        mt: 3,
                      }}
                    >
                      INR/sheet
                    </Typography>
                  </Grid> */}
                  </Grid>
                </Grid>
                <Grid item size={{ xs: 6 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ color: "#fd7e14", fontSize: "16px", mr: 1 }}>
                      🔗
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#212529",
                      }}
                    >
                      Pasting & Taping Rates
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        fontWeight: 500,
                        mb: 1,
                      }}
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: "36px",
                            },
                          }}
                          error={
                            touched.pastingRates?.sidePasting &&
                            Boolean(errors.pastingRates?.sidePasting)
                          }
                          helperText={
                            touched.pastingRates?.sidePasting &&
                            errors.pastingRates?.sidePasting
                          }
                        />
                      </Grid>
                      <Grid item size={{ xs: 6 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "12px",
                            color: "#6c757d",
                            mt: 1,
                          }}
                        >
                          INR/box
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        fontWeight: 500,
                        mb: 1,
                      }}
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: "36px",
                            },
                          }}
                          error={
                            touched.pastingRates?.bottomPasting &&
                            Boolean(errors.pastingRates?.bottomPasting)
                          }
                          helperText={
                            touched.pastingRates?.bottomPasting &&
                            errors.pastingRates?.bottomPasting
                          }
                        />
                      </Grid>
                      <Grid item size={{ xs: 6 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "12px",
                            color: "#6c757d",
                            mt: 1,
                          }}
                        >
                          INR/box
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        fontWeight: 500,
                        mb: 1,
                      }}
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: "36px",
                            },
                          }}
                          error={
                            touched.pastingRates?.taping &&
                            Boolean(errors.pastingRates?.taping)
                          }
                          helperText={
                            touched.pastingRates?.taping &&
                            errors.pastingRates?.taping
                          }
                        />
                      </Grid>
                      <Grid item size={{ xs: 6 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "12px",
                            color: "#6c757d",
                            mt: 1,
                          }}
                        >
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
                  <Box sx={{ color: "#6c757d", fontSize: "16px", mr: 1 }}>
                    ⚙️
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#212529",
                    }}
                  >
                    Machine Runtime Configuration
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#6c757d", fontSize: "13px", mb: 3 }}
                >
                  Configure machine speed and operational costs
                </Typography>

                <Grid container spacing={4}>
                  <Grid item size={{ xs: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        fontWeight: 500,
                        mb: 1,
                      }}
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: "36px",
                            },
                          }}
                          error={
                            touched.machineConfig?.speed &&
                            Boolean(errors.machineConfig?.speed)
                          }
                          helperText={
                            touched.machineConfig?.speed &&
                            errors.machineConfig?.speed
                          }
                        />
                      </Grid>
                      <Grid item size={{ xs: 4 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "12px",
                            color: "#6c757d",
                            mt: 1,
                          }}
                        >
                          Sheets/hour
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        fontWeight: 500,
                        mb: 1,
                      }}
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: "36px",
                            },
                          }}
                          error={
                            touched.machineConfig?.costPerHour &&
                            Boolean(errors.machineConfig?.costPerHour)
                          }
                          helperText={
                            touched.machineConfig?.costPerHour &&
                            errors.machineConfig?.costPerHour
                          }
                        />
                      </Grid>
                      <Grid item size={{ xs: 4 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "12px",
                            color: "#6c757d",
                            mt: 1,
                          }}
                        >
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
                // onClick={handleSubmit}
                sx={{
                  height: "48px",
                  backgroundColor: "#28a745",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderRadius: "6px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#218838" },
                  "&:disabled": {
                    backgroundColor: "#e9ecef",
                    color: "#6c757d",
                  },
                }}
              >
                💾 {isSubmitting ? "Saving..." : "Save All Configurations"}
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Box>
  );
};

export default RateForm;
