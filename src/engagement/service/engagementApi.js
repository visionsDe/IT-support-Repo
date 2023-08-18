import request from "../lib/request";
import Cookie from "js-cookie";
import axios from "axios";

let clientId = Cookie.get('Client_Id') != undefined ? "/"+Cookie.get('Client_Id')+"/": ""
export const engagementCategoryListApi = async (url) => {
  try{
    const { data } = await request.get(clientId+url);
    return data;
  }
  catch(er){
    if(er?.response.data?.status.toLowerCase() == "error"){
      if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
        Cookie.set('token', "", { secure: true, sameSite:'none' });
        Cookie.set('role', "", { secure: true, sameSite:'none' });
        Cookie.set('profile', "", { secure: true, sameSite:'none' });
        return false
       }else{
          return er;
        }
    }
  }
  return false;
}

export const engagementCategoryCommentsApi = async (url) => {
  try{
    const { data } = await request.get(clientId+url);
    return data;
  }
  catch(er){
    if(er?.response.data?.status.toLowerCase() == "error"){
      if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
        Cookie.set('token', "", { secure: true, sameSite:'none' });
        Cookie.set('role', "", { secure: true, sameSite:'none' });
        Cookie.set('profile', "", { secure: true, sameSite:'none' });
       return false
         }else{
          return er;
        }
    }
   
  }
 
  return false;
}
export const engagementCategoryScoreApi = async (url) => {
  try{
    const { data } = await request.get(clientId+url);
    return data;
  }
  catch(er){
    if(er?.response.data?.status.toLowerCase() == "error"){
      if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
        Cookie.set('token', "", { secure: true, sameSite:'none' });
        Cookie.set('role', "", { secure: true, sameSite:'none' });
        Cookie.set('profile', "", { secure: true, sameSite:'none' });
      return false
     }else{
        return false;
      }
    }

  }
 
  return false;
}
export const getPulseValueApi = async (url) => {
  try{
    const { data } = await request.get(clientId+url);
    return data;
  }
  catch(er){
   if(er?.response.data?.status.toLowerCase() == "error"){
      if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
        Cookie.set('token', "", { secure: true, sameSite:'none' });
        Cookie.set('role', "", { secure: true, sameSite:'none' });
        Cookie.set('profile', "", { secure: true, sameSite:'none' });
        return false
        }else{
        return false;
      }
    }
  }
  return false;
}

export const sendEngagementCategoryRequest = async (url,payload) => {
  try{
    const { data } = await request.post(clientId+url,payload);
    return data;
  }
  catch(er){
    if(er?.response.data?.status.toLowerCase() == "error"){
      if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
        Cookie.set('token', "", { secure: true, sameSite:'none' });
        Cookie.set('role', "", { secure: true, sameSite:'none' });
        Cookie.set('profile', "", { secure: true, sameSite:'none' });
        return false
       }else{
        return false;
      }
    }
  }
  return false;
}

export const setPulseValueApi = async (url) => {
  try{
    const { data } = await request.post(clientId+url);
    return data;
  }
  catch(er){
   if(er?.response.data?.status.toLowerCase() == "error"){
        if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
          Cookie.set('token', "", { secure: true, sameSite:'none' });
          Cookie.set('role', "", { secure: true, sameSite:'none' });
          Cookie.set('profile', "", { secure: true, sameSite:'none' });
          return false
         }else{
          return er;
        }
    }
  }
  return false;
}

export const getEmployeeProfileApi = async (url) => {
  try{
    const { data } = await request.get(clientId+url);
    return data;
  }
  catch(er){
    if(er?.response.data?.status.toLowerCase() == "error"){
      if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
        Cookie.set('token', "", { secure: true, sameSite:'none' });
        Cookie.set('role', "", { secure: true, sameSite:'none' });
        Cookie.set('profile', "", { secure: true, sameSite:'none' });
        return false
       }else{
        return false;
      }
  }
  }
  return false;
}
export const getManagerDownlineListApi = async (url) => {
  try{
    const { data } = await request.get(clientId+url);
    return data;
  }
  catch(er){
    if(er?.response.data?.status.toLowerCase() == "error"){
      if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
        Cookie.set('token', "", { secure: true, sameSite:'none' });
        Cookie.set('role', "", { secure: true, sameSite:'none' });
        Cookie.set('profile', "", { secure: true, sameSite:'none' });
        return false
       }else{
        return false;
      }
    }
  }
  return false;
}

export const getIndividualEmployeeProfileApi = async (url) => {
  try{
    const { data } = await request.get(clientId+url);
    return data;
  }
  catch(er){
    if(er?.response.data?.status.toLowerCase() == "error"){
      if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
        Cookie.set('token', "", { secure: true, sameSite:'none' });
        Cookie.set('role', "", { secure: true, sameSite:'none' });
        Cookie.set('profile', "", { secure: true, sameSite:'none' });
        return false
       }else{
        return false;
      }
    }
  }
  return false;
}
export const getPulseCommentApi = async (url) => {
  try{
    const { data } = await request.get(clientId+url);
    return data;
  }
  catch(er){
    if(er?.response.data?.status.toLowerCase() == "error"){
      if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
        Cookie.set('token', "", { secure: true, sameSite:'none' });
        Cookie.set('role', "", { secure: true, sameSite:'none' });
        Cookie.set('profile', "", { secure: true, sameSite:'none' });
        return false
       }else{
        return false;
      }
  }
  }
  return false;
}
export const setPulseCommentApi = async (url ,payload) => {
  try{
    const { data } = await request.post(clientId+url ,payload);
    return data;
  }
  catch(er){
    if(er?.response.data?.status.toLowerCase() == "error"){
      if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
        Cookie.set('token', "", { secure: true, sameSite:'none' });
        Cookie.set('role', "", { secure: true, sameSite:'none' });
        Cookie.set('profile', "", { secure: true, sameSite:'none' });
        return false
       }else{
        return false;
      }
  }
  }
  return false;
}
const localRequest = axios.create({
  baseURL: `${process.env.REACT_APP_CHAT_SERVER_BASE_URL}`,
  headers:{
    'Content-Type': 'application/json',
  },
});
localRequest.interceptors.request.use((config)=>{
  const token = Cookie.get('token', { secure: true, sameSite:'none' });
  if(token){
      config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});
export const createSubscriptionApi = async (url ,payload) => {
  try{
    const { data } = await localRequest.post(url ,payload);
    return data;
  }
  catch(er){
    if(er?.response.data?.status.toLowerCase() == "error"){
      if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
        Cookie.set('token', "", { secure: true, sameSite:'none' });
        Cookie.set('role', "", { secure: true, sameSite:'none' });
        Cookie.set('profile', "", { secure: true, sameSite:'none' });
        return false
       }else{
        return false;
      }
  }
  }
  return false;
}
export const updateSubscriptionApi = async (url ,payload ) => {
  try{
    const { data } = await localRequest.post(url ,payload);
    return data;
  }
  catch(er){
    if(er?.response.data?.status.toLowerCase() == "error"){
      if(er?.response.data?.error_message.toLowerCase() == 'unauthorized'){
        Cookie.set('token', "", { secure: true, sameSite:'none' });
        Cookie.set('role', "", { secure: true, sameSite:'none' });
        Cookie.set('profile', "", { secure: true, sameSite:'none' });
        return false
       }else{
        return false;
      }
  }
  }
  return false;
}