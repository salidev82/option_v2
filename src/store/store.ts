import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userSlice from './reducers/userSlice'
import optionsFilterSlice from './reducers/OptionFilterSlice'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import siteConfigReducer from './reducers/siteConfigReducer';
import CoveredFilterSlice from './reducers/CoveredFilterSlice';
import ArbitrageFilterSlice from './reducers/ArbitrageFilter.Slice';
import MarriedPutFilterSlice from './reducers/MarriedPutFilterSlice';
import BullCallSpreadFilterSlice from './reducers/BullCallSpreadFilterSlice';
import ConversionFilterSlice from './reducers/ConversionFilterSlice';
import PositionsFilterSlice from './reducers/PositionsFilterSlice';

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    user: userSlice,
    optionsFilter: optionsFilterSlice,
    coveredFilter: CoveredFilterSlice,
    arbitrageFilterSlice: ArbitrageFilterSlice,
    MarriedPutFilterSlice: MarriedPutFilterSlice,
    BullCallSpreadFilterSlice: BullCallSpreadFilterSlice,
    conversionFilterSlice: ConversionFilterSlice,
    PositionsFilterSlice : PositionsFilterSlice,
    config: siteConfigReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store)


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch