const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='phonebook'>
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const components = {Notification, ErrorNotification};
export default components;
