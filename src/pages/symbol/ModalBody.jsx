import React, { useContext, useMemo } from "react";
import { instrument, apiUrl } from "../../../Config";
import { sourceContext } from "../../layout/AdminBullionLayout";
import { contractOptions } from "../../constants/main";
import { PrimaryButton } from "../../common/styledComponents";
import {
    FormGrid,
    FormCol,
    FormTable,
    FormTableBody,
    FormLabelCell,
    FormLabel,
    FormInputCell,
    FieldInput,
    FieldTextArea,
    FieldSelect,
    FieldCheckbox,
    RadioGroup,
    RadioLabel,
    FormFooter,
} from "../../common/styledComponents/modal";

// ─────────────────────────────────────────────────────────────────────────────
// Field config (logic untouched)
// ─────────────────────────────────────────────────────────────────────────────

const rowsForAddSymbols = [
    { label: "Name", name: "name", type: "text" },
    { label: "Instrument", name: "instrument", type: "select", optionsKey: "instrument" },
    { label: "Source", name: "source", type: "select", optionsKey: "commonPremiumSource" },
    { label: "Contract", name: "contract", type: "contractSelect" },
];

const rowsForEditSymbolLeft = [
    { label: "isView", name: "isView", type: "checkbox" },
    { label: "Name", name: "name", type: "text" },
    { label: "Instrument", name: "instrument", type: "select", optionsKey: "instrument" },
    { label: "Contract", name: "contract", type: "contractSelect" },
    { label: "Source", name: "source", type: "select", optionsKey: "commonPremiumSource" },
    { label: "Segment", name: "segment", type: "segmentSelect" },
    { label: "Is Common Premium", name: "isCP", type: "checkbox" },
    { label: "Description", name: "description", type: "textarea" },
    { label: "Rate Type", name: "rateType", type: "rateTypeRadio" },
    { label: "Product Type", name: "identifier", type: "productTypeSelect" },
    { label: "Identifier", name: "identifier", type: "text" },
];

const rowsForEditSymbolRight = [
    { label: "BuyPremium", name: "buyPremium", type: "text" },
    { label: "SellPremium", name: "sellPremium", type: "text" },
    { label: "Division", name: "division", type: "text" },
    { label: "Multiply", name: "multiply", type: "text" },
    { label: "GST(%)", name: "gst", type: "text" },
    { label: "TDS(%)", name: "tds", type: "text" },
    { label: "TCS(%)", name: "tcs", type: "text" },
    { label: "Digit", name: "digit", type: "text" },
];

