const express = require("express");

const mongodb = require('mongodb');

const objectId = mongodb.ObjectId;

const router = express.Router();

const db = require("../data/database");

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", function (req, res) {
  res.render("posts-list");
});

router.get("/new-post", async function (req, res) {

  const authors = await db.getDb().collection("authors").find().toArray();

  res.render("create-post", { authors: authors });
});

router.post("/posts", async function (req, res) {


  const authorId = new objectId(req.body.author)

  const author = await db.getDb().collection('authors').findOne({_id: authorId})

   console.log(author);

  const post = {

    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(),
    author:{
      id: authorId,
      name: author.name,
      email: author.email
    }
  }

  console.log(post);

  const result = await db.getDb().collection('posts').insertOne(post)

  console.log(result);

  res.redirect('/posts')

});

module.exports = router;
