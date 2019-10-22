import mongoose, { Schema } from 'mongoose';

const AnnouncementSchema = new Schema({
    text: String,
    link: String,
    times_shown: Number,
    times_clicked: Number,
    enabled: Boolean,
});

const AnnouncementModel = mongoose.model('Announcement', AnnouncementSchema);

export default AnnouncementModel;
