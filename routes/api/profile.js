const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const Post = require('../../models/Posts')
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const request = require('request')
const config = require('config')

// get current user
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'no profile exist for user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// create & update profile

router.post(
  '/',
  auth,
  [
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skills are required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;
    // build profile field
    const profilefields = {};

    profilefields.user = req.user.id;
    if (company) profilefields.company = company;
    if (website) profilefields.website = website;
    if (location) profilefields.location = location;
    if (bio) profilefields.bio = bio;
    if (status) profilefields.status = status;
    if (githubusername) profilefields.githubusername = githubusername;
    if (skills) {
      profilefields.skills = skills.split(',').map((skill) => skill.trim());
    }

    // build socialfield
    profilefields.social = {};
    if (youtube) profilefields.social.youtube = youtube;
    if (twitter) profilefields.social.twitter = twitter;
    if (facebook) profilefields.social.facebook = facebook;
    if (linkedin) profilefields.social.linkedin = linkedin;
    if (instagram) profilefields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profilefields },
          { new: true }
        );

        return res.json(profile);
      }
      //create
      profile = new Profile(profilefields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// get all profile
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// get profile by id
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) return res.status(400).json({ msg: 'not found' });
    res.send(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'not found' });
    }
    res.status(500).send('server error');
  }
});

//delete profile
router.delete('/', auth, async (req, res) => {
  try {
    await Post.deleteMany({user: req.user.id})
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'user deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// update exprience

router.put(
  '/experience',
  auth,
  [
    check('title', 'title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

/// delete exp

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});
 
 // add education
router.put(
  '/education',
  auth,
  [
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

/// delete exp

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// get github repos

router.get('/github/:username', (req, res)=> {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&
        sort=created:asc&client_id=${config.get(
          'githubClientId'
        )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },}

    request(options, (error, response, body) => {
      if(error) console.error(error)
      if(response.statusCode !== 200){
        res.status(404).json({msg: 'No github profile found'})
      }
      res.json(JSON.parse(body))
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
})

module.exports = router;
