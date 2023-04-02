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
        }, 1000)
    })
}

const getName = () => {
    return new Promise((resolve, reject) => {

        resolve("Den")
    })
}

const calcTip = (sum, tip = 0.25) => sum + (sum * tip)

const fahrenheitToCelsius = temp => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = temp => {
    return (temp * 1.8) + 32
}

const mmolToDl = mmol => +(mmol * 18).toFixed(0)

const dlToMmol = dl => {
    const mmolRounded = (dl / 18).toFixed(1)
    return +mmolRounded
}

module.exports = {
    add,
    asyncDivide,
    getName,
    calcTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    dlToMmol,
    mmolToDl
}

