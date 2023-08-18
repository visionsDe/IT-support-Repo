import request from "../lib/request";
import Cookie from "js-cookie";
let clientId = Cookie.get('Client_Id') != undefined ? "/"+Cookie.get('Client_Id')+"/": "";
export const getEmployeeCardFilterService = async (url, payload) =>{
 
    try{
        const { data } = await request.post(clientId+url, payload)
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
export const getAdminDashboardFilterByService = async (url) =>{
 
    try{
        const { data } = await request.get(clientId+url)
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
export const getAdminDashboardEmployeeListService = async (url) => {
    try{
        const { data } = await request.get(clientId+url)
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

export const getAdminDashboardEmployeeGetService = async (url) => {
    try{
        const { data } = await request.get(clientId+url)
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