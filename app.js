/* ==========================================================================
   Rohit ka job search - Core JavaScript Engine
   ========================================================================== */

// --- 1. DEPENDENT COUNTRY & CITIES DATASET ---
const COUNTRY_CITIES = {
    'Remote': ['Global Remote / Worldwide'],
    'India': [
        'All India Cities',
        'Bangalore',
        'Mumbai',
        'Delhi NCR (Gurgaon / Noida)',
        'Hyderabad',
        'Pune',
        'Chennai',
        'Kolkata',
        'Ahmedabad'
    ],
    'USA': [
        'All US Cities',
        'San Francisco / Bay Area',
        'New York',
        'Seattle',
        'Austin',
        'Boston',
        'Chicago',
        'Los Angeles'
    ],
    'UK': [
        'All UK Cities',
        'London',
        'Manchester',
        'Birmingham',
        'Edinburgh',
        'Bristol'
    ],
    'Canada': [
        'All Canada Cities',
        'Toronto',
        'Vancouver',
        'Montreal',
        'Ottawa'
    ],
    'UAE': [
        'All UAE Cities',
        'Dubai',
        'Abu Dhabi',
        'Sharjah'
    ],
    'Singapore': [
        'Singapore City'
    ],
    'Germany': [
        'All Germany Cities',
        'Berlin',
        'Munich',
        'Frankfurt',
        'Hamburg'
    ]
};

