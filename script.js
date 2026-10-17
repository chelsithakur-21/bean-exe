
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

/* ---------------- IMAGE CHECK ---------------- */

const beanImage = $("#beanImage");
const imageFallback = $("#imageFallback");

beanImage.addEventListener("error", () => {
    beanImage.hidden = true;
    imageFallback.hidden = false;
});

beanImage.addEventListener("load", () => {
    beanImage.hidden = false;
    imageFallback.hidden = true;
});

/* ---------------- CLOCK & FOOTER ---------------- */

function updateClock() {
    $("#clock").textContent = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).format(new Date()) + " IST";
}

updateClock();
setInterval(updateClock, 30000);
$("#footerYear").textContent = new Date().getFullYear();

/* ---------------- SIDEBAR ---------------- */

const sidebar = $("#sidebar");
const menuToggle = $("#menuToggle");

menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

$$(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        $$(".nav-link").forEach(item => item.classList.remove("active"));
        link.classList.add("active");

        $("#currentPage").textContent =
            link.getAttribute("href").slice(1).replaceAll("-", " ").toUpperCase();

        sidebar.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

/* Update active navigation while scrolling */

const sections = $$(".page-section");
const observer = new IntersectionObserver(entries => {
    const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const activeLink = $(`.nav-link[href="#${visible.target.id}"]`);
    if (!activeLink) return;

    $$(".nav-link").forEach(link => link.classList.remove("active"));
    activeLink.classList.add("active");
    $("#currentPage").textContent =
        visible.target.id.replaceAll("-", " ").toUpperCase();
}, { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.2, 0.5] });

sections.forEach(section => observer.observe(section));

/* ---------------- PROJECT FILTERS ---------------- */

$$(".filter-button").forEach(button => {
    button.addEventListener("click", () => {
        $$(".filter-button").forEach(item => item.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;

        $$(".project-card").forEach(card => {
            card.hidden = filter !== "all" && card.dataset.category !== filter;
        });
    });
});

/* ---------------- PROJECT CASE STUDIES ---------------- */

const projectDetails = {
    lumora: {
        eyebrow: "PROJECT / PERSONAL FINANCE",
        title: "Lumora",
        description: "A personal finance dashboard concept designed to organize transactions, savings goals and financial insights.",
        features: [
            "Transaction tracking and categorization",
            "Savings goals and progress visualization",
            "Financial summaries and charts",
            "React frontend with a Node.js and Express backend, using MongoDB"
        ]
    },
    devtrack: {
        eyebrow: "PROJECT / DEVELOPER LEARNING",
        title: "DevTrack AI",
        description: "An AI-assisted developer-learning platform concept focused on personalized roadmaps, skill assessments and progress tracking.",
        features: [
            "Role-based learning journey concept",
            "Skill assessment and feedback",
            "Learning roadmap and progress dashboard",
            "Potential AI assistant integration"
        ]
    }
};

const dialog = $("#projectDialog");

$$(".details-button").forEach(button => {
    button.addEventListener("click", () => {
        const project = projectDetails[button.dataset.project];

        $("#dialogEyebrow").textContent = project.eyebrow;
        $("#dialogTitle").textContent = project.title;
        $("#dialogDescription").textContent = project.description;

        const list = $("#dialogFeatures");
        list.replaceChildren();

        project.features.forEach(feature => {
            const item = document.createElement("li");
            item.textContent = feature;
            list.appendChild(item);
        });

        dialog.showModal();
    });
});

$("#dialogClose").addEventListener("click", () => dialog.close());

dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
});

/* ---------------- INTERACTIVE SKILLS ---------------- */

const skillData = {
    frontend: {
        index: "CATEGORY / 01",
        title: "Frontend development",
        description: "Building responsive and accessible interfaces.",
        tags: ["HTML5", "CSS3", "JavaScript", "React", "Responsive design", "Accessibility"]
    },
    backend: {
        index: "CATEGORY / 02",
        title: "Backend development",
        description: "Learning to build APIs, application logic and secure server-side features.",
        tags: ["Node.js", "Express.js", "REST APIs", "Authentication", "Validation"]
    },
    database: {
        index: "CATEGORY / 03",
        title: "Data management",
        description: "Working with structured and document-based data.",
        tags: ["MongoDB", "MySQL", "SQLite", "CRUD", "Data modelling"]
    },
    workflow: {
        index: "CATEGORY / 04",
        title: "Engineering workflow",
        description: "Tools and practices for building, debugging and maintaining software.",
        tags: ["Git", "GitHub", "VS Code", "Debugging", "Testing basics", "UI/UX", "Python basics"]
    }
};

