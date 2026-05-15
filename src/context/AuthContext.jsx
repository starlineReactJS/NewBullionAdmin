import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearSocket } from "../redux/slices/socketSlice";
import { rateStore } from "../socketStore/rateStore";
import { highLowStore } from "../socketStore/highLowStore";
import { clearAuthData, setAuthData } from "../socketStore/authStore";
import { setSecureItem,getSecureItem,removeSecureItem } from "@/utils";

const STORAGE_KEY = "adminLoginRes";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [auth, setAuth] = useState(() => {
    // const stored = JSON.parse(localStorage.getItem("adminLoginRes"));
    const stored = getSecureItem(STORAGE_KEY);
    return stored
      ? {
          token: stored.token || null,
          name: stored.user || "",
          permissions: stored.access || {},
        }
      : {
          token: null,
          name: null,
          permissions: {},
        };
  });

  useEffect(() => {
    // const stored = JSON.parse(localStorage.getItem("adminLoginRes"));
    const stored = getSecureItem(STORAGE_KEY);
    if (stored) {
      setAuthData({
        token: stored.token,
        name: stored.user,
        permissions: stored.access || {}
      });
    }
  }, []);


  const login = (data) => {
    const authData = {
      token: data.token || null,
      name: data.user || "",
      permissions: data.access || {},
    };

    // localStorage.setItem("adminLoginRes", JSON.stringify(data));
    setSecureItem(STORAGE_KEY, data);
    setAuth(authData); // single state update
    setAuthData(authData); 
  };

  const logout = () => {
    // Clear Redux socket state
    dispatch(clearSocket());
    // Clear singleton stores
    rateStore.clearCache();
    highLowStore.clear();
    
    removeSecureItem(STORAGE_KEY);
    localStorage.clear();
    // localStorage.removeItem("adminLoginRes");
    setAuth({
      token: null,
      name: null,
      permissions: {},
    });
    clearAuthData();
  };


  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
