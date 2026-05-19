import styled from "styled-components";
import {
  fluidType
} from "./index";

export const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadowCard};
  transition: ${({ theme }) => theme.transition};

  ${({ $hover }) =>
    $hover &&
    css`
      &:hover {
        box-shadow: ${({ theme }) => theme.colors.shadowCardHover};
        transform: translateY(-1px);
      }
    `}
    &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transpernet; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.borderStrong};
  }
`;

export const SectionTitle = styled.h5`
  ${fluidType("h4")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.colors.textTableHeader};
  background: ${({ theme }) => theme.colors.bgTableHeader};
  text-align: center;
  padding: 8px ${({ theme }) => theme.spacing.md};
  margin: 0;
  border-radius: ${({ theme }) => `${theme.radius.lg} ${theme.radius.lg} 0 0`};
`;

export const SectionBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
 
  @media (max-width: 576px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
 
  @media (max-width: 992px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 576px) { grid-template-columns: 1fr; }
`;

export const ContactBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.bgCard};
  padding:20px;
    box-shadow: ${({ theme }) => theme.colors.shadowCard};
  transition: ${({ theme }) => theme.transition};
    border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const BlockHeading = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
 
  label {
    ${fluidType("bodySm")}
    font-family: ${({ theme }) => theme.font.family};
    font-weight: ${({ theme }) => theme.font.weightSemiBold};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
  }
 
  i { color: ${({ theme }) => theme.colors.primary}; }
`;

export const AddBtn = styled.button`
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  line-height: 1;
  flex-shrink: 0;
 
  &:hover { transform: scale(1.1); }
`;

export const RemoveBtn = styled.button`
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.error};
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  line-height: 1;
  flex-shrink: 0;
  
  &:hover { background: #c62828; transform: scale(1.1); }
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const FieldInput = styled.input`
  flex: 1;
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1px solid ${({ theme }) => theme.colors.borderInput};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.font.family};
  ${fluidType("h4")}
  padding: 6px 9px;
  outline: none;
  transition: ${({ theme }) => theme.transition};
  width: 100%;
 
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:focus {
    border-color: ${({ theme }) => theme.colors.borderInputFocus};
    box-shadow: ${({ theme }) => theme.colors.shadowInput};
    background: ${({ theme }) => theme.colors.bgInputFocus};
  }
`;

export const FieldTextArea = styled.textarea`
  flex: 1;
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1px solid ${({ theme }) => theme.colors.borderInput};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.font.family};
  ${fluidType("h4")}
  padding: 6px 9px;
  outline: none;
  resize: vertical;
  transition: ${({ theme }) => theme.transition};
  width: 100%;
 
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:focus {
    border-color: ${({ theme }) => theme.colors.borderInputFocus};
    box-shadow: ${({ theme }) => theme.colors.shadowInput};
    background: ${({ theme }) => theme.colors.bgInputFocus};
  }
`;

// Rate Hide/Show
export const RateGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xxl};
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const RateItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  ${fluidType("bodyLg")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Marquee + WhatsApp row
export const MarqueeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
 
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

export const FieldLabel = styled.label`
  ${fluidType("bodyLg")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: block;
  margin-bottom: 4px;
`;

export const WhatsAppRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
 
  i { color: #25D366; font-size: 20px; }
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

// Banner
export const BannerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
 
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

export const BannerBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const BannerNote = styled.p`
  ${fluidType("caption")}
  font-family: ${({ theme }) => theme.font.family};
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  margin: 0;
  text-align: center;
`;

export const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const BannerPreview = styled.div`
  position: relative;
  display: inline-flex;
`;

export const BannerImg = styled.img`
  height: 100px;
  width: 100px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const DeleteBannerBtn = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.error};
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
 
  &:hover { transform: scale(1.1); }
`;

export const RateToggleGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: space-around;
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

export const RateItemToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeLg};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;

  .ant-switch-checked {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;