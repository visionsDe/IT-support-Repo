import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    adminNotification:[]
}
export const adminNotificationSlice = createSlice({
    name:'adminNotification',
    initialState,
    reducers:{
        setAdminNotification(state,action){
            state.adminNotification = action.payload
        },
    }
})

export const { setAdminNotification } = adminNotificationSlice.actions;
export default adminNotificationSlice.reducer;