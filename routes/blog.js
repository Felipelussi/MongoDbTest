const express = require("express");

const mongodb = require("mongodb");

const objectId = mongodb.ObjectId;

const router = express.Router();

const db = require("../data/database");

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  const posts = await db
    .getDb()
    .collection("posts")
    .find({})
    .project({ summary: 1, title: 1, "author.name": 1 })
    .toArray();

  res.render("posts-list", { posts: posts });
});

router.get("/posts/:id", async function (req, res) {
  let postId = req.params.id;
  try {
    postId = new objectId(req.params.id);
  } catch (error) {
    return res.status(404).render("404");
  }

  const post = await db.getDb().collection("posts").findOne({ _id: postId });

  if (!post) {
    return res.status(404).render("404");
  }
  post.humanReadableDate = post.date.toLocaleDateString("pt-br", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  post.date = post.date.toISOString();

  res.render("post-detail", { post: post });
});

router.get("/new-post", async function (req, res) {
  const authors = await db.getDb().collection("authors").find().toArray();

  res.render("create-post", { authors: authors });
});

router.post("/posts", async function (req, res) {
  const authorId = new objectId(req.body.author);

  const author = await db
    .getDb()
    .collection("authors")
    .findOne({ _id: authorId });

  console.log(author);

  const post = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(),
    author: {
      id: authorId,
      name: author.name,
      email: author.email,
    },
  };

  console.log(post);

  const result = await db.getDb().collection("posts").insertOne(post);

  res.redirect("/posts");
});

router.get("/update/:id", async function (req, res) {
  const postId = new objectId(req.params.id);

  const post = await db.getDb().collection("posts").findOne({ _id: postId });

  res.render("update-post", { post: post });
});

router.post("/update/:id", async function (req, res) {
  const postId = new objectId(req.params.id);

  const data = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
  };

  await db
    .getDb()
    .collection("posts")
    .updateOne({ _id: postId }, { $set: data });

  res.redirect("/posts");
});

router.post("/posts/:id/delete", async function (req, res) {
  const postId = new objectId(req.params.id);

  await db.getDb().collection("posts").deleteOne({ _id: postId });

  res.redirect("/posts");
});
module.exports = router;
