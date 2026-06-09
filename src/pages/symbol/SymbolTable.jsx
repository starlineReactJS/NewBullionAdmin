import React, { memo, useEffect, useState, useCallback } from "react";
import SymbolRow from "./SymbolRow";
import Skeleton from "../../common/components/skeleton";
import {
    deleteSymbol,
    getSymboldetail,
    saveOrEditSymbol,
} from "../../ApiServices/services";
import { useSymbolTable } from "./hooks/useSymbolTable";
import { deleteModal } from "../../common/components/modal/deleteModal";
import CommonModal from "../../common/components/modal";
import { SymbolPopupBody } from "./ModalBody";
import { toastFn, validatePremium } from "@/utils";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import SortableRow from "../../common/components/sortTable/SortableRow";
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import styled from "styled-components";
import {
    Card,
    CardHeader,
    PageTitle,
    SectionLabel,
    PrimaryButton,
    SecondaryButton,
    ActionBar,
    ActionGroup,
    TableWrapper,
    StyledTable,
    Thead,
    Th,
    Tbody,
    Tr,
    Td,
    EmptyStateWrapper,
} from "../../common/styledComponents";
import { contractOptions } from "../../constants/main";

// ─────────────────────────────────────────────────────────────────────────────
// Local styles
// ─────────────────────────────────────────────────────────────────────────────

