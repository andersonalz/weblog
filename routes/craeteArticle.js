const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Article = require("../model/article");
const Comment = require("../model/comment")
const User = require("../model/user");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { log } = require("console");


const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads/images/article");
  },

  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    file: 1,
    fileSize: 10 * 1024 * 1024,
  },
});

router.get("/updateArticle/:title", async (req, res) => {
  if (req.session.user && req.cookies.user_seed) {
    const user = req.session.user;
    try {
      const findArticle = await Article.findOne({ title: req.params.title });
      res.render("updatearticle", {
        article: findArticle,
        msg: null,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).render("500");
    }
  } else {
    res.redirect("/signIn");
  }
});

router.get("/", (req, res) => {
  if (req.session.user && req.cookies.user_seed) {
    const user = req.session.user;
    res.render("createArticle", {
      user,
      msg: null,
    });
  } else {
    res.redirect("/signIn");
  }
});

//////////////////////////////////////////////////////create article//////////////////////////////////////////
router.post("/", (req, res) => {
  if (req.session.user && req.cookies.user_seed) {
    const uploadArticleImage = upload.single("mainPhoto");
    uploadArticleImage(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        //err.code === "LIMIT_FILE_SIZE"
        console.log(error);
        return res.status(400).send("upload fails");
      } else if (error) {
        //err.message.includes('invalid-file-type')
        console.log(error);
        return res.status(500).send("error server");
      } else {
        if(!req.file){
         return res.status(400).send("no file")
         }
        // console.log(req.body);
        // console.log(req.file.filename);
        const create = Article.create({
          title: req.body.title, 
          body: req.body.body,
          category: req.body.category,
          description: req.body.description,
          author: req.session.user._id,
          mainPhoto: req.file.filename,
        });
        res.render("createArticle");
      }
    });
  } else {
    return res.redirect("/signIn");
  }
});

////////////////////////////////////////////////////////////update article/////////////////////////////////////////////////
router.put("/update", (req, res) => {
  const user = req.session.user;
  if (req.session.user && req.cookies.user_seed) {
    const uploadArticleImage = upload.single("mainPhoto");
    uploadArticleImage(req, res, async (error) => {
      if (error instanceof multer.MulterError) {
        //err.code === "LIMIT_FILE_SIZE"
        console.log(error);
        return res.status(400).send("upload fails");
      } else if (error) {
        //err.message.includes('invalid-file-type')
        console.log(error);
        return res.status(500).send("error server");
      } else {

        // console.log(req.body);
        try {
          // console.log(req.file.filename);
          const article = await Article.findById(req.body.id.trim());
          const dir = path.join(__dirname, "../public/uploads/images/article", article.mainPhoto)
          console.log(dir);
          article.title = req.body.title;
          article.body = req.body.body;
          article.category = req.body.category;
          article.description = req.body.description;
          if (fs.existsSync(dir)) {
            return fs.unlinkSync(path.join(__dirname, "../public/uploads/images/article", article.mainPhoto));
          }
          if (req.file) {
            article.mainPhoto = req.file.filename;
          }
          await article.save();
          console.log(article);
          // req.session.user = article;
          res.send("ok");
        } catch (error) {
          console.log(error.message);
        }
      }
    });
  } else {
    return res.redirect("/signIn");
  }
});
//////////////////////////////////////////////////////////update user photo///////////////////////////////////////////////////////////
router.post("/photo", upload.single("photo"), async (req, res) => {
  const user = req.session.user;
  if (req.session.user && req.cookies.user_seed) {
    req.session.user.img;
    try {
      const uploadPhoto = await User.findOneAndUpdate(
        user,
        { mainPhoto: req.file.filename },
        { new: true }
      );
      if (req.session.img !== undefined) {
        fs.unlinkSync(
          join(
            __dirname,
            "../public/images/article",
            req.session.user.mainPhoto
          )
        );
      }
      console.log(uploadPhoto);
      if (!uploadPhoto) {
        return res.render("createArticle", {
          msg: "update user failed",
          views: req.session.views,
          user,
        });
      }
      req.session.user.img = uploadPhoto;
      return res.render("createArticle", {
        msg: "update success",
        views: req.session.views,
        user,
      });
    } catch (error) {
      return res.send(error.message);
    }
  } else {
    return res.redirect("/signIn");
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// router.get("/delete/:title", async (req, res) => {
//   if (req.session.user && req.cookies.user_seed) {
//     const userD = req.session.user;
//     // console.log(userD);
//     // const datA = { firstName, lastName, userName, password, gender, phoneNumber } = req.body;
//     try {
//       const deleteUser = await Article.findOneAndDelete({
//         title: req.params.title,
//       });
//       if (!deleteUser) {
//         return res.render("profile", { msg: "delete user failed" });
//       }
//       return res
//         .status(200)
//         .render("userArticle", { msg: "delete successfully" });
//     } catch (error) {
//       return res
//         .status(500)
//         .json({ message: "error server", err: error.message });
//     }
//   } else {
//     return res.redirect("/signIn");
//   }
// });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// router.post('/', async (req, res) => {
//   if (req.session.user && req.cookies.user_seed) {
//     try {
//       console.log(req.body);
//       const data = { title, body, description, category } = req.body
//       if (!data) {
//         res.render("AllArticle", { msg: "fill all field" })
//       }
//       const create = await Article.create({
//         title: req.body.title,
//         body: req.body.body,
//         category: req.body.category,
//         description: req.body.description,
//         author: req.session.user._id,
//         mainPhoto :req.body.mainPhoto
//       })
//       res.render("createArticle" , {msg : "create article done"})
//     } catch (error) {
//       res.status(500).json({ message: error.message })
//     }
//   } else {
//     return res.redirect("/signIn");
//   }

// })

module.exports = router;
