import { createSlice } from "@reduxjs/toolkit";
import {
    setErrorNotificationWithTimeout,
    setNotificationWithTimeout,
} from "./notificationReducer";
import loginService from "../services/login";
import blogService from "../services/blogs";

const userSlice = createSlice({
    name: "user",
    initialState:
        JSON.parse(window.localStorage.getItem("loggedBlogappUser")) || null,
    reducers: {
        setUser(state, action) {
            return action.payload;
        },
        clearUser(state, action) {
            return null;
        },
    },
});

export const loginUser = (username, password) => {
    return async (dispatch) => {
        try {
            const user = await loginService.login({ username, password });
            window.localStorage.setItem(
                "loggedBlogappUser",
                JSON.stringify(user),
            );
            blogService.setToken(user.token);
            dispatch(setUser(user));
            dispatch(
                setNotificationWithTimeout(
                    `${user.username} succesfully logged in`,
                    5,
                ),
            );
        } catch (error) {
            console.log(error.response.data.error);
            dispatch(
                setErrorNotificationWithTimeout(error.response.data.error, 5),
            );
        }
    };
};

export const logoutUser = () => {
    return (dispatch) => {
        try {
            window.localStorage.removeItem("loggedBlogappUser");
            blogService.setToken(null);
            dispatch(clearUser());
        } catch (error) {
            console.log(error.response.data.error);
            dispatch(
                setErrorNotificationWithTimeout(error.response.data.error, 5),
            );
        }
    };
};

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

//This bit of code handles page reloads. It was keeping the user properly without this, but token disappeared on reloads.
const loggedUser = JSON.parse(window.localStorage.getItem("loggedBlogappUser"));
if (loggedUser && loggedUser.token) {
    blogService.setToken(loggedUser.token);
}
