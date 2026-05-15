import React, { forwardRef, useState } from "react";
import styled from "styled-components";
import { fluidType } from "../../styledComponents";

// ─────────────────────────────────────────────────────────────────────────────
// Shared form primitives
// ─────────────────────────────────────────────────────────────────────────────

const FormRow = styled.tr`
  vertical-align: top;
`;

const LabelCell = styled.td`
  padding: 0 12px 12px 0;
  white-space: nowrap;
  vertical-align: middle;
  width: 1%;
`;

const FieldLabel = styled.label`
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin: 0;
  white-space: nowrap;
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.font.weightBold};
  margin-left: 1px;
`;

const Colon = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: 6px;
`;

const InputCell = styled.td`
  padding: 0 0 12px 0;
  width: 100%;
`;

// Base styles shared by all inputs
const baseInputStyles = ({ theme, $hasError }) => `
  width: 100%;
  background: ${theme.colors.bgInput};
  border: 1px solid ${$hasError ? theme.colors.error : theme.colors.borderInput};
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.textPrimary};
  font-family: ${theme.font.family};
  font-size: ${theme.font.sizeSm};
  font-weight: ${theme.font.weightMedium};
  padding: 7px 10px;
  outline: none;
  transition: ${theme.transition};
  text-align: left;
  box-shadow: ${$hasError ? `0 0 0 3px ${theme.colors.error}22` : "none"};

  &:focus {
    background: ${theme.colors.bgInputFocus};
    border-color: ${$hasError ? theme.colors.error : theme.colors.borderInputFocus};
    box-shadow: ${$hasError
        ? `0 0 0 3px ${theme.colors.error}22`
        : theme.colors.shadowInput};
  }

  &::placeholder {
    color: ${theme.colors.textMuted};
    font-weight: ${theme.font.weightNormal};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const StyledInput = styled.input`
  ${({ theme, $hasError }) => baseInputStyles({ theme, $hasError })}
`;

const StyledTextArea = styled.textarea`
  ${({ theme, $hasError }) => baseInputStyles({ theme, $hasError })}
  resize: vertical;
  min-height: ${({ rows }) => (rows || 4) * 24}px;
`;

const StyledSelect = styled.select`
  ${({ theme, $hasError }) => baseInputStyles({ theme, $hasError })}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239AA3BE' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 32px;

  option {
    background: ${({ theme }) => theme.colors.bgSurface};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const StyledFileInput = styled.input`
  width: 100%;
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;

  &::file-selector-button {
    background: ${({ theme }) => theme.colors.primary};
    color: #FFF;
   border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.radius.sm};
    padding: 5px 12px;
    font-family: ${({ theme }) => theme.font.family};
    font-size: ${({ theme }) => theme.font.sizeSm};
    font-weight: ${({ theme }) => theme.font.weightSemiBold};
    cursor: pointer;
    margin-right: 10px;
    transition: ${({ theme }) => theme.transition};

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      color: #fff;
    }
  }
`;

const StyledCheckbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  margin: 0;
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  padding: 0;
  line-height: 1;
  transition: ${({ theme }) => theme.transition};

  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

const ErrorText = styled.div`
  ${fluidType("caption")}
  font-family: ${({ theme }) => theme.font.family};
  color: ${({ theme }) => theme.colors.error};
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before { content: "⚠"; font-size: 10px; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Wrapper — row layout used by all form fields
// ─────────────────────────────────────────────────────────────────────────────
const Wrapper = ({ label, required, error, name, children }) => (
    <FormRow>
        <LabelCell>
            {label && (
                <FieldLabel htmlFor={name}>
                    {label}
                    {required && <RequiredMark>*</RequiredMark>}
                    <Colon>:</Colon>
                </FieldLabel>
            )}
        </LabelCell>

        <InputCell>
            {children}
            {error && <ErrorText>{error}</ErrorText>}
        </InputCell>
    </FormRow>
);

// ─────────────────────────────────────────────────────────────────────────────
// Field primitives (forwardRef preserved)
// ─────────────────────────────────────────────────────────────────────────────

const Text = forwardRef(({
    name, type = "text", value = "", placeholder = "",
    inputMode = "", maxLength, onChange, error, className = "", ...props
}, ref) => {
    const handleChange = (e) => {
        let val = e.target.value;
        if (inputMode === "numeric" && !/^\d*$/.test(val)) return;
        if (inputMode === "alphabet" && !/^[a-zA-Z\s]*$/.test(val)) return;
        onChange?.(e);
    };

    return (
        <StyledInput
            ref={ref}
            id={name}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            maxLength={maxLength}
            onChange={handleChange}
            $hasError={!!error}
            {...props}
        />
    );
});

const TextArea = forwardRef(({
    name, value, placeholder, rows = 4, onChange, error, className = "", ...props
}, ref) => (
    <StyledTextArea
        ref={ref}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={onChange}
        $hasError={!!error}
        {...props}
    />
));

const Password = forwardRef(({
    name, value, placeholder = "", onChange, error, className = "", ...props
}, ref) => {
    const [show, setShow] = useState(false);
    return (
        <PasswordWrapper>
            <StyledInput
                ref={ref}
                id={name}
                name={name}
                type={show ? "text" : "password"}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                $hasError={!!error}
                style={{ paddingRight: "36px" }}
                {...props}
            />
            <PasswordToggle type="button" onClick={() => setShow((s) => !s)} tabIndex={-1}>
                {show ? "🙈" : "👁️"}
            </PasswordToggle>
        </PasswordWrapper>
    );
});

const Select = forwardRef(({
    name, value, onChange, options = [], error,
    className = "", placeholder = "Please Select", ...props
}, ref) => (
    <StyledSelect
        ref={ref}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        $hasError={!!error}
        {...props}
    >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
    </StyledSelect>
));

const File = forwardRef(({ name, onChange, className = "", error, ...props }, ref) => (
    <StyledFileInput
        ref={ref}
        id={name}
        name={name}
        type="file"
        onChange={onChange}
        {...props}
    />
));

const CheckboxField = forwardRef(({
    name, checked, onChange, error, className = "", ...props
}, ref) => (
    <StyledCheckbox
        ref={ref}
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        {...props}
    />
));

// ─────────────────────────────────────────────────────────────────────────────
// CommonForm — public API (same interface as before)
// ─────────────────────────────────────────────────────────────────────────────
export const CommonForm = {
    Text: ({ label, required, error, name, ...props }) => (
        <Wrapper label={label} required={required} error={error} name={name}>
            <Text name={name} error={error} {...props} />
        </Wrapper>
    ),

    TextArea: ({ label, required, error, name, ...props }) => (
        <Wrapper label={label} required={required} error={error} name={name}>
            <TextArea name={name} error={error} {...props} />
        </Wrapper>
    ),

    Password: ({ label, required, error, name, ...props }) => (
        <Wrapper label={label} required={required} error={error} name={name}>
            <Password name={name} error={error} {...props} />
        </Wrapper>
    ),

    File: ({ label, required, error, name, ...props }) => (
        <Wrapper label={label} required={required} error={error} name={name}>
            <File name={name} error={error} {...props} />
        </Wrapper>
    ),

    Select: ({ label, required, error, name, options, ...props }) => (
        <Wrapper label={label} required={required} error={error} name={name}>
            <Select name={name} error={error} options={options} {...props} />
        </Wrapper>
    ),

    Checkbox: ({ label, error, name, ...props }) => (
        <Wrapper label={label} error={error} name={name}>
            <CheckboxField name={name} error={error} {...props} />
        </Wrapper>
    ),
};