import express from 'express';
import cookieParser from 'cookie-parser'
import { register, login, logout, changePassword } from './controllers/auth.js';
import { createTask, getTaskById, completeTask, incompleteTask, deletedTask, trash, recoverDeletedTask } from './controllers/tasks.ts';
import { getUsersProfile, updateUsersProfile, deleteUsersProfile } from './controllers/user.ts';
import { checkDetails } from './middlewares/checkDetails.ts';
import { checkPassStrength } from './middlewares/checkPasswordStrenghth.ts';
import { checkUsernameEmails } from './middlewares/checkUsernameEmails.ts';
import dotenv from 'dotenv';
import { verifyToken } from './middlewares/verifyTokens.ts';

dotenv.config()
const app = express();
app.use(express.json());
app.use(cookieParser());


// auth
app.post("/auth/register", checkDetails, checkUsernameEmails, checkPassStrength, register)
app.post("/auth/login", login)
app.post("/auth/logout", logout)
app.patch("/auth/password", verifyToken, changePassword)

// tasks
app.post("/tasks/create", verifyToken, createTask)
app.get("/tasks/:id", verifyToken, getTaskById)
app.patch("/tasks/:id/completed", verifyToken, completeTask)
app.patch("/tasks/:id/incomplete", verifyToken, incompleteTask)
app.delete("/tasks/:id/deleted", verifyToken, deletedTask)
app.get("/tasks/trash", verifyToken, trash)
app.patch("/tasks/:id/recover", verifyToken, recoverDeletedTask)


// Users
app.get("/users/getProfile", verifyToken, getUsersProfile)
app.patch("/users/updateProfile", verifyToken, updateUsersProfile)
app.delete("/users/deleteprofile", verifyToken, deleteUsersProfile)


const port = 5000;
app.listen(port, ()=>{
    console.log(`App running at http://localhost:${port}...`)
})