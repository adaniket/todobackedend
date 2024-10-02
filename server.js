import express from "express"
import cors from "cors"
import "dotenv/config.js"
import dbConnection from "./src/config/dbConfig.js"
import userRoutes from "./src/routes/user.routes.js"
import TaskRoutes from "./src/routes/task.routes.js"


const startServer = async()=>{
    try {
        
        await dbConnection(process.env.MONGO_URL)
        const app = express();
        const PORT = process.env.PORT || 5000

        // middleware
        app.use(cors());
        app.use(express.json())

        // routes  
        app.use("/api/user",userRoutes)
        app.use("/api/task",TaskRoutes)


        // server
        app.listen(PORT,()=>{
            console.log("live on port",PORT)
        })
    } catch (error) {
        throw(error)
    }
}
startServer()