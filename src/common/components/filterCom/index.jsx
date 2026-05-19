import React, { useState } from "react";
import styled from "styled-components";
import ExcelPopup from "../excel";
import { DatePicker } from "antd";
import {
  PrimaryButton,
  SecondaryButton,
  ActionGroup,
  Checkbox,
  fluidType,
} from "../../styledComponents";

const { RangePicker } = DatePicker;

// ─────────────────────────────────────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────────────────────────────────────

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} 0`};
  font-family: ${({ theme }) => theme.font.family};
`;

// Ant DatePicker theming overrides
const StyledRangePicker = styled(RangePicker)`
  background: ${({ theme }) => theme.colors.bgInput} !important;
  border: 1px solid ${({ theme }) => theme.colors.borderInput} !important;
  border-radius: ${({ theme }) => theme.radius.md} !important;
  height: 34px;

  .ant-picker-input > input {
    color: ${({ theme }) => theme.colors.textPrimary} !important;
    font-family: ${({ theme }) => theme.font.family} !important;
    font-size: ${({ theme }) => theme.font.sizeSm} !important;
  }

  .ant-picker-input > input::placeholder {
    color: ${({ theme }) => theme.colors.textMuted} !important;
    opacity: 1 !important;                               
  }

  .ant-picker-input > input::-webkit-input-placeholder {
    color: ${({ theme }) => theme.colors.textMuted} !important;
    opacity: 1 !important;
  }

  .ant-picker-separator,
  .ant-picker-suffix {
    color: ${({ theme }) => theme.colors.textMuted} !important;
  }

  &:hover,
  &.ant-picker-focused {
    border-color: ${({ theme }) => theme.colors.borderInputFocus} !important;
    box-shadow: ${({ theme }) => theme.colors.shadowInput} !important;
    color: ${({ theme }) => theme.colors.textPrimary} !important;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg, i {
    position: absolute;
    left: 10px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 13px;
    pointer-events: none;
  }
`;

const SearchInput = styled.input`
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1px solid ${({ theme }) => theme.colors.borderInput};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.font.family};
  ${fluidType("bodySm")}
  padding: 7px 10px 7px 30px;
  outline: none;
  transition: ${({ theme }) => theme.transition};
  width: 180px;
  height: 34px;

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }

  &:focus {
    background: ${({ theme }) => theme.colors.bgInputFocus};
    border-color: ${({ theme }) => theme.colors.borderInputFocus};
    box-shadow: ${({ theme }) => theme.colors.shadowInput};
    width: 220px;
  }

  @media (max-width: 576px) {
    width: 100%;
    &:focus { width: 100%; }
  }
`;

// ── Dropdown wrapper (columns + export) ──────────────────────────────────────

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 300;
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadowFloatMenu};
  padding: ${({ theme }) => theme.spacing.sm};
  min-width: 180px;
  list-style: none;
  margin: 0;
  animation: dropIn 0.15s ease;

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const DropdownItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 6px ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  ${fluidType("bodySm")}
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.font.family};

  &:hover { background: ${({ theme }) => theme.colors.bgSidebarHover}; }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.divider};
  margin: ${({ theme }) => `${theme.spacing.xs} 0`};
`;

const ClearBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: ${({ theme }) => theme.colors.errorLight};
  color: ${({ theme }) => theme.colors.error};
  border: 1px solid ${({ theme }) => theme.colors.error}33;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.font.family};
  ${fluidType("bodySm")}
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  padding: 6px 10px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  margin-top: ${({ theme }) => theme.spacing.xs};

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: #fff;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const FilterComponent = ({
  onSubmit,
  onClear,
  columnName,
  visibleColumns,
  setVisibleColumns,
  bindTableData,
  handleExcelClick,
  pageName,
  loading,
  validExportDataKey,
}) => {
  const [searchText, setSearchText] = useState("");
  const [dates, setDates] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [colDropOpen, setColDropOpen] = useState(false);

  const handleSubmit = () => onSubmit({ searchText, dates });

  const handleExport = () => {
    setExportOpen(true);
    handleExcelClick();
  };

  const handleClearFilter = () => {
    setSearchText("");
    setDates(null);
    setVisibleColumns(
      columnName.reduce((acc, col) => ({ ...acc, [col]: true }), {})
    );
    onClear();
  };

  const toggleColumn = (col) => {
    setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  return (
    <FilterBar>
      <ActionGroup>
        {/* ── Date range ── */}
        <StyledRangePicker
          value={dates}
          onChange={(values) => setDates(values)}
          format="DD-MM-YYYY"
          classNames={{
            popup: {
              root: "dark-range-picker",
            },
          }}
        />

        {/* ── Search ── */}
        <SearchWrapper>
          <i className="fa fa-search" aria-hidden="true" />
          <SearchInput
            placeholder="Search here…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </SearchWrapper>

        {/* ── Submit ── */}
        <PrimaryButton onClick={handleSubmit} disabled={loading}>
          Submit
        </PrimaryButton>

        {/* ── Export ── */}
        <DropdownWrapper>
          <SecondaryButton onClick={handleExport}>
            <i className="fa fa-file-excel-o" /> Export
          </SecondaryButton>

          {exportOpen && (
            <ExcelPopup
              onClose={() => setExportOpen(false)}
              bindTableData={bindTableData}
              columnName={columnName}
              pageName={pageName}
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
              validExportDataKey={validExportDataKey}
            />
          )}
        </DropdownWrapper>

        {/* ── Columns toggle ── */}
        <DropdownWrapper>
          <SecondaryButton onClick={() => setColDropOpen((o) => !o)}>
            Columns <i className="bi bi-caret-down-fill" style={{ fontSize: 11 }} />
          </SecondaryButton>

          {colDropOpen && (
            <DropdownMenu>
              {columnName.map((col) => (
                <DropdownItem
                  key={col}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleColumn(col);
                  }}
                >
                  <Checkbox
                    checked={!!visibleColumns[col]}
                    onChange={() => toggleColumn(col)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {col}
                </DropdownItem>
              ))}

              <DropdownDivider />

              <ClearBtn onClick={handleClearFilter}>
                <i className="fa fa-times" /> Clear Filter
              </ClearBtn>
            </DropdownMenu>
          )}
        </DropdownWrapper>
      </ActionGroup>
    </FilterBar>
  );
};

export default FilterComponent;