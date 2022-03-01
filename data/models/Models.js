import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  admin: { type: Boolean, required: true },
  profilePicture: { type: String, required: false },
  tasks: { type: taskSchema, required: false },
});

const taskSchema = new mongoose.Schema({
  category: { type: Array, required: true },
  description: { type: String, required: true },
  hours: { type: Number, required: true },
  public: { type: Boolean, required: true },
  created: { type: Date, required: true },
});

const UsersModel = mongoose.model("Users", userSchema);
const TasksModel = mongoose.model("Tasks", taskSchema);

module.exports = { UsersModel, TasksModel };