// --- 2. PORTALS DATABASE (Portals FIRST, Direct Careers SECOND, ATS THIRD) ---
const PORTALS = [
    // === CATEGORY 1: MAJOR JOB PORTALS FIRST ===
    {
        id: 'linkedin',
        name: 'LinkedIn Jobs',
        category: ['portals', 'global', 'india', 'tech'],
        color: '#0a66c2',
        icon: 'fa-brands fa-linkedin',
        tag: 'Global #1 Professional Network',
        description: 'Direct recruiter listings, Easy Apply filter & international company alerts.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let fullQuery = company ? `${company} ${q}` : q;
            let url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(fullQuery)}`;
            if (loc && loc !== 'Worldwide' && loc !== 'Global Remote / Worldwide') url += `&location=${encodeURIComponent(loc)}`;
            
            if (date === '24h') url += '&f_TPR=r86400';
            else if (date === '7d') url += '&f_TPR=r604800';
            else if (date === '14d') url += '&f_TPR=r1209600';
            
            if (mode === 'remote' || loc.includes('Remote')) url += '&f_WT=2';
            else if (mode === 'hybrid') url += '&f_WT=3';

            return url;
        }
    },
    {
        id: 'naukri',
        name: 'Naukri.com',
        category: ['portals', 'india', 'tech'],
        color: '#ff7555',
        icon: 'fa-solid fa-briefcase',
        tag: 'India #1 Job Portal',
        description: 'Largest Indian database for MNCs, IT, Startups & Corporate entries.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let fullQuery = company ? `${company} ${q}` : q;
            let qClean = fullQuery.toLowerCase().replace(/\s+/g, '-');
            let locClean = (loc && !loc.includes('Worldwide') && !loc.includes('Remote')) ? loc.toLowerCase().replace(/\s+/g, '-') : '';
            
            let url = `https://www.naukri.com/${qClean}-jobs`;
            if (locClean) url += `-in-${locClean}`;
            url += `?k=${encodeURIComponent(fullQuery)}`;

            if (date === '24h') url += '&nDays=1';
            else if (date === '7d') url += '&nDays=7';

            if (mode === 'remote' || loc.includes('Remote')) url += '&wfhType=2';

            return url;
        }
    },
    {
        id: 'indeed-global',
        name: 'Indeed Worldwide',
        category: ['portals', 'global', 'freshers'],
        color: '#003a9b',
        icon: 'fa-solid fa-earth-americas',
        tag: 'Global Aggregator',
        description: 'Search international jobs across USA, UK, Europe, Canada & Asia.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let fullQuery = company ? `${company} ${q}` : q;
            let domain = 'www.indeed.com';
            if (loc.includes('UK')) domain = 'uk.indeed.com';
            else if (loc.includes('Canada')) domain = 'ca.indeed.com';
            else if (loc.includes('UAE') || loc.includes('Dubai')) domain = 'ae.indeed.com';
            else if (loc.includes('Singapore')) domain = 'sg.indeed.com';
            else if (loc.includes('India') || loc.includes('Bangalore') || loc.includes('Mumbai') || loc.includes('Delhi')) domain = 'in.indeed.com';

            let url = `https://${domain}/jobs?q=${encodeURIComponent(fullQuery)}`;
            if (loc && !loc.includes('Worldwide') && !loc.includes('Remote')) url += `&l=${encodeURIComponent(loc)}`;
            if (date === '24h') url += '&fromage=1';
            return url;
        }
    },
    {
        id: 'google-jobs',
        name: 'Google Jobs Engine',
        category: ['portals', 'india', 'global', 'freshers'],
        color: '#4285f4',
        icon: 'fa-brands fa-google',
        tag: 'AI Indexer',
        description: 'Google AI aggregator indexing jobs across corporate ATS and direct sites.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let queryStr = company ? `${company} ${q} jobs` : `${q} jobs`;
            if (loc && !loc.includes('Worldwide')) queryStr += ` in ${loc}`;
            if (mode === 'remote' || loc.includes('Remote')) queryStr += ` remote`;
            return `https://www.google.com/search?q=${encodeURIComponent(queryStr)}&ibp=htl;jobs`;
        }
    },
    {
        id: 'wellfound',
        name: 'Wellfound (AngelList)',
        category: ['portals', 'global', 'tech'],
        color: '#ff4f00',
        icon: 'fa-solid fa-rocket',
        tag: '#1 Startup Hiring Platform',
        description: 'High-growth YC & VC funded startups hiring remote developers & product leaders.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let fullQuery = company ? `${company} ${q}` : q;
            let url = `https://wellfound.com/jobs?q=${encodeURIComponent(fullQuery)}`;
            if (mode === 'remote' || loc.includes('Remote')) url += '&remote=true';
            return url;
        }
    },
    {
        id: 'glassdoor',
        name: 'Glassdoor',
        category: ['portals', 'global', 'india'],
        color: '#00a264',
        icon: 'fa-solid fa-building-user',
        tag: 'Reviews + Hiring',
        description: 'Job search coupled with real employee salary data & interview questions.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let fullQuery = company ? `${company} ${q}` : q;
            return `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(fullQuery)}`;
        }
    },
    {
        id: 'remoteok',
        name: 'RemoteOK (Global Remote)',
        category: ['portals', 'global', 'tech'],
        color: '#ff4757',
        icon: 'fa-solid fa-globe',
        tag: '100% Remote Global',
        description: 'High paying international remote tech jobs ($80k - $250k+ USD).',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let cleanTag = (company ? `${company}-${q}` : q).toLowerCase().replace(/[^a-z0-9]/g, '-');
            return `https://remoteok.com/remote-${cleanTag}-jobs`;
        }
    },
    {
        id: 'weworkremotely',
        name: 'We Work Remotely',
        category: ['portals', 'global', 'tech'],
        color: '#2d3436',
        icon: 'fa-solid fa-laptop-code',
        tag: 'Global Remote Jobs',
        description: 'Premier remote work community for developers, designers & product leaders.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let fullQuery = company ? `${company} ${q}` : q;
            return `https://weworkremotely.com/remote-jobs/search?term=${encodeURIComponent(fullQuery)}`;
        }
    },
    {
        id: 'cutshort',
        name: 'Cutshort',
        category: ['portals', 'india', 'tech'],
        color: '#00b894',
        icon: 'fa-solid fa-bolt-lightning',
        tag: 'AI Tech Matching',
        description: 'Direct connection with Indian tech founders, CTOs & HRs.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let fullQuery = company ? `${company} ${q}` : q;
            return `https://cutshort.io/jobs?search=${encodeURIComponent(fullQuery)}`;
        }
    },
    {
        id: 'foundit',
        name: 'Foundit (Monster)',
        category: ['portals', 'india'],
        color: '#6c5ce7',
        icon: 'fa-solid fa-magnifying-glass-dollar',
        tag: 'Enterprise & IT Roles',
        description: 'Major platform for tech, finance, consulting and lateral corporate entries.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let fullQuery = company ? `${company} ${q}` : q;
            return `https://www.foundit.in/srp/results?query=${encodeURIComponent(fullQuery)}`;
        }
    },
    {
        id: 'internshala',
        name: 'Internshala',
        category: ['portals', 'freshers', 'india'],
        color: '#0084ff',
        icon: 'fa-solid fa-graduation-cap',
        tag: '#1 Freshers & Internships',
        description: 'Top portal for fresh graduates, entry-level jobs and paid internships.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let qClean = q.toLowerCase().replace(/\s+/g, '-');
            return `https://internshala.com/jobs/${qClean}-jobs`;
        }
    },

    // === CATEGORY 2: DIRECT COMPANY CAREERS SECOND ===
    {
        id: 'google-careers',
        name: 'Google Careers',
        category: ['careers', 'tech', 'global', 'india'],
        color: '#4285f4',
        icon: 'fa-brands fa-google',
        tag: 'Direct Official Portal',
        description: 'Official Google jobs site for engineering, product & AI positions worldwide.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let url = `https://www.google.com/about/careers/applications/jobs/results/?q=${encodeURIComponent(q)}`;
            if (loc && !loc.includes('Worldwide')) url += `&location=${encodeURIComponent(loc)}`;
            return url;
        }
    },
    {
        id: 'microsoft-careers',
        name: 'Microsoft Careers',
        category: ['careers', 'tech', 'global', 'india'],
        color: '#00a4ef',
        icon: 'fa-brands fa-microsoft',
        tag: 'Direct Official Portal',
        description: 'Search software, cloud, and AI engineering positions directly on Microsoft Careers.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let url = `https://jobs.careers.microsoft.com/global/en/search?q=${encodeURIComponent(q)}`;
            if (loc && !loc.includes('Worldwide')) url += `&lc=${encodeURIComponent(loc)}`;
            return url;
        }
    },
    {
        id: 'amazon-jobs',
        name: 'Amazon Jobs',
        category: ['careers', 'tech', 'global', 'india'],
        color: '#ff9900',
        icon: 'fa-brands fa-amazon',
        tag: 'Direct Official Portal',
        description: 'Search AWS, Retail, Prime Video and SDE openings directly on Amazon Jobs.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let url = `https://www.amazon.jobs/en/search?base_query=${encodeURIComponent(q)}`;
            if (loc && !loc.includes('Worldwide')) url += `&loc_query=${encodeURIComponent(loc)}`;
            return url;
        }
    },
    {
        id: 'meta-careers',
        name: 'Meta Careers',
        category: ['careers', 'tech', 'global'],
        color: '#0668e1',
        icon: 'fa-brands fa-meta',
        tag: 'Direct Official Portal',
        description: 'Direct hiring for Meta (Facebook, Instagram, WhatsApp, Quest VR).',
        buildUrl: (q, company, loc, exp, date, mode) => {
            return `https://www.metacareers.com/jobs?q=${encodeURIComponent(q)}`;
        }
    },
    {
        id: 'apple-careers',
        name: 'Apple Careers',
        category: ['careers', 'tech', 'global'],
        color: '#a3aaae',
        icon: 'fa-brands fa-apple',
        tag: 'Direct Official Portal',
        description: 'Official Apple job search for hardware, software & iOS engineers.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            return `https://jobs.apple.com/en-us/search?search=${encodeURIComponent(q)}`;
        }
    },
    {
        id: 'swiggy-careers',
        name: 'Swiggy Careers',
        category: ['careers', 'india', 'tech'],
        color: '#fc8019',
        icon: 'fa-solid fa-motorcycle',
        tag: 'Direct Indian Unicorn',
        description: 'Direct tech, product & data science jobs on Swiggy career site.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            return `https://careers.swiggy.com/#/jobs?search=${encodeURIComponent(q)}`;
        }
    },
    {
        id: 'zomato-careers',
        name: 'Zomato Careers',
        category: ['careers', 'india', 'tech'],
        color: '#cb202d',
        icon: 'fa-solid fa-utensils',
        tag: 'Direct Indian Unicorn',
        description: 'Direct openings for engineers, product managers & growth leaders.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            return `https://www.zomato.com/careers`;
        }
    },
    {
        id: 'tcs-careers',
        name: 'TCS Careers (iBegin)',
        category: ['careers', 'india'],
        color: '#00539c',
        icon: 'fa-solid fa-building-columns',
        tag: 'Direct Corporate Portal',
        description: 'Lateral and freshers direct entries on Tata Consultancy Services portal.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            return `https://ibegin.tcs.com/iBegin/`;
        }
    },

    // === CATEGORY 3: ENTERPRISE ATS DIRECT SEARCH ENGINES ===
    {
        id: 'greenhouse-ats',
        name: 'Greenhouse ATS Jobs',
        category: ['ats-engines', 'tech', 'global'],
        color: '#28a745',
        icon: 'fa-solid fa-leaf',
        tag: 'Direct ATS Indexer',
        description: 'Scans thousands of high-growth tech companies hosting jobs on Greenhouse.io.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let compFilter = company ? `"${company}"` : '';
            let locFilter = (loc && !loc.includes('Worldwide')) ? `"${loc}"` : '';
            let searchStr = `site:boards.greenhouse.io ${compFilter} "${q}" ${locFilter}`;
            return `https://www.google.com/search?q=${encodeURIComponent(searchStr.trim())}`;
        }
    },
    {
        id: 'lever-ats',
        name: 'Lever.co ATS Jobs',
        category: ['ats-engines', 'tech', 'global'],
        color: '#17a2b8',
        icon: 'fa-solid fa-layer-group',
        tag: 'Direct ATS Indexer',
        description: 'Scans YC startups & tech scaleups using Lever application portal.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let compFilter = company ? `"${company}"` : '';
            let locFilter = (loc && !loc.includes('Worldwide')) ? `"${loc}"` : '';
            let searchStr = `site:jobs.lever.co ${compFilter} "${q}" ${locFilter}`;
            return `https://www.google.com/search?q=${encodeURIComponent(searchStr.trim())}`;
        }
    },
    {
        id: 'workday-ats',
        name: 'Workday ATS Jobs',
        category: ['ats-engines', 'global', 'india'],
        color: '#ffc107',
        icon: 'fa-solid fa-briefcase',
        tag: 'Enterprise ATS Indexer',
        description: 'Scans Fortune 500 & MNC corporate portals built on Workday Jobs.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let compFilter = company ? `"${company}"` : '';
            let searchStr = `site:myworkdayjobs.com ${compFilter} "${q}"`;
            return `https://www.google.com/search?q=${encodeURIComponent(searchStr.trim())}`;
        }
    },
    {
        id: 'ashby-ats',
        name: 'Ashby ATS Jobs',
        category: ['ats-engines', 'tech', 'global'],
        color: '#6f42c1',
        icon: 'fa-solid fa-bolt',
        tag: 'Modern Startup ATS',
        description: 'Direct ATS search across AI startups and tech scaleups hosted on AshbyHQ.',
        buildUrl: (q, company, loc, exp, date, mode) => {
            let compFilter = company ? `"${company}"` : '';
            let searchStr = `site:jobs.ashbyhq.com ${compFilter} "${q}"`;
            return `https://www.google.com/search?q=${encodeURIComponent(searchStr.trim())}`;
        }
    }
];

