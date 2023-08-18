import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    adminEmployeesCardList:[]
}
export const adminEmployeesCardListSlice = createSlice({
    name:'adminEmployeesCardList',
    initialState,
    reducers:{
        setAdminEmployeesCardList(state,action){
            state.adminEmployeesCardList = action.payload
        },
    }
})

export const { setAdminEmployeesCardList } = adminEmployeesCardListSlice.actions;
export default adminEmployeesCardListSlice.reducer;