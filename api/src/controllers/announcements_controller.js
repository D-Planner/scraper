import Announcement from '../models/announcement';

const updateCurrentAnnouncement = () => {
    return new Promise((resolve, reject) => {
        Announcement.find({})
            .then((result) => {
                if (result.length !== 0) {
                    resolve(result[result.length - 1]);
                } else {
                    resolve(null);
                }
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
};

const getCurrentAnnouncement = (req, res) => {
    updateCurrentAnnouncement().then((updateResult) => {
        res.send(updateResult);
    }).catch((error) => {
        res.status(500).json(error);
    });
};

const getAllAnnouncements = (req, res) => {
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
    if (
        req.body.fields.text === undefined ||
        req.body.fields.link === undefined ||
        req.body.fields.show_on_open === undefined
    ) {
        res.status(503).send('Input not valid, please make sure {text}, {link}, {show_on_open} are defined.');
    } else {
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
    }
};

const deleteAnnouncement = (req, res) => {
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
    Announcement.deleteMany({}, res.json({ message: '🎉 All announcements deleted' }))
        .catch((error) => {
            res.status(500).json(error);
        });
};

const announcementsController = {
    getCurrentAnnouncement, updateAnnouncement, newAnnouncement, getAnnouncement, deleteAnnouncement, deleteAllAnnouncements, getAllAnnouncements,
};

export default announcementsController;
