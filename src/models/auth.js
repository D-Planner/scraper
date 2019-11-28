import mongoose, { Schema } from 'mongoose';

const AuthSchema = new Schema({
    code: { type: String, required: true },
    timeout: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
});

const AuthModel = mongoose.model('Auth', AuthSchema);

export default AuthModel;
