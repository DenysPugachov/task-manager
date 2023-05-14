const request = require("supertest")
const app = require("../app")
const Task = require("../models/taskModel")
const { userOne, userOneId, setupDB } = require("./fixtures/db")

beforeEach(setupDB)

test("Should create task for user", async () => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "Test task description."
        })
        .expect(201)

    const task = await Task.findById(response.body._id);
    // console.log('task :>> ', task);
    expect(task).not.toBeNull()
    expect(task.description).toEqual("Test task description.")
    expect(task.completed).toEqual(false)
})