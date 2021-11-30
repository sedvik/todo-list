import { viewController } from './modules/viewController.js';
import { events } from './modules/events.js';
import { app } from './modules/app.js';
import { db } from './modules/db.js';
import { firebaseApp } from './modules/firebase.js';
import { onAuthStateChanged, getAuth } from '@firebase/auth';
import './css/reset.css';
import './css/style.css';

// Initialize viewController, events, and db modules
viewController.init();
events.init();
db.init();

// Setup authentication state listener to either load default projects or firestore project data, depending on user authentication state.
onAuthStateChanged(getAuth(firebaseApp), async (user) => {
  let projects;

  // If a user is not signed in, load default app projects. Otherwise retrieve them from the firestore using the db module.
  if (user === null) {
    projects = [
      {
        name: 'Project 1',
        todos: []
      }
    ];
  } else {
    projects = await db.load();
  }

  app.init(projects);
});