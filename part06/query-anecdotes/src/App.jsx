import AnecdoteForm from './components/AnecdoteForm'
import Notification, { notificationWithTimeout } from './components/Notification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useContext } from 'react'

import { useNotificationDispatch } from "./NotificationContext"

const App = () => {
    const queryClient = useQueryClient()
    const dispatch = useNotificationDispatch()

    const updateAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
        },
    })

    const handleVote = (anecdote) => {
        updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
        notificationWithTimeout(dispatch, `anecdote '${anecdote.content}' voted`)
    }

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        refetchOnWindowFocus: false
    })

    console.log(JSON.parse(JSON.stringify(result)))

    if (result.isLoading) {
        return <div>loading data...</div>
    }

    let anecdotes = []

    if (result.isSuccess) {
        anecdotes = result.data
    } else {
        return <div> anecdote service not available due to problems in server </div>
    }

    return (
        <div>
            <h3>Anecdote app</h3>

            <Notification />
            <AnecdoteForm />

            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
