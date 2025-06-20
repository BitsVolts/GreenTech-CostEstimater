"use client"

import { useState } from "react"
import { Box, Typography, TextField, Button, Grid, FormControl, Select, MenuItem, FormHelperText } from "@mui/material"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import CostEstimationModal from "../modals/CostEstimationModal"

// Custom Icons (replace with your actual icons)
const ClipboardIcon = () => <span style={{ marginRight: 8 }}>📋</span>
const TagIcon = () => <span style={{ marginRight: 8 }}>🏷️</span>
const PrintIcon = () => <span style={{ marginRight: 8 }}>🖨️</span>
const GearIcon = () => <span style={{ marginRight: 8 }}>⚙️</span>

// Mock modal component - replace with your actual modal

const CostEstimateForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [costResult, setCostResult] = useState(null)

  // Fixed validation schema with correct field names
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
    pastingOptions: Yup.string().required("Pasting/Taping type is required"),
    finishingTypes: Yup.string().required("Finishing type is required"),
  })

  // Initial values with correct field names
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
    pastingOptions: "",
    finishingTypes: "",
  }

  // Fixed submit handler
  const handleCostEstimatorSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true)
    console.log("Form submitted with values:", values)

    try {
      const response = await fetch("http://localhost:3000/api/calculate-cost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setCostResult(data)
      setOpenModal(true)
      toast.success("Cost estimated successfully!")
    } catch (error) {
      console.error("Error submitting cost estimation:", error)
      toast.error("Failed to estimate cost.")
    } finally {
      setSubmitting(false)
      setIsSubmitting(false)
    }
   }

  return (
    <Box sx={{ px: 4, pb: 4, maxWidth: 1200, mx: "auto" }}>
      {/* {openModal && costResult && ( */}
        <CostEstimationModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          costData={costResult}
        />
      {/* )} */}
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
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#212529",
                  }}
                >
                  Product Specifications
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#6c757d",
                  fontSize: "13px",
                  mb: 3,
                  ml: 3,
                }}
              >
                Enter the details for your mono carton packaging requirements
              </Typography>

              {/* Box Dimensions - Two fields per row */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TagIcon />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#212529",
                    }}
                  >
                    Box Dimensions
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        mb: 1,
                        fontWeight: 500,
                      }}
                    >
                      Length (mm)
                    </Typography>
                    <TextField
                      fullWidth
                      name="length"
                      type="number"
                      placeholder="Enter length"
                      value={values.length}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.length && Boolean(errors.length)}
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                        },
                      }}
                      helperText={touched.length && errors.length}
                    />
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        mb: 1,
                        fontWeight: 500,
                      }}
                    >
                      Width (mm)
                    </Typography>
                    <TextField
                      fullWidth
                      name="width"
                      type="number"
                      placeholder="Enter width"
                      value={values.width}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.width && Boolean(errors.width)}
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                        },
                      }}
                      helperText={touched.width && errors.width}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Sheet Size - Two fields per row */}
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
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#212529",
                    }}
                  >
                    Sheet Size
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        mb: 1,
                        fontWeight: 500,
                      }}
                    >
                      Sheet Length (mm)
                    </Typography>
                    <TextField
                      fullWidth
                      name="sheetLength"
                      type="number"
                      placeholder="Enter sheet length"
                      value={values.sheetLength}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.sheetLength && Boolean(errors.sheetLength)}
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                        },
                      }}
                      helperText={touched.sheetLength && errors.sheetLength}
                    />
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        mb: 1,
                        fontWeight: 500,
                      }}
                    >
                      Sheet Width (mm)
                    </Typography>
                    <TextField
                      fullWidth
                      name="sheetWidth"
                      type="number"
                      placeholder="Enter sheet width"
                      value={values.sheetWidth}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.sheetWidth && Boolean(errors.sheetWidth)}
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                        },
                      }}
                      helperText={touched.sheetWidth && errors.sheetWidth}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Order Information & Material Information - Two sections per row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item size={{ xs: 6 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#212529",
                    mb: 2,
                  }}
                >
                  Order Information
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "13px",
                    color: "#6c757d",
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  Quantity
                </Typography>
                <TextField
                  fullWidth
                  name="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={values.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.quantity && Boolean(errors.quantity)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": { height: "40px" },
                  }}
                  helperText={touched.quantity && errors.quantity}
                />
              </Grid>
              <Grid item size={{ xs: 6 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#212529",
                    mb: 2,
                  }}
                >
                  Material Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        mb: 1,
                        fontWeight: 500,
                      }}
                    >
                      GSM
                    </Typography>
                    <TextField
                      fullWidth
                      name="gsm"
                      type="number"
                      placeholder="Enter GSM"
                      value={values.gsm}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.gsm && Boolean(errors.gsm)}
                      size="small"
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": { height: "40px" },
                      }}
                      helperText={touched.gsm && errors.gsm}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        mb: 1,
                        fontWeight: 500,
                      }}
                    >
                      Material Type
                    </Typography>
                    <FormControl fullWidth size="small" error={touched.materialType && Boolean(errors.materialType)}>
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
                      >
                        <MenuItem value="" disabled>
                          Select material type
                        </MenuItem>
                        <MenuItem value="Duplex">Duplex Board</MenuItem>
                        <MenuItem value="ArtCard">Art Card</MenuItem>
                        <MenuItem value="ArtPaper">Art Paper</MenuItem>
                        <MenuItem value="Kraft">Kraft Paper</MenuItem>
                      </Select>
                      {touched.materialType && errors.materialType && (
                        <FormHelperText>{errors.materialType}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Printing Specifications - Two fields per row */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <PrintIcon />
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#212529",
                  }}
                >
                  Printing Specifications
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item size={{ xs: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "13px",
                      color: "#6c757d",
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    CMYK Color Count
                  </Typography>
                  <FormControl fullWidth size="small" error={touched.cmykColors && Boolean(errors.cmykColors)}>
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
                    >
                      <MenuItem value="" disabled>
                        Select CMYK colors
                      </MenuItem>
                      <MenuItem value="1">1 Color</MenuItem>
                      <MenuItem value="2">2 Colors</MenuItem>
                      <MenuItem value="3">3 Colors</MenuItem>
                      <MenuItem value="4">4 Colors (Full Color)</MenuItem>
                    </Select>
                    {touched.cmykColors && errors.cmykColors && <FormHelperText>{errors.cmykColors}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item size={{ xs: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "13px",
                      color: "#6c757d",
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    Pantone Color Count
                  </Typography>
                  <FormControl fullWidth size="small" error={touched.pantoneColors && Boolean(errors.pantoneColors)}>
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
                    >
                      <MenuItem value="" disabled>
                        Select Pantone colors
                      </MenuItem>
                      <MenuItem value="0">No Pantone</MenuItem>
                      <MenuItem value="1">1 Pantone</MenuItem>
                      <MenuItem value="2">2 Pantone</MenuItem>
                      <MenuItem value="3">3 Pantone</MenuItem>
                    </Select>
                    {touched.pantoneColors && errors.pantoneColors && (
                      <FormHelperText>{errors.pantoneColors}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Lamination & Finishing and Assembly - Two sections per row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item size={{ xs: 6 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#212529",
                    mb: 2,
                  }}
                >
                  Lamination & Finishing
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 12 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        mb: 1,
                        fontWeight: 500,
                      }}
                    >
                      Lamination Type
                    </Typography>
                    <FormControl
                      fullWidth
                      size="small"
                      error={touched.laminationType && Boolean(errors.laminationType)}
                    >
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
                      >
                        <MenuItem value="" disabled>
                          Select lamination
                        </MenuItem>
                        <MenuItem value="gloss">Gloss Lamination</MenuItem>
                        <MenuItem value="matt">Matt Lamination</MenuItem>
                        <MenuItem value="none">No Lamination</MenuItem>
                      </Select>
                      {touched.laminationType && errors.laminationType && (
                        <FormHelperText>{errors.laminationType}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item size={{ xs: 12 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#6c757d",
                        mb: 1,
                        fontWeight: 500,
                        mt: 2,
                      }}
                    >
                      Finishing Type
                    </Typography>
                    <FormControl
                      fullWidth
                      size="small"
                      error={touched.finishingTypes && Boolean(errors.finishingTypes)}
                    >
                      <Select
                        name="finishingTypes"
                        value={values.finishingTypes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        displayEmpty
                        sx={{
                          height: "40px",
                          "& .MuiSelect-select": {
                            color: values.finishingTypes ? "#212529" : "#adb5bd",
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select finishing
                        </MenuItem>
                        <MenuItem value="uv">UV Coating</MenuItem>
                        <MenuItem value="emboss">Embossing</MenuItem>
                        <MenuItem value="foilStamping">Foil Stamping</MenuItem>
                        <MenuItem value="spotUV">Spot UV</MenuItem>
                        <MenuItem value="dripOff">Drip Off</MenuItem>
                        <MenuItem value="metpet">Metpet</MenuItem>
                        <MenuItem value="none">No Finishing</MenuItem>
                      </Select>
                      {touched.finishingTypes && errors.finishingTypes && (
                        <FormHelperText>{errors.finishingTypes}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item size={{ xs: 6 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <GearIcon />
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#212529",
                    }}
                  >
                    Assembly
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "13px",
                    color: "#6c757d",
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  Pasting/Taping Type
                </Typography>
                <FormControl fullWidth size="small" error={touched.pastingOptions && Boolean(errors.pastingOptions)}>
                  <Select
                    name="pastingOptions"
                    value={values.pastingOptions}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    displayEmpty
                    sx={{
                      height: "40px",
                      "& .MuiSelect-select": {
                        color: values.pastingOptions ? "#212529" : "#adb5bd",
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select assembly type
                    </MenuItem>
                    <MenuItem value="sidePasting">Side Pasting</MenuItem>
                    <MenuItem value="bottomPasting">Bottom Pasting</MenuItem>
                    <MenuItem value="taping">Taping</MenuItem>
                  </Select>
                  {touched.pastingOptions && errors.pastingOptions && (
                    <FormHelperText>{errors.pastingOptions}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <ToastContainer position="top-right" autoClose={3000} />

            <Button
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              type="submit"
              sx={{
                height: "48px",
                backgroundColor: "#4285f4",
                fontSize: "14px",
                fontWeight: 500,
                borderRadius: "6px",
                textTransform: "none",
                "&:hover": { backgroundColor: "#3367d6" },
                "&:disabled": {
                  backgroundColor: "#e9ecef",
                  color: "#6c757d",
                },
              }}
            >
              💰 {isSubmitting ? "Calculating..." : "Estimate Cost"}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default CostEstimateForm
