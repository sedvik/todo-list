import { domUtil } from './util.js';

function createProjectTitleContent(activeProjectName) {
    const h2 = domUtil.create('h2', activeProjectName);
    return h2;
}

export { createProjectTitleContent };