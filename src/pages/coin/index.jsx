import React, { useContext, useEffect, useMemo, useState } from "react";
import { sourceContext } from "../../layout/AdminBullionLayout";
import { updateCustomDetail } from "../../ApiServices/services";
import { toastFn, validatePremium } from "@/utils";
import CoinBankRate from "./CoinBankRate";
import CoinTable from "./CoinTable";
import { Card, CardBody, CardHeader, Input, PageTitle, PageWrapper, PrimaryButton, SectionLabel, StepInputRow, TwoColGrid } from "../../common/styledComponents/index";
import {PremiumCard,PremiumGrid,PremiumName,RateRow,RateBox,RateLabel,SubmitRow} from "../../common/styledComponents/symbol"
import styled from "styled-components";
import { mq } from "../../theme";

const Coin = () => {
  const sourceData = useContext(sourceContext);
  const commonPremiumSource = useMemo(() => sourceData?.coinSource ? (sourceData?.coinSource) : [], [sourceData]);
  const [commonPremium, setCommonPremium] = useState([]);
  const [disabledButton, setDisableButton] = useState(false);


  useEffect(() => {
    if (commonPremiumSource.length > 0) {
      setCommonPremium(commonPremiumSource?.map((item) => item));
    }
  }, [commonPremiumSource]);

  //COMMON PREMIUM SUBMIT CASE
  const handleCommonPremiumChange = (id, key, value) => {
    setCommonPremium((prev) =>
      prev.map((s, index) => (index === id ? { ...s, [key]: value } : s))
    );
  };

  const isCommonPremiumValid = (data = []) => {
    return data.every(item =>
      validatePremium(item.gold) && validatePremium(item.silver)
    );
  };

  const commonPremiumSubmit = async () => {
    if (disabledButton) return;
    if (!isCommonPremiumValid(commonPremium)) {
      toastFn(
        "error",
        "Invalid premium value. Only numbers are allowed in it."
      );
      return;
    }
    setDisableButton(true);
    try {
      var requestBody = {
        coinSource: commonPremium,
      };
      const result = await updateCustomDetail(requestBody);

      if (result?.success) {
        toastFn("success", "Common premium updated");
      } else {
        toastFn("error", "Failed to update premium");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDisableButton(false);
    }
  };

 
  return (
    <PageWrapper>
      <TwoColGrid>

        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px"}}>

          {/* Common Premium Card */}
          {commonPremium?.length > 0 && 
          <Card>
            <CardBody>
              <PremiumGrid>
                {commonPremium.map((d, index, array) => (
                  <React.Fragment key={index}>
                    <PremiumCard>
                      <PremiumName>{d.name}</PremiumName>

                      <RateRow>
                        {/* BUY */}
                        <RateBox $type="buy">
                          <RateLabel $type="buy">Gold</RateLabel>
                          <StepInputRow>
                            <Input
                              type="text"
                              value={d?.gold ?? "0"}
                              name="gold"
                              $width="56px"
                              onChange={(e) =>
                                handleCommonPremiumChange(index, "gold", e.target.value)
                              }
                            />
                          </StepInputRow>
                        </RateBox>

                        {/* SELL */}
                        <RateBox $type="buy">
                          <RateLabel $type="buy">Silver</RateLabel>
                            <Input
                              type="text"
                              value={d?.silver ?? "0"}
                              name="silver"
                              $width="56px"
                              onChange={(e) =>
                                handleCommonPremiumChange(index, "silver", e.target.value)
                              }
                            />
                        
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
          }
          {/* Symbol Table */}
          <CoinTable commonPremiumSource={commonPremiumSource} />
        </div>

        {/* ── Right column: BankRate ── */}
        <CoinBankRate />
      </TwoColGrid>
    </PageWrapper>
  );
};

export default Coin;
