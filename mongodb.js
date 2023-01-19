const { MongoClient, ObjectId } = require("mongodb")

//connection URL
const url = "mongodb://127.0.0.1:27017"
const client = new MongoClient(url)

const dbName = "tasks-db"

const id = new ObjectId()

async function main() {
    // connect to the server
    await client.connect()
    console.log("Connected successfully to the server");

    const db = client.db(dbName)
    const collection = db.collection("tasks")

    const result = await collection.findOne(
        {
            id: ObjectId("63c84fa5d8ddd8b793417a67")
        }
    )

    console.log('insertedResults :>> ', result);

    return "Done."
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close())