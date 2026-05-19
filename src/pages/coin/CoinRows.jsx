import React, { memo } from "react";
import styled from "styled-components";
import {
    Td,
    Input,
    Checkbox,
    IconButton,
    PrimaryButton,
    fluidType,
    Tr,
} from "../../common/styledComponents";
import { NameCell, RateTypeBadge, SaveBtn, SourceText,PremiumInput } from "../../common/styledComponents/symbol";

const CoinRows = memo(({
    symbol,
    handleSymbolUpdate,
    handleSaveCoin,
    handleDeleteCoin,
    openModal,
    commonPremiumSource,
    rowSaveId,
}) => {
    const isSaving = rowSaveId === symbol.id;

    return (
        <>
            {/* View */}
            <Td>
                <Checkbox
                    name="isView"
                    checked={symbol.isView}
                    onChange={(e) =>
                        handleSymbolUpdate(symbol.id, "isView", e.target.checked)
                    }
                />
            </Td>

            {/* Name */}
            <Td $align="center" $w="200px">
                <NameCell $w={true}>{symbol.name}</NameCell>
            </Td>

            {/* Source */}
            <Td>
                <NameCell>{symbol.source}</NameCell>
            </Td>

            {/* Rate Type */}
            <Td>
                <NameCell>{symbol.rateType}</NameCell>
            </Td>

            {/* Dynamic premium columns — one per source */}
            {commonPremiumSource?.map((_, index) => (
                <Td key={index}>
                    <PremiumInput
                        type="text"
                        value={symbol.premium?.[index] ?? "0"}
                        onChange={(e) =>
                            handleSymbolUpdate(symbol.id, "premium", {
                                value: e.target.value,
                                index,
                            })
                        }
                    />
                </Td>
            ))}

            {/* Save */}
            <Td>
                <SaveBtn
                    disabled={isSaving}
                    onClick={() => handleSaveCoin(symbol.id)}
                >
                    {isSaving ? "Saving…" : "Save"}
                </SaveBtn>
            </Td>

            {/* Edit */}
            <Td>
                <IconButton
                    $color="#2979FF"
                    $hoverColor="#2979FF"
                    $hoverBg="rgba(41,121,255,0.1)"
                    onClick={() => openModal(true, symbol.id)}
                    title="Edit coin"
                >
                    <i className="fa fa-pencil-square-o" aria-hidden="true" />
                </IconButton>
            </Td>

            {/* Delete */}
            <Td>
                <IconButton
                    $color="#F44336"
                    $hoverColor="#F44336"
                    $hoverBg="rgba(244,67,54,0.1)"
                    onClick={() => handleDeleteCoin(symbol.id)}
                    title="Delete coin"
                >
                    <i className="fa fa-trash-o" aria-hidden="true" />
                </IconButton>
            </Td>
        </>
    );
});

export default CoinRows;