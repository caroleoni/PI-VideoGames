import { configureStore } from '@reduxjs/toolkit';
import reducer from '../reducer/reducer.js';

const store = configureStore({
    reducer: reducer
})

export default store;