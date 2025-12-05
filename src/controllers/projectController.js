const fs = require('fs').promises;
const path = require('path');

const projectsFile = path.join(__dirname, '../../projects.json');

const getProjects = async (req, res) => {
    const data = await fs.readFile(projectsFile, 'utf-8');
    const projects = JSON.parse(data);
    res.json(projects);
};

const getProjectsByCategory = async (req, res) => {
    const categoryQuery = req.query.category;
    const data = await fs.readFile(projectsFile, 'utf-8');
    const projects = JSON.parse(data);

    const filteredProjects = categoryQuery
        ? projects.filter(p => p.category && p.category.toLowerCase() === categoryQuery.toLowerCase())
        : projects;

    res.json(filteredProjects);
};

module.exports = { getProjects, getProjectsByCategory };
