const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'John Doe',
                username: 'root',
                password: 'root'
            }
        })
        await page.goto('/')
    })

    test('front page can be opened', async ({ page }) => {
        const locator = await page.getByText('blogs')
        await expect(locator).toBeVisible()
    })

    test('login form is visible', async ({ page }) => {
        await expect(page.getByTestId('login-username')).toBeVisible()
        await expect(page.getByTestId('login-password')).toBeVisible()
    })

    describe('Login', () => {
        test('login form can be operated', async ({ page }) => {
            await loginWith(page, 'root', 'root')
            await expect(page.getByText('root succesfully logged in')).toBeVisible()
        })

        test('login fails with wrong password', async ({ page }) => {
            await loginWith(page, 'root', 'notroot')
            await expect(page.getByText('Wrong credentials')).toBeVisible()
        })
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'root', 'root')
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'Sample blog', 'Sample author', '404.com')
            await expect(page.getByText('A new blog Sample blog by Sample author added')).toBeVisible()

        })

        describe('and a blog exists', () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, 'Sample blog', 'Sample author', '404.com')
            })

            test('title and author are visible', async ({ page }) => {
                await expect(page.getByTestId('blog-title-author')).toBeVisible()
            })

            test('a blog can be viewed', async ({ page }) => {
                await page.getByTestId('view-button').click()
                await expect(page.getByTestId('blog-likes')).toBeVisible()
                await expect(page.getByTestId('blog-url')).toBeVisible()
                await expect(page.getByTestId('blog-username')).toBeVisible()
            })

            test('like button works', async ({ page }) => {
                await page.getByTestId('view-button').click()
                await expect(page.getByTestId('blog-likes')).toHaveText('0like') //The button text 'like' is included since they are in same <p /> element. 
                await page.getByTestId('like-button').click()
                await expect(page.getByTestId('blog-likes')).toHaveText('1like') //The button text 'like' is included since they are in same <p /> element. 
            })

            test('blog owner can delete the blog through remove button', async ({ page }) => {
                await page.getByTestId('view-button').click();


                page.on('dialog', async dialog => {
                    await dialog.accept()
                })

                await page.getByTestId('remove-button').click();

                await page.waitForResponse(response => response.status() === 204, {
                    timeout: 5000,
                })

                const blogDeleted = await page.locator('.blog-container').isVisible();
                expect(blogDeleted).toBe(false);

            })

            test('non-owners do not see delete button', async ({ page, request }) => {
                await page.getByRole('button', { name: 'logout' }).click()
                await request.post('/api/users', {
                    data: {
                        name: 'John Doe2',
                        username: 'altroot',
                        password: 'altroot'
                    }
                })
                await loginWith(page, 'altroot', 'altroot')
                await page.getByTestId('view-button').click()
                const isVisible = await page.getByTestId('remove-button').isVisible()
                expect(isVisible).toBe(false)
            })

        })

        describe('multiple blogs exist', () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, 'Sample blog 1', 'Sample author 1', '404.com')
                await createBlog(page, 'Sample blog 2', 'Sample author 1', '404.com')
                await createBlog(page, 'Sample blog 3', 'Sample author 2', '404.com')
            })

            test.only('blogs are ordered by most liked to least liked', async ({ page }) => {
                await page.locator('[data-testid="view-button"]').nth(0).click();
                const likeButton1 = page.locator('[data-testid="like-button"]').nth(0);
                await likeButton1.click();
                await likeButton1.click();


                await page.locator('[data-testid="view-button"]').nth(1).click();
                const likeButton2 = page.locator('[data-testid="like-button"]').nth(1);
                await likeButton2.click();

                await page.locator('[data-testid="view-button"]').nth(2).click();
                const likeButton3 = page.locator('[data-testid="like-button"]').nth(2);
                await likeButton3.click();
                await likeButton3.click();
                await likeButton3.click();

                //Assuming the ordering works, the 0th should be largest and the last element should be smallest. So just parse the string to a number and do partialOrd comparison
                const likeCount1 = await page.locator('[data-testid="blog-likes"]').nth(0).innerText()
                const likeCount2 = await page.locator('[data-testid="blog-likes"]').nth(1).innerText()
                const likeCount3 = await page.locator('[data-testid="blog-likes"]').nth(2).innerText()

                const likes1 = parseInt(likeCount1, 10)
                const likes2 = parseInt(likeCount2, 10)
                const likes3 = parseInt(likeCount3, 10)

                expect(likes1).toBeGreaterThanOrEqual(likes2)
                expect(likes2).toBeGreaterThanOrEqual(likes3)
            })
        })
    })
})
