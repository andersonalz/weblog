const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../model/user");
const Article = require("../model/article");
const Comment = require("../model/comment")
const multer = require("multer");
const fs = require("fs");
const path = require("path")
const session = require("../middleware/session")

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads/images/avatar");
  },

  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

router.get("/",session.login,(req, res) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }
    const user = req.session.user;
    res.render("profile", {
      user,
      views: req.session.views,
      msg: null,
    });
});

router.get("/userArticle", (req, res) => {
  // if (req.session.user && req.cookies.user_seed) {
  //     const user = req.session.user;
  res.render("userArticle", {
    // user,
    // msg: null
  });
  // } else {
  //     res.redirect("/signIn");
  // }
});
//////////////////////////////////////////////////////update photo user//////////////////////////////////////////
router.post("/", async (req, res) => {
  const user = req.session.user;
  if (req.session.user && req.cookies.user_seed) {
    const data = ({
      firstName,
      lastName,
      userName,
      password,
      gender,
      phoneNumber,
    } = req.body);
    if (
      isNaN(req.body.phoneNumber) ||
      req.body.phoneNumber.length > 10 ||
      req.body.phoneNumber.length < 10
    ) {
      return res.render("profile", {
        msg: "Phone Number should be a number and must be 10 character",
        views: req.session.views,
        user,
      });
    }
    if (data.firstName.length < 3 || data.firstName.length > 50) {
      return res.render("profile", {
        msg: "username should  be between 3 and 50 characters",
        views: req.session.views,
        user,
      });
    }
    if (data.lastName.length < 3 || data.lastName.length > 50) {
      return res.render("profile", {
        msg: "firstName should  be between 3 and 50 characters",
        views: req.session.views,
        user,
      });
    }
    if (data.userName.length < 3 || data.userName.length > 30) {
      return res.render("profile", {
        msg: "lastName should  be between 3 and 30 characters",
        views: req.session.views,
        user,
      });
    }
    if (data.gender !== "male" && data.gender !== "female") {
      return res.render("profile", {
        msg: "gender should  be male or female",
        views: req.session.views,
        user,
      });
    }
    if (
      !req.body.firstName.trim() ||
      !req.body.lastName.trim() ||
      !req.body.userName.trim() ||
      !req.body.gender.trim() ||
      !req.body.phoneNumber.trim()
    ) {
      return res.status(401).json({ message: "Invalid" });
    }
    if (
      req.session.user.userName !== req.body.userName &&
      (await User.findOne({ userName: req.body.userName }))
    )
      return res.render("profile", {
        msg: "username already in use",
        views: req.session.views,
        user,
      });
    try {
      const updateUser = await User.findOneAndUpdate(user, data, {
        new: true,
      }).lean();

      if (!updateUser) {
        return res.render("profile", {
          msg: "update user failed",
          views: req.session.views,
          user,
        });
      }
      req.session.user = updateUser;
      return res.render("profile", {
        msg: "update success",
        views: req.session.views,
        user,
      });
    } catch (error) {
      console.log(error.message);
      res.send(error);
    }
  } else {
    return res.redirect("/signIn");
  }
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("user_seed");
  res.redirect("/signIn");
});
//////////////////////////////////////////////////////update photo user//////////////////////////////////////////
router.post("/photo", upload.single("photo"), async (req, res) => {
  const user = req.session.user;
  if (req.session.user && req.cookies.user_seed) {

    try {
      const findImgUser = await User.findById(user._id)
      if (findImgUser.img) {
        const dir = path.join(__dirname, "../public/uploads/images/avatar", findImgUser.img)
        fs.unlinkSync(dir)
      }
      const blogger = await User.findByIdAndUpdate(
        user._id,
        { img: req.file.filename },
        { new: true }
      );

      // if (!blogger) {
      //   return res.render('profile', { msg: 'update user failed', views: req.session.views, user });
      // }
      req.session.user = blogger;
      if (req.session.user.role === "admin") {
        return res.render("dashboardAdmin", {
          msg: "update success",
          views: req.session.views,
          user: req.session.user,
        });
      }
      return res.render("profile", {
        msg: "update success",
        views: req.session.views,
        user: req.session.user,
      });
    } catch (error) {
      console.log(error.message);
      return res.render("500");

    }
  } else {
    return res.redirect("/signIn");
  }
});
//////////////////////////////////////////////////////delete User Article and Comment//////////////////////////////////////////
router.get("/delete", async (req, res) => {
  if (req.session.user && req.cookies.user_seed) {
    const user = req.session.user;
    const id = mongoose.Types.ObjectId(user._id)
    // console.log(userD);
    // const datA = { firstName, lastName, userName, password, gender, phoneNumber } = req.body;
    try {
      const dirr = path.join(__dirname, "../public/uploads/images/avatar", user.img)
      fs.unlinkSync(dirr)
      const commentBlogger = await Comment.deleteMany({user : user._id})
      console.log(commentBlogger);
      const findArticle = await Article.find({ author: id })
      let photoArticle = findArticle.map(async (value) => {
        return value.mainPhoto
      })
      Promise.all(photoArticle)
        .then((resolved) => {
          for (let i = 0; i < resolved.length; i++) {
            console.log(resolved[i]);
            const dir = path.join(__dirname, "../public/uploads/images/article", resolved[i])
            fs.unlinkSync(dir)
          }
        })
        .catch((error) => {
          console.log(error);
        })
      // console.log(findArticle.mainPhoto);
      // console.log(dir)
      // console.log(findArticle.mainPhoto);
      // const findPhotArticle = await Article.find({mainPhoto : findArticle.mainPhoto})
      const deleteArticle = await Article.deleteMany({ author: String(user._id) })
      // console.log(deleteArticle);
      // if(user.img){
      //   const dir = path.join(__dirname, "../public/uploads/images/avatar", user.img)
      // console.log(dir);
      // fs.unlinkSync(dir)
      // }
      const deleteUser = await User.findByIdAndDelete(user._id);
      // console.log(deleteUser);
      req.session.destroy();
      res.clearCookie("user_seed");
      return res.status(200).redirect("/signup");
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .render("500")
    }
  }
});
//A12345678a
//////////////////////////////////////////////////////delete photo user//////////////////////////////////////////
router.get("/remove/photo", async (req, res) => {
  if (req.session.user && req.cookies.user_seed) {
    const userD = req.session.user;
    // console.log(userD);
    // const datA = { firstName, lastName, userName, password, gender, phoneNumber } = req.body;
    try {
      const findImgUser = await User.findById(userD._id)
      if (findImgUser.img) {
        const dir = path.join(__dirname, "../public/uploads/images/avatar", findImgUser.img)
        fs.unlinkSync(dir)
      }
      const deletePhoto = await User.findByIdAndUpdate(
        { _id: userD._id },
        { $unset: { img: userD.img } }
      );
      req.session.user = findImgUser
      if (req.session.user.role === "admin") {
        return res.render("dashboardAdmin", {
          msg: "delete success",
          views: req.session.views,
          user: userD,
        });
      } else {
        res.render("profile", {
          msg: "delete success",
          views: req.session.views,
          user: userD,
        });
      }
    } catch (error) {
      console.log(error.message);
      return res.render("500")
    }
  }
});
/////////////////////////////////////////////////////////////////////manage userComment///////////////////////////////////////////////
// A12345678a

module.exports = router;
