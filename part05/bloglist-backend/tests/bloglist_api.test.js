const { test, after, beforeEach, afterEach, describe } = require('node:test')
require('dotenv').config()
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const assert = require('node:assert')

const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const api = supertest(app)

let token

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared')

    for (let i = 0; i < helper.initialBlogs.length; i++) {
        let blogObject = new Blog(helper.initialBlogs[i])
        await blogObject.save()
        console.log('saved')
    }
    console.log('done')
})

beforeEach(async () => {
    const user = new User({
        username: 'root',
        name: 'Test User',
        passwordHash: await bcrypt.hash('password123', 10)
    })
    await user.save()

    token = jwt.sign({ id: user.id }, process.env.SECRET)
})

describe('GET /api/blogs', () => {
    test.only('blogs are returned as json', async () => {
        console.log('entered tests')
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test.only('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is within returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const contents = response.body.map(e => e.title)
        assert(contents.includes('React patterns'))
    })

    test('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToView = blogsAtStart[0]

        const resultblog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.deepStrictEqual(resultblog.body, blogToView)
    })
})

describe('POST /api/blogs', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "Asyncio",
            author: "Not me",
            url: "https://async.com/",
            likes: 7
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(r => r.title)
        assert(titles.includes('Asyncio'))
    })

    test('a valid blog cannot be added while unauthorized', async () => {
        const newBlog = {
            title: "Asyncio",
            author: "Not me",
            url: "https://async.com/",
            likes: 7
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

        const titles = blogsAtEnd.map(r => r.title)
        assert(!titles.includes('Asyncio'))
    })

    test('blog posts have an id field instead of _id', async () => {
        const newBlog = {
            title: "Asyncio",
            author: "Not me",
            url: "https://async.com/"
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        assert.ok(response.body.id, "The 'id' field should exist")  // Ensures 'id' exists
        assert.strictEqual(response.body._id, undefined, "The '_id' field should not exist")
    })

    test('blog without likes field has 0 as its likes', async () => {
        const newBlog = {
            title: "Asyncio",
            author: "Not me",
            url: "https://async.com/"
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)


        const newBlogId = response.body.id

        const blogAtEnd = await api
            .get(`/api/blogs/${newBlogId}`)
            .expect(200)

        assert.strictEqual(blogAtEnd.body.likes, 0)
    })

    test('blog without title gets 400', async () => {
        const newBlog = {
            author: "Not me",
            url: "https://async.com/"
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })

    test('blog without author gets 400', async () => {
        const newBlog = {
            title: "Asyncio",
            url: "https://async.com/"
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })

    test('blog without url gets 400', async () => {
        const newBlog = {
            title: "Asyncio",
            author: "Not me"
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })
})

describe('DELETE /api/blogs', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const newBlog = {
            title: "Blog to delete",
            author: "Test Author",
            url: "https://example.com/",
            likes: 5
        }

        // Create a dummy blog that the test owns
        const createdBlogResponse = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        const createdBlog = createdBlogResponse.body

        const blogsAtMiddle = await helper.blogsInDb()
        //Make sure the blog was added 
        let titles = blogsAtMiddle.map(blog => blog.title)
        assert(titles.includes(createdBlog.title))
        // Delete the newly created blog
        await api
            .delete(`/api/blogs/${createdBlog.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        // Get the final list of blogs after deletion
        const blogsAtEnd = await helper.blogsInDb()

        titles = blogsAtEnd.map(blog => blog.title)
        assert(!titles.includes(createdBlog.title))

        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
})

describe('PUT /api/blogs', () => {
    test('a specific blog likes field is updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const updateValues = {
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 9
        }

        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updateValues)
            .expect(200)

        assert.notStrictEqual(updatedBlog.body.likes, blogToUpdate.likes)
    })
})

describe('when there is initially one user in db', () => {
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        console.log(result.body.error)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

afterEach(async () => {
    await User.deleteMany({})
})

after(async () => {
    await mongoose.connection.close()
})
