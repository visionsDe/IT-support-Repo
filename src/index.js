import React, { createContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { pages, app } from "@microsoft/teams-js";
import { Button } from "@mui/material";

import { useGraphWithCredential, useTeamsUserCredential } from "@microsoft/teamsfx-react";

import {TeamsFx, TeamsUserCredential,createMicrosoftGraphClient} from "@microsoft/teamsfx";

import { Provider } from "react-redux";

import { store } from "./store";
import { useTeams } from "msteams-react-base-component";
export const TeamsUserContext = createContext();
const themes = createTheme({
  typography: {
    fontFamily: [
      "Helvetica",
    ].join(","),
  },
  palette: {
    type: "light",
    primary: {
      main: "#225FA0",
      dark: "#074487",
    },
    success:{
      main: "#46A800",
    },
    error:{
      main: "#FF3E3E",
    },
    neutral: {
      main: "#E3E3E3",
      contrastText: "#707070",
    },
    white: {
      main: "#ffffff",
      dark: "#fff",
    },
    black: {
      main: "#000",
      dark: "#000",
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
const Index = () => {
  const [getContext,setContext] = useState(null);
  const [outsideTeams, setOutsideTeams] = useState(null);
  const [{ inTeams, theme }] = useTeams({});
  useEffect(() => {
    if (inTeams != true && inTeams != undefined) {
        setOutsideTeams(true);
    }
    else if(inTeams == true){
      setOutsideTeams(false);
    }
}, [inTeams]);
useEffect(()=>{
  if(outsideTeams == false){
    setAppContext()
  }
},[outsideTeams])
  const setAppContext = () => {
    if (!app.isInitialized()) {
      app.initialize();
    }
    app.getContext().then((context) => {
      setContext(context);
    }).catch((err) => {
      console.error("Error getting context -> ", err);
    });
  }

  // const authConfig = {
  //   clientId: process.env.REACT_APP_CLIENT_ID,
  //   initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL,
  // }
  // const credential = new TeamsUserCredential(authConfig); 
  // const teamsfx1 = new TeamsFx();

// const gettingGraphRequest = async () => {
//   // await credential.login(["User.ReadBasic.All"]);
//   const graphClient = await createMicrosoftGraphClient(teamsfx1, ["User.ReadBasic.All"]);
//   let profile = await graphClient.api("/me").get();
//   setProfileData(profile);
// }
  
  return (
    <TeamsUserContext.Provider value={getContext}>
      <ThemeProvider theme={themes}>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </TeamsUserContext.Provider>
  )
}
root.render(<Index/>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
