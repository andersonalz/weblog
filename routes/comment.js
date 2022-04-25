const express = require('express')
const router = express.Router()
const Article = require("../model/article");
const Comment = require("../model/comment")
const User = require("../model/user");
const mongoose = require('mongoose');
const { send } = require('express/lib/response');
//////////////////////////////////////////////////////manageBloggerComment///////////////////////////////////////////////////////////////////////
router.get("/manageCommentBlogger" , async (req, res)=>{
if(req.session.user && req.cookies.user_seed){
  try {
    const CommentUser = await Comment.find({user : req.session.user.id})
    res.render("manageCommentBlogger" , {
      comment : CommentUser,
      msg: null
    })
  } catch (error) {
    res.render("500")
  }
}else{
  res.redirect("/signIn")
}
})
/////////////////////////////////////////////////////////////////create comment/////////////////////////////////////////////
router.post( '/createComment' , async(req, res)=>{
    // if(!req.session.user && !req.cookies.user_seed){
    //   return res.redirect("/signIn")
    // }
    if(req.session.user && req.cookies.user_seed){
       try {

         const createComment = await Comment.create({
           Text : req.body.text,
           article : req.body.id,
           user : req.session.user._id
         })
         console.log(createComment);
        //  req.session.user = createComment
         res.send(console.log("ok"))
       } catch (error) {
         console.log(error.message);
         res.render(500)
       }
   }else{
    console.log(12);
    res.status(400).send("you must be logged in")
   }
  })

//////////////////////////////////////////////////////////Activation comment ////////////////////////////////////////////////
router.put("/comment/ActiveComment" , async (req, res) => {
    if(req.session.user && req.cookies_seed){
        try {
            const ActiveComment = await Comment.findOne({})
        } catch (error) {
            
        }
    }else{
        res.redirect("/signIn")
    }
})
/////////////////////////////////////////////////////////////delete Comment//////////////////////////////////////////////////////////////
router.get("/deleteComment/:id" , async(req,res)=>{
  if(req.session.user && req.cookies.user_seed){
    try {
      await Comment.findByIdAndDelete({_id : req.params.id})
      const findComments = await Comment.find({}) 
      res.render("managecomment", {
        Comment : findComments,
        msg: "delete comment success"
      });
    } catch (error) {
     console.log(error.message)
     res.render("500") 
    }
  }else{
    res.redirect("/signIn")
  }
})




module.exports = router
// {
//     Active: 'false',
//     article: new ObjectId("62193544e673fcd9abdbe9da"),
//     user: new ObjectId("6213511c2022ab97b274dc37"),
//     _id: new ObjectId("621d25e677550aa4de0291d8"),
//     CreateAt: 2022-02-28T19:43:34.907Z,
//     __v: 0
//   }