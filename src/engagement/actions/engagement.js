// import { engagementPillars } from "../service/engagement";

// import request from "../lib/request";
// import { setEngagementPillars } from "../reducer/engagementPillars";
// import { Dispatch, SetStateAction } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
import { engagementCategoryListApi, engagementCategoryScoreApi, getPulseValueApi, setPulseValueApi, sendEngagementCategoryRequest, engagementCategoryCommentsApi, getEmployeeProfileApi, getManagerDownlineListApi, getIndividualEmployeeProfileApi, getPulseCommentApi, setPulseCommentApi, createSubscriptionApi, updateSubscriptionApi, deleteSubscriptionApi } from "../service/engagementApi";

export const engagementCategoryListAction = async (url) => {
    const response = await engagementCategoryListApi(url);
    return response;
}
export const engagementCategoryScoreAction = async (url) => {
    const response = await engagementCategoryScoreApi(url);
    return response;
}
export const getPulseValueAction = async (url) => {
    const response = await getPulseValueApi(url);
    return response;
}
export const sendEngagementCategoryRequestAction = async (url,payload) => {
    const response = await sendEngagementCategoryRequest(url,payload);
    return response;
}
export const setPulseValueAction = async (url) => {
    const response = await setPulseValueApi(url);
    return response;
}
export const engagementCategoryCommentsAction = async (url) => {
    const response = await engagementCategoryCommentsApi(url);
    return response;
}
export const getEmployeeProfileAction = async (url) => {
    const response = await getEmployeeProfileApi(url);
    return response;
}
export const getManagerDownlineListAction = async (url) => {
    const response = await getManagerDownlineListApi(url);
    return response;
}

export const getIndividualEmployeeProfileAction = async (url) => {
    const response = await getIndividualEmployeeProfileApi(url);
    return response;
}
export const getPulseCommentAction = async (url) => {
    const response = await getPulseCommentApi(url);
    return response;
}
export const setPulseCommentAction = async (url,payload) => {
    const response = await setPulseCommentApi(url,payload);
    return response;
}
export const createSubscriptionAction = async (url,payload) => {
    const response = await createSubscriptionApi(url,payload);
    return response;
}
export const updateSubscriptionAction = async (url,payload ) => {
    const response = await updateSubscriptionApi(url,payload );
    return response;
}
// export const deleteSubscriptionAction = async (url,payload ) => {
//     const response = await deleteSubscriptionApi(url,payload );
//     return response;
// }
