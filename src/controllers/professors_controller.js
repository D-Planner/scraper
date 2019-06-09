import Professor from '../models/professor';

const getProfessors = (req, res) => {
  Professor.find({}).then((result) => {
    res.json(result);
  }).catch((error) => {
    res.status(500).json( {error} );
  })
}

const getProfessorId = async (pName) => {
  var query = Professor.find({name: pName});
  var res = query.then((docs) => {
    try {
      return docs[0]._id;
    } catch(e){
      return false;
    }
  });
  return res;

}

const getProfessorListId = async (profs) => {
  var list = [];
  if (profs && profs.length != 0){
    for (var pName of profs) {
      list.push(await getProfessorId(pName));
    }
  }
  return list;
}

const addProfessors = async (professors) => {
  if (professors && professors.length) {
    for (var pName of professors) {
      var id = await getProfessorId(pName);
      if (!id) {
        await Professor.create({name: pName}, (err, res) => {
          if (err) console.log(err);
        });
      }
    }
  }
}


const ProfessorController = {
  getProfessors,
  addProfessors,
  getProfessorId,
  getProfessorListId,
}

export default ProfessorController;
