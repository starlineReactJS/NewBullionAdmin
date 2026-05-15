import React from "react";
import { CommonForm } from "../../../common/components/form";
import HierarchyDropdown from "../HierarchyDropdown";
import { Image, Spin } from "antd";
import { apiUrl } from "../../../../Config";
import styled from "styled-components";
import {
    PrimaryButton,
    SecondaryButton,
    DangerButton,
    ModalFooter,
    FormTable,
    FormTableBody,
    fluidType,
} from "../../../common/styledComponents";
import { FormLabelCell, FormLabel, FormInputCell } from "../../../common/styledComponents/modal";

// ─────────────────────────────────────────────────────────────────────────────
// Local styles
// ─────────────────────────────────────────────────────────────────────────────

const SectionTitle = styled.h6`
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.colors.primary};
  margin: ${({ theme }) => `${theme.spacing.md} 0 ${theme.spacing.xs}`};
`;

const ImageRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const ImageThumb = styled.div`
  display: inline-flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 3px;
  overflow: hidden;
`;

const AddImgBtn = styled(SecondaryButton)`
  padding: 4px 10px;
  font-size: ${({ theme }) => theme.font.sizeXs};
  min-width: 28px;
`;

const RemoveImgBtn = styled(DangerButton)`
  padding: 4px 10px;
  font-size: ${({ theme }) => theme.font.sizeXs};
  min-width: 28px;
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function AddProductBody({
    newProduct,
    setNewProduct,
    hierarchy,
    setHierarchy,
    permissions,
    handleSubmit,
    handleChange,
    addImageRow,
    removeImageRow,
    handleImageChange,
    disableButton,
}) {
    return (
        <form onSubmit={handleSubmit}>
            <FormTable>
                <FormTableBody>

                    {/* ── Hierarchy ── */}
                    <HierarchyDropdown
                        permissions={{
                            type: !!permissions.type,
                            category: !!permissions.category,
                            subCategory: !!permissions.subcat,
                        }}
                        value={hierarchy}
                        onChange={(data) => {
                            setHierarchy((prev) => ({ ...prev, ...data }));
                            if (data.typeId !== undefined) {
                                setNewProduct((prev) => ({
                                    ...prev,
                                    productTypeId: data.typeId,
                                    categoryTypeId: "",
                                    subCategoryId: "",
                                }));
                            }
                            if (data.categoryTypeId !== undefined) {
                                setNewProduct((prev) => ({
                                    ...prev,
                                    categoryTypeId: data.categoryTypeId,
                                    subCategoryId: "",
                                }));
                            }
                            if (data.subCategoryId !== undefined) {
                                setNewProduct((prev) => ({
                                    ...prev,
                                    subCategoryId: data.subCategoryId,
                                }));
                            }
                        }}
                    />

                    {/* ── Basic fields ── */}
                    <CommonForm.Text
                        label="Product Name"
                        name="name"
                        value={newProduct.name}
                        onChange={handleChange}
                    />
                    

                    <CommonForm.TextArea
                        label="Description"
                        name="description"
                        value={newProduct.description || ""}
                        onChange={handleChange}
                        rows={3}
                    />

                    <CommonForm.Checkbox
                        label="Display Product"
                        checked={!!newProduct.isDisplay}
                        onChange={(e) =>
                            setNewProduct((prev) => ({ ...prev, isDisplay: e.target.checked }))
                        }
                    />

                    {/* ── Specification section ── */}
                    <tr>
                        <td colSpan={2}>
                            <SectionTitle>Specification</SectionTitle>
                        </td>
                    </tr>

                    <CommonForm.Text
                        label="Purity"
                        name="purity"
                        value={newProduct.specification.purity}
                        onChange={(e) =>
                            setNewProduct((prev) => ({
                                ...prev,
                                specification: { ...prev.specification, purity: e.target.value },
                            }))
                        }
                    />

                    <CommonForm.Text
                        label="Price"
                        name="price"
                        value={newProduct.specification.price}
                        onChange={(e) =>
                            setNewProduct((prev) => ({
                                ...prev,
                                specification: { ...prev.specification, price: e.target.value },
                            }))
                        }
                    />

                    {/* ── Images section ── */}
                    <tr>
                        <td colSpan={2}>
                            <SectionTitle>Images</SectionTitle>
                        </td>
                    </tr>

                    {/* Product cover image */}
                    <tr>
                        <FormLabelCell>
                            <FormLabel>Product Image</FormLabel>
                        </FormLabelCell>
                        <FormInputCell>
                            <ImageRow>
                                <input
                                    type="file"
                                    name="file"
                                    onChange={handleChange}
                                    style={{ flex: 1, minWidth: 0 }}
                                />
                                {newProduct?.url && (
                                    <ImageThumb>
                                        <Image
                                            width={40}
                                            alt="cover"
                                            src={`${apiUrl}/${newProduct.url}`}
                                            fallback="https://t2.starlinedashboard.in/img/noimage.png"
                                            placeholder={<Spin size="small" />}
                                            preview={{ maskStyle: { inset: "unset", boxShadow: "none" } }}
                                        />
                                    </ImageThumb>
                                )}
                                {!newProduct?.productImage?.length && (
                                    <AddImgBtn type="button" onClick={addImageRow}>+</AddImgBtn>
                                )}
                            </ImageRow>
                        </FormInputCell>
                    </tr>

                    {/* Additional product images */}
                    {newProduct.productImage.map((img, index) => (
                        <tr key={index}>
                            <FormLabelCell>
                                <FormLabel>Image {index + 1}</FormLabel>
                            </FormLabelCell>
                            <FormInputCell>
                                <ImageRow>
                                    <input
                                        type="file"
                                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                                        style={{ flex: 1, minWidth: 0 }}
                                    />
                                    {img?.url && (
                                        <ImageThumb>
                                            <Image
                                                width={40}
                                                alt={`image-${index + 1}`}
                                                src={`${apiUrl}/${img.url}`}
                                                fallback="https://t2.starlinedashboard.in/img/noimage.png"
                                                placeholder={<Spin size="small" />}
                                                preview={{ maskStyle: { inset: "unset", boxShadow: "none" } }}
                                            />
                                        </ImageThumb>
                                    )}
                                    {index === newProduct.productImage.length - 1 && (
                                        <AddImgBtn type="button" onClick={addImageRow}>+</AddImgBtn>
                                    )}
                                    <RemoveImgBtn type="button" onClick={() => removeImageRow(index)}>−</RemoveImgBtn>
                                </ImageRow>
                            </FormInputCell>
                        </tr>
                    ))}

                </FormTableBody>
            </FormTable>

            <ModalFooter style={{ justifyContent: "center" }}>
                <PrimaryButton type="submit" disabled={disableButton}>
                    {disableButton ? "Saving…" : "Save"}
                </PrimaryButton>
            </ModalFooter>
        </form>
    );
}