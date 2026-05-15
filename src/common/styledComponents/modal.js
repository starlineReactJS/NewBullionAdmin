// ─────────────────────────────────────────────────────────────────────────────
// components/ui/FormLayout.jsx
// Shared layout primitives for Symbol + Coin popup modal forms
// ─────────────────────────────────────────────────────────────────────────────
import styled from "styled-components";
import { fluidType } from "./index";

// Two-column grid that stacks on mobile
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) {
    grid-template-columns: ${({ $cols }) => $cols || "1fr 1fr"};
  }
`;

// Single column (create form)
export const FormCol = styled.div`
  display: flex;
  flex-direction: column;
  border-right: ${({ $bordered, theme }) =>
        $bordered ? `1px solid ${theme.colors.divider}` : "none"};

  @media (max-width: 767px) {
    border-right: none;
    border-bottom: ${({ $bordered, theme }) =>
        $bordered ? `1px solid ${theme.colors.divider}` : "none"};
    padding-bottom: ${({ $bordered, theme }) =>
        $bordered ? theme.spacing.md : "0"};
  }
`;

// The table that holds label : field rows
export const FormTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.font.family};
`;

export const FormTableBody = styled.tbody``;

// Label cell (left)
export const FormLabelCell = styled.td`
  padding: 0 12px 10px 0;
  white-space: nowrap;
  vertical-align: middle;
  width: 1%;
`;

export const FormLabel = styled.label`
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: inline-flex;
  align-items: center;
  margin: 0;
  white-space: nowrap;

  &::after {
    content: " :";
    color: ${({ theme }) => theme.colors.textMuted};
    margin-left: 4px;
  }
`;

// Input cell (right)
export const FormInputCell = styled.td`
  padding: 0 0 10px 0;
  width: 100%;
`;

// Shared base styles for all field inputs / selects
const fieldBase = ({ theme, $hasError }) => `
  width: 100%;
  background: ${theme.colors.bgInput};
  border: 1px solid ${$hasError ? theme.colors.error : theme.colors.borderInput};
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.textPrimary};
  font-family: ${theme.font.family};
  font-size: ${theme.font.sizeSm};
  font-weight: ${theme.font.weightMedium};
  padding: 6px 9px;
  outline: none;
  transition: ${theme.transition};

  &:focus {
    background: ${theme.colors.bgInputFocus};
    border-color: ${$hasError ? theme.colors.error : theme.colors.borderInputFocus};
    box-shadow: ${theme.colors.shadowInput};
  }

  &::placeholder { color: ${theme.colors.textMuted}; }
`;

export const FieldInput = styled.input`
  ${({ theme, $hasError }) => fieldBase({ theme, $hasError })}
`;

export const FieldTextArea = styled.textarea`
  ${({ theme, $hasError }) => fieldBase({ theme, $hasError })}
  resize: vertical;
  min-height: 80px;
`;

export const FieldSelect = styled.select`
  ${({ theme }) => fieldBase({ theme })}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239AA3BE' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 28px;

  option {
    background: ${({ theme }) => theme.colors.bgSurface};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const FieldCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

export const FieldFileInput = styled.input.attrs({ type: "file" })`
  width: 100%;
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;

  &::file-selector-button {
    background: ${({ theme }) => theme.colors.primary};
    color:#FFFFFF;
    border: 1px solid #FFF;
    border-radius: ${({ theme }) => theme.radius.sm};
    padding: 4px 10px;
    font-family: ${({ theme }) => theme.font.family};
    font-size: ${({ theme }) => theme.font.sizeSm};
    font-weight: ${({ theme }) => theme.font.weightSemiBold};
    cursor: pointer;
    margin-right: 8px;
    transition: ${({ theme }) => theme.transition};
    &:hover { background: ${({ theme }) => theme.colors.primary}; color: #fff; }
  }
`;

// Radio group wrapper
export const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  cursor: pointer;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $checked, theme }) =>
        $checked ? theme.colors.primary : "transparent"};
  color: ${({ $checked, theme }) =>
        $checked ? theme.colors.primary : theme.colors.textSecondary};
  border-color: ${({ $checked, theme }) =>
        $checked ? `${theme.colors.primary}55` : theme.colors.border};
  transition: ${({ theme }) => theme.transition};

  input[type="radio"] { display: none; }

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: #FFFFFF;
  }
`;

// Submit / action footer
export const FormFooter = styled.div`
  display: flex;
  justify-content: center;
  padding-top: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  grid-column: 1 / -1;
`;