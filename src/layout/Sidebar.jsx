import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { adminRoutesConfig } from "../routes/adminRoutes";
import { routePermissionKeyMap } from "../constants/main";
import { useAuth } from "../context/AuthContext";
import { flattenPermissions } from "@/utils";
import styled, { keyframes, css } from "styled-components";

// ─────────────────────────────────────────────────────────────────────────────
// Animations
// ─────────────────────────────────────────────────────────────────────────────

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateY(-6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const subExpand = keyframes`
  from { opacity: 0; transform: translateY(-4px); max-height: 0; }
  to   { opacity: 1; transform: translateY(0); max-height: 400px; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────────────────────────────────────

const Nav = styled.nav`
  position: relative;
  height: 100%;
  background: ${({ theme }) => theme.colors.bgSidebar};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.shadowSidebar};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Desktop: respects open/collapse */
  width: ${({ $open, theme }) =>
    $open ? theme.sidebarWidth : theme.sidebarCollapsed};

  /* Inside mobile Drawer: always full width */
  .sidebar-mobile-drawer & {
    width: 100% !important;
    height: 100%;
    border-right: none;
    box-shadow: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.bgSidebarActive};
  }
`;

const MenuList = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing.md} 0;
  display: flex;
  flex-direction: column;
  gap: 2px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }
`;

const ItemWrapper = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  animation: ${slideIn} 0.2s ease both;
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ $open }) => ($open ? "9px 12px" : "10px")};
  justify-content: ${({ $open }) => ($open ? "flex-start" : "center")};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.bgSidebarActive : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.textSidebarActive : theme.colors.textSidebarItem};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeLg};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.font.weightSemiBold : theme.font.weightBold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: ${({ $active, theme }) =>
    $active ? theme.colors.shadowSidebarItem : "none"};

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.bgSidebarActive : theme.colors.bgSidebarHover};
    color: ${({ theme }) => theme.colors.textSidebarActive};
    transform: translateX(2px);
  }

  &:active { transform: translateX(1px) scale(0.99); }
`;

const ItemIcon = styled.span`
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  transition: ${({ theme }) => theme.transition};

  ${MenuItem}:hover & {
    transform: scale(1.1);
  }
`;

const ItemLabel = styled.span`
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: opacity 0.25s ease;
  pointer-events: none;
`;

const ArrowIcon = styled(IoMdArrowDropdown)`
  flex-shrink: 0;
  font-size: 18px;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ $expanded }) => ($expanded ? "rotate(-180deg)" : "rotate(0)")};
  color: inherit;
  opacity: 0.7;
`;

const SubMenu = styled.div`
  margin: 2px 0 4px;
  animation: ${subExpand} 0.25s cubic-bezier(0.4, 0, 0.2, 1) both;
  overflow: hidden;
`;

const SubItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 7px 12px 7px 44px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.textSidebarActive : theme.colors.textSecondary};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeMd};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.font.weightSemiBold : theme.font.weightBold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  text-align: left;
  position: relative;
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute;
    left: 28px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
    transition: ${({ theme }) => theme.transition};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.bgSidebarHover};
    color: ${({ theme }) => theme.colors.textSidebarActive};
    transform: translateX(3px);

    &::before { background: ${({ theme }) => theme.colors.primary}; }
  }
`;

/* Floating sub-menu — only for collapsed desktop sidebar */
const FloatMenu = styled.div`
  position: fixed;
  z-index: 500;
  background: ${({ theme }) => theme.colors.bgFloatMenu};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadowFloatMenu};
  padding: ${({ theme }) => theme.spacing.xs};
  min-width: 180px;
  animation: ${fadeSlide} 0.18s ease both;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
`;

const FloatItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSidebarItem};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.font.weightSemiBold : theme.font.weightMedium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  text-align: left;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSidebarHover};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FloatMenuTitle = styled.div`
  font-size: ${({ theme }) => theme.font.sizeXs};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 6px 12px 4px;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.divider};
  margin: 4px 0;
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sidebar
 * Props:
 *  open        — boolean: expanded (true) or icon-only (false) on desktop
 *  onNavigate  — optional callback fired after navigation (used by mobile drawer to close itself)
 */
const Sidebar = ({ open, onNavigate }) => {
  const { auth: { permissions: userPermissions } } = useAuth();
  const [expandedMenuId, setExpandedMenuId] = useState(null);
  const [floatingMenuId, setFloatingMenuId] = useState(null);
  const [floatingMenuPos, setFloatingMenuPos] = useState({ top: 0, left: 0 });

  const floatingMenuRef = useRef(null);
  const sidebarRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const cleanPath = location.pathname.replace(/^\/+/, "");
  const firstEmptyMenu = adminRoutesConfig.find((menu) => menu.path === "");

  const checkDirectActive = (menu) => {
    const cp = location.pathname.replace(/^\/+/, "");
    if (menu.id === firstEmptyMenu?.id && menu.path === "") {
      return cp === "" || cp === "admin";
    }
    if (menu.path === "") return false;
    return cp === menu.path;
  };

  const checkParentActive = (menu) => {
    if (!menu.subMenu) return false;
    return cleanPath.startsWith(menu.path + "/");
  };

  const checkSubActive = (menu, sub) =>
    cleanPath === `${menu.path}/${sub.path}`;

  // Close floating menu on outside click
  useEffect(() => {
    const onOutsideClick = (e) => {
      if (
        floatingMenuRef.current &&
        !floatingMenuRef.current.contains(e.target) &&
        !sidebarRef.current?.contains(e.target)
      ) {
        setFloatingMenuId(null);
      }
    };
    const onKeyPress = (e) => {
      if (e.key === "Escape") setFloatingMenuId(null);
    };
    document.addEventListener("mousedown", onOutsideClick);
    document.addEventListener("touchstart", onOutsideClick);
    document.addEventListener("keydown", onKeyPress);
    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
      document.removeEventListener("touchstart", onOutsideClick);
      document.removeEventListener("keydown", onKeyPress);
    };
  }, []);

  useEffect(() => {
    setFloatingMenuId(null);
  }, [location.pathname]);

  const handleNavigate = (path) => {
    navigate(path);
    // onNavigate?.(); // close mobile drawer if provided
  };

  const onMenuClick = (menu, e) => {
    // Collapsed desktop: show floating sub-menu or navigate directly
    if (!open) {
      if (!menu.subMenu) {
        handleNavigate(`/${menu.path}`);
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      setFloatingMenuPos({ top: rect.top, left: rect.right + 8 });
      setFloatingMenuId((prev) => (prev === menu.id ? null : menu.id));
      return;
    }

    // Expanded (desktop or mobile drawer)
    if (menu.subMenu) {
      setExpandedMenuId((prev) => (prev === menu.id ? null : menu.id));
    } else {
      handleNavigate(`/${menu.path}`);
    }
  };

  const onMenuKeyDown = (menu, e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onMenuClick(menu, e);
    }
  };

  const permissions = flattenPermissions(userPermissions);

  const authorizedRoutes = adminRoutesConfig.map((item) => {
    const accessKey = !item?.subMenu && routePermissionKeyMap[item.name.toLowerCase()];
    if (item.subMenu) {
      const updateSUB = item.subMenu
        .map((subItem) => {
          const subAccessKey = routePermissionKeyMap[subItem.name.toLowerCase()];
          return {
            ...subItem,
            display: subAccessKey in permissions ? permissions[subAccessKey] : false,
          };
        })
        .filter((sub) => sub.display);
      return { ...item, subMenu: updateSUB, display: updateSUB.length > 0 };
    }
    return {
      ...item,
      display: accessKey in permissions ? permissions[accessKey] : false,
    };
  });

  return (
    <Nav $open={open} ref={sidebarRef} aria-label="Sidebar">
      <MenuList>
        {authorizedRoutes
          .filter((menu) => menu.display !== false)
          .map((menu) => {
            const isActiveDirect = checkDirectActive(menu);
            const isActiveParent = checkParentActive(menu);
            const isActiveMain = isActiveDirect || isActiveParent;
            const isExpanded = expandedMenuId === menu.id;

            return (
              <ItemWrapper key={menu.id}>
                <MenuItem
                  type="button"
                  $active={isActiveMain}
                  $open={open}
                  onClick={(e) => onMenuClick(menu, e)}
                  onKeyDown={(e) => onMenuKeyDown(menu, e)}
                  aria-expanded={open ? isExpanded : floatingMenuId === menu.id}
                  aria-haspopup={!!menu.subMenu}
                  title={!open ? menu.name : undefined}
                >
                  <ItemIcon>
                    {menu?.iconElement
                      ? menu.iconElement
                      : <i className={menu.iconClass} aria-hidden="true" />}
                  </ItemIcon>

                  {/* Always show label when open=true (expanded desktop OR mobile drawer) */}
                  {open && <ItemLabel $open={open}>{menu.name}</ItemLabel>}

                  {open && menu.subMenu && (
                    <ArrowIcon $expanded={isExpanded} />
                  )}
                </MenuItem>

                {/* Inline sub-menu */}
                {open && menu.subMenu && isExpanded && (
                  <SubMenu role="menu">
                    {menu.subMenu.map((sub) => (
                      <SubItem
                        key={sub.id}
                        $active={checkSubActive(menu, sub)}
                        onClick={() => handleNavigate(`/${menu.path}/${sub.path}`)}
                        role="menuitem"
                      >
                        {sub.name}
                      </SubItem>
                    ))}
                  </SubMenu>
                )}

                {/* Floating sub-menu (collapsed desktop only) */}
                {!open && floatingMenuId === menu.id && menu.subMenu && (
                  <FloatMenu
                    ref={floatingMenuRef}
                    $top={floatingMenuPos.top}
                    $left={floatingMenuPos.left}
                    role="menu"
                  >
                    <FloatMenuTitle>{menu.name}</FloatMenuTitle>
                    <Divider />
                    {menu.subMenu.map((sub) => (
                      <FloatItem
                        key={sub.id}
                        $active={checkSubActive(menu, sub)}
                        onClick={() => {
                          handleNavigate(`/${menu.path}/${sub.path}`);
                          setFloatingMenuId(null);
                        }}
                        role="menuitem"
                      >
                        {sub.name}
                      </FloatItem>
                    ))}
                  </FloatMenu>
                )}
              </ItemWrapper>
            );
          })}
      </MenuList>
    </Nav>
  );
};

export default Sidebar;