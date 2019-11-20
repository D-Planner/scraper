import mongoose, { Schema } from 'mongoose';

const AuthSchema = new Schema({
    code: String,
    timeout: Number,
    name: String,
    email: String,
});

const AuthModel = mongoose.model('Auth', AuthSchema);

export default AuthModel;
