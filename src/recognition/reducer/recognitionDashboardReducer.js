import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  dashboardTab: 'ShowTargets',
  employeeList:[],
  managerList:[],
  badgeList:[],
  userInfo:[]
}
export const recognitionDashboardSlice = createSlice({
  name: 'recognitionDashboard',
  initialState,
  reducers: {
    setUserInfo(state,action){
      state.userInfo = action.payload
    },
    setDashboardTab(state, action) {
      state.dashboardTab = action.payload
    },
    setEmployeeList(state,action){
      state.employeeList = action.payload
    },
    setManagerList(state,action){
      state.managerList = action.payload
    },
    setBadgeList(state,action){
      state.badgeList = action.payload
    }
  },
})

export const {
  setDashboardTab,
  setCompanyFeedTabData,
  setEmployeeList,
  setBadgeList,
  setManagerList,
  setUserInfo
} = recognitionDashboardSlice.actions
export default recognitionDashboardSlice.reducer
