import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes, css } from "styled-components";
import { fluidType } from "../../styledComponents";

// ─────────────────────────────────────────────────────────────────────────────
// Animations
// ─────────────────────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────────────────────────────────────

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1040;
  background: rgba(10, 13, 26, 0.65);
  backdrop-filter: blur(3px);
  animation: ${fadeIn} 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

// Size variants via $size prop: "sm" | "md" | "lg" | "xl"
const sizeMap = {
  sm: "420px",
  md: "560px",
  lg: "760px",
  xl: "1060px",
};

const Dialog = styled.div`
  position: relative;
  z-index: 1050;
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
  width: 100%;
  max-width: ${({ $size }) => sizeMap[$size] || sizeMap.md};
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  /* xl modals: allow wider on big screens */
  ${({ $size }) =>
    $size === "xl" &&
    css`
      @media (min-width: 1200px) {
        max-width: 1100px;
      }
    `}
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `14px ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.bgTableHeader};
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  border-radius: ${({ theme }) =>
    `${theme.radius.xl} ${theme.radius.xl} 0 0`};
`;

const ModalTitle = styled.h5`
  ${fluidType("h4")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.colors.textTableHeader};
  margin: 0;
  letter-spacing: 0.3px;
`;

const CloseButton = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: ${({ theme }) => theme.radius.sm};
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  flex-shrink: 0;

  &:hover {
    background: rgba(244, 67, 54, 0.25);
    border-color: rgba(244, 67, 54, 0.5);
    color: #ff8a80;
    transform: scale(1.08);
  }
  &:active { transform: scale(0.95); }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  flex: 1;

  /* Thin scrollbar */
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }

  @media (max-width: 576px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Size resolver — maps old className ("modal-xl") → $size prop
// ─────────────────────────────────────────────────────────────────────────────
const resolveSize = (className = "") => {
  if (className.includes("modal-xl")) return "xl";
  if (className.includes("modal-lg")) return "lg";
  if (className.includes("modal-sm")) return "sm";
  return "md";
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const CommonModal = ({ show, children, title, onClose, className = "" }) => {
  // Lock body scroll while open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    if (show) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  if (!show) return null;

  const size = resolveSize(className);

  return createPortal(
    <Backdrop onClick={onClose}>
      {/* Stop clicks inside dialog from closing */}
      <Dialog
        $size={size}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <ModalHeader>
          <ModalTitle id="modal-title">{title}</ModalTitle>

          <CloseButton onClick={onClose} aria-label="Close modal">
            ✕
          </CloseButton>
        </ModalHeader>

        <ModalBody>{children}</ModalBody>
      </Dialog>
    </Backdrop>,
    document.body
  );
};

export default CommonModal;