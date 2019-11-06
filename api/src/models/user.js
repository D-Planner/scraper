import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String },
    first_name: String,
    last_name: String,
    university: String,
    graduationYear: Number,
    favorite_courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    completed_courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }], // this should be only for courses we KNOW the user has actually taken in real life, we'll make an interface for them to add this
    placement_courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    majors: [{ type: Schema.Types.ObjectId, ref: 'Major' }],
    settings: {},
    emailVerified: Boolean,
    emailVerificationKey: String,
    emailVerificationKeyTimeout: Number,
    passwordVerificationKey: String,
    passwordVerificationKeyTimeout: Number,
}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
});

const saltRounds = 10;

// TODO: See if this is writeable as arrow function
UserSchema.pre('save', function (next) {
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

// TODO: See if this is writeable as arrow function
UserSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, same) => {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
};

UserSchema.virtual('full_name')
    .get(function () {
        return `${this.first_name} ${this.last_name}`;
    });

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
