import Globals from '../models/globals';

const monthToTerm = ['W', 'S', 'X', 'F'];

const setGlobals = () => {
    const date = new Date();
    const [year, term] = [date.getFullYear() - 2000, (date.getMonth() - 1) % 4];
    const globals = {
        name: 'global',
        currentTerm: { year, term: monthToTerm[term] },
        nextTerm: {
            year: (term === 3) ? year + 1 : year,
            term: monthToTerm[(term + 1) % 4],
        },
    };
    Globals.findOneAndUpdate({ name: 'global' }, { globals }, { new: true });
    return { currTerm: globals.currentTerm, nextTerm: globals.nextTerm };
};

export { setGlobals };
