import mongoose from 'mongoose';
import { DEV_DB_URL, NODE_ENV, PROD_DB_URL } from './serverConfig.js';
export default async function connectedDb() {
  try {
 const dbURL = NODE_ENV === "development" ? DEV_DB_URL : PROD_DB_URL;
 await mongoose.connect(dbURL)
    console.log(`The database is connected to the ${NODE_ENV}`);
  } catch (error) {
    console.log('ERROR CONNECTING TO DATABASE', error);
  }
}
