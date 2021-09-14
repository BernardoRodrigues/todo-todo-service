

import { config } from 'dotenv';
import { resolve } from "path";
import { readFileSync } from "fs";

console.log(resolve(__dirname, '..', '..', 'environments', `${process.env.NODE_ENV}.env`))
config(
    {
        path: resolve(__dirname, '..', '..', 'environments', `${process.env.NODE_ENV}.env`)
    }
)

import express from "express";
import logger from 'morgan'
// import { version } from '../package.json'
import * as todoRouter from './routes/todo-routes'
// import { createServer as httpCreateServer } from "http";
import { createServer } from "https";  
import { json } from "body-parser";
// const createServer = process.env.NODE_ENV === 'production' ? httpsCreateServer : httpCreateServer;


const app = express()
// console.log("")
const port = process.env.PORT || 5000;
const server = createServer(
    {
        cert: readFileSync(resolve(__dirname, 'cert', 'todo-service.crt')),
        key: readFileSync(resolve(__dirname, 'cert', 'todo-service.key')),
    },
    app
        .use(logger('dev'))
        .use(json())
        .use(`/service/todo`, todoRouter.default)
        .use('*', (_, res) => res.status(404).json({message: "Page not found"}))
).listen(port, () => console.log(`Server started on port ${port}`))

process.on('SIGINT', () => {
    server.close();
    process.exit(-1);
})

