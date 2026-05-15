import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import useInfiniteScroll from "../../../common/hooks/useInfiniteScroll";
import { deleteCategoryDetail, getCategoryDetail, saveUpdateCategoryDetail } from "../../../ApiServices/services";
import { toastFn } from "@/utils";
import SortableTable from "../../../common/components/sortTable";
import CommonModal from "../../../common/components/modal";
import { deleteModal } from "../../../common/components/modal/deleteModal";
import ImagePreviewModal from "../ImageWithLoader";
import { setProductTypes } from "../../../redux/slices/jewellerySlice";
import AddSubCategoryBody from "./AddSubCategoryBody";
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
} from "../../../common/styledComponents";

// ─────────────────────────────────────────────────────────────────────────────
// Constants (logic untouched)
// ─────────────────────────────────────────────────────────────────────────────

const SUB_CATEGORY_OBJ = { productTypeId: "", categoryTypeId: "", name: "", file: "", level: "3" };
const POPUP_OBJ        = { showPopup: false, modalTitle: null, modelClass: "", isEdit: false };
const TYPE_OBJ         = { typeId: "", typeName: "", categoryTypeName: "", categoryTypeId: "" };
const COLUMN_ORDER     = ["Type", "Category", "SubCategory", "Image", "Edit", "Delete"];
const REQUEST          = { level: "3" };

const ViewImgBtn = styled(SecondaryButton)`
  padding: 5px 12px;
  font-size: ${({ theme }) => theme.font.sizeXs};
`;
const SubCategory = () => {
  const visibleColumns = useMemo(() => ({
    Type: true, Category: true, SubCategory: true, Image: true, Edit: true, Delete: true,
  }), []);

  const dispatch = useDispatch();

  const { data: subCategoryLists, isLoading, setData, setReset } =
    useInfiniteScroll(getCategoryDetail, REQUEST, 40);

  const [newSubCategory, setNewSubCategory] = useState({ ...SUB_CATEGORY_OBJ });
  const [popUp,          setPopUp]          = useState({ ...POPUP_OBJ });
  const [disableButton,  setIsDisableButton] = useState(false);
  const [hierarchy,      setHierarchy]      = useState({ ...TYPE_OBJ });
  const [imageModal,     setImageModal]     = useState({ open: false, url: "" });

  // ── Handlers (logic untouched) ──────────────────────────────────────────

  const openModal = () => {
    setPopUp({ showPopup: true, modelClass: "" });
    setNewSubCategory({ ...SUB_CATEGORY_OBJ });
  };

  const closeModal = () => {
    setPopUp({ ...POPUP_OBJ });
    setNewSubCategory({ ...SUB_CATEGORY_OBJ });
    setHierarchy({ ...TYPE_OBJ });
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setNewSubCategory((prev) => ({ ...prev, file: files[0] }));
      return;
    }
    setNewSubCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSubCategory.categoryTypeId) {
      toastFn("error", "Please select category type");
      return;
    }
    if (!newSubCategory.name || !newSubCategory.name.trim()) {
      toastFn("error", "Sub category name is required");
      return;
    }

    const formData = new FormData();
    if (popUp?.isEdit) {
      formData.append("id", newSubCategory.id);
      if (newSubCategory.file) {
        formData.append("file", newSubCategory.file);
      } else {
        newSubCategory?.url && formData.append("url", newSubCategory.url);
      }
    } else {
      newSubCategory?.file && formData.append("file", newSubCategory.file);
    }
    formData.append("parentId", newSubCategory.categoryTypeId);
    formData.append("name", newSubCategory.name);
    formData.append("level", newSubCategory.level || "3");

    if (disableButton) return;
    setIsDisableButton(true);
    try {
      const result = await saveUpdateCategoryDetail(formData, undefined, "formData");
      if (result?.success) {
        toastFn("success", result.message);
        setNewSubCategory({ ...SUB_CATEGORY_OBJ });
        setReset(true);
      } else {
        toastFn("error", result.message);
      }
    } catch (err) {
      toastFn("error", err.message);
    } finally {
      setPopUp({ ...POPUP_OBJ });
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
        setHierarchy({
          typeId: data?.typeId,
          typeName: data.type,
          categoryTypeName: data.cat,
          categoryTypeId: data?.catId,
        });
        setNewSubCategory({ ...data, categoryTypeId: data?.catId });
        setPopUp({ showPopup: true, modelClass: "", isEdit: true });
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const handleDelete = useCallback((id) => {
    deleteModal({
      onConfirm: async () => {
        const result = await deleteCategoryDetail({ id });
        if (result?.success) {
          toastFn("success", result.message);
          setData((prev) => prev.filter((item) => item.id !== id));
        }
      },
    });
  }, [setData]);

  useEffect(() => {
    getCategoryDetail({ level: "1" }).then((res) => {
      if (res?.success) dispatch(setProductTypes(res.data || []));
    });
  }, []);

  // ── Column renderer ──────────────────────────────────────────────────────

  const columnRender = useCallback((col, row) => {
    switch (col) {
      case "Type":        return <CellText>{row.Type}</CellText>;
      case "Category":    return <CellText>{row.Cat}</CellText>;
      case "SubCategory": return <CellText>{row.name}</CellText>;

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
            onClick={() => handleDelete(row.id)}
            title="Delete"
          >
            <i className="fa fa-trash-o" aria-hidden="true" />
          </IconButton>
        );

      default: return null;
    }
  }, [handleDelete]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <PageWrapper>
      <Card>
        <ActionBar>
          <ActionGroup>
            <PrimaryButton onClick={openModal}>+ Add Sub Category</PrimaryButton>
          </ActionGroup>
        </ActionBar>

        <SortableTable
          data={subCategoryLists}
          columnOrder={COLUMN_ORDER}
          visibleColumns={visibleColumns}
          isLoading={isLoading}
          enableColumnDrag={false}
          columnRender={columnRender}
        />
      </Card>

      {popUp?.showPopup && (
        <CommonModal
          show={popUp.showPopup}
          title={popUp.isEdit ? "Edit Sub Category" : "Add Sub Category"}
          onClose={closeModal}
          className={popUp.modelClass}
        >
          <AddSubCategoryBody
            handleSubmit={handleSubmit}
            hierarchy={hierarchy}
            setHierarchy={setHierarchy}
            popUp={popUp}
            setNewSubCategory={setNewSubCategory}
            newSubCategory={newSubCategory}
            handleChange={handleChange}
            disableButton={disableButton}
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

export default SubCategory;