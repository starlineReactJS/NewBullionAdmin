import React, { memo } from "react";
import styled from "styled-components";
import { Td, Input, PrimaryButton, fluidType } from "../../styledComponents";

// Reuse Td but allow a "total" highlight variant
const Cell = styled(Td)`
  background: ${({ $isTotal, theme }) =>
        $isTotal
            ? `${theme.colors.primary}18`
            : "transparent"};
  border-left: ${({ $isTotal, theme }) =>
        $isTotal ? `2px solid ${theme.colors.primary}55` : "none"};
  padding: 6px 8px;
  vertical-align: middle;
`;

// Reuse shared Input, overriding width for bank-rate context
const BankInput = styled(Input)`
  width: 100%;
  min-width: 70px;
  text-align: center;
`;

// Reuse shared Select pattern
const BankSelect = styled.select`
  width: 100%;
  background:rgba(255, 255, 255, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.borderInput};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.font.family};
 ${fluidType("bodyLg")}
  font-weight: ${({ theme }) => theme.font.weightMedium};
  padding: 4px 6px;
  outline: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  margin-top: 2px;
 
  option {
    background: ${({ theme }) => theme.colors.bgSurface};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
 
`;

const InrValue = styled.p`
  ${fluidType("bodyLg")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin: 0 0 4px;
`;

const TotalValue = styled.h6`
  ${fluidType("body")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin: 0;
  width:80px;
`;

const SubmitBtn = styled(PrimaryButton)`
  width: 100%;
  padding: 6px 10px;
  font-size: ${({ theme }) => theme.font.sizeLg};
  margin: 4px 0;
`;

const CellInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const BankRateRow = memo(({
    sourceKey,
    rowDef,
    value,
    inrValue,
    baseTotal,
    finalTotal,
    onChange,
    onSubmit,
    disabled
}) => {
    const isTotal = rowDef?.name === "total";

    return (
        <Cell $isTotal={isTotal} $align="center">
            <CellInner>
                {rowDef.type === "input" && (
                    <BankInput
                        name={rowDef.name}
                        value={value ?? ""}
                        onChange={(e) => onChange(e, sourceKey)}
                    />
                )}

                {rowDef.type === "select" && (
                    <>
                        <InrValue>{inrValue}</InrValue>
                        <BankSelect
                            name={rowDef.name}
                            value={value ?? rowDef.options?.[0]?.value ?? ""}
                            onChange={(e) => onChange(e, sourceKey)}
                        >
                            {rowDef.options?.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </BankSelect>
                    </>
                )}

                {rowDef.type === "button" && (
                    <SubmitBtn
                        disabled={disabled}
                        onClick={() => onSubmit(sourceKey)}
                    >
                        Submit
                    </SubmitBtn>
                )}

                {rowDef.type === "div" && rowDef.name === "total" && (
                    <TotalValue>{Number(baseTotal || 0).toFixed(2)}</TotalValue>
                )}

                {rowDef.type === "div" && rowDef.name === "" && (
                    <TotalValue>{Number(finalTotal || 0).toFixed(2) || 0}</TotalValue>
                )}
            </CellInner>
        </Cell>
    );
});

export default BankRateRow;