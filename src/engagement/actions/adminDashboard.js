
import { getEmployeeCardFilterService, getAdminDashboardFilterByService, getAdminDashboardEmployeeListService, getAdminDashboardEmployeeGetService } from "../service/adminDashboard";
export const employeeCardFilterListAction = async(url,payload) =>{
    const response = await getEmployeeCardFilterService(url,payload)
    return response;
}
export const adminDashboardFilterByAction = async(url) =>{
    const response = await getAdminDashboardFilterByService(url)
    return response;
}
export const adminDashboardEmployeeListAction = async(url) =>{
    const response = await getAdminDashboardEmployeeListService(url)
    return response;
}
export const adminDashboardEmployeeGetAction = async(url) =>{
    const response = await getAdminDashboardEmployeeGetService(url)
    return response;
}