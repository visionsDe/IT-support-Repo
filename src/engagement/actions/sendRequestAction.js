import { sendRequest } from "../../service/api";
import Cookie from "js-cookie";
let clientId = Cookie.get('Client_Id') != undefined ? "/"+Cookie.get('Client_Id')+"/": ""
const sendRequestAction = async (url, payload) => {
    const data = await sendRequest(clientId+url,payload);
    return data;
}
export default sendRequestAction;