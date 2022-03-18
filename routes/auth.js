/*
paht: /api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/new', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty().isEmail().withMessage('Invalid email'),
    check('password', 'Password is required').not().isEmpty().isLength({min: 6}).withMessage('Must be at least 5 chars long'),
    validateFields
], createUser);

router.post('/',[
    check('email', 'Email is required').not().isEmpty().isEmail().withMessage('Invalid email'),
    check('password', 'Password is required').not().isEmpty().isLength({min: 6}).withMessage('Must be at least 5 chars long'),
    validateFields
], login);
router.get('/renew', validateJWT, renewToken);

module.exports = router;