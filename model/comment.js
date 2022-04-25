const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const commentSchema = Schema({
    Text : {
        type: String,
        maxLength : 1000 , 
    },
    CreateAt: {
        type : Date,
        default : Date.now
    },
    Active: {
        type : String,
        enum : ["true" , "false"],
        default : "false", 
    },
    article : {
        type:Schema.Types.ObjectId,
        ref : 'Article'
    },
    user : {
        type:Schema.Types.ObjectId,
        ref : 'User'
    },
    
})


const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment