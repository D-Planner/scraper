import mongoose, { Schema } from 'mongoose';

const apPlacementSchema = new Schema({
    name: String,
    score: Number,
    date_taken: Number,
    location_taken: String,
});

const APPlacementModel = mongoose.model('apPlacement', apPlacementSchema);

export default APPlacementModel;
