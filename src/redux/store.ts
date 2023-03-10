import { AnyAction, configureStore, ThunkMiddleware } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import UserReducer from '../redux/Reducers/UserReducer'

const store:ToolkitStore<{
    user: any;
}, AnyAction, [ThunkMiddleware<{
    user: any;
}, AnyAction, undefined>]> = configureStore({ reducer: {
    user: UserReducer
}})
export default store
export type RootState = ReturnType<typeof store.getState>;