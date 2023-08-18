import { managerNotificationListAPI } from "../service/managerNotification";
export const getManagerNotificationAction = async (url, payload) => {
    const response = await managerNotificationListAPI(url, payload);
    return response;
}