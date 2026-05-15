import React, { useContext, useMemo } from "react";
import { instrument, apiUrl } from "../../../Config";
import { sourceContext } from "../../layout/AdminBullionLayout";
import { contractOptions } from "../../constants/main";
import { Image, Spin } from "antd";
import styled from "styled-components";
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
    FieldFileInput,
    RadioGroup,
    RadioLabel,
    FormFooter,
} from "../../common/styledComponents/modal";
import { fluidType,PrimaryButton } from "../../common/styledComponents";

// ─────────────────────────────────────────────────────────────────────────────
// Local styles
// ─────────────────────────────────────────────────────────────────────────────

const ImageThumb = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 3px;
  margin-left: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
`;

// ─────────────────────────────────────────────────────────────────────────────
// Field config (logic untouched)
// ─────────────────────────────────────────────────────────────────────────────

const rowsForAddCoins = [
    { label: "Name", name: "name", type: "text" },
    { label: "Instrument", name: "instrument", type: "select", optionsKey: "instrument" },
    { label: "Source", name: "source", type: "select", optionsKey: "commonPremiumSource" },
    { label: "Contract", name: "contract", type: "contractSelect" },
];

const rowsForEditCoinLeft = [
    { label: "isView", name: "isView", type: "checkbox" },
    { label: "Name", name: "name", type: "text" },
    { label: "Instrument", name: "instrument", type: "select", optionsKey: "instrument" },
    { label: "Contract", name: "contract", type: "contractSelect" },
    { label: "Source", name: "source", type: "select", optionsKey: "commonPremiumSource" },
    { label: "Segment", name: "segment", type: "segmentSelect" },
    { label: "Is Common Premium", name: "isCP", type: "checkbox" },
    { label: "Description", name: "description", type: "textarea" },
    { label: "Rate Type", name: "rateType", type: "rateTypeRadio" },
    { label: "Product Type", name: "productType", type: "productTypeSelect" },
];

const rowsForEditCoinRight = [
    { label: "Division", name: "division", type: "text" },
    { label: "Multiply", name: "multiply", type: "text" },
    { label: "GST(%)", name: "gst", type: "text" },
    { label: "TDS(%)", name: "tds", type: "text" },
    { label: "TCS(%)", name: "tcs", type: "text" },
    { label: "Digit", name: "digit", type: "text" },
    { label: "Identifier", name: "identifier", type: "text" },
];

const RATE_TYPE_OPTIONS = [
    { label: "Exchange", value: "exchange" },
    { label: "Bank", value: "bank" },
    { label: "Fix", value: "fix" },
    { label: "Product", value: "product" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shared RenderField — same pattern as SymbolModalBody
// ─────────────────────────────────────────────────────────────────────────────

const RenderField = ({ field, coinObj, handleChange, coins }) => {
    const sourceData = useContext(sourceContext);
    const commonPremiumSource = useMemo(
        () => (sourceData?.source ? sourceData.source : []),
        [sourceData]
    );

    const value = coinObj?.[field.name] ?? "";

    switch (field.type) {
        case "text":
            return (
                <FieldInput type="text" name={field.name} value={value} onChange={handleChange} />
            );

        case "textarea":
            return (
                <FieldTextArea name={field.name} value={value} onChange={handleChange} rows={4} />
            );

        case "checkbox":
            return (
                <FieldCheckbox
                    name={field.name}
                    checked={!!coinObj?.[field.name]}
                    onChange={handleChange}
                />
            );

        case "select": {
            const options = field.optionsKey === "instrument" ? instrument : commonPremiumSource;
            return (
                <FieldSelect name={field.name} value={value} onChange={handleChange}>
                    {options?.map((opt, i) => (
                        <option key={i} value={opt.value}>{opt.label || opt.name}</option>
                    ))}
                </FieldSelect>
            );
        }

        case "contractSelect":
            return (
                <FieldSelect name="contract" value={coinObj.contract} onChange={handleChange}>
                    {contractOptions.map((item) => (
                        <option
                            key={item.value}
                            value={`${coinObj.instrument?.toUpperCase()}_${item.value}`}
                        >
                            {item.label}
                        </option>
                    ))}
                </FieldSelect>
            );

        case "segmentSelect":
            return (
                <FieldSelect name="segment" value={coinObj.segment} onChange={handleChange}>
                    {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>product_{n}</option>
                    ))}
                </FieldSelect>
            );

        case "rateTypeRadio":
            return (
                <RadioGroup>
                    {RATE_TYPE_OPTIONS.map(({ label, value: val }) => (
                        <RadioLabel key={val} $checked={coinObj?.rateType === val}>
                            {label}
                            <input
                                type="radio"
                                name="rateType"
                                value={val}
                                checked={coinObj?.rateType === val}
                                onChange={handleChange}
                            />
                        </RadioLabel>
                    ))}
                </RadioGroup>
            );

        case "productTypeSelect":
            return (
                <FieldSelect name="productType" value={value} onChange={handleChange}>
                    {coins?.map((d, i) => (
                        <option key={i} value={d.uniqueId}>{d.name}</option>
                    ))}
                </FieldSelect>
            );

        default:
            return null;
    }
};

// Shared form row (same as Symbol)
const FormRow = ({ field, coinObj, handleChange, coins }) => (
    <tr>
        <FormLabelCell>
            <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
        </FormLabelCell>
        <FormInputCell>
            <RenderField
                field={field}
                coinObj={coinObj}
                handleChange={handleChange}
                coins={coins}
            />
        </FormInputCell>
    </tr>
);

// ─────────────────────────────────────────────────────────────────────────────
// Edit form — right column has dynamic premium + image rows
// ─────────────────────────────────────────────────────────────────────────────

const EditCoinForm = ({ coinObj, handleChange, handleEditClick, coins, isSaving }) => {
    const sourceData = useContext(sourceContext);
    const commonPremiumSource = sourceData?.coinSource || [];

    return (
        <FormGrid>
            {/* Left column */}
            <FormCol $bordered>
                <FormTable>
                    <FormTableBody>
                        {rowsForEditCoinLeft.map((field, i) => {
                            if (field.type === "productTypeSelect" && coinObj?.rateType !== "product") return null;
                            return (
                                <FormRow
                                    key={i}
                                    field={field}
                                    coinObj={coinObj}
                                    handleChange={handleChange}
                                    coins={coins}
                                />
                            );
                        })}
                    </FormTableBody>
                </FormTable>
            </FormCol>

            {/* Right column: dynamic premium/image rows + static right fields */}
            <FormCol>
                <FormTable>
                    <FormTableBody>

                        {/* Dynamic premium rows per source */}
                        {commonPremiumSource?.map((item, index) => (
                            <React.Fragment key={index}>
                                {/* Premium input */}
                                <tr>
                                    <FormLabelCell>
                                        <FormLabel>{item.name} Premium</FormLabel>
                                    </FormLabelCell>
                                    <FormInputCell>
                                        <FieldInput
                                            type="text"
                                            name="premium"
                                            value={coinObj.premium?.[index] ?? "0"}
                                            onChange={(e) => handleChange(e, index)}
                                        />
                                    </FormInputCell>
                                </tr>

                                {/* Image upload row (only if source has isImage) */}
                                {item?.isImage && (
                                    <tr>
                                        <FormLabelCell>
                                            <FormLabel>{item.name} Image</FormLabel>
                                        </FormLabelCell>
                                        <FormInputCell style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <FieldFileInput
                                                name="file"
                                                onChange={(e) => handleChange(e, index)}
                                            />
                                            {coinObj?.url?.[index] && (
                                                <ImageThumb>
                                                    <Image
                                                        width={46}
                                                        alt={`${item.name} preview`}
                                                        src={`${apiUrl}/${coinObj.url[index]}`}
                                                        fallback="https://t2.starlinedashboard.in/img/noimage.png"
                                                        placeholder={<Spin size="small" />}
                                                        preview={{
                                                            maskStyle: { inset: "unset", boxShadow: "none" },
                                                        }}
                                                    />
                                                </ImageThumb>
                                            )}
                                        </FormInputCell>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}

                        {/* Static right-column fields */}
                        {rowsForEditCoinRight.map((field, i) => (
                            <FormRow
                                key={i}
                                field={field}
                                coinObj={coinObj}
                                handleChange={handleChange}
                            />
                        ))}
                    </FormTableBody>
                </FormTable>
            </FormCol>

            <FormFooter>
                <PrimaryButton disabled={isSaving} onClick={handleEditClick}>
                    {isSaving ? "Saving…" : "Update Coin"}
                </PrimaryButton>
            </FormFooter>
        </FormGrid>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Create form
// ─────────────────────────────────────────────────────────────────────────────

const CreateCoinForm = ({ coinObj, handleChange, createCoin, isSaving }) => (
    <FormGrid $cols="1fr">
        <FormCol>
            <FormTable>
                <FormTableBody>
                    {rowsForAddCoins.map((field, i) => (
                        <FormRow
                            key={i}
                            field={field}
                            coinObj={coinObj}
                            handleChange={handleChange}
                        />
                    ))}
                </FormTableBody>
            </FormTable>
        </FormCol>

        <FormFooter>
            <PrimaryButton disabled={isSaving} onClick={createCoin}>
                {isSaving ? "Creating…" : "Create Coin"}
            </PrimaryButton>
        </FormFooter>
    </FormGrid>
);

// ─────────────────────────────────────────────────────────────────────────────
// Public export
// ─────────────────────────────────────────────────────────────────────────────

export const CoinPopupBody = ({
    isEdit, coinObj, handleChange,
    createCoin, handleEditClick, coins, isSaving,
}) =>
    isEdit ? (
        <EditCoinForm
            coinObj={coinObj}
            handleChange={handleChange}
            coins={coins}
            handleEditClick={handleEditClick}
            isSaving={isSaving}
        />
    ) : (
        <CreateCoinForm
            coinObj={coinObj}
            handleChange={handleChange}
            createCoin={createCoin}
            isSaving={isSaving}
        />
    );