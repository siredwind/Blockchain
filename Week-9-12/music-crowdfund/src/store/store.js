import { configureStore } from "@reduxjs/toolkit";

import provider from "./reducers/provider";
import token from "./reducers/token";
import mc from "./reducers/mc";

export const store = configureStore({
    reducer: {
        provider,
        token,
        mc
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});