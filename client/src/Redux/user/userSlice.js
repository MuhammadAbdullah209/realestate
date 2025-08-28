import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    currentUser: false,
    error: null,
    loading: false,
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        SignInStart(state) {
            state.loading = true;
        },
        SignInSuccess(state, action) {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        SignInFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        DeleteUserStart(state) {
            state.loading = true;
        },
        DeleteUserSuccess(state, action) {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        DeleteUserFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        SignOutStart(state) {
            state.loading = true;
        },
        SignOutSuccess(state, action) {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        SignOutFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { SignInStart, SignInSuccess, SignInFailure, DeleteUserStart, DeleteUserSuccess, DeleteUserFailure, SignOutStart, SignOutFailure, SignOutSuccess } = userSlice.actions;
export default userSlice.reducer;
