import { useState } from "react";
import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";

const BlogForm = ({ createBlog }) => {
    const [newTitle, setNewTitle] = useState("");
    const [newAuthor, setNewAuthor] = useState("");
    const [newUrl, setNewUrl] = useState("");

    const addBlog = (event) => {
        event.preventDefault();

        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl,
        });

        setNewTitle("");
        setNewAuthor("");
        setNewUrl("");
    };

    return (
        <div>
            <h2>Create a new blog</h2>

            <Form onSubmit={addBlog}>
                <Form.Group controlId="formTitle">
                    <Form.Label style={{ color: "orange" }}>Title:</Form.Label>
                    <Form.Control
                        data-testid="input-title"
                        type="text"
                        value={newTitle}
                        onChange={(event) => setNewTitle(event.target.value)}
                        className="custom-input"
                    />
                </Form.Group>

                <Form.Group controlId="formAuthor">
                    <Form.Label style={{ color: "orange" }}>Author:</Form.Label>
                    <Form.Control
                        data-testid="input-author"
                        type="text"
                        value={newAuthor}
                        onChange={(event) => setNewAuthor(event.target.value)}
                        className="custom-input"
                    />
                </Form.Group>

                <Form.Group controlId="formUrl">
                    <Form.Label style={{ color: "orange" }}>URL:</Form.Label>
                    <Form.Control
                        data-testid="input-url"
                        type="text" //could use url but this has some input sanitation that complains about lack of http:// || https:// prefix, which is realistically too much to ask nowadays.
                        value={newUrl}
                        onChange={(event) => setNewUrl(event.target.value)}
                        className="custom-input"
                    />
                </Form.Group>

                <Button
                    type="submit"
                    data-testid="submit-button"
                    className="custom-button"
                >
                    Create
                </Button>
            </Form>
        </div>
    );
};

BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
