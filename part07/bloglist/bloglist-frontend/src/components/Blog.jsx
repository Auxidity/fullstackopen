import { useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    updateBlogLikes,
    deleteBlog,
    addComment,
} from "../reducers/blogReducer";
import { useState } from "react";
import { Form } from "react-bootstrap";

const Blog = ({ blogs, user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [content, setContent] = useState("");

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5,
    };

    const id = useParams().id;
    const blog = blogs.find((n) => n.id === id);

    if (!blog) return null;

    const handleDelete = (blogToDelete) => {
        const isConfirmed = window.confirm(
            "Remove blog " + blogToDelete.title + " by " + blogToDelete.author,
        );

        if (isConfirmed) {
            dispatch(deleteBlog(blogToDelete));
            navigate("/");
        }
    };

    const handleLike = (blog) => {
        const updatedBlog = {
            ...blog,
            likes: blog.likes + 1,
        };
        dispatch(updateBlogLikes(updatedBlog));
    };

    const submitComment = (event) => {
        event.preventDefault();
        if (content.trim() === "") {
            return;
        }

        dispatch(addComment(id, content));
        setContent("");
    };

    const Comments = ({ comments }) => {
        if (!blog.comments || blog.comments === undefined) return null;
        return (
            <div>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>{comment.content}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div>
            <div style={blogStyle}>
                <h2>
                    {blog.title} {blog.author}
                </h2>
                {blog.url}
                <p />
                {blog.likes} likes{" "}
                <button onClick={() => handleLike(blog)}>like</button>
                <p>added by {blog.user.username}</p>
                {user && blog.user.username === user.username && (
                    <button onClick={() => handleDelete(blog)}>remove</button>
                )}
            </div>
            <h3>comments</h3>
            <Form onSubmit={(event) => submitComment(event, content)}>
                <Form.Group controlId="formComment">
                    <Form.Label>Comment:</Form.Label>
                    <Form.Control
                        type="text"
                        value={content}
                        onChange={({ target }) => setContent(target.value)}
                        className="custom-input" // Use your pre-defined class from styles.css
                    />
                </Form.Group>
                <button type="submit" className="custom-btn">
                    Add Comment
                </button>
            </Form>
            <Comments comments={blog.comments} />
        </div>
    );
};

export const BlogList = ({ blogs }) => {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
    return (
        <div>
            <h2> blogs</h2>
            <ul>
                {sortedBlogs.map((blog) => (
                    <li key={blog.id}>
                        <Link to={`/blogs/${blog.id}`}>
                            {" "}
                            {blog.title} {blog.author}{" "}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Blog;
