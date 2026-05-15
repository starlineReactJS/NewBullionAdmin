import React from "react";
import { CommonForm } from "../../../common/components/form";
import HierarchyDropdown from "../HierarchyDropdown";
import { PrimaryButton, ModalFooter, FormTable, FormTableBody } from "../../../common/styledComponents";


const AddCategoryBody = ({
    newCategory,
    popUp,
    handleSubmit,
    handleChange,
    disableButton,
    hierarchy,
    setHierarchy,
    setNewCategory,
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <FormTable>
                <FormTableBody>
                    <HierarchyDropdown
                        permissions={{ type: true, category: false, subCategory: false }}
                        value={hierarchy}
                        onChange={(data) => {
                            setHierarchy((prev) => ({ ...prev, ...data }));
                            setNewCategory((prev) => ({ ...prev, parentId: data.typeId }));
                        }}
                    />

                    <CommonForm.Text
                        label="Name"
                        name="name"
                        value={newCategory?.name}
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
                    {disableButton ? "Saving…" : popUp?.isEdit ? "Update" : "Add"}
                </PrimaryButton>
            </ModalFooter>
        </form>
    );
};

export default AddCategoryBody;