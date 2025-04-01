const typeDefs = `
    type User {
        username: String!
        favoriteGenre: String!
        id: ID!
    }

    type Token {
        value: String!
    }

    type Author {
        name: String!
        id: ID!
        born: Int
        bookCount: Int
    }
    type Book {
        title: String!
        published: Int!
        author: Author!
        id: ID!
        genres: [String!]
    }  

    type Mutation {
        createUser(
            username: String!
            favoriteGenre: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token

        addBook(
            title: String!
            published: Int!
            author: String!
            genres: [String!]
        ): Book

        addAuthor(name: String!): Author

        editAuthor(
            name: String!
            setBornTo: Int
        ): Author
    }
    type Query {
        me: User
        bookCount: Int
        authorCount: Int
        allAuthors: [Author!]!
        allBooks(author: String, genre:String): [Book!]!
  }
    type Subscription {
        bookAdded: Book!
    }
`;

module.exports = typeDefs
