// ─────────────────────────────────────────────────────────────────────────────
// components/ui/index.js
// Shared design-system primitives — import from here in every page component
// ─────────────────────────────────────────────────────────────────────────────
import styled, { css, keyframes } from "styled-components";
import { mq } from "../../theme";

// ═════════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY HELPERS
// ─────────────────────────────────────────────────────────────────────────────
// Usage: font-size: ${fluidType('body')};
export const fluidType = (key) => css`
  font-size: ${({ theme }) => theme.typography[key]?.base || "13px"};
  ${({ theme }) => mq("md")} {
    font-size: ${({ theme }) => theme.typography[key]?.md || "13px"};
  }
  ${({ theme }) => mq("lg")} {
    font-size: ${({ theme }) => theme.typography[key]?.lg || "14px"};
  }
`;

// ═════════════════════════════════════════════════════════════════════════════
// LAYOUT
// ─────────────────────────────────────────────────────────────────────────────

/** Full-width scrollable page wrapper */
export const PageWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  font-family: ${({ theme }) => theme.font.family};
  margin-bottom:20px;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
`;

/** Responsive two-column grid used in Symbol page */
export const TwoColGrid = styled.div`
  display: block;

   @media (max-width: 1024px) {
    height:100%
   }
   @media (min-width: 1025px) {
    display: grid;
    grid-template-columns: 100%;
    gap: ${({ theme }) => theme.spacing.lg};
  }

  ${mq("xl")} {
    grid-template-columns: 800px 1fr;
  }

  /* 1536px+ */
  ${mq("xxl")} {
    grid-template-columns: 800px 2fr;
  }
      ${mq("xxxl")} {
    // grid-template-columns: 2fr 1fr;
    grid-template-columns: 65% 1fr;
  }
`;
// ═════════════════════════════════════════════════════════════════════════════
// CARD / SURFACE
// ─────────────────────────────────────────────────────────────────────────────

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadowCard};
  transition: ${({ theme }) => theme.transition};
  overflow: auto;
  ${({ $hover }) =>
    $hover &&
    css`
      &:hover {
        box-shadow: ${({ theme }) => theme.colors.shadowCardHover};
        transform: translateY(-1px);
      }
    `}
    &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transpernet; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.borderStrong};
  }
`;

