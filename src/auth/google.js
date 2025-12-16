// Passport Google OAuth strategy e helper (italiano)
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('../prisma');
const { firmaAccessToken } = require('../services/jwt');

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;

if (clientID && clientSecret) {
  passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      // cerca utente per socialId o per email
      let user = null;
      if (profile.id) {
        user = await prisma.utente.findFirst({ where: { socialId: profile.id, socialProvider: 'google' } });
      }
      if (!user && email) {
        user = await prisma.utente.findUnique({ where: { email } });
      }
      if (!user) {
        // crea nuovo utente
        user = await prisma.utente.create({
          data: {
            email: email || `google_${profile.id}@noemail.local`,
            nome: profile.displayName || 'Utente Google',
            socialId: profile.id,
            socialProvider: 'google'
          }
        });
      } else {
        // aggiorna socialId se manca
        if (!user.socialId) {
          await prisma.utente.update({ where: { id: user.id }, data: { socialId: profile.id, socialProvider: 'google' } });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
} else {
  console.warn('GOOGLE_CLIENT_ID/SECRET non impostati: Google OAuth disabilitato');
}

module.exports = passport;