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


test("Should not create task with invalid description", async () => {
    const invalidDescription = ""
    await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: invalidDescription
        })
        .expect(400)
})

test("Should able to delete task", async () => {
    const task = {
        description: "This tasks should be deleted."
    }
    // Create task
    await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send(task)
        .expect(201)
    // Delete task
    await Task.deleteOne(task)
    // Try to find deleted task
    const deletedTask = await Task.findOne(task)
    expect(deletedTask).toBeNull()
})


test("Should not delete task if unauthenticated", async () => {
    const taskId = taskOne._id
    await request(app)
        .delete(`/tasks/${taskId}`)
        .send()
        .expect(401)

    const task = await Task.findOne({ _id: taskId })
    expect(task).not.toBeNull()
})


test("Should not update other user task", async () => {
    const taskUserOneId = taskOne._id
    const updatedDescription = "Some updated description."

    await request(app)
        .patch(`/tasks/${taskUserOneId}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description: updatedDescription
        })
        .expect(404)

    const task = await Task.findById(taskUserOneId)
    expect(task.description).not.toEqual(updatedDescription)
})

test("Should fetch user task by id", async () => {
    const taskId = taskOne._id
    await request(app)
        .get(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const task = await Task.findById(taskId)
    expect(task.description).toEqual(taskOne.description)
})

test("Should not fetch task without auth", async () => {
    const taskId = taskOne._id
    await request(app)
        .get(`/tasks/${taskId}`)
        .send()
        .expect(401)
})


test("Should able to fetch only completed tasks", async () => {
    // Update task to compleated
    const updatedTaskId = taskOne._id
    await request(app)
        .patch(`/tasks/${updatedTaskId}`)
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: true
        })
        .expect(202)

    // Fetch only compleated:true
    const response = await request(app)
        .get(`/tasks?completed=true`)
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const isAllFetchedTasksCompleted = response.body.every(task =>
        task.completed === true
    )
    expect(isAllFetchedTasksCompleted).toBe(true)
})


test("Should able to fetch only uncompleted tasks", async () => {
    // Update one task to compleated
    const updatedTaskId = taskOne._id
    await request(app)
        .patch(`/tasks/${updatedTaskId}`)
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: true
        })
        .expect(202)

    // Fetch only uncompleted tasks
    const response = await request(app)
        .get(`/tasks?completed=false`)
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const isAllFetchedTasksUncompleted = response.body.every(task =>
        task.completed === false
    )
    expect(isAllFetchedTasksUncompleted).toBe(true)
})

test("Should sort tasks by description", async () => {

})


// TODO:
// Should sort tasks by description / completed / createdAt / updatedAt
// Should fetch page of tasks