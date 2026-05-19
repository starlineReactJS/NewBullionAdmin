import React, { useEffect, useState, useRef } from "react";
import { toastFn, validateEmailMobile } from "@/utils";
import { getContactDetails, saveBannerDetails, saveContactDetails } from "../../ApiServices/services";
import Skeleton from "../../common/components/skeleton";
import {
  PageWrapper,
  PrimaryButton,
  Checkbox,
} from "../../common/styledComponents";
import { SectionCard, SectionTitle, SectionBody, ContactGrid, ContactBlock, BlockHeading, AddBtn, RemoveBtn, InputRow, FieldInput, FieldTextArea, RateGrid, RateItem, MarqueeGrid, FieldLabel, WhatsAppRow, FooterRow, BannerGrid, BannerBox, BannerNote, UploadLabel, BannerPreview, BannerImg, DeleteBannerBtn, RateItemToggle, RateToggleGrid, } from "../../common/styledComponents/userDetails";
import { Switch } from "antd";


const CONTACT_OBJ = {
  whatsAppNo: "",
  bookingNumber: [""],
  marquee: [],
  addresses: [{
    add: "",
    map: ""
  }],
  email: [""],
  socialMedia: [{ nam: "", url: "" }],
  rateHideShow: [{ isR: false, isB: false, isS: false, isH: false, isL: false }]
};
const MAX_SIZE = 1 * 1024 * 1024;
const RATE_LABELS = { isR: "Rate", isB: "Buy", isS: "Sell", isH: "High", isL: "Low" };

