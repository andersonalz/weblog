const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../model/user')
const Article = require('../model/article')
const Comment = require('../model/comment')
const path = require('path')
const fs = require('fs') 
const role = require("../middleware/auth")
///////////////////////////////////////////////////////////////////////dashboardAdmin///////////////////////////////////////////////////////////////////

router.get("/dashboardAdmin", role(["admin"]),(req, res) => {
    if (req.session.views) {
        req.session.views++
    } else {
        req.session.views = 1
    }
        const user = req.session.user;
        res.render("dashboardAdmin", {
            user,
            views: req.session.views, msg: null
        });
});
////////////////////////////////////////////////////////////////manage comment/////////////////////////////////////////////////////////////////
router.get('/manageComment', async (req, res) => {
    if (req.session.user && req.cookies.user_seed && req.session.user.role === 'admin') {
        const user = req.session.user;
        try {
            const findComments = await Comment.find({})
            res.render("managecomment", {
                Comment: findComments,
                msg: null
            });

        } catch (error) {
            console.log(error.message);
            res.render("500")
        }
    } else {
        res.redirect("/signIn");
    }
})
///////////////////////////////////////////////////////////////////////active comment///////////////////////////////////////////////////////
router.get("/ActiveComment/:id", async (req, res) => {
    if (req.session.user && req.cookies.user_seed && req.session.user.role === 'admin') {
        const user = req.session.user;
        try {
            const ActiveComments = await Comment.findByIdAndUpdate({ _id: req.params.id }, { Active: "true" })
            res.redirect("/admin/manageComment")
        } catch (error) {
            console.log(error.message);
            res.render("500")
        }
    } else {
        res.redirect("/signIn");
    }
})
///////////////////////////////////////////////////////////////////////create admin///////////////////////////////////////////////////////////////////

router.post('/createAdmin', async (req, res) => {
    const findAdmin = await User.findOne({ role: 'admin' });
    try {
        if (findAdmin) {
            return res.status(404)
        }
        const Admin = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: req.body.password,
            gender: req.body.gender,
            role: "admin",
            phoneNumber: req.body.phoneNumber
        })
        res.status(200).json({ message: 'success' })
    } catch (error) {
        res.status(403).json({
            message: "server error",
            err: error.message
        })
    }
})
///////////////////////////////////////////////////////////////////////blogger manager///////////////////////////////////////////////////////////////////
router.get("/manageBlogger", async (req, res) => {
    if (req.session.user && req.cookies.user_seed && req.session.user.role === 'admin') {
        try {
            const Bloggers = await User.find({ role: 'blogger' })
            // console.log(Bloggers);
            const user = req.session.user;
            res.render("blogger", {
                user,
                msg: null,
                Bloggers: Bloggers
            });

        } catch (error) {
            console.log(error.message);
            res.render("500")
        }

    } else {
        res.redirect("/signIn");
    }
});
////////////////////////////////////////////////////////////////////manageArticle////////////////////////////////////////////////////
router.get("/manageArticle", async (req, res) => {
    if (req.session.user && req.cookies.user_seed && req.session.user.role === 'admin') {
        try {
            const findArticle = await Article.find({}).populate("author")
            //    console.log(findArticle);
            const user = req.session.user;
            res.render("manageArticle", { Articles: findArticle });
        } catch (error) {
            console.log(error.message);
            res.render("500")
        }
    } else {
        res.redirect("/signIn");
    }
})
///////////////////////////////////////////////////////////////////////find blogger//////////////////////////////////////////////////

router.get('/findBlogger', async (req, res) => {
    if (req.session.user && req.cookies.user_seed && req.session.user.role === 'admin') {
        try {
            const Bloggers = await User.find({ role: 'blogger' })
            // console.log(Bloggers);
            // if (!Bloggers) {
            //     return res.render('blogger', { msg: 'No any bloggers', Bloggers })
            // }
            res.render('blogger', Bloggers)
        } catch (error) {
            console.log(error.message);
            res.render("500")
        }
    } else {
        res.redirect("/signIn");
    }
})


/////////////////////////////////////////////////////////delete user//////////////////////////////////////////////////////////
router.get("/delete", async (req, res) => {
    if (req.session.user && req.cookies.user_seed && req.session.user.role === 'admin') {
        const userD = req.session.user;
        // console.log(userD);
        // const datA = { firstName, lastName, userName, password, gender, phoneNumber } = req.body;
        try {
            const deleteUser = await User.findOneAndDelete(userD.username)
            if (!deleteUser) {
                return res.render('profile', { msg: 'delete user failed' });
            }
            req.session.destroy();
            res.clearCookie("user_seed");
            return res.status(200).redirect('/signup')
        } catch (error) {
            return res.status(500).json({ message: "error server", err: error.message })
        }
    }

})


/////////////////////////////////////////////////reset password user/////////////////////////////////////////////////////////////
router.get("/resetPassword/:username", async (req, res) => {
    const user = req.session.user;
    const data = { password } = req.body
    if (req.session.user && req.cookies.user_seed && req.session.user.role === 'admin') {
        try {
            const findBlogger = await User.findOne({ userName: req.params.username })
            findBlogger.password = findBlogger.phoneNumber
            await findBlogger.save()
            res.redirect("/admin/manageBlogger")
        } catch (error) {
            console.log(error.message);
            res.render("500")
        }
    } else {
        res.redirect("/signIn")
    }
})
////////////////////////////////////////delete Article/////////////////////////////////////////////////////////////////
router.get("/delete/Article/:id", async (req, res) => {
    if (req.session.user && req.cookies.user_seed && req.session.user.role === 'admin') {
        try {
            //    const commentArticleFinde = await Comment.find({ article : req.params.id})
            //     for (let i = 0; i < commentArticleFinde.length; i++) {
            //         const element = commentArticleFinde[i];
            //         console.log(element.user);
            //     }
            const commentArticle = await Comment.deleteMany({ article: req.params.id })
            console.log(commentArticle);
            const deleteArticle = await Article.findOneAndDelete({ _id: req.params.id })
            console.log(deleteArticle);
            const dir = path.join(__dirname, "../public/uploads/images/article", deleteArticle.mainPhoto)
            console.log(dir);
            fs.unlinkSync(dir)
            const findArticles = await Article.find({}).populate("author")
            res.render("manageArticle", { Articles: findArticles })
        } catch (error) {
            console.log(error.message);
            res.render("500")
        }
    } else {
        res.redirect("/signIn")
    }
})
///////////////////////////////////////delete blogger and Article and comment/////////////////////////////////////////////////////
router.get("/delete/Blogger/Article/:id", async (req, res) => {
    if (req.session.user && req.cookies.user_seed && req.session.user.role === 'admin') {
        try {
            const commentBlogger = await Comment.deleteMany({ user: req.params.id })
            const findBlogger = await User.findOne({ _id: req.params.id })
            //    const user_id = mongoose.Types.ObjectId(findBlogger._id)
            const dirr = path.join(__dirname, "../public/uploads/images/avatar", findBlogger.img)
            fs.unlinkSync(dirr)
            const findArticles = await Article.find({ author: req.params.id })
            let photoArticle = findArticles.map(async (value) => {
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
            const deleteArticle = await Article.deleteMany({ author: req.params.id })
            const deleteUser = await User.findByIdAndDelete(req.params.id);
            const Blogger = await User.find({ role: 'blogger' })
            res.render('blogger', { Bloggers: Blogger })
        } catch (error) {
            console.log(error.message);
            res.render("500")
        }
    } else {
        res.redirect("/signIn")
    }
})






















module.exports = router