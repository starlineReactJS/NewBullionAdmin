import styled, { css, keyframes } from "styled-components";
import { mq } from "../../theme";
import { Card, CardHeader, fluidType, Input, PageTitle, PrimaryButton, TableWrapper, Td } from "./index";


export const PremiumGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  ${mq("md")} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mq("xl")} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const PremiumCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    box-shadow: ${({ theme }) => theme.colors.shadowCard};
    border-color: ${({ theme }) => theme.colors.primary}44;
  }
`;

export const PremiumName = styled.p`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeMd};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin: 0;
  letter-spacing: 0.2px;
`;

export const RateRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const RateBox = styled.div`
  background: ${({ $type, theme }) =>
        $type === "buy" ? theme.colors.bgCardBuy : theme.colors.bgCardSell};
  border: 1px solid
    ${({ $type, theme }) =>
        $type === "buy"
            ? `${theme.colors.textBuy}22`
            : `${theme.colors.textSell}22`};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const RateLabel = styled.span`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeXs};
  font-weight: ${({ theme }) => theme.font.weightBold};
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ $type, theme }) =>
        $type === "buy" ? theme.colors.textBuy : theme.colors.textSell};
`;

export const SubmitRow = styled.div`
  display: flex;
  justify-content: flex-start;
  padding-top: ${({ theme }) => theme.spacing.sm};
`;


export const NameCell = styled.p`
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  white-space: nowrap;
    ${fluidType("h4")}

`;

export const SourceText = styled.p`
  font-family: ${({ theme }) => theme.font.family};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
    ${fluidType("h4")}

`;

export const RateTypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 13px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeMd};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  letter-spacing: 0.4px;
  text-transform: capitalize;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.bgFloatMenu};
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
   &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
`;

export const SaveBtn = styled(PrimaryButton)`
  padding: 5px 12px;
  font-size: ${({ theme }) => theme.font.sizeMd};
  min-width: 58px;
`;

export const PremiumInput = styled(Input)`
  width: 100%;
  text-align: center;
`;

export const BankCard = styled(Card)`
  display: flex;
  flex-direction: column;
 @media (max-width: 1024px) {
 margin-top:10px
  }
  
`;

export const BankCardHeader = styled(CardHeader)`
  background: ${({ theme }) => theme.colors.bgTableHeader};
  border-bottom: none;
  border-radius: ${({ theme }) => theme.radius.lg}
    ${({ theme }) => theme.radius.lg} 0 0;
`;

export const BankTitle = styled(PageTitle)`
  color: ${({ theme }) => theme.colors.textTableHeader};
  ${fluidType("h4")}
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const BankTableWrapper = styled(TableWrapper)`
  /* No outer rounded corners — sits inside Card */
  border-radius: 0;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  box-shadow: none;
  flex: 1;
`;

// Row label cell (left column)
export const LabelTd = styled(Td)`
  width: 110px;
  min-width: 90px;
  text-align: left;
  padding-left: 14px;
  font-family: ${({ theme }) => theme.font.family};
  ${fluidType("bodySm")}
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border-right: 1px solid ${({ theme }) => theme.colors.divider};
`;

export const DiffWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;
