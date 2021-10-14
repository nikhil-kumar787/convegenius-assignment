const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    name: {
      type: String,
    },
    vaccinated: {
      type: String,
    },
    phone: {
      type: String,
    },
    age: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
