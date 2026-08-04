document.addEventListener("DOMContentLoaded", () => {

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    const mobileToggle = document.querySelector(".mobile-nav-toggle");
    const mobileOverlay = document.querySelector(".mobile-nav-overlay");
    const menuIcon = document.querySelector(".menu-icon");
    const closeIcon = document.querySelector(".close-icon");
    if (mobileToggle && mobileOverlay) {
        mobileToggle.addEventListener("click", () => {
            const isOpen = mobileOverlay.classList.toggle("hidden");
            if (!isOpen) {
                menuIcon.classList.add("hidden");
                closeIcon.classList.remove("hidden");
                document.body.style.overflow = "hidden";
            } else {
                menuIcon.classList.remove("hidden");
                closeIcon.classList.add("hidden");
                document.body.style.overflow = "auto";
            }
        });
        const mobileLinks = document.querySelectorAll(".mobile-nav-item");
        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileOverlay.classList.add("hidden");
                menuIcon.classList.remove("hidden");
                closeIcon.classList.add("hidden");
                document.body.style.overflow = "auto";
            });
        });
    }

    const themeToggleBtn = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("innopark-theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
    }
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isDark = document.body.classList.contains("dark-theme");
            if (isDark) {
                document.body.classList.remove("dark-theme");
                document.body.classList.add("light-theme");
                localStorage.setItem("innopark-theme", "light");
            } else {
                document.body.classList.remove("light-theme");
                document.body.classList.add("dark-theme");
                localStorage.setItem("innopark-theme", "dark");
            }
        });
    }

    const statsSection = document.getElementById("stats");
    const statNumbers = document.querySelectorAll(".stat-number");
    let counterStarted = false;
    const startCounters = () => {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute("data-target"), 10);
            const duration = 2000;
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;
            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    counter.innerText = target + (target > 10 ? "+" : "");
                    clearInterval(timer);
                } else {
                    counter.innerText = current;
                }
            }, stepTime);
        });
    };
    if (statsSection && statNumbers.length > 0) {
        const observerOptions = { root: null, threshold: 0.3 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counterStarted) {
                    counterStarted = true;
                    startCounters();
                }
            });
        }, observerOptions);
        observer.observe(statsSection);
    }

    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabId = btn.getAttribute("data-tab");
            tabButtons.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));
            btn.classList.add("active");
            const targetContent = document.getElementById(`tab-${tabId}`);
            if (targetContent) targetContent.classList.add("active");
        });
    });

    const searchInput = document.getElementById("firm-search-input");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const firmCards = document.querySelectorAll(".firm-card");
    const firmsGrid = document.getElementById("firms-grid-container");
    let noResultMsg = document.createElement("p");
    noResultMsg.id = "no-result-msg";
    noResultMsg.className = "text-center hidden";
    noResultMsg.style.gridColumn = "1 / -1";
    noResultMsg.style.padding = "40px 0";
    noResultMsg.style.color = "var(--text-secondary)";
    noResultMsg.innerText = "Arama kriterlerine uygun firma bulunamadı.";
    if (firmsGrid) firmsGrid.appendChild(noResultMsg);
    
    const filterFirms = () => {
        const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const activeFilterBtn = document.querySelector(".filter-btn.active");
        console.log("%cBu web projesinin tüm arayüz tasarımı ve kodlaması tamamen [Aleyna Kardelen AKIN] tarafından sıfırdan geliştirilmiştir.", "color: #007bff; font-size: 12px; font-weight: bold;");
        const activeSector = activeFilterBtn ? activeFilterBtn.getAttribute("data-sector") : "all";
        let visibleCount = 0;
        firmCards.forEach(card => {
            const firmName = card.querySelector(".firm-name").innerText.toLowerCase();
            const firmDesc = card.querySelector(".firm-desc").innerText.toLowerCase();
            const cardSector = card.getAttribute("data-sector");
            const matchesSearch = firmName.includes(searchQuery) || firmDesc.includes(searchQuery);
            const matchesFilter = activeSector === "all" || cardSector === activeSector;
            if (matchesSearch && matchesFilter) {
                card.classList.remove("hidden");
                visibleCount++;
            } else {
                card.classList.add("hidden");
            }
        });
        if (visibleCount === 0) noResultMsg.classList.remove("hidden");
        else noResultMsg.classList.add("hidden");
    };
    if (searchInput) searchInput.addEventListener("input", filterFirms);
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            filterFirms();
        });
    });
    
    const profileCards = document.querySelectorAll(".profile-option-card");
    const nextBtn1 = document.getElementById("wizard-next-1");
    const nextBtn2 = document.getElementById("wizard-next-2");
    const prevBtn2 = document.getElementById("wizard-prev-2");
    const prevBtn3 = document.getElementById("wizard-prev-3");
    const finishBtn = document.getElementById("wizard-finish-btn");
    const steps = document.querySelectorAll(".wizard-step");
    const stepNodes = document.querySelectorAll(".step-node");
    const progressFill = document.getElementById("wizard-progress-fill");
    let currentWizardStep = 1;
    let selectedProfile = "girisimci"; 
    
    profileCards.forEach(card => {
        card.addEventListener("click", () => {
            profileCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            selectedProfile = card.getAttribute("data-profile");
        });
    });
    const updateWizardProgress = (step) => {
        const progressPercent = ((step - 1) / (steps.length - 1)) * 100;
        if (progressFill) progressFill.style.width = `${progressPercent}%`;
        stepNodes.forEach(node => {
            const nodeStep = parseInt(node.getAttribute("data-step"), 10);
            if (nodeStep === step) { node.classList.add("active"); node.classList.remove("completed"); }
            else if (nodeStep < step) { node.classList.add("completed"); node.classList.remove("active"); }
            else { node.classList.remove("active", "completed"); }
        });
        steps.forEach(stepEl => stepEl.classList.remove("active"));
        const activeStepEl = document.getElementById(`wizard-step-${step}`);
        if (activeStepEl) activeStepEl.classList.add("active");
    };
    if (nextBtn1) nextBtn1.addEventListener("click", () => { currentWizardStep = 2; updateWizardProgress(currentWizardStep); });
    if (prevBtn2) prevBtn2.addEventListener("click", () => { currentWizardStep = 1; updateWizardProgress(currentWizardStep); });
    
    const updateIncentivesSummary = (profile) => {
        const summaryBox = document.querySelector(".incentives-summary-box");
        if (!summaryBox) return;
        let content = "";
        if (profile === "girisimci") {
            content = `<div class="incentive-item-row"><div class="inc-icon"><i data-lucide="percent" class="text-orange"></i></div><div class="inc-text"><h4>Girişimci Kampı / Ön Kuluçka Katılımı</h4><p>İş planı hazırlama, şirket kuruluşu mentorluğu ve eğitimlerden ücretsiz faydalanın.</p></div></div><div class="incentive-item-row"><div class="inc-icon"><i data-lucide="award" class="text-blue"></i></div><div class="inc-text"><h4>TÜBİTAK BİGG Hazırlık Desteği</h4><p>900.000 TL'ye varan TÜBİTAK BİGG hibe programlarına proje yazım mentorluğu alacaksınız.</p></div></div><div class="incentive-item-row"><div class="inc-icon"><i data-lucide="layout" class="text-orange"></i></div><div class="inc-text"><h4>InnoGarage Ortak Atölye</h4><p>Baskı ve prototip donanımlarını (3D printer, CNC) ücretsiz kullanma hakkı.</p></div></div>`;
        } else if (profile === "akademisyen") {
            content = `<div class="incentive-item-row"><div class="inc-icon"><i data-lucide="graduation-cap" class="text-orange"></i></div><div class="inc-text"><h4>Akademik Spin-off Desteği</h4><p>Üniversite izniyle sermaye şirketi kurma ve döner sermaye kesintisi muafiyeti.</p></div></div><div class="incentive-item-row"><div class="inc-icon"><i data-lucide="shield-check" class="text-blue"></i></div><div class="inc-text"><h4>Fikri Mülkiyet (Patent) Danışmanlığı</h4><p>Patent ve tescil başvurularında %100 süreç ve mali danışmanlık hizmeti.</p></div></div><div class="incentive-item-row"><div class="inc-icon"><i data-lucide="heart-handshake" class="text-orange"></i></div><div class="inc-text"><h4>Kamu Ar-Ge Fonları Desteği</h4><p>TÜBİTAK 1505 ve TEYDEB projelerinde sanayi ortakları ile doğrudan eşleştirme.</p></div></div>`;
        } else if (profile === "firma") {
            content = `<div class="incentive-item-row"><div class="inc-icon"><i data-lucide="percent" class="text-orange"></i></div><div class="inc-text"><h4>Gelir Vergisi Stopajı İstisnası (%100)</h4><p>Ar-Ge personelinin bölgedeki çalışmaları kapsamında ödediği vergilerden muafiyet.</p></div></div><div class="incentive-item-row"><div class="inc-icon"><i data-lucide="file-check" class="text-blue"></i></div><div class="inc-text"><h4>Kurumlar Vergisi Muafiyeti</h4><p>Bölgedeki yazılım ve Ar-Ge faaliyetlerinden elde edilen kazançlar kurumlar vergisinden muaftır.</p></div></div><div class="incentive-item-row"><div class="inc-icon"><i data-lucide="gift" class="text-orange"></i></div><div class="inc-text"><h4>KDV İstisnası</h4><p>Geliştirilen Ar-Ge yazılımlarının satışı KDV'den muaftır.</p></div></div>`;
        }
        summaryBox.innerHTML = content;
        if (typeof lucide !== "undefined") lucide.createIcons({attrs: {class: "lucide-icon"}});
    };
    
    if (nextBtn2) {
        nextBtn2.addEventListener("click", () => {
            const projectTitle = document.getElementById("project-title")?.value.trim();
            if (!projectTitle) { alert("Lütfen projenizin adını yazın."); return; }
            updateIncentivesSummary(selectedProfile);
            currentWizardStep = 3;
            updateWizardProgress(currentWizardStep);
        });
    }
    if (prevBtn3) prevBtn3.addEventListener("click", () => { currentWizardStep = 2; updateWizardProgress(currentWizardStep); });
    if (finishBtn) {
        finishBtn.addEventListener("click", () => {
            alert("Resmi InnoPark Web Sitesi'ne (innopark.com.tr) yönlendiriliyorsunuz.");
            window.open("https://www.innopark.com.tr", "_blank");
        });
    }
    
    const accordionHeaders = document.querySelectorAll(".accordion-header");
    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const body = item.querySelector(".accordion-body");
            const isActive = item.classList.contains("active");
            document.querySelectorAll(".accordion-item").forEach(i => {
                i.classList.remove("active");
                i.querySelector(".accordion-body").style.maxHeight = null;
            });
            if (!isActive) {
                item.classList.add("active");
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });
    
    const modal = document.getElementById("firm-modal");
    const modalClose = document.querySelector(".modal-close");
    const modalContent = document.querySelector(".modal-body-content");
    const modalTriggers = document.querySelectorAll(".firm-modal-trigger");
    const firmDetailsData = {
        innosoft: { name: "İnnosoft Teknoloji", sector: "Yazılım & Bilişim", sectorClass: "yazilim", desc: "İnnosoft, endüstriyel üretim yapan fabrikaların verimliliğini artırmaya odaklanmıştır.", bullets: ["Yerleşim: A Blok - Ofis 12", "Ar-Ge Ekibi: 14 Mühendis", "Patent/Faydalı Model: 2 Tescilli Patent", "Kuruluş Yılı: 2018"] },
        milkon: { name: "MilKon Savunma", sector: "Savunma Sanayii", sectorClass: "savunma", desc: "Milli ve sivil İnsansız Hava Araçları (İHA/SİHA) aviyonik sistemleri üzerine çalışan firmamız.", bullets: ["Yerleşim: C Blok - Ofis 4", "Ar-Ge Ekibi: 22 Uzman Araştırmacı", "Yerlilik Oranı: %94 Yazılım ve Mekanik"] },
        biokon: { name: "BioKon Sağlık", sector: "Biyoteknoloji", sectorClass: "biyoteknoloji", desc: "BioKon Sağlık, tarımsal analiz ve gıda güvenliğinde kullanılmak üzere yerli biyosensörler geliştirmektedir.", bullets: ["Yerleşim: B Blok - Ofis 8", "Ar-Ge Ekibi: 8 Biyolog", "Kuruluş Yılı: 2021"] },
        aerosol: { name: "AeroSol Enerji", sector: "Enerji & Çevre", sectorClass: "enerji", desc: "Yenilenebilir enerji teknolojilerine odaklanan firmamız donanımlar üretir.", bullets: ["Yerleşim: A Blok - Ofis 25", "Ar-Ge Ekibi: 11 Mühendis", "Kuruluş Yılı: 2019"] },
        optima: { name: "Optima Robotik", sector: "Makine & İmalat", sectorClass: "makine", desc: "Optima Robotik, ağır sanayi üreticileri için çok eksenli kartezyen robotlar üretir.", bullets: ["Yerleşim: D Blok - Ofis 2", "Ar-Ge Ekibi: 18 Mekatronik Uzmanı"] },
        verianaliz: { name: "VeriAnaliz Bilişim", sector: "Yazılım & Bilişim", sectorClass: "yazilim", desc: "Büyük veri ve veri madenciliği projeleri geliştiren VeriAnaliz hizmetleri.", bullets: ["Yerleşim: B Blok - Ofis 14", "Ar-Ge Ekibi: 6 Yazılım Mühendisi"] }
    };
    
    const openModal = (firmId) => {
        const data = firmDetailsData[firmId];
        if (!data || !modal || !modalContent) return;
        const bulletHtml = data.bullets.map(b => `<div class="modal-bullet-row"><i data-lucide="check-circle"></i> <span>${b}</span></div>`).join("");
        modalContent.innerHTML = `<div class="modal-content-wrapper"><div class="modal-m-header"><span class="sector-tag ${data.sectorClass}">${data.sector}</span><h2>${data.name}</h2></div><div class="modal-m-body"><p>${data.desc}</p><div class="modal-info-bullets">${bulletHtml}</div></div><div class="text-center"><button class="btn-primary modal-action-btn">Firma ile İletişim Kur</button></div></div>`;
        if (typeof lucide !== "undefined") lucide.createIcons({attrs: {class: "lucide-icon"}});
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        const actionBtn = modalContent.querySelector(".modal-action-btn");
        if (actionBtn) {
            actionBtn.addEventListener("click", () => {
                modal.classList.remove("active");
                document.body.style.overflow = "auto";
                const contactSection = document.getElementById("contact");
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                    const subjectInput = document.getElementById("c-subject");
                    if (subjectInput) subjectInput.value = `${data.name} ile Ar-Ge İş Birliği Görüşme Talebi`;
                }
            });
        }
    };
    modalTriggers.forEach(trigger => { trigger.addEventListener("click", (e) => { const firmId = trigger.getAttribute("data-firm"); openModal(firmId); }); });
    if (modalClose) modalClose.addEventListener("click", () => { modal.classList.remove("active"); document.body.style.overflow = "auto"; });
    if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) { modal.classList.remove("active"); document.body.style.overflow = "auto"; } });
    
    const contactForm = document.getElementById("contact-form-el");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("c-name").value.trim();
            if (name) { alert(`Sayın ${name}, mesajınız başarıyla InnoPark iletişim birimine iletilmiştir.`); contactForm.reset(); }
        });
    }
    
    const contactTriggers = document.querySelectorAll(".contact-btn-trigger");
    contactTriggers.forEach(btn => {
        btn.addEventListener("click", () => {
            const contactSection = document.getElementById("contact");
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
                const subjectInput = document.getElementById("c-subject");
                if (subjectInput) subjectInput.value = `InnoPark Hizmetleri Hakkında Bilgi Talebi`;
            }
        });
    });

    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll("section");
    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 100;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) { currentSectionId = sec.getAttribute("id"); }
        });
        navItems.forEach(item => {
            item.classList.remove("active");
            const href = item.getAttribute("href");
            if (href === `#${currentSectionId}`) item.classList.add("active");
        });
    });

    const btnPartners = document.getElementById("btn-show-partners");
    if (btnPartners) {
        btnPartners.addEventListener("click", function() {
            const hiddenPartners = document.querySelectorAll("#partners-grid-el .hidden-item");
            hiddenPartners.forEach(item => item.classList.remove("hidden-item"));
            this.style.display = "none";
        });
    }

    const btnEvents = document.getElementById("btn-show-events");
    if (btnEvents) {
        btnEvents.addEventListener("click", function() {
            const hiddenEvents = document.querySelectorAll("#events-grid-el .hidden-item");
            hiddenEvents.forEach(item => item.classList.remove("hidden-item"));
            this.style.display = "none";
        });
    }

    const eventModal = document.getElementById("event-modal");
    const eventModalContent = document.getElementById("event-modal-content");
    const eventModalTriggers = document.querySelectorAll(".event-modal-trigger");
    const eventModalCloses = document.querySelectorAll(".event-modal-close");

    const eventData = {
        evt1: {
            img: "etkinlik_1.jpg",
            desc: "TÜBİTAK 1501 Sanayi Ar-Ge Destek Programı ve 1507 KOBİ Ar-Ge Başlangıç Destek Programı hakkında merak ettiğiniz tüm detayları öğrenmek için sizleri bilgilendirme etkinliğimize davet ediyoruz.",
            bullets: ["Programların tanıtımı", "Destek kapsamı ve başvuru şartları", "Proje yazım süreci", "Bütçelendirme esasları", "Başvuru takvimi ve değerlendirme süreci", "Soru – Cevap oturumu ele alınacaktır."],
            speakerName: "Murat TAŞDEMİR",
            speakerTitle: "TÜBİTAK TEYDEB Bilimsel Programlar Uzmanı",
            date: "05 Ağustos 2026",
            time: "14:00",
            location: "Online",
            link: "inno.tr/tubitak"
        },
        evt2: {
            img: "etkinlik_2.jpg",
            desc: "TÜBİTAK 1507 KOBİ Ar-Ge Başlangıç Destek Programı başvuruları açıldı. Şirketinizin Ar-Ge kapasitesini artırmak için bu fırsatı kaçırmayın.",
            bullets: ["Personel Giderleri", "Seyahat Giderleri", "Teçhizat ve Yazılım", "Ar-Ge Hizmet Giderleri"],
            speakerName: "InnoPark TTO",
            speakerTitle: "Proje Destek Birimi",
            date: "11 Kasım 2026",
            time: "17:00",
            location: "InnoPark Kampüsü",
            link: "inno.tr/1507"
        },
        evt3: {
            img: "etkinlik_3.jpg",
            desc: "Sanayi kuruluşlarının Ar-Ge projelerini destekleyen TÜBİTAK 1501 Programı ile yenilikçi fikirlerinizi hayata geçirin.",
            bullets: ["%75'e Kadar Destek", "Proje Süresi En Fazla 36 Ay"],
            speakerName: "InnoPark Yönetimi",
            speakerTitle: "Üniversite-Sanayi İşbirliği Birimi",
            date: "26 Ekim 2026",
            time: "23:59",
            location: "Online Başvuru",
            link: "inno.tr/1501"
        },
        evt4: {
            img: "etkinlik_4.jpg",
            desc: "TÜBİTAK 1711 Yapay Zekâ Ekosistem Çağrısı Başvuruları Açıldı!",
            bullets: ["Yapay Zeka Destekleri", "Kamu ve Özel Sektör Ortaklıkları"],
            speakerName: "Teknoloji Danışmanı",
            speakerTitle: "Yapay Zeka Birimi",
            date: "14 Eylül 2026",
            time: "10:00",
            location: "InnoPark",
            link: "inno.tr/1711"
        },
        evt5: {
            img: "etkinlik_5.jpg",
            desc: "AB Proje Hazırlama Atölyesi Başlıyor!",
            bullets: ["Horizon Europe", "Bütçe ve Finansman", "Uygulamalı Eğitim"],
            speakerName: "Uluslararası Projeler Uzmanı",
            speakerTitle: "Proje Birimi",
            date: "20 Eylül 2026",
            time: "09:00",
            location: "Online",
            link: "inno.tr/ab-proje"
        },
        evt6: {
            img: "etkinlik_6.jpg",
            desc: "Fikrini Girişime Dönüştürmeye Hazır Mısın?",
            bullets: ["Girişimcilik 101", "BİGG Destekleri", "Melek Yatırım"],
            speakerName: "Kuluçka Yöneticisi",
            speakerTitle: "Girişimcilik Merkezi",
            date: "14 Temmuz 2026",
            time: "14:00",
            location: "InnoGarage",
            link: "inno.tr/bigg"
        }
    };

    const openEventModal = (evtId) => {
        const data = eventData[evtId];
        if (!data || !eventModal || !eventModalContent) return;

        const bulletsHtml = data.bullets.map(b => `<li><i data-lucide="check"></i> ${b}</li>`).join("");
        
        eventModalContent.innerHTML = `
            <div class="event-modal-grid">
                <img src="${data.img}" alt="Etkinlik Afişi" class="event-modal-img" onerror="this.src='https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=600';">
                <div class="event-modal-details">
                    <p class="event-modal-desc">${data.desc}</p>
                    <ul class="event-bullet-list">
                        <li><i data-lucide="pin"></i> Etkinlikte;</li>
                        ${bulletsHtml}
                    </ul>
                    <div class="event-speaker-box">
                        <i data-lucide="mic"></i>
                        <div class="event-speaker-info">
                            <h5>Eğitmen: ${data.speakerName}</h5>
                            <p>${data.speakerTitle}</p>
                        </div>
                    </div>
                    <ul class="event-meta-list">
                        <li><i data-lucide="calendar"></i> Tarih: ${data.date}</li>
                        <li><i data-lucide="clock"></i> Saat: ${data.time}</li>
                        <li><i data-lucide="monitor"></i> Yer: ${data.location}</li>
                        <li><i data-lucide="link"></i> Kayıt linki: <a href="http://${data.link}" target="_blank" style="color:#2563eb;">${data.link}</a></li>
                    </ul>
                    <div class="event-close-btn-wrapper">
                        <button class="event-action-close">Kapat</button>
                    </div>
                </div>
            </div>
        `;
        
        if (typeof lucide !== "undefined") lucide.createIcons();
        eventModal.classList.add("active");
        document.body.style.overflow = "hidden";

        const innerCloseBtn = eventModalContent.querySelector(".event-action-close");
        if (innerCloseBtn) {
            innerCloseBtn.addEventListener("click", () => {
                eventModal.classList.remove("active");
                document.body.style.overflow = "auto";
            });
        }
    };

    eventModalTriggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            const evtId = trigger.getAttribute("data-event");
            openEventModal(evtId);
        });
    });

    if (eventModalCloses) {
        eventModalCloses.forEach(btn => {
            btn.addEventListener("click", () => {
                eventModal.classList.remove("active");
                document.body.style.overflow = "auto";
            });
        });
    }

    if (eventModal) {
        eventModal.addEventListener("click", (e) => {
            if (e.target === eventModal) {
                eventModal.classList.remove("active");
                document.body.style.overflow = "auto";
            }
        });
    }
});