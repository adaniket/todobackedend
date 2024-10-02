import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    listName: {
      type: String,
      required: true,
    },
    styleDetails: {
      backgroundColor: { type: String, required: true },
      color: { type: String, required: true },
    },
    taskList: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, 
        taskName: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "in-progress", "completed"],
          default: "pending",
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
