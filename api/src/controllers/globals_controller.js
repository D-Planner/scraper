import cheerio from 'cheerio';
import request from 'sync-request';
import Globals from '../models/globals';


const monthToTerm = ['X', 'F', 'W', 'S'];
const SeasonToTerm = {
    Summer: 'X',
    Fall: 'F',
    Winter: 'W',
    Spring: 'S',
};

const setGlobals = (req, res) => {
    const val = request('GET', 'https://www.dartmouth.edu/~reg/calendar/academic/19-20.html');
    const currYear = 2019;
    const $ = cheerio.load(val.body);

    const termStarts = $('div.b6 ul li')
        .text()
        .match(/[A-Z]\w{1,10}\s\d{1,2},\s\w{1,10}\s--\s\w{1,10}\sterm classes begin/gm)
        .map((start) => {
            let [date, term] = start.split(' -- ');

            date = new Date(date.split(',')[0]);

            Object.entries(SeasonToTerm).forEach(([k, v]) => {
                if (term.includes(k)) term = v;
            });
            date.setYear(['X', 'F'].includes(term) ? currYear : currYear + 1);
            return [date, term];
        });
    const termEnds = $('div.b6 ul li')
        .text()
        .match(/[A-Z]\w{1,10}\s\d{1,2},\s\w{1,10}\s--\s\w{1,10}\sterm classes end/gm)
        .map((end) => {
            let [date, term] = end.split(' -- ');

            date = new Date(date.split(',')[0]);

            Object.entries(SeasonToTerm).forEach(([k, v]) => {
                if (term.includes(k)) term = v;
            });
            date.setYear(['X', 'F'].includes(term) ? currYear : currYear + 1);
            return [date, term];
        });
    const week6 = termStarts.map(([date, term]) => {
        const newDate = new Date(date.toUTCString());
        newDate.setDate(date.getDate() + (6 * 7));
        term = monthToTerm[(monthToTerm.indexOf(term) + 1) % 4];
        return [newDate, term];
    });
    const today = new Date();
    let term = 'X';
    let year = currYear - 2000;
    let i = 0;
    while (i < week6.length) {
        if (today > week6[i][0]) {
            term = week6[i][1];
            year = week6[i][0].getFullYear() - 1999;
        }
        i += 1;
    }
    const start = termStarts.find(([dateVal, termVal]) => {
        return (termVal === term);
    })[0];
    const end = termEnds.find(([dateVal, termVal]) => {
        return (termVal === term);
    })[0];
    const globals = {
        name: 'global',
        currTerm: {
            year, term, start, end,
        },
        nextTerm: {
            year: (term === 'F') ? year + 1 : year,
            term: monthToTerm[(monthToTerm.indexOf(term) + 1) % 4],
        },
    };
    Globals.findOneAndUpdate({ name: 'global' }, globals, { new: true, upsert: true }).then((g) => {
        console.log(g);
        res.status(200).send({ globals });
    });
};

const getGlobals = (req, res) => {
    Globals.findOne({ name: 'global' })
        .then((globals) => {
            console.log(globals);
            res.status(200).send(globals);
        }).catch((e) => {
            res.status(500).send({ e });
        });
};

const GlobalsController = {
    setGlobals,
    getGlobals,
};
export default GlobalsController;
