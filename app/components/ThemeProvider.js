"use client"

import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { createTheme } from "@mui/material/styles"

const theme = createTheme({
    palette: {
        primary: {
            main: "#4285f4",
        },
        secondary: {
            main: "#6c757d",
        },
        background: {
            default: "#f8f9fa",
        },
        text: {
            primary: "#212529",
            secondary: "#6c757d",
        },
    },
    typography: {
        fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
        h4: {
            fontSize: "24px",
            fontWeight: 600,
            color: "#212529",
        },
        body1: {
            fontSize: "14px",
            color: "#6c757d",
        },
        body2: {
            fontSize: "13px",
            color: "#6c757d",
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        backgroundColor: "#fff",
                        fontSize: "14px",
                        "& fieldset": {
                            borderColor: "#e9ecef",
                        },
                        "&:hover fieldset": {
                            borderColor: "#dee2e6",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#4285f4",
                            borderWidth: "1px",
                        },
                    },
                    "& .MuiInputLabel-root": {
                        fontSize: "14px",
                        color: "#6c757d",
                        fontWeight: 500,
                    },
                    "& .MuiOutlinedInput-input": {
                        padding: "12px 14px",
                        fontSize: "14px",
                        "&::placeholder": {
                            color: "#adb5bd",
                            opacity: 1,
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: "6px",
                    backgroundColor: "#fff",
                    fontSize: "14px",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e9ecef",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#dee2e6",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4285f4",
                        borderWidth: "1px",
                    },
                },
                select: {
                    padding: "12px 14px",
                    fontSize: "14px",
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    "& .MuiInputLabel-root": {
                        fontSize: "14px",
                        color: "#6c757d",
                        fontWeight: 500,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    minHeight: "40px",
                    padding: "8px 20px",
                },
            },
        },
    },
})

export default function CustomThemeProvider({ children }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}
