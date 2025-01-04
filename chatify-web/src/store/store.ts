import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default storage is localStorage
import authReducer from '../redux/authSlice'; // Import the auth reducer




// Configure the store
const rootReducer = combineReducers({
    auth: authReducer
});

const persistConfig={
  key:"root",
  storage,
  version:1
}
const persistedReducer= persistReducer(persistConfig,rootReducer)


export const store=configureStore({
  
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
      serializableCheck:false
    }),
    devTools: process.env.NODE_ENV !== 'production',

})

export const persistor=persistStore(store)
