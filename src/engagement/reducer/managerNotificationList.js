import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    managerNotification:[]
}
export const managerNotificationSlice = createSlice({
    name:'managerNotification',
    initialState,
    reducers:{
        setManagerNotification(state,action){
            state.managerNotification = action.payload
        },
    }
})

export const { setManagerNotification } = managerNotificationSlice.actions;
export default managerNotificationSlice.reducer;