export const CardScrollBody = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0; 

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 6px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};

  @media (max-width: 576px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const CardBody = styled.div`
  padding: ${({ $p, theme }) => $p || theme.spacing.lg};
  
  @media (max-width: 576px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

// ═════════════════════════════════════════════════════════════════════════════
// PAGE HEADER
// ─────────────────────────────────────────────────────────────────────────────

export const PageTitle = styled.h2`
  ${fluidType("h3")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  letter-spacing: -0.3px;
`;

export const SectionLabel = styled.p`
  ${fluidType("label")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0;
`;

// ═════════════════════════════════════════════════════════════════════════════
// BUTTONS
// ─────────────────────────────────────────────────────────────────────────────

const btnBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  border-radius: 6px;
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  ${fluidType("label")}
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  white-space: nowrap;
  padding: 5px 16px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 480px) {
    padding: 7px 12px;
  }
`;

/** Primary gradient button */
export const PrimaryButton = styled.button`
  ${btnBase}
 background: ${({ theme }) => theme.colors.primaryLight};
  color: #fff;
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.primary}44;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px ${({ theme }) => theme.colors.primary}66;
  }
  &:active:not(:disabled) { transform: translateY(0); }
`;

/** Secondary / ghost button */
export const SecondaryButton = styled.button`
  ${btnBase}
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.bgFloatMenu};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    transform: translateY(-1px);
  }
  &:active:not(:disabled) { transform: translateY(0); }
`;

/** Danger button */
export const DangerButton = styled.button`
  ${btnBase}
  background: ${({ theme }) => theme.colors.errorLight};
  color: ${({ theme }) => theme.colors.error};
  border: 1px solid ${({ theme }) => theme.colors.error}33;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.error};
    color: #fff;
    transform: translateY(-1px);
  }
`;

/** Small icon-only action button (edit / delete in tables) */
export const IconButton = styled.button`
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ $color, theme }) => $color || theme.colors.textSecondary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  font-size: 14px;

  &:hover:not(:disabled) {
    background: ${({ $hoverBg, theme }) => $hoverBg || theme.colors.bgSidebarHover};
    color: ${({ $hoverColor, theme }) => $hoverColor || theme.colors.primary};
    border-color: ${({ $hoverColor, theme }) => $hoverColor || theme.colors.primary}55;
    transform: scale(1.08);
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

/** Step button: the +/− controls on premium inputs */
export const StepButton = styled.button`
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.borderInput};
  background: ${({ theme }) => theme.colors.bgStepBtn};
  color: ${({ theme }) => theme.colors.textStepBtn};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.weightBold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  line-height: 1;
  user-select: none;

  &:hover {
    background: ${({ theme }) => theme.colors.bgStepBtnHover};
    color: ${({ theme }) => theme.colors.textStepBtnHover};
    border-color: ${({ theme }) => theme.colors.bgStepBtnHover};
    transform: scale(1.1);
  }
  &:active { transform: scale(0.95); }
`;

// ═════════════════════════════════════════════════════════════════════════════
// FORM INPUTS
// ─────────────────────────────────────────────────────────────────────────────

export const Input = styled.input`
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1px solid ${({ theme }) => theme.colors.borderInput};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  padding: 4px 6px;
  text-align: center;
  transition: ${({ theme }) => theme.transition};
  outline: none;
  min-width: ${({ $width }) => $width || "64px"};
  width:100%;

  &:focus {
    background: ${({ theme }) => theme.colors.bgInputFocus};
    border-color: ${({ theme }) => theme.colors.borderInputFocus};
    box-shadow: ${({ theme }) => theme.colors.shadowInput};
  };
        ${fluidType("h4")}
`;

export const StepInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
`;

// ═════════════════════════════════════════════════════════════════════════════
// TABLE
// ─────────────────────────────────────────────────────────────────────────────

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.shadowTable};
  &::-webkit-scrollbar { height: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.font.family};
`;

export const Thead = styled.thead``;

export const Th = styled.th`
  color: ${({ theme }) => theme.colors.textTableHeader};
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  letter-spacing: 0.4px;
  text-transform: uppercase;
  padding: 11px 12px;
  text-align: center;
  white-space: nowrap;
  border: none;

  &:first-child { padding-left: 16px; }
  &:last-child  { padding-right: 16px; }
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  background: ${({ $alt, theme }) =>
    $alt ? theme.colors.bgTableRowAlt : theme.colors.bgTableRow};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  transition: background 0.15s ease;
&:hover {
  background: ${({ $alt, theme }) =>
    !$alt && theme.colors.bgTableRowHover};
}
  &:last-child { border-bottom: none; }
`;

export const Td = styled.td`
  padding: 10px 12px;
  text-align: ${({ $align }) => $align || "center"};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.font.sizeSm};
  vertical-align: middle;
  white-space: nowrap;
  min-width: ${({ $w }) => $w || 100};
    border: 1px solid ${({ theme }) => theme.colors.border};  /* ← add this 
  &:first-child { padding-left: 16px; }
  &:last-child  { padding-right: 16px; }
`;

// ═════════════════════════════════════════════════════════════════════════════
// BADGE / TAG
// ─────────────────────────────────────────────────────────────────────────────

const badgeVariants = {
  primary: (theme) => ({ bg: theme.colors.primaryLight, text: theme.colors.primary, border: `${theme.colors.primary}33` }),
  success: (theme) => ({ bg: theme.colors.successLight, text: theme.colors.success, border: `${theme.colors.success}33` }),
  warning: (theme) => ({ bg: theme.colors.warningLight, text: theme.colors.warning, border: `${theme.colors.warning}33` }),
  error: (theme) => ({ bg: theme.colors.errorLight, text: theme.colors.error, border: `${theme.colors.error}33` }),
  info: (theme) => ({ bg: theme.colors.infoLight, text: theme.colors.info, border: `${theme.colors.info}33` }),
};

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeXs};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  letter-spacing: 0.3px;
  border: 1px solid;

  ${({ $variant = "primary", theme }) => {
    const v = badgeVariants[$variant]?.(theme) || badgeVariants.primary(theme);
    return css`
      background: ${v.bg};
      color: ${v.text};
      border-color: ${v.border};
    `;
  }}
`;

// ═════════════════════════════════════════════════════════════════════════════
// DIVIDER
// ─────────────────────────────────────────────────────────────────────────────

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  margin: ${({ $my, theme }) => $my || `${theme.spacing.md} 0`};
`;

// ═════════════════════════════════════════════════════════════════════════════
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────

export const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeMd};
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 36px;
  opacity: 0.4;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

// ═════════════════════════════════════════════════════════════════════════════
// ACTION BAR (toolbar above tables)
// ─────────────────────────────────────────────────────────────────────────────

export const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  @media (max-width: 576px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

// ═════════════════════════════════════════════════════════════════════════════
// CHECKBOX (themed)
// ─────────────────────────────────────────────────────────────────────────────

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.xs};
`;

// ═════════════════════════════════════════════════════════════════════════════
// TEXT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const Text = styled.span`
  font-family: ${({ theme }) => theme.font.family};
  color: ${({ $color, theme }) => $color || theme.colors.textPrimary};
  font-size: ${({ $size, theme }) => $size || theme.font.sizeMd};
  font-weight: ${({ $weight, theme }) => $weight || theme.font.weightNormal};
`;

export const NameText = styled.p`
  ${fluidType("body")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  white-space: nowrap;
`;


export const FormTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.font.family};
`;

export const FormTableBody = styled.tbody`
overflow:auto;
height:100%;
`;


export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const DateText = styled.p`
  font-family: ${({ theme }) => theme.font.family};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  white-space: nowrap;
  ${fluidType("h4")}

`;

export const CellText = styled.p`
  font-family: ${({ theme }) => theme.font.family};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  max-width: 260px;
  white-space: normal;
  word-break: break-word;
  ${fluidType("label")};
  text-align: center;

`;