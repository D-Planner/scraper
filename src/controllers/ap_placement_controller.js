import APPlacementModel from '../models/ap_placement';

const newAPPlacement = (req, res) => {
    console.log('newAPPlacement');
    const newPlacement = new APPlacementModel({
        name: req.body.test,
        score: req.body.score,
    });

    console.log('newPlacement', newPlacement);

    newPlacement.save().then((savedAPPlacement) => {
        res.send(savedAPPlacement);
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const getAPPlacement = (req, res) => {
    console.log('getAPPlacement');
    APPlacementModel.findById(req.params.id).then((placement) => {
        res.send(placement);
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const updateAPPlacement = (req, res) => {
    console.log('updateAPPlacement');
    console.log('change', req.body.change);
    APPlacementModel.findById(req.params.id).then((placement) => {
        if (req.body.change.name) { placement.name = req.body.change.name; }
        if (req.body.change.score) { placement.score = req.body.change.score; }
        console.log('placement', placement);
        placement.save().then((savedPlacement) => {
            console.log('savedPlacement', savedPlacement);
            res.send(savedPlacement);
        }).catch((error) => {
            res.status(500).json({ error });
        });
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const removeAPPlacement = (req, res) => {
    console.log('removeAPPlacement');
    APPlacementModel.findOneAndDelete(req.params.id).then(() => {
        res.send('Removed AP Placement 🚀');
    }).catch((error) => {
        res.status(500).json({ error });
    });
};

const APPlacementController = {
    getAPPlacement,
    newAPPlacement,
    updateAPPlacement,
    removeAPPlacement,
};

export default APPlacementController;
