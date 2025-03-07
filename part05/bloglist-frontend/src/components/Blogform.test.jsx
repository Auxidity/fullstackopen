import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

test('<BlogForm /> updates parent state and calls createBlog', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByTestId('input-title')
    const authorInput = screen.getByTestId('input-author')
    const urlInput = screen.getByTestId('input-url')
    const submitButton = screen.getByTestId('submit-button')

    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'John Doe')
    await user.type(urlInput, 'http://example.com')

    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
        title: 'Test Blog Title',
        author: 'John Doe',
        url: 'http://example.com',
    })
})
