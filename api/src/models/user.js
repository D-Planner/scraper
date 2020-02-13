import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
    accountCreated: Date,
    lastLogin: Date,
    totalFetchUserCalls: Number,
    totalUpdateTermCalls: Number,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String },
    firstName: String,
    lastName: String,
    university: String,
    graduationYear: Number,
    favorite_courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    completed_courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }], // this should be only for courses we KNOW the user has actually taken in real life, we'll make an interface for them to add this
    placement_courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    viewed_announcements: [{ type: Schema.Types.ObjectId, ref: 'Announcement' }],
    majors: [{ type: Schema.Types.ObjectId, ref: 'Major' }],
    interest_profile: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    dean: { type: Schema.Types.ObjectId, ref: 'Advisor' },
    faculty_advisor: { type: Schema.Types.ObjectId, ref: 'Advisor' },
    other_advisors: [{ type: Schema.Types.ObjectId, ref: 'Advisor' }],
    ap_profile: [{ type: Schema.Types.ObjectId, ref: 'apPlacement' }],
    tc_accepted: Boolean,
    tc_accepted_date: Number,
    settings: {},
    accessGranted: Boolean,
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

UserSchema.virtual('fullName')
    .get(function () {
        return `${this.firstName} ${this.lastName}`;
    });

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