// App State
let currentView = 'table';
let selectedCategory = 'all';
let selectedPortalsSet = new Set(PORTALS.map(p => p.id));
let savedPresets = JSON.parse(localStorage.getItem('rohit_presets') || '[]');
let jobTrackerData = JSON.parse(localStorage.getItem('rohit_tracker') || '[]');
let uploadedResumeText = localStorage.getItem('rohit_resume_text') || '';

// --- 3. INITIALIZATION & DEPENDENT DROPDOWNS ---
document.addEventListener('DOMContentLoaded', () => {
    onCountryChange();
    updateCategoryCounts();
    if (uploadedResumeText) {
        document.getElementById('ats-resume-text-inline').value = uploadedResumeText.substring(0, 80) + '...';
    }
    renderMatrixDisplay();
    renderSavedPresets();
    updateBooleanQueries();
    renderTrackerBoard();
    initPdfJsWorker();
});

function onCountryChange() {
    const countrySelect = document.getElementById('job-country');
    const citySelect = document.getElementById('job-city');
    const selectedCountry = countrySelect.value;

    citySelect.innerHTML = '';
    const cities = COUNTRY_CITIES[selectedCountry] || ['All Cities'];

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

function initPdfJsWorker() {
    if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));

    document.getElementById(`nav-${tabName}`).classList.add('active');
    document.getElementById(`section-${tabName}`).classList.add('active');
}

