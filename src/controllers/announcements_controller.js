import Announcement from '../models/announcement';

const getAnnouncements = (req, res) => {
    Announcement.find({})
        .then((result) => {
            console.log('get announcements');
            // result.forEach((r) => {
            //     console.log(r);
            // });
            res.json({ result });
        }).catch((error) => {
            res.status(500).json(error);
        });
};

const getAnnouncement = (req, res) => {
    Announcement.findById(req.params.id)
        .then((result) => {
            console.log(result);
            res.json(result);
        }).catch((error) => {
            res.status(500).json(error);
        });
};

const updateAnnouncement = (req, res) => {
    console.log(`update announcement with id ${req.body.id}`);

    Announcement.findById(req.body.id).update(req.body.update)
        .then((result) => {
            res.json({ message: `🎉 Announcement ${result._id} updated` });
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const newAnnouncement = (req, res) => {
    console.log('new announcement');
    console.log(req.body.fields);

    const announcement = new Announcement({
        text: req.body.fields.text,
        link: req.body.fields.link,
        times_shown: 0,
        times_clicked: 0,
        enabled: true,
    });

    announcement.save()
        .then((result) => {
            res.json({ message: `🎉 Announcement ${result._id} added`, result });
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const deleteAnnouncement = (req, res) => {
    console.log('delete announcement');
    console.log(req.params.id);

    Announcement.findByIdAndDelete(req.params.id)
        .then((result) => {
            console.log(result);
            res.json({ message: `🎉 Announcement ${result._id} deleted` });
        }).catch((error) => {
            res.status(500).json(error);
        });
};

const deleteAllAnnouncements = (req, res) => {
    console.log('delete all announcements');

    Announcement.deleteMany({}, res.json({ message: '🎉 All announcements deleted' }))
        .catch((error) => {
            res.status(500).json(error);
        });
};

const announcementsController = {
    getAnnouncements, updateAnnouncement, newAnnouncement, getAnnouncement, deleteAnnouncement, deleteAllAnnouncements,
};

export default announcementsController;
