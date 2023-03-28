const { add, asyncDivide, getName } = require("./mathFunc")

test("First test", () => { });

test("testing add func", () => {
    const sum = add(1, 2)
    expect(sum).toBe(3)
    expect(add(2, 2)).toBe(4)
    expect(add(2, -2)).toBe(0)
})

test("testing asyncDivide async", async () => {
    const result = await asyncDivide(5, 2)
    expect(result).toBe(3)
})

test("testing done functionality", done => {
    setTimeout(() => {
        // get Timeout error because of rejecting results
        expect(1).toBe(1)
        done()
    }, 1000)
})
