import { useState, useEffect, useRef } from "react";
import "./index.css";
import Notification from "./components/Notification";
import Blog, { BlogList } from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import UsersList from "./components/User";
import { User } from "./components/User";

import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs, addBlog } from "./reducers/blogReducer";
import { loginUser, logoutUser } from "./reducers/userReducer";
import { initializeAppUsers } from "./reducers/appUsersReducer";

import { Routes, Route, Link } from "react-router-dom";

import { Navbar, Nav, Form } from "react-bootstrap";

const App = () => {
    const dispatch = useDispatch();

    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const blogFormRef = useRef();

    useEffect(() => {
        dispatch(initializeBlogs());
    }, []);

    useEffect(() => {
        dispatch(initializeAppUsers());
    }, []);

    const blogs = useSelector((state) => state.blogs);
    const user = useSelector((state) => state.user);
    const appUsers = useSelector((state) => state.appUsers);

    const Menu = () => {
        const padding = {
            paddingRight: 5,
        };
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#" as="span">
                                <Link style={padding} to="/">
                                    blogs
                                </Link>
                            </Nav.Link>
                            <Nav.Link href="#" as="span">
                                <Link style={padding} to="/users">
                                    users
                                </Link>
                            </Nav.Link>
                            <div className="menubar-text">
                                {user.username} logged in
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    };
    const loginForm = () => (
        <Form onSubmit={(event) => handleLogin(event, username, password)}>
            <Form.Group controlId="formUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                    data-testid="login-username"
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                    className="custom-input" // Use your pre-defined class from styles.css
                />
            </Form.Group>

            <Form.Group controlId="formPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    data-testid="login-password"
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                    className="custom-input" // Use your pre-defined class from styles.css
                />
            </Form.Group>

            <button type="submit" className="custom-btn">
                Login
            </button>
        </Form>
    );

    const handleLogin = (event, username, password) => {
        event.preventDefault();
        dispatch(loginUser(username, password));
        setUsername("");
        setPassword("");
    };

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const createBlog = (blogObject) => {
        blogFormRef.current.toggleVisibility();
        dispatch(addBlog(blogObject));
    };

    const renderBlogs = () => {
        if (!blogs || blogs.length === 0) {
            return <p>Loading blogs...</p>; // Error case...
        }
        return <BlogList blogs={blogs} />;
    };

    return (
        //Using react fragments even though the material hasn't gone through the use of them. They seem like a fitting solution to some of my self made issues (in past)
        //
        //As a side note, the addition of styles through Bootsrap made the webpages from loading instantly to taking a visible amount of time to load (almost 1000ms..)
        //Im not so certain how acceptable this is, but I haven't tackled with it since it is in the material directly.
        <div className="container custom-container">
            <h2>blogs</h2>
            <Notification />

            {user === null ? (
                loginForm()
            ) : (
                <>
                    <Menu />
                    <p />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    <Togglable
                                        buttonLabel="new blog"
                                        ref={blogFormRef}
                                    >
                                        <BlogForm createBlog={createBlog} />
                                    </Togglable>
                                    <p />
                                    {renderBlogs()}
                                </>
                            }
                        />
                        <Route
                            path="users/:id"
                            element={<User users={appUsers} />}
                        />
                        <Route
                            path="blogs/:id"
                            element={<Blog blogs={blogs} user={user} />}
                        />
                        <Route
                            path="/users"
                            element={<UsersList users={appUsers} />}
                        />
                    </Routes>
                </>
            )}
        </div>
    );
};

export default App;
