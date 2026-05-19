import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import useColumnManager from "../../../common/hooks/useColumnManager";
import useInfiniteScroll from "../../../common/hooks/useInfiniteScroll";
import { deleteProductDetail, getCategoryDetail, getProductDetail, saveUpdateProductDetail } from "../../../ApiServices/services";
import { flattenPermissions, toastFn } from "@/utils";
import SortableTable from "../../../common/components/sortTable";
import CommonModal from "../../../common/components/modal";
import { setCategoryTypes, setProductTypes, setSubCategoryTypes } from "../../../redux/slices/jewellerySlice";
import ImagePreviewModal from "../ImageWithLoader";
import { useAuth } from "../../../context/AuthContext";
import { deleteModal } from "../../../common/components/modal/deleteModal";
import FilterComponent from "../../../common/components/filterCom";
import { setExcelData } from "../../../redux/slices/excelSlice";
import AddProductBody from "./AddProductBody";
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

const PRODUCT_OBJ = {
    isDisplay: false, productTypeId: "", categoryTypeId: "", subCategoryId: "",
    name: "", description: "", file: "", productImage: [],
    specification: { purity: "", price: "" },
};
const POPUP_OBJ = { showPopup: false, modalTitle: null, modelClass: "", isEdit: false };
const TYPE_OBJ = { typeId: "", typeName: "", categoryTypeName: "", categoryTypeId: "", subCategoryTypeName: "", subCategoryId: "" };
const APPROVE_COL = ["Type", "Category", "Sub Category", "Product", "Image", "Edit", "Delete"];

// ─────────────────────────────────────────────────────────────────────────────
// Local styled components
// ─────────────────────────────────────────────────────────────────────────────

