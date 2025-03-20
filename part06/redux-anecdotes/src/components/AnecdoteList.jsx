import { useSelector, useDispatch } from 'react-redux'
import { updateAnecdoteVotes } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
    return (
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleClick}>vote</button>
            </div>
        </div>
    )
}

const Anecdotes = () => {
    const dispatch = useDispatch()

    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)

    const filteredAnecdotes = filter === 'ALL'
        ? anecdotes
        : anecdotes.filter(anecdote =>
            anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )

    const onClick = (anecdote) => {
        dispatch(updateAnecdoteVotes(anecdote))
        dispatch(setNotificationWithTimeout(('You voted ' + anecdote.content), 5))
    }

    return (
        <div>
            {filteredAnecdotes.map(anecdote => (
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleClick={() => onClick(anecdote)}
                />
            ))}
        </div>
    )
}

export default Anecdotes
