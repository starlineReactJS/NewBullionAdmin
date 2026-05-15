import React, { memo, useMemo } from "react";
import BankRateDifference from "../../common/components/bankRates/BankRateDifference";
import BankRateSpotHeader from "../../common/components/bankRates/BankRateSpotHeader";
import { bankRateRows, getMetalType, SPOT_OPTIONS } from "../../constants/bankRate";
import styled from "styled-components";
import {
    Card,
    CardHeader,
    PageTitle,
    TableWrapper,
    StyledTable,
    Tbody,
    Tr,
    Td,
    fluidType,
} from "../../common/styledComponents";
import BankRateRow from "../../common/components/bankRates/BankRateRow ";

// ─────────────────────────────────────────────────────────────────────────────
// Local styles — identical pattern to BankRateUI, reusing same primitives
// ─────────────────────────────────────────────────────────────────────────────

const CostingCard = styled(Card)`
  height: auto;
  display: flex;
  flex-direction: column;
`;

const CostingCardHeader = styled(CardHeader)`
  background: ${({ theme }) => theme.colors.bgTableHeader};
  border-bottom: none;
  border-radius: ${({ theme }) => theme.radius.lg}
    ${({ theme }) => theme.radius.lg} 0 0;
`;

const CostingTitle = styled(PageTitle)`
  color: ${({ theme }) => theme.colors.textTableHeader};
  ${fluidType("h4")}
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const CostingTableWrapper = styled(TableWrapper)`
  border-radius: 0;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  box-shadow: none;
  overflow: visible;

  @media (max-width: 480px) {
    overflow-x: auto;
  }
`;

const LabelTd = styled(Td)`
  width: 110px;
  min-width: 90px;
  text-align: left;
  padding-left: 14px;
  font-family: ${({ theme }) => theme.font.family};
  ${fluidType("bodySm")}
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  border-right: 1px solid ${({ theme }) => theme.colors.divider};
`;

// Spot header th — same look as BankRateSpotHeader but driven by chunk items
const SpotTh = styled.th`
  color: ${({ theme }) => theme.colors.textTableHeader};
  padding: 10px 8px;
  text-align: center;
  vertical-align: middle;
`;

const ProductName = styled.strong`
  display: block;
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.colors.textTableHeader};
  text-align: center;
  margin-bottom: 6px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

const SpotSelect = styled.select`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textTableHeader};
  font-family: ${({ theme }) => theme.font.family};
  ${fluidType("caption")}
  font-weight: ${({ theme }) => theme.font.weightMedium};
  padding: 4px 6px;
  cursor: pointer;
  outline: none;
  margin-bottom: 4px;
  transition: ${({ theme }) => theme.transition};

  option {
    background: ${({ theme }) => theme.colors.bgSurface};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:focus {
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.18);
  }
`;

const SpotValue = styled.p`
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: #FFFFFF;
  text-align: center;
  margin: 0;
  letter-spacing: 0.5px;
`;

const DiffWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const CostingTable = memo(({ chunk, computedRows, onChange, onSubmit, disabledButton }) => {

    const differenceData = useMemo(() => {
        return chunk.map(item => ({
            key: item.id,
            name: item.source,
            exchange: item.exchange,
            mcxRate: computedRows[item.id]?.mcxRate || 0,
            bankRate: computedRows[item.id]?.finalTotal || 0,
        }));
    }, [chunk, computedRows]);

    return (
        <CostingCard>
            <CostingCardHeader>
                <CostingTitle>Costing Rates</CostingTitle>
            </CostingCardHeader>

            <CostingTableWrapper>
                <StyledTable>
                    <Tbody>

                        {/* ── Spot header row ── */}
                        <Tr $alt={true}>
                            <SpotTh style={{ width: 110 }} />

                            {chunk.map(item => {
                                const metal = getMetalType(item.spot);
                                const spotOptions = SPOT_OPTIONS[metal];

                                return (
                                    <SpotTh key={item.id}>
                                        <ProductName>{item.source}</ProductName>

                                        <SpotSelect
                                            name="spot"
                                            value={item.spot}
                                            onChange={(e) => onChange(e, item.id)}
                                        >
                                            {spotOptions.map(o => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </SpotSelect>

                                        <SpotValue>{computedRows[item.id]?.spotAsk}</SpotValue>
                                    </SpotTh>
                                );
                            })}
                        </Tr>

                        {/* ── Data rows ── */}
                        {bankRateRows.map((row, index) => (
                            <Tr key={`${row.id}-${index}`}>
                                <LabelTd $align="left">
                                    <strong>{row.label}</strong>
                                </LabelTd>

                                {chunk.map(item => (
                                    <BankRateRow
                                        key={item.id}
                                        sourceKey={item.id}
                                        rowDef={row}
                                        value={item[row.name]}
                                        inrValue={computedRows[item.id]?.inrRate}
                                        baseTotal={computedRows[item.id]?.baseTotal}
                                        finalTotal={computedRows[item.id]?.finalTotal}
                                        onChange={onChange}
                                        onSubmit={() => onSubmit(item?.id)}
                                        disabled={disabledButton === item.id}
                                    />
                                ))}
                            </Tr>
                        ))}

                    </Tbody>
                </StyledTable>
            </CostingTableWrapper>

            {/* ── Difference section ── */}
            <DiffWrapper>
                <BankRateDifference
                    data={differenceData}
                    onChange={onChange}
                />
            </DiffWrapper>
        </CostingCard>
    );
});

export default CostingTable;