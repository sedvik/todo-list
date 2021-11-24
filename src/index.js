import { viewController } from './modules/viewController.js';
import { events } from './modules/events.js';
import { storage } from './modules/storage.js';
import { app } from './modules/app.js';
import './css/reset.css';
import './css/style.css';

// Retrieve projects from localStorage
const projects = storage.load();

// Initialize viewController, events, and storage modules
viewController.init();
events.init();
storage.init();

// Initialize application
app.init(projects);
