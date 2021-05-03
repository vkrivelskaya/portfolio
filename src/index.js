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
let projectsSet = new Set();

function initTechnologiesMap() {
    const technologies = document.querySelectorAll(selectors.TECHNOLOGIES);

    technologies.forEach((el) => {
        const project = el.closest(selectors.PROJECT);
        el.innerText.split(', ').forEach((tech) => {
            if (technologiesMap[tech] === undefined) {
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
    for (let elem of setB) {
        if (setA.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

function refreshFilteredProjects() {
    const checkedTechnologiesButtons = document.querySelectorAll(selectors.INPUT_CHECKED);
    let projectsToShow = projectsSet;

    checkedTechnologiesButtons.forEach((el) => {
        projectsToShow = intersection(projectsToShow, technologiesMap[el.id]);
    });

    projectsSet.forEach((el) => {
        if (projectsToShow.has(el)) {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
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
    const allTechnologiesButton = document.querySelector(selectors.ALL_TECHNOLOGIES_BTN);

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
    allTechnologiesButton.addEventListener('click', showAllProjects);
}

init();