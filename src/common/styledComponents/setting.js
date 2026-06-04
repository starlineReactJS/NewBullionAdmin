import styled from "styled-components";
import {
    Card,
    Input,
    fluidType,
} from "./index";


export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
 
  @media (max-width: 992px) { grid-template-columns: 1fr; }
`;

export const Panel = styled(Card)`
  display: flex;
  flex-direction: column;
`;

export const PanelTitle = styled.h5`
  ${fluidType("h4")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.colors.textTableHeader};
  background: ${({ theme }) => theme.colors.bgTableHeader};
  text-align: center;
  padding: 8px ${({ theme }) => theme.spacing.md};
  margin: 0;
  border-radius: ${({ theme }) => `${theme.radius.lg} ${theme.radius.lg} 0 0`};
`;

export const PanelBody = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
`;

export const PanelFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
`;

// Reference table
export const RefTable = styled.table`
  width: 100%;
  font-family: ${({ theme }) => theme.font.family};
  border-collapse: collapse;
`;

export const RefTr = styled.tr`
  height: 40px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  &:last-child { border-bottom: none; }
`;

export const RefTd = styled.td`
  padding: 4px 6px;
  ${fluidType("label")}
  color: ${({ theme }) => theme.colors.textPrimary};
  vertical-align: middle;
`;

export const RefInput = styled(Input)`
  width: 100%;
  text-align: left;
  ${fluidType("label")}

`;

export const EmptyRow = styled.tr`
  td {
    text-align: center;
    padding: ${({ theme }) => theme.spacing.md};
    ${fluidType("bodySm")}
    color: ${({ theme }) => theme.colors.textMuted};
    font-family: ${({ theme }) => theme.font.family};
  }
`;

// Password fields
export const PwdTable = styled.table`
  width: 100%;
  font-family: ${({ theme }) => theme.font.family};
  border-collapse: collapse;
`;

export const PwdLabelTd = styled.td`
  width: 50%;
  padding: 8px 8px 8px 4px;
  vertical-align: middle;
`;

export const PwdFieldTd = styled.td`
  width: 50%;
  padding: 8px 4px;
  vertical-align: middle;
`;

export const PwdLabel = styled.label`
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
 
  span { color: ${({ theme }) => theme.colors.error}; margin-left: 2px; }
  &::after { content: " :"; color: ${({ theme }) => theme.colors.textMuted}; }
`;

export const PwdInput = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1px solid ${({ theme }) => theme.colors.borderInput};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.font.family};
  ${fluidType("bodySm")}
  padding: 6px 9px;
  outline: none;
  transition: ${({ theme }) => theme.transition};
 
  &:focus {
    border-color: ${({ theme }) => theme.colors.borderInputFocus};
    box-shadow: ${({ theme }) => theme.colors.shadowInput};
    background: ${({ theme }) => theme.colors.bgInputFocus};
  }
`;

// Rate difference
export const RateTable = styled.table`
  width: 100%;
  font-family: ${({ theme }) => theme.font.family};
  border-collapse: collapse;
`;

export const RateTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  &:last-child { border-bottom: none; }
`;

export const RateLabelTd = styled.td`
  width: 50%;
  padding: 8px;
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textSecondary};
  vertical-align: middle;
  display: flex;
  align-items: center;
  justify-content: space-between;
 
  &::after { content: " :"; color: ${({ theme }) => theme.colors.textMuted}; }
`;

export const RateInputTd = styled.td`
  padding: 6px 4px;
  vertical-align: middle;
`;

export const DisabledInput = styled(Input)`
  opacity: 0.5;
  cursor: not-allowed;
  text-align: center;
  width: 80px;
`;

export const RateInput = styled(Input)`
  width: 80px;
  text-align: center;
`;
