import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
