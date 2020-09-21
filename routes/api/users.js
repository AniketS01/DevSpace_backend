const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

router.post(
  '/',
  [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'please enter a valid email').isEmail(),
    check('password', 'enter a password of min 6 chars').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // see if user exist
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(500)
          .json({ errors: [{ msg: 'user already exists' }] });
      }
      // set gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // return jwt
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.err(err.message);
      res.status(500).send('server error.');
    }
  }
);

module.exports = router;
