import { createIcons, Github, ArrowUpRight, ArrowUp, ArrowRight, ArrowDown, Menu, X, MapPin, Mail, Code2, Palette, Braces, Server, Database, GitBranch, Box, Code, Workflow, Sparkles, Brain, Layers3, FileText, ShoppingBag, Bot, Linkedin } from 'lucide';
import { renderNavigation, renderHero, renderTech, renderAbout, renderProjects, renderProcess, renderLearning, renderGithub, renderContact, renderFooter } from '../components/render.js';
import { initInteractions } from '../interactions/interaction.js';
import '../styles/main.css';

const icons = { Github, ArrowUpRight, ArrowUp, ArrowRight, ArrowDown, Menu, X, MapPin, Mail, Code2, Palette, Braces, Server, Database, GitBranch, Box, Code, Workflow, Sparkles, Brain, Layers3, FileText, ShoppingBag, Bot, Linkedin };

window.lucide = { createIcons };

renderNavigation();
renderHero();
renderTech();
renderAbout();
renderProjects();
renderProcess();
renderLearning();
renderGithub();
renderContact();
renderFooter();

createIcons({ icons });
initInteractions();
