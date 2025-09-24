// Sample project data
const projectsData = [
    {
        id: 1,
        title: "E-Commerce Platform",
        description: "A modern, responsive e-commerce platform built with React and Node.js. Features include user authentication, payment processing, and inventory management.",
        status: "active",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        comments: [
            {
                id: 1,
                author: "John Doe",
                text: "Great project! The UI looks really clean and user-friendly.",
                timestamp: "2024-01-15T10:30:00Z"
            },
            {
                id: 2,
                author: "Jane Smith",
                text: "I love how you implemented the payment system. Very secure approach!",
                timestamp: "2024-01-16T14:22:00Z"
            }
        ],
        following: false
    },
    {
        id: 2,
        title: "Task Management App",
        description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
        status: "in-progress",
        technologies: ["Vue.js", "Socket.io", "Express", "PostgreSQL"],
        comments: [
            {
                id: 3,
                author: "Mike Johnson",
                text: "The drag-and-drop feature works perfectly! Looking forward to the mobile version.",
                timestamp: "2024-01-14T09:15:00Z"
            }
        ],
        following: true
    },
    {
        id: 3,
        title: "Weather Dashboard",
        description: "An interactive weather dashboard that provides detailed forecasts, weather maps, and alerts for multiple locations worldwide.",
        status: "completed",
        technologies: ["JavaScript", "D3.js", "OpenWeather API", "CSS3"],
        comments: [
            {
                id: 4,
                author: "Sarah Wilson",
                text: "The data visualization is stunning! Great use of D3.js.",
                timestamp: "2024-01-10T16:45:00Z"
            },
            {
                id: 5,
                author: "David Brown",
                text: "Very accurate weather predictions. I use this daily now!",
                timestamp: "2024-01-12T08:30:00Z"
            },
            {
                id: 6,
                author: "Emily Davis",
                text: "Could you add support for more cities? Otherwise, perfect app!",
                timestamp: "2024-01-13T12:20:00Z"
            }
        ],
        following: false
    }
];

// Global variables
let currentProject = null;
let projects = [...projectsData];

// DOM elements
const projectsGrid = document.getElementById('projects-grid');
const commentModal = document.getElementById('comment-modal');
const closeModalBtn = document.getElementById('close-modal');
const commentsList = document.getElementById('comments-list');
const commentInput = document.getElementById('comment-input');
const addCommentBtn = document.getElementById('add-comment-btn');
const themeToggle = document.getElementById('theme-toggle');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    renderProjects();
    setupEventListeners();
});

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme;
    updateThemeToggleIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.className;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeToggleIcon(newTheme);
}

function updateThemeToggleIcon(theme) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Event listeners setup
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Modal close events
    closeModalBtn.addEventListener('click', closeCommentModal);
    commentModal.addEventListener('click', function(e) {
        if (e.target === commentModal) {
            closeCommentModal();
        }
    });
    
    // Keyboard events
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && commentModal.classList.contains('show')) {
            closeCommentModal();
        }
    });
    
    // Add comment button
    addCommentBtn.addEventListener('click', addComment);
    
    // Comment input enter key
    commentInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            addComment();
        }
    });
}

// Render all projects
function renderProjects() {
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

// Create a project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-project-id', project.id);
    
    card.innerHTML = `
        <div class="project-header">
            <div>
                <h3 class="project-title">${project.title}</h3>
                <span class="project-status status-${project.status}">
                    ${project.status.replace('-', ' ')}
                </span>
            </div>
        </div>
        
        <p class="project-description">${project.description}</p>
        
        <div class="project-technologies">
            ${project.technologies.map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('')}
        </div>
        
        <div class="project-actions">
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="viewProject(${project.id})">
                    📱 View Project
                </button>
                <button class="btn btn-secondary" onclick="openCommentModal(${project.id})">
                    💬 Comments (${project.comments.length})
                </button>
            </div>
            <button class="btn btn-follow ${project.following ? 'following' : ''}" 
                    onclick="toggleFollow(${project.id})">
                ${project.following ? '✓ Following' : '+ Follow'}
            </button>
        </div>
    `;
    
    return card;
}

// Project actions
function viewProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        // In a real app, this would navigate to the project details page
        alert(`Opening ${project.title}...`);
    }
}

function toggleFollow(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.following = !project.following;
        renderProjects(); // Re-render to update the follow button
        
        // Animate the change
        const card = document.querySelector(`[data-project-id="${projectId}"]`);
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 150);
    }
}

// Comment modal functions
function openCommentModal(projectId) {
    currentProject = projects.find(p => p.id === projectId);
    if (currentProject) {
        renderComments();
        commentModal.classList.add('show');
        commentInput.focus();
        
        // Update modal title
        const modalTitle = commentModal.querySelector('.modal-header h2');
        modalTitle.textContent = `Comments - ${currentProject.title}`;
    }
}

function closeCommentModal() {
    commentModal.classList.remove('show');
    currentProject = null;
    commentInput.value = '';
}

function renderComments() {
    if (!currentProject) return;
    
    commentsList.innerHTML = '';
    
    if (currentProject.comments.length === 0) {
        commentsList.innerHTML = `
            <div class="no-comments">
                <p>No comments yet. Be the first to comment!</p>
            </div>
        `;
        return;
    }
    
    currentProject.comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
    });
}

function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    
    const date = new Date(comment.timestamp);
    const formattedDate = date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    commentDiv.innerHTML = `
        <div class="comment-author">${comment.author}</div>
        <div class="comment-time">${formattedDate}</div>
        <div class="comment-text">${comment.text}</div>
    `;
    
    return commentDiv;
}

function addComment() {
    if (!currentProject) return;
    
    const commentText = commentInput.value.trim();
    if (!commentText) {
        alert('Please enter a comment before submitting.');
        return;
    }
    
    // Create new comment
    const newComment = {
        id: Date.now(), // Simple ID generation
        author: 'You', // In a real app, this would be the current user
        text: commentText,
        timestamp: new Date().toISOString()
    };
    
    // Add comment to project
    currentProject.comments.push(newComment);
    
    // Update the project in the main array
    const projectIndex = projects.findIndex(p => p.id === currentProject.id);
    if (projectIndex !== -1) {
        projects[projectIndex] = currentProject;
    }
    
    // Re-render comments and projects
    renderComments();
    renderProjects(); // Update comment count on card
    
    // Clear input and show success feedback
    commentInput.value = '';
    
    // Animate the new comment
    const newCommentElement = commentsList.lastElementChild;
    if (newCommentElement) {
        newCommentElement.style.opacity = '0';
        newCommentElement.style.transform = 'translateY(20px)';
        setTimeout(() => {
            newCommentElement.style.transition = 'all 0.3s ease';
            newCommentElement.style.opacity = '1';
            newCommentElement.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // Scroll to bottom of comments
    commentsList.scrollTop = commentsList.scrollHeight;
}

// Animation utilities
function animateElement(element, animation) {
    element.style.animation = animation;
    element.addEventListener('animationend', function() {
        element.style.animation = '';
    }, { once: true });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for potential use in other modules
window.ProjectPortfolio = {
    openCommentModal,
    toggleFollow,
    viewProject,
    toggleTheme
};