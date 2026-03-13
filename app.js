// State
let state = {
    step: 1,
    files: {
        followers: null,
        following: null
    },
    parsedData: {
        followers: [],
        following: []
    },
    results: {
        unfollowers: [], // Following but not followers (They don't follow you back)
        fans: [],        // Followers but not following (You don't follow them back)
        mutuals: []      // Both
    },
    activeTab: 'unfollowers',
    searchQuery: ''
};

// DOM Elements
const appContainer = document.getElementById('app');

// Utilities
const createElement = (htmlString) => {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
};

// App rendering logic
function render() {
    appContainer.innerHTML = '';
    let stepContent = '';

    switch(state.step) {
        case 1: stepContent = step1(); break;
        case 2: stepContent = step2(); break;
        case 3: stepContent = step3(); break;
        case 4: stepContent = step4(); break;
        case 5: stepContent = step5(); break;
        case 6: stepContent = step6(); break;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'step-container';
    wrapper.innerHTML = stepContent;
    appContainer.appendChild(wrapper);

    // Attach step specific events
    attachEventsForStep(state.step);
}

// Navigation
function nextStep() {
    state.step++;
    render();
}

function attachEventsForStep(step) {
    if (step <= 3) {
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.addEventListener('click', nextStep);
    } else if (step === 4) {
        setupDropzones();
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                if (state.files.followers && state.files.following) {
                    nextStep(); // Go to processing
                    processFiles(); // Start processing
                }
            });
        }
    } else if (step === 6) {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                state.activeTab = e.target.dataset.tab;
                render(); // Re-render results
            });
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = state.searchQuery;
            searchInput.focus();
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value.toLowerCase();
                renderUsers(); // Just update user grid
            });
        }

        // Export
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportData);
        }
    }
}

// Steps Templates
function step1() {
    return `
        <h1 class="title-gradient">Find Your Instagram Unfollowers</h1>
        <p class="subtitle">Analyze your Instagram data privately. Everything runs locally in your browser.</p>
        
        <div class="info-card">
            <h3>How it works</h3>
            <p>The tool compares your:</p>
            <ul>
                <li>Followers list</li>
                <li>Following list</li>
            </ul>
            <p style="margin-top: 10px;">To find:</p>
            <ul>
                <li>Users you follow that don't follow you back</li>
            </ul>
        </div>

        <div class="important-msg">
            <i class="ph ph-shield-check" style="font-size: 1.5rem;"></i>
            <span><strong>No login required. No Instagram access.</strong><br>Your data never leaves your browser.</span>
        </div>

        <button id="nextBtn" class="btn btn-nav-next" title="Next">
            <i class="ph ph-arrow-right"></i>
        </button>
    `;
}

function step2() {
    return `
        <h2 class="title-gradient">How to Download Your Data</h2>
        <p class="subtitle">Request your metadata directly from Instagram's settings.</p>

        <ol class="instruction-list">
            <li><div class="step-num">1</div> Go to Instagram</li>
            <li><div class="step-num">2</div> Settings</li>
            <li><div class="step-num">3</div> Accounts Center</li>
            <li><div class="step-num">4</div> Your information and permissions</li>
            <li><div class="step-num">5</div> Download your information</li>
            <li><div class="step-num">6</div> Request download in <strong>JSON</strong> format</li>
        </ol>

        <p style="color: var(--text-secondary);">
            <i class="ph ph-envelope-simple"></i> Instagram will send you an email with a download link when it's ready.
        </p>

        <button id="nextBtn" class="btn btn-nav-next" title="Next">
            <i class="ph ph-arrow-right"></i>
        </button>
    `;
}

