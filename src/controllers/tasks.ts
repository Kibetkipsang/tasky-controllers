import {type Request, type Response} from "express";
import {PrismaClient} from "@prisma/client";

const client = new PrismaClient();


// create new task
export const createTask = async (req: Request, res: Response) => {
    try{
        const { title, description } = req.body;
        const task = await client.task.create({
            data: {
                title,
                description,
                userId: req.user.id
            }
        });
        res.status(201).json(task);
    }catch(err){
        res.status(500).json({
            message: "something went wrong"
        });
    }
}


// getting all tasks
export const getTasks = async (req: Request, res: Response) => {
    try{
        const {id} = req.params
        const userId = req.user.id
        const task = await client.task.findMany({
            where: {
                AND : [{id: id}, {isDeleted: false}]
            }
        });
        if (!task){
            return res.status(404).json({
                message: "task not found"
            })
        }
    }catch(err){
        res.status(500).json({
            message: "something went wrong"
        })
    }
}

// getting task by id

export const getTaskById = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const userId = req.user.id;
        const task = await client.task.findFirst({
            where:{
                id: id,
                userId,
                isDeleted: false
            }
        });

        if(!task){
            return res.status(404).json({
                message: "task not found"
            })
        }
        res.status(200).json(task)
    }catch(e){
        res.status(500).json({
            message: "something went wrong"
        })
    }
}

// marking task as completed
export const completeTask = async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const userId = req.user.id;
        const completedTask = await client.task.updateMany({
        where:{
            AND: [{id: id}, {userId: userId}]
        },
        data: {
            isCompleted : true
        }
    });
    if (completedTask.count === 0){
        return res.status(404).json({
            message: "Task not found"
        })
    }

    res.status(200).json({
        message: "Task marked as completed"
    })
    }catch(err){
        res.status(500).json({
            message: "something went wrong"
        })
    }
}

// marking task as incomplete

export const incompleteTask = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const userId = req.user.id;
        const incomplete = await client.task.updateMany({
            where:{
                AND: [{id: id}, {userId: userId}]
            },
            data: {
                isCompleted: false
            }
        })
        if(incomplete.count === 0){
            return res.status(404).json({
                message: "no incomplete tasks"
            })
        }
        res.status(200).json({
            message: "Task successfully marked as incomplete"
        })
    }catch(e){
        res.status(500).json({
            message: "something went wrong"
        })
    }
}

// update task

export const updateTask = async (req: Request, res: Response) => {
    try{
        const {id} = req.params
        const {title, description} = req.body
        const userId = req.user.id
        const updatedTask = await client.task.updateMany({
            where: {
                id: id,
                userId: userId
            },
            data:{
                title: title && title,
                description: description && description
            }
        });
        if(!updatedTask){
            return res.status(404).json({
                message: "Task not found"
            })
        }
        console.log(updatedTask)
        res.status(200).json({
            message: "Task updated successfully"
        })
    }catch(err){
        res.status(500).json({
            message: "something went wrong"
        })
    }
}

// delete task
export const deletedTask = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const userId = req.user.id;
        const deleted = await client.task.updateMany({
            where:{
                AND: [{id: id}, {userId: userId}]
            },
            data: {
                isDeleted: true
            }
        })
        res.status(200).json({
            message: "successfully deleted task"
        })
    }catch(e){
        res.status(500).json({
            message: "something went wrong"
        })
    }

}


// get deleted tasks
export const trash = async (req: Request, res: Response) => {
    try{
        const userId = req.user.id;
        const tasks = await client.task.findMany({
            where: {
                AND: [{isDeleted: true}, {userId}]
            }
        })
        if(!tasks){
            return res.status(404).json({
                message: "No deleted tasks found"
            })
        }
        res.status(200).json(tasks)
    }catch(err){
        res.status(500).json({
            message: "something went wrong"
        })
    }
}



// recover deleted tasks
export const recoverDeletedTask = async (req: Request, res: Response) => {
    try{
        const {id} = req.params
        const userId = req.user.id;
        const recoveredTask = await client.task.updateMany({
            where: {
                AND: [{id: id}, {userId}]
            },
            data: {
                isDeleted: false
            }
        });
        res.status(200).json(recoveredTask)
    }catch(err){
        res.status(500).json({
            message: "something went wrong"
        })
    }
}
