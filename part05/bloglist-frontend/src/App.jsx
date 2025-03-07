import { useState, useEffect, useRef } from 'react'
import './index.css'
import components from './components/Notification'
const { Notification, ErrorNotification } = components
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
    const [blogs, setBlogs] = useState([])

    const [errorMessage, setErrorMessage] = useState(null)
    const [notificationMessage, setNotificationMessage] = useState(null)

    const [username, setUsername] = useState([])
    const [password, setPassword] = useState([])
    const [user, setUser] = useState(null)

    const blogFormRef = useRef()

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                username
                <input
                    data-testid="login-username"
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    data-testid="login-password"
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
        </form>
    )

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
            setNotificationMessage(user.username + ' succesfully logged in')
            setTimeout(() => setNotificationMessage(null), 3000)
        } catch (exception) {
            setErrorMessage('Wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()

        try {
            window.localStorage.removeItem('loggedBlogappUser')
            blogService.setToken(null)
            setUser(null)
        } catch (exception) {
            setErrorMessage(exception)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const logoutButton = () => {
        return (
            <div>
                <span>{user.username} logged in</span>
                <button onClick={handleLogout}>Logout</button>
            </div>
        )
    }

    const addBlog = (blogObject) => {
        blogFormRef.current.toggleVisibility()
        blogService
            .create(blogObject)
            .then(returnedBlog => {
                setBlogs(prevBlogs => [...prevBlogs, returnedBlog])
                const title = returnedBlog.title
                const author = returnedBlog.author

                setNotificationMessage('A new blog ' + title + ' by ' + author + ' added')
                setTimeout(() => setNotificationMessage(null), 3000)
            })
            .catch(error => {
                console.log(error.response.data.error)
                setErrorMessage(error.response.data.error)
                setTimeout(() => setErrorMessage(null), 5000)
            })
    }

    const renderBlogs = () => {
        const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

        return sortedBlogs.map(blog => (
            <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                handleDelete={handleDelete}
                user={user}
            />
        ))
    }

    const handleLike = (blogid) => {
        const blogToUpdate = blogs.find(blog => blog.id === blogid)
        const updatedBlog = {
            ...blogToUpdate,
            likes: blogToUpdate.likes + 1
        }

        blogService
            .update(blogid, updatedBlog)
            .then(returnedBlog => {
                setBlogs(blogs.map(blog => blog.id !== blogid ? blog : returnedBlog))
            })
            .catch(error => {
                console.log(error.response.data.error)
                setErrorMessage(error.response.data.error)
                setTimeout(() => setErrorMessage(null), 5000)
            })
    }

    const handleDelete = (blogToDelete) => {
        const isConfirmed = window.confirm('Remove blog ' + blogToDelete.title + ' by ' + blogToDelete.author)

        if (isConfirmed) {
            blogService
                .remove(blogToDelete.id)
                .then(() => {
                    setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
                })
                .catch(error => {
                    console.log(error.response.data.error)
                    setErrorMessage(error.response.data.error)
                    setTimeout(() => setErrorMessage(null), 5000)
                })
        }
    }

    return (
        <div>
            <h2>blogs</h2>
            <Notification message={notificationMessage} />
            <ErrorNotification message={errorMessage} />

            {user === null ?
                loginForm() :
                (
                    <div>
                        {logoutButton()}
                        <Togglable buttonLabel='new blog' ref={blogFormRef}>
                            <BlogForm
                                createBlog={addBlog}
                            />
                        </Togglable>
                        <p />
                        {renderBlogs()}
                    </div>
                )
            }
        </div >
    )
}

export default App
