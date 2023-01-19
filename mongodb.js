const { MongoClient, ObjectId } = require("mongodb")

//connection URL
const url = "mongodb://127.0.0.1:27017"
const client = new MongoClient(url)

const dbName = "tasks-db"

const id = new ObjectId()

async function main() {
    // connect to the server
    await client.connect()
    console.log("Connected to DB.");

    const db = client.db(dbName)
    const usersCollection = db.collection("users")
    const tasksCollection = db.collection("tasks")

    // const result = await collection.insertMany(
    //     [
    //         {
    //             description: "Read a good book",
    //             isCompleted: false,
    //         },
    //         {
    //             description: "Do some exercises",
    //             isCompleted: false,
    //         },
    //     ]
    // )

    // const result = await collection.find({ isCompleted: false }).toArray()

    // const result = await collection.updateOne(
    //     {
    //         _id: new ObjectId("63c83da889827e7f5e0280f4")
    //     },
    //     {
    //         $inc: {
    //             age: 5
    //         }
    //     }
    // )

    // const result = await tasksCollection.updateMany(
    //     {
    //         isCompleted: true
    //     },
    //     {
    //         $unset: {
    //             isCompleated: true
    //         }
    //     }
    // )

    const result = await tasksCollection.deleteMany({
        description: "Read a good book"
    })

    console.log('insertedResults :>> ', result);

    return "Done."
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close())