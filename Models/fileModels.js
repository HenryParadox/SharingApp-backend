const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: String, required: true },
    uuid: { type: String, required: true },
    sender: { type: String, required: false },
    receiver: { type: String, required: false },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