const RATE_TYPE_OPTIONS = [
    { label: "Exc", value: "exchange" },
    { label: "Bank", value: "bank" },
    { label: "Fix", value: "fix" },
    { label: "Product", value: "product" },
    { label: "Client", value: "client" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shared RenderField — handles all field types
// ─────────────────────────────────────────────────────────────────────────────

const RenderField = ({ field, symbolObj, handleChange, symbols }) => {
    const sourceData = useContext(sourceContext);
    const commonPremiumSource = useMemo(
        () => (sourceData?.source ? sourceData.source : []),
        [sourceData]
    );

    const value = symbolObj?.[field.name] ?? "";

    switch (field.type) {
        case "text":
            return (
                <FieldInput
                    type="text"
                    name={field.name}
                    value={value}
                    onChange={handleChange}
                />
            );

        case "textarea":
            return (
                <FieldTextArea
                    name={field.name}
                    value={value}
                    onChange={handleChange}
                    rows={4}
                />
            );

        case "checkbox":
            return (
                <FieldCheckbox
                    name={field.name}
                    checked={field.name === "isView" ? (value === undefined ? true : Boolean(value)) : !!value}
                    onChange={handleChange}
                />
            );

        case "select": {
            const options = field.optionsKey === "instrument" ? instrument : commonPremiumSource;
            return (
                <FieldSelect name={field.name} value={value} onChange={handleChange}>
                    {options?.map((opt, i) => (
                        <option key={i} value={opt.value}>
                            {opt.label || opt.name}
                        </option>
                    ))}
                </FieldSelect>
            );
        }

        case "contractSelect":
            return (
                <FieldSelect name="contract" value={symbolObj.contract} onChange={handleChange}>
                    {contractOptions.map((item) => (
                        <option
                            key={item.value}
                            value={`${symbolObj.instrument?.toUpperCase()}_${item.value}`}
                        >
                            {item.label}
                        </option>
                    ))}
                </FieldSelect>
            );

        case "segmentSelect":
            return (
                <FieldSelect name="segment" value={symbolObj.segment} onChange={handleChange}>
                    {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>product_{n}</option>
                    ))}
                </FieldSelect>
            );

        case "rateTypeRadio":
            return (
                <RadioGroup>
                    {RATE_TYPE_OPTIONS.map(({ label, value: val }) => (
                        <RadioLabel key={val} $checked={symbolObj?.rateType === val}>
                            {label}
                            <input
                                type="radio"
                                name="rateType"
                                value={val}
                                checked={symbolObj?.rateType === val}
                                onChange={handleChange}
                            />
                        </RadioLabel>
                    ))}
                </RadioGroup>
            );

        case "productTypeSelect":
            return (
                <FieldSelect name="identifier"  value={symbolObj?.identifier || ""} onChange={handleChange}>
                    {/* {symbols?.map((d, i) => (
                        <option key={i} value={d.uniqueId}>{d.name}</option>
                    ))} */}
                    {symbols?.length > 1 ? symbols
                        ?.filter((d) => d.uniqueId !== symbolObj?.uniqueId)
                        .map((d) => (
                            <option key={d.uniqueId} value={d.uniqueId}>
                                {d.name}
                            </option>
                        )): <option>No products found</option>}
                </FieldSelect>
            );

        default:
            return null;
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared form row
// ─────────────────────────────────────────────────────────────────────────────

const FormRow = ({ field, symbolObj, handleChange, symbols }) => (
    <tr>
        <FormLabelCell>
            <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
        </FormLabelCell>
        <FormInputCell>
            <RenderField
                field={field}
                symbolObj={symbolObj}
                handleChange={handleChange}
                symbols={symbols}
            />
        </FormInputCell>
    </tr>
);

// ─────────────────────────────────────────────────────────────────────────────
// Edit form
// ─────────────────────────────────────────────────────────────────────────────

const EditSymbolForm = ({ symbolObj, handleChange, handleEditClick, symbols, isSaving }) => (
    <FormGrid>
        {/* Left column */}
        <FormCol $bordered>
            <FormTable>
                <FormTableBody>
                    {rowsForEditSymbolLeft.map((field, i) => {
                        if (field.type === "productTypeSelect" && symbolObj?.rateType !== "product") return null;
                        if (field.name === "identifier" &&  field.type === "text" && symbolObj?.rateType !== "client") return null;
                        return (
                            <FormRow
                                key={i}
                                field={field}
                                symbolObj={symbolObj}
                                handleChange={handleChange}
                                symbols={symbols}
                            />
                        );
                    })}
                </FormTableBody>
            </FormTable>
        </FormCol>

        {/* Right column */}
        <FormCol>
            <FormTable>
                <FormTableBody>
                    {rowsForEditSymbolRight.map((field, i) => (
                        <FormRow
                            key={i}
                            field={field}
                            symbolObj={symbolObj}
                            handleChange={handleChange}
                        />
                    ))}
                </FormTableBody>
            </FormTable>
        </FormCol>

        {/* Footer spans both columns */}
        <FormFooter>
            <PrimaryButton disabled={isSaving} onClick={handleEditClick}>
                {isSaving ? "Saving…" : "Update Symbol"}
            </PrimaryButton>
        </FormFooter>
    </FormGrid>
);

// ─────────────────────────────────────────────────────────────────────────────
// Create form
// ─────────────────────────────────────────────────────────────────────────────

const CreateSymbolForm = ({ symbolObj, handleChange, createSymbol, isSaving }) => (
    <FormGrid $cols="1fr">
        <FormCol>
            <FormTable>
                <FormTableBody>
                    {rowsForAddSymbols.map((field, i) => (
                        <FormRow
                            key={i}
                            field={field}
                            symbolObj={symbolObj}
                            handleChange={handleChange}
                        />
                    ))}
                </FormTableBody>
            </FormTable>
        </FormCol>

        <FormFooter>
            <PrimaryButton disabled={isSaving} onClick={createSymbol}>
                {isSaving ? "Creating…" : "Create Symbol"}
            </PrimaryButton>
        </FormFooter>
    </FormGrid>
);

// ─────────────────────────────────────────────────────────────────────────────
// Public export
// ─────────────────────────────────────────────────────────────────────────────

export const SymbolPopupBody = ({
    isEdit, symbolObj, handleChange,
    createSymbol, handleEditClick, symbols, isSaving,
}) =>
    isEdit ? (
        <EditSymbolForm
            symbolObj={symbolObj}
            handleChange={handleChange}
            symbols={symbols}
            handleEditClick={handleEditClick}
            isSaving={isSaving}
        />
    ) : (
        <CreateSymbolForm
            symbolObj={symbolObj}
            handleChange={handleChange}
            createSymbol={createSymbol}
            isSaving={isSaving}
        />
    );