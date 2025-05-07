const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { tokenExtractor, userExtractor } = require("../utils/middleware");

blogsRouter.put("/wipeComments", async (request, response) => {
    try {
        // Update all blogs to set their comments array to an empty array
        const result = await Blog.updateMany(
            {},
            { $set: { comments: [] } }, // Set comments field to an empty array
        );

        // Respond with a success message
        response.status(200).json({
            message: "All comments have been wiped from every blog.",
            result: result,
        });
    } catch (error) {
        // Handle any errors that might occur during the operation
        console.error(error);
        response.status(500).json({
            error: "Something went wrong while wiping comments from blogs.",
        });
    }
});

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", "name username id");
    response.json(blogs);
});

blogsRouter.put(
    "/:id",
    tokenExtractor,
    userExtractor,
    async (request, response) => {
        const body = request.body;
        const user = request.user;

        const blog = await Blog.findById(request.params.id);

        if (!blog) {
            return response.status(404).json({ error: "Blog not found" });
        }

        const areCommentsEqual = (arr1, arr2) => {
            if (arr1.length !== arr2.length) return false;
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) return false;
            }
            return true;
        };

        let comparisonResults = {
            title: body.title === blog.title,
            author: body.author === blog.author,
            url: body.url === blog.url,
            likes: Number(body.likes) === blog.likes + 1,
            comments: areCommentsEqual(body.comments, blog.comments),
        };

        if (blog.user.toString() !== user.id) {
            //If you are not the owner, you are only allowed to increase likes by 1 through this route
            if (
                !comparisonResults.title ||
                !comparisonResults.author ||
                !comparisonResults.url ||
                !comparisonResults.likes ||
                !comparisonResults.comments
            ) {
                return response.status(401).json({
                    error: "Unauthorized to update this blog",
                    comparisons: comparisonResults,
                });
            }
        }

        //User owner cannot be changed through this route.
        const updatedBlogData = {
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || blog.likes,
            user: blog.user,
            comments: body.comments,
        };

        const updatedBlog = await Blog.findByIdAndUpdate(
            request.params.id,
            updatedBlogData,
            { new: true },
        ).populate("user", "username");

        response.json(updatedBlog);
    },
);

blogsRouter.put("/:id/comment", async (request, response) => {
    const body = request.body;
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
        return response.status(404).json({ error: "Blog not found" });
    }

    const newComment = { content: body.comment };

    const updatedBlogData = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
        user: blog.user,
        comments: [...blog.comments, newComment],
    };

    console.log(updatedBlogData);

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        updatedBlogData,
        { new: true },
    ).populate("user", "username");

    response.json(updatedBlog);
});

blogsRouter.post(
    "/",
    tokenExtractor,
    userExtractor,
    async (request, response) => {
        const body = request.body;
        const user = request.user;

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user.id,
        });

        const savedBlog = await blog.save();
        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();
        await savedBlog.populate("user", "username");

        response.status(201).json(savedBlog);
    },
);

blogsRouter.get("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
        response.json(blog);
    } else {
        response.status(404).end();
    }
});

blogsRouter.delete(
    "/:id",
    tokenExtractor,
    userExtractor,
    async (request, response) => {
        const user = request.user;

        const blog = await Blog.findById(request.params.id).populate("user");
        if (!blog) {
            return response.status(204).end();
        }

        if (blog.user.id !== user.id) {
            return response.status(401).end();
        }

        await Blog.findByIdAndDelete(request.params.id);
        response.status(204).end();
    },
);

module.exports = blogsRouter;
