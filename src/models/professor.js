import mongoose, { Schema } from 'mongoose';

const ProfessorSchema = new Schema({
    name: {type: String, unique: true} ,
    // department: String,
    // pic_url: String,
    // bio: String,
    // email: String,
    // website: String,
    // courses: [{}],         For future scraping?
    // office: String,
}, {
    toJSON: {
        virtuals: true,
    },
});

// create model class
const ProfessorModel = mongoose.model('Professor', ProfessorSchema);


export default ProfessorModel;