function step3() {
    return `
        <h2 class="title-gradient">Extract the Files</h2>
        <p class="subtitle">Unzip your downloaded archive and locate these specific files.</p>

        <div class="info-card">
            <p>Navigate to this folder path in your unzipped folder:</p>
            <div class="file-tree" style="margin-top: 1rem;">
                📁 connections<br>
                └─ 📁 followers_and_following<br>
                &nbsp;&nbsp;&nbsp;├─ 📄 <span class="highlight">followers_1.json</span><br>
                &nbsp;&nbsp;&nbsp;└─ 📄 <span class="highlight">following.json</span>
            </div>
        </div>

        <button id="nextBtn" class="btn btn-nav-next" title="Next">
            <i class="ph ph-arrow-right"></i>
        </button>
    `;
}

function step4() {
    return `
        <h2 class="title-gradient">Upload the Files</h2>
        <p class="subtitle">Drag and drop your JSON files below.</p>

        <div class="upload-grid">
            <div class="dropzone ${state.files.followers ? 'success' : ''}" id="dropzone-followers">
                <i class="ph ${state.files.followers ? 'ph-check-circle' : 'ph-users'}"></i>
                <h4>Upload Followers</h4>
                <p>${state.files.followers ? state.files.followers.name : 'followers_1.json'}</p>
                <input type="file" id="input-followers" class="file-input" accept=".json">
            </div>

            <div class="dropzone ${state.files.following ? 'success' : ''}" id="dropzone-following">
                <i class="ph ${state.files.following ? 'ph-check-circle' : 'ph-user-plus'}"></i>
                <h4>Upload Following</h4>
                <p>${state.files.following ? state.files.following.name : 'following.json'}</p>
                <input type="file" id="input-following" class="file-input" accept=".json">
            </div>
        </div>

        <div style="display:flex; justify-content: flex-end; width:100%; margin-top:1rem;">
            <button id="analyzeBtn" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem; border-radius:16px;" ${(!state.files.followers || !state.files.following) ? 'disabled' : ''}>
                Analyze Data <i class="ph ph-arrow-right"></i>
            </button>
        </div>
    `;
}

function step5() {
    return `
        <div class="loader-container">
            <div class="spinner"></div>
            <h2 class="title-gradient">Analyzing your data...</h2>
            <p class="subtitle" style="text-align:center;">Running matching algorithms locally.</p>
        </div>
    `;
}

function step6() {
    return `
        <div class="results-header">
            <div>
                <h2 class="title-gradient">Your Results</h2>
                <p class="subtitle" style="margin-bottom:0;">Analysis complete.</p>
            </div>
            <button id="exportBtn" class="btn">
                <i class="ph ph-download-simple"></i> Download Results
            </button>
        </div>

        <div class="tabs">
            <button class="tab-btn ${state.activeTab === 'unfollowers' ? 'active' : ''}" data-tab="unfollowers">
                Not Following Back <span class="tab-badge">${state.results.unfollowers.length}</span>
            </button>
            <button class="tab-btn ${state.activeTab === 'fans' ? 'active' : ''}" data-tab="fans">
                Fans <span class="tab-badge">${state.results.fans.length}</span>
            </button>
            <button class="tab-btn ${state.activeTab === 'mutuals' ? 'active' : ''}" data-tab="mutuals">
                Mutuals <span class="tab-badge">${state.results.mutuals.length}</span>
            </button>
        </div>

        <div class="search-box">
            <i class="ph ph-magnifying-glass"></i>
            <input type="text" id="searchInput" placeholder="Search username...">
        </div>

        <div class="user-grid" id="userGrid">
            <!-- Rendered via JS -->
        </div>
    `;
}


// Setup drag and drop for step 4
function setupDropzones() {
    ['followers', 'following'].forEach(type => {
        const dropzone = document.getElementById(`dropzone-${type}`);
        const input = document.getElementById(`input-${type}`);

        if (!dropzone || !input) return;

        dropzone.addEventListener('click', () => input.click());

        input.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleFile(type, e.target.files[0]);
            }
        });

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                handleFile(type, e.dataTransfer.files[0]);
            }
        });
    });
}

