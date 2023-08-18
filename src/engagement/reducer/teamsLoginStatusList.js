import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    teamsLoginStatus: false
}
export const teamsLoginStatusSlice = createSlice({
    name:'teamsLoginStatus',
    initialState,
    reducers:{
        setTeamsLoginStatus(state,action){
            state.teamsLoginStatus = action.payload
        }
    }
})
export const { setTeamsLoginStatus } = teamsLoginStatusSlice.actions;
export default teamsLoginStatusSlice.reducer;