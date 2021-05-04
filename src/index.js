import './styles/style.scss';
import { translation } from './js/translation';
import AOS from 'aos';
import anime from 'animejs/lib/anime.es.js';

const selectors = {
    LANGUAGE_BTN: '.language-container',
    ICONS_CONTAINER: '.checkbox-icons-container',
    PROJECT: '.project',
    TECHNOLOGIES: '.technologies',
    ALL_TECHNOLOGIES_BTN: '#all-technologies',
    ICON_BOX: '.icon-box',
    INPUT_CHECKED: 'input[type="checkbox"]:checked',
};

let technologiesMap = {};
const projectsSet = new Set();

function initTechnologiesMap() {
    const technologies = document.querySelectorAll(selectors.TECHNOLOGIES);

    technologies.forEach((el) => {
        const project = el.closest(selectors.PROJECT);
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

function intersection(setA, setB) {
    let intersection = new Set();
    setB.forEach((elem) => {
        if (setA.has(elem)) {
            intersection.add(elem);
        }
    });
    return intersection;
}

function refreshFilteredProjects() {
    const checkedTechnologiesButtons = document.querySelectorAll(selectors.INPUT_CHECKED);
    let projectsToShow = projectsSet;

    projectsToShow = Array
        .from(checkedTechnologiesButtons)
        .reduce((acc, el) => intersection(acc, technologiesMap[el.id]), projectsSet);
   
    projectsSet.forEach((el) => {
            el.style.display = projectsToShow.has(el) ? 'block' : 'none';
    });
    AOS.refresh();
}

function initProjectsSet() {
    const projects = document.querySelectorAll(selectors.PROJECT);

    projects.forEach((el) => {
        projectsSet.add(el);
    });
}

function showAllProjects() {
    const checkedTechnologiesButtons = document.querySelectorAll(selectors.INPUT_CHECKED);
    checkedTechnologiesButtons.forEach((el) => {
        el.checked = false;
    } );
    refreshFilteredProjects();
}

function init() {
    const languageButtonElement = document.querySelector(selectors.LANGUAGE_BTN);
    const technologiesIconsContainerElement = document.querySelector(selectors.ICONS_CONTAINER);
    const allTechnologiesButtonElement = document.querySelector(selectors.ALL_TECHNOLOGIES_BTN);

    initTechnologiesMap();
    initProjectsSet();
    AOS.init();
    anime({
        targets: selectors.ICON_BOX,
        rotate: '2turn',
        duration: 1500
    });
    languageButtonElement.addEventListener('input', translateContent);
    technologiesIconsContainerElement.addEventListener('input', refreshFilteredProjects);
    allTechnologiesButtonElement.addEventListener('click', showAllProjects);
}

init();