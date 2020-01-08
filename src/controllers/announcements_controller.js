import Announcement from '../models/announcement';

const updateCurrentAnnouncement = () => {
    return new Promise((resolve, reject) => {
        Announcement.find({})
            .then((result) => {
                if (result.length !== 0) {
                    resolve(result[result.length - 1]);
                } else {
                    // Add clear deleted announcements feature
                    resolve(null);
                }
            }).catch((error) => {
                console.log('error');
                console.log(error);
                reject(error);
            });
    });
};

const getCurrentAnnouncement = (req, res) => {
    console.log('get current announcement');

    updateCurrentAnnouncement().then((updateResult) => {
        console.log('announcement result', updateResult);
        res.send(updateResult);
    }).catch((error) => {
        res.status(500).json(error);
    });
};

const getAllAnnouncements = (req, res) => {
    console.log('get all announcements');

    Announcement.find({})
        .then((result) => {
            res.json({ result });
        }).catch((error) => {
            res.status(500).json(error);
        });
};

const getAnnouncement = (req, res) => {
    Announcement.findById(req.params.id)
        .then((result) => {
            res.json({ result });
        }).catch((error) => {
            res.status(500).json(error);
        });
};

const updateAnnouncement = (req, res) => {
    console.log(`update announcement with id ${req.body.id}`);

    Announcement.updateOne({ _id: req.body.id }, { $set: req.body.update })
        .then((result) => {
            updateCurrentAnnouncement().then((updateResult) => {
                res.json({ message: `🎉 Announcement ${req.body.id} updated`, updateResult });
            });
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const newAnnouncement = (req, res) => {
    console.log('new announcement');

    const announcement = new Announcement({
        text: req.body.fields.text,
        link: req.body.fields.link,
        times_shown: 0,
        times_clicked: 0,
        show_on_open: req.body.fields.show_on_open,
    });

    announcement.save()
        .then((result) => {
            updateCurrentAnnouncement().then((updateResult) => {
                res.json({ message: `🎉 Announcement ${result._id} added`, updateResult });
            });
        }).catch((error) => {
            res.status(500).json({ error });
        });
};

const deleteAnnouncement = (req, res) => {
    console.log('delete announcement');

    Announcement.findByIdAndDelete(req.params.id)
        .then((result) => {
            updateCurrentAnnouncement().then((updateResult) => {
                res.json({ message: `🎉 Announcement ${result._id} deleted`, updateResult });
            });
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
    getCurrentAnnouncement, updateAnnouncement, newAnnouncement, getAnnouncement, deleteAnnouncement, deleteAllAnnouncements, getAllAnnouncements,
};

export default announcementsController;
