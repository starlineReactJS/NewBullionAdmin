import React, { useContext, useEffect, useMemo, useState } from "react";
import { toastFn } from "@/utils";
import { sourceContext } from "../../layout/AdminBullionLayout";
import { changePasswordAPI, updateCustomDetail } from "../../ApiServices/services";
import { message } from "antd";
import {
  PageWrapper,
  PrimaryButton,
  Checkbox,
} from "../../common/styledComponents";
import {SettingsGrid,Panel,PanelTitle,PanelBody,PanelFooter,RefTable,RefTr,RefTd,RefInput,EmptyRow,PwdTable,PwdLabel,PwdFieldTd,PwdLabelTd,PwdInput,RateTable,RateTr,RateLabelTd,RateInputTd,DisabledInput,RateInput  } from "../../common/styledComponents/setting"


const passwordObj = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
};

const Setting = () => {
  const subscribeData = useContext(sourceContext);
  const [reference, setReference] = useState([]);
  const [stepNotification, setStepNotification] = useState([]);
  const [originalSteps, setOriginalSteps] = useState([]);
  const [password, setPassword] = useState({ ...passwordObj });
  const [loading, setIsLoading] = useState({
    ref: true,
    step: true
  });
  const [rate, setRate] = useState([]);
  const [disabledButton, setDisabledButton] = useState({
    ref: false,
    password: false,
    rate: false
  });

  // useMemo(() => subscribeData?.subscribe ? setReference(subscribeData?.subscribe) : [], [subscribeData]);

  useEffect(() => {
    if (subscribeData && subscribeData?.subscribe) {
      setReference(subscribeData.subscribe || []);

      setIsLoading(prev => ({
        ...prev,
        ref: false
      }));
    }

    if (subscribeData && subscribeData?.stepNotification) {
      setStepNotification(subscribeData.stepNotification);
      setOriginalSteps(subscribeData?.stepNotification.map(item => item.step));

      setIsLoading(prev => ({
        ...prev,
        step: false
      }));
    }
  }, [subscribeData]);

  const handleChange = (id, e) => {
    const { name, value, type, checked } = e.target;
    setReference((prev) =>
      prev.map((row, i) =>
        i === id
          ? { ...row, [name]: type === "checkbox" ? checked : value }
          : row
      )
    );
  };

  const handleRefProductUpdate = async () => {
    if (!disabledButton?.ref) {
      setDisabledButton(prev => ({
        ...prev,
        ref: true
      }));
      try {
        var requestBody = {
          subscribe: reference,
        };
        const result = await updateCustomDetail(requestBody);
        if (!result?.success) {
          toastFn("error", "Something went wrong!");
          return;
        }

        if (result?.success) {
          toastFn("success", "Reference products update successfully");
        }
      } catch (error) { console.log(error, 'error'); }
      finally {

        setDisabledButton(prev => ({
          ...prev,
          ref: false
        }));
      }
    }
  };


  const handlePasswordChange = (key, value) => {
    setPassword((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordUpdate = async () => {
    if (!password?.currentPassword || !password?.newPassword) {
      toastFn("error", "Please enter all required password fields.");
      return;
    }

    if (password?.newPassword !== password?.confirmPassword) {
      toastFn("error", "New password and confirm password must be the same.");
      return;
    }

    if (!disabledButton?.password) {

      setDisabledButton(prev => ({
        ...prev,
        password: true
      }));

      try {

        const body = {
          currentPassword: password?.currentPassword,
          newPassword: password?.newPassword
        };
        const result = await changePasswordAPI(body);
        if (!result?.success) {
          toastFn("error", result?.message || 'Something went wrong!');
          return;
        }
        if (result?.success) {
          setDisabledButton(prev => ({
            ...prev,
            password: false
          }));
          toastFn('success', result?.message || "Password change successfully");
          setPassword({ ...passwordObj });
        }
      } catch (error) {
        console.error("Login error:", error);
      }
      finally {
        setDisabledButton(prev => ({
          ...prev,
          password: false
        }));
        setPassword({ ...passwordObj });
      }
    }

  };
  const handleRateChange = (index, value) => {
    if (!/^\d*\.?\d*$/.test(value)) return;
    setStepNotification((prev) =>
      prev.map((row, i) =>
        i === index
          ? { ...row, value: value }
          : row
      )
    );
  };
  const handleRateUpdate = async () => {
    if (!disabledButton?.password) {

      setDisabledButton(prev => ({
        ...prev,
        rate: true
      }));
      try {
        const invalidItem = stepNotification.find((item, index) => {
          const newStep = Number(item.value);
          const originalStep = Number(originalSteps[index]);

          // invalid number or zero
          if (isNaN(newStep) || newStep === 0) return true;

          // MUST be an exact multiple
          if (newStep % originalStep !== 0) return true;

          return false;
        });
        if (invalidItem) {
          toastFn(
            "error",
            "Step must be a valid multiple of the original value"
          );
          return;
        }
        const payload = {
          stepNotification: stepNotification.map(item => ({
            ...item,
            value: Number(item.value),
          }))
        };

        const result = await updateCustomDetail(payload);

        if (!result?.success) {
          toastFn("error", "Something went wrong!");
          return;
        }
        toastFn("success", "Rate difference update successfully");
      } catch (error) {
        toastFn("error", "Unexpected error occurred");
      } finally {
        setDisabledButton(prev => ({
          ...prev,
          rate: false
        }));
      }
    }
  };

  return (
    <PageWrapper>
      <SettingsGrid>

        {/* ── Reference Panel ── */}
        <Panel>
          <PanelTitle>Reference</PanelTitle>
          <PanelBody>
            <RefTable>
              <tbody>
                {loading?.ref ? (
                  <EmptyRow><td>Loading reference data…</td></EmptyRow>
                ) : reference?.length > 0 ? (
                  reference.map((item, index) => (
                    <RefTr key={index}>
                      <RefTd style={{ width: "10%" }}>
                        <Checkbox
                          checked={item.isA}
                          name="isA"
                          onChange={(e) => handleChange(index, e)}
                        />
                      </RefTd>
                      <RefTd style={{ width: "35%" }}>{item.ins}</RefTd>
                      <RefTd>
                        <RefInput
                          type="text"
                          value={item.nam}
                          name="nam"
                          onChange={(e) => handleChange(index, e)}
                        />
                      </RefTd>
                    </RefTr>
                  ))
                ) : (
                  <EmptyRow><td>Can't find any reference product!</td></EmptyRow>
                )}
              </tbody>
            </RefTable>
          </PanelBody>
          {reference?.length > 0 && (
            <PanelFooter>
              <PrimaryButton disabled={disabledButton?.ref} onClick={handleRefProductUpdate}>
                {disabledButton?.ref ? "Saving…" : "Update"}
              </PrimaryButton>
            </PanelFooter>
          )}
        </Panel>

        {/* ── Change Password Panel ── */}
        <Panel>
          <PanelTitle>Change Password</PanelTitle>
          <PanelBody>
            <PwdTable>
              <tbody>
                {[
                  { label: "Current Password", key: "currentPassword" },
                  { label: "New Password", key: "newPassword" },
                  { label: "Confirm Password", key: "confirmPassword" },
                ].map(({ label, key }) => (
                  <tr key={key}>
                    <PwdLabelTd>
                      <PwdLabel>{label}<span>*</span></PwdLabel>
                    </PwdLabelTd>
                    <PwdFieldTd>
                      <PwdInput
                        type="password"
                        value={password[key]}
                        onChange={(e) => handlePasswordChange(key, e.target.value)}
                      />
                    </PwdFieldTd>
                  </tr>
                ))}
              </tbody>
            </PwdTable>
          </PanelBody>
          <PanelFooter>
            <PrimaryButton disabled={disabledButton?.password} onClick={handlePasswordUpdate}>
              {disabledButton?.password ? "Saving…" : "Update"}
            </PrimaryButton>
          </PanelFooter>
        </Panel>

        {/* ── Rate Difference Panel ── */}
        <Panel>
          <PanelTitle>Rate Difference</PanelTitle>
          <PanelBody>
            <RateTable>
              <tbody>
                {loading?.step ? (
                  <EmptyRow><td>Loading rate difference…</td></EmptyRow>
                ) : stepNotification?.length > 0 ? (
                  stepNotification.map((item, index) => (
                    <RateTr key={index}>
                      <td style={{ padding: "6px 8px", width: "40%", verticalAlign: "middle" }}>
                        <span style={{ fontWeight: 600 }}>{item?.name}</span>
                      </td>
                      <RateInputTd>
                        <DisabledInput
                          type="text"
                          value={item?.step || 0}
                          disabled
                          readOnly
                        />
                      </RateInputTd>
                      <RateInputTd>
                        <RateInput
                          type="text"
                          value={item?.value}
                          onChange={(e) => handleRateChange(index, e.target.value)}
                        />
                      </RateInputTd>
                    </RateTr>
                  ))
                ) : (
                  <EmptyRow><td>Can't find any rate difference!</td></EmptyRow>
                )}
              </tbody>
            </RateTable>
          </PanelBody>
          {stepNotification?.length > 0 && (
            <PanelFooter>
              <PrimaryButton disabled={disabledButton?.rate} onClick={handleRateUpdate}>
                {disabledButton?.rate ? "Saving…" : "Submit"}
              </PrimaryButton>
            </PanelFooter>
          )}
        </Panel>

      </SettingsGrid>
    </PageWrapper>
  );
};



export default Setting;
