import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'

describe('<Blog />', () => {
    let container
    const blog = {
        title: 'Testing',
        author: 'Not me',
        url: '404.com',
        likes: 0,
        user: {
            username: 'tester',
        },
    }

    const handleLike = vi.fn()
    const handleDelete = vi.fn()

    beforeEach(() => {
        container = render(
            <Blog blog={blog} handleLike={handleLike} handleDelete={handleDelete} user={{ username: 'tester' }} />
        ).container
    })

    test('renders title and author', () => {
        expect(screen.getByTestId('blog-title-author')).toHaveTextContent('Testing Not me')
    })

    test('details are hidden initially', () => {
        const detailsDiv = container.querySelector('[data-testid="details"]')
        expect(detailsDiv).toHaveStyle('display: none')
    })

    test('clicking "view" shows the details', async () => {
        const user = userEvent.setup()
        const button = screen.getByTestId('view-button')
        await user.click(button)

        const detailsDiv = container.querySelector('[data-testid="details"]')
        expect(detailsDiv).toHaveStyle('display: block')

        expect(screen.getByTestId('blog-url')).toHaveTextContent('404.com')
        expect(screen.getByTestId('blog-likes')).toHaveTextContent('0')
        expect(screen.getByTestId('blog-username')).toHaveTextContent('tester')
        expect(screen.getByTestId('like-button')).toBeInTheDocument()
        expect(screen.getByTestId('remove-button')).toBeInTheDocument()
    })

    test('clicking "cancel" hides the details again', async () => {
        const user = userEvent.setup()

        const viewButton = screen.getByTestId('view-button')
        await user.click(viewButton)

        const cancelButton = screen.getByText('cancel')
        await user.click(cancelButton)

        const detailsDiv = container.querySelector('[data-testid="details"]')
        expect(detailsDiv).toHaveStyle('display: none')
    })

    test('clicking the like button twice calls handleLike twice', async () => {
        const user = userEvent.setup()

        const viewButton = screen.getByTestId('view-button')
        await user.click(viewButton)

        const likeButton = screen.getByTestId('like-button')
        await user.click(likeButton)
        await user.click(likeButton)

        expect(handleLike).toHaveBeenCalledTimes(2)
    })
})
