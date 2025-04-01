import { gql } from "@apollo/client";

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    published 
    author {
        id
        name
        born
        bookCount
    }
    genres
  }
`
export const BOOK_ADDED = gql`
    subscription{
        bookAdded {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`;

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author {
        name
        born
        bookCount
    }
      genres
    }
  }
`;

export const FILTERED_BOOKS = gql`
  query getBooksByGenre($genre: String!) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

export const USER = gql`
    query {
      me {
        username   
        favoriteGenre
      }
    }
`;

export const CREATE_BOOK = gql`
mutation createBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]
    ) {
    addBook(
        title: $title,
        published: $published,
        author: $author,
        genres: $genres
    ) {
        title
        published
        author {
            name    
        }
        genres
    }
}
`;

export const UPDATE_AUTHOR = gql`
  mutation editAuthor(
    $name: String!
    $setBornTo: Int
  ) {
    editAuthor(
        name: $name,
        setBornTo: $setBornTo
    ) {
        name
        born
        bookCount
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
