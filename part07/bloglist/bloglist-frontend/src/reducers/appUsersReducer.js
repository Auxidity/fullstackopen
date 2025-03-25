import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users";

const appUsersSlice = createSlice({
    name: "appUsers",
    initialState: [],
    reducers: {
        setUsers(state, action) {
            return action.payload;
        },
    },
});

export const initializeAppUsers = () => {
    return async (dispatch) => {
        const appUsers = await usersService.getAll();
        dispatch(setUsers(appUsers));
    };
};

export const { setUsers } = appUsersSlice.actions;
export default appUsersSlice.reducer;
