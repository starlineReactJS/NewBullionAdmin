import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./index";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const stored = localStorage.getItem("theme") || "light";
    const [mode, setMode] = useState(stored);

    const theme = mode === "dark" ? darkTheme : lightTheme;

    const toggleTheme = (newMode) => {
        const next = newMode || (mode === "light" ? "dark" : "light");
        setMode(next);
        localStorage.setItem("theme", next);
        document.body.className = next;
    };

    useEffect(() => {
        document.body.className = mode;
    }, []);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
            <StyledThemeProvider theme={theme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);