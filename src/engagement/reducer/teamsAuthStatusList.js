import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    teamsAuthStatus: false,
    teamsAuthClient: null
}
export const teamsAuthStatusSlice = createSlice({
    name:'teamsAuthStatus',
    initialState,
    reducers:{
        setTeamsAuthStatus(state,action){
            state.teamsAuthStatus = action.payload
        },
        setTeamsAuthClient(state,action){
            state.teamsAuthClient = action.payload
        },
    }
})
export const { setTeamsAuthStatus, setTeamsAuthClient } = teamsAuthStatusSlice.actions;
export default teamsAuthStatusSlice.reducer;