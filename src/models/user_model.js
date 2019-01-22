import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const saltRounds = 10;

UserSchema.pre('save', (next) => {
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified('password')) {
    // Saving reference to this because of changing scopes
        const document = this;
        bcrypt.hash(
            document.password, saltRounds,
            (err, hashedPassword) => {
                if (err) {
                    next(err);
                } else {
                    document.password = hashedPassword;
                    next();
                }
            },
        );
    } else {
        next();
    }
});

UserSchema.methods.isCorrectPassword = (password, callback) => {
    bcrypt.compare(password, this.password, (err, same) => {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
};

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
