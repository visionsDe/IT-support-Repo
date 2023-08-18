import { sendRequest, getRequest, putRequest, deleteRequest } from "../../service/api";
import Cookie from "js-cookie";
let clientId = Cookie.get('Client_Id') != undefined ? "/"+Cookie.get('Client_Id')+"/": ""
const recognitionSendRequestAction = async (url, payload = null, bypassError = null) => {
    const data = await sendRequest(clientId+url,payload, bypassError);
    return data;
}
export const recognitionGetRequestAction = async (url, payload) => {
    const data = await getRequest(clientId+url,payload);
    return data;
}
export const recognitionPutRequestAction = async (url, payload) => {
    const data = await putRequest(clientId+url,payload);
    return data;
}
export const recognitionDeleteRequestAction = async (url) => {
    const data = await deleteRequest(clientId+url);
    return data;
}

export default recognitionSendRequestAction;