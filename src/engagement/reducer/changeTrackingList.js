import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    changeTracking:[]
}
export const trackingSlice = createSlice({
    name:'changeTracking',
    initialState,
    reducers:{
        setChangeTracking(state,action){
            state.changeTracking = action.payload
        },
    }
})

export const { setChangeTracking } = trackingSlice.actions;
export default trackingSlice.reducer;