import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  order: [],
  isLoading: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.order.push(action.payload as never);
    },
    deleteOrder: (state, action) => {
      state.order = state.order.filter((item:any) => item.id !== action.payload);
    },
  },
});

export const {addOrder, deleteOrder} = orderSlice.actions;
export default orderSlice.reducer;
