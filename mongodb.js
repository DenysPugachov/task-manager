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
    const usersCollection = db.collection("users")

    const insertedResults = await usersCollection.insertMany(
        [
            {
                name: "Alice",
                age: 11,
            },
            {
                name: "Jen",
                age: 35,
            }
        ])

    console.log('insertedResults :>> ', insertedResults);
    
    //finish
    return "done"
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close())