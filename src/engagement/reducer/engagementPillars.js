import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    engagementCategoryList:[],
    engagementCategoryScore:[],
    pulseValueList:[],
    employeeProfileData:{},
    engagementCategoryComments:[],
    engagementChangedValue:[],
    engagementCategories:[],
    ManagerDownlineList:[],
    individualEmployeeProfileData:{},
    pulseCommentList:{}
}
export const engagementCategorySlice = createSlice({
    name:'engagementCategory',
    initialState,
    reducers:{
        setEngagementCategory(state, action){
            state.engagementCategories = action.payload
        },
        setEngagementCategoryList(state, action){
            state.engagementCategoryList = action.payload
        },
        setEngagementCategoryScore(state, action){
            state.engagementCategoryScore = action.payload
        },
        setPulseValueList(state, action){
            state.pulseValueList = action.payload
        },
        setEngagementCategoryComments(state, action){
            state.engagementCategoryComments = action.payload
        },
        setEngagementChangedValue(state,action){
            state.engagementChangedValue = action.payload
        },
        setEmployeeProfileData(state,action){
            state.employeeProfileData = action.payload
        },
        getManagerDownlineList(state,action){
            state.ManagerDownlineList = action.payload
        },
        setIndividualEmployeeProfileData(state,action){
            state.individualEmployeeProfileData = action.payload
        },
        setPulseCommentList(state, action){
            state.pulseCommentList = action.payload
        },
    }
})

export const { setEngagementCategoryList, setEngagementCategoryScore, setPulseValueList, setEngagementCategoryComments, setEngagementChangedValue, setEmployeeProfileData, setEngagementCategory ,
    getManagerDownlineList,setIndividualEmployeeProfileData ,setPulseCommentList } = engagementCategorySlice.actions;
export default engagementCategorySlice.reducer;