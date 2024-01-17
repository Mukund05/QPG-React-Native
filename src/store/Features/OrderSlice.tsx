import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  order: [],
  isLoading: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder: (state:any, action) => {
      const newItem = action.payload;
      
      // Check if the item with the same properties already exists
      const existingItem = state.order.find(
        (item:any) =>
          item.SchoolItem.label === newItem.SchoolItem.label &&
          item.ClassItem.label === newItem.ClassItem.label &&
          item.SubjecItem.label === newItem.SubjecItem.label
      );

      if (existingItem) {
        // If the item already exists, update its quantity
        existingItem.quantity += newItem.quantity;
      } else {
        // If the item doesn't exist, add it
        state.order.push(newItem);
      }
    },
    deleteOrder: (state, action) => {
      const itemId = action.payload;
      // console.log('ITEM ID',itemId)
      state.order = state.order.filter((item:any) => item.id !== itemId.id);
    },
    updateQuantity: (state, action) => {
      const { itemId, newQuantity } = action.payload;
      const itemToUpdate:any = state.order.find((item:any) => item.id === itemId);
      if (itemToUpdate) {
        itemToUpdate.quantity = newQuantity;
      }
    },
  },
});

export const { addOrder, deleteOrder,updateQuantity } = orderSlice.actions;
export default orderSlice.reducer;
