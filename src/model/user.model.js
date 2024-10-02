import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "must provide first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "must provide last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "must provide email"],
      trim: true,
      unique: true,
      /*validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }*/
    },
    password: {
      type: String,
      required: [true, "must provide password"],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
/* userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  }); */


const User = mongoose.model("User", userSchema);

export default User;
