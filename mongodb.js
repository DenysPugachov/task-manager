const { MongoClient } = require("mongodb")

//connection URL
const url = "mongodb://127.0.0.1:27017"
const client = new MongoClient(url)

const dbName = "tasks-db"

async function main() {
    // connect to the server
    await client.connect()
    console.log("Connected successfully to the server");

    const db = client.db(dbName)
    const collection = db.collection("tasks")

    const result = await collection.insertMany(
        [
            {
                description: "Learn Polish",
                isCompleted: true, 
            },
            {
                description: "Do home work",
                isCompleted: true, 
            },
            {
                description: "Find a new job.",
                isCompleted: false, 
            },
        ])

    console.log('insertedResults :>> ', result);

    return "Done."
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close())