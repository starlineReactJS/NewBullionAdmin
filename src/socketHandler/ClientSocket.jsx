import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as signalR from "@microsoft/signalr";
import { SignalRContext } from "../App";
import { clientEmit, activeUsers, instrumentDetails, symbolDetails, highLowDetails } from "../constants/signalREndpoints";
import { setInstrumentDetails, setSymbolDetails, updateActiveUser } from "../redux/slices/socketSlice";
import { useSignalRCompressJson } from "../common/hooks/useSignalRCompressJson";
import { highLowStore } from "../socketStore/highLowStore";
import { useAuth } from "../context/AuthContext";

export default function ClientSocket() {
   const { auth: {name:userName} } = useAuth();
  const dispatch = useDispatch();
  const signalRContext = useContext(SignalRContext);
  const connectionState = useSelector(store => store.socket.socketConnection);
  const { decode } = useSignalRCompressJson();

  const handleActiveUsers = (data) => {
    dispatch(updateActiveUser(data));
  };

  const handelInstrumentDetails = (data) => {
    const d = decode(data);
    if (!d) return;
    dispatch(setInstrumentDetails(d));
  };

  const handelSymbolDetails = (data) => {
    const d = decode(data);
    d && dispatch(setSymbolDetails(d));
  };

  const onHighLow = (data) => {
    const d = decode(data);
    if (!d?.length) return;
    highLowStore.update(d);
  };

  useEffect(() => {
    if (signalRContext.state === signalR.HubConnectionState.Connected) {
      signalRContext.on(activeUsers, handleActiveUsers);
      signalRContext.on(instrumentDetails, handelInstrumentDetails);
      signalRContext.on(symbolDetails, handelSymbolDetails);
      signalRContext.on(highLowDetails, onHighLow);
      signalRContext.invoke(clientEmit, userName);
      // signalRContext.invoke(clienRatetEmit, userName);
    }
    // cleanup
    return () => {
      signalRContext.off(activeUsers, handleActiveUsers);
      signalRContext.off(instrumentDetails, handelInstrumentDetails);
      signalRContext.off(symbolDetails, handelSymbolDetails);
      signalRContext.off(highLowDetails, onHighLow);
    };
  }, [connectionState,userName]);
}
