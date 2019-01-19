import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import { requireAuth, requireSignin } from './authentication/init';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to dPlanner!' });
});

router.post('/signin', requireSignin, UserController.signin);

router.post('/signup', UserController.signup);


router.post('/vote/:id', (req, res) =>{
  const vote = (req.body.vote === 'up');// convert to bool
  console.log(`voting: ${vote}`);
  Polls.vote(req.params.id, vote).then((result) => {
    res.send(result);
  });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

///your routes will go here

export default router;
