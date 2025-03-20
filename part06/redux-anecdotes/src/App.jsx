import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Anecdotes from "./components/AnecdoteList"
import NewAnecdote from "./components/AnecdoteForm"
import Filter from "./components/Filter"
import Notification from "./components/Notification"

import { initializeAnecdotes } from './reducers/anecdoteReducer'

const App = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeAnecdotes())
    }, [])

    return (
        <div>
            <Notification />
            <h2>Anecdotes</h2>
            <Filter />
            <Anecdotes />
            <NewAnecdote />
        </div>
    )
}

export default App
