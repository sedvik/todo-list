import { initializeApp } from '@firebase/app';

const config = {
  apiKey: "AIzaSyCR-gnbMcwW_jWPU07EWNK32hrl-Gqjous",
  authDomain: "todolist-c1450.firebaseapp.com",
  projectId: "todolist-c1450",
  storageBucket: "todolist-c1450.appspot.com",
  messagingSenderId: "485023420221",
  appId: "1:485023420221:web:44245864fa8b722f83bf54",
  measurementId: "G-SQ14HS4ZWQ"
};
const firebaseApp = initializeApp(config);

export { firebaseApp };