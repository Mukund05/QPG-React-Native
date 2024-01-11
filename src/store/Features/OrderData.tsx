import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderData: [],
    loader: true
}

//used for storing history of placed orders
const orderDataSlice = createSlice({
    name: 'orderData',
    initialState,
    reducers: {
        setOrderData: (state, action) => {
            state.orderData = action.payload
            state.loader = false;
        },
    }
})

export const { setOrderData } = orderDataSlice.actions;
export default orderDataSlice.reducer;