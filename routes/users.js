/*
paht: /api/users
*/
const { Router } = require('express');
const { getUsers, getUser } = require('../controllers/users');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();


router.get('/', validateJWT, getUsers);
router.get('/:uid', validateJWT, getUser);

module.exports = router;