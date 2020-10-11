import fs from 'fs';

import { getMethodsForType } from './helpers';
import {
  loadCurrent,
  update,
} from '../../helpers/data';

const scrape = async (req, res) => {
  const { type } = req.query;

  // verify eligible type
  if (!['timetable', 'orc'].includes(type)) {
    return res.status(400).send({ err: `invalid scrape type: '${type}'` });
  }

  // load most recent data from repo
  await loadCurrent()
    .catch((err) => {
      console.error(err.stack);

      return res.status(500).send({ err: 'Failed to load repo' });
    });

  // get appropriate  methods
  const { fetch, parse } = getMethodsForType(type);

  // get raw data
  const { hash, data } = await fetch(res)
    .catch((err) => {
      console.error(err.stack);

      if (!res.headersSent) {
        return res.status(500).send({ err: `Error fetching ${type}` });
      } else {
        res.write({ err: `Error fetching ${type}` });
        return res.end();
      }
    });

  // load versions file
  const versions = JSON.parse(
    fs.readFileSync('/tmp/data/versions.json'),
  );

  // check for changes, return early if none
  if (versions.current[type]?.hash === hash) {
    if (!res.headersSent) {
      return res.send({ msg: `No changes detected for ${type}` });
    } else {
      res.write({ msg: `No changes detected for ${type}` });
      return res.end();
    }
  }

  // parse raw data and write to local
  const nextData = parse(data);
  fs.writeFileSync(
    `/tmp/${type}_${hash}.json`,
    JSON.stringify(nextData, null, 2),
  );

  // TODO: commit eligible changes directly to master, PR anything needing verification

  // get current parsed data from repo
  // const currData = JSON.parse(
  //   fs.readFileSync(`/tmp/data/current/${type}.json`),
  // );

  // run diff to determine changes
  // const changes = diff(currData, nextData);

  // update repo
  await update(
    `current/${type}.json`,
    type,
    hash,
    `update in ${type} (${new Date().toISOString()})`,
  )
    .catch((err) => {
      console.error(err.stack);

      if (!res.headersSent) {
        return res.status(500).send({ err: 'Failed to update repo' });
      } else {
        res.write({ err: 'Failed to update repo' });
        return res.end();
      }
    });

  if (!res.headersSent) {
    return res.send({ msg: `Changes detected and pushed for ${type}` });
  } else {
    res.write({ msg: `Changes detected and pushed for ${type}` });
    return res.end();
  }
};

const ScrapeController = {
  scrape,
};

export default ScrapeController;
