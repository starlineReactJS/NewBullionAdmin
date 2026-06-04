import React, { useContext, useEffect, useMemo, useState } from "react";
import { toastFn, validatePremium } from "@/utils";
import { updateCustomDetail } from "../../ApiServices/services";
import BankRate from "./BankRate";
import { sourceContext } from "../../layout/AdminBullionLayout";
import SymbolTable from "./SymbolTable";
import styled from "styled-components";
import {
  PageWrapper,
  TwoColGrid,
  Card,
  CardHeader,
  CardBody,
  PageTitle,
  SectionLabel,
  PrimaryButton,
  StepButton,
  Input,
  StepInputRow,
} from "../../common/styledComponents";
import { PremiumCard, PremiumGrid, PremiumName, RateRow, RateBox, RateLabel, SubmitRow } from "../../common/styledComponents/symbol";
import { mq } from "../../theme";

const Symbol = () => {
  const sourceData = useContext(sourceContext);
  const commonPremiumSource = useMemo(
    () => (sourceData?.source ? sourceData.source : []),
    [sourceData]
  );
  const [commonPremium, setCommonPremium] = useState([]);
  const [disabledButton, setDisableButton] = useState(false);

  const handleCommonPremiumChange = (id, key, value) => {
    setCommonPremium((prev) =>
      prev.map((s, index) => (index === id ? { ...s, [key]: value } : s))
    );
  };

  const isCommonPremiumValid = (data = []) => {
    return data.every(
      (item) => validatePremium(item.buy) && validatePremium(item.sell)
    );
  };

  const commonPremiumSubmit = async () => {
    if (disabledButton) return;
    try {
      if (!isCommonPremiumValid(commonPremium)) {
        toastFn(
          "error",
          "Invalid premium value. Only numbers are allowed in buy/sell."
        );
        return;
      }
      setDisableButton(true);
      const requestBody = { source: commonPremium };
      const result = await updateCustomDetail(requestBody);
      if (result?.success) {
        toastFn("success", "Common premium updated");
      } else {
        toastFn("error", result?.message || "Failed to update premium");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDisableButton(false);
    }
  };

  useEffect(() => {
    if (commonPremiumSource.length > 0) {
      setCommonPremium(commonPremiumSource.filter((item) => item?.isCP));
    }
  }, [commonPremiumSource]);

  const handleStepChange = (index, field, type, step) => {
    setCommonPremium((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const current = Number(item[field]) || 0;
        const next =
          type === "inc" ? current + Number(step) : current - Number(step);
        return { ...item, [field]: String(next) };
      })
    );
  };

  return (
    <PageWrapper>
      <TwoColGrid $ratio="800px 1fr">

        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Common Premium Card */}
          {commonPremium?.length > 0 &&
            <>
              <Card style={{padding:'10px'}}>
                {/* <CardHeader>
                <div>
                  <PageTitle>Common Premium</PageTitle>
                </div>
                <SubmitRow>
                  <PrimaryButton
                    disabled={disabledButton}
                    onClick={commonPremiumSubmit}
                  >
                    {disabledButton ? "Saving…" : "Submit"}
                  </PrimaryButton>
                </SubmitRow>
              </CardHeader> */}
                <CardBody style={{padding:'0'}}>
                  <PremiumGrid>
                    {commonPremium.map((d, index, array) => (
                      <React.Fragment key={index}>
                        <PremiumCard>
                          <PremiumName>{d.name}</PremiumName>

                          <RateRow>
                            {/* BUY */}
                            <RateBox $type="buy">
                              <RateLabel $type="buy">Buy</RateLabel>
                              <StepInputRow>
                                <StepButton
                                  type="button"
                                  onClick={() => handleStepChange(index, "buy", "dec", d.step)}
                                >
                                  −
                                </StepButton>
                                <Input
                                  type="text"
                                  value={d?.buy ?? "0"}
                                  name="buy"
                                  $width="56px"
                                  onChange={(e) =>
                                    handleCommonPremiumChange(index, "buy", e.target.value)
                                  }
                                />
                                <StepButton
                                  type="button"
                                  onClick={() => handleStepChange(index, "buy", "inc", d.step)}
                                >
                                  +
                                </StepButton>
                              </StepInputRow>
                            </RateBox>

                            {/* SELL */}
                            <RateBox $type="sell">
                              <RateLabel $type="sell">Sell</RateLabel>
                              <StepInputRow>
                                <StepButton
                                  type="button"
                                  onClick={() => handleStepChange(index, "sell", "dec", d.step)}
                                >
                                  −
                                </StepButton>
                                <Input
                                  type="text"
                                  value={d?.sell ?? "0"}
                                  name="sell"
                                  $width="56px"
                                  onChange={(e) =>
                                    handleCommonPremiumChange(index, "sell", e.target.value)
                                  }
                                />
                                <StepButton
                                  type="button"
                                  onClick={() => handleStepChange(index, "sell", "inc", d.step)}
                                >
                                  +
                                </StepButton>
                              </StepInputRow>
                            </RateBox>
                          </RateRow>
                        </PremiumCard>
                      </React.Fragment>
                    ))}
                  </PremiumGrid>
                  <SubmitRow>
                    <PrimaryButton
                      disabled={disabledButton}
                      onClick={commonPremiumSubmit}
                    >
                      {disabledButton ? "Saving…" : "Submit"}
                    </PrimaryButton>
                  </SubmitRow>
                </CardBody>
              </Card>
            </>
          }
          {/* Symbol Table */}
          <SymbolTable commonPremiumSource={commonPremiumSource} />
        </div>

        {/* ── Right column: BankRate ── */}
        <BankRate />
      </TwoColGrid>
    </PageWrapper>
  );
};

export default Symbol;