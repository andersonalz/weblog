require("dotenv").config();
const env = process.env.NODE_ENV 
const development =  {
    db: `mongodb://localhost:27017/${process.env.MONGO_DB_NAME}`
}
const production = {
    db: `mongodb+srv://${process.env.MONGO_DB_USER}`
}
const config = {
    development , 
    production
}
module.exports = config[env]