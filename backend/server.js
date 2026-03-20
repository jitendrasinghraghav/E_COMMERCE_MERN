import express from 'express'
import 'dotenv/config'
import connectDB from './database/db.js';
import userRoute from './routes/userRoutes.js'
 
const app = express();
const PORT= process.env.PORT || 3000

app.use(express.json())

app.use('/api/v1/user',userRoute)

app.listen(PORT,()=>{
    connectDB()
    console.log(`server is lishening at port:${PORT}`);
})