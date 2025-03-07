import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
    const [visible, setVisible] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    return (
        <div className="blog" style={blogStyle}>
            <span data-testid="blog-title-author">
                {blog.title} {blog.author}
            </span>
            <button onClick={toggleVisibility} data-testid="view-button">
                {visible ? 'cancel' : 'view'}
            </button>

            <div className="details" style={{ display: visible ? '' : 'none' }} data-testid="details">
                <div className="blog-details">
                    <p data-testid="blog-url">{blog.url}</p>
                    <p data-testid="blog-likes">
                        {blog.likes}
                        <button onClick={() => handleLike(blog.id)} data-testid="like-button">like</button>
                    </p>
                    <p data-testid="blog-username">{blog.user.username}</p>
                    {user && blog.user.username === user.username && (
                        <button onClick={() => handleDelete(blog)} data-testid="remove-button">remove</button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Blog
