import Task from "../model/task.model.js";
import User from "../model/user.model.js";
import { statusCodes } from "../utils/constant.js";

class taskController {
  static getTask = async (req, res) => {
    try {
      const id = req.params.id;
      const allTask = await Task.find({ userId: id });
      if (allTask) {
        return res.status(statusCodes.success).json({
          status: "success",
          message: "List of all tasks!",
          data: allTask,
        });
      }
    } catch (error) {
      res
        .status(statusCodes.error)
        .json({ massgae: "There is error", error: error });
    }
  };
  static createTask = async (req, res) => {
    try {
      const { listName, styleDetails, userId } = req.body;

      if (!listName || !userId) {
        return res
          .status(statusCodes.error)
          .json({ status: "error", message: "Every fields required!" });
      }
      const findUser = User.findById(userId);
      if (!findUser) {
        return res
          .status(statusCodes.error)
          .json({ status: "error", message: "User not found!" });
      }
      const newTask = await Task({
        listName,
        styleDetails,
        userId,
      });

      const save = await newTask.save();
      return res
        .status(statusCodes.success)
        .json({ status: "success", message: "New task list added!" });
    } catch (error) {
      res
        .status(statusCodes.error)
        .json({ massgae: "There is error", error: error });
    }
  };

  static getSingleTask = async (req, res) => {
    try {
      const id = req.params.id;
      const SingleTask = await Task.find({ _id: id });
      if (SingleTask) {
        return res.status(statusCodes.success).json({
          status: "success",
          message: "Single task data!",
          data: SingleTask,
        });
      }
    } catch (error) {
      res
        .status(statusCodes.error)
        .json({ massgae: "There is error", error: error });
    }
  };

  static addTask = async (req, res) => {
    try {
      const { taskName, status, listId } = req.body;
      if (!taskName) {
        return res
          .status(statusCodes.error)
          .json({ status: "error", message: "Task name required!" });
      }

      if (!listId) {
        return res
          .status(statusCodes.serverError)
          .json({ status: "error", message: "List ID is required!" });
      }
      const updatedList = await Task.findByIdAndUpdate(
        listId,
        {
          $push: {
            taskList: {
              taskName,
              status: status || "pending", // Default to 'pending' if no status is provided
            },
          },
        },
        { new: true } // Returns the updated document
      );

      if (!updatedList) {
        return res
          .status(statusCodes.notFound)
          .json({ status: "error", message: "List not found!" });
      }

      return res.status(statusCodes.success).json({
        status: "success",
        message: "Task added successfully!",
        data: updatedList,
      });
    } catch (error) {
      return res.status(statusCodes.serverError).json({
        status: "error",
        message: "There was an error",
        error: error.message,
      });
    }
  };

  static updateTaskStatus = async (req, res) => {
    try {
      const { status, listId, taskId } = req.body;
      if (!listId || !taskId || !status) {
        return res.status(statusCodes.error).json({
          status: "error",
          message: "ListId or TaskId or Status is not present!",
        });
      }
      const findList = await Task.findById({ _id: listId });
      if (!findList) {
        return res
          .status(statusCodes.error)
          .json({ status: "error", message: "List is not present!" });
      }
      // Find the specific task to update
      const findTask = findList.taskList.id(taskId);
      if (!findTask) {
        return res.status(statusCodes.error).json({
          status: "error",
          message: "This task is not present or deleted!",
        });
      }

      // Update the task status
      findTask.status = status;
      // Save the updated list
      await findList.save();
      const getUpdatedData = await Task.findById({ _id: listId });
      return res.status(statusCodes.success).json({
        status: "success",
        message: "Task status updated successfully!",
        data: getUpdatedData,
      });
    } catch (error) {
      return res.status(statusCodes.serverError).json({
        status: "error",
        message: "There was an error",
        error: error.message,
      });
    }
  };

  static deleteTask = async (req, res) => {
    try {
      const { listId, taskId } = req.body;

      if (!listId || !taskId) {
        return res.status(statusCodes.error).json({
          status: "error",
          message: "List ID and Task ID are required!",
        });
      }

      const updatedList = await Task.findByIdAndUpdate(
        listId,
        {
          $pull: {
            taskList: { _id: taskId }, // Removes the task with the given taskId
          },
        },
        { new: true } // Returns the updated document
      );

      if (!updatedList) {
        return res
          .status(statusCodes.notFound) // Status code for not found
          .json({ status: "error", message: "List not found!" });
      }

      return res
        .status(statusCodes.success) // Status code for success
        .json({
          status: "success",
          message: "Task deleted successfully!",
          data: updatedList,
        });
    } catch (error) {
      return res.status(statusCodes.serverError).json({
        status: "error",
        message: "There was an error",
        error: error.message,
      });
    }
  };

  static deleteList = async (req, res) => {
    try {
      const { listId,userId } = req.body;

      if (!listId) {
        return res.status(statusCodes.error).json({
          status: "error",
          message: "List ID are required!",
        });
      }

      const updatedList = await Task.findByIdAndDelete({_id:listId});

      if (!updatedList) {
        return res
          .status(statusCodes.notFound) // Status code for not found
          .json({ status: "error", message: "List not found!" });
      }
      console.log(userId)
      const newUpdateList = await Task.find({userId:userId})

      console.log(newUpdateList)
      return res
        .status(statusCodes.success) // Status code for success
        .json({
          status: "success",
          message: "List deleted successfully!",
          data: newUpdateList,
        });
    } catch (error) {
      return res.status(statusCodes.serverError).json({
        status: "error",
        message: "There was an error",
        error: error.message,
      });
    }
  };
}
export default taskController;
