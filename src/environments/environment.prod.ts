export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: process.env.FB_APK,
    authDomain: "showdogpro.firebaseapp.com",
    databaseURL: "https://showdogpro.firebaseio.com",
    projectId: "showdogpro",
    storageBucket: "showdogpro.appspot.com",
    messagingSenderId: "424379315073"
  },
  googleMapConfig:{
    apiKey: process.env.GM_APK
  }
};
