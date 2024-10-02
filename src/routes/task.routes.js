import express from "express";
import taskController from "../controller/task.controller.js";

const TaskRoutes = express.Router();

TaskRoutes
.post("/create-list", taskController.createTask)
.post("/add-task", taskController.addTask)
.post("/delete-task", taskController.deleteTask)
.post("/update-task-status",taskController.updateTaskStatus)
.post("/delete-list",taskController.deleteList)
.get("/:id",taskController.getTask)
.get("/single-task/:id",taskController.getSingleTask)

export default TaskRoutes;