function switchView(viewMode) {
    currentView = viewMode;
    document.getElementById('view-table-btn').classList.toggle('active', viewMode === 'table');
    document.getElementById('view-grid-btn').classList.toggle('active', viewMode === 'grid');
    renderMatrixDisplay();
}

function clearInput(id) {
    document.getElementById(id).value = '';
    updateLinks();
}

function applyCompanyPreset(companyName) {
    document.getElementById('job-company').value = companyName;
    updateLinks();
}

function getSearchParams() {
    const country = document.getElementById('job-country').value;
    const city = document.getElementById('job-city').value;
    
    let combinedLocation = '';
    if (country === 'Remote' || city.includes('Global Remote')) {
        combinedLocation = 'Remote';
    } else if (city.startsWith('All ')) {
        combinedLocation = country;
    } else {
        combinedLocation = `${city}, ${country}`;
    }

    return {
        query: document.getElementById('job-keywords').value.trim() || 'Web Developer',
        company: document.getElementById('job-company').value.trim(),
        country: country,
        city: city,
        location: combinedLocation,
        experience: document.getElementById('job-experience').value,
        date: document.getElementById('job-date').value,
        workType: document.getElementById('job-work-type').value
    };
}

function updateLinks() {
    renderMatrixDisplay();
    updateBooleanQueries();
}

function renderMatrixDisplay() {
    if (currentView === 'table') {
        document.getElementById('matrix-table-container').classList.remove('hidden');
        document.getElementById('portal-grid').classList.add('hidden');
        renderMatrixTable();
    } else {
        document.getElementById('matrix-table-container').classList.add('hidden');
        document.getElementById('portal-grid').classList.remove('hidden');
        renderPortalCards();
    }
}

function calculateInTableAtsScore(portalId, targetRole) {
    if (!uploadedResumeText) {
        return null;
    }

    const lowerCV = uploadedResumeText.toLowerCase();

    const commonSkillsMap = [
        'javascript', 'typescript', 'react', 'react native', 'node.js', 'express', 'python', 'django', 'java', 'spring boot',
        'c++', 'sql', 'postgresql', 'mongodb', 'mysql', 'aws', 'docker', 'kubernetes', 'git', 'github', 'ci/cd',
        'html5', 'css3', 'tailwind', 'rest api', 'graphql', 'redux', 'next.js', 'agile', 'scrum', 'web developer'
    ];

    const roleTokens = targetRole.toLowerCase().split(/[\s,/]+/);
    let targetSkills = commonSkillsMap.filter(s => roleTokens.some(t => s.includes(t) || t.includes(s)));
    if (targetSkills.length < 5) {
        targetSkills = targetSkills.concat(['javascript', 'react', 'node.js', 'git', 'rest api', 'sql', 'aws']);
    }

    let matchedSkills = targetSkills.filter(s => lowerCV.includes(s));
    let baseFitment = Math.round((matchedSkills.length / Math.max(targetSkills.length, 1)) * 100);

    let actionVerbs = ['built', 'developed', 'architected', 'scaled', 'managed', 'created', 'designed', 'increased', 'optimized', 'led'];
    let foundVerbs = actionVerbs.filter(v => lowerCV.includes(v));
    let hasMetrics = /\d+%|\$\d+|\d+\s*users/i.test(uploadedResumeText);

    let atsPass = 40 + (foundVerbs.length * 6) + (hasMetrics ? 20 : 5) + Math.round(baseFitment * 0.25);
    let atsScore = Math.min(Math.max(atsPass, 30), 99);

    return atsScore;
}

function renderMatrixTable() {
    const tbody = document.getElementById('matrix-table-body');
    tbody.innerHTML = '';
    const params = getSearchParams();

    const filteredPortals = PORTALS.filter(p => {
        if (selectedCategory === 'all') return true;
        return p.category.includes(selectedCategory);
    });

    filteredPortals.forEach(portal => {
        const url = portal.buildUrl(params.query, params.company, params.location, params.experience, params.date, params.workType);
        const isChecked = selectedPortalsSet.has(portal.id);
        const atsScore = calculateInTableAtsScore(portal.id, params.query);

        let atsCellContent = '';
        if (atsScore !== null) {
            atsCellContent = `<span class="ats-pill"><i class="fa-solid fa-shield-halved"></i> ${atsScore}% Pass</span>`;
        } else {
            atsCellContent = `<span class="score-pending" onclick="document.getElementById('resume-file-input').click()"><i class="fa-solid fa-cloud-arrow-up"></i> Upload CV for %</span>`;
        }

        let expText = params.experience;
        if (expText === 'lead') expText = '10-15 Yrs';
        else if (expText === 'executive') expText = '15-20 Yrs';
        else if (expText === 'cxo') expText = '20+ Yrs / CXO';
        else if (expText === 'senior') expText = '5-10 Yrs';
        else if (expText === 'mid') expText = '2-5 Yrs';
        else if (expText === 'fresher') expText = '0-2 Yrs';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" class="portal-checkbox" id="chk-${portal.id}" ${isChecked ? 'checked' : ''} onchange="togglePortalSelection('${portal.id}', this.checked)">
            </td>
            <td>
                <div class="table-platform-cell" style="--cell-color: ${portal.color}">
                    <div class="table-platform-icon"><i class="${portal.icon}"></i></div>
                    <span>${portal.name}</span>
                </div>
            </td>
            <td>
                <span class="company-badge">${params.company || 'All Brands'}</span>
            </td>
            <td>
                <strong style="color:var(--text-primary); font-size:0.92rem;">${params.query}</strong>
            </td>
            <td>${atsCellContent}</td>
            <td>
                <span class="mode-badge">${params.location} (${params.workType})</span>
            </td>
            <td>
                <span class="date-badge">${expText} | ${params.date === '24h' ? '⚡ 24h' : params.date}</span>
            </td>
            <td>
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Apply
                </a>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderPortalCards() {
    const grid = document.getElementById('portal-grid');
    grid.innerHTML = '';
    const params = getSearchParams();

    const filteredPortals = PORTALS.filter(p => {
        if (selectedCategory === 'all') return true;
        return p.category.includes(selectedCategory);
    });

    filteredPortals.forEach(portal => {
        const generatedUrl = portal.buildUrl(params.query, params.company, params.location, params.experience, params.date, params.workType);
        const isChecked = selectedPortalsSet.has(portal.id);
        const atsScore = calculateInTableAtsScore(portal.id, params.query);

        const card = document.createElement('div');
        card.className = 'portal-card';
        card.style.setProperty('--card-color', portal.color);

        card.innerHTML = `
            <div>
                <div class="portal-card-top">
                    <div class="portal-info">
                        <div class="portal-icon">
                            <i class="${portal.icon}"></i>
                        </div>
                        <div class="portal-name">
                            <h3>${portal.name}</h3>
                            <span class="portal-tag">${portal.tag}</span>
                        </div>
                    </div>
                    <input type="checkbox" class="portal-checkbox" id="chk-${portal.id}" ${isChecked ? 'checked' : ''} onchange="togglePortalSelection('${portal.id}', this.checked)">
                </div>
                <p class="portal-desc">${portal.description}</p>
                ${atsScore ? `
                    <div style="display:flex; gap:8px; margin-bottom:12px;">
                        <span class="ats-pill"><i class="fa-solid fa-shield-halved"></i> ${atsScore}% ATS Pass</span>
                    </div>
                ` : ''}
            </div>
            <div class="portal-actions">
                <a href="${generatedUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Search
                </a>
                <button class="btn btn-outline btn-sm" onclick="copyToClipboard('${generatedUrl}', '${portal.name} URL')">
                    <i class="fa-regular fa-copy"></i> Copy Link
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterPortals(category) {
    selectedCategory = category;
    document.querySelectorAll('.cat-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    renderMatrixDisplay();
}

function updateCategoryCounts() {
    document.getElementById('count-all').innerText = PORTALS.length;
    document.getElementById('count-portals').innerText = PORTALS.filter(p => p.category.includes('portals')).length;
    document.getElementById('count-careers').innerText = PORTALS.filter(p => p.category.includes('careers')).length;
    document.getElementById('count-ats-engines').innerText = PORTALS.filter(p => p.category.includes('ats-engines')).length;
    document.getElementById('count-india').innerText = PORTALS.filter(p => p.category.includes('india')).length;
    document.getElementById('count-global').innerText = PORTALS.filter(p => p.category.includes('global')).length;
}

function togglePortalSelection(portalId, isChecked) {
    if (isChecked) selectedPortalsSet.add(portalId);
    else selectedPortalsSet.delete(portalId);
}

function toggleAllPortals(selectAll) {
    if (selectAll) {
        PORTALS.forEach(p => selectedPortalsSet.add(p.id));
    } else {
        selectedPortalsSet.clear();
    }
    renderMatrixDisplay();
}

function openAllSelectedPortals() {
    const params = getSearchParams();
    const portalsToOpen = PORTALS.filter(p => selectedPortalsSet.has(p.id));

    if (portalsToOpen.length === 0) {
        showToast('Please select at least one portal checkbox to open.', 'info');
        return;
    }

    document.getElementById('popup-warning-banner').classList.remove('hidden');

    let openedCount = 0;
    portalsToOpen.forEach((portal, index) => {
        const url = portal.buildUrl(params.query, params.company, params.location, params.experience, params.date, params.workType);
        setTimeout(() => {
            window.open(url, '_blank');
        }, index * 250);
        openedCount++;
    });

    showToast(`Launching ${openedCount} portals in new tabs...`, 'success');
}

function applyPreset(query, loc, exp, date, mode) {
    document.getElementById('job-keywords').value = query;
    document.getElementById('job-experience').value = exp;
    document.getElementById('job-date').value = date;
    document.getElementById('job-work-type').value = mode;
    updateLinks();
    showToast(`Applied preset: ${query}`, 'success');
}

function saveCurrentSearchPreset() {
    const params = getSearchParams();
    const name = `${params.company ? params.company + ' - ' : ''}${params.query} (${params.location})`;
    
    savedPresets.push({ id: Date.now(), name, params });
    localStorage.setItem('rohit_presets', JSON.stringify(savedPresets));
    renderSavedPresets();
    showToast('Search preset saved!', 'success');
}

function renderSavedPresets() {
    const card = document.getElementById('saved-presets-card');
    const container = document.getElementById('saved-presets-list');
    container.innerHTML = '';

    if (savedPresets.length === 0) {
        card.classList.add('hidden');
        return;
    }

    card.classList.remove('hidden');
    savedPresets.forEach(preset => {
        const chip = document.createElement('button');
        chip.className = 'chip';
        chip.innerHTML = `⭐ ${preset.name} <span onclick="deletePreset(${preset.id}, event)" style="margin-left:6px; font-weight:bold;">&times;</span>`;
        chip.onclick = () => {
            applyPreset(preset.params.query, preset.params.location, preset.params.experience, preset.params.date, preset.params.workType);
        };
        container.appendChild(chip);
    });
}

function deletePreset(id, event) {
    event.stopPropagation();
    savedPresets = savedPresets.filter(p => p.id !== id);
    localStorage.setItem('rohit_presets', JSON.stringify(savedPresets));
    renderSavedPresets();
}

function clearAllSavedPresets() {
    savedPresets = [];
    localStorage.removeItem('rohit_presets');
    renderSavedPresets();
}

function handleResumeUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const badge = document.getElementById('file-name-display');
    badge.innerText = `📄 ${file.name}`;
    badge.classList.remove('hidden');

    if (file.type === 'application/pdf' && window.pdfjsLib) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const typedarray = new Uint8Array(e.target.result);
            window.pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                let fullText = '';
                let countPromises = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    countPromises.push(
                        pdf.getPage(i).then(page => page.getTextContent().then(textContent => {
                            textContent.items.forEach(item => fullText += item.str + ' ');
                        }))
                    );
                }
                Promise.all(countPromises).then(() => {
                    uploadedResumeText = fullText;
                    localStorage.setItem('rohit_resume_text', fullText);
                    document.getElementById('ats-resume-text-inline').value = `PDF: ${file.name} (${fullText.length} chars)`;
                    showToast('PDF Resume analyzed! ATS scores updated.', 'success');
                    renderMatrixDisplay();
                });
            }).catch(err => {
                showToast('Error reading PDF. Try pasting CV text.', 'info');
            });
        };
        reader.readAsArrayBuffer(file);
    } else {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedResumeText = e.target.result;
            localStorage.setItem('rohit_resume_text', uploadedResumeText);
            document.getElementById('ats-resume-text-inline').value = e.target.result.substring(0, 60) + '...';
            showToast('Resume uploaded! ATS scores updated.', 'success');
            renderMatrixDisplay();
        };
        reader.readAsText(file);
    }
}

function handleInlineResumeTextChange() {
    const text = document.getElementById('ats-resume-text-inline').value.trim();
    if (text && !text.startsWith('PDF:')) {
        uploadedResumeText = text;
        localStorage.setItem('rohit_resume_text', text);
        renderMatrixDisplay();
    }
}

function updateBooleanQueries() {
    const params = getSearchParams();
    const q = params.query;
    const company = params.company ? `"${params.company}"` : '';
    const loc = params.location ? `"${params.location}"` : '';

    const careersStr = `site:careers.*.com OR site:*.com/careers ${company} "${q}" ${loc}`.trim();
    const atsStr = `site:boards.greenhouse.io OR site:jobs.lever.co ${company} "${q}" ${loc}`.trim();
    const linkedinStr = `site:linkedin.com/posts "hiring" OR "looking for" ${company} "${q}" ${loc}`.trim();
    const githubStr = `site:github.com "location: ${params.location || 'Remote'}" "${q}"`.trim();

    document.getElementById('query-careers-xray').innerText = careersStr;
    document.getElementById('query-ats-xray').innerText = atsStr;
    document.getElementById('query-linkedin-xray').innerText = linkedinStr;
    document.getElementById('query-github-xray').innerText = githubStr;
}

function copyBooleanQuery(elementId) {
    const text = document.getElementById(elementId).innerText;
    copyToClipboard(text, 'Boolean Search String');
}

function launchGoogleSearch(elementId) {
    const text = document.getElementById(elementId).innerText;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`, '_blank');
}

function renderTrackerBoard() {
    const columns = {
        applied: document.getElementById('cards-applied'),
        review: document.getElementById('cards-review'),
        interviewing: document.getElementById('cards-interviewing'),
        offer: document.getElementById('cards-offer'),
        rejected: document.getElementById('cards-rejected')
    };

    Object.values(columns).forEach(col => col.innerHTML = '');

    const counts = { applied: 0, review: 0, interviewing: 0, offer: 0, rejected: 0 };

    jobTrackerData.forEach(job => {
        counts[job.status] = (counts[job.status] || 0) + 1;
        
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="job-card-title">${job.role}</div>
            <div class="job-card-company">${job.company}</div>
            <div class="job-card-meta">
                <span><i class="fa-solid fa-globe"></i> ${job.portal}</span>
                <span><i class="fa-regular fa-calendar"></i> ${job.date || 'N/A'}</span>
            </div>
            ${job.salary ? `<div style="font-size:0.78rem; color:#34c759; font-weight:600; margin-bottom:6px;">💰 ${job.salary}</div>` : ''}
            <div class="job-card-footer">
                ${job.url ? `<a href="${job.url}" target="_blank" style="color:var(--accent-apple-blue); font-size:0.8rem;"><i class="fa-solid fa-link"></i> Link</a>` : '<span></span>'}
                <div>
                    <button class="text-btn" onclick="editJobModal(${job.id})"><i class="fa-solid fa-pen"></i></button>
                    <button class="text-btn" style="color:var(--accent-apple-red);" onclick="deleteJobApplication(${job.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
        if (columns[job.status]) {
            columns[job.status].appendChild(card);
        }
    });

    document.getElementById('badge-applied').innerText = counts.applied;
    document.getElementById('badge-review').innerText = counts.review;
    document.getElementById('badge-interviewing').innerText = counts.interviewing;
    document.getElementById('badge-offer').innerText = counts.offer;
    document.getElementById('badge-rejected').innerText = counts.rejected;

    document.getElementById('stat-total').innerText = jobTrackerData.length;
    document.getElementById('stat-interviewing').innerText = counts.interviewing;
    document.getElementById('stat-offer').innerText = counts.offer;
    document.getElementById('stat-rejected').innerText = counts.rejected;

    document.getElementById('tracker-count').innerText = jobTrackerData.length;
}

function openAddJobModal() {
    document.getElementById('modal-title').innerHTML = '<i class="fa-solid fa-plus"></i> Add New Job Application';
    document.getElementById('edit-job-id').value = '';
    document.getElementById('job-modal-form').reset();
    document.getElementById('modal-date').valueAsDate = new Date();
    document.getElementById('job-modal').classList.remove('hidden');
}

function editJobModal(id) {
    const job = jobTrackerData.find(j => j.id === id);
    if (!job) return;

    document.getElementById('modal-title').innerHTML = '<i class="fa-solid fa-pen"></i> Edit Job Application';
    document.getElementById('edit-job-id').value = job.id;
    document.getElementById('modal-company').value = job.company;
    document.getElementById('modal-role').value = job.role;
    document.getElementById('modal-portal').value = job.portal;
    document.getElementById('modal-status').value = job.status;
    document.getElementById('modal-date').value = job.date;
    document.getElementById('modal-salary').value = job.salary || '';
    document.getElementById('modal-url').value = job.url || '';
    document.getElementById('modal-notes').value = job.notes || '';

    document.getElementById('job-modal').classList.remove('hidden');
}

function closeJobModal() {
    document.getElementById('job-modal').classList.add('hidden');
}

function saveJobApplication(e) {
    e.preventDefault();

    const editId = document.getElementById('edit-job-id').value;
    const jobObj = {
        id: editId ? Number(editId) : Date.now(),
        company: document.getElementById('modal-company').value.trim(),
        role: document.getElementById('modal-role').value.trim(),
        portal: document.getElementById('modal-portal').value,
        status: document.getElementById('modal-status').value,
        date: document.getElementById('modal-date').value,
        salary: document.getElementById('modal-salary').value.trim(),
        url: document.getElementById('modal-url').value.trim(),
        notes: document.getElementById('modal-notes').value.trim()
    };

    if (editId) {
        jobTrackerData = jobTrackerData.map(j => j.id === Number(editId) ? jobObj : j);
        showToast('Application updated!', 'success');
    } else {
        jobTrackerData.push(jobObj);
        showToast('New application logged!', 'success');
    }

    localStorage.setItem('rohit_tracker', JSON.stringify(jobTrackerData));
    closeJobModal();
    renderTrackerBoard();
}

function deleteJobApplication(id) {
    if (confirm('Are you sure you want to delete this job record?')) {
        jobTrackerData = jobTrackerData.filter(j => j.id !== id);
        localStorage.setItem('rohit_tracker', JSON.stringify(jobTrackerData));
        renderTrackerBoard();
        showToast('Application deleted.', 'info');
    }
}

function exportJobTrackerData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jobTrackerData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rohit_job_tracker_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Job Tracker JSON exported!', 'success');
}

function triggerImportJSON() {
    document.getElementById('import-file-input').click();
}

function importJobTrackerData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) {
                jobTrackerData = importedData;
                localStorage.setItem('rohit_tracker', JSON.stringify(jobTrackerData));
                renderTrackerBoard();
                showToast(`Successfully imported ${importedData.length} records!`, 'success');
            } else {
                alert('Invalid JSON format.');
            }
        } catch (err) {
            alert('Error parsing JSON file.');
        }
    };
    reader.readAsText(file);
}

function copyToClipboard(text, label = 'Content') {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`${label} copied to clipboard!`, 'success');
    }).catch(err => {
        showToast('Failed to copy', 'info');
    });
}

function dismissBanner(id) {
    document.getElementById(id).classList.add('hidden');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3200);
}
