import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    graphProfileUrl:[]
}

export const graphProfileUrlSlice = createSlice({
    name:'graphProfileUrl',
    initialState,
    reducers:{
        setGraphProfileUrl(state,action){
            state.graphProfileUrl = action.payload
        }
    }
})

export const { setGraphProfileUrl } = graphProfileUrlSlice.actions;
export default graphProfileUrlSlice.reducer;