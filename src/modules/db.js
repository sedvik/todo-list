import { firebaseApp } from './firebase';
import { getAuth } from '@firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  getDocs
} from '@firebase/firestore'
import { pubSub } from './pubSub';

const firestore = getFirestore(firebaseApp);

// saveProject function, saves data from a given project to the firestore
async function saveProject(project, uid) {
  try {
    // Add project information
    const projectRef = doc(firestore, `users/${uid}/projects`, project.id)
    await setDoc(projectRef, {
      id: project.id,
      name: project.name
    });

    // Add todos to firestore
    const todos = project.todos
    todos.forEach(todo => {
      const todoRef = doc(firestore, `users/${uid}/projects/${project.id}/todos`, todo.id);
      setDoc(todoRef, {
        id: todo.id,
        complete: todo.complete,
        description: todo.description,
        dueDate: todo.dueDate,
        priority: todo.priority,
        title: todo.title
      });
    });
  } catch(error) {
    console.error(error);
  }
}

// save function, saves data to firestore
function save(data) {
  const auth = getAuth(firebaseApp);
  
  // Return from the function if a user has not logged in
  if (auth.currentUser === null) {
    return;
  }

  const uid = auth.currentUser.uid;

  // Extract projects from data parameter
  const projects = data.projects;

  // Save data from each project to firestore
  projects.forEach(project => saveProject(project, uid));
}

// load function, loads data from firestore and reassembles data back into objects for factory function rehydration
async function load() {

  // Get uid from auth object
  const auth = getAuth(firebaseApp);
  const uid = auth.currentUser.uid;
  
  // Get project ids from user document
  const projectsQuery = query(collection(firestore, `users/${uid}/projects`));
  const projectsQuerySnapshot = await getDocs(projectsQuery);

  // Get all associated project data using getProject
  const projectData = projectsQuerySnapshot.docs.map(doc => doc.data());
  const projects = projectData.map(projectData => getProject(uid, projectData));

  return await Promise.all(projects);
}

// getProject asynchrously returns a project and all of its associated information from the firestore
async function getProject (uid, projectData) {
  const project = {
    activeTodo: null,
    id: projectData.id,
    name: projectData.name,
    todos: []
  };

  // Query each project's todos and add the todos to the project
  const todosQuery = query(collection(firestore, `users/${uid}/projects/${project.id}/todos`));
  const todosQuerySnapshot = await getDocs(todosQuery);

  for (const doc of todosQuerySnapshot.docs) {
    const todo = doc.data();
    project.todos.push(todo);
  }

  return project;
}

// Initialize pubsub subscriptions to automatically save to db on update of relevant data
function init() {
  pubSub.subscribe('projectsChange', save);
  pubSub.subscribe('todosChange', save)
  pubSub.subscribe('activeProjectChange', save);
}

const db = {
  init,
  load
};

export { db };
