import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        voteAnecdote(state, action) {
            const id = action.payload
            const anecdoteToChange = state.find(n => n.id === id)
            const changedAnecdote = {
                ...anecdoteToChange, votes: anecdoteToChange.votes + 1
            }

            const updatedState = state.map(anecdote => anecdote.id !== id ? anecdote : changedAnecdote)
            return updatedState.sort((a, b) => b.votes - a.votes)

        },
        appendAnecdote(state, action) {
            state.push(action.payload)
        },
        setAnecdotes(state, action) {
            return action.payload
        }
    },
})

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const addAnecdote = content => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createNew(content)
        dispatch(appendAnecdote(newAnecdote))
    }
}

export const updateAnecdoteVotes = content => {
    return async dispatch => {
        const updatedAnecdote = await anecdoteService.updateLikes(content)
        dispatch(voteAnecdote(updatedAnecdote.id))
    }
}

export const { voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer

/*
const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteReducer = (state = initialState, action) => {
    console.log('state now: ', state)
    console.log('action', action)

    switch (action.type) {
        case 'NEW_ANECDOTE':
            return [...state, action.payload]
        case 'VOTE':
            const id = action.payload.id
            const anecdoteToChange = state.find(n => n.id === id)
            const changedAnecdote = {
                ...anecdoteToChange, votes: anecdoteToChange.votes + 1
            }
            const updatedState = state.map(anecdote => anecdote.id !== id ? anecdote : changedAnecdote)
            return updatedState.sort((a, b) => b.votes - a.votes)

        default:
            return [...state].sort((a, b) => b.votes - a.votes)
    }
}

export const voteAnecdote = (id) => {
    return {
        type: 'VOTE',
        payload: { id }
    }
}

export const addAnecdote = (content) => {
    return {
        type: 'NEW_ANECDOTE',
        payload: {
            content: content,
            id: getId(),
            votes: 0
        }
    }
}

export default anecdoteReducer
*/
