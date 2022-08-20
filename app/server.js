module.exports = class Application {
    #express = require("express")
    #app = this.#express()

    constructor(PORT, DB_URL) {
        this.configDataBase(DB_URL);
        this.configApplication();
        this.createServer(PORT);
        this.createRoutes();
        this.errorHandler();
    }

    configApplication() {
        const path = require("path");
        this.#app.use(this.#express.json({  }));
        this.#app.use(this.#express.urlencoded({ extended : false }));
        this.#app.use(this.#express.static(path.join(__dirname, "..", "public")));
    }

    createServer(PORT) {
        const http = require("http");
        const server = http.createServer(this.#app);
        server.listen(PORT, () => {
            console.log(`The server iss running in port ${PORT}`)
        })
    }

    async configDataBase(DB_URL){
    const mongoose = require("mongoose")
        try{
            const DBconnection = await mongoose.connect(DB_URL)
            console.log(`MongoDb connected : ${DBconnection.connection.host}`)
        }catch(err){
            console.log(err)
            process.exit(1)
        }
    }

    errorHandler(){
        this.#app.use((req, res, next) => {
            return res.status(404).json({
                success : false,
                status : 404,
                message : 'صفحه مورد نظر یافت نشد.'
            })
        });

        this.#app.use((error, req, res, next) => {
            const status = error?.status || 500;
            const message = error?.message || "InternalServerError";

            return res.status(status).json({
                status,
                success : false,
                message
            })
        })
    }

    createRoutes(){
        this.#app.get("/", (req, res, next) => {
            return res.json({
                message : "This the new express application."
            })
        })
    }
}