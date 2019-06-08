import mongoose, { Schema } from 'mongoose';

const ProfessorSchema = new Schema({
    name: String,
    // courses: [{}],         For future scraping?
    // department: String,
    // office: String,
    // email: String,
    // website: String,
}, {
    toJSON: {
        virtuals: true,
    },
});

// create model class
const ProfessorModel = mongoose.model('Professor', ProfessorSchema);


export default ProfessorModel;
