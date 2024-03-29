require("express-async-errors");
require("dotenv/config");


const migrationRun = require("./database/migrations");
const AppError = require("./utils/AppError");
const express = require("express");
const routes = require("./routes");
const cors = require("cors");

const uploadImages = require('./configs/upload');


const app = express();
app.use("/files/dishes", express.static(uploadImages.UPLOADS_FOLDER))
app.use(cors());
app.use(express.json());

app.use(routes);

migrationRun();

app.use((error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    console.error(error);

    return response.status(500).json({
        status: "error",
        message: "Internal server error",
    });
})



const PORT = process.env.SERVER_PORT || 3333;
app.listen(PORT, () => console.log(`Server in running on Port ${PORT}`));

