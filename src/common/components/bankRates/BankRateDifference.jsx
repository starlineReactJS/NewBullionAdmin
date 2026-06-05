import React, { memo } from "react";
import { EXCHANGE_OPTIONS, getMetalType } from "../../../constants/bankRate";

import styled from "styled-components";
import { fluidType } from "../../styledComponents";


const DiffSection = styled.div`
  margin-top: 0;
`;

const DiffTitle = styled.h6`
  background: ${({ theme }) => theme.colors.bgTableHeader};
  color: ${({ theme }) => theme.colors.textTableHeader};
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  text-align: center;
  padding: 5px ${({ theme }) => theme.spacing.md};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  // border-radius: ${({ theme }) => theme.radius.md}
  //   ${({ theme }) => theme.radius.md} 0 0;
  letter-spacing: 0.4px;
  text-transform: uppercase;
`;

const DiffGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $count, $gridType}) => Math.min($count, $gridType === 'costing' ? 6 : 3)}, 1fr);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0 0 ${({ theme }) => theme.radius.md}
    ${({ theme }) => theme.radius.md};
  overflow: auto;
`;

const DiffCard = styled.div`
  background: ${({ theme }) => theme.colors.bgSurface};
  border-right: 1px solid ${({ theme }) => theme.colors.divider};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  gap: 6px;
  transition: ${({ theme }) => theme.transition};
 
  &:last-child { border-right: none; }
 
  &:hover { background: ${({ theme }) => theme.colors.bgSurfaceAlt}; }
`;

const DiffName = styled.p`
  ${fluidType("label")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

// Reuse shared select pattern
const DiffSelect = styled.select`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1px solid ${({ theme }) => theme.colors.borderInput};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.font.family};
  ${fluidType("caption")}
  font-weight: ${({ theme }) => theme.font.weightMedium};
  padding: 3px 6px;
  outline: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
 
  option {
    background: ${({ theme }) => theme.colors.bgSurface};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
 
  &:focus {
    border-color: ${({ theme }) => theme.colors.borderInputFocus};
    box-shadow: ${({ theme }) => theme.colors.shadowInput};
  }
`;

const RatesRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  justify-content: center;
`;

const RateBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
`;

const RateLabel = styled.h6`
  ${fluidType("caption")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

const RateValue = styled.h6`
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ $type, theme }) => theme.colors.success};
  margin: 0;
`;

const DiffValue = styled.p`
  width: 100%;
  text-align: center;
  ${fluidType("body")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  padding: 4px ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  margin: 0;
 
  color: ${({ $diff, theme }) =>
        $diff > 0
            ? theme.colors.success
            : $diff < 0
                ? theme.colors.error
                : theme.colors.textSecondary};
 
  background: ${({ $diff, theme }) =>
        $diff > 0
            ? theme.colors.successLight
            : $diff < 0
                ? theme.colors.errorLight
                : theme.colors.bgSurfaceAlt};
`;

const BankRateDifference = memo(({
    data,
    onChange,
    gridType
}) => {
    return (
        <>
            <DiffSection>
                <DiffTitle>Difference</DiffTitle>

                <DiffGrid $count={data.length} $gridType={gridType}>
                    {data.map((d, index) => {
                        const metal = getMetalType(d.exchange);
                        const exchangeOptions = EXCHANGE_OPTIONS[metal];
                        const mcx = d.mcxRate || 0;
                        const bank = d.bankRate || 0;
                        const diff = bank - mcx;

                        return (
                            <DiffCard key={index}>
                                <DiffName>{d.name}</DiffName>

                                <DiffSelect
                                    name="exchange"
                                    value={d.exchange}
                                    onChange={(e) => onChange(e, d.key)}
                                >
                                    {exchangeOptions.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </DiffSelect>

                                <RatesRow>
                                    <RateBlock>
                                        <RateLabel>MCX</RateLabel>
                                        <RateValue $type="mcx">{mcx}</RateValue>
                                    </RateBlock>

                                    <RateBlock>
                                        <RateLabel>Bank</RateLabel>
                                        <RateValue $type="bank">{bank}</RateValue>
                                    </RateBlock>
                                </RatesRow>

                                <DiffValue $diff={diff}>
                                    {diff > 0 ? <i className="fa fa-caret-up" aria-hidden="true" ></i> : diff < 0 ? <i className="fa fa-caret-down" aria-hidden="true"></i> : "—"}&nbsp;
                                    {diff.toFixed(2)}
                                </DiffValue>
                            </DiffCard>
                        );
                    })}
                </DiffGrid>
            </DiffSection>
        </>
    );
});

export default BankRateDifference;