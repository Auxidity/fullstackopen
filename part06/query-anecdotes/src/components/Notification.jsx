import { useContext } from 'react'
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1,
        marginBottom: 5
    }

    const notification = useNotificationValue()

    if (notification === '' || notification === undefined || notification === null) return null

    return (
        <div style={style}>
            {notification}
        </div>
    )
}

export const notificationWithTimeout = (dispatch, message) => {
    dispatch({ type: 'SET', payload: message })
    setTimeout(() => { dispatch({ type: 'RESET' }) }, 5000)
}

export default Notification

