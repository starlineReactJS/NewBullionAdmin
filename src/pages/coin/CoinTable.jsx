import React, { memo, useCallback, useEffect, useState, useMemo, useContext } from 'react';
import Skeleton from '../../common/components/skeleton';
import { deleteCoin, getCoindetail, saveOrEditCoin } from "../../ApiServices/services";
import CommonModal from '../../common/components/modal';
import { CoinPopupBody } from "./ModalBody";
import { getSecureItem, setSecureItem, toastFn, validatePremium } from "@/utils";
import { apiUrl } from "../../../Config";
import CoinRows from './CoinRows';
import { useCoinTable } from './hooks/useCoinTable';
import { deleteModal } from '../../common/components/modal/deleteModal';
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import SortableRow from '../../common/components/sortTable/SortableRow';
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { sourceContext } from '../../layout/AdminBullionLayout';

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

// ─────────────────────────────────────────────────────────────────────────────
// Local styles
// ─────────────────────────────────────────────────────────────────────────────

const SkeletonCell = styled(Td)`
  padding: 0;
`;

const ImagePreview = styled.img`
  display: block;
  margin: auto;
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.radius.md};
`;


const normalizePremiumBySource = (
    coinPremium = [],
    oldSource = [],
    newSource = []
) => {
    const oldMap = {};
    oldSource.forEach((src, index) => {
        oldMap[src.name] = coinPremium?.[index] ?? "0";
    });
    return newSource.map(src => oldMap[src.name] ?? "0");
};

const checkValidation = (data) => {
    const postiveValueRegex = /^(?:0?\.[0-9]*[1-9][0-9]*|[1-9][0-9]*(?:\.[0-9]+)?)$/;
    const numberRegex = /^-?(?:\d+\.?\d*|\.\d+)$/;

    const isPremiumValid =
        Array.isArray(data.premium) &&
        data.premium.every((p) => validatePremium(p));

    if (!isPremiumValid) {
        toastFn("error", "Premium is invalid. Allowed values: valid number (e.g., -1235, 0, 9999) or '--'.");
        return false;
    }

    if (!postiveValueRegex.test(data?.division) || !postiveValueRegex.test(data?.multiply)) {
        toastFn("error", "Division or multiply value must not be less than 1.");
        return false;
    }

    if (!numberRegex.test(data?.gst) || !numberRegex.test(data?.tds) || !numberRegex.test(data?.tcs) || !numberRegex.test(data?.identifier)) {
        toastFn("error", "Validation failed!");
        return false;
    }
    return true;
};

const saveCoinApiCall = async (text = "", coinObj) => {
    const formData = new FormData();

    if (text === "create") {
        formData.append("name", coinObj.name);
        formData.append("instrument", coinObj.instrument);
        formData.append("source", coinObj.source);
        formData.append("contract", coinObj.contract);
        formData.append('isCP', true);
    } else {
        formData?.append("id", coinObj?.id);
        formData.append("name", coinObj.name);
        formData.append("instrument", coinObj.instrument);
        formData.append("source", coinObj.source);
        formData.append("contract", coinObj.contract);
        formData?.append("isView", coinObj?.isView);
        formData.append("segment", coinObj.segment);
        formData.append("description", coinObj.description?.length ? coinObj.description : "");
        formData.append("rateType", coinObj.rateType);
        formData.append("productType", coinObj.productType);
        formData?.append("division", coinObj?.division);
        formData.append("multiply", coinObj.multiply);
        formData.append("gst", coinObj.gst);
        formData.append("tds", coinObj.tds);
        formData.append("tcs", coinObj.tcs);
        formData.append("identifier", coinObj.identifier);
        formData.append("isCP", coinObj.isCP);
        formData.append("digit", coinObj.digit);
        formData.append('index', coinObj.index);

        coinObj?.premium?.forEach((item) => formData.append("premium", item));

        if (coinObj?.images?.length > 0) {
            coinObj.images.forEach((img, index) => {
                if (img.file) {
                    formData.append(`image[${index}].file`, img.file);
                    formData.append(`image[${index}].url`, '');
                } else {
                    formData.append(`image[${index}].file`, '');
                    formData.append(`image[${index}].url`, coinObj?.url ? coinObj?.url[index] : "");
                }
            });
        } else {
            coinObj.url?.forEach((url, index) => formData?.append(`images[${index}].url`, url));
        }
    }
    try {
        const response = await saveOrEditCoin(formData, undefined, "formData");
        return response;
    } catch (error) {
        console.error(error);
    }
};

