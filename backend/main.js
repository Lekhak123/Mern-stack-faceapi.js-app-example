const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(express.urlencoded({limit: '50mb'}));

app.use(express.json({limit: '50mb'}));

const userRoute = require("./routes/Users");
const faceRoute = require("./routes/Face");
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Db connected!");
    })
    .catch((e) => {
        console.log(e);
    });

app.use("/api/users", userRoute);
app.use("/api/image", faceRoute);

app.listen(8800, () => {
    console.log("Backend is running!");
})