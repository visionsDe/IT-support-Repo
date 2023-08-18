import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    employeeTrendGraph:[],
}
export const trendsSlice = createSlice({
    name:'trendGraph',
    initialState,
    reducers:{
        setEmployeeTrendGraph(state, action){
            state.employeeTrendGraph = action.payload
        },
    }
})

export const { setEmployeeTrendGraph } = trendsSlice.actions;
export default trendsSlice.reducer;