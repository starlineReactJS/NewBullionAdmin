import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DatePicker } from "antd";
import { FaChevronDown } from "react-icons/fa";
import CommonModal from "../modal";
import excelimg from "../../../assets/image/sheet.png";
import pdfimg from "../../../assets/image/pdf.png";
import csvimg from "../../../assets/image/file.png";
import jsonimg from "../../../assets/image/json.png";
import { toastFn } from "@/utils";
import ExportToExcel from "../../export/ExportToExcel";
import { ExportToCSV } from "../../export/ExportToCSV";
import { ExportJSON } from "../../export/ExportToJSON";
import { ExportToPDF } from "../../export/ExportToPDF";
import { useAuth } from "../../../context/AuthContext";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import styled from "styled-components";
import {
  PrimaryButton,
  SecondaryButton,
  Checkbox,
  ActionGroup,
  fluidType,
} from "../../styledComponents";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

// ─────────────────────────────────────────────────────────────────────────────
// Export format options
// ─────────────────────────────────────────────────────────────────────────────

const FORMAT_OPTIONS = [
  { value: 1, label: "EXCEL", img: excelimg },
  { value: 2, label: "CSV", img: csvimg },
  { value: 3, label: "PDF", img: pdfimg },
  { value: 4, label: "JSON", img: jsonimg },
];

// ─────────────────────────────────────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────────────────────────────────────

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

// ── Format selector ──────────────────────────────────────────────────────────

const FormatSelector = styled.div`
  position: relative;
  width: 140px;
  flex-shrink: 0;
`;

const FormatSelected = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1px solid ${({ theme }) => theme.colors.borderInput};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 7px 10px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderInputFocus};
    background: ${({ theme }) => theme.colors.bgInputFocus};
  }
`;

const FormatLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  img { width: 18px; height: 18px; object-fit: contain; }
`;

const FormatDropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 400;
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadowFloatMenu};
  overflow: hidden;
  min-width: 140px;
  animation: dropIn 0.15s ease;

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const FormatOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: ${({ theme }) => theme.transition};

  img { width: 18px; height: 18px; object-fit: contain; }

  &:hover { background: ${({ theme }) => theme.colors.bgSidebarHover}; }

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  }
`;

// ── Columns dropdown ─────────────────────────────────────────────────────────

const DropdownWrapper = styled.div`
  position: relative;
`;

const ColumnMenu = styled.ul`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 400;
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

const ColumnItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 6px ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: ${({ theme }) => theme.transition};

  &:hover { background: ${({ theme }) => theme.colors.bgSidebarHover}; }
`;

// ── Search input ─────────────────────────────────────────────────────────────

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  i {
    position: absolute;
    left: 10px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 12px;
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
  height: 34px;
  width: 160px;
  transition: ${({ theme }) => theme.transition};

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }

  &:focus {
    background: ${({ theme }) => theme.colors.bgInputFocus};
    border-color: ${({ theme }) => theme.colors.borderInputFocus};
    box-shadow: ${({ theme }) => theme.colors.shadowInput};
    width: 200px;
  }
`;

// ── Themed RangePicker ───────────────────────────────────────────────────────
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
// ── Table preview area ────────────────────────────────────────────────────────

