import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()

        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl
        })

        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')

    }

    return (
        <div>
            <h2>Create a new blog</h2>

            <form onSubmit={addBlog}>
                <div >
                    title:
                    <input
                        data-testid="input-title"
                        value={newTitle}
                        onChange={event => setNewTitle(event.target.value)}
                    />
                </div>
                <div>
                    author:
                    <input
                        data-testid="input-author"
                        value={newAuthor}
                        onChange={event => setNewAuthor(event.target.value)}
                    />
                </div>
                <div>
                    url:
                    <input
                        data-testid="input-url"
                        value={newUrl}
                        onChange={event => setNewUrl(event.target.value)}
                    />
                </div>
                <button type="submit" data-testid="submit-button">create</button>
            </form>
        </div>
    )

}

BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}

export default BlogForm
