import mongoose, { Schema } from 'mongoose';

const ProfessorSchema = new Schema({
    name: { type: String, index: 'text' },
    nameLowCase: { type: String, unique: true },
    reviews: [String],
    // For Future Scraping
    // department: String,
    // pic_url: String,
    // bio: String,
    // email: String,
    // website: String,
    // office: String,
}, {
    toJSON: {
        virtuals: true,
    },
});

// create model class
const ProfessorModel = mongoose.model('Professor', ProfessorSchema);


export default ProfessorModel;
