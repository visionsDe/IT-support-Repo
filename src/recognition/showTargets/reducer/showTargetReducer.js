import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    teamsTargetList:[],
}
export const ShowTargetSlice = createSlice({
    name:'showTarget',
    initialState,
    reducers: {
        setTeamsTargetList(state,action){
            state.teamsTargetList = action.payload
        }
    }
})
export const { setTeamsTargetList } = ShowTargetSlice.actions;
export default ShowTargetSlice.reducer;