function handleFile(type, file) {
    if (file.name.endsWith('.json')) {
        state.files[type] = file;
        render(); // Re-render to update UI state (marks, button enabled)
    } else {
        alert('Please upload a valid JSON file.');
    }
}

// Data Processing Flow
function processFiles() {
    Promise.all([
        readFileAsJSON(state.files.followers),
        readFileAsJSON(state.files.following)
    ]).then(([followersJSON, followingJSON]) => {
        
        // Simulating heavy processing for UX
        setTimeout(() => {
            extractData(followersJSON, followingJSON);
            calculateResults();
            nextStep(); // Move to step 6
        }, 1500);

    }).catch(err => {
        console.error("Error processing files", err);
        alert("An error occurred reading the files. Ensure they are valid JSON.");
        state.step = 4; // go back
        render();
    });
}

function readFileAsJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
            try {
                resolve(JSON.parse(e.target.result));
            } catch(err) {
                reject(err);
            }
        };
        reader.onerror = e => reject(e);
        reader.readAsText(file);
    });
}

// Extremely robust username extraction from Instagram's nested JSON
// It searches for arrays named "string_list_data" and grabs their "value"
function generateUsernames(jsonObj) {
    let users = new Set();

    function recurse(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(recurse);
        } else if (typeof obj === 'object' && obj !== null) {
            // Instagram format often is: { "string_list_data": [{ "href": "...", "value": "username" }] }
            if (obj.string_list_data && Array.isArray(obj.string_list_data)) {
                obj.string_list_data.forEach(item => {
                    if (item.value) users.add(item.value);
                });
            } else {
                for (let key in obj) {
                    recurse(obj[key]);
                }
            }
        }
    }
    
    recurse(jsonObj);
    return Array.from(users);
}

function extractData(followersJSON, followingJSON) {
    state.parsedData.followers = generateUsernames(followersJSON);
    state.parsedData.following = generateUsernames(followingJSON);
}

function calculateResults() {
    const followersSet = new Set(state.parsedData.followers);
    const followingSet = new Set(state.parsedData.following);

    // Unfollowers: You follow them, but they aren't in your followers list
    state.results.unfollowers = state.parsedData.following.filter(u => !followersSet.has(u));
    
    // Fans: They follow you, but they aren't in your following list
    state.results.fans = state.parsedData.followers.filter(u => !followingSet.has(u));

    // Mutuals: Intersection
    state.results.mutuals = state.parsedData.following.filter(u => followersSet.has(u));
}

// Render Results Data
function renderUsers() {
    const grid = document.getElementById('userGrid');
    if (!grid) return;

    let displayList = state.results[state.activeTab] || [];
    
    if (state.searchQuery) {
        displayList = displayList.filter(u => u.toLowerCase().includes(state.searchQuery));
    }

    grid.innerHTML = '';

    if (displayList.length === 0) {
        grid.innerHTML = `<div class="empty-state">
            <i class="ph ph-ghost" style="font-size:3rem; margin-bottom:1rem;"></i>
            <p>No users found in this category.</p>
        </div>`;
        return;
    }

    // Performance optimization: render via document fragment if large
    const fragment = document.createDocumentFragment();
    
    displayList.forEach(username => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <div class="user-avatar">
                <i class="ph ph-user"></i>
            </div>
            <div class="user-info">
                <a href="https://instagram.com/${username}" target="_blank" rel="noopener noreferrer" class="user-username">
                    ${username}
                </a>
            </div>
        `;
        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
}

// Hook into post-render of step 6
const originalRender = render;
render = function() {
    originalRender();
    if (state.step === 6) {
        renderUsers();
    }
}

// Export logic
function exportData() {
    const activeData = state.results[state.activeTab];
    let content = "Instagram Username List\\n\\n";
    content += activeData.join("\\n");

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram_${state.activeTab}_list.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Start app
    render();
});
