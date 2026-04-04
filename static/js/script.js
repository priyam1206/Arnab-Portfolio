(function () {
    const FALLBACK_DATA = {
        profile: {
            name: "Arnab Ghosh",
            titles: ["Full-Stack Developer", "MERN Architect", "UI and UX Engineer"],
            about: "Engineering student focused on scalable web systems, developer experience, and interfaces that feel fast on every screen. I enjoy translating complex product needs into simple and dependable user journeys."
        },
        education: [
            {
                degree: "Bachelor of Technology in Computer Science",
                institution: "University of Technology",
                period: "2021 - 2025",
                desc: "Specialization in web systems, distributed computing, and product engineering."
            }
        ],
        skills: [
            { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "TypeScript"] },
            { category: "Backend", items: ["Node.js", "Express", "Flask", "MySQL", "PostgreSQL"] },
            { category: "Tooling", items: ["Git", "REST APIs", "Docker", "CI/CD"] }
        ],
        projects: [
            {
                title: "Aura Commerce",
                description: "Multi-vendor MERN commerce platform with role-based dashboards and optimized checkout performance.",
                tags: ["React", "Node.js", "MongoDB"]
            },
            {
                title: "Neural Vision",
                description: "Computer-vision workflow for automated image quality analysis and defect detection.",
                tags: ["Python", "TensorFlow", "Flask"]
            },
            {
                title: "Pulse Analytics",
                description: "Real-time product analytics dashboard with event streams and cohort insights.",
                tags: ["Next.js", "PostgreSQL", "WebSockets"]
            }
        ]
    };

    let portfolioData = null;
    let scrollWindows = [];

    function mergePortfolioData(apiData) {
        const safeData = apiData && typeof apiData === "object" ? apiData : {};
        const safeProfile = safeData.profile && typeof safeData.profile === "object" ? safeData.profile : {};

        return {
            profile: {
                name: safeProfile.name || FALLBACK_DATA.profile.name,
                titles: Array.isArray(safeProfile.titles) && safeProfile.titles.length ? safeProfile.titles : FALLBACK_DATA.profile.titles,
                about: safeProfile.about || FALLBACK_DATA.profile.about
            },
            education: Array.isArray(safeData.education) && safeData.education.length ? safeData.education : FALLBACK_DATA.education,
            skills: Array.isArray(safeData.skills) && safeData.skills.length ? safeData.skills : FALLBACK_DATA.skills,
            projects: Array.isArray(safeData.projects) && safeData.projects.length ? safeData.projects : FALLBACK_DATA.projects
        };
    }

    async function initData() {
        try {
            const res = await fetch("/api/portfolio");
            if (!res.ok) {
                portfolioData = FALLBACK_DATA;
                return;
            }
            portfolioData = mergePortfolioData(await res.json());
        } catch (error) {
            portfolioData = FALLBACK_DATA;
        }
    }

    function createTag(tagText) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = tagText;
        return tag;
    }

    function renderUI() {
        const bio = document.getElementById("bio");
        const heroName = document.getElementById("hero-name");
        if (bio) bio.textContent = portfolioData.profile.about;
        if (heroName) heroName.textContent = portfolioData.profile.name;

        const eduList = document.getElementById("edu-list");
        if (eduList) {
            eduList.innerHTML = "";
            portfolioData.education.forEach((entry) => {
                const item = document.createElement("article");
                item.className = "timeline-item scroll-window";
                item.innerHTML = `
                    <h3>${entry.degree}</h3>
                    <p class="edu-inst">${entry.institution}</p>
                    <p class="edu-period">${entry.period}</p>
                    <p class="edu-desc">${entry.desc}</p>
                `;
                eduList.appendChild(item);
            });
        }

        const skillGrid = document.getElementById("skill-grid");
        if (skillGrid) {
            skillGrid.innerHTML = "";
            portfolioData.skills.forEach((skill) => {
                const card = document.createElement("article");
                card.className = "glass-card skill-card scroll-window";

                const title = document.createElement("h3");
                title.textContent = skill.category;

                const tagsWrap = document.createElement("div");
                tagsWrap.className = "tag-wrap";
                skill.items.forEach((item) => tagsWrap.appendChild(createTag(item)));

                card.appendChild(title);
                card.appendChild(tagsWrap);
                skillGrid.appendChild(card);
            });
        }

        const projGrid = document.getElementById("proj-grid");
        if (projGrid) {
            projGrid.innerHTML = "";
            portfolioData.projects.forEach((proj) => {
                const card = document.createElement("article");
                card.className = "glass-card project-card scroll-window";

                const title = document.createElement("h3");
                title.textContent = proj.title;

                const desc = document.createElement("p");
                desc.className = "project-desc";
                desc.textContent = proj.description;

                const tagsWrap = document.createElement("div");
                tagsWrap.className = "tag-wrap";
                (proj.tags || []).forEach((tag) => tagsWrap.appendChild(createTag(tag)));

                card.appendChild(title);
                card.appendChild(desc);
                card.appendChild(tagsWrap);
                projGrid.appendChild(card);
            });
        }

        const stats = document.getElementById("hero-stats");
        if (stats) {
            const totalProjects = portfolioData.projects.length;
            const totalSkills = portfolioData.skills.reduce((sum, block) => sum + (Array.isArray(block.items) ? block.items.length : 0), 0);
            const firstStat = stats.children[0]?.querySelector("strong");
            const secondStat = stats.children[1]?.querySelector("strong");
            const thirdStat = stats.children[2]?.querySelector("strong");
            if (firstStat) firstStat.textContent = "03+";
            if (secondStat) secondStat.textContent = `${String(totalProjects).padStart(2, "0")}+`;
            if (thirdStat) thirdStat.textContent = String(totalSkills).padStart(2, "0");
        }
    }

    function startTyping(lines) {
        const typingEl = document.getElementById("typing-text");
        if (!typingEl || !Array.isArray(lines) || !lines.length) return;

        let lineIdx = 0;
        let charIdx = 0;
        let deleting = false;

        function step() {
            const current = lines[lineIdx];
            typingEl.textContent = current.slice(0, charIdx);

            if (!deleting && charIdx < current.length) {
                charIdx += 1;
                setTimeout(step, 70);
                return;
            }

            if (!deleting && charIdx === current.length) {
                deleting = true;
                setTimeout(step, 1500);
                return;
            }

            if (deleting && charIdx > 0) {
                charIdx -= 1;
                setTimeout(step, 36);
                return;
            }

            deleting = false;
            lineIdx = (lineIdx + 1) % lines.length;
            setTimeout(step, 220);
        }

        step();
    }

    function setupRevealAnimations() {
        const revealEls = document.querySelectorAll(".reveal");
        revealEls.forEach((el, idx) => {
            el.style.transitionDelay = `${Math.min(idx * 35, 280)}ms`;
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.14 }
        );

        revealEls.forEach((el) => observer.observe(el));
    }

    function refreshScrollWindows() {
        scrollWindows = Array.from(document.querySelectorAll(".scroll-window"));
    }

    function getWindowProgress(el) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const viewportAnchor = vh * 0.56;
        const elementCenter = rect.top + rect.height * 0.5;
        const maxDistance = (vh + rect.height) * 0.52;
        const distance = Math.abs(elementCenter - viewportAnchor);
        const raw = 1 - distance / maxDistance;
        const clamped = Math.max(0, Math.min(1, raw));
        const eased = 1 - Math.pow(1 - clamped, 3);
        return 0.35 + eased * 0.65;
    }

    function updateScrollWindows() {
        if (!scrollWindows.length) return;
        scrollWindows.forEach((el) => {
            const progress = getWindowProgress(el);
            el.style.setProperty("--window-progress", progress.toFixed(3));
            el.classList.toggle("is-near", progress > 0.8);
        });
    }

    function setupScrollWindowAnimations() {
        refreshScrollWindows();
        updateScrollWindows();

        let ticking = false;
        const requestUpdate = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                updateScrollWindows();
                ticking = false;
            });
        };

        window.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", requestUpdate);
    }

    function setupActiveNav() {
        const nav = document.getElementById("site-nav");
        const links = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
        const sections = links
            .map((link) => document.querySelector(link.getAttribute("href")))
            .filter(Boolean);

        function onScroll() {
            const y = window.scrollY + 130;
            if (nav) {
                nav.classList.toggle("nav-scrolled", window.scrollY > 18);
            }

            let activeId = "";
            sections.forEach((section) => {
                if (y >= section.offsetTop) {
                    activeId = section.id;
                }
            });

            links.forEach((link) => {
                const target = link.getAttribute("href").slice(1);
                link.classList.toggle("is-active", target === activeId);
            });
        }

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    function setupThemeToggle() {
        document.documentElement.setAttribute("data-theme", "dark");
    }

    function setupContactForm() {
        const form = document.getElementById("contact-form");
        if (!form) return;

        const btn = document.getElementById("c-btn");
        const loader = document.getElementById("form-loader");
        const status = document.getElementById("c-status");

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (!btn || !status) return;

            btn.disabled = true;
            if (loader) loader.style.display = "inline-block";
            status.textContent = "Processing...";

            const payload = {
                name: document.getElementById("c-name")?.value || "",
                email: document.getElementById("c-email")?.value || "",
                message: document.getElementById("c-msg")?.value || ""
            };

            try {
                const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const out = await res.json();
                if (out.success) {
                    status.textContent = "Message sent successfully.";
                    form.reset();
                } else {
                    status.textContent = out.error || "Unable to send right now.";
                }
            } catch (error) {
                status.textContent = "Server offline. Message not sent.";
            } finally {
                btn.disabled = false;
                if (loader) loader.style.display = "none";
            }
        });
    }

    function setupBackgroundSimulation() {
        const canvas = document.getElementById("bg-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dots = [];
        let width = 0;
        let height = 0;

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            const dotCount = Math.max(36, Math.floor((width * height) / 24000));
            dots.length = 0;
            for (let i = 0; i < dotCount; i += 1) {
                dots.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.45,
                    vy: (Math.random() - 0.5) * 0.45,
                    r: 1 + Math.random() * 1.8
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < dots.length; i += 1) {
                const d = dots[i];
                d.x += d.vx;
                d.y += d.vy;

                if (d.x < 0 || d.x > width) d.vx *= -1;
                if (d.y < 0 || d.y > height) d.vy *= -1;

                ctx.beginPath();
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < dots.length; j += 1) {
                    const n = dots[j];
                    const dx = d.x - n.x;
                    const dy = d.y - n.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        const alpha = (1 - dist / 100) * 0.26;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(220, 220, 220, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(d.x, d.y);
                        ctx.lineTo(n.x, n.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        }

        resize();
        draw();
        window.addEventListener("resize", resize);
    }

    async function init() {
        await initData();
        renderUI();
        startTyping(portfolioData.profile.titles);
        setupRevealAnimations();
        setupScrollWindowAnimations();
        setupActiveNav();
        setupThemeToggle();
        setupContactForm();
        setupBackgroundSimulation();
    }

    window.addEventListener("DOMContentLoaded", init);
})();
