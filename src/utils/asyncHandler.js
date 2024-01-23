// If an error occurs, it calls next(err) to pass the error to the Express.js error handling middleware.

// The purpose of this function is to handle asynchronous operations within an Express.js route handler.
//  It's a common pattern to handle promises and asynchronous code in Express.js middleware and route handlers.

const asyncHandler = (requestHandler) => {
    return (req, res, next) =>
    {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }




// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }