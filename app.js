const t = {
    en: {
        step1_title: "Find Your Instagram Unfollowers",
        step1_subtitle: "Analyze your Instagram data privately. Everything runs locally in your browser.",
        step1_how_it_works: "How it works",
        step1_desc1: "The tool examines your Instagram backup and compares:",
        step1_list1: "Your Followers list",
        step1_list2: "Your Following list",
        step1_desc2: "To automatically find:",
        step1_list3: "Accounts you follow that don't follow you back",
        step1_privacy1: "No login required. No Instagram permissions needed.",
        step1_privacy2: "Your data never leaves your device.",
        step2_title: "How to Download Your Data",
        step2_subtitle: "Follow these steps in the Instagram app on your mobile:",
        step2_s1: "Go to Settings",
        step2_s2: "Open Accounts Center",
        step2_s3: "Navigate to Your information and permissions",
        step2_s4: "Select Export your information",
        step2_s5: "Click Create an export",
        step2_s6: "Select the account you want to export",
        step2_s7: "Set destination to Export to device",
        step2_s8: "Under Customize information, deselect everything — keep only <strong>Connections</strong> (followers & following)",
        step2_s9: "Choose your date range",
        step2_s10: "Set the format to <strong>JSON</strong>",
        step2_s11: "Click Start export",
        step2_wait: "Instagram will send you an email with your ZIP file when it's ready (Usually takes a few minutes).",
        step3_title: "Upload the ZIP File",
        step3_subtitle: "Upload the <strong>.zip</strong> file you downloaded from Instagram directly. You don't need to unzip it.",
        step3_file_ready: "File Ready",
        step3_upload_zip: "Upload ZIP File",
        step3_drag: "Drag your file here or click to browse",
        step3_analyze: "Analyze Data",
        step3_invalid: "Please upload a valid ZIP file.",
        step4_analyzing: "Analyzing your data...",
        step4_desc: "Unzipping and safely comparing followers.",
        step4_error_lib: "JSZip library not loaded. Please ensure you have an Internet connection to process the ZIP.",
        step4_error_files: "We couldn't find 'followers_1.json' and 'following.json' inside the ZIP. Make sure you selected to export 'Followers and following'.",
        step4_error_generic: "Error processing the file: ",
        step5_title: "Your Results",
        step5_subtitle: "Analysis completed successfully.",
        step5_download: "Download List",
        step5_tab1: "Not Following Back",
        step5_tab2: "Your Fans",
        step5_tab3: "Mutuals",
        step5_search: "Search username...",
        step5_empty: "No users found in this category.",
        step5_start_over: "Start Over",
        step5_export_header: "Instagram Users List"
    },
    es: {
        step1_title: "Encuentra tus Unfollowers",
        step1_subtitle: "Analiza tus datos de Instagram de forma privada. Todo se ejecuta localmente en tu navegador.",
        step1_how_it_works: "Cómo funciona",
        step1_desc1: "La herramienta examina tu copia de seguridad de Instagram y compara:",
        step1_list1: "Tu lista de Seguidores",
        step1_list2: "Tu lista de Seguidos",
        step1_desc2: "Para encontrar automáticamente:",
        step1_list3: "Cuentas que sigues pero que no te siguen de vuelta",
        step1_privacy1: "Sin iniciar sesión. No requiere permisos de Instagram.",
        step1_privacy2: "Tus datos nunca salen de tu dispositivo.",
        step2_title: "Cómo descargar tus datos",
        step2_subtitle: "Sigue estos pasos en la app de Instagram desde tu móvil:",
        step2_s1: "Ve a Configuración",
        step2_s2: "Abre el Centro de cuentas",
        step2_s3: "Dirígete a Tu información y permisos",
        step2_s4: "Selecciona Exportar tu información",
        step2_s5: "Pulsa Crear una exportación",
        step2_s6: "Elige la cuenta que quieres exportar",
        step2_s7: "Selecciona Exportar al dispositivo como destino",
        step2_s8: "En Personalizar información, desmarca todo — deja solo <strong>Conexiones</strong> (seguidores y seguidos)",
        step2_s9: "Elige el intervalo de fechas",
        step2_s10: "Selecciona el formato <strong>JSON</strong>",
        step2_s11: "Pulsa Iniciar exportación",
        step2_wait: "Instagram te enviará un email con tu archivo ZIP cuando esté listo (Suele tardar minutos).",
        step3_title: "Sube el Archivo ZIP",
        step3_subtitle: "Sube el archivo <strong>.zip</strong> que descargaste de Instagram directamente. No necesitas descomprimirlo.",
        step3_file_ready: "Archivo Listo",
        step3_upload_zip: "Subir Archivo ZIP",
        step3_drag: "Arrastra aquí tu archivo o haz clic para buscar",
        step3_analyze: "Analizar Datos",
        step3_invalid: "Por favor, sube un archivo ZIP válido.",
        step4_analyzing: "Analizando tus datos...",
        step4_desc: "Descomprimiendo y comparando seguidores de forma segura.",
        step4_error_lib: "Librería JSZip no cargada. Por favor, asegúrate de tener conexión a Internet para procesar el ZIP.",
        step4_error_files: "No pudimos encontrar 'followers_1.json' y 'following.json' dentro del ZIP. Asegúrate de haber seleccionado exportar 'Seguidores y seguidos'.",
        step4_error_generic: "Error al procesar el archivo: ",
        step5_title: "Tus Resultados",
        step5_subtitle: "Análisis completado con éxito.",
        step5_download: "Descargar Lista",
        step5_tab1: "No te siguen",
        step5_tab2: "Tus Fans",
        step5_tab3: "Mutuos",
        step5_search: "Buscar usuario...",
        step5_empty: "No se encontraron usuarios en esta categoría.",
        step5_start_over: "Volver a empezar",
        step5_export_header: "Lista de Usuarios de Instagram"
    }
};
let state = {
    step: 1,
    lang: 'en', // default language
    files: {
        zip: null
    },
    parsedData: {
        followers: [],
        following: []
    },
    results: {
        unfollowers: [], // Following but not followers
        fans: [],        // Followers but not following
        mutuals: []      // Both
    },
    activeTab: 'unfollowers',
    searchQuery: ''
};
const appContainer = document.getElementById('app');
window.setLanguage = function(lang) {
    state.lang = lang;
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.getElementById('btn-es').classList.toggle('active', lang === 'es');
    render(); // Re-render app with new language
};
const _t = (key) => t[state.lang][key];
function render() {
    appContainer.innerHTML = '';
    let stepContent = '';
    switch(state.step) {
        case 1: stepContent = step1(); break;
        case 2: stepContent = step2(); break;
        case 3: stepContent = step3(); break; // Upload
        case 4: stepContent = step4(); break; // Processing
        case 5: stepContent = step5(); break; // Results
    }
    const wrapper = document.createElement('div');
    wrapper.className = 'step-container';
    wrapper.innerHTML = stepContent;
    appContainer.appendChild(wrapper);
    attachEventsForStep(state.step);
}
function nextStep() {
    state.step++;
    render();
}
function prevStep() {
    if (state.step > 1) {
        state.step--;
        render();
    }
}
function attachEventsForStep(step) {
    if (step <= 2) {
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.addEventListener('click', nextStep);
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) prevBtn.addEventListener('click', prevStep);
    } else if (step === 3) {
        setupDropzone();
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.addEventListener('click', nextStep);
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) prevBtn.addEventListener('click', prevStep);
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                if (state.files.zip) {
                    nextStep(); // Go to processing
                    processFiles(); // Start processing
                }
            });
        }
    } else if (step === 5) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                const clickedBtn = e.target.closest('.tab-btn');
                clickedBtn.classList.add('active');
                state.activeTab = clickedBtn.dataset.tab;
                renderUsers(); // Just update user grid
            });
        });
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = state.searchQuery;
            searchInput.focus();
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value.toLowerCase();
                renderUsers(); // Just update user grid
            });
        }
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportData);
        }
    }
}
function step1() {
    return `
        <h1 class="title-gradient">${_t('step1_title')}</h1>
        <p class="subtitle">${_t('step1_subtitle')}</p>
        <div class="info-card">
            <h3>${_t('step1_how_it_works')}</h3>
            <p>${_t('step1_desc1')}</p>
            <ul>
                <li>${_t('step1_list1')}</li>
                <li>${_t('step1_list2')}</li>
            </ul>
            <p style="margin-top: 10px;">${_t('step1_desc2')}</p>
            <ul>
                <li>${_t('step1_list3')}</li>
            </ul>
        </div>
        <div class="important-msg">
            <i class="ph ph-shield-check" style="font-size: 1.5rem;"></i>
            <span><strong>${_t('step1_privacy1')}</strong><br>${_t('step1_privacy2')}</span>
        </div>
        <div class="nav-buttons-container right-only">
            <button id="nextBtn" class="btn btn-nav-next" title="Siguiente">
                <i class="ph ph-arrow-right"></i>
            </button>
        </div>
    `;
}
function step2() {
    return `
        <h2 class="title-gradient">${_t('step2_title')}</h2>
        <p class="subtitle" style="font-size: 0.95rem; margin-bottom: 1rem;">${_t('step2_subtitle')}</p>
        <div class="timeline">
            <div class="timeline-step">
                <div class="timeline-icon"><i class="ph ph-gear"></i></div>
                <div class="timeline-content">${_t('step2_s1')}</div>
            </div>
            <div class="timeline-step">
                <div class="timeline-icon"><i class="ph ph-user-square"></i></div>
                <div class="timeline-content">${_t('step2_s2')}</div>
            </div>
            <div class="timeline-step">
                <div class="timeline-icon"><i class="ph ph-shield-check"></i></div>
                <div class="timeline-content">${_t('step2_s3')}</div>
            </div>
            <div class="timeline-step">
                <div class="timeline-icon"><i class="ph ph-export"></i></div>
                <div class="timeline-content">${_t('step2_s4')}</div>
            </div>
            <div class="timeline-step">
                <div class="timeline-icon"><i class="ph ph-plus-circle"></i></div>
                <div class="timeline-content">${_t('step2_s5')}</div>
            </div>
            <div class="timeline-step">
                <div class="timeline-icon"><i class="ph ph-users"></i></div>
                <div class="timeline-content">${_t('step2_s6')}</div>
            </div>
            <div class="timeline-step">
                <div class="timeline-icon"><i class="ph ph-device-mobile"></i></div>
                <div class="timeline-content">${_t('step2_s7')}</div>
            </div>
            <div class="timeline-step">
                <div class="timeline-icon"><i class="ph ph-faders"></i></div>
                <div class="timeline-content">${_t('step2_s8')}</div>
            </div>
            <div class="timeline-step">
                <div class="timeline-icon"><i class="ph ph-calendar-blank"></i></div>
                <div class="timeline-content">${_t('step2_s9')}</div>
            </div>
            <div class="timeline-step">
                <div class="timeline-icon"><i class="ph ph-file-code"></i></div>
                <div class="timeline-content">${_t('step2_s10')}</div>
            </div>
            <div class="timeline-step">
                <div class="timeline-icon"><i class="ph ph-play-circle"></i></div>
                <div class="timeline-content">${_t('step2_s11')}</div>
            </div>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.85rem;">
            <i class="ph ph-envelope-simple"></i> ${_t('step2_wait')}
        </p>
        <div class="nav-buttons-container">
            <button id="prevBtn" class="btn btn-nav-prev" title="Volver">
                <i class="ph ph-arrow-left"></i>
            </button>
            <button id="nextBtn" class="btn btn-nav-next" title="Siguiente">
                <i class="ph ph-arrow-right"></i>
            </button>
        </div>
    `;
}
function step3() {
    return `
        <h2 class="title-gradient">${_t('step3_title')}</h2>
        <p class="subtitle">${_t('step3_subtitle')}</p>
        <div class="upload-grid" style="grid-template-columns: 1fr;">
            <div class="dropzone ${state.files.zip ? 'success' : ''}" id="dropzone-zip" style="min-height: 250px;">
                <i class="ph ${state.files.zip ? 'ph-check-circle' : 'ph-file-zip'}"></i>
                <h4>${state.files.zip ? _t('step3_file_ready') : _t('step3_upload_zip')}</h4>
                <p>${state.files.zip ? state.files.zip.name : _t('step3_drag')}</p>
                <input type="file" id="input-zip" class="file-input" accept=".zip">
            </div>
        </div>
        <div class="nav-buttons-container">
            <button id="prevBtn" class="btn btn-nav-prev" title="Volver">
                <i class="ph ph-arrow-left"></i>
            </button>
            <button id="analyzeBtn" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem; border-radius:16px;" ${!state.files.zip ? 'disabled' : ''}>
                ${_t('step3_analyze')} <i class="ph ph-arrow-right"></i>
            </button>
        </div>
    `;
}
function step4() {
    return `
        <div class="loader-container">
            <div class="spinner"></div>
            <h2 class="title-gradient">${_t('step4_analyzing')}</h2>
            <p class="subtitle" style="text-align:center;">${_t('step4_desc')}</p>
        </div>
    `;
}
function step5() {
    return `
        <div class="results-header">
            <div>
                <h2 class="title-gradient">${_t('step5_title')}</h2>
                <p class="subtitle" style="margin-bottom:0;">${_t('step5_subtitle')}</p>
            </div>
            <button id="exportBtn" class="btn">
                <i class="ph ph-download-simple"></i> ${_t('step5_download')}
            </button>
        </div>
        <div class="tabs">
            <button class="tab-btn ${state.activeTab === 'unfollowers' ? 'active' : ''}" data-tab="unfollowers">
                ${_t('step5_tab1')} <span class="tab-badge">${state.results.unfollowers.length}</span>
            </button>
            <button class="tab-btn ${state.activeTab === 'fans' ? 'active' : ''}" data-tab="fans">
                ${_t('step5_tab2')} <span class="tab-badge">${state.results.fans.length}</span>
            </button>
            <button class="tab-btn ${state.activeTab === 'mutuals' ? 'active' : ''}" data-tab="mutuals">
                ${_t('step5_tab3')} <span class="tab-badge">${state.results.mutuals.length}</span>
            </button>
        </div>
        <div class="search-box">
            <i class="ph ph-magnifying-glass"></i>
            <input type="text" id="searchInput" placeholder="${_t('step5_search')}">
        </div>
        <div class="user-grid" id="userGrid">
            <!-- Rendered via JS -->
        </div>
        <div style="margin-top: 1rem;">
           <button class="btn" onclick="location.reload()" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
               <i class="ph ph-arrow-counter-clockwise"></i> ${_t('step5_start_over')}
           </button>
        </div>
    `;
}
function setupDropzone() {
    const dropzone = document.getElementById('dropzone-zip');
    const input = document.getElementById('input-zip');
    if (!dropzone || !input) return;
    dropzone.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
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
            handleFile(e.dataTransfer.files[0]);
        }
    });
}
function handleFile(file) {
    if (file.name.endsWith('.zip')) {
        state.files.zip = file;
        render(); // Re-render to update UI state (marks, button enabled)
    } else {
        alert(_t('step3_invalid'));
    }
}
function processFiles() {
    if (typeof JSZip === 'undefined') {
        alert(_t('step4_error_lib'));
        state.step = 3;
        render();
        return;
    }
    setTimeout(async () => {
        try {
            const zip = await JSZip.loadAsync(state.files.zip);
            const followerFiles = zip.file(/followers_1\.json$/i);
            const followingFiles = zip.file(/following\.json$/i);
            if (followerFiles.length === 0 || followingFiles.length === 0) {
                throw new Error(_t('step4_error_files'));
            }
            const followersText = await followerFiles[0].async("text");
            const followingText = await followingFiles[0].async("text");
            const followersJSON = JSON.parse(followersText);
            const followingJSON = JSON.parse(followingText);
            extractData(followersJSON, followingJSON);
            calculateResults();
            nextStep(); // Move to step 5 (results)
        } catch (err) {
            console.error("Error Processing ZIP:", err);
            alert(_t('step4_error_generic') + err.message);
            state.step = 3; // go back
            render();
        }
    }, 500);
}
function generateUsernames(jsonObj) {
    let users = new Set();
    function recurse(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(recurse);
        } else if (typeof obj === 'object' && obj !== null) {
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
    state.results.unfollowers = state.parsedData.following.filter(u => !followersSet.has(u));
    state.results.fans = state.parsedData.followers.filter(u => !followingSet.has(u));
    state.results.mutuals = state.parsedData.following.filter(u => followersSet.has(u));
}
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
            <p>${_t('step5_empty')}</p>
        </div>`;
        return;
    }
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
const originalRender = render;
render = function() {
    originalRender();
    if (state.step === 5) {
        renderUsers();
    }
}
function exportData() {
    const activeData = state.results[state.activeTab];
    let content = _t('step5_export_header') + "\\n\\n";
    content += activeData.join("\\n");
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram_${state.activeTab}_list.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
document.addEventListener('DOMContentLoaded', () => {
    const userLang = navigator.language || navigator.userLanguage;
    const initialLang = userLang.startsWith('es') ? 'es' : 'en';
    setLanguage(initialLang);
});
