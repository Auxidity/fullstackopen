const config = require("../utils/config");
const mongoose = require("mongoose");

const url = config.MONGODB_URI;
console.log("connecting to: " + url);

mongoose.set("strictQuery", false);
mongoose
    .connect(url)
    .then(() => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB: ", error.message);
    });

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
    },
    author: {
        type: String,
        required: true,
        minlength: 3,
    },
    url: {
        type: String,
        required: true,
        minlength: 3,
    },
    likes: {
        type: Number,
        required: false,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    comments: [
        {
            content: {
                type: String,
            },
        },
    ],
});

blogSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;

        if (returnedObject.comments) {
            returnedObject.comments = returnedObject.comments.map((comment) => {
                comment.id = comment._id.toString();
                delete comment._id;
                return comment;
            });
        }
    },
});

module.exports = mongoose.model("Blog", blogSchema);
