import { useState } from "react";
import { ALL_AUTHORS, UPDATE_AUTHOR } from "./queries";
import { useMutation } from "@apollo/client";

import { useDispatch } from "react-redux";
import { setErrorNotificationWithTimeout } from "../reducers/notificationReducer";

const Authors = (props) => {
    const dispatch = useDispatch()
    const [name, setName] = useState("")
    const [born, setBorn] = useState("")

    if (!props.show) {
        return null;
    }

    if (!props.authors) {
        return null;
    }

    const authors = props.authors;

    const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
        refetchQueries: [{ query: ALL_AUTHORS }],
        onError: (error) => {
            const messages = error.graphQLErrors.map(e => e.message).join('\n')
            console.log(error)
            dispatch(setErrorNotificationWithTimeout(messages, 5))
        }
    });

    const submit = async (event) => {
        event.preventDefault()
        const bornInt = parseInt(born, 10)

        updateAuthor({ variables: { name, setBornTo: bornInt } })

        setName("")
        setBorn("")
    }

    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>born</th>
                        <th>books</th>
                    </tr>
                    {authors.map((a) => (
                        <tr key={a.name}>
                            <td>{a.name}</td>
                            <td>{a.born}</td>
                            <td>{a.bookCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Set birthyear</h3>
            <form onSubmit={submit}>
                <div>
                    <label>
                        name
                        <select
                            value={name}
                            onChange={({ target }) => setName(target.value)}
                        >
                            <option value="" disabled>Select an author</option>
                            {authors.map((author) => (
                                <option key={author.name} value={author.name}>
                                    {author.name}
                                </option>
                            ))}
                        </select>
                    </label>

                </div>
                <div>
                    born
                    <input
                        value={born}
                        onChange={({ target }) => setBorn(target.value)}
                    />
                </div>
                <button type="submit">update author</button>
            </form >
        </div >
    );
};

export default Authors;
