import React from "react";
import { useSelector } from "react-redux";
import { parseInstrumentAndSide } from "@/utils";
import ProductRows from "./ProductRows";
import LiverateSocket from "../../socketHandler/LiverateSocket";
import Skeleton from "../../common/components/skeleton";
import {
  PageWrapper,
  Card,
  PageTitle,
  SectionLabel,
  PrimaryButton,
  IconButton,
  ActionBar,
  ActionGroup,
  CellText,
  DateText,
  ModalFooter,
  FormTableBody,
  FormTable,
  StyledTable,
  Thead,
  Th,
  Tbody,
  Tr
} from "../../common/styledComponents";

const MarketWatch = () => {
  const mainProducts = useSelector((state) => state.socket.symbols);
  if (!mainProducts || mainProducts.length === 0) return <Skeleton height="350px" />;
  const { bank, exchange } = mainProducts;
  const bankRateInfo = bank.reduce((acc, value,) => ({ ...acc, [`${value.src}`]: value }), {});

  const productMap = exchange.reduce((acc, p) => {
    acc[p.uid] = p;
    return acc;
  }, {});

  const resolveInstrument = (p) => {
    if (p.rt === "exchange" || p.rt === "product") {
      return parseInstrumentAndSide(p.con);
    }
    if (p.rt === "client") {
      return { instrument: p.idf, side: null };
    }
    return {
      instrument: p.src === "silver" ? "SILVERSPOT_I" : "GOLDSPOT_I",
      side: null,
    };
  };
  return (
    <>
      <LiverateSocket />
      <PageWrapper>
        <Card>
          {/* ── Toolbar ── */}

          <StyledTable>
            <Thead>
              <Tr $alt={true}>
                <Th>Symbol</Th>
                <Th>Bid</Th>
                <Th>Ask</Th>
                <Th>High</Th>
                <Th>Low</Th>
                <Th>Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {exchange.map((p, index) => {
                const { instrument, side } = resolveInstrument(p);
                return (
                  <ProductRows
                    key={index}
                    product={p}
                    bank={bankRateInfo[p.src]}
                    instrument={instrument}
                    side={side}
                    productMap={productMap}
                    bankRateInfo={bankRateInfo}
                  />
                );
              })}
            </Tbody>
          </StyledTable>
        </Card>
      </PageWrapper>
    </>
  );
};

export default MarketWatch;
