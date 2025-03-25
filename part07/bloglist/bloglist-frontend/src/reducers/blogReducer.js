import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import {
    setNotificationWithTimeout,
    setErrorNotificationWithTimeout,
} from "./notificationReducer";

const blogSlice = createSlice({
    name: "blogs",
    initialState: [],
    reducers: {
        likeBlog(state, action) {
            const id = action.payload;
            const blogToChange = state.find((n) => n.id === id);
            const changedBlog = {
                ...blogToChange,
                likes: blogToChange.likes + 1,
            };

            const updatedState = state.map((blog) =>
                blog.id !== id ? blog : changedBlog,
            );
            return updatedState.sort((a, b) => b.likes - a.likes);
        },
        appendBlog(state, action) {
            state.push(action.payload);
        },
        setBlogs(state, action) {
            return action.payload;
        },
        removeBlog(state, action) {
            return state.filter((blog) => blog.id !== action.payload);
        },
        appendComment(state, action) {
            //I think this is awful as a solution but redux does not like if two payloads are merged so I just pass the entire object and update it to the state
            const blogToUpdate = action.payload;
            const id = blogToUpdate.id;
            console.log(action.payload);

            const updatedState = state.map((blog) =>
                blog.id !== id ? blog : blogToUpdate,
            );
            return updatedState.sort((a, b) => b.likes - a.likes);
        },
    },
});

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll();
        dispatch(setBlogs(blogs));
    };
};

export const deleteBlog = (content) => {
    return async (dispatch) => {
        try {
            await blogService.remove(content.id);
            dispatch(removeBlog(content.id));
        } catch (error) {
            console.log(error.response.data.error);
            dispatch(
                setErrorNotificationWithTimeout(error.response.data.error, 5),
            );
        }
    };
};

export const addBlog = (content) => {
    return async (dispatch) => {
        try {
            const newBlog = await blogService.create(content);
            dispatch(appendBlog(newBlog));
            dispatch(
                setNotificationWithTimeout(
                    `A new blog ${newBlog.title} by ${newBlog.author} added`,
                    5,
                ),
            );
        } catch (error) {
            console.log(error.response.data.error);
            dispatch(
                setErrorNotificationWithTimeout(error.response.data.error, 5),
            );
        }
    };
};

export const updateBlogLikes = (content) => {
    return async (dispatch) => {
        const updatedBlog = await blogService.update(content.id, content);
        dispatch(likeBlog(updatedBlog.id));
    };
};

export const addComment = (id, content) => {
    return async (dispatch) => {
        const updatedBlog = await blogService.createComment(id, {
            comment: content,
        });
        dispatch(appendComment(updatedBlog));
    };
};

export const { appendComment, removeBlog, likeBlog, appendBlog, setBlogs } =
    blogSlice.actions;
export default blogSlice.reducer;
