const User = require("../../Models/User");
const { getRefreshTokenResponse, processGoogleAuthCode } = require("../helpers/helper");

const Login = async (req, res) => {
  const { email, password, remember_me, platform, code } = req.body;
  if (code && platform) {
    switch (platform) {
      case 'google':
        try {
          const google_user = await processGoogleAuthCode(code);
          // console.log('Google User:', google_user);
          const google_user_email = google_user.email;
          const existing_user = await User.findOne({ where: { email: google_user_email } });

          if (existing_user) {
            const { token_data } = await getRefreshTokenResponse(existing_user);
            return res.status(200).json(token_data);
          } else {
            return res.status(400).json({ message: 'User does not exist' });
          }
        } catch (error) {
          console.error('Error getting google user:', error);
          return res.status(500).send('Server error');
        }
      default:
        return res.status(400).json({ message: 'Invalid platform' });
    }
  } else {
    try {
      const user = await User.findOne({
        where: { email },
        attributes: ['id', 'name', 'password', 'email', 'status'],
      });

      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const { token_data } = await getRefreshTokenResponse(user, remember_me);

      return res.json(token_data);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  }
};

module.exports = {
  Login,
};