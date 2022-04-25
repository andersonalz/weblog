const express = require("express")
const router = express.Router()
const Article = require("../model/article")
const Comment = require("../model/comment")
const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")
const session = require("../middleware/session")
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/user",session.login,async (req, res) => {
        user = req.session.user
        try {
            const UserArticle = await Article.find({ author: user._id }).populate('author').exec()
            // console.log(UserArticle);
            if (!UserArticle) {
                res.render("userArticle", { msg: "no any articles" })
            }
            res.render("userArticle", { userArticle : UserArticle  , msg:null})
        } catch (error) {
            res.status(500).render("500")
        }
})
//////////////////////////////////////////////////////////update article///////////////////////////////////////////////
router.post("/" , async (req, res) =>{
    const data = {title , description , body , category} = req.body
    if (req.session.user && req.cookies.user_seed) {
        try {
            const ArticleUpdate = await Article.findOneAndUpdate({data})
        } catch (error) {
            console.log(error.message);
            return res.status(500).render("500")
        }
    }else{
      return res.redirect("/signIn");
  }
})

/////////////////////////////////////////////////////delete article//////////////////////////////////////////////////////
router.get("/delete/:title", async (req, res) => {
    if (req.session.user && req.cookies.user_seed) {
      const userD = req.session.user;
      // console.log(userD);
      // const datA = { firstName, lastName, userName, password, gender, phoneNumber } = req.body;
      try {

        const deleteArticle = await Article.findOneAndDelete({title : req.params.title})
        const deleteComment = await Comment.deleteMany({article : deleteArticle._id})
        const dir = path.join(__dirname , "../public/uploads/images/article" , deleteArticle.mainPhoto)
        if (!deleteArticle) {
          return res.render('userArticle', { msg: 'delete article failed' });
        }
        if( fs.existsSync(dir)){
          fs.unlinkSync(path.join(__dirname , "../public/uploads/images/article" , deleteArticle.mainPhoto)); 
        }
        // req.session.user = deleteArticle
        res.status(200).redirect('/userArticle/user')
      } catch (error) {
        console.log(error.message);
        return res.status(500).render("500")
      }
    }else{
      return res.redirect("/signIn");
  }
})


module.exports = router
