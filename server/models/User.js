const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name must be 100 characters or fewer'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,        // MongoDB creates a unique index: no two users can share an email
      lowercase: true,     // "Gracy@Mail.com" is stored as "gracy@mail.com"
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,       // queries leave this field out unless we ask for it explicitly
    },
  },
  {
    timestamps: true,      // adds createdAt and updatedAt automatically
  }
);

// Whenever this document is converted to JSON (for an API response),
// remove the password hash and Mongoose's internal __v field.
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);