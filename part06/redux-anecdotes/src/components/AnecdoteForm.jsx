import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const NewAnecdote = () => {
    const dispatch = useDispatch()

    const add = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        dispatch(addAnecdote(content))

        dispatch(setNotificationWithTimeout((content + ' added'), 5))
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={add}>
                <input name="anecdote" />
                <button type="submit">add</button>
            </form>
        </div>
    )
}

export default NewAnecdote
