import request, { setTeamsIdApi } from "../engagement/lib/request";
import Cookie from "js-cookie";
export const LoginApi = async(cred ,clientId) => {
    const { data } = await request.post(encodeURI(clientId) +'/auth/login', cred);
    return data;
};
export const setTeamsIdAction = async(url ,clientId) => {
    const { data } = await setTeamsIdApi(encodeURI(clientId) + url);
    return data;
};

export const sendRequest = async(url, payload) => {
    try{
        const {data} = await request.post(url, payload)
        return data;
    }    catch(er){
        if(er?.response.data?.status.toLowerCase() == "error"){
            if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
              Cookie.set('token', "", { secure: true, sameSite:'none' });
              Cookie.set('role', "", { secure: true, sameSite:'none' });
              Cookie.set('profile', "", { secure: true, sameSite:'none' });
              return false
        
              }else{
                return er.message;
              }
        }else{
            return er.message;
        }
    }
}
