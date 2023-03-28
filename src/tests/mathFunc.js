const add = (a, b) => a + b

// const asyncDivide = (a, b) => {
//     setTimeout(() => {
//         const result = a - b
//         return result
//     }, 2000)
// }

const asyncDivide = (a, b) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if (!a || !b) {
                return rej("Numbers must be non-negative!")
            }
            res(a - b)
        },1000)
    })
}

const getName = () => {
    return new Promise((resolve, reject) => {
    
        resolve("Den")
    })
}

module.exports = {
    add,
    asyncDivide,
    getName
}

