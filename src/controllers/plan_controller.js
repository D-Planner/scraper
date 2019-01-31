import Plan from '../models/plan';

export const getPlansByUserId = (id) => {
    return Plan.find({ user_id: id });
};
