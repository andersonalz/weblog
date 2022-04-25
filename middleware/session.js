const session =  {
    login: (req, res , next) => {
        if(!req.session.user || !req.cookies.user_seed){
           return res.redirect('/signIn')
           
        }
        next()
    },
    dashboard: (req, res , next) => {
        if(req.session.user&&req.cookies.user_seed){
           return res.redirect('/profile')
        }
        next()
    }
}
module.exports = session