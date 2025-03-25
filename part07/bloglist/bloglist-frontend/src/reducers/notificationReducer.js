import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: "",
    type: "",
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification(state, action) {
            return { ...state, message: action.payload, type: "blog" };
        },
        setErrorNotification(state, action) {
            return { ...state, message: action.payload, type: "error" };
        },
        resetNotification(state) {
            return { ...state, message: "", type: "" };
        },
    },
});

export const setNotificationWithTimeout = (content, timeout) => {
    return async (dispatch) => {
        dispatch(setNotification(content));
        const timeoutTransformation = timeout * 1000;
        setTimeout(() => dispatch(resetNotification()), timeoutTransformation);
    };
};

export const setErrorNotificationWithTimeout = (content, timeout) => {
    return async (dispatch) => {
        dispatch(setErrorNotification(content));
        const timeoutTransformation = timeout * 1000;
        setTimeout(() => dispatch(resetNotification()), timeoutTransformation);
    };
};

export const { setNotification, setErrorNotification, resetNotification } =
    notificationSlice.actions;
export default notificationSlice.reducer;
