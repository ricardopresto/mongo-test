const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const port = 8000;

const dbName = "test";
const url =
  "mongodb+srv://ricardopresto:ricardo123@cluster0-yuyny.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(url, { useUnifiedTopology: true });
client.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set("view engine", "ejs");

app.get("/posts", async (req, res) => {
  const posts = await getPosts();
  res.render("view.ejs", { words: posts });
  //res.json(posts);
});

app.post("/posts", (req, res) => {
  sendPost(req.body);
  res.redirect("/posts");
});

async function sendPost(post) {
  try {
    const db = client.db(dbName);
    await db.collection("posts").insertOne(post);
  } catch (err) {
    console.log(err.stack);
  }
}

async function getPosts() {
  let docs;
  try {
    const db = client.db(dbName);
    docs = await db
      .collection("posts")
      .find({})
      .toArray();
  } catch (err) {
    console.log(err.stack);
  }
  return docs;
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
