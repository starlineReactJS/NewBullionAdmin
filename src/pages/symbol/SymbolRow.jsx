import React, { memo } from "react";
import styled from "styled-components";
import {
    Td,
    StepButton,
    Input,
    StepInputRow,
    Checkbox,
    IconButton,
} from "../../common/styledComponents";
import { NameCell, RateTypeBadge, SaveBtn, SourceText } from "../../common/styledComponents/symbol";

const   SymbolRow = memo(
    ({
        symbol,
        rowSaveId,
        handleStepChange,
        handleSymbolUpdate,
        handleSaveSymbol,
        openModal,
        handleDeleteSymbol,
    }) => {
        const isSaving = rowSaveId === symbol.id;

        return (
            <>
                {/* View (checkbox) */}
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
                <Td $align="center" $w="230px">
                    <NameCell>{symbol.name}</NameCell>
                </Td>

                {/* Source */}
                <Td>
                    <NameCell>{symbol.source}</NameCell>
                </Td>

                {/* Rate Type */}
                <Td>
                    <NameCell>{symbol.rateType}</NameCell>
                </Td>

                {/* Buy Premium */}
                <Td>
                    <StepInputRow>
                        <StepButton
                            type="button"
                            onClick={() =>
                                handleStepChange(symbol.id, "buyPremium", "dec", symbol.source)
                            }
                        >
                            −
                        </StepButton>
                        <Input
                            type="text"
                            value={symbol.buyPremium}
                            $width="60px"
                            onChange={(e) =>
                                handleSymbolUpdate(symbol.id, "buyPremium", e.target.value)
                            }
                        />
                        <StepButton
                            type="button"
                            onClick={() =>
                                handleStepChange(symbol.id, "buyPremium", "inc", symbol.source)
                            }
                        >
                            +
                        </StepButton>
                    </StepInputRow>
                </Td>

                {/* Sell Premium */}
                <Td>
                    <StepInputRow>
                        <StepButton
                            type="button"
                            onClick={() =>
                                handleStepChange(symbol.id, "sellPremium", "dec", symbol.source)
                            }
                        >
                            −
                        </StepButton>
                        <Input
                            type="text"
                            value={symbol.sellPremium}
                            $width="60px"
                            onChange={(e) =>
                                handleSymbolUpdate(symbol.id, "sellPremium", e.target.value)
                            }
                        />
                        <StepButton
                            type="button"
                            onClick={() =>
                                handleStepChange(symbol.id, "sellPremium", "inc", symbol.source)
                            }
                        >
                            +
                        </StepButton>
                    </StepInputRow>
                </Td>

                {/* Save */}
                <Td>
                    <SaveBtn
                        disabled={isSaving}
                        onClick={() => handleSaveSymbol(symbol.id)}
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
                        title="Edit symbol"
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
                        onClick={() => handleDeleteSymbol(symbol.id)}
                        title="Delete symbol"
                    >
                        <i className="fa fa-trash-o" aria-hidden="true" />
                    </IconButton>
                </Td>
            </>
        );
    }
);

export default SymbolRow;