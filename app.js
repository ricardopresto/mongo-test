const mongodb = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const port = 8000;

const dbName = "test";
const url =
	"mongodb+srv://ricardopresto:ricardo123@cluster0-yuyny.gcp.mongodb.net/test?retryWrites=true&w=majority";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.set("view engine", "ejs");

app.get("/posts", async (req, res) => {
	const posts = await getPosts();
	const data = await posts.find({}).toArray();
	//res.render("view.ejs", { data: data });
	res.send(data);
});

app.post("/posts", async (req, res) => {
	const posts = await getPosts();
	posts.insertOne(req.body);
	res.redirect("/posts");
});

app.delete("/posts/:id", async (req, res) => {
	const posts = await getPosts();
	await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
});

async function getPosts() {
	const client = await mongodb.MongoClient.connect(url, {
		useUnifiedTopology: true
	});
	return client.db(dbName).collection("posts");
}

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
