import './styles/style.scss';
import { translation } from './js/translation';
import AOS from 'aos';
import anime from 'animejs/lib/anime.es.js';

const classes = {
    LANGUAGE_BTN: 'language-container',
    ICONS_CONTAINER: 'checkbox-icons-container',
    PROJECT: 'project',
    TECHNOLOGIES: 'technologies',
    ICON_BOX: 'icon-box',
};

const id = {
    ALL_TECHNOLOGIES_BTN: 'all-technologies',
};

const tags = {
    INPUT: 'input',
};

const technologiesMap = {};
const projectsSet = new Set();

function initTechnologiesMap() {
    const technologies = document.querySelectorAll(`.${classes.TECHNOLOGIES}`);

    technologies.forEach((el) => {
        const project = el.closest(`.${classes.PROJECT}`);
        el.innerText.split(', ').forEach((tech) => {
            if (!technologiesMap[tech]) {
                technologiesMap[tech] = new Set();
            }
            technologiesMap[tech].add(project);
        });
    });
}

function translateContent(e) {
    const stringsToBeResolved = document.querySelectorAll('[data-content]');
    const selectedLanguage = e.target.id;

    stringsToBeResolved.forEach(el => {
        el.textContent = translation[el.attributes['data-content'].value][selectedLanguage];
    });
}

function findIntersection(setA, setB) {
    const intersectionSet = new Set();
    setB.forEach((elem) => {
        if (setA.has(elem)) {
            intersectionSet.add(elem);
        }
    });
    return intersectionSet;
}

function refreshFilteredProjects() {
    const checkedTechnologiesButtons = document.querySelectorAll(`${tags.INPUT}[type="checkbox"]:checked`);
    let projectsToShow = Array
        .from(checkedTechnologiesButtons)
        .reduce((acc, el) => findIntersection(acc, technologiesMap[el.id]), projectsSet);

    projectsSet.forEach((el) => {
            el.style.display = projectsToShow.has(el) ? 'block' : 'none';
    });
    AOS.refresh();
}

function initProjectsSet() {
    const projects = document.querySelectorAll(`.${classes.PROJECT}`);

    projects.forEach((el) => {
        projectsSet.add(el);
    });
}

function showAllProjects() {
    const checkedTechnologiesButtons = document.querySelectorAll(`${tags.INPUT}[type="checkbox"]:checked`);
    checkedTechnologiesButtons.forEach((el) => {
        el.checked = false;
    } );
    refreshFilteredProjects();
}

function setUpListeners() {
    const languageButtonElement = document.querySelector(`.${classes.LANGUAGE_BTN}`);
    const technologiesIconsContainerElement = document.querySelector(`.${classes.ICONS_CONTAINER}`);
    const allTechnologiesButtonElement = document.querySelector(`#${id.ALL_TECHNOLOGIES_BTN}`);

    languageButtonElement.addEventListener('input', translateContent);
    technologiesIconsContainerElement.addEventListener('input', refreshFilteredProjects);
    allTechnologiesButtonElement.addEventListener('click', showAllProjects);
}

function init() {
    initTechnologiesMap();
    initProjectsSet();
    AOS.init();
    anime({
        targets: `.${classes.ICON_BOX}`,
        rotate: '2turn',
        duration: 1500
    });
    setUpListeners();
}

init();