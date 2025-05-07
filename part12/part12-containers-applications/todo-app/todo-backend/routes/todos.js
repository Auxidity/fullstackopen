const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const { getAsync, setAsync } = require("../redis");

/* GET todos listing. */
router.get("/", async (_, res) => {
    const todos = await Todo.find({});
    res.send(todos);
});

router.get("/statistics", async (_, res) => {
    const stats = Number(await getAsync("added_todos")) || 0;
    res.json({ added_todos: stats });
});

/* When you eventually need it because you did dum dum*/
router.get("/reset-stats", async (_, res) => {
    await setAsync("added_todos", 0);
    res.sendStatus(200);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
    const todo = await Todo.create({
        text: req.body.text,
        done: false,
    });

    try {
        await setAsync(
            "added_todos",
            (Number(await getAsync("added_todos")) || 0) + 1,
        );
    } catch (err) {
        console.error("Redis error:", err);
    }

    res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
    const { id } = req.params;
    req.todo = await Todo.findById(id);
    if (!req.todo) return res.sendStatus(404);

    next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
    await req.todo.delete();
    res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
    res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
    const updatedTodoData = {
        text: req.body.text,
        done: req.body.done,
    };

    const updatedTodo = await Todo.findByIdAndUpdate(
        req.todo._id,
        updatedTodoData,
        { new: true, runValidators: true },
    );

    res.json(updatedTodo);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
