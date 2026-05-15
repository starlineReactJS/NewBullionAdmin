import React, { useContext, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { SignalRContext } from "../App";
import { useSelector } from "react-redux";
import { rateStore } from "../socketStore/rateStore";
import { instrument, subscribeToRates, symbolDetails, unSubscribeToRates } from "../constants/signalREndpoints";
import { parseInstrument } from "@/utils";

export default function LiverateSocket() {
  const signalRContext = useContext(SignalRContext);
  const localStore = useSelector(store => store);
  const subscribedSymbols = localStore?.socket.instruments?.map(i => i?.ins);

  const onInstrument = (data) => {
    if (!data) return;
    const rate = parseInstrument(data);
    if (!rate?.instrument) return;
    rateStore.update(rate);
  };

  useEffect(() => {
    if (!signalRContext) return; 
    if (signalRContext.state === signalR.HubConnectionState.Connected && subscribedSymbols.length) {
      signalRContext.on(instrument, onInstrument);
      signalRContext.invoke(subscribeToRates, subscribedSymbols);
    }
    return () => {
      if (subscribedSymbols.length) {
        signalRContext.invoke(unSubscribeToRates, subscribedSymbols);
      }
      signalRContext.off(instrument, onInstrument);
    };
  }, [localStore?.socket?.socketConnection, localStore?.socket?.instruments]);
}

