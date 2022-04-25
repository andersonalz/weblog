const mongoose = require('mongoose');
const schema = mongoose.Schema



const ArticleSchema = schema({
    title: {
        type : String,
        require : true,
        minLength : 3
    },
    category: {
        type : String,
        require : true,
        enum: ['It', 'Dev' , 'Design'],
    },
    body: {
        type : String,
        minLength : 3,
        
    },
    description: {
        type : String,
        require : true,
    },
    previewPhoto: {
        data: Buffer,
        contentType: String
    },
    createAt: {
        type : Date,
        default : Date.now
    },
    countView: {
        type: String,
    },
    mainPhoto: {
        type: String,  
    },
    Active : {
        type : Boolean
    },
    author:
    {
        type : schema.Types.ObjectId,
        ref : 'User',
        require : true
    }
})


ArticleSchema.pre(/^find/, function async(next) {
    this.find({ Active: { $ne: "false" } });
    next();
})

const Article = mongoose.model('Article', ArticleSchema)
module.exports = Article

