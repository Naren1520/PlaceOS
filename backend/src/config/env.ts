import crypto from 'crypto';

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/placeos',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_that_should_be_in_env',
};