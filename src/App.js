import React, { useContext, useEffect, useState } from "react";
// import { Provider, teamsTheme, Loader } from "@fluentui/react-northstar";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./commonPages/login/login";
import EmployeeDashboard from "./engagement/pages/employee-dashboard";
import ManagerDashboard from "./engagement/pages/manager-dashboard";
import AdminDashboard from "./engagement/pages/admin-dashboard";
import Profile from "./engagement/pages/profile";
import ErrorPage from "./engagement/pages/pageError";
import Protected, { LoginRoute , AuthGuard} from './commonComponents/nav/Protected';
import Recognition from "./recognition/Recognition";
import { EmployeeDashboard as RecognitionEmployeeDashboard } from "./recognition/pages/EmployeeDashboard";
import { SnackbarProvider } from "notistack";
import { pages, app, teams } from "@microsoft/teams-js";
import { TeamsUserContext } from './index';
import Cookie from "js-cookie";
import { useTeamsFx } from "@microsoft/teamsfx-react";
import config from "./lib/config";
import { TeamsFxContext } from "./Context";
function App() {
  const { loading, theme, themeString, teamsfx } = useTeamsFx({
    initiateLoginEndpoint: config.initiateLoginEndpoint,
    clientId: config.clientId,
  });
return (
  <TeamsFxContext.Provider value={{theme, themeString, teamsfx}}>
    {/* <Provider theme={theme || teamsTheme} styles={{ backgroundColor: "#eeeeee" }}> */}
      <SnackbarProvider>
        <Router>
          <Routes>
            <Route element={<LoginRoute />}>
              <Route path="/login" element={<Login />} />
              <Route exact path="/" element={<Login />} />
            </Route>

            {/* == == Login check == ======== */}
            <Route element={<AuthGuard />}>
              <Route element={<EmployeeDashboard/>} path="/employee-dashboard" />
              {/* <Route path="/recognition/employee-dashboard" element={<RecognitionEmployeeDashboard />} /> */}
              <Route path="/recognition/employee-dashboard" element={<Recognition />} />
            </Route>
            <Route element={<Protected role="manager" />}>
              <Route element={<ManagerDashboard/>} path="/manager-dashboard"/>
              <Route element={<Profile/>} path="/profile/:id"/>
              <Route path="/recognition/manager-dashboard" element={<Recognition />} />
            </Route>
            <Route element={<Protected role="admin" />}>
              <Route element={<AdminDashboard/>} path="/admin-dashboard"/>
              <Route element={<Profile/>} path="/admin/profile/:id"/>
            </Route>
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </SnackbarProvider>
     {/* </Provider> */}
   </TeamsFxContext.Provider>
  );
}

export default App;
