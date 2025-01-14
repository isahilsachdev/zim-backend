const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");

const getRefreshTokenResponse = async (user, remember_me= false ) => {
  try {
    const token_expiry = remember_me ? '30d' : '24h';
    
    const user_data = { 
      id: user.id,
      name: user.name,
      email: user.email, 
      status: user.status,
    }
    const token = jwt.sign(
      user_data,
      process.env.JWT_SECRET,
      { expiresIn: token_expiry }
    );
    return {
      token_data: { 
        token,
        user: user_data,
      },
      // workspaces_data: workspaces_data,
    };
  } catch (error) {
    console.error('Error getting refresh token response:', error);
    throw error;
  }
};

const processGoogleAuthCode = async (code) => {
  console.log('Google Auth Code:', code);
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

  // Function to exchange the authorization code for an access token
  const getAccessToken = async (authCode) => {
    const { tokens } = await oauth2Client.getToken(authCode);
    oauth2Client.setCredentials(tokens); // Set the credentials on the OAuth2 client
    return tokens;
  };

  // Function to fetch user information using the access token
  const getUserInfo = async () => {
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const userInfo = await oauth2.userinfo.get();
    return userInfo.data;
  };

  try {
    const google_user = await getUserInfo();
    
    return google_user;
  } catch (error) {
    console.error('Error processing Google auth code:', error);
    throw error;
  }
};

module.exports = {
  getRefreshTokenResponse,
  processGoogleAuthCode
};