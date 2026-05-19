import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInfiniteScroll from "../../../common/hooks/useInfiniteScroll";
import { deleteCategoryDetail, getCategoryDetail, saveUpdateCategoryDetail } from "../../../ApiServices/services";
import { toastFn } from "@/utils";
import SortableTable from "../../../common/components/sortTable";
import CommonModal from "../../../common/components/modal";
import { deleteModal } from "../../../common/components/modal/deleteModal";
import ImagePreviewModal from "../ImageWithLoader";
import { setCategoryTypes, setProductTypes } from "../../../redux/slices/jewellerySlice";
import AddCategoryBody from "./AddCategoryBody";
import styled from "styled-components";
import {
  PageWrapper,
  Card,
  ActionBar,
  ActionGroup,
  PageTitle,
  SectionLabel,
  PrimaryButton,
  SecondaryButton,
  IconButton,
  CellText,
  CardScrollBody,
} from "../../../common/styledComponents";
import { ScrollCard } from "../../update";

// ─────────────────────────────────────────────────────────────────────────────
// Constants (logic untouched)
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_OBJ = { parentId: "", name: "", file: "", level: "2" };
const TYPES_OBJ = { typeId: "", typeName: "" };
const POPUP_OBJ = { showPopup: false, modalTitle: null, modelClass: "", isEdit: false };
const COLUMN_ORDER = ["Type", "Category", "Image", "Edit", "Delete"];
const REQUEST = { level: "2" };

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

const Category = () => {
  const visibleColumns = useMemo(() => ({
    Type: true, Category: true, Image: true, Edit: true, Delete: true,
  }), []);
  const scrollRef = React.useRef(null);

  const {
    data: categoryLists,
    isLoading,
    isFetchingMore,
    hasMore,
    setData,
    setReset,
  } = useInfiniteScroll(getCategoryDetail, REQUEST, 40,scrollRef);

  const { productTypes } = useSelector((state) => state.jewellery);
  const dispatch = useDispatch();

  const [newCategory, setNewCategory] = useState({ ...CATEGORY_OBJ });
  const [popUp, setPopUp] = useState({ ...POPUP_OBJ });
  const [disableButton, setIsDisableButton] = useState(false);
  const [hierarchy, setHierarchy] = useState({ ...TYPES_OBJ });
  const [imageModal, setImageModal] = useState({ open: false, url: "" });

  // ── Handlers (logic untouched) ──────────────────────────────────────────

  const openModal = () => {
    setPopUp({ showPopup: true, modelClass: "" });
    setNewCategory({ ...CATEGORY_OBJ });
  };

  const closeModal = () => {
    setPopUp({ ...POPUP_OBJ });
    setNewCategory({ ...CATEGORY_OBJ });
    setHierarchy({ ...TYPES_OBJ });
  };

  const handleChange = ({ target }) => {
    const { name, value, type, files } = target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.parentId) {
      toastFn("error", "Please select Product Type");
      return;
    }
    if (!newCategory.name || !newCategory.name.trim()) {
      toastFn("error", "Category name is required");
      return;
    }

    const formData = new FormData();
    if (popUp?.isEdit) {
      formData.append("id", newCategory.id);
      if (newCategory.file) {
        formData.append("file", newCategory.file);
      } else {
        newCategory?.url && formData.append("url", newCategory.url);
      }
    } else {
      newCategory?.file && formData.append("file", newCategory.file);
    }
    formData.append("parentId", newCategory.parentId);
    formData.append("name", newCategory.name);
    formData.append("level", newCategory.level || "2");

    if (disableButton) return;
    setIsDisableButton(true);
    try {
      const result = await saveUpdateCategoryDetail(formData, undefined, "formData");
      if (result?.success) {
        toastFn("success", result?.message || "Add Successfully");
        setReset(true);
      } else {
        toastFn("error", result?.message || "Failed to add");
      }
    } catch (error) {
      toastFn("error", error.message || "Something went wrong");
    } finally {
      closeModal();
      setIsDisableButton(false);
    }
  };

  const fetchCategoryDetailsByID = async (editID) => {
    try {
      const result = await getCategoryDetail({ id: editID });
      if (!result?.success) {
        toastFn("error", result?.message || "Something went wrong!!!");
        return;
      }
      const { success, data } = result;
      if (success && data) {
        setHierarchy({ typeId: data.typeId, typeName: data.type });
        setNewCategory({ ...data, parentId: data.typeId });
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
  }, []);

  useEffect(() => {
    if (productTypes?.length) return;
    getCategoryDetail({ level: "1" }).then((res) => {
      if (res?.success) dispatch(setProductTypes(res.data || []));
    });
  }, [productTypes]);

  useEffect(() => {
    dispatch(setCategoryTypes(categoryLists));
  }, [categoryLists]);

  // ── Column renderer ──────────────────────────────────────────────────────

  const columnRender = useCallback((col, row) => {
    switch (col) {
      case "Type":
        return <CellText>{row.Type}</CellText>;

      case "Category":
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
            onClick={() => fetchCategoryDetailsByID(row?.id)}
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
      <ScrollCard>
        <ActionBar>
          <ActionGroup>
            <PrimaryButton onClick={openModal}>
              + Add Category
            </PrimaryButton>
          </ActionGroup>
        </ActionBar>
        <CardScrollBody ref={scrollRef}>
          <SortableTable
            data={categoryLists}
            columnOrder={COLUMN_ORDER}
            visibleColumns={visibleColumns}
            isLoading={isLoading}
            isFetchingMore={isFetchingMore}
            hasMore={hasMore}
            enableColumnDrag={false}
            columnRender={columnRender}
          />
        </CardScrollBody>
      </ScrollCard>

      {popUp?.showPopup && (
        <CommonModal
          show={popUp.showPopup}
          title={popUp.isEdit ? "Edit Category" : "Add Category"}
          onClose={closeModal}
          className={popUp.modelClass}
        >
          <AddCategoryBody
            newCategory={newCategory}
            popUp={popUp}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            disableButton={disableButton}
            hierarchy={hierarchy}
            setHierarchy={setHierarchy}
            setNewCategory={setNewCategory}
          />
        </CommonModal>
      )}

      <ImagePreviewModal
        open={imageModal.open}
        src={imageModal.url}
        title="View Image"
        onClose={() => setImageModal({ open: false, url: "" })}
      />
    </PageWrapper>
  );
};

export default Category;