const UserDetails = () => {
  const webRef = useRef(null);
  const appRef = useRef(null);
  const [addFields, setAddFields] = useState({ ...CONTACT_OBJ });
  const [isLoading, setIsLoading] = useState(false);
  const [disabledButton, setIsDisabledButton] = useState({
    userDetails: false,
    bannerDetails: false
  });
  const [images, setImages] = useState({
    webBanner: null,
    appBanner: null,
    webURL: "",
    appURL: ""
  });

  const handleSubmit = async () => {
    for (const mail of addFields?.email) {
      if (mail?.length > 0 && !validateEmailMobile("email", mail)) {
        toastFn("error", "Please enter valid emails");
        return;
      }
    }
    if (addFields?.whatsAppNo?.length > 0 && !validateEmailMobile("mobile", addFields?.whatsAppNo)) {
      toastFn("error", "Please enter valid whatsapp number");
      return;
    }

    if (!disabledButton?.userDetails) {
      setIsDisabledButton(prev => ({
        ...prev,
        userDetails: true
      }));

      try {
        const body = { ...addFields };
        const result = await saveContactDetails(body);
        if (result?.success) {
          toastFn("success", "details updated successfully");
          getContactDetailsFun();
        } else {
          toastFn("error", result?.message || "Failed to update");
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsDisabledButton(prev => ({
          ...prev,
          userDetails: false
        }));
      }
    }

  };

  const handleImageUpload = (e, type, ref) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size >= MAX_SIZE) {
      toastFn("error", "Image size must be less than 1 MB.");

      setImages(prev => ({
        ...prev,
        [type]: null,
        [`${type === "webBanner" ? "webURL" : "appURL"}`]: ""
      }));

      e.target.value = "";
      if (ref?.current) ref.current.value = "";
      return;
    }

    const imgURL = URL.createObjectURL(file);

    setImages(prev => ({
      ...prev,
      [type]: file,
      [`${type === "webBanner" ? "webURL" : "appURL"}`]: imgURL
    }));
  };

  // const handleImageUpload = (e, type, ref) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const imgURL = URL.createObjectURL(file);
  //   const img = new Image();
  //   img.src = imgURL;

  //   img.onload = () => {
  //     let isValid = true;

  //     if (type === "webBanner" && (img.width !== 600 || img.height !== 500)) {
  //       toastFn("error", "Web banner must be exactly 600×500 pixels.");
  //       isValid = false;
  //     }

  //     if (type === "appBanner" && (img.width !== 640 || img.height !== 1136)) {
  //       toastFn("error", "App banner must be exactly 640×1136 pixels.");
  //       isValid = false;
  //     }

  //     if (!isValid) {
  //       setImages(prev => ({
  //         ...prev,
  //         [type]: null,
  //         [`${type === "webBanner" ? "webURL" : "appURL"}`]: ""
  //       }));

  //       URL.revokeObjectURL(imgURL);
  //       e.target.value = "";
  //       if (ref?.current) ref.current.value = "";
  //       return;
  //     }

  //     setImages(prev => ({
  //       ...prev,
  //       [type]: file, // 🔥 store FILE
  //       [`${type === "webBanner" ? "webURL" : "appURL"}`]: imgURL // 🔥 store URL
  //     }));
  //   };

  //   img.onerror = () => {
  //     toastFn("error", "Invalid image file");

  //     setImages(prev => ({
  //       ...prev,
  //       [type]: null,
  //       [`${type === "webBanner" ? "webURL" : "appURL"}`]: ""
  //     }));

  //     e.target.value = "";
  //     if (ref?.current) ref.current.value = "";
  //   };
  // };

  const handleAdd = (field, value) => {
    setAddFields((prev) => ({
      ...prev,
      [field]: [...prev[field], value],
    }));
  };

  const handleUpdate = (field, index, value, nestedKey = null, name = null) => {
    const list = [...addFields[field]];

    if (nestedKey) {
      list[index] = {
        ...list[index],
        [nestedKey]: value,
      };
    } else if (field === "rateHideShow") {
      list[index] = { ...list[index], [name]: value };
    }
    else {
      list[index] = value;
    }

    setAddFields((prev) => ({
      ...prev,
      [field]: list,
    }));
  };

  const handleRemove = (field, index) => {
    const list = [...addFields[field]];
    list.splice(index, 1);

    setAddFields((prev) => ({
      ...prev,
      [field]: list,
    }));
  };

  const getContactDetailsFun = async () => {
    try {
      setIsLoading(true);
      const result = await getContactDetails();

      if (result?.success) {
        const { webBannerUrl, appBannerUrl, ...restData } = result?.data || {};
        setAddFields({
          ...restData,
          bookingNumber: restData.bookingNumber?.length ? restData.bookingNumber : [""],
          addresses: restData.addresses?.length ? restData.addresses : [{ add: "", map: "" }],
          email: restData.email?.length ? restData.email : [""],
          socialMedia: restData.socialMedia?.length ? restData.socialMedia : [{ nam: "", url: "" }],
          marquee: restData.marquee?.length ? restData.marquee : ["", ""],
          whatsAppNo: restData.whatsAppNo ?? "",
          rateHideShow: restData.rateHideShow ?? CONTACT_OBJ?.rateHideShow
        });

        if (webBannerUrl || appBannerUrl) {
          setImages(prev => ({
            ...prev,
            webURL: webBannerUrl ? webBannerUrl : prev.webURL,
            appURL: appBannerUrl ? appBannerUrl : prev.appURL
          }));
        }
      }

    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getContactDetailsFun();
  }, []);

  const handleSubmitBanner = async () => {
    if (disabledButton?.bannerDetails) return;

    setIsDisabledButton(prev => ({
      ...prev,
      bannerDetails: true
    }));

    const { webBanner, appBanner, webURL, appURL } = images || {};
    const hasWebFile = webBanner instanceof File;
    const hasAppFile = appBanner instanceof File;

    if (!hasWebFile && !hasAppFile) {
      if (webURL && appURL) {
        toastFn(
          "error",
          "Both banners already exist. Please upload a new banner to replace them."
        );
      } else if (webURL && !appURL) {
        toastFn(
          "error",
          "Please upload a file for App Banner."
        );
      } else if (!webURL && appURL) {
        toastFn(
          "error",
          "Please upload a file for Web Banner."
        );
      } else {
        toastFn("error", "Please upload a banner file.");
      }

      setIsDisabledButton(prev => ({
        ...prev,
        bannerDetails: false
      }));
      return;
    }

    const formData = new FormData();
    if (webBanner instanceof File) {
      formData.append("webBanner", webBanner);
    }
    if (appBanner instanceof File) {
      formData.append("appBanner", appBanner);
    }

    try {
      const result = await saveBannerDetails(formData, undefined, "formData");

      if (result?.success) {
        toastFn("success", "Banner added successfully!");
        setImages({
          webBanner: null,
          appBanner: null,
          webURL: "",
          appURL: ""
        });
        getContactDetailsFun();
      } else {
        toastFn("error", result?.message || "Failed to add banner");
      }
    } catch (error) {
      console.error("Error saving banner details:", error);
    } finally {
      setIsDisabledButton(prev => ({
        ...prev,
        bannerDetails: false
      }));
    }
  };


  const handleDeleteImage = async (type, ref) => {
    if (ref?.current) {
      ref.current.value = "";
    }

    setImages(prev => {
      const previewKey = type === "webBanner" ? "webURL" : "appURL";

      if (prev[previewKey]) {
        URL.revokeObjectURL(prev[previewKey]);
      }

      return {
        ...prev,
        [type]: null,
        [previewKey]: ""
      };
    });

    try {

      const formData = new FormData();
      formData.append(type === "webBanner" ? "isDeleteWeb" : "isDeleteApp", true);

      const result = await saveBannerDetails(formData, undefined, "formData");

      if (result?.success) {
        toastFn("success", `${type === "webBanner" ? "Web" : "App"} banner deleted`);
      } else {
        toastFn("error", result?.message || "Failed to delete banner");
      }
    } catch (error) {
      console.error("Delete banner error:", error);
      toastFn("error", "Something went wrong while deleting banner");
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Skeleton height="350px" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>

      {/* ── Rate Hide/Show ── */}
      <SectionCard>
        <SectionTitle>Rate Hide/Show</SectionTitle>
        <SectionBody>
          <RateToggleGrid>
            {addFields?.rateHideShow?.map((item, index) =>
              Object.keys(RATE_LABELS).map((key) => (
                <RateItemToggle key={key}>
                  <Switch
                    checked={!!item[key]}
                    onChange={(checked) =>
                      handleUpdate("rateHideShow", index, checked, null, key)
                    }
                    size="large"
                  />
                  {RATE_LABELS[key]}
                </RateItemToggle>
              ))
            )}
          </RateToggleGrid>
        </SectionBody>
      </SectionCard>

      {/* ── Contact Details ── */}
      <SectionCard>
        <SectionTitle>Contact Details</SectionTitle>
        <SectionBody>
          <ContactGrid>

            {/* Booking Numbers */}
            <ContactBlock>
              <BlockHeading>
                <i className="fa fa-phone" /><label>Booking Number</label>
                <AddBtn onClick={() => handleAdd("bookingNumber", "")}>+</AddBtn>
              </BlockHeading>
              {addFields?.bookingNumber?.map((item, i) => (
                <InputRow key={i}>
                  <FieldInput
                    type="text"
                    placeholder={`Booking Number ${i + 1}`}
                    value={item}
                    onChange={(e) => handleUpdate("bookingNumber", i, e.target.value)}
                  />
                  {i !== 0 && <RemoveBtn onClick={() => handleRemove("bookingNumber", i)}>−</RemoveBtn>}
                </InputRow>
              ))}
            </ContactBlock>

            {/* Addresses */}
            <ContactBlock>
              <BlockHeading>
                <i className="fa fa-map-marker" /><label>Address</label>
                <AddBtn onClick={() => handleAdd("addresses", { add: "", map: "" })}>+</AddBtn>
              </BlockHeading>
              {addFields?.addresses?.map((item, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <FieldTextArea
                    placeholder={`Enter Address ${i + 1}`}
                    value={item?.add}
                    onChange={(e) => handleUpdate("addresses", i, e.target.value, "add")}
                    rows={2}
                  />
                  <FieldInput
                    type="text"
                    placeholder="Paste Google Map Link"
                    value={item?.map}
                    onChange={(e) => handleUpdate("addresses", i, e.target.value, "map")}
                    style={{ marginTop: 4 }}
                  />
                  {i > 0 && (
                    <RemoveBtn
                      style={{ position: "absolute", top: 4, right: -28 }}
                      onClick={() => handleRemove("addresses", i)}
                    >−</RemoveBtn>
                  )}
                </div>
              ))}
            </ContactBlock>

            {/* Email */}
            <ContactBlock>
              <BlockHeading>
                <i className="fa fa-envelope" /><label>Email</label>
                <AddBtn onClick={() => handleAdd("email", "")}>+</AddBtn>
              </BlockHeading>
              {addFields?.email?.map((item, i) => (
                <InputRow key={i}>
                  <FieldInput
                    type="email"
                    placeholder={`Enter Email Address ${i + 1}`}
                    value={item}
                    onChange={(e) => handleUpdate("email", i, e.target.value)}
                  />
                  {i > 0 && <RemoveBtn onClick={() => handleRemove("email", i)}>−</RemoveBtn>}
                </InputRow>
              ))}
            </ContactBlock>

            {/* Social Media */}
            <ContactBlock>
              <BlockHeading>
                <i className="fa fa-facebook" /><label>Social Media</label>
                <AddBtn onClick={() => handleAdd("socialMedia", { nam: "", url: "" })}>+</AddBtn>
              </BlockHeading>
              {addFields?.socialMedia?.map((item, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <FieldTextArea
                    placeholder={`Enter social media name ${i + 1}`}
                    value={item?.nam}
                    onChange={(e) => handleUpdate("socialMedia", i, e.target.value, "nam")}
                    rows={2}
                  />
                  <FieldInput
                    type="text"
                    placeholder="Enter social media url"
                    value={item?.url}
                    onChange={(e) => handleUpdate("socialMedia", i, e.target.value, "url")}
                    style={{ marginTop: 4 }}
                  />
                  {i > 0 && (
                    <RemoveBtn
                      style={{ position: "absolute", top: 4, right: -28 }}
                      onClick={() => handleRemove("socialMedia", i)}
                    >−</RemoveBtn>
                  )}
                </div>
              ))}
            </ContactBlock>
          </ContactGrid>

          {/* Marquee + WhatsApp */}
          <MarqueeGrid>
            <div>
              <FieldLabel><strong>MarQuee Top :</strong></FieldLabel>
              <FieldTextArea
                cols={30} rows={3}
                value={addFields?.marquee?.[0] ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddFields((p) => { const m = [...(p.marquee || [])]; m[0] = value; return { ...p, marquee: m }; });
                }}
              />
            </div>
            <div>
              <FieldLabel><strong>MarQuee Bottom :</strong></FieldLabel>
              <FieldTextArea
                cols={30} rows={3}
                value={addFields?.marquee?.[1] ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddFields((p) => { const m = [...(p.marquee || [])]; m[1] = value; return { ...p, marquee: m }; });
                }}
              />
            </div>
            <div>
              <FieldLabel><strong>WhatsApp Number</strong></FieldLabel>
              <WhatsAppRow>
                <i className="fa fa-whatsapp" />
                <FieldInput
                  type="text"
                  value={addFields?.whatsAppNo || ""}
                  onChange={(e) => setAddFields((p) => ({ ...p, whatsAppNo: e.target.value }))}
                />
              </WhatsAppRow>
            </div>
          </MarqueeGrid>
        </SectionBody>

        <FooterRow>
          <PrimaryButton onClick={handleSubmit} disabled={disabledButton?.userDetails}>
            {disabledButton?.userDetails ? "Saving…" : "Submit"}
          </PrimaryButton>
        </FooterRow>
      </SectionCard>

      {/* ── Advertise Banner ── */}
      <SectionCard>
        <SectionTitle>Advertise Banner</SectionTitle>
        <SectionBody>
          <BannerGrid>
            {[
              { type: "webBanner", ref: webRef, label: "Web Banner", urlKey: "webURL" },
              { type: "appBanner", ref: appRef, label: "Application Banner", urlKey: "appURL" },
            ].map(({ type, ref, label, urlKey }) => (
              <BannerBox key={type}>
                <BannerNote>Note: Please Upload Images with less than 1MB size</BannerNote>
                <UploadLabel>
                  <strong>{label} :</strong>
                  <input
                    type="file"
                    ref={ref}
                    onChange={(e) => handleImageUpload(e, type)}
                    style={{ marginTop: 6 }}
                  />
                </UploadLabel>
                <BannerPreview>
                  <BannerImg
                    src={images?.[urlKey] || "https://t2.starlinedashboard.in/img/noimage.png"}
                    alt={`${label} Banner`}
                  />
                  {images?.[urlKey] && (
                    <DeleteBannerBtn onClick={() => handleDeleteImage(type, ref)}>
                      <i className="fa fa-trash-o" />
                    </DeleteBannerBtn>
                  )}
                </BannerPreview>
              </BannerBox>
            ))}
          </BannerGrid>
        </SectionBody>

        <FooterRow>
          <PrimaryButton onClick={handleSubmitBanner} disabled={disabledButton?.bannerDetails}>
            {disabledButton?.bannerDetails ? "Saving…" : "Save Banner"}
          </PrimaryButton>
        </FooterRow>
      </SectionCard>

    </PageWrapper>
  );
};



export default UserDetails;
