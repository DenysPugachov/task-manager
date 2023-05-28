const request = require("supertest")
const app = require("../app")
const Task = require("../models/taskModel")
const { userOne, userOneId, userTwo, taskOne, taskTwo, taskThree, userTwoId, setupDB } = require("./fixtures/db")

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

test("Should GET tasks for user", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const userOneTasks = await Task.find({ owner: userOneId })
    const userTwoTasks = await Task.find({ owner: userTwoId })
    // console.log('task :>> ', task);
    expect(userOneTasks.length).toEqual(2)
    expect(userTwoTasks.length).toEqual(1)
})

test("Should not delete other users tasks", async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const currentTask = await Task.findById(taskOne._id)
    expect(currentTask.description).toEqual(taskOne.description)

})

test("Should not create compleated task", async () => {
    await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "Some already compleated task.",
            completed: true,
        })
        .expect(400)
})