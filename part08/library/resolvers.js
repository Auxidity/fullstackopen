const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
    Query: {
        me: (root, args, context) => {
            return context.currentUser
        },
        bookCount: async () => {
            return await Book.countDocuments();
        },
        authorCount: async () => {
            return await Author.countDocuments();
        },
        allAuthors: async () => {
            return Author.find({}).populate('bookCount');
        },
        allBooks: async (root, args) => {
            const filter = {};

            if (args.author) {
                filter['author.name'] = args.author;
            }

            if (args.genre) {
                filter.genres = { $in: [args.genre] };
            }

            return await Book.find(filter).populate('author', 'name born bookCount')
        },
    },
    Mutation: {
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }

            let author = await Author.findOne({ name: args.author });

            if (!author) {
                author = new Author({ name: args.author });
                try {
                    await author.save();
                } catch (error) {
                    throw new GraphQLError('Adding author failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.author,
                            error
                        }
                    })
                }
            }

            const book = new Book({
                title: args.title,
                published: args.published,
                author: author,
                genres: args.genres,
            })

            try {
                await book.save();
            } catch (error) {
                const invalidArgs = Object.keys(error.errors)
                throw new GraphQLError('Adding book failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: invalidArgs,
                        error
                    }
                })
            }

            pubsub.publish('BOOK_ADDED', { bookAdded: book })
            return book;
        },
        addAuthor: async (root, args) => {
            const author = new Author({
                name: args.name,
                born: null,
            });
            try {
                await author.save();
            } catch (error) {
                const invalidArgs = Object.keys(error.errors)
                throw new GraphQLError('Adding author failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: invalidArgs,
                        error
                    }
                })
            }
            return author;
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }

            const author = await Author.findOne({ name: args.name });
            if (!author) {
                return null;
            }

            if (args.setBornTo !== undefined) {
                author.born = args.setBornTo;
            }
            try {
                await author.save();
            } catch (error) {
                const invalidArgs = Object.keys(error.errors)
                throw new GraphQLError('Editing author failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: invalidArgs,
                        error
                    }
                })
            }
            return author;
        },
        createUser: async (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

            return user.save()
                .catch(error => {
                    const invalidArgs = Object.keys(error.errors)
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: invalidArgs,
                            error
                        }
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'secret') {
                const invalidArgs = Object.keys(error.errors)
                throw new GraphQLError('Wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: invalidArgs,
                        error
                    }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
        },
    },
};

module.exports = resolvers
