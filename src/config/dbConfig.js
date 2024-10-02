import mongoose from "mongoose";

const dbConnection = async(url)=>{
    try {
        if (url) {
            await mongoose.connect(url)
            console.log("connected to mongoDB")
        }else{
            throw("URL is not given!")
        }
    } catch (error) {
        throw(error)
    }
}

export default dbConnection;