const SkeletonCell = styled(Td)`
  padding: 0;
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const SymbolTable = memo(({ commonPremiumSource }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const [isLoading, setIsLoading] = useState(true);
    const [popupData, setPopupData] = useState({
        isShow: false,
        class: "",
        isEdit: false,
    });
    const [actionLoading, setActionLoading] = useState({
        saveAll: false,
        rateType: false,
        rowSaveId: null,
        commonPremium: false,
        modalSave: false,
    });
    const [symbols, setSymbols] = useState([]);
    const [symbolObj, setSymbolObj] = useState({});
    const [saveDataIds, setSaveDataIds] = useState(new Set());

    const saveSymbolApiCall = async (payload) => {
        try {
            const response = await saveOrEditSymbol(payload);
            return response;
        } catch (error) {
            console.error(error);
        }
    };

    const checkValidation = (data) => {
        const postiveValueRegex =
            /^(?:0?\.[0-9]*[1-9][0-9]*|[1-9][0-9]*(?:\.[0-9]+)?)$/;
        const numberRegex = /^-?(?:\d+\.?\d*|\.\d+)$/;

        if (!validatePremium(data?.buyPremium) || !validatePremium(data?.sellPremium)) {
            toastFn("error", "Buy premium is invalid. Allowed values: valid number (e.g., -1235, 0, 9999) for buy/sell premium.");
            return false;
        } else if (
            !postiveValueRegex.test(data?.division) ||
            !postiveValueRegex.test(data?.multiply)
        ) {
            toastFn("error", "Division or multiply value must not be less than 1.");
            return false;
        } else if (
            !numberRegex.test(data?.gst) ||
            !numberRegex.test(data?.tds) ||
            !numberRegex.test(data?.tcs)
        ) {
            toastFn("error", "Validation failed!");
            return false;
        }
        else if (data?.rateType === "client" && !data?.identifier) {
            toastFn("error", "Please enter identifier");
            return false;
        }
        return true;
    };

    const getSymbolData = async () => {
        setIsLoading(true);
        try {
            const response = await getSymboldetail();
            if (response?.success && response?.data?.length > 0) {
                setSymbols(response.data);
            } else {
                setSymbols([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const {
        handleSymbolUpdate,
        handleSaveSymbol,
        saveAll,
        handleStepChange,
        changeRateType,
    } = useSymbolTable({
        symbols,
        setSymbols,
        saveSymbolApiCall,
        checkValidation,
        actionLoading,
        setActionLoading,
        saveDataIds,
        setSaveDataIds,
        commonPremiumSource,
        getSymbolData,
    });

    const getSymbolDataByID = async (id) => {
        try {
            const response = await getSymboldetail({ id });
            if (response?.success && response?.data) {
                setSymbolObj({ ...response.data });
                setPopupData({ isShow: true, class: "modal-xl", isEdit: true });
            } else {
                setSymbolObj({});
            }
        } catch (error) {
            console.error("error", error);
        }
    };

    const createSymbol = async () => {
        if (actionLoading.modalSave) return;
        const requestData = { ...symbolObj, isCP: true };
        setActionLoading((prev) => ({ ...prev, modalSave: true }));
        try {
            if (!symbolObj?.name.trim()) {
                toastFn("error", "Please enter name");
                return;
            }
            const response = await saveSymbolApiCall(requestData);
            if (response?.success) {
                toastFn("success", "Symbol created successfully");
                getSymbolData();
                closeModel();
            } else {
                toastFn("error", response?.message || "Failed to create symbol");
            }
        } catch (error) {
            console.error("error", error);
        } finally {
            setActionLoading((prev) => ({ ...prev, modalSave: false }));
        }
    };

    const handleEditClick = async () => {
        if (actionLoading.modalSave) return;
        if (!checkValidation(symbolObj)) return;
        const payload = { ...symbolObj };
        setActionLoading((prev) => ({ ...prev, modalSave: true }));
        if (!["product", "client"].includes(payload.rateType)) {
            delete payload.identifier;
        }
        try {
            const response = await saveSymbolApiCall(payload);
            if (response?.success) {
                toastFn("success", "Symbol edited successfully");
                closeModel();
                getSymbolData();
            } else {
                toastFn("error", response?.message || "Failed to edit!");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading((prev) => ({ ...prev, modalSave: false }));
        }
    };

    // const handleChange = (e) => {
    //     const { name, value, checked, type } = e.target;
    //     setSymbolObj((prev) => ({
    //         ...prev,
    //         [name]: type === "checkbox" ? checked : value,
    //         ...(type === "radio" && {
    //             productType: value === "product" ? symbols?.[0]?.uniqueId : null,
    //         }),
    //     }));
    // };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        setSymbolObj((prev) => {
            const firstAvailableProduct = symbols?.find(
                (item) => item.uniqueId !== prev.uniqueId
            );

            return {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
                ...(type === "radio" && {
                    identifier:
                        value === "product"
                            ? firstAvailableProduct?.uniqueId || null
                            : null,
                }),
                ...(name === "instrument" && {
                    contract: `${value.toUpperCase()}_${contractOptions[0].value}`,
                }),
            };
        });
    };

    const handleDeleteSymbol = useCallback((id) => {
        deleteModal({
            onConfirm: async () => {
                try {
                    const response = await deleteSymbol({ id });
                    if (response?.success) {
                        toastFn("success", "Symbol deleted successfully");
                        getSymbolData();
                    } else {
                        toastFn("error", response?.message || "Failed to delete symbol");
                    }
                } catch (error) {
                    console.error(error);
                }
            },
        });
    }, []);

    const openModal = useCallback(
        (isEdit, id) => {
            if (isEdit) {
                getSymbolDataByID(id);
            } else {
                setSymbolObj({
                    name: "",
                    instrument: "gold",
                    source:
                        commonPremiumSource?.length > 0
                            ? commonPremiumSource[0]?.value
                            : null,
                    contract: `GOLD_${contractOptions[0].value}`,
                });
                setPopupData({ isShow: true, class: "", isEdit: false });
            }
        },
        [commonPremiumSource]
    );

    const closeModel = () => setPopupData({ isShow: false });

    useEffect(() => {
        getSymbolData();
    }, []);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        setSymbols((prev) => {
            const oldIndex = prev.findIndex((item) => item.id === active.id);
            const newIndex = prev.findIndex((item) => item.id === over.id);
            const reordered = arrayMove(prev, oldIndex, newIndex);
            reordered.forEach((item, index) => {
                item.index = index + 1;
            });
            const changedIds = reordered.map((item) => item.id);
            setSaveDataIds((prevSet) => {
                const newSet = new Set(prevSet);
                changedIds.forEach((id) => newSet.add(id));
                return newSet;
            });
            return reordered;
        });
    };

    const COLUMNS = [
        { label: "View", width: "60px" },
        { label: "Name", align: "left" },
        { label: "Source" },
        { label: "Rate Type" },
        { label: "Buy Premium" },
        { label: "Sell Premium" },
        { label: "Save" },
        { label: "Edit" },
        { label: "Delete" },
    ];

    return (
        <>
            <Card>
                {/* Rate type + save all controls */}
                <ActionBar style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                    <PrimaryButton onClick={() => openModal(false)}>
                        + Add New
                    </PrimaryButton>
                    {symbols?.length > 0 && <ActionGroup>
                        <SecondaryButton
                            disabled={actionLoading.rateType}
                            onClick={() => changeRateType("exchange")}
                        >
                            Exc All
                        </SecondaryButton>
                        <SecondaryButton
                            disabled={actionLoading.rateType}
                            onClick={() => changeRateType("bank")}
                        >
                            Bank All
                        </SecondaryButton>
                        <SecondaryButton
                            disabled={actionLoading.rateType}
                            onClick={() => changeRateType("fix")}
                        >
                            Fix All
                        </SecondaryButton>
                        <SecondaryButton
                            disabled={actionLoading.saveAll}
                            onClick={saveAll}
                        >
                            {actionLoading.saveAll ? "Saving…" : "Save All"}
                        </SecondaryButton>
                    </ActionGroup>}

                </ActionBar>

                {/* ── Table ── */}
                <TableWrapper>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        autoScroll={true}
                    >
                        <StyledTable>
                            {isLoading ? (
                                <Tbody>
                                    <Tr>
                                        <SkeletonCell colSpan={9}>
                                            <Skeleton height="250px" />
                                        </SkeletonCell>
                                    </Tr>
                                </Tbody>
                            ) : (
                                <>
                                    <Thead>
                                        <Tr $alt={true}>
                                            {COLUMNS.map((col) => (
                                                <Th key={col.label} $align={col.align} style={col.width ? { width: col.width } : {}}>
                                                    {col.label}
                                                </Th>
                                            ))}
                                        </Tr>
                                    </Thead>

                                    <Tbody>
                                        <SortableContext
                                            items={symbols.map((s) => s.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {symbols.length > 0 ? (
                                                symbols.map((symbol, idx) => (
                                                    <SortableRow key={symbol.id} id={symbol.id}>
                                                        <SymbolRow
                                                            symbol={symbol}
                                                            rowSaveId={actionLoading.rowSaveId}
                                                            handleStepChange={handleStepChange}
                                                            handleSymbolUpdate={handleSymbolUpdate}
                                                            handleSaveSymbol={handleSaveSymbol}
                                                            openModal={openModal}
                                                            handleDeleteSymbol={handleDeleteSymbol}
                                                        />
                                                    </SortableRow>
                                                ))
                                            ) : (
                                                <Tr>
                                                    <Td colSpan={9}>
                                                        <EmptyStateWrapper>
                                                            No symbols found
                                                        </EmptyStateWrapper>
                                                    </Td>
                                                </Tr>
                                            )}
                                        </SortableContext>
                                    </Tbody>
                                </>
                            )}
                        </StyledTable>
                    </DndContext>
                </TableWrapper>
            </Card>

            {/* Modal */}
            {popupData.isShow && (
                <CommonModal
                    show={popupData.isShow}
                    title={popupData.isEdit ? "Edit Symbol" : "Add Symbol"}
                    onClose={closeModel}
                    className={popupData.class}
                >
                    <SymbolPopupBody
                        isEdit={popupData?.isEdit}
                        handleChange={handleChange}
                        symbols={symbols}
                        symbolObj={symbolObj}
                        handleEditClick={handleEditClick}
                        createSymbol={createSymbol}
                        isSaving={actionLoading.modalSave}
                    />
                </CommonModal>
            )}
        </>
    );
});

export default SymbolTable;