import { domUtil } from './util.js';

function createProjectDiv(projectName, projectId, isActiveProject) {
    // Parent
    const projectDivClassList = isActiveProject ? [ 'project', 'active-project' ] :  [ 'project' ];
    const projectDiv = domUtil.create('div', '', {
        class: projectDivClassList,
        attributes: {
            'data-name': projectName,
            'data-id': projectId
        }
    });

    // Children
    const nameP = domUtil.create('p', projectName, { class: 'project-name' });
    const delButton = domUtil.create('button', '-', { class: 'del-project' });
    const children = [ nameP, delButton ];

    // Append children to parent
    domUtil.appendChildren(projectDiv, children);

    return projectDiv;
}

function createSidebarContent(projectList, activeProjectId) {
    // parent
    const container = domUtil.create('div', '');
    
    // children
    projectList.forEach(project => {
        // Append children to parent
        const isActiveProject = project.id === activeProjectId;
        const projectDiv = createProjectDiv(project.name, project.id, isActiveProject);
        container.append(projectDiv);
    });

    return container;
}

export { createSidebarContent };