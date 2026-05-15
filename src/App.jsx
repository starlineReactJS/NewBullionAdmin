import React, { Suspense, createContext, lazy, useEffect,useState } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { getSignalRUrl} from "../Config.jsx";
import NotFound from "./pages/notfound";
import ProtectedRoute from "./layout/ProtectedRoute.jsx";
import PageTitle from "./common/PageTitle.jsx";
import * as signalR from "@microsoft/signalr";
import { adminRoutesConfig } from "./routes/adminRoutes.jsx";
import { routePermissionKeyMap } from "./constants/main.js";
import { useAuth } from "./context/AuthContext.jsx";
import { clientEmit } from "./constants/signalREndpoints.js";
import { updateSocketConnection, clearSocket } from "./redux/slices/socketSlice.js";
import { useDispatch } from "react-redux";
import { flattenPermissions } from "@/utils";

const Login = lazy(() => import("./pages/login"));
const AdminBullionLayout = lazy(() => import("./layout/AdminBullionLayout"));

export const SignalRContext = createContext();

function App() {
  const { auth: { permissions: userPermissions ,name:userName} } = useAuth();
  const dispatch = useDispatch();
  const [signalRConnector, setSignalRConnector] = useState(null);

  const permissions = flattenPermissions(userPermissions);

  const authorizedRoutes = adminRoutesConfig.map(item => {
    const accessKey = !item?.subMenu && routePermissionKeyMap[item.name.toLowerCase()];
    if (item.subMenu) {
      const updateSUB = item.subMenu
        .map(subItem => {
          const subAccessKey = routePermissionKeyMap[subItem.name.toLowerCase()];
          return {
            ...subItem,
            display: subAccessKey in permissions ? permissions[subAccessKey] : false
          };
        })
        .filter(sub => sub.display); 
      return {
        ...item,
        subMenu: updateSUB,
        display: updateSUB.length > 0
      };
    }

    return {
      ...item,
      display: accessKey in permissions ? permissions[accessKey] : false
    };
  });

  // Connect on login
  useEffect(() => {
    if (!userName) return; // user not logged in

    const url = getSignalRUrl(userName);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(url, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        connection.invoke(clientEmit, userName);
        dispatch(updateSocketConnection(true));
      })
      .catch(err => console.log("SignalR Connection Error:", err));

    connection.onreconnecting(() => dispatch(updateSocketConnection(false)));

    connection.onreconnected(() => {
      connection.invoke(clientEmit, userName);
      dispatch(updateSocketConnection(true));
    });

    setSignalRConnector(connection);
    return () => {
      if (connection) {
        connection.stop().catch(console.error);
      }
    };
  }, [userName]);

  // Disconnect on logout
  useEffect(() => {
    if (userName === null && signalRConnector) {
      signalRConnector.stop().catch(err => console.log("SignalR stop error:", err));
      dispatch(clearSocket());
      setSignalRConnector(null);
    }
  }, [userName, signalRConnector]);

  return (
    <>
      <SignalRContext.Provider value={signalRConnector}>
        <BrowserRouter>
          <ToastContainer position="top-right" autoClose={2000} pauseOnHover={false} pauseOnFocusLoss={false} />

          <Suspense fallback={<div className="loader"></div>}>
            <Routes>
              <>
                <Route path="/login" element={<>
                  <PageTitle title="Login - Bullion Admin" />
                  <Login />
                </>} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <AdminBullionLayout />
                    {/* <PageTitle title="Bullion Admin" /> */}
                  </ProtectedRoute>}>
                  {authorizedRoutes?.map((page, index) => {
                    if (!page?.display) return null;

                    // 🔹 NORMAL PAGES
                    if (!page.subMenu) {
                      return (
                        <Route
                          key={index}
                          path={page.path}
                          element={
                            <>
                              <PageTitle title={page.title || "Bullion Admin"} />
                              {page.element}
                            </>
                          }
                        />
                      );
                    }

                    // 🔥 JEWELLERY PARENT ROUTE
                    return (
                      <Route key={index} path={page.path} element={<Outlet />}>
                        {page.subMenu.map((sub, subIndex) => {
                          if (!sub?.display) return null;
                          return (
                            <Route
                              key={subIndex}
                              path={sub.path}
                              element={
                                <>
                                  <PageTitle title={sub.title ||" Bullion Admin"} />
                                  {sub.element}
                                </>
                              }
                            />
                          );
                        })}
                      </Route>
                    );
                  })}
                </Route>
                <Route path="*" element={<NotFound />} />
              </>
            </Routes>
          </Suspense>

        </BrowserRouter>
      </SignalRContext.Provider>
    </>
  );
}

export default App;
