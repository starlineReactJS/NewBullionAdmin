import React from "react";
import HierarchyDropdown from "../HierarchyDropdown";
import { CommonForm } from "../../../common/components/form";
import { PrimaryButton, ModalFooter, FormTable, FormTableBody } from "../../../common/styledComponents";

const AddSubCategoryBody = ({
    handleSubmit,
    hierarchy,
    setHierarchy,
    popUp,
    setNewSubCategory,
    newSubCategory,
    handleChange,
    disableButton,
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <FormTable>
                <FormTableBody>
                    <HierarchyDropdown
                        permissions={{ type: true, category: true, subCategory: false }}
                        value={hierarchy}
                        onChange={(data) => {
                            setHierarchy((prev) => ({ ...prev, ...data }));
                            if (data.typeId !== undefined) {
                                setNewSubCategory((prev) => ({
                                    ...prev,
                                    productTypeId: data.typeId,
                                    categoryTypeId: "",
                                }));
                            }
                            if (data.categoryTypeId !== undefined) {
                                setNewSubCategory((prev) => ({
                                    ...prev,
                                    categoryTypeId: data.categoryTypeId,
                                }));
                            }
                        }}
                    />

                    <CommonForm.Text
                        label="Sub Category Name"
                        name="name"
                        value={newSubCategory.name}
                        onChange={handleChange}
                    />

                    <CommonForm.File
                        label="Image"
                        name="file"
                        onChange={handleChange}
                    />
                </FormTableBody>
            </FormTable>

            <ModalFooter style={{ justifyContent: "center" }}>
                <PrimaryButton type="submit" disabled={disableButton}>
                    {disableButton ? "Saving…" : popUp.isEdit ? "Update" : "Add"}
                </PrimaryButton>
            </ModalFooter>
        </form>
    );
};

export default AddSubCategoryBody;