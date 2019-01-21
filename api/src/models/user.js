import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true },
    first_name: String,
    last_name: String,
    favorite_courses: { type: [Schema.Types.ObjectID], ref: 'Course' },
    completed_courses: { type: [Schema.Types.ObjectID], ref: 'Course' },
    settings: {},
}, {
    toJSON: {
        virtuals: true,
    },
});

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
