import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Notification from "./components/Notification"
import LoginForm from "./components/LoginForm"
import Recommendation from "./components/Recommendations"

import { useSubscription, useApolloClient, useQuery } from "@apollo/client";

import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from "./components/queries";
import { useDispatch } from "react-redux";
import { setNotificationWithTimeout } from "./reducers/notificationReducer";

const App = () => {
    const [page, setPage] = useState("authors");
    const [token, setToken] = useState(null)
    const client = useApolloClient()
    const dispatch = useDispatch()

    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
    }

    //Maybe combine the two so theres no return null's?
    const NotLoggedIn = () => {
        if (!token) {
            useSubscription(BOOK_ADDED, {
                onData: ({ data }) => {
                    console.log(data)
                    dispatch(setNotificationWithTimeout(`Book ${data.data.bookAdded.title} by ${data.data.bookAdded.author.name} added`, 5))
                }
            })
            return (
                <>
                    <>
                        <button onClick={() => setPage("authors")}>authors</button>
                        <button onClick={() => setPage("books")}>books</button>
                        <button onClick={() => setPage("login")}>login</button>
                    </>
                    {
                        page === "authors" && (
                            <Authors show={page === "authors"} authors={authorsResult.data.allAuthors} />
                        )
                    }
                    {
                        page === "books" && (
                            <Books show={page === "books"} books={booksResult.data.allBooks} />
                        )
                    }
                    {
                        page === "login" && (
                            <LoginForm
                                setToken={setToken}
                                setPage={setPage}
                            />
                        )
                    }
                </>
            )
        } else { return null }
    }

    const LoggedIn = () => {
        if (token) {
            useSubscription(BOOK_ADDED, {
                onData: ({ data }) => {
                    console.log(data)
                    dispatch(setNotificationWithTimeout(`Book ${data.data.bookAdded.title} by ${data.data.bookAdded.author.name} added`, 5))
                }
            })
            return (
                <>
                    <>
                        <button onClick={() => setPage("authors")}>authors</button>
                        <button onClick={() => setPage("books")}>books</button>
                        <button onClick={() => setPage("add")}>add book</button>
                        <button onClick={() => setPage("recommend")}>recommend</button>
                        <button onClick={logout}>logout</button>
                    </>

                    {
                        page === "authors" && (
                            <Authors show={page === "authors"} authors={authorsResult.data.allAuthors} />
                        )
                    }
                    {
                        page === "books" && (
                            <Books show={page === "books"} books={booksResult.data.allBooks} />
                        )
                    }
                    {
                        page === "recommend" && (
                            <Recommendation show={page === "recommend"} books={booksResult.data.allBooks} />
                        )
                    }
                    {page === "add" && <NewBook show={page === "add"} />}
                </>
            )
        } else { return null }
    }


    const authorsResult = useQuery(ALL_AUTHORS);
    const booksResult = useQuery(ALL_BOOKS);

    if (authorsResult.loading || booksResult.loading) {
        return <div>loading...</div>;
    }

    if (authorsResult.error) {
        return <div>server error while loading authors</div>;
    }
    if (booksResult.error) {
        return <div>server error while loading books</div>;
    }

    console.log(authorsResult)
    console.log(booksResult)



    return (
        <>
            <Notification />
            <NotLoggedIn />
            <LoggedIn />
        </>
    );
};

export default App;
