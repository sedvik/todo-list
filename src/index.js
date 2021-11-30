import { viewController } from './modules/viewController.js';
import { events } from './modules/events.js';
import { storage } from './modules/storage.js';
import { app } from './modules/app.js';
import { db } from './modules/db.js';
import { firebaseApp } from './modules/firebase.js';
import { onAuthStateChanged, getAuth } from '@firebase/auth';
import './css/reset.css';
import './css/style.css';

// Retrieve projects from localStorage
const projects = storage.load();
console.log(projects);

onAuthStateChanged(getAuth(firebaseApp), async (user) => {
  const projects = await db.load()
  console.log(projects);
  app.init(projects);
});

// setTimeout(async () => {
//   const projects = await db.load();
//   // console.log(projects);
//   app.init(projects);
// }, 500);

// Initialize viewController, events, and storage modules
viewController.init();
events.init();
storage.init();
db.init();

// Initialize application
// app.init(projects);
