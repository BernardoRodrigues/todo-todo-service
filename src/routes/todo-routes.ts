import { InvalidJwtError } from './../errors/invalid-jwt.error';
import { DbConnection } from './../db/db-connection';
import { TodoRepository } from '../db/todo.repository';
import express from "express";
import { MissingJwtError } from '../errors/missing-jwt-error';
import axios from 'axios';
import { Agent } from 'https';
import { ServiceNotAvailableError } from '../errors/service-not-available.error';
import { BaseError } from '../errors/base.error';
import { CodeError } from '../errors/code.error';
import { checkIfNullOrUndefined } from '../utils/util';
import { MissingValuesError } from '../errors/missing-values.error';

//TODO get secret the right way
const router = express.Router()

const db = new DbConnection(process.env.TODO_DB_URL);
const todoRep = new TodoRepository(db)
const instance = axios.create(
    {httpsAgent: new Agent({rejectUnauthorized: false}), proxy: false}
)
const getUserIdFromJwt = async (req: any): Promise<string> => {
    if (req.headers.authorization == null) {
        throw new MissingJwtError('jwt is null');
    }
    const token = req.headers.authorization.split(" ")[1]
    if (token == null) {
        throw new MissingJwtError('jwt is null');
    }
    const res = await instance.get(`${process.env.TODO_USER_SERVICE_PATH}/service/user/verify-jwt?token=${token}`)
    switch(res.status) {
        case 200:
            return res.data.value.id;
        case 400:
            throw new InvalidJwtError("Not Authorized");
        default:
        case 500:
            throw new ServiceNotAvailableError("Service not available") 
    }
}

router.get('/', async (req, res) => {
    try {
        // 03b3a8c1-9aaa-4e39-9cd7-3d96ab0867a4
        const id = await getUserIdFromJwt(req)
        const todos = await todoRep.getAllByUserId(id);
        console.table(todos);
        return res.status(200).json(todos)
    } catch(ex) {
        console.error(ex)
        return handleError(ex, res)
    } 
}).post('/', async (req, res) => {
    const { startDate, endDate, title, priority } = req.body;
    try {
        const check = checkIfNullOrUndefined(startDate, endDate, title, priority);
        if (check != null) {
            throw new MissingValuesError(`${check} is empty`)
        }
        const userId = await getUserIdFromJwt(req);
        const id = await todoRep.create({userId, startDate, endDate, title, priority})
        return res.status(201).json(id);
    } catch(ex) {
        console.error(ex)
        return handleError(ex, res)
    }
}).put('/:id', async (req, res) => {
    try {
        const { startDate, endDate, title, priority } = req.body;
        const { id } = req.params
        const check = checkIfNullOrUndefined(id, startDate, endDate, title, priority);
        if (check != null) {
            throw new MissingValuesError(`${check} is empty`)
        }
        const userId = await getUserIdFromJwt(req);
        const r = await todoRep.updateTodoValues({id, userId, startDate, endDate, title, priority})
        return res.status(201).json({message: "Success"});
    } catch(ex) {
        console.error(ex)
        return handleError(ex, res)
    }
})
.put('/status/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params
        const check = checkIfNullOrUndefined(id, status);
        if (check != null) {
            throw new MissingValuesError(`${check} is empty`)
        }
        const isDone: boolean = status;
        await getUserIdFromJwt(req);
        await todoRep.updateDoneStatus({id, isDone})
        return res.status(200).json({message: "Success"});
    } catch(ex) {
        console.error(ex)
        return handleError(ex, res)
    }
}).get('/after-date', async (req, res) => {
    const { date  } = req.query;
    try {
        const check = checkIfNullOrUndefined(date);
        if (check != null) {
            throw new MissingValuesError(`${check} is empty`)
        }
        const id = await getUserIdFromJwt(req);
        const todos = await todoRep.getAfterDate(date as string);
        return res.status(200).json(todos)
    } catch (ex) {
        console.error(ex);
        return handleError(ex, res);
    }
}).put('/cancel/:id', async (req, res) => {
    try {
        const { id } = req.params
        const check = checkIfNullOrUndefined(id);
        if (check != null) {
            throw new MissingValuesError(`${check} is empty`)
        }
        const isCancelled = true;
        await getUserIdFromJwt(req);
        await todoRep.cancelTodo({id, isCancelled})
        return res.status(200).json({message: "Success"});
    } catch(ex) {
        console.error(ex)
        return handleError(ex, res)
    }
})

export default router;

const handleError = (ex: any, res: any) => {
    const err: BaseError = ex;
    switch (err.code) {
        case CodeError.MissingValues:
            return res.status(400).json(err.message);
        case CodeError.InvalidJwt:
        case CodeError.MissingJwt:
            return res.status(405).json({ message: 'Unauthorized' });
        default:
        case CodeError.DbNotAvailable:
        case CodeError.ServiceNotAvailable:
            return res.status(500).json({ message: 'Server error' });
    }
}
