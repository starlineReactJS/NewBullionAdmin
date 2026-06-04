import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Skeleton from "../skeleton";
import styled, { keyframes } from "styled-components";
import {
  Card,
  TableWrapper,
  StyledTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  EmptyStateWrapper,
  fluidType,
} from "../../styledComponents";
import { Spinner } from "react-bootstrap";


// ─────────────────────────────────────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────────────────────────────────────

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

// Draggable header cell
const DraggableTh = styled(Th)`
  cursor: grab;
  user-select: none;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  min-height: 44px;
`;

const EndOfResults = styled.p`
  ${fluidType("caption")}
  font-family: ${({ theme }) => theme.font.family};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  margin: 0;
  letter-spacing: 0.5px;

  &::before { content: "★ "; }
  &::after  { content: " ★"; }
`;

const CellContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  

  p {
    margin: 0;
    font-family: ${({ theme }) => theme.font.family};
    ${fluidType("label")}
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const EXCEL_SKIP_COLS = new Set(["Resend", "Delete", "Edit", "Image"]);

// ─────────────────────────────────────────────────────────────────────────────
// Sortable header cell
// ─────────────────────────────────────────────────────────────────────────────

const SortableHeader = ({ id, activeId, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <DraggableTh
      ref={setNodeRef}
      style={style}
      $isActive={id === activeId}
      {...attributes}
      {...listeners}
    >
      {children}
    </DraggableTh>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

const SortableTable = ({
  data,
  columnOrder,
  visibleColumns,
  activeId,
  setActiveId,
  handleDragEnd,
  mode = "",
  isLoading,
  isFetchingMore,
  hasMore,
  columnRender,
  enableColumnDrag = true,
}) => {
  const isExcel = mode === "excel";

  const visibleCols = columnOrder.filter((col) => {
    if (!visibleColumns[col]) return false;
    if (isExcel && EXCEL_SKIP_COLS.has(col)) return false;
    return true;
  });

  const tableContent = (
    <StyledTable>
      <Thead>
        <Tr $alt={true}>
          {visibleCols.map((col) =>
            enableColumnDrag ? (
              <SortableHeader key={col} id={col} activeId={activeId}>
                {col}
              </SortableHeader>
            ) : (
              <Th key={col}>{col}</Th>
            )
          )}
        </Tr>
      </Thead>

      <Tbody>
        {isLoading ? (
          <tr>
            <Td colSpan={visibleCols.length} style={{ padding: 0 }}>
              <Skeleton height="350px" />
            </Td>
          </tr>
        ) : data && data.length > 0 ? (
          data.map((item, index) => (
            <Tr key={index}>
              {visibleCols.map((col) => (
                <Td key={col}>
                  <CellContent>
                    {columnRender(col, item, mode)}
                  </CellContent>
                </Td>
              ))}
            </Tr>
          ))
        ) : (
          <tr>
            <Td colSpan={visibleCols.length}>
              <EmptyStateWrapper>
                No Records Found
              </EmptyStateWrapper>
            </Td>
          </tr>
        )}
      </Tbody>
    </StyledTable>
  );

  return (
    <>
      <TableWrapper>
        {enableColumnDrag ? (
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={(e) => setActiveId(e.active.id)}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveId(null)}
          >
            <SortableContext
              items={columnOrder}
              strategy={horizontalListSortingStrategy}
            >
              {tableContent}
            </SortableContext>
          </DndContext>
        ) : (
          tableContent
        )}
      </TableWrapper>
      {/* Footer: spinner or end-of-results */}
      {(isFetchingMore || (!hasMore && data?.length > 0)) && (
        <FooterRow>
          {isFetchingMore  && <Spinner animation="border" variant="info"/>}
          {!hasMore && data?.length > 0 && !isFetchingMore && (
            <EndOfResults>End of results</EndOfResults>
          )}
        </FooterRow>
      )}
    </>
  );
};

export default SortableTable;