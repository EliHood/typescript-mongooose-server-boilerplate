import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    min: [6]
  },
  password: {
    type: String,
    required: true,
    min: [6]
  },
  createdAt: { type: Date, default: Date.now() }
});
// have to use unarrow functions
userSchema.pre("save", function(next: any) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(12, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePass = async function(candidatePass, next) {
  try {
    console.log("teffffsf");
    const isMatch = await bcrypt.compare(candidatePass, this.password);
    return isMatch;
  } catch (err) {
    return next(err);
  }
};
const User = mongoose.model("User", userSchema);
export default User;
