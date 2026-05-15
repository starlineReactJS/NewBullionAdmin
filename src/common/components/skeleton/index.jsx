import React from "react";
import { useTheme } from "styled-components";

const Skeleton = ({
    height = "20px",
    width = "100%",
    radius = "8px",
    style = {},
}) => {
    const theme = useTheme();

    const isDark = theme.mode === "dark";

    return (
        <>
            <style>
                {`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}
            </style>

            <div
                style={{
                    position: "relative",
                    overflow: "hidden",
                    background: isDark ? "#1E2430" : "#E8ECF3",
                    height,
                    width,
                    borderRadius: radius,
                    ...style,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        transform: "translateX(-100%)",
                        background: isDark
                            ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)"
                            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
                        animation: "shimmer 1.4s infinite",
                    }}
                />
            </div>
        </>
    );
};

export default Skeleton;