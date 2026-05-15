import React, { useCallback, useEffect, useState } from 'react';
import CommonModal from '../../common/components/modal';
import { deleteBankDetail, getBankDetails, saveUpdateBankDetail } from '../../ApiServices/services';
import useColumnManager from '../../common/hooks/useColumnManager';
import SortableTable from '../../common/components/sortTable';
import { deleteModal } from '../../common/components/modal/deleteModal';
import { toastFn } from '@/utils';
import { CommonForm } from '../../common/components/form';
import { bankOptions } from '../../constants/main';
import dayjs from 'dayjs';
import {
  PageWrapper,
  Card,
  CardHeader,
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

const BANK_COLUMNS = ["Date", "AccountName", "BankName", "AccountNumber", "IFSCCode", "BranchName", "BankLogo", "Edit", "Delete"];

const INITIAL_BANK = {
  accountName: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  branchName: "",
  bankLogo: "",
  bankLogoUrl: "",
};

const Bank = () => {
  const { columnOrder, visibleColumns, activeId, setActiveId, handleDragEnd } =
    useColumnManager("bank", BANK_COLUMNS);

  const [newBank, setNewBank] = useState({ ...INITIAL_BANK });
  const [bankLists, setBankLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [disableButton, setIsDisableButton] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewBank(prev => ({ ...prev, [name]: value }));
  }, []);

  const openModal = useCallback(() => {
    setIsEdit(false);
    setNewBank({ ...INITIAL_BANK });
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => setShowModal(false), []);

  const fetchBankDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getBankDetails();
      if (!result?.success) {
        toastFn("error", result?.message || "Something went wrong!");
        return;
      }
      setBankLists(Array.isArray(result.data) && result.data.length > 0 ? result.data : []);
    } catch (err) {
      console.error("Fetch failed:", err);
      toastFn("error", "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBankDetailsByID = useCallback(async (editID) => {
    try {
      const result = await getBankDetails({ id: editID });
      if (!result?.success) {
        toastFn("error", result?.message || "Something went wrong!");
        return;
      }
      if (result.data) {
        setNewBank({ ...result.data });
        setIsEdit(true);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisableButton(true);
    try {
      const result = await saveUpdateBankDetail(newBank);
      if (result?.success) {
        toastFn("success", result?.message || (isEdit ? 'Bank updated successfully' : 'Bank added successfully'));
        await fetchBankDetails();
        setShowModal(false);
      } else {
        toastFn("error", result?.message || "Failed to save");
      }
    } catch (error) {
      toastFn("error", error.message || "Something went wrong!");
    } finally {
      setIsDisableButton(false);
    }
  };

  const handleDelete = useCallback((id) => {
    deleteModal({
      onConfirm: async () => {
        try {
          const result = await deleteBankDetail({ id });
          if (result?.success) {
            toastFn("success", result?.message || "Deleted successfully");
            setBankLists(prev => prev.filter(item => item.id !== id));
          } else {
            toastFn("error", result?.message || "Failed to delete");
          }
        } catch (error) {
          toastFn("error", error.message || "Something went wrong!");
        }
      }
    });
  }, []);

  useEffect(() => {
    fetchBankDetails();
  }, [fetchBankDetails]);

  const columnRender = useCallback((col, row) => {
    switch (col) {
      case "Date": return <DateText>{dayjs(row?.modifiedDate).format("MM/DD/YYYY hh:mm:ss A")}</DateText>;
      case "AccountName": return <CellText>{row?.accountName}</CellText>;
      case "BankName": return <CellText>{row?.bankName}</CellText>;
      case "AccountNumber": return <CellText>{row?.accountNumber}</CellText>;
      case "IFSCCode": return <CellText>{row?.ifscCode}</CellText>;
      case "BranchName": return <CellText>{row?.branchName}</CellText>;
      case "BankLogo": return <CellText>{row?.bankLogo}</CellText>;
      case "Edit":
        return (
          <IconButton
            $color="#2979FF"
            $hoverColor="#2979FF"
            $hoverBg="rgba(0,196,140,0.1)"
            onClick={() => fetchBankDetailsByID(row?.id)}
            title="update"
          >

            <i className="fa fa-pencil-square-o text-primary" />
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
            <i className="fa fa-trash-o text-danger" />
          </IconButton>
        );
      default: return null;
    }
  }, [handleDelete, fetchBankDetailsByID]);

  return (
    <PageWrapper>
      <Card>
        <ActionBar>
          <ActionGroup>
            <PrimaryButton onClick={openModal}>
              + Add Bank
            </PrimaryButton>
          </ActionGroup>
        </ActionBar>

        <SortableTable
          data={bankLists}
          columnOrder={columnOrder}
          visibleColumns={visibleColumns}
          activeId={activeId}
          setActiveId={setActiveId}
          handleDragEnd={handleDragEnd}
          isLoading={isLoading}
          hasMore={false}
          columnRender={columnRender}
        />
      </Card>

      {showModal && (
        <CommonModal
          show={showModal}
          title={isEdit ? 'Edit Bank' : 'Add Bank'}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit}>
            <FormTable>
              <tboFormTableBodydy>
                <CommonForm.Text label="Account name" name="accountName" value={newBank.accountName} onChange={handleChange} />
                <CommonForm.Text label="Bank name" name="bankName" value={newBank.bankName} onChange={handleChange} />
                <CommonForm.Text label="Account number" name="accountNumber" value={newBank.accountNumber} onChange={handleChange} inputMode="numeric" />
                <CommonForm.Text label="IFSC code" name="ifscCode" value={newBank.ifscCode} onChange={handleChange} />
                <CommonForm.Text label="Branch name" name="branchName" value={newBank.branchName} onChange={handleChange} />
                <CommonForm.Select label="Bank logo" name="bankLogo" value={newBank.bankLogo} onChange={handleChange} options={bankOptions} />
              </tboFormTableBodydy>
            </FormTable>
            <ModalFooter>
              <PrimaryButton type="submit" disabled={disableButton}>
                {isEdit ? "Update Bank" : "Add Bank"}
              </PrimaryButton>
            </ModalFooter>
          </form>
        </CommonModal>
      )}

    </PageWrapper>
  );
};

export default Bank;