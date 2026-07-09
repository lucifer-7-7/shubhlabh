// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// Initialize Locomotive Scroll
let scroller;
try {
    scroller = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        multiplier: 1.0,
        lerp: 0.1
    });

    // Sync ScrollTrigger with Locomotive Scroll
    scroller.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
        scrollTop(value) {
            return arguments.length ? scroller.scrollTo(value, 0, 0) : scroller.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        pinType: document.querySelector('[data-scroll-container]').style.transform ? "transform" : "fixed"
    });

    // Update ScrollTrigger on scroll refresh
    ScrollTrigger.addEventListener('refresh', () => scroller.update());
    ScrollTrigger.refresh();

} catch (error) {
    console.error("Locomotive Scroll failed to initialize: ", error);
}

// -------------------------------------------------------------
// Interactive Core Logic
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinksList = navMenu.querySelector('.nav-links');

    mobileToggle.addEventListener('click', () => {
        navLinksList.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        if (scroller) scroller.update();
    });

    // 2. Smooth Scroll to Anchors
    document.querySelectorAll('[data-scroll-to]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (scroller) {
                scroller.scrollTo(targetId, {
                    offset: -70, // Header height offset
                    duration: 1000
                });
            } else {
                const element = document.querySelector(targetId);
                if (element) {
                    window.scrollTo({
                        top: element.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }

            navLinksList.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // 3. Testimonial Tab Switcher
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `tab-${tabName}`) {
                    panel.classList.add('active');
                }
            });

            if (scroller) scroller.update();
        });
    });

    // 4. File Upload Label Syncing
    const resumeInput = document.getElementById('resume');
    const fileLabel = document.getElementById('file-label');

    if (resumeInput) {
        resumeInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                fileLabel.textContent = `Selected: ${e.target.files[0].name}`;
            } else {
                fileLabel.textContent = "Click here or drag file to upload (.pdf, .doc, .docx formats)";
            }
        });
    }

    const careerResumeInput = document.getElementById('career-resume');
    const careerFileLabel = document.getElementById('career-file-label');

    if (careerResumeInput) {
        careerResumeInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                careerFileLabel.textContent = `Selected: ${e.target.files[0].name}`;
            } else {
                careerFileLabel.textContent = "Click here or drag file to upload";
            }
        });
    }

    // 5. Careers Apply Modal
    const modal = document.getElementById('applyModal');
    const openModalBtns = document.querySelectorAll('.open-apply-modal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalJobTitle = document.getElementById('modal-job-title');
    const hiddenJobInput = document.getElementById('job-input-hidden');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const jobName = btn.getAttribute('data-job');
            modalJobTitle.textContent = jobName;
            hiddenJobInput.value = jobName;
            modal.style.display = 'flex';
        });
    });

    const closeModal = () => {
        modal.style.display = 'none';
        document.getElementById('careerForm').reset();
        if (careerFileLabel) careerFileLabel.textContent = "Click here or drag file to upload";
    };

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 6. Forms Submission & Success Toast
    const toast = document.getElementById('toast-success');
    const showToast = (message) => {
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 4000);
    };

    const whatsappBase = "https://wa.me/917483526536?text=";

    const promoterForm = document.getElementById('promoterForm');
    if (promoterForm) {
        promoterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const state = document.getElementById('state').value;
            const district = document.getElementById('district').value;
            const city = document.getElementById('city').value;
            const qualification = document.getElementById('qualification').value;
            const occupation = document.getElementById('occupation').value;
            const languages = document.getElementById('languages').value;
            
            // Read selected resume filename
            const resumeInput = document.getElementById('resume');
            let resumeName = "No file selected";
            if (resumeInput && resumeInput.files && resumeInput.files[0]) {
                resumeName = resumeInput.files[0].name;
            }
            
            const msg = `*PROMOTER REGISTRATION - SHUBH LABH*\n` +
                        `----------------------------------\n` +
                        `*Name*: ${name}\n` +
                        `*Mobile*: ${phone}\n` +
                        `*Email*: ${email}\n` +
                        `*Location*: ${city}, ${district}, ${state}\n` +
                        `*Qualification*: ${qualification}\n` +
                        `*Occupation*: ${occupation}\n` +
                        `*Languages*: ${languages}\n` +
                        `*Attached Resume File*: ${resumeName}\n\n` +
                        `_(Please attach your resume file "${resumeName}" directly to this WhatsApp chat)_`;
            
            window.open(whatsappBase + encodeURIComponent(msg), '_blank');
            showToast("Opening WhatsApp to complete registration...");
            promoterForm.reset();
            if (fileLabel) fileLabel.textContent = "Click here or drag file to upload (.pdf, .doc, .docx formats)";
        });
    }

    const careerForm = document.getElementById('careerForm');
    if (careerForm) {
        careerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedJob = hiddenJobInput.value;
            
            const name = document.getElementById('career-name').value;
            const email = document.getElementById('career-email').value;
            const phone = document.getElementById('career-phone').value;
            
            // Read selected career resume filename
            const careerResumeInput = document.getElementById('career-resume');
            let resumeName = "No file selected";
            if (careerResumeInput && careerResumeInput.files && careerResumeInput.files[0]) {
                resumeName = careerResumeInput.files[0].name;
            }
            
            const msg = `*JOB APPLICATION - SHUBH LABH*\n` +
                        `----------------------------\n` +
                        `*Position*: ${selectedJob}\n` +
                        `*Name*: ${name}\n` +
                        `*Email*: ${email}\n` +
                        `*Phone*: ${phone}\n` +
                        `*Attached Resume File*: ${resumeName}\n\n` +
                        `_(Please attach your resume file "${resumeName}" directly to this WhatsApp chat)_`;
            
            window.open(whatsappBase + encodeURIComponent(msg), '_blank');
            closeModal();
            showToast(`Opening WhatsApp to apply for ${selectedJob}...`);
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;
            
            const msg = `*CONTACT INQUIRY - SHUBH LABH*\n` +
                        `----------------------------\n` +
                        `*Name*: ${name}\n` +
                        `*Email*: ${email}\n` +
                        `*Subject*: ${subject}\n` +
                        `*Message*: ${message}`;
            
            window.open(whatsappBase + encodeURIComponent(msg), '_blank');
            showToast("Opening WhatsApp to send inquiry...");
            contactForm.reset();
        });
    }

    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input').value;
            const msg = `*NEWSLETTER SUBSCRIBE - SHUBH LABH*\n` +
                        `----------------------------------\n` +
                        `*Email*: ${email}`;
            
            window.open(whatsappBase + encodeURIComponent(msg), '_blank');
            showToast("Opening WhatsApp to complete subscription...");
            newsletterForm.reset();
        });
    }

    // -------------------------------------------------------------
    // Preloader Greeting Rotation & Page Fadeout
    // -------------------------------------------------------------
    const initialGreeting = "नमस्ते";
    const otherGreetings = [
        "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ",  // Punjabi
        "வணக்கம்",      // Tamil
        "নমস্কার",      // Bengali
        "నమస్కారం",     // Telugu
        "നമസ്കാരം",    // Malayalam
        "ನಮಸ್ಕಾರ",      // Kannada
        "નમસ્તે",       // Gujarati
        "नमस्कार"      // Marathi
    ];

    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Assemble final greetings list: Namaste first, then random order
    const greetings = [initialGreeting, ...shuffleArray(otherGreetings)];
    
    let greetingIndex = 0;
    let greetingsShownCount = 0;
    let preloaderDismissed = false;
    const greetingEl = document.getElementById('preloader-greeting');
    
    function dismissPreloader() {
        if (preloaderDismissed) return;
        preloaderDismissed = true;
        
        // Remove interactive bypass listeners
        window.removeEventListener('click', dismissPreloader);
        window.removeEventListener('touchstart', dismissPreloader);
        window.removeEventListener('keydown', dismissPreloader);
        
        const preloader = document.getElementById('preloader');
        if (preloader) {
            gsap.killTweensOf(preloader);
            gsap.killTweensOf(greetingEl);
            
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                    preloader.style.display = 'none';
                    tlEntrance.play(); // Trigger main website entrance animations
                }
            });
        }
    }

    // Attach user interaction listeners for instant bypass
    window.addEventListener('click', dismissPreloader);
    window.addEventListener('touchstart', dismissPreloader, { passive: true });
    window.addEventListener('keydown', dismissPreloader);

    function rotateGreetings() {
        if (!greetingEl || preloaderDismissed) return;
        
        const tl = gsap.timeline({
            onComplete: () => {
                greetingsShownCount++;
                if (greetingsShownCount >= greetings.length) {
                    // Completed one full cycle of all regional languages - dismiss automatically
                    dismissPreloader();
                } else {
                    rotateGreetings();
                }
            }
        });
        
        // 1. Hold current greeting visible
        tl.to({}, { duration: 0.75 })
        // 2. Fade out current greeting
        .to(greetingEl, {
            opacity: 0,
            duration: 0.35,
            ease: "power2.out"
        })
        // 3. Swap word text while completely invisible
        .call(() => {
            greetingIndex = (greetingIndex + 1) % greetings.length;
            greetingEl.textContent = greetings[greetingIndex];
        })
        // 4. Fade in new greeting
        .to(greetingEl, {
            opacity: 1,
            duration: 0.35,
            ease: "power2.in"
        });
    }

    // Start greetings loop
    rotateGreetings();

    // -------------------------------------------------------------
    // GSAP Micro-Animations
    // -------------------------------------------------------------

    const tlEntrance = gsap.timeline({ paused: true });
    
    // Animate map background path outline
    const mapPath = document.querySelector('.hero-background-svg path');
    if (mapPath) {
        const pathLength = mapPath.getTotalLength();
        gsap.set(mapPath, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength
        });
        tlEntrance.to(mapPath, {
            strokeDashoffset: 0,
            duration: 2.0,
            ease: "power2.out"
        });
    }

    // Entrance animation of text titles and floating visual elements
    tlEntrance.from('.hero-tag', {
        opacity: 0,
        x: -20,
        duration: 0.6,
        ease: "power2.out"
    }, "-=1.2")
    .from('.reveal-text', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out"
    }, "-=1.0")
    .from('.reveal-sub', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.8")
    .from('.hero-cta-group', {
        opacity: 0,
        y: 15,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.6")
    .from('.central-visual-circle', {
        opacity: 0,
        y: 30,
        duration: 1.0,
        ease: "power3.out"
    }, "-=0.6")
    .from('.anno-text', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.4")
    .from('.hero-tagline-footer', {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.2");

    // Continuous, subtle organic floating drift for the annotations (No scale/bounce)
    const floatingAnnos = document.querySelectorAll('.anno-text');
    floatingAnnos.forEach(anno => {
        gsap.to(anno, {
            x: "random(-8, 8)",
            y: "random(-8, 8)",
            duration: "random(4, 7)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });

    // Scroll Triggered Numbers Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const textVal = stat.textContent;
        const numberVal = parseInt(textVal.replace(/[^0-9]/g, ''));
        const suffix = textVal.replace(/[0-9,]/g, '');
        
        const countObj = { val: 0 };
        
        gsap.to(countObj, {
            val: numberVal,
            scrollTrigger: {
                trigger: stat,
                scroller: scroller ? '[data-scroll-container]' : window,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            duration: 2.0,
            ease: "power1.out",
            onUpdate: function() {
                if (suffix.includes("Lakh")) {
                    stat.textContent = Math.floor(countObj.val) + suffix;
                } else {
                    stat.textContent = Math.floor(countObj.val).toLocaleString() + suffix;
                }
            }
        });
    });

    // Scroll Triggered Timeline Progress Filling (Curvy SVG Path)
    const timelineSec = document.getElementById('process');
    const timelineSteps = document.querySelectorAll('.timeline-step');
    const progressPath = document.getElementById('timeline-progress-path');

    if (timelineSec && timelineSteps.length > 0 && progressPath) {
        let pathLength = progressPath.getTotalLength();
        
        // Initialize dash properties
        progressPath.style.strokeDasharray = pathLength;
        progressPath.style.strokeDashoffset = pathLength;

        timelineSteps.forEach((step, idx) => {
            gsap.to(step, {
                scrollTrigger: {
                    trigger: step,
                    scroller: scroller ? '[data-scroll-container]' : window,
                    start: "top 60%",
                    end: "bottom 60%",
                    onEnter: () => {
                        step.classList.add('active');
                        const pct = (idx + 1) / timelineSteps.length;
                        progressPath.style.strokeDashoffset = pathLength * (1 - pct);
                    },
                    onLeaveBack: () => {
                        step.classList.remove('active');
                        const pct = idx / timelineSteps.length;
                        progressPath.style.strokeDashoffset = pathLength * (1 - pct);
                    }
                }
            });
        });

        // Recalculate path length on resize to handle layout shifts
        window.addEventListener('resize', () => {
            pathLength = progressPath.getTotalLength();
            progressPath.style.strokeDasharray = pathLength;
        });
    }

    if (scroller) {
        scroller.on('scroll', ScrollTrigger.update);
        window.addEventListener('resize', () => {
            scroller.update();
        });
    }

});
