import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const AdvisorSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    full_name: String,
    settings: {},
    email: { type: String, required: true, unique: true },
    password: { type: String },
    advisees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    autocreated: Boolean,
    claimed: Boolean,
    account_created: Number,
    account_claimed: Number,
    netid: String,
    department: String,
    primary_affiliation: String,
    college_affiliation: String,
});

const saltRounds = 10;

AdvisorSchema.pre('save', function (next) {
    // Check if document is new or a new password has been set
    if (this.toObject.password && (this.isNew || this.isModified('password'))) {
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

const AdvisorModel = mongoose.model('Advisor', AdvisorSchema);

export default AdvisorModel;
