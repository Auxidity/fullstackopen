import { useSelector } from "react-redux";

const Notification = () => {
    const { message, type } = useSelector((state) => state.notification);

    if (message === "" || message === undefined || message === null) {
        return null;
    }

    return <div className={type}>{message}</div>;
};

export default Notification;
