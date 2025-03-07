const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { tokenExtractor, userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', 'name username id')
    response.json(blogs)
})

blogsRouter.put('/:id', tokenExtractor, userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).json({ error: 'Blog not found' })
    }

    if (blog.user.toString() !== user.id) {
        return response.status(401).json({ error: 'Unauthorized to update this blog' })
    }

    const updatedBlogData = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || blog.likes,
        user: user.id
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedBlogData, { new: true })
        .populate('user', 'username')

    response.json(updatedBlog)
})




blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    await savedBlog.populate('user', 'username')

    response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response) => {
    const user = request.user

    const blog = await Blog.findById(request.params.id).populate('user')
    if (!blog) {
        return response.status(204).end()
    }

    if (blog.user.id !== user.id) {
        return response.status(401).end()
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()


})

module.exports = blogsRouter
