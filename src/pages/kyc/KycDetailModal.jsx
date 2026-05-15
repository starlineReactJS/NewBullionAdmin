import React from "react";
import styled from "styled-components";
import CommonModal from "../../common/components/modal";

import {
    Badge,
    Text,
    NameText,
    CellText,
    IconButton,
} from "../../common/styledComponents";
import {ModalWrapper,HeaderCard,Avatar,HeaderContent,HeaderRight,SectionCard,SectionTitle,InfoGrid,InfoItem,Label,DocumentCard,DocumentLeft,DocumentIcon,DocumentTitle} from "../../common/styledComponents/kyc"

const KycDetailModal = ({ show, onClose, data, onDownload }) => {
    if (!data) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";

        return new Date(dateStr).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const val = (v) => v || "—";

    return (
        <CommonModal
            show={show}
            onClose={onClose}
            title="KYC Details"
            className="kyc-detail-modal"
        >
            <ModalWrapper>

                {/* HEADER */}
                <HeaderCard>
                    <Avatar>
                        {data.companyName?.[0] ||
                            data.user?.[0]?.toUpperCase() ||
                            "?"}
                    </Avatar>

                    <HeaderContent>
                        <NameText>
                            {val(data.companyName)}
                        </NameText>

                        <Text $color={({ theme }) => theme.colors.textSecondary}>
                            User : {val(data.user)}
                        </Text>
                    </HeaderContent>

                    <HeaderRight>
                        <Badge $variant="success">
                            Active
                        </Badge>

                        <Text
                            $size="12px"
                            $color={({ theme }) => theme.colors.textMuted}
                        >
                            {formatDate(data.modifiedDate)}
                        </Text>
                    </HeaderRight>
                </HeaderCard>

                {/* COMPANY INFO */}
                <SectionCard>
                    <SectionTitle>
                        Company Information
                    </SectionTitle>

                    <InfoGrid>
                        <InfoItem>
                            <Label>Company Name</Label>
                            <CellText>{val(data.companyName)}</CellText>
                        </InfoItem>

                        <InfoItem>
                            <Label>Partner Name</Label>
                            <CellText>{val(data.partnerName)}</CellText>
                        </InfoItem>

                        <InfoItem>
                            <Label>Partner Mobile</Label>
                            <CellText>{val(data.partnerMobile)}</CellText>
                        </InfoItem>

                        <InfoItem $full>
                            <Label>Company Address</Label>
                            <CellText>{val(data.companyAddress)}</CellText>
                        </InfoItem>
                    </InfoGrid>
                </SectionCard>

                {/* CONTACT */}
                <SectionCard>
                    <SectionTitle>
                        Contact Details
                    </SectionTitle>

                    <InfoGrid>
                        <InfoItem>
                            <Label>Mobile</Label>
                            <CellText>{val(data.mobile)}</CellText>
                        </InfoItem>

                        <InfoItem>
                            <Label>Email</Label>
                            <CellText>{val(data.mail)}</CellText>
                        </InfoItem>

                        <InfoItem>
                            <Label>Office Mobile 1</Label>
                            <CellText>{val(data.officeMobile1)}</CellText>
                        </InfoItem>

                        <InfoItem>
                            <Label>Office Mobile 2</Label>
                            <CellText>{val(data.officeMobile2)}</CellText>
                        </InfoItem>

                        <InfoItem $full>
                            <Label>Residence Address</Label>
                            <CellText>{val(data.residenceAddress)}</CellText>
                        </InfoItem>
                    </InfoGrid>
                </SectionCard>

                {/* BANK DETAILS */}
                <SectionCard>
                    <SectionTitle>
                        Bank Details
                    </SectionTitle>

                    <InfoGrid>
                        <InfoItem>
                            <Label>Bank Name</Label>
                            <CellText>{val(data.bankName)}</CellText>
                        </InfoItem>

                        <InfoItem>
                            <Label>Branch Name</Label>
                            <CellText>{val(data.branchName)}</CellText>
                        </InfoItem>

                        <InfoItem>
                            <Label>Account Number</Label>
                            <CellText>{val(data.accountNumber)}</CellText>
                        </InfoItem>

                        <InfoItem>
                            <Label>IFSC</Label>
                            <CellText>{val(data.ifsc)}</CellText>
                        </InfoItem>
                    </InfoGrid>
                </SectionCard>

                {/* TAX */}
                <SectionCard>
                    <SectionTitle>
                        Compliance & Tax
                    </SectionTitle>

                    <InfoGrid>
                        <InfoItem>
                            <Label>GST Number</Label>
                            <CellText>{val(data.gstNumber)}</CellText>
                        </InfoItem>

                        <InfoItem>
                            <Label>PAN Number</Label>
                            <CellText>{val(data.panNumber)}</CellText>
                        </InfoItem>

                        <InfoItem>
                            <Label>Reference</Label>
                            <CellText>{val(data.reference)}</CellText>
                        </InfoItem>
                    </InfoGrid>
                </SectionCard>

                {/* DOCUMENT */}
                {data.url && (
                    <DocumentCard>
                        <DocumentLeft>
                            <DocumentIcon>
                                <i className="fa fa-file-archive-o" />
                            </DocumentIcon>

                            <div>
                                <DocumentTitle>
                                    KYC Document
                                </DocumentTitle>

                                <Text>
                                    {data.name}
                                </Text>
                            </div>
                        </DocumentLeft>

                        <IconButton
                            $color="#00C48C"
                            $hoverColor="#00C48C"
                            $hoverBg="rgba(0,196,140,0.1)"
                            onClick={() => onDownload(data.url)}
                        >
                            <i className="fa fa-download" />
                        </IconButton>
                    </DocumentCard>
                )}
            </ModalWrapper>
        </CommonModal>
    );
};

export default KycDetailModal;


