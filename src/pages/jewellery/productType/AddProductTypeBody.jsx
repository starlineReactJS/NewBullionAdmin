import React from "react";
import { CommonForm } from "../../../common/components/form";
import { apiUrl } from "../../../../Config";
import { PrimaryButton, ModalFooter, FormTable, FormTableBody } from "../../../common/styledComponents";

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const AddProductTypeBody = ({ newProductType, popUp, handleSubmit, handleChange, disableButton }) => {
    return (
        <form onSubmit={handleSubmit}>
            <FormTable>
                <FormTableBody>
                    <CommonForm.Text
                        label="Name"
                        name="name"
                        value={newProductType?.name}
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

export default AddProductTypeBody;