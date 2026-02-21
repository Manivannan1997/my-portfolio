document.addEventListener('DOMContentLoaded', () => {
    // --- Dynamic Content Loading ---
    async function initPortfolio() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            
            renderHero(data.personal);
            renderSummary(data.personal.summary);
            renderSkills(data.technical_expertise);
            renderExperience(data.experience);
            renderProjects(data.projects);
            renderGridSection(data.achievements, 'achievements-grid');
            renderGridSection(data.engagement, 'engagement-grid');

            // Initialize animations and toggles after content is rendered
            initAfterRender();
        } catch (error) {
            console.error('Error loading portfolio data:', error);
        }
    }

    function renderHero(personal) {
        const heroContent = document.getElementById('hero-content');
        document.getElementById('profile-pic').src = personal.profile_image;
        document.getElementById('resume-link').href = personal.resume_url;
        
        heroContent.innerHTML = `
            <h2 class="reveal">Hello, I'm</h2>
            <h1 class="reveal gradient-text">${personal.name}</h1>
            <h3 class="reveal">${personal.role}</h3>
            <p class="reveal">${personal.summary.substring(0, 160)}...</p>
            <div class="hero-btns reveal">
                <a href="mailto:${personal.email}" class="btn primary">Hire Me</a>
                <a href="#experience" class="btn secondary">View Work</a>
            </div>
        `;
    }

    function renderSummary(summary) {
        document.getElementById('summary-container').innerHTML = `<p>${summary}</p>`;
    }

    function renderSkills(expertise) {
        const skillsGrid = document.getElementById('skills-grid');
        skillsGrid.innerHTML = expertise.map(cat => `
            <div class="glass-card skill-cat tilt-card reveal">
                <h3>${cat.category}</h3>
                <ul>
                    ${cat.skills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    function renderExperience(experience) {
        const timeline = document.getElementById('experience-timeline');
        timeline.innerHTML = experience.map(exp => `
            <div class="glass-card exp-card tilt-card reveal">
                <div class="exp-header">
                    <div>
                        <h3>${exp.company}</h3>
                        <p class="role">${exp.role}</p>
                    </div>
                    <span class="date">${exp.date}</span>
                </div>
                <div class="exp-content">
                    <h4>Roles & Responsibilities</h4>
                    <ul class="exp-tasks">
                        ${exp.tasks.map(task => `<li>${task}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    }

    function renderProjects(projects) {
        const grid = document.getElementById('projects-grid');
        grid.innerHTML = projects.map(project => `
            <div class="glass-card project-card tilt-card reveal">
                <div class="project-preview">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
                <div class="contribution-details">
                    <ul>
                        ${project.contributions.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <button class="view-contribution-btn">My Contribution</button>
            </div>
        `).join('');
    }

    function renderGridSection(items, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = items.map(item => `
            <div class="glass-card tilt-card reveal">
                <h3>${item.title}</h3>
                <p class="date">${item.date}</p>
                <p>${item.detail}</p>
            </div>
        `).join('');
    }

    function initAfterRender() {
        // Re-query interactive elements
        const dynamicLinks = document.querySelectorAll('a, button, .glass-card, .btn');
        const contributionBtns = document.querySelectorAll('.view-contribution-btn');
        const revealElements = document.querySelectorAll('.reveal');

        // Apply cursor effects to new links
        dynamicLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.opacity = '0.3';
                follower.style.width = '60px';
                follower.style.height = '60px';
                follower.style.borderColor = 'var(--accent)';
            });
            link.addEventListener('mouseleave', () => {
                cursor.style.width = '8px';
                cursor.style.height = '8px';
                cursor.style.opacity = '1';
                follower.style.width = '30px';
                follower.style.height = '30px';
                follower.style.borderColor = 'var(--primary)';
            });
        });

        // Contribution Toggle
        contributionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.project-card');
                card.classList.toggle('expanded');
                btn.textContent = card.classList.contains('expanded') ? 'Hide Contribution' : 'My Contribution';
            });
        });

        // Reveal animations
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
        
        // Tilt Cards (simplified re-init)
        // Note: Tilt JS should naturally pick these up if it's a separate library, 
        // but if manual, we'd need to re-run the mousemove logic.
    }

    // Initialize the portfolio
    initPortfolio();

    // --- Global Logic (Nav, Scoped Events) ---
    // Custom cursor logic
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
        cursor.style.transform = `translate(-50%, -50%)`;
    });

    function animateCursor() {
        const ease = 0.15;
        followerX += (mouseX - followerX) * ease;
        followerY += (mouseY - followerY) * ease;
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        follower.style.transform = `translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.parallax-shape');
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        shapes.forEach(shape => {
            const speed = shape.getAttribute('data-speed') || 2;
            shape.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px)`;
        });
    });

    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.visibility = 'hidden'; }, 800);
        }, 800);
    });
});