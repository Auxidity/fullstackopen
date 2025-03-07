//const Blog = require('../models/blog')  //Do not require, our blog.js is making a connection to the db. We ONLY want to test the schema. So define the schema without db query options in helper or tests instead

//Input sanitation is not done at all. Maybe its done later? Quick implementation broke all tests so skipped for now and we test with properly formed blogs only. Potentially an issue on mostLikes & mostBlogs

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const result = blogs.reduce((sum, blog) => sum + blog.likes, 0);
    return result
}

const favouriteBlog = (blogs) => {
    const result = blogs.length > 0
    ? blogs.reduce((mostLiked, blog) => ( blog.likes > mostLiked.likes) ? blog : mostLiked)
    : null;

    return result
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) { //If the blogs array is empty, return null
        return null
    }
    // Form a tuple with each entry and a counter assigned with the entry that goes up every time it is encountered.
    // Return entry with highest counter
    const blogCount = blogs.reduce((counter, person) => {
        counter[person.author] = (counter[person.author] || 0) +1;
        return counter
    }, {});

    let mostCommonAuthor = blogs[0].author; //Initialize with first element, empty arrays are handled above
    let maxCount = 0;

    for (let author in blogCount) {
        if (blogCount[author] > maxCount) {
            mostCommonAuthor = author;
            maxCount = blogCount[author];
        }
    }

    return {
        author: mostCommonAuthor,
        blogs: maxCount
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) { //If the blogs array is empty, return null
        return null
    }
    
    // Form a tuple with each entry and a counter assigned with the entry that goes up every time it is encountered.
    // Counter is increased with the blog posts likes field instead of staticly increasing by 1 each time it is encountered.
    // Return entry with highest counter
    const blogCount = blogs.reduce((counter, person) => {
        counter[person.author] = (counter[person.author] || 0) + person.likes;
        return counter
    }, {});

    let mostLikedAuthor = blogs[0].author; //Initialize with first element, empty arrays are handled above.
    let maxCount = 0;

    for (let author in blogCount) {
        if (blogCount[author] > maxCount) {
            mostLikedAuthor = author;
            maxCount = blogCount[author];
        }
    }
    
    return {
        author: mostLikedAuthor,
        likes: maxCount
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes,
}
