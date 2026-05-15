import React, { memo } from "react";
import { getMetalType, SPOT_OPTIONS } from "../../../constants/bankRate";
import styled from "styled-components";
import { Th, Tr, fluidType } from "../../styledComponents";


const HeaderTh = styled(Th)`
  padding: 10px 8px;
  vertical-align: middle;
`;

const EmptyHeaderTh = styled(HeaderTh)`
  width: 110px;
  min-width: 90px;
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
  color:#FFFFFF;
  text-align: center;
  margin: 0;
  letter-spacing: 0.5px;
`;

const BankRateSpotHeader = memo(({
    bankRateSource,
    bankObj,
    spotAskMap,
    onChange
}) => {
    return (
        <Tr  $alt={true} >
            <EmptyHeaderTh as="th" />
            {bankRateSource.map((m) => {
                const metal = getMetalType(m.value);
                const spotOptions = SPOT_OPTIONS[metal];

                return (
                    <HeaderTh as="th" key={m.value}>
                        <ProductName>{m.name}</ProductName>

                        <SpotSelect
                            name="spot"
                            value={bankObj[m.value]?.spot}
                            onChange={(e) => onChange(e, m.value)}
                        >
                            {spotOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </SpotSelect>

                        <SpotValue>{spotAskMap[m.value]}</SpotValue>
                    </HeaderTh>
                );
            })}
        </Tr>
    );
});

export default BankRateSpotHeader;