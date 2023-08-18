import axios from "axios";
import Cookie from "js-cookie";
const request = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
    headers:{
        'Content-Type': 'text/plain',                                                       
    },
});

request.interceptors.request.use((config)=>{
    const token = Cookie.get('token', { secure: true, sameSite:'none' });
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export function apiRequest(base,query ){
    if(query == null){
        return request(base);
    }else{
        return axios.get(base + query);
    }
}
export default request;

export const setTeamsIdApi = async (url) => {
    let result;
    try{
      const data = await request.post(url);
      return data;
    }
    catch(er){
      if(er?.response.data?.status.toLowerCase() == "error"){
        if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
          Cookie.set('token', "", { secure: true, sameSite:'none' });
          Cookie.set('role', "", { secure: true, sameSite:'none' });
          Cookie.set('profile', "", { secure: true, sameSite:'none' });
          return false
        }
        else{
          result = er;
        }
      }
     
    }
    return result;
  }