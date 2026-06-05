import React, { createContext, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { getSourceDetail } from "../ApiServices/services";
import ClientSocket from "../socketHandler/ClientSocket";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "../theme";
import { Drawer } from "antd";

export const sourceContext = createContext();

// ─────────────────────────────────────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────────────────────────────────────

const LayoutRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${({ theme }) => theme.colors.bgBase};
  font-family: ${({ theme }) => theme.font.family};
  overflow: hidden;
  transition: background 0.25s ease;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
`;

/**
 * Single desktop sidebar slot.
 * - When $open=false → renders icon-only Sidebar (open=false), width = sidebarCollapsed
 * - When $open=true  → renders full Sidebar (open=true),  width = sidebarWidth
 * Smooth width transition handles the animation.
 * Hidden on mobile.
 */
const DesktopSidebarSlot = styled.div`
  flex-shrink: 0;
  height: 100%;
  width: ${({ $open, theme }) =>
    $open ? theme.sidebarWidth : theme.sidebarCollapsed};
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  z-index: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${({ theme }) => theme.colors.bgContent};
  transition: background 0.25s ease;
  padding: 10px;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.borderStrong};
  }
`;

// Ant Drawer overrides — mobile only
const DrawerGlobalStyle = styled.div`
  display: contents;

  .sidebar-mobile-drawer .ant-drawer-body {
    padding: 0;
    background: ${({ theme }) => theme.colors.bgSidebar};
  }

  .sidebar-mobile-drawer .ant-drawer-content {
    background: ${({ theme }) => theme.colors.bgSidebar};
  }

  .sidebar-mobile-drawer .ant-drawer-content-wrapper {
    box-shadow: 4px 0 32px rgba(0, 0, 0, 0.5) !important;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Hook: detect mobile
// ─────────────────────────────────────────────────────────────────────────────

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= breakpoint
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const AdminBullionLayout = () => {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const contentRef = useRef(null);

  const localTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState(localTheme || "light");
  const [sourceData, setSourceData] = useState([]);

  const isMobile = useIsMobile();

  const getSourceData = async () => {
    try {
      const response = await getSourceDetail();
      setSourceData(response?.success && response?.data ? response.data : []);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    getSourceData();
  }, []);

  useEffect(() => {
    setDesktopOpen(true);
    setMobileDrawerOpen(false);
  }, [isMobile]);

  const handleToggle = () => {
    if (isMobile) {
      setMobileDrawerOpen((o) => !o);
    } else {
      setDesktopOpen((o) => !o);
    }
  };

  const activeTheme = theme === "dark" ? darkTheme : lightTheme;

  return (
    <>
      <ClientSocket />
      <ThemeProvider theme={activeTheme}>
        <DrawerGlobalStyle>
          <LayoutRoot>
            <Header
              toggleDrawer={handleToggle}
              theme={theme}
              themeFn={setTheme}
            />

            <Body>
              {/* ── DESKTOP: single sidebar slot, toggles between icon-only and full ── */}
              <DesktopSidebarSlot $open={desktopOpen}>
                <Sidebar
                  open={desktopOpen}
                  onNavigate={() => setDesktopOpen(false)}
                />
              </DesktopSidebarSlot>

              {/* ── MOBILE: Ant Drawer overlay ── */}
              <Drawer
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
                placement="left"
                size={240}
                closable={false}
                className="sidebar-mobile-drawer"
                maskClosable={true}
                style={{ top: activeTheme.headerHeight }}
                styles={{
                  body: { padding: 0 },
                  mask: { top: activeTheme.headerHeight },
                }}
              >
                <Sidebar
                  open={true}
                  onNavigate={() => setMobileDrawerOpen(false)}
                />
              </Drawer>

              {/* ── Content ── */}
              <ContentArea  ref={contentRef}>
                <sourceContext.Provider value={sourceData}>
                  <Outlet context={{ contentRef }}/>
                </sourceContext.Provider>
              </ContentArea>
            </Body>
          </LayoutRoot>
        </DrawerGlobalStyle>
      </ThemeProvider>
    </>
  );
};

export default AdminBullionLayout;