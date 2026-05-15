import React from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";

// ─────────────────────────────────────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  z-index: 200;
  width: 100%;
  height: ${({ theme }) => theme.headerHeight};
  background: ${({ theme }) => theme.colors.bgHeader};
  box-shadow: ${({ theme }) => theme.colors.shadowHeader};
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.3s ease;
`;

const Inner = styled.div`
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    padding: 0 ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

/* ── Left: Menu toggle + user ── */
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
  min-width: 0;
`;

const MenuButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: ${({ theme }) => theme.radius.sm};
  color: rgba(255, 255, 255, 0.9);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.04);
  }
  &:active { transform: scale(0.97); }
`;

const AvatarCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.avatarBg};
  color: ${({ theme }) => theme.colors.avatarText};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeMd};
  font-weight: ${({ theme }) => theme.font.weightBold};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid rgba(255,255,255,0.2);
`;

const WelcomeText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.2;

  @media (max-width: 480px) { display: none; }
`;

const WelcomeLabel = styled.span`
  font-size: ${({ theme }) => theme.font.sizeXs};
  color:#FFFFFF;
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightNormal};
  letter-spacing: 0.4px;
  text-transform: uppercase;
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.font.sizeMd};
  color: rgba(255, 255, 255, 0.95);
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
`;

/* ── Center: Active users badge ── */
const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: 600px) { display: none; }
`;

const ActiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.badgeBg};
  border: 1px solid ${({ theme }) => theme.colors.badgeBorder};
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 5px 14px;
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
  color: rgba(255, 255, 255, 0.7);
  font-weight: ${({ theme }) => theme.font.weightMedium};
  letter-spacing: 0.3px;
  transition: ${({ theme }) => theme.transition};

  &:hover { background: rgba(255,255,255,0.1); }
`;

const PulseDot = styled.span`
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.colors.success};
  border-radius: 50%;
  display: inline-block;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.success};
    opacity: 0.3;
    animation: pulse 1.8s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50%       { transform: scale(1.8); opacity: 0; }
  }
`;

const ActiveCount = styled.strong`
  color: rgba(255, 255, 255, 0.95);
  font-weight: ${({ theme }) => theme.font.weightBold};
  font-size: ${({ theme }) => theme.font.sizeSm};
`;

/* ── Right: Toggle + Logout ── */
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
`;

/* ─── Theme Toggle ─── */
const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ToggleTrack = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;

  &:checked + span {
    background: rgba(83, 109, 254, 0.5);
    border-color: rgba(83, 109, 254, 0.6);
  }
  &:checked + span::before {
    transform: translateX(22px);
    background: #fff;
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.radius.full};
  transition: ${({ theme }) => theme.transition};

  &::before {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    left: 3px;
    top: 3px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    transition: ${({ theme }) => theme.transition};
    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
  }
`;

const ToggleIcon = styled.span`
  font-size: 14px;
  line-height: 1;
  user-select: none;
  filter: drop-shadow(0 0 4px rgba(255,255,255,0.3));
`;

/* ─── Logout Button ─── */
const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.logoutBg};
  border: 1px solid ${({ theme }) => theme.colors.logoutBorder};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.logoutText};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  padding: 6px 14px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  letter-spacing: 0.3px;
  white-space: nowrap;

  &:hover {
    background: rgba(244, 67, 54, 0.18);
    border-color: rgba(244, 67, 54, 0.5);
    color: #ff8a80;
    transform: translateY(-1px);
  }
  &:active { transform: translateY(0); }

  svg { flex-shrink: 0; }

  @media (max-width: 480px) {
    padding: 6px 10px;
    span.logout-label { display: none; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const Header = ({ toggleDrawer, theme, themeFn }) => {
    const { logout, auth: { name } } = useAuth();
    const navigate = useNavigate();
    const localStore = useSelector((store) => store);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isDark = theme === "dark";

    return (
        <HeaderRoot>
            <Inner>
                {/* ── Left ── */}
                <LeftSection>
                    <MenuButton onClick={toggleDrawer} aria-label="Toggle sidebar">
                        <FiMenu size={18} />
                    </MenuButton>

                    <AvatarCircle>{name.charAt(0).toUpperCase()}</AvatarCircle>

                    <WelcomeText>
                        <WelcomeLabel>Welcome</WelcomeLabel>
                        <UserName>{name}</UserName>
                    </WelcomeText>
                </LeftSection>

                {/* ── Center ── */}
                <CenterSection>
                    <ActiveBadge>
                        <PulseDot />
                        Active Users&nbsp;
                        <ActiveCount>{localStore.socket.activeUser}</ActiveCount>
                    </ActiveBadge>
                </CenterSection>

                {/* ── Right ── */}
                <RightSection>
                    <ToggleWrapper>
                        <ToggleTrack htmlFor="themeToggle" title={isDark ? "Switch to light" : "Switch to dark"}>
                            <ToggleInput
                                type="checkbox"
                                id="themeToggle"
                                checked={isDark}
                                onChange={() => themeFn(isDark ? "light" : "dark")}
                            />
                            <ToggleSlider />
                        </ToggleTrack>
                    </ToggleWrapper>

                    <LogoutButton onClick={handleLogout}>
                        <FiLogOut size={14} />
                        <span className="logout-label">Logout</span>
                    </LogoutButton>
                </RightSection>
            </Inner>
        </HeaderRoot>
    );
};

export default Header;