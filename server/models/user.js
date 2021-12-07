const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
// unique:true as email is used most of time it fastens process of quering
// It does't check for uniqueness it just create cursor for fast fetching
// For checking for unique email we install package named as mongoose-unique-validator
