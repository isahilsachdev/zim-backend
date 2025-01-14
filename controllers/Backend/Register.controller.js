const User = require("../../Models/User");
const { getRefreshTokenResponse, processGoogleAuthCode } = require('../helpers/helper');

const register = async (req, res) => {
  const { name, email, password, platform, code } = req.body;

  try {
    if (code && platform) {
      switch (platform) {
        case 'google':
          try {
            const google_user = await processGoogleAuthCode(code);
            console.log('Google User:', google_user);
            const google_user_email = google_user.email;
            const is_user_email_verified = google_user.verified_email;

            if (is_user_email_verified) {
              const existing_user = await User.findOne({ where: { email: google_user_email } });

              if (existing_user) {
                return res.status(409).json({ message: 'User already exists' });
              }

              const new_user = await User.create({ name: google_user.name, email: google_user.email, password: 'google' });
              const { token_data } = await getRefreshTokenResponse(new_user);
              return res.status(201).json(token_data);

            } else {
              return res.status(400).json({ message: 'User email not verified' });
            }
          } catch (error) {
            console.error('Error processing Google user', error);
            return res.status(500).json({ message: 'Error processing Google user' });
          }

        default:
          return res.status(400).json({ message: 'Invalid platform' });
      }
    } else {
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
      }

      const existing_user = await User.findOne({ where: { email } });
      if (existing_user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const new_user = await User.create({ name, email, password });
      const { token_data } = await getRefreshTokenResponse(new_user);
      return res.status(201).json(token_data);
    }
  } catch (err) {
    console.error('Server error:', err.message);
    return res.status(500).send('Server error');
  }
}

module.exports = { register };