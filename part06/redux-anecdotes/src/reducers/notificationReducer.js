import { createSlice } from "@reduxjs/toolkit";

const initialState = ''

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    //Do not touch the state arg. It does internally magic that isn't shown outside always.
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        resetNotification(state) {
            return ''
        }
    },
})

export const setNotificationWithTimeout = (content, timeout) => {
    return async dispatch => {
        dispatch(setNotification(content))
        //So that arg timeout can be given in seconds,
        //we convert it to setTimeout format equivalent (= multiply by 1000)
        const timeoutTransformation = timeout * 1000
        setTimeout(() => dispatch(resetNotification()), timeoutTransformation)
    }
}

export const { setNotification, resetNotification } = notificationSlice.actions
export default notificationSlice.reducer
