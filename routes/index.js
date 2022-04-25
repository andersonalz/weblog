const express = require("express")
const router = express.Router()
const Article = require("../model/article")
const Comment = require("../model/comment")
const mongoose = require("mongoose")
///////////////////////////////////////////////////////////homepage///////////////////////////////////////////////////////////////

router.get("/", async (req, res) => {
    try {
        const article = await Article.find({}).populate('author').sort({ createAt: -1 })
        console.log(article);
        res.render("index" , {article : article})
    } catch (error) {
        res.status(500).render("404")
    }
})
///////////////////////////////////////////////////////////specific Article///////////////////////////////////////////////////////////////
router.get("/SpArticle/:title", async (req, res) => {
  try {
      const OneArticle = await Article.findOne({title: req.params.title})//find article by title
      const FindComment = await Comment.find({ article : OneArticle._id , Active : "true"}).populate("user")// find comment by id's article
      res.render("spArticle" , {article : OneArticle , comment : FindComment})
  } catch (error) {
      console.log(error.message);
      res.status(500).render("500")
  }
})

///////////////////////////////////////////////////////////manageCommentBlooger///////////////////////////////////////////////////////////////
// router.get("/", async(req, res)=>{


// })


module.exports = router;