const PreviewWrapper = styled.div`
  max-height: 450px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const ExcelPopup = ({
  onClose,
  bindTableData,
  columnName,
  pageName = "",
  visibleColumns,
  setVisibleColumns,
  validExportDataKey = {},
}) => {
  const { auth: { name } } = useAuth();
  const excelData = useSelector((state) => state.excel.excelData);

  const [formatOpen, setFormatOpen] = useState(false);
  const [colOpen, setColOpen] = useState(false);
  const [selected, setSelected] = useState(FORMAT_OPTIONS[0]);
  const [dates, setDates] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Strip action columns from column list
  const filteredColumnName = columnName.filter((_, i) => {
    if (pageName === "update") {
      return i !== columnName.length - 1 && i !== columnName.length - 2;
    }
    return i !== columnName.length - 1;
  });

  // Sync filteredData with excelData
  useEffect(() => {
    setFilteredData(excelData?.length > 0 ? excelData : []);
  }, [excelData]);

  // Search match helper (logic untouched)
  const matchesSearch = (item, query) => {
    if (!query) return true;
    const q = query.toLowerCase();
    if (pageName === "update") return item.title?.toLowerCase().includes(q) || item.message?.toLowerCase().includes(q);
    if (pageName === "feedback") return item.name?.toLowerCase().includes(q) || item.subject?.toLowerCase().includes(q) || item.mobile?.toLowerCase().includes(q);
    if (pageName === "otrlist") return item.name?.toLowerCase().includes(q) || item.firmName?.toLowerCase().includes(q) || item.mobile?.toLowerCase().includes(q);
    return item.type?.toLowerCase().includes(q) || item.cat?.toLowerCase().includes(q) || item.subCat?.toLowerCase().includes(q);
  };

  // Filter by date + search
  useEffect(() => {
    let data = [...excelData];

    if (dates?.length > 0) {
      const [from, to] = dates;
      data = data.filter((item) => {
        const dateValue =
          pageName === "feedback" ? item?.createdDate
            : pageName === "product" ? item?.datetime
              : item?.modifiedDate;
        return dayjs(dateValue).isBetween(from, to, "day", "[]");
      });
    }

    if (searchText.trim()) {
      data = data.filter((item) => matchesSearch(item, searchText));
    }

    setFilteredData(data);
  }, [searchText, dates, excelData, pageName]);

  // Build export payload
  const buildValidData = () =>
    filteredData.map((item) => {
      const newItem = {};
      Object.keys(validExportDataKey).forEach((key) => {
        if (validExportDataKey[key] === true) {
          newItem[key] = key in item ? item[key] : true;
        }
      });
      return newItem;
    });

  const exportFunction = (label, data) => {
    const filename = `${name}_${pageName}`;
    switch (label) {
      case "EXCEL": ExportToExcel(data, `${filename}.xlsx`); break;
      case "CSV": ExportToCSV(data, `${filename}.csv`); break;
      case "PDF": ExportToPDF(data, `${filename}.pdf`); break;
      case "JSON": ExportJSON(data, `${filename}.json`); break;
      default: break;
    }
  };

  const dataNotExport = Object.values(validExportDataKey).every((v) => v === false);

  const handleApply = () => {
    const validData = buildValidData();
    filteredData?.length > 0 && !dataNotExport
      ? exportFunction(selected.label, validData)
      : toastFn("error", "No Data To Export!!");
  };

  return (
    <CommonModal show title="Export Data" onClose={onClose} className="modal-xl">

      {/* ── Toolbar ── */}
      <ToolbarRow>
        <ActionGroup>

          {/* Format selector */}
          <FormatSelector>
            <FormatSelected onClick={() => { setFormatOpen((o) => !o); setColOpen(false); }}>
              <FormatLabel>
                {selected.img && <img src={selected.img} alt={selected.label} />}
                {selected.label}
              </FormatLabel>
              <FaChevronDown size={11} />
            </FormatSelected>

            {formatOpen && (
              <FormatDropdown>
                {FORMAT_OPTIONS.map((opt) => (
                  <FormatOption
                    key={opt.value}
                    onClick={() => { setSelected(opt); setFormatOpen(false); }}
                  >
                    {opt.img && <img src={opt.img} alt={opt.label} />}
                    {opt.label}
                  </FormatOption>
                ))}
              </FormatDropdown>
            )}
          </FormatSelector>

          {/* Columns toggle */}
          <DropdownWrapper>
            <SecondaryButton onClick={() => { setColOpen((o) => !o); setFormatOpen(false); }}>
              Columns <i className="bi bi-caret-down-fill" style={{ fontSize: 10 }} />
            </SecondaryButton>

            {colOpen && (
              <ColumnMenu>
                {filteredColumnName.map((col) => (
                  <ColumnItem
                    key={col}
                    onClick={(e) => {
                      e.stopPropagation();
                      setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));
                    }}
                  >
                    <Checkbox
                      checked={!!visibleColumns[col]}
                      onChange={() => setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }))}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {col}
                  </ColumnItem>
                ))}
              </ColumnMenu>
            )}
          </DropdownWrapper>

          {/* Date range */}
          <StyledRangePicker
            onChange={(_, dateStrings) => setDates(dateStrings)}
            getPopupContainer={() => document.body}
            classNames={{
              popup: {
                root: "dark-range-picker",
              },
            }}
          />

          {/* Search */}
          <SearchWrapper>
            <i className="fa fa-search" aria-hidden="true" />
            <SearchInput
              placeholder="Search here…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </SearchWrapper>

          {/* Apply / export */}
          <PrimaryButton onClick={handleApply}>
            <i className="fa fa-download" /> Apply
          </PrimaryButton>

        </ActionGroup>
      </ToolbarRow>

      {/* ── Table preview ── */}
      <PreviewWrapper>
        {bindTableData(filteredData)}
      </PreviewWrapper>

    </CommonModal>
  );
};

export default ExcelPopup;