const CoinTable = memo(({ commonPremiumSource }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 }
        })
    );
    const [isLoading, setIsLoading] = useState(true);
    const [popupData, setPopupData] = useState({ isShow: false, class: "", isEdit: false });
    const [coins, setCoins] = useState([]);
    const [sourceChange, setSourceChange] = useState(false);
    const [coinObj, setCoinObj] = useState({});
    const [saveDataIds, setSaveDataIds] = useState(new Set());
    const [imageModal, setImageModal] = useState({ open: false, symbolId: null, index: null });
    const [actionLoading, setActionLoading] = useState({
        saveAll: false,
        rateType: false,
        rowSaveId: null,
        commonPremium: false,
        modalSave: false,
    });

    const getCoinData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getCoindetail();
            if (response?.success && response?.data?.length > 0) {
                setCoins(response.data);
            } else {
                setCoins([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getSymbolDataByID = useCallback(async (id) => {
        try {
            const response = await getCoindetail({ id });
            if (response?.success && response?.data) {
                setCoinObj({ ...response.data });
                setPopupData({ isShow: true, class: "modal-xl", isEdit: true });
            } else {
                setCoinObj({});
            }
        } catch (error) {
            console.error("error", error);
        }
    }, []);

    const { handleSymbolUpdate, handleSaveCoin, saveAll, changeRateType } = useCoinTable({
        coins,
        setCoins,
        saveCoinApiCall: (text, data) => saveCoinApiCall(text, data),
        checkValidation,
        actionLoading,
        setActionLoading,
        saveDataIds,
        setSaveDataIds,
        getCoinData
    });

    const closeModel = useCallback(() => {
        setPopupData({ isShow: false });
    }, []);

    const handleChange = useCallback((e, premiumIndex = null) => {
        const { name, value, checked, type, files } = e.target;
        setCoinObj((prev) => {
            const firstAvailableProduct = coins?.find(
                (item) => item.uniqueId !== prev.uniqueId
            );
            if (type === "file" && premiumIndex !== null) {
                const images = Array.isArray(prev.images)
                    ? [...prev.images]
                    : Array.from({ length: commonPremiumSource.length }, () => ({ file: null }));

                images[premiumIndex] = { ...images[premiumIndex], file: files[0] };
                return { ...prev, images };
            }

            if (name === "premium" && premiumIndex !== null) {
                const premium = Array.isArray(prev.premium) ? [...prev.premium] : [];
                premium[premiumIndex] = value;
                return { ...prev, premium };
            }

            // return {
            //     ...prev,
            //     [name]: type === "checkbox" ? checked : value,
            //     ...(type === "radio" && { productType: value === "product" ? coins?.[0]?.uniqueId : null }),
            // };
            return {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
                ...(type === "radio" && {
                    productType:
                        value === "product"
                            ? firstAvailableProduct?.uniqueId || null
                            : null,
                }),
            };
        });
    }, [commonPremiumSource, coins]);

    const createCoin = useCallback(async () => {
        if (actionLoading.modalSave) return;
        if (!coinObj?.name?.trim()) {
            toastFn("error", "Please enter name");
            return;
        }
        setActionLoading(p => ({ ...p, modalSave: true }));
        try {
            const response = await saveCoinApiCall("create", coinObj);
            if (response?.success) {
                toastFn("success", "Coin created successfully");
                getCoinData();
                closeModel();
            } else {
                toastFn("error", response?.message || 'Failed to create coin');
            }
        } catch (error) {
            console.error("error", error);
        } finally {
            setActionLoading(p => ({ ...p, modalSave: false }));
        }
    }, [coinObj, commonPremiumSource, getCoinData, closeModel]);

    const handleEditClick = useCallback(async () => {
        if (actionLoading.modalSave) return;
        if (!checkValidation(coinObj)) return;

        setActionLoading(p => ({ ...p, modalSave: true }));
        try {
            const response = await saveCoinApiCall("", coinObj);
            if (response?.success) {
                toastFn("success", "Coin edited successfully");
                closeModel();
                getCoinData();
            } else {
                toastFn("error", response?.message || 'Failed to edit coin');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(p => ({ ...p, modalSave: false }));
        }
    }, [coinObj, commonPremiumSource, getCoinData, closeModel]);

    const handleDeleteCoin = useCallback((id) => {
        deleteModal({
            onConfirm: async () => {
                try {
                    const response = await deleteCoin({ id });
                    if (response?.success) {
                        toastFn("success", "Symbol deleted successfully");
                        getCoinData();
                    } else {
                        toastFn("error", response?.message || 'Failed to delete symbol');
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }, []);

    const sourceData = useContext(sourceContext);
    const sourceCP = useMemo(() => sourceData?.source ? (sourceData?.source) : [], [sourceData]);

    const openModal = useCallback((isEdit, id) => {

        if (isEdit) {
            getSymbolDataByID(id);
        } else {
            setCoinObj({
                name: "",
                instrument: "gold",
                source: sourceCP?.length > 0 ? sourceCP?.[0]?.value : null,
                contract: "GOLD_III|BA",
            });
            setPopupData({ isShow: true, class: "", isEdit: false });
        }
    }, [commonPremiumSource, getSymbolDataByID]);

    const getCurrentImage = useCallback(() => {
        if (!imageModal.symbolId) return null;
        const symbol = coins.find(c => c.id === imageModal.symbolId);
        return symbol?.url?.[imageModal.index] ? `${apiUrl}/${symbol?.url?.[imageModal.index]}` : 'https://t2.starlinedashboard.in/img/noimage.png';
    }, [imageModal.symbolId, imageModal.index, coins]);

    useEffect(() => {
        getCoinData();
    }, []),

        useEffect(() => {
            if (!commonPremiumSource?.length && !coins?.length) return;
            const STORAGE_KEY = "coinCP";
            const prevData = getSecureItem(STORAGE_KEY);
            const prevSource = prevData ? JSON.parse(prevData) : null;

            if (prevSource && prevSource.length !== commonPremiumSource.length) {
                toastFn("warning", "Premium sources changed. Prices auto-synced.");
                const changedIds = new Set();
                setCoins(prevCoins => prevCoins.map(coin => {
                    const updatedPremium = normalizePremiumBySource(coin.premium, prevSource, commonPremiumSource);
                    changedIds.add(coin.id);
                    return { ...coin, premium: updatedPremium };
                }));
                setSaveDataIds(changedIds);
                setSourceChange(true);
            }
            setSecureItem(STORAGE_KEY, JSON.stringify(commonPremiumSource));
        }, [commonPremiumSource]);

    useEffect(() => {
        if (!saveDataIds.size || !sourceChange) return;
        saveAll();
        setSourceChange(false);
    }, [saveDataIds, sourceChange, saveAll]);


    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        setCoins((prev) => {
            const oldIndex = prev.findIndex(item => item.id === active.id);
            const newIndex = prev.findIndex(item => item.id === over.id);

            const reordered = arrayMove(prev, oldIndex, newIndex);

            // update sort orders
            reordered.forEach((item, index) => {
                item.index = index + 1;
            });

            // mark only updated ones
            const changedIds = reordered.map(item => item.id);

            // update save ids for saveAll
            setSaveDataIds(prevSet => {
                const newSet = new Set(prevSet);
                changedIds.forEach(id => newSet.add(id));
                return newSet;
            });

            return reordered;
        });
    };

    const STATIC_COLS = ["View", "Name", "Source", "Rate Type"];
    const ACTION_COLS = ["Save", "Edit", "Delete"];
    const allCols = [
        ...STATIC_COLS,
        ...(commonPremiumSource?.map((s) => s.name) || []),
        ...ACTION_COLS,
    ];


    return (
        <>
            <Card>
                {/* ── Action bar ── */}
                {/* <ActionBar>
                    <div>
                        <PageTitle>Coins</PageTitle>
                        <SectionLabel>Drag rows to reorder</SectionLabel>
                    </div>

                   
                </ActionBar> */}
                {/* Rate type + save all controls */}
                <ActionBar style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                    <ActionGroup>
                        <PrimaryButton onClick={() => openModal(false)}>
                            + Add New
                        </PrimaryButton>
                    </ActionGroup>
                    {coins?.length > 0 && <ActionGroup>
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
                    </ActionGroup>
                    }
                </ActionBar>
                {/* ── Table ── */}
                <TableWrapper>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        autoScroll
                    >
                        <StyledTable>
                            {isLoading ? (
                                <Tbody>
                                    <Tr>
                                        <SkeletonCell colSpan={allCols.length}>
                                            <Skeleton height="250px" />
                                        </SkeletonCell>
                                    </Tr>
                                </Tbody>
                            ) : (
                                <>
                                    <Thead>
                                        <Tr $alt={true}>
                                            {allCols.map((col) => (
                                                <Th key={col}>{col}</Th>
                                            ))}
                                        </Tr>
                                    </Thead>

                                    <Tbody>
                                        <SortableContext
                                            items={coins.map((s) => s.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {coins.length > 0 ? (
                                                coins.map((symbol, idx) => (
                                                    <SortableRow key={symbol.id} id={symbol.id}>
                                                        {/* <Tr $alt={idx % 2 === 1}> */}
                                                        <CoinRows
                                                            symbol={symbol}
                                                            handleSymbolUpdate={handleSymbolUpdate}
                                                            handleSaveCoin={handleSaveCoin}
                                                            handleDeleteCoin={handleDeleteCoin}
                                                            openModal={openModal}
                                                            commonPremiumSource={commonPremiumSource}
                                                            rowSaveId={actionLoading?.rowSaveId}
                                                        />
                                                        {/* </Tr> */}
                                                    </SortableRow>
                                                ))
                                            ) : (
                                                <Tr>
                                                    <Td colSpan={allCols.length}>
                                                        <EmptyStateWrapper>
                                                            No coins found
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

            {popupData.isShow && (
                <CommonModal show={popupData.isShow} title={popupData.isEdit ? "Edit Coin" : "Add Coin"} onClose={closeModel} className={popupData.class}>
                    <CoinPopupBody isEdit={popupData?.isEdit} coinObj={coinObj} handleChange={handleChange} createCoin={createCoin} handleEditClick={handleEditClick} coins={coins} isSaving={actionLoading.modalSave} />
                </CommonModal>
            )}
            {imageModal.open && (
                <CommonModal show={imageModal.open} onClose={() => setImageModal({ open: false, symbolId: null, index: null })} title={"View Image"}>
                    <img src={getCurrentImage()} height={100} width={100} className="m-auto w-100" alt="Premium" />
                </CommonModal>
            )}
        </>
    );
});

export default CoinTable;

