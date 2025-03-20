import { useContext } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createAnecdote } from "../requests"
import { useNotificationDispatch } from "../NotificationContext"
import { notificationWithTimeout } from "./Notification"

const AnecdoteForm = () => {
    const dispatch = useNotificationDispatch()
    const queryClient = useQueryClient()


    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (newAnecdote) => {
            //The two lines below do not trigger re-render for whatever reason. Firefox issue? This code is however used in the example so I included it commented out. Thats why invalidate is used.
            //const anecdotes = queryClient.getQueryData({ queryKey: ['anecdotes'] })
            //queryClient.setQueryData({ queryKey: ['anecdotes'] }, anecdotes.concat(newAnecdote))

            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })

            notificationWithTimeout(dispatch, `${newAnecdote.content} added`)
        },
        onError: () => {
            //Could set onError(error) as error, but in this case it would just say AxiosError code 400, which wouldn't describe much.
            notificationWithTimeout(dispatch, 'too short anecdote, must have length 5 or more')
        },
    })

    const onCreate = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        newAnecdoteMutation.mutate({ content, votes: 0 })
    }

    return (
        <div>
            <h3>create new</h3>
            <form onSubmit={onCreate}>
                <input name='anecdote' />
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm
