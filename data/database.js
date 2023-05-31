const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;

async function connect() {
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017'); //retorna uma promise
  database = client.db("blog"); //seleciona a db específica no server
}

function getDb() {
  if (!database) {
    throw { message: "Database connection not established!" };
  }

  return database;
}

module.exports = {
  connectToDatabase: connect,
  getDb: getDb,
};
