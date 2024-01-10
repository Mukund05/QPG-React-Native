import {configureStore} from '@reduxjs/toolkit';
import UserSlice from './Features/UserSlice';
import OrderSlice from './Features/OrderSlice';
import OrderData from './Features/OrderData';

const Store = configureStore({
  reducer: {
    user: UserSlice,
    order:OrderSlice,
    orderData: OrderData,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export default Store;