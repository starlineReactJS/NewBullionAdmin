import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import CommonModal from "../../common/components/modal";
import { toastFn } from "@/utils";
import FilterComponent from "../../common/components/filterCom";
import { setExcelData } from "../../redux/slices/excelSlice";
import useColumnManager from "../../common/hooks/useColumnManager";
import SortableTable from "../../common/components/sortTable";
import {
  deleteUpdateDetail,
  getUpdateDetails,
  saveUpdateDetail,
} from "../../ApiServices/services";
import useInfiniteScroll from "../../common/hooks/useInfiniteScroll";
import { deleteModal } from "../../common/components/modal/deleteModal";
import { CommonForm } from "../../common/components/form";
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


// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_UPDATE = { title: "", message: "", description: "" };
const APPROVE_COLUMNS = ["Date", "Title", "Message", "Description", "Resend", "Delete"];

const trimObjectValues = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
  );

const Update = () => {
  const { contentRef } = useOutletContext() || {};
  const {
    columnOrder, visibleColumns, setVisibleColumns,
    activeId, setActiveId, handleDragEnd,
  } = useColumnManager("update", APPROVE_COLUMNS);

  const [request, setRequest] = useState({});
  const {
    data: updateLists, isLoading, isFetchingMore,
    hasMore, setData, setReset,
  } = useInfiniteScroll(getUpdateDetails, request, 40, contentRef);

  const [newUpdate, setNewUpdate] = useState({ ...INITIAL_UPDATE });
  const [showModal, setShowModal] = useState(false);
  const [disableButton, setIsDisableButton] = useState(false);
  const [excelModelLoading, setIsExcelModelLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const openModal = () => {
    setShowModal(true);
    setNewUpdate({ ...INITIAL_UPDATE });
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewUpdate((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleFilterSubmit = useCallback(({ searchText, dates }) => {
    setRequest({
      offset: 0,
      limit: 40,
      ...(dates?.length === 2 && {
        dateRange: dates.map((d) => d.format("DD-MM-YYYY")).join("|"),
      }),
      ...(searchText && { search: searchText }),
    });
  }, []);

  const handleExcelClick = useCallback(async () => {
    dispatch(setExcelData([]));
    try {
      setIsExcelModelLoading(true);
      const response = await getUpdateDetails();
      if (response?.success && response?.data) {
        dispatch(setExcelData(response.data));
      }
    } catch (error) {
      console.error("error:", error);
    } finally {
      setIsExcelModelLoading(false);
    }
  }, [dispatch]);

  const clearFilter = useCallback(() => setRequest({}), []);

  const validate = useCallback(() => {
    const error = {};
    if (!newUpdate.title.trim()) error.title = "Please enter title";
    if (!newUpdate.message.trim()) error.message = "Please enter message";
    if (!newUpdate.description.trim()) error.description = "Please enter description";
    setErrors(error);
    return Object.keys(error).length > 0;
  }, [newUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) return;
    setIsDisableButton(true);
    try {
      const result = await saveUpdateDetail(trimObjectValues(newUpdate));
      if (result?.success) {
        toastFn("success", result?.message || "New update created");
        setShowModal(false);
        setNewUpdate({ ...INITIAL_UPDATE });
        setReset(true);
      } else {
        toastFn("error", result?.message || "Failed to create new update");
      }
    } catch (error) {
      toastFn("error", error.message || "Something went wrong");
    } finally {
      setShowModal(false);
      setIsDisableButton(false);
    }
  };

  const handleResend = useCallback(async (data) => {
    try {
      const result = await saveUpdateDetail(data);
      if (result?.success) {
        toastFn("success", "Resent update successfully");
      } else {
        toastFn("error", "Failed to resend");
      }
    } catch (error) {
      toastFn("error", error.message);
    }
  }, []);

  const handleDelete = useCallback((id) => {
    deleteModal({
      onConfirm: async () => {
        try {
          const result = await deleteUpdateDetail({ id });
          if (result?.success) {
            toastFn("success", result?.message || "Update deleted successfully");
            setData((prev) => prev.filter((item) => item.id !== id));
          } else {
            toastFn("error", result?.message || "Failed to delete update");
          }
        } catch (error) {
          toastFn("error", error.message || "Something went wrong!");
        }
      },
    });
  }, [setData]);

  const columnRender = useCallback((col, row, mode = "") => {
    switch (col) {
      case "Date":
        return <DateText>{dayjs(row?.modifiedDate).format("MM/DD/YYYY hh:mm:ss A")}</DateText>;
      case "Title":
        return <CellText>{row?.title}</CellText>;
      case "Message":
        return <CellText>{row?.message}</CellText>;
      case "Description":
        return <CellText>{row?.description}</CellText>;
      case "Resend":
        return mode !== "excel" && (
          <IconButton
            $color="#00C48C"
            $hoverColor="#00C48C"
            $hoverBg="rgba(0,196,140,0.1)"
            onClick={() => handleResend(row)}
            title="Resend"
          >
            <i className="fa fa-paper-plane" aria-hidden="true" />
          </IconButton>
        );
      case "Delete":
        return mode !== "excel" && (
          <IconButton
            $color="#F44336"
            $hoverColor="#F44336"
            $hoverBg="rgba(244,67,54,0.1)"
            onClick={() => handleDelete(row?.id)}
            title="Delete"
          >
            <i className="fa fa-trash-o" aria-hidden="true" />
          </IconButton>
        );
      default:
        return null;
    }
  }, [handleResend, handleDelete]);

  const renderTable = useCallback((data, mode = "") => (
    <SortableTable
      data={data}
      columnOrder={columnOrder}
      visibleColumns={visibleColumns}
      activeId={activeId}
      setActiveId={setActiveId}
      handleDragEnd={handleDragEnd}
      mode={mode}
      isLoading={mode === "excel" ? excelModelLoading : isLoading}
      isFetchingMore={isFetchingMore}
      hasMore={hasMore}
      columnRender={(col, row) => columnRender(col, row, mode)}
    />
  ), [
    columnOrder, visibleColumns, activeId, setActiveId, handleDragEnd,
    excelModelLoading, isLoading, isFetchingMore, hasMore, columnRender,
  ]);

  const validExportData = useMemo(() => ({
    message: visibleColumns?.Message,
    title: visibleColumns?.Title,
    description: visibleColumns?.Description,
    modifiedDate: visibleColumns?.Date,
  }), [visibleColumns]);

  return (
    <PageWrapper>
      <Card>
        <ActionBar>
          <div>
            {/* <PageTitle>Updates</PageTitle>
            <SectionLabel>Manage &amp; broadcast system updates</SectionLabel> */}
            <PrimaryButton onClick={openModal}>
              + Add Update
            </PrimaryButton>
          </div>

          <ActionGroup>
            <FilterComponent
              onSubmit={handleFilterSubmit}
              onClear={clearFilter}
              columnName={APPROVE_COLUMNS}
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
              bindTableData={(data) => renderTable(data, "excel")}
              handleExcelClick={handleExcelClick}
              pageName="update"
              loading={isLoading || isFetchingMore}
              validExportDataKey={validExportData}
            />
          </ActionGroup>
        </ActionBar>
        {/* ── Toolbar ── */}

        {/* ── Table ── */}
        {renderTable(updateLists)}
      </Card>

      {/* ── Add Update Modal ── */}
      {showModal && (
        <CommonModal
          show={showModal}
          title="Add Update"
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit}>
            <FormTable>
              <FormTableBody >
                <CommonForm.Text
                  label="Title"
                  name="title"
                  value={newUpdate.title}
                  onChange={handleChange}
                  error={errors.title}
                />
                <CommonForm.Text
                  label="Short Description"
                  name="message"
                  value={newUpdate.message}
                  onChange={handleChange}
                  error={errors.message}
                />
                <CommonForm.TextArea
                  label="Description"
                  name="description"
                  value={newUpdate.description}
                  onChange={handleChange}
                  error={errors.description}
                />
              </FormTableBody>
            </FormTable>

            <ModalFooter>
              <PrimaryButton type="submit" disabled={disableButton}>
                {disableButton ? "Submitting…" : "Submit"}
              </PrimaryButton>
            </ModalFooter>
          </form>
        </CommonModal>
      )}
    </PageWrapper>
  );
};

export default Update;