import APPlacements from '../../static/data/ap_placements.json';

const getAPPlacements = (req, res) => {
    res.send(APPlacements);
};

const dataController = {
    getAPPlacements,
};

export default dataController;
