import admin from "firebase-admin";
const serviceAccount = require("./serviceAccount.json");

export default admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
