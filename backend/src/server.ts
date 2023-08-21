import app from "./app";
import env from "./util/validateEnv"
import mongoose from "mongoose";



const port = process.env.PORT

//Run server :npx tsc(outDir: trong file tsconfig) để conver từ ts->js  node dist/server.js or npm start



mongoose.connect(env.MONGO_CONNECTION_STRING)
    .then(()=>{
        console.log("Mongoose connected");
        app.listen(port , ()=>{
            console.log(`Server running on port ${port}`);
        })

    })
