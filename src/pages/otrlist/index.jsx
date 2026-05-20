import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import FilterComponent from "../../common/components/filterCom";
import { setExcelData } from "../../redux/slices/excelSlice";
import useColumnManager from "../../common/hooks/useColumnManager";
import SortableTable from "../../common/components/sortTable";
import { toastFn } from "@/utils";
import { deleteOTRListDetail, getOTRListDetails } from "../../ApiServices/services";
import useInfiniteScroll from "../../common/hooks/useInfiniteScroll";
import { deleteModal } from "../../common/components/modal/deleteModal";
import dayjs from "dayjs";
import {
  PageWrapper,
  Card,
  PageTitle,
  SectionLabel,
  PrimaryButton,
  IconButton,
  ActionBar,
  ActionGroup,
  CellText,
  DateText,
  ModalFooter,
  FormTableBody,
  FormTable,
} from "../../common/styledComponents";

const APPROVE_COLUMNS = ["Date", "Name", "Firmname", "Mobile", "City", "IP", "Delete"];
const OTRList = () => {
  const dispatch = useDispatch();
  const {contentRef} = useOutletContext() || {};
  const {
    columnOrder,
    visibleColumns,
    setVisibleColumns,
    activeId,
    setActiveId,
    handleDragEnd
  } = useColumnManager("otr", APPROVE_COLUMNS);
  const [request, setRequest] = useState({});
  const [excelModelLoading, setIsExcelModelLoading] = useState(false);
  const {
    data: otrLists,
    isLoading,
    isFetchingMore,
    hasMore,
    setData,
    reset
  } = useInfiniteScroll(getOTRListDetails, request, 40,contentRef);

  const handleFilterSubmit = useCallback(({ searchText, dates }) => {
    setRequest({
      offset: 0,
      limit: 40,
      ...(dates?.length === 2 && { dateRange: dates.map(d => d.format("DD-MM-YYYY")).join("|") }),
      ...(searchText && { search: searchText }),
    });
  }, []);

  const handleExcelClick = useCallback(async () => {
    dispatch(setExcelData([]));
    try {
      setIsExcelModelLoading(true);
      const response = await getOTRListDetails();
      if (response?.success && response?.data) {
        dispatch(setExcelData(response?.data));
      }
    } catch (error) {
      console.error("error:", error);
    } finally {
      setIsExcelModelLoading(false);
    }
  }, [dispatch]);

  const clearFilter = useCallback(() => setRequest({}), []);

  const handleDelete = useCallback((id) => {
    deleteModal({
      onConfirm: async () => {
        try {
          const body = { id };
          const result = await deleteOTRListDetail(body);
          if (result?.success) {
            toastFn("success", result?.message || "Deleted successfully");
            setData(prev => prev.filter(item => item.id !== id));
          } else {
            toastFn("error", result?.message || "Failed to delete");
          }
        } catch (error) {
          toastFn("error", error.message || "Something went wrong");
        }
      }
    });
  }, [setData]);

  const columnRender = useCallback((col, row, mode = "") => {
    switch (col) {
      case "Date":
        return <DateText>{dayjs(row?.modifiedDate).format("MM/DD/YYYY hh:mm:ss A")}</DateText>;

      case "Name":
        return <CellText>{row?.name}</CellText>;

      case "Firmname":
        return <CellText>{row?.firmName}</CellText>;

      case "Mobile":
        return <CellText>{row?.mobile}</CellText>;

      case "City":
        return <CellText>{row?.city}</CellText>;

      case "IP":
        return <CellText>{row?.ip}</CellText>;

      case "Delete":
        return mode !== "excel" && (
          <IconButton
            $color="#F44336"
            $hoverColor="#F44336"
            $hoverBg="rgba(244,67,54,0.1)"
            onClick={() => handleDelete(row?.id)}
            title="Delete"
          >
            <i className="fa fa-trash-o text-danger" />
          </IconButton>


        );
      default:
        return null;
    }
  }, [handleDelete]);

  const bindTableData = useCallback((data, mode = "") => (
    <SortableTable
      data={data}
      columnOrder={columnOrder}
      visibleColumns={visibleColumns}
      activeId={activeId}
      setActiveId={setActiveId}
      handleDragEnd={handleDragEnd}
      mode={mode}
      isLoading={mode === 'excel' ? excelModelLoading : isLoading}
      columnRender={(col, row) => columnRender(col, row, mode)}
    />
  ), [columnOrder, visibleColumns, activeId, setActiveId, handleDragEnd,
    excelModelLoading, isLoading, isFetchingMore, hasMore, columnRender]);

  const validExportDataKey = {
    "name": visibleColumns?.Name,
    "mobile": visibleColumns?.Mobile,
    "firmName": visibleColumns?.Firmname,
    "city": visibleColumns?.City,
    "modifiedDate": visibleColumns?.Date,
    "ip": visibleColumns?.IP
  };


  return (
    <PageWrapper>
      <Card>
        <ActionBar>
          <div></div>
          <ActionGroup>
            <FilterComponent
              onSubmit={handleFilterSubmit}
              onClear={clearFilter}
              columnName={APPROVE_COLUMNS}
              bindTableData={(data) => bindTableData(data, "excel")}
              handleExcelClick={handleExcelClick}
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
              pageName="otrlist"
              loading={isLoading || isFetchingMore}
              validExportDataKey={validExportDataKey}
            />
          </ActionGroup>
        </ActionBar>
        {bindTableData(otrLists)}
      </Card>

    </PageWrapper>
  );
};

export default OTRList;