function showSkills(category) {
    const data = skillData[category];
    if (!data) return;

    $("#skillIndex").textContent = data.index;
    $("#skillTitle").textContent = data.title;
    $("#skillDescription").textContent = data.description;

    const container = $("#skillTags");
    container.replaceChildren();

    data.tags.forEach(tag => {
        const element = document.createElement("span");
        element.textContent = tag;
        container.appendChild(element);
    });

    $$(".skill-tab").forEach(tab => {
        const active = tab.dataset.skill === category;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-pressed", String(active));
    });
}

$$(".skill-tab").forEach(button => {
    button.addEventListener("click", () => showSkills(button.dataset.skill));
});

showSkills("frontend");

/* ---------------- LOCAL TERMINAL DEMO ---------------- */

const terminalOutput = $("#terminalOutput");
const terminalInput = $("#terminalInput");

function printTerminal(text, className = "") {
    const line = document.createElement("p");
    line.textContent = text;
    if (className) line.className = className;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

const commands = {
    help: () => [
        "Available commands:",
        "about    - introduction",
        "skills   - skill categories",
        "projects - project list",
        "education - academic background",
        "contact  - contact section",
        "clear    - clear the terminal"
    ],
    about: () => [
        "Software engineering student focused on web development.",
        "Goal: build useful, responsive and reliable applications."
    ],
    skills: () => [
        "Frontend: HTML, CSS, JavaScript, React",
        "Backend: Node.js, Express, REST APIs",
        "Data: MongoDB, MySQL, SQLite",
        "Other: Git, GitHub, Python basics"
    ],
    projects: () => [
        "Lumora - personal finance dashboard",
        "DevTrack AI - developer learning platform concept"
    ],
    education: () => [
        "Meerut Institute of Engineering and Technology",
        "CSE with IoT specialization"
    ],
    contact: () => [
        "Scroll to the Contact section for email and professional links."
    ]
};

function runCommand(rawCommand) {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;

    printTerminal("bean@portfolio:~$ " + command);

    if (command === "clear") {
        terminalOutput.replaceChildren();
        return;
    }

    if (commands[command]) {
        commands[command]().forEach(line => printTerminal(line));
    } else {
        printTerminal(`Command not found: ${command}. Type "help".`);
    }
}

$("#terminalForm").addEventListener("submit", event => {
    event.preventDefault();
    runCommand(terminalInput.value);
    terminalInput.value = "";
    terminalInput.focus();
});

$("#clearTerminal").addEventListener("click", () => {
    terminalOutput.replaceChildren();
    printTerminal('Terminal cleared. Type "help" to continue.');
});

$$("[data-command]").forEach(button => {
    button.addEventListener("click", () => runCommand(button.dataset.command));
});

/* ---------------- ANIMATION CONTROL ---------------- */

const motionToggle = $("#motionToggle");

motionToggle.addEventListener("click", () => {
    const reduced = document.body.classList.toggle("reduce-motion");
    motionToggle.textContent = reduced ? "Motion: OFF" : "Motion: ON";
    motionToggle.setAttribute("aria-pressed", String(reduced));
});

/* ---------------- BACK TO TOP ---------------- */

const backTop = $("#backTop");

window.addEventListener("scroll", () => {
    backTop.classList.toggle("visible", window.scrollY > 450);
}, { passive: true });

backTop.addEventListener("click", () => {
    $("#overview").scrollIntoView({ behavior: "smooth" });
});

/* ---------------- KEYBOARD SHORTCUT ---------------- */

document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        terminalInput.focus();
        terminalInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (event.key === "Escape") {
        sidebar.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    }
});

/* ---------------- CANVAS PARTICLES ---------------- */

const canvas = $("#particles");
const context = canvas.getContext("2d");
let particles = [];
let animationFrame;
let canvasWidth = 0;
let canvasHeight = 0;

function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(55, Math.floor(canvasWidth / 24));

    particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: Math.random() * 1.6 + 0.5,
        speed: Math.random() * 0.25 + 0.08,
        alpha: Math.random() * 0.4 + 0.12
    }));
}

function drawParticles() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    particles.forEach(particle => {
        particle.y -= particle.speed;

        if (particle.y < -5) {
            particle.y = canvasHeight + 5;
            particle.x = Math.random() * canvasWidth;
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(134, 214, 195, ${particle.alpha})`;
        context.fill();
    });

    animationFrame = requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();

window.addEventListener("resize", resizeCanvas);

motionToggle.addEventListener("click", () => {
    if (document.body.classList.contains("reduce-motion")) {
        cancelAnimationFrame(animationFrame);
        context.clearRect(0, 0, canvasWidth, canvasHeight);
    } else {
        cancelAnimationFrame(animationFrame);
        drawParticles();
    }
});

document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(animationFrame);
    if (!document.hidden && !document.body.classList.contains("reduce-motion")) {
        drawParticles();
    }
});
