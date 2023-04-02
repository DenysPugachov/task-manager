const { add, asyncDivide, getName, calcTip, celsiusToFahrenheit, fahrenheitToCelsius, mmolToDl, dlToMmol } = require("./mathFunc")

test("First test", () => { });

test("testing add func", () => {
    const sum = add(1, 2)
    expect(sum).toBe(3)
    expect(add(2, 2)).toBe(4)
    expect(add(2, -2)).toBe(0)
})

// test("testing asyncDivide async", async () => {
//     const result = await asyncDivide(5, 2)
//     expect(result).toBe(3)
// })

// test("testing done functionality", done => {
//     setTimeout(() => {
//         // get Timeout error because of rejecting results
//         expect(1).toBe(1)
//         done()
//     }, 1000)
// })

test("Test calcTip", () => {
    const total = calcTip(10, 0.2)
    const totalDefault = calcTip(10,)
    expect(total).toBe(12)
    expect(totalDefault).toBe(12.5)
})

test("test celsiusToFahrenheit 32F => 0C", () => {
    const tempC = fahrenheitToCelsius(32)
    expect(tempC).toBe(0)
})

test("test fahrenheitToCelsius 0C => 32F", () => {
    const tempF = celsiusToFahrenheit(0)
    expect(tempF).toBe(32)
})

test("test mmol -> dl, 5.3 -> 95", () => {
    const dl = mmolToDl(5.3)
    expect(dl).toBe(95)
})

test("test dl -> mmol, 140 -> 7.8", () => {
    const mmol = dlToMmol(140)
    expect(mmol).toBe(7.8)
})