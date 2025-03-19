import { configureStore } from '@reduxjs/toolkit';
import contestReducer from './contestSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    contests: contestReducer,
    theme: themeReducer,
  },
}); 