import React, { useEffect, useState, useCallback, useMemo } from "react";
import CommonModal from "../../common/components/modal";
import { deleteCityDetail, getCityDetails, saveUpdateCityDetail } from "../../ApiServices/services";
import SortableTable from "../../common/components/sortTable";
import { deleteModal } from "../../common/components/modal/deleteModal";
import { toastFn } from "@/utils";
import { CommonForm } from "../../common/components/form";
import CitySymbolsTable from "./CitySymbolsTable";
import styled from "styled-components";
import {
  PageWrapper,
  Card,
  CardHeader,
  ActionBar,
  ActionGroup,
  PageTitle,
  SectionLabel,
  PrimaryButton,
  IconButton,
  SecondaryButton,
  CellText,
  FormTable,
  FormTableBody,
  ModalFooter,
  fluidType,
} from "../../common/styledComponents";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const CITY_OBJ = { name: "" };
const POPUP_OBJ = { showPopup: false, modalTitle: null, modelClass: "", isEdit: false };
const CITY_COL = ["Date", "CityName", "Edit", "Delete"];

// ─────────────────────────────────────────────────────────────────────────────
// Local styled components
// ─────────────────────────────────────────────────────────────────────────────

const SubSectionTitle = styled.h5`
  ${fluidType("h4")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

const CitySelectRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;

const CitySelectLabel = styled.label`
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

const CitySelect = styled.select`
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1px solid ${({ theme }) => theme.colors.borderInput};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.font.family};
  ${fluidType("bodySm")}
  padding: 6px 10px;
  outline: none;
  cursor: pointer;
  min-width: 180px;
  transition: ${({ theme }) => theme.transition};

  option { background: ${({ theme }) => theme.colors.bgSurface}; }
  &:focus {
    border-color: ${({ theme }) => theme.colors.borderInputFocus};
    box-shadow: ${({ theme }) => theme.colors.shadowInput};
  }
`;

const EmptyHint = styled.p`
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  margin: 0;
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const City = () => {
  const visibleColumns = useMemo(() => ({
    Date: false, CityName: true, Edit: true, Delete: true,
  }), []);

  const [newCity, setNewCity] = useState({ ...CITY_OBJ });
  const [cityLists, setCityLists] = useState([]);
  const [popUp, setPopUp] = useState({ ...POPUP_OBJ });
  const [isLoading, setIsLoading] = useState(false);
  const [disableButton, setIsDisableButton] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState("");

  const openModal = () => {
    setPopUp({ showPopup: true, modelClass: "", isEdit: false });
    setNewCity({ ...CITY_OBJ });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCity({ ...newCity, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!disableButton && newCity.name.trim()) {
      setIsDisableButton(true);
      try {
        const result = await saveUpdateCityDetail(newCity);
        if (result?.success) {
          toastFn("success", result?.message || (popUp.isEdit ? "City updated" : "New city added"));
          fetchCityDetails();
        } else {
          toastFn("error", result?.message || "Failed");
        }
      } catch (error) {
        toastFn("error", error.message || "Error!");
      } finally {
        setPopUp({ ...POPUP_OBJ });
        setIsDisableButton(false);
      }
    }
  };

  const handleDelete = (id) => {
    deleteModal({
      onConfirm: async () => {
        try {
          const result = await deleteCityDetail({ id });
          if (result?.success) {
            toastFn("success", "City deleted");
            setCityLists((prev) => prev.filter((item) => item.id !== id));
          } else {
            toastFn("error", result?.message || "Delete failed");
          }
        } catch (error) {
          toastFn("error", error.message);
        }
      },
    });
  };

  const fetchCityDetails = async () => {
    setIsLoading(true);
    try {
      const result = await getCityDetails();
      if (result?.success) {
        setCityLists(result.data || []);
        setSelectedCityId(result?.data[0]?.id || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCityById = async (id) => {
    try {
      const result = await getCityDetails({ id });
      if (result.success && result.data) {
        setNewCity(result.data);
        setPopUp({ showPopup: true, modelClass: "", isEdit: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchCityDetails(); }, []);

  const cityTableRender = useCallback((col, row) => {
    switch (col) {
      case "CityName":
        return <CellText>{row.name}</CellText>;
      case "Edit":
        return (
          <IconButton
            $color="#2979FF" $hoverColor="#2979FF" $hoverBg="rgba(41,121,255,0.1)"
            onClick={() => fetchCityById(row.id)} title="Edit"
          >
            <i className="fa fa-pencil-square-o" />
          </IconButton>
        );
      case "Delete":
        return (
          <IconButton
            $color="#F44336" $hoverColor="#F44336" $hoverBg="rgba(244,67,54,0.1)"
            onClick={() => handleDelete(row.id)} title="Delete"
          >
            <i className="fa fa-trash-o" />
          </IconButton>
        );
      default: return null;
    }
  }, []);

  return (
    <PageWrapper>
      {/* ── City table ── */}
      <Card>
        <ActionBar>
          {/* <div>
            <PageTitle>Cities</PageTitle>
            <SectionLabel>Manage city list</SectionLabel>
          </div> */}
          <ActionGroup>
            <PrimaryButton onClick={openModal}>+ Add City</PrimaryButton>
          </ActionGroup>
        </ActionBar>

        <SortableTable
          data={cityLists}
          columnOrder={CITY_COL}
          visibleColumns={visibleColumns}
          isLoading={isLoading}
          hasMore={false}
          enableColumnDrag={false}
          columnRender={cityTableRender}
        />
      </Card>

      {/* ── City Symbol Premiums ── */}
      {cityLists?.length > 0 && (
        <Card>
          <CardHeader>
            <SubSectionTitle>City Symbol</SubSectionTitle>
          </CardHeader>

          <CitySelectRow>
            {/* <CitySelectLabel>Select City:</CitySelectLabel> */}
            <CitySelect
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
            >
              {/* <option value="">Select City</option> */}
              {cityLists.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </CitySelect>
          </CitySelectRow>
          {selectedCityId ? (
            <CitySymbolsTable selectedCityId={selectedCityId} />
          ) : (
            <EmptyHint>Select a city to manage symbol premiums</EmptyHint>
          )}
        </Card>
      )}

      {/* ── Add/Edit modal ── */}
      {popUp.showPopup && (
        <CommonModal
          show={popUp.showPopup}
          title={popUp.isEdit ? "Edit City" : "Add City"}
          onClose={() => setPopUp({ ...POPUP_OBJ })}
          className={popUp.modelClass}
        >
          <form onSubmit={handleSubmit}>
            <FormTable>
              <FormTableBody>
                <CommonForm.Text
                  label="City Name"
                  name="name"
                  value={newCity.name}
                  onChange={handleChange}
                  required
                />
              </FormTableBody>
            </FormTable>
            <ModalFooter style={{ justifyContent: "center" }}>
              <PrimaryButton
                type="submit"
                disabled={disableButton || !newCity.name.trim()}
              >
                {disableButton ? "Saving…" : popUp.isEdit ? "Update" : "Add"}
              </PrimaryButton>
            </ModalFooter>
          </form>
        </CommonModal>
      )}
    </PageWrapper>
  );
};

export default City;