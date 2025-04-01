import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from "./queries";
import { useDispatch } from "react-redux";
import { setErrorNotificationWithTimeout } from "../reducers/notificationReducer";

const NewBook = (props) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [published, setPublished] = useState("");
    const [genre, setGenre] = useState("");
    const [genres, setGenres] = useState([]);
    const dispatch = useDispatch()

    //The material didn't go into printing the actual invalid args when many args are present. So its just picking the topmost error to print when
    //multiple are present (e.g. when attempting to submit empty book, it will complain first about lack of int value on published field,
    //and then give failure on adding an author, followed by failing to add the book itself). Im not really sure if its neccesary to be more 
    //specific than that, meaning it would give all those errors at once, so I won't implement it since it does complain about each error 
    //until there are no more errors (validation or otherwise).
    const [createBook] = useMutation(CREATE_BOOK, {
        refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
        onError: (error) => {
            const messages = error.graphQLErrors.map(e => e.message).join('\n')
            console.log(error)
            dispatch(setErrorNotificationWithTimeout(messages, 5))
        }
    });

    if (!props.show) {
        return null;
    }

    const submit = async (event) => {
        event.preventDefault();
        const publishedInt = parseInt(published, 10);
        console.log(publishedInt)
        createBook({ variables: { title, published: publishedInt, author, genres } });

        setTitle("");
        setPublished("");
        setAuthor("");
        setGenres([]);
        setGenre("");
    };

    const addGenre = () => {
        setGenres(genres.concat(genre));
        setGenre("");
    };

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    title
                    <input
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author
                    <input
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    published
                    <input
                        type="number"
                        value={published}
                        onChange={({ target }) => setPublished(target.value)}
                    />
                </div>
                <div>
                    <input
                        value={genre}
                        onChange={({ target }) => setGenre(target.value)}
                    />
                    <button onClick={addGenre} type="button">
                        add genre
                    </button>
                </div>
                <div>genres: {genres.join(" ")}</div>
                <button type="submit">create book</button>
            </form>
        </div>
    );
};

export default NewBook;

