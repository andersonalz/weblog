function auth(roles) {
    return function (req, res, next) {
        if (!roles.includes(req.session.user.role)) {
            return res.render('404')
        }
        next();
    }
}
module.exports = auth;