const ViewImgBtn = styled(SecondaryButton)`
  padding: 5px 12px;
  font-size: ${({ theme }) => theme.font.sizeMd};
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const Product = () => {
    const scrollRef = React.useRef(null);
    const dispatch = useDispatch();
    const { auth: { permissions: userPermissions } } = useAuth();
    const permissions = flattenPermissions(userPermissions);

    const pagePermissions = {
        type: !!permissions.type,
        category: !!permissions.category,
        subCategory: !!permissions.subcat,
        product: true,
    };

    const filteredColumns = useMemo(() => {
        return APPROVE_COL.filter((col) => {
            switch (col) {
                case "Type": return pagePermissions.type;
                case "Category": return pagePermissions.category;
                case "Sub Category": return pagePermissions.subCategory;
                default: return true;
            }
        });
    }, [pagePermissions]);

    const [request, setRequest] = useState({});
    const { columnOrder, visibleColumns, setVisibleColumns, activeId, setActiveId, handleDragEnd } =
        useColumnManager("product", APPROVE_COL);
    const { data: productLists, isLoading, setData, setReset } =
        useInfiniteScroll(getProductDetail, request, 40,scrollRef);

    const [newProduct, setNewProduct] = useState({ ...PRODUCT_OBJ });
    const [popUp, setPopUp] = useState({ ...POPUP_OBJ });
    const [disableButton, setIsDisableButton] = useState(false);
    const [hierarchy, setHierarchy] = useState({ ...TYPE_OBJ });
    const [imageModal, setImageModal] = useState({ open: false, url: "" });
    const [excelModelLoading, setIsExcelModelLoading] = useState(false);

    // ── Modal helpers ────────────────────────────────────────────────────────

    const openModal = () => {
        setPopUp({ showPopup: true, modelClass: "modal-xl" });
        setNewProduct({ ...PRODUCT_OBJ });
    };

    const closeModal = () => {
        setPopUp({ ...POPUP_OBJ });
        setNewProduct({ ...PRODUCT_OBJ });
        setHierarchy({ ...TYPE_OBJ });
    };

    // ── Image helpers (logic untouched) ─────────────────────────────────────

    const addImageRow = () => {
        setNewProduct((prev) => ({
            ...prev,
            productImage: [...prev.productImage, { id: null, url: null, file: null }],
        }));
    };

    const removeImageRow = (index) => {
        setNewProduct((prev) => ({
            ...prev,
            productImage: prev.productImage.filter((_, i) => i !== index),
        }));
    };

    const handleImageChange = (index, file) => {
        setNewProduct((prev) => {
            const images = [...prev.productImage];
            images[index] = { ...images[index], file };
            return { ...prev, productImage: images };
        });
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setNewProduct((prev) => ({ ...prev, file: files[0] }));
            return;
        }
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    // ── Data loading ─────────────────────────────────────────────────────────

    useEffect(() => {
        async function loadHierarchy() {
            if (pagePermissions.type) {
                const res = await getCategoryDetail({ level: "1" });
                if (res?.success) dispatch(setProductTypes(res.data));
            }
            if (pagePermissions.category) {
                const res = await getCategoryDetail({ level: "2" });
                if (res?.success) dispatch(setCategoryTypes(res.data));
            }
            if (pagePermissions.subCategory) {
                const res = await getCategoryDetail({ level: "3" });
                if (res?.success) dispatch(setSubCategoryTypes(res.data));
            }
        }
        loadHierarchy();
    }, []);

    const fetchProductDetailsByID = async (editID) => {
        try {
            const result = await getProductDetail({ id: editID });
            if (!result?.success) {
                toastFn("error", result?.message || "Something went wrong!!!");
                return;
            }
            const { success, data } = result;
            if (success && data) {
                setHierarchy({
                    typeId: data?.typeId, typeName: data.type,
                    categoryTypeName: data.cat, categoryTypeId: data.catId,
                    subCategoryTypeName: data?.subCat, subCategoryId: data.subCatId,
                });
                setNewProduct({
                    ...data,
                    productImage: (data?.images || []).map((img) => ({ id: img.id, url: img.url, file: null })),
                    typeId: data?.typeId, typeName: data.type,
                    categoryTypeName: data.cat, categoryTypeId: data.catId,
                    subCategoryTypeName: data?.subCat, subCategoryId: data.subCatId,
                });
                setPopUp({ showPopup: true, modelClass: "modal-xl", isEdit: true });
            }
        } catch (error) {
            console.error("Fetch failed:", error);
        }
    };

    const handleDelete = useCallback((id) => {
        deleteModal({
            onConfirm: async () => {
                try {
                    const result = await deleteProductDetail({ id });
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

    // ── Submit (logic untouched) ─────────────────────────────────────────────

    const hasHierarchyPermission = pagePermissions.type || pagePermissions.category || pagePermissions.subCategory;

    const getParentIdFromPermissions = (perms, product) => {
        if (!perms.type && !perms.category && !perms.subCategory) return null;
        if (perms.subCategory && product.subCategoryId) return product.subCategoryId;
        if (perms.category && product.categoryTypeId) return product.categoryTypeId;
        if (perms.type && product.productTypeId) return product.productTypeId;
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const parentId = getParentIdFromPermissions(pagePermissions, newProduct);

        if (hasHierarchyPermission && !parentId) {
            return toastFn("error", "Please select product's parent value");
        }
        if (parentId) formData.append("parentId", parentId);

        formData.append("name", newProduct.name);
        formData.append("description", newProduct.description);
        formData.append("isDisplay", String(!!newProduct.isDisplay));

        if (popUp?.isEdit) {
            formData.append("id", newProduct.id);
            if (newProduct.file) {
                formData.append("file", newProduct.file);
            } else {
                newProduct?.url && formData.append("url", newProduct.url);
            }
        } else {
            newProduct?.file && formData.append("file", newProduct.file);
        }

        newProduct.productImage.forEach((img, index) => {
            if (img.id && !img.file) {
                formData.append(`productImage[${index}].id`, img.id);
                formData.append(`productImage[${index}].url`, img.url);
            }
            if (img.file) {
                formData.append(`productImage[${index}].id`, img.id ?? 0);
                formData.append(`productImage[${index}].file`, img.file);
            }
        });

        formData.append("specification", JSON.stringify(newProduct.specification));

        if (disableButton) return;
        setIsDisableButton(true);
        try {
            const result = await saveUpdateProductDetail(formData, undefined, "formData");
            if (result?.success) {
                toastFn("success", result.message);
                setPopUp(POPUP_OBJ);
                setNewProduct(PRODUCT_OBJ);
                setReset(true);
            } else {
                toastFn("error", result.message);
            }
        } finally {
            setIsDisableButton(false);
        }
    };

    // ── Excel helpers ────────────────────────────────────────────────────────

    const handleExcelClick = async () => {
        dispatch(setExcelData([]));
        try {
            setIsExcelModelLoading(true);
            const response = await getProductDetail();
            if (response?.success && response?.data) dispatch(setExcelData(response.data));
        } catch (error) {
            console.error("error:", error);
        } finally {
            setIsExcelModelLoading(false);
        }
    };

    const handleFilterSubmit = ({ searchText, dates }) => {
        setRequest({
            offset: 0, limit: 40,
            ...(dates?.length === 2 && { dateRange: dates.map((d) => d.format("DD-MM-YYYY")).join("|") }),
            ...(searchText && { search: searchText }),
        });
    };

    const clearFilter = () => setRequest({});

    // ── Column renderer ──────────────────────────────────────────────────────

    const columnRender = useCallback((col, row, mode = "") => {
        switch (col) {
            case "Type": return <CellText>{row.type}</CellText>;
            case "Category": return <CellText>{row.cat}</CellText>;
            case "Sub Category": return <CellText>{row.subCat}</CellText>;
            case "Product": return <CellText>{row.name}</CellText>;

            case "Image":
                return mode !== "excel" && (
                    <ViewImgBtn onClick={() => setImageModal({ open: true, url: row?.url || "" })}>
                        View
                    </ViewImgBtn>
                );

            case "Edit":
                return mode !== "excel" && (
                    <IconButton
                        $color="#2979FF"
                        $hoverColor="#2979FF"
                        $hoverBg="rgba(41,121,255,0.1)"
                        onClick={() => fetchProductDetailsByID(row?.id)}
                        title="Edit"
                    >
                        <i className="fa fa-pencil-square-o" aria-hidden="true" />
                    </IconButton>
                );

            case "Delete":
                return mode !== "excel" && (
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

    const renderTable = (data, mode = "") => (
        <SortableTable
            data={data}
            columnOrder={filteredColumns}
            visibleColumns={visibleColumns}
            activeId={activeId}
            setActiveId={setActiveId}
            handleDragEnd={handleDragEnd}
            mode={mode}
            isLoading={mode === "excel" ? excelModelLoading : isLoading}
            enableColumnDrag={false}
            columnRender={(col, row) => columnRender(col, row, mode)}
        />
    );

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <PageWrapper>
            <ScrollCard>
                <ActionBar>
                    <div>
                        <PrimaryButton onClick={openModal}>+ Add Product</PrimaryButton>
                    </div>
                    <ActionGroup>

                        <FilterComponent
                            onSubmit={handleFilterSubmit}
                            onClear={clearFilter}
                            columnName={APPROVE_COL}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                            bindTableData={(data) => renderTable(data, "excel")}
                            handleExcelClick={handleExcelClick}
                            pageName="product"
                            loading={isLoading}
                        />
                    </ActionGroup>
                </ActionBar>
                <CardScrollBody ref={scrollRef}>
                    {renderTable(productLists)}
                </CardScrollBody>
            </ScrollCard>

            {popUp?.showPopup && (
                <CommonModal
                    show={popUp.showPopup}
                    title={popUp.isEdit ? "Edit Product" : "Add Product"}
                    onClose={closeModal}
                    className={popUp.modelClass}
                >
                    <AddProductBody
                        newProduct={newProduct}
                        setNewProduct={setNewProduct}
                        hierarchy={hierarchy}
                        setHierarchy={setHierarchy}
                        permissions={permissions}
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        addImageRow={addImageRow}
                        removeImageRow={removeImageRow}
                        handleImageChange={handleImageChange}
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

export default Product;