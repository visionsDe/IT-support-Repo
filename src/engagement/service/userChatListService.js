import tokenRequest from "../lib/request";
import Cookie from "js-cookie";
import { redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTeamsLoginStatus } from "../reducer/teamsLoginStatusList";

let clientId = Cookie.get('Client_Id') != undefined ? "/"+Cookie.get('Client_Id')+"/": ""

export const addPerformanceNoteApi = async (url, payload) => {
  let result;
  try {
    const { data } = await tokenRequest.post(clientId+url, payload);
    return data;
  }
  catch (er) {
    if (er?.response.data?.error_message == "Unauthorized") {
      Cookie.set('token', "", { secure: true, sameSite:'none' });
      Cookie.set('role', "", { secure: true, sameSite:'none' });
      Cookie.set('profile', "", { secure: true, sameSite:'none' });
      return false
      }

  }
  return false;
}