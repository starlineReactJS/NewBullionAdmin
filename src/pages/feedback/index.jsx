import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import FilterComponent from "../../common/components/filterCom";
import { toastFn } from '@/utils';
import { setExcelData } from "../../redux/slices/excelSlice";
import SortableTable from "../../common/components/sortTable";
import useColumnManager from "../../common/hooks/useColumnManager";
import { deleteFeedbackDetail, getFeedbackDetails } from "../../ApiServices/services";
import useInfiniteScroll from "../../common/hooks/useInfiniteScroll";
import { deleteModal } from "../../common/components/modal/deleteModal";
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
  FormTable
} from "../../common/styledComponents";


const APPROVE_COLUMNS = ["Name", "Mobile", "Email", "Message", "Subject", "Delete"];
const FeedbackList = () => {
  const dispatch = useDispatch();
  const {
    columnOrder,
    visibleColumns,
    setVisibleColumns,
    activeId,
    setActiveId,
    handleDragEnd
  } = useColumnManager("feedback", APPROVE_COLUMNS);

  const [request, setRequest] = useState({});
  const [excelModelLoading, setIsExcelModelLoading] = useState(false);
  const { data: feedbackLists, isLoading, isFetchingMore, hasMore, setData, reset } =
    useInfiniteScroll(getFeedbackDetails, request, 40);

  const handleDelete = useCallback((id) => {
    deleteModal({
      onConfirm: async () => {
        try {
          const body = { id };
          const result = await deleteFeedbackDetail(body);

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

  const handleFilterSubmit = useCallback(({ searchText, dates }) => {
    setRequest({
      offset: 0,
      limit: 40,
      ...(dates?.length === 2 && { dateRange: dates.map(d => d.format("DD-MM-YYYY")).join("|") }),
      ...(searchText && { search: searchText }),
    });
  }, []);
  const clearFilter = useCallback(() => setRequest({}), []);

  const handleExcelClick = useCallback(async () => {
    dispatch(setExcelData([]));
    try {
      setIsExcelModelLoading(true);
      const response = await getFeedbackDetails();
      if (response?.success && response?.data) {
        dispatch(setExcelData(response?.data));
      }
    } catch (error) {
      console.error("error:", error);
    } finally {
      setIsExcelModelLoading(false);
    }
  }, [dispatch]);

  const columnRender = useCallback((col, row, mode = "") => {
    switch (col) {
      case "Name":
        return <CellText>{row?.name}</CellText>;

      case "Mobile":
        return <CellText>{row?.mobile}</CellText>;

      case "Email":
        return <CellText>{row?.email}</CellText>;

      case "Message":
        return <CellText>{row?.message}</CellText>;

      case "Subject":
        return <CellText>{row?.subject}</CellText>;

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
      isLoading={mode === 'excel' ? excelModelLoading : isLoading}
      isFetchingMore={isFetchingMore}
      hasMore={hasMore}
      mode={mode}
      columnRender={(col, row) => columnRender(col, row, mode)}
    />
  ), [columnOrder, visibleColumns, activeId, setActiveId, handleDragEnd,
    excelModelLoading, isLoading, isFetchingMore, hasMore, columnRender]);

  const validExportData = {
    "name": visibleColumns?.Name,
    "mobile": visibleColumns?.Mobile,
    "email": visibleColumns?.Email,
    "subject": visibleColumns?.Subject,
    "message": visibleColumns?.Message,
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
              pageName="feedback"
              loading={isLoading || isFetchingMore}
              validExportDataKey={validExportData}
            />
          </ActionGroup>
        </ActionBar>
        {/* ── Toolbar ── */}

        {/* ── Table ── */}
        {bindTableData(feedbackLists)}
      </Card>

    </PageWrapper>
  );
};

export default FeedbackList;
