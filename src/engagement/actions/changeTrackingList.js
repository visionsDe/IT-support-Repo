import { changeTrackingListAPI } from "../service/changeTracking";
export const getTrackingAction = async (url, payload) => {
    const response = await changeTrackingListAPI(url, payload);
    return response;
}