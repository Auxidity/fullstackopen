const loginWith = async (page, username, password) => {
    await page.getByTestId('login-username').first().fill(username)
    await page.getByTestId('login-password').last().fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('input-author').fill(author)
    await page.getByTestId('input-title').fill(title)
    await page.getByTestId('input-url').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
}

export { loginWith, createBlog }
