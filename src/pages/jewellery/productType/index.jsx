import React, { useCallback, useState, useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { deleteCategoryDetail, getCategoryDetail, saveUpdateCategoryDetail } from "../../../ApiServices/services";
import { toastFn } from "@/utils";
import SortableTable from "../../../common/components/sortTable";
import CommonModal from "../../../common/components/modal";
import { deleteModal } from "../../../common/components/modal/deleteModal";
import ImagePreviewModal from "../ImageWithLoader";
import { setProductTypes } from "../../../redux/slices/jewellerySlice";
import useInfiniteScroll from "../../../common/hooks/useInfiniteScroll";
import AddProductTypeBody from "./AddProductTypeBody";
import styled from "styled-components";
import {
  PageWrapper,
  Card,
  ActionBar,
  ActionGroup,
  PageTitle,
  SectionLabel,
  PrimaryButton,
  IconButton,
  SecondaryButton,
  CellText,
  fluidType,
} from "../../../common/styledComponents";

// ─────────────────────────────────────────────────────────────────────────────
// Constants (logic untouched)
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_OBJ = { name: "", file: "", level: "1" };
const POPUP_OBJ = { showPopup: false, modalTitle: null, modelClass: "", isEdit: false };
const APPROVE_COL = ["Type", "Image", "Edit", "Delete"];
const REQUEST = { level: "1" };

// ─────────────────────────────────────────────────────────────────────────────
// Local styled components
// ─────────────────────────────────────────────────────────────────────────────

const ViewImgBtn = styled(SecondaryButton)`
  padding: 5px 12px;
  font-size: ${({ theme }) => theme.font.sizeXs};
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const ProductType = () => {
  // visibleColumns: column drag disabled, all cols shown
  const visibleColumns = useMemo(() => ({
    Type: true, Image: true, Edit: true, Delete: true,
  }), []);
  const { contentRef } = useOutletContext() || {};

  const [imageModal, setImageModal] = useState({ open: false, url: "" });

  const {
    data: productTypeLists,
    isLoading,
    isFetchingMore,
    hasMore,
    setData,
    setReset,
  } = useInfiniteScroll(getCategoryDetail, REQUEST, 40, contentRef);

  const [newProductType, setNewProductType] = useState({ ...TYPE_OBJ });
  const [popUp, setPopUp] = useState({ ...POPUP_OBJ });
  const [disableButton, setIsDisableButton] = useState(false);

  const dispatch = useDispatch();
  const productTypes = useSelector((s) => s.jewellery.productTypes, shallowEqual);

  // ── Handlers (logic untouched) ──────────────────────────────────────────

  const openModal = () => {
    setPopUp({ showPopup: true, modelClass: "" });
    setNewProductType({ ...TYPE_OBJ });
  };

  const handleChange = ({ target }) => {
    const { name, value, type, files } = target;
    setNewProductType((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProductType?.name) {
      toastFn("error", "Please Enter Product Type Name");
      return;
    }
    const formData = new FormData();
    if (popUp?.isEdit) {
      formData.append("id", newProductType.id);
      if (newProductType.file) {
        formData.append("file", newProductType.file);
      } else {
        newProductType?.url && formData.append("url", newProductType.url);
      }
    } else {
      newProductType?.file && formData.append("file", newProductType.file);
    }
    formData.append("name", newProductType.name);
    formData.append("level", newProductType.level);

    if (!disableButton) {
      setIsDisableButton(true);
      try {
        const result = await saveUpdateCategoryDetail(formData, undefined, "formData");
        if (result?.success) {
          toastFn("success", result?.message || "Add Successfully");
          setPopUp({ ...POPUP_OBJ });
          setNewProductType({ ...TYPE_OBJ });
          setReset(true);
        } else {
          toastFn("error", result?.message || "Failed to add");
        }
      } catch (error) {
        toastFn("error", error.message || "Something went wrong");
      } finally {
        setPopUp({ ...POPUP_OBJ });
        setIsDisableButton(false);
      }
    }
  };

  const fetchTypeDetailsByID = async (editID) => {
    try {
      const result = await getCategoryDetail({ id: editID });
      if (!result?.success) {
        toastFn("error", result?.message || "Something went wrong!!!");
        return;
      }
      const { success, data } = result;
      if (success && data) {
        setNewProductType({ id: data.id, name: data.name, level: "1", url: data.url });
        setPopUp({ showPopup: true, modelClass: "", isEdit: true });
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const handleDelete = useCallback((id) => {
    deleteModal({
      onConfirm: async () => {
        try {
          const result = await deleteCategoryDetail({ id });
          if (result?.success) {
            toastFn("success", result?.message || "Deleted successfully");
            setData((prev) => prev.filter((item) => item.id !== id));
          } else {
            toastFn("error", result?.message || "Failed to delete");
          }
        } catch (error) {
          toastFn("error", error.message || "Something went wrong");
        }
      },
    });
  }, [setData]);

  useEffect(() => {
    if (productTypes.length > 0) return;
    dispatch(setProductTypes(productTypeLists));
  }, [productTypeLists, productTypes, dispatch]);

  // ── Column renderer ──────────────────────────────────────────────────────

  const columnRender = useCallback((col, row) => {
    switch (col) {
      case "Type":
        return <CellText>{row?.name}</CellText>;

      case "Image":
        return (
          <ViewImgBtn onClick={() => setImageModal({ open: true, url: row?.url || "" })}>
            View
          </ViewImgBtn>
        );

      case "Edit":
        return (
          <IconButton
            $color="#2979FF"
            $hoverColor="#2979FF"
            $hoverBg="rgba(41,121,255,0.1)"
            onClick={() => fetchTypeDetailsByID(row?.id)}
            title="Edit"
          >
            <i className="fa fa-pencil-square-o" aria-hidden="true" />
          </IconButton>
        );

      case "Delete":
        return (
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
  }, [handleDelete]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <PageWrapper>
      <Card>
        {/* Toolbar */}
        <ActionBar>
          <ActionGroup>
            <PrimaryButton onClick={openModal}>
              + Add Product Type
            </PrimaryButton>
          </ActionGroup>
        </ActionBar>

        {/* Table */}
          <SortableTable
            data={productTypeLists}
            columnOrder={APPROVE_COL}
            visibleColumns={visibleColumns}
            isLoading={isLoading}
            isFetchingMore={isFetchingMore}
            hasMore={hasMore}
            enableColumnDrag={false}
            columnRender={columnRender}
          />
      </Card>

      {/* Add / Edit modal */}
      {popUp?.showPopup && (
        <CommonModal
          show={popUp.showPopup}
          title={popUp.isEdit ? "Edit Type" : "Add Type"}
          onClose={() => setPopUp(POPUP_OBJ)}
          className={popUp.modelClass}
        >
          <AddProductTypeBody
            newProductType={newProductType}
            popUp={popUp}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            disableButton={disableButton}
          />
        </CommonModal>
      )}

      {/* Image preview */}
      <ImagePreviewModal
        open={imageModal.open}
        src={imageModal.url}
        title="View Image"
        onClose={() => setImageModal({ open: false, url: "" })}
      />
    </PageWrapper>
  );
};

export default ProductType;