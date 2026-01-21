// ==========================================
// TOAST NOTIFICATION
// ==========================================

function showToast(message, type = 'default', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    // Add icon for success type
    if (type === 'success') {
        toast.innerHTML = `<span class="toast-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span><span class="toast-message">${message}</span>`;
        toast.className = 'toast success';
    } else {
        toast.innerHTML = `<span class="toast-message">${message}</span>`;
        toast.className = 'toast';
    }

    toast.classList.add('visible');
    setTimeout(() => {
        toast.classList.remove('visible');
    }, duration);
}

// Count-up animation for numbers
function animateCountUp(element, targetValue, duration = 1000) {
    const start = 0;
    const startTime = performance.now();
    const isNegative = targetValue < 0;
    const absTarget = Math.abs(targetValue);
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(easeOut * absTarget);

        element.textContent = prefix + (isNegative ? '-' : '') + '$' + current.toLocaleString() + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ==========================================
// BENEFITS PROGRESS BAR
// ==========================================

const benefitsData = {
    secured: 6759,
    available: 3200,
    securedCount: 6,
    availableCount: 5
};

function animateBenefitsProgress() {
    const progressBar = document.getElementById('benefits-progress-filled');
    if (!progressBar) return;

    const total = benefitsData.secured + benefitsData.available;
    const percentage = Math.round((benefitsData.secured / total) * 100);

    // Reset the bar first
    progressBar.style.width = '0%';

    // Animate after a brief delay to ensure the reset takes effect
    setTimeout(() => {
        progressBar.style.width = percentage + '%';
    }, 100);

    // Update the headline with the available amount
    const headline = document.getElementById('progress-headline');
    if (headline) {
        const availableFormatted = '~$' + benefitsData.available.toLocaleString();
        headline.innerHTML = `You're likely eligible for <strong>${availableFormatted}</strong> in credits and benefits you haven't claimed yet.`;
    }
}

// ==========================================
// MOBILE NAVIGATION
// ==========================================

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileNavOverlay.classList.toggle('active');
    mobileNavDrawer.classList.toggle('active');
    document.body.style.overflow = mobileNavDrawer.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    mobileMenuBtn.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    mobileNavDrawer.classList.remove('active');
    document.body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);
mobileNavOverlay.addEventListener('click', closeMobileMenu);

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer.classList.contains('active')) {
        closeMobileMenu();
    }
});

// ==========================================
// NAVIGATION
// ==========================================

function navigateTo(page) {
    // Hide all page views
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
    });

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected page and update nav (both desktop and mobile)
    if (page === 'file') {
        document.getElementById('page-file').classList.add('active');
        document.getElementById('nav-file').classList.add('active');
        document.getElementById('mobile-nav-file').classList.add('active');
        document.title = 'Filing Complete — Accountable';
        // Trigger confetti celebration
        launchConfetti();
    } else if (page === 'record') {
        document.getElementById('page-record').classList.add('active');
        document.getElementById('nav-record').classList.add('active');
        document.getElementById('mobile-nav-record').classList.add('active');
        document.title = 'Your Taxes — Accountable';
    } else if (page === 'owed') {
        document.getElementById('page-owed').classList.add('active');
        document.getElementById('nav-owed').classList.add('active');
        document.getElementById('mobile-nav-owed').classList.add('active');
        document.title = 'Money You\'re Owed — Accountable';
        // Animate the benefits progress bar
        animateBenefitsProgress();
    } else if (page === 'taxes') {
        document.getElementById('page-taxes').classList.add('active');
        document.getElementById('nav-taxes').classList.add('active');
        document.getElementById('mobile-nav-taxes').classList.add('active');
        document.title = 'Where They Go — Accountable';
        // Reset to federal jurisdiction and categories view when navigating to taxes page
        switchJurisdiction('federal');
    } else if (page === 'voice') {
        document.getElementById('page-voice').classList.add('active');
        document.getElementById('nav-voice').classList.add('active');
        document.getElementById('mobile-nav-voice').classList.add('active');
        document.title = 'Your Voice — Accountable';
    } else {
        // Placeholder for other pages
        showToast('This page is coming soon.');
        navigateTo('record');
    }
}

// ==========================================
// DOWNLOAD RECEIPT
// ==========================================

function downloadReceipt() {
    // Show the receipt modal first
    const modal = document.getElementById('receipt-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeReceiptModal() {
    const modal = document.getElementById('receipt-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function actuallyDownloadReceipt() {
    closeReceiptModal();

    // Create receipt content
    const receiptContent = `
TAXPAYER RECEIPT
Tax Year 2025
=====================================

Jordan Rivera
Single Filer

SUMMARY
-------
Total Taxes Paid:     $37,290.00
Refund Received:      +$3,259.00

WHERE IT WENT
-------------
Social Security:      $5,320.00
Health Programs:      $4,352.00
National Defense:     $3,143.00
Safety Net:           $2,660.00
Interest on Debt:     $2,418.00
Other Federal:        $6,287.00
NY State:             $11,420.00
NYC:                  $1,690.00

=====================================
Thank you for building America.

Generated by Accountable
`;

    // Create and trigger download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taxpayer-receipt-2025.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Receipt downloaded');
}

// ==========================================
// MONEY YOU'RE OWED - Benefit Categories
// ==========================================

function toggleBenefitCategory(element) {
    const isExpanded = element.classList.toggle('expanded');
    element.setAttribute('aria-expanded', isExpanded);
}

// Add keyboard support for benefit categories
document.addEventListener('keydown', (e) => {
    if (e.target.classList.contains('benefit-category') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        toggleBenefitCategory(e.target);
    }
});

// ==========================================
// WHERE IT GOES - JURISDICTION SWITCHING
// ==========================================

function switchJurisdiction(jurisdiction) {
    // Update tab states
    document.querySelectorAll('.jurisdiction-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById('tab-' + jurisdiction).classList.add('active');

    // Update content visibility
    document.querySelectorAll('.jurisdiction-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('content-' + jurisdiction).classList.add('active');

    // Update page title and subtitle
    const pageTitle = document.getElementById('spending-page-title');
    const pageSubtitle = document.getElementById('spending-page-subtitle');
    const mainMethodology = document.getElementById('main-methodology');

    if (jurisdiction === 'federal') {
        pageTitle.textContent = 'How Your Tax Dollars Are Spent';
        pageSubtitle.textContent = 'You paid $37,290 this year. Here\'s where every dollar went.';
        if (mainMethodology) mainMethodology.style.display = 'block';
    } else if (jurisdiction === 'state') {
        pageTitle.textContent = 'How Your Tax Dollars Are Spent — NY State';
        pageSubtitle.textContent = 'Your $11,420 stays in New York. Here\'s what it funds.';
        if (mainMethodology) mainMethodology.style.display = 'none';
    } else if (jurisdiction === 'city') {
        pageTitle.textContent = 'How Your Tax Dollars Are Spent — NYC';
        pageSubtitle.textContent = 'NYC\'s budget is $112 billion. Here\'s your piece of it.';
        if (mainMethodology) mainMethodology.style.display = 'none';
    }

    // If switching to federal, reset to categories view
    if (jurisdiction === 'federal') {
        showCategories();
    }

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// CELEBRATION ANIMATION
// ==========================================

function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.className = 'celebration-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Sophisticated color palette - warm golds, rich greens, elegant accents
    const colors = [
        { r: 212, g: 175, b: 55 },   // Rich gold
        { r: 184, g: 156, b: 67 },   // Antique gold
        { r: 45, g: 90, b: 61 },     // Forest green (brand)
        { r: 122, g: 158, b: 126 },  // Sage green
        { r: 240, g: 90, b: 78 },    // Coral accent
        { r: 92, g: 107, b: 122 },   // Slate
        { r: 255, g: 248, b: 235 }, // Warm cream
    ];

    const particles = [];
    const sparkles = [];

    // Get the checkmark position for burst origin
    const checkmark = document.querySelector('.celebration-checkmark');
    let originX = width / 2;
    let originY = height * 0.25;
    if (checkmark) {
        const rect = checkmark.getBoundingClientRect();
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
    }

    // Particle class with physics
    class Particle {
        constructor(x, y, burst = false) {
            this.x = x;
            this.y = y;

            // Burst particles radiate outward, regular ones fall from above
            if (burst) {
                const angle = Math.random() * Math.PI * 2;
                const velocity = 8 + Math.random() * 12;
                this.vx = Math.cos(angle) * velocity * (0.5 + Math.random() * 0.5);
                this.vy = Math.sin(angle) * velocity - 4;
            } else {
                this.vx = (Math.random() - 0.5) * 3;
                this.vy = -2 - Math.random() * 3;
            }

            this.gravity = 0.12 + Math.random() * 0.08;
            this.drag = 0.98 + Math.random() * 0.015;
            this.flutter = Math.random() * Math.PI * 2;
            this.flutterSpeed = 0.05 + Math.random() * 0.05;
            this.flutterAmount = 0.5 + Math.random() * 1;

            // Rotation for 3D tumbling effect
            this.rotationX = Math.random() * Math.PI * 2;
            this.rotationY = Math.random() * Math.PI * 2;
            this.rotationZ = Math.random() * Math.PI * 2;
            this.rotationSpeedX = (Math.random() - 0.5) * 0.15;
            this.rotationSpeedY = (Math.random() - 0.5) * 0.15;
            this.rotationSpeedZ = (Math.random() - 0.5) * 0.1;

            // Size and shape
            this.width = 6 + Math.random() * 8;
            this.height = 4 + Math.random() * 6;

            // Color
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = 1;
            this.life = 1;
            this.decay = 0.003 + Math.random() * 0.002;
        }

        update() {
            // Apply gravity
            this.vy += this.gravity;

            // Apply drag (air resistance)
            this.vx *= this.drag;
            this.vy *= this.drag;

            // Flutter effect (side-to-side drift)
            this.flutter += this.flutterSpeed;
            this.vx += Math.sin(this.flutter) * this.flutterAmount * 0.1;

            // Update position
            this.x += this.vx;
            this.y += this.vy;

            // Update rotation for tumbling
            this.rotationX += this.rotationSpeedX;
            this.rotationY += this.rotationSpeedY;
            this.rotationZ += this.rotationSpeedZ;

            // Fade out over time
            this.life -= this.decay;
            this.opacity = Math.max(0, this.life);

            return this.life > 0 && this.y < height + 50;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);

            // 3D tumbling simulation using scale transforms
            const scaleX = Math.cos(this.rotationY) * 0.5 + 0.5;
            const scaleY = Math.cos(this.rotationX) * 0.5 + 0.5;
            ctx.rotate(this.rotationZ);
            ctx.scale(scaleX || 0.1, scaleY || 0.1);

            // Draw the confetti piece
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;

            // Rounded rectangle for a paper-like feel
            const w = this.width;
            const h = this.height;
            const r = 1;
            ctx.beginPath();
            ctx.moveTo(-w/2 + r, -h/2);
            ctx.lineTo(w/2 - r, -h/2);
            ctx.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
            ctx.lineTo(w/2, h/2 - r);
            ctx.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
            ctx.lineTo(-w/2 + r, h/2);
            ctx.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
            ctx.lineTo(-w/2, -h/2 + r);
            ctx.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }

    // Sparkle class for shimmering accents
    class Sparkle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 6;
            this.vx = Math.cos(angle) * velocity;
            this.vy = Math.sin(angle) * velocity - 2;
            this.gravity = 0.08;
            this.size = 2 + Math.random() * 3;
            this.opacity = 1;
            this.decay = 0.02 + Math.random() * 0.02;
            this.twinkle = Math.random() * Math.PI * 2;
            this.twinkleSpeed = 0.2 + Math.random() * 0.2;
            // Gold/white sparkles
            this.isGold = Math.random() > 0.3;
        }

        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.twinkle += this.twinkleSpeed;
            this.opacity -= this.decay;
            return this.opacity > 0;
        }

        draw(ctx) {
            const twinkleOpacity = (Math.sin(this.twinkle) * 0.3 + 0.7) * this.opacity;
            ctx.save();
            ctx.globalAlpha = twinkleOpacity;
            ctx.translate(this.x, this.y);

            // Draw a 4-point star sparkle
            const size = this.size * (this.isGold ? 1 : 0.7);
            ctx.fillStyle = this.isGold ? '#D4AF37' : '#FFFFFF';

            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
                const nextAngle = ((i + 0.5) / 4) * Math.PI * 2 - Math.PI / 2;
                ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
                ctx.lineTo(Math.cos(nextAngle) * size * 0.3, Math.sin(nextAngle) * size * 0.3);
            }
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }

    // Create initial burst from checkmark
    function createBurst() {
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle(originX, originY, true));
        }
        for (let i = 0; i < 30; i++) {
            sparkles.push(new Sparkle(originX, originY));
        }
    }

    // Create falling particles from top (staggered)
    let waveCount = 0;
    const maxWaves = 3;
    function createWave() {
        if (waveCount >= maxWaves) return;
        waveCount++;

        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const x = Math.random() * width;
                const y = -20 - Math.random() * 50;
                particles.push(new Particle(x, y, false));

                // Occasional sparkle
                if (Math.random() > 0.7) {
                    sparkles.push(new Sparkle(x, y));
                }
            }, i * 40);
        }

        // Schedule next wave
        if (waveCount < maxWaves) {
            setTimeout(createWave, 800);
        }
    }

    // Animation loop
    let animationId;
    let startTime = Date.now();
    const duration = 5000;

    function animate() {
        const elapsed = Date.now() - startTime;

        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            if (!particles[i].update()) {
                particles.splice(i, 1);
            } else {
                particles[i].draw(ctx);
            }
        }

        // Update and draw sparkles
        for (let i = sparkles.length - 1; i >= 0; i--) {
            if (!sparkles[i].update()) {
                sparkles.splice(i, 1);
            } else {
                sparkles[i].draw(ctx);
            }
        }

        // Continue animation until duration or all particles gone
        if (elapsed < duration || particles.length > 0 || sparkles.length > 0) {
            animationId = requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }

    // Handle resize
    function handleResize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize);

    // Start the celebration
    createBurst();
    setTimeout(createWave, 300);
    animate();

    // Cleanup after animation
    setTimeout(() => {
        window.removeEventListener('resize', handleResize);
        if (animationId) cancelAnimationFrame(animationId);
        if (canvas.parentNode) canvas.remove();
    }, duration + 2000);
}

// ==========================================
// YOUR RECORD - Policy Cards
// ==========================================

function togglePolicy(header) {
    const card = header.closest('.policy-card');
    card.classList.toggle('expanded');
}

// Filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.dataset.filter;
        const cards = document.querySelectorAll('.policy-card');

        cards.forEach(card => {
            const type = card.dataset.type;
            if (filter === 'all') {
                card.style.display = 'block';
            } else if (type && type.includes(filter)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ==========================================
// WHERE YOUR TAXES GO - Drill-down
// ==========================================

function hideAllViews() {
    document.querySelectorAll('#page-taxes .view').forEach(v => v.classList.remove('active'));
}

function showCategories() {
    hideAllViews();
    document.getElementById('view-categories').classList.add('active');
    document.getElementById('main-methodology').style.display = 'block';
}

function renderCategoryTrend(categoryId) {
    const trendAnalysis = getCategoryTrendData(categoryId);
    const insights = getCategoryInsights(categoryId, trendAnalysis);
    const maxAmount = Math.max(...trendAnalysis.trendData.map(d => d.amount));

    let trendHTML = `
        <div class="category-trend">
            <div class="category-trend-header">
                <svg class="category-trend-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                <span class="category-trend-title">Your Allocation Over Time</span>
            </div>
            <div class="trend-chart">
                <div class="trend-bars">`;

    trendAnalysis.trendData.forEach(yearData => {
        const widthPercent = (yearData.amount / maxAmount) * 100;
        const isCurrent = yearData.year === currentYear;
        const change = yearData.year === 2019 ? '' :
            `<span class="trend-bar-change">${yearData.amount >= trendAnalysis.trendData[0].amount ? '+' : ''}${((yearData.amount - trendAnalysis.trendData[0].amount) / trendAnalysis.trendData[0].amount * 100).toFixed(0)}%</span>`;

        trendHTML += `
            <div class="trend-bar-row">
                <span class="trend-year">${yearData.year}</span>
                <div class="trend-bar-track">
                    <div class="trend-bar-fill${isCurrent ? ' current' : ''}" style="width: ${widthPercent}%;"></div>
                </div>
                <span class="trend-bar-value">$${yearData.amount.toLocaleString()}</span>
                ${change}
            </div>`;
    });

    trendHTML += `
                </div>
            </div>
            <div class="trend-insights">`;

    insights.forEach(insight => {
        trendHTML += `
            <div class="trend-insight">
                <span class="trend-insight-bullet">•</span>
                <span>${insight}</span>
            </div>`;
    });

    trendHTML += `
            </div>
        </div>`;

    return trendHTML;
}

function showAgencies(category) {
    hideAllViews();
    document.getElementById('main-methodology').style.display = 'none';

    const viewMap = {
        'health': 'view-health',
        'defense': 'view-defense',
        'interest': 'view-interest',
    };

    const viewId = viewMap[category];
    if (viewId) {
        const view = document.getElementById(viewId);
        view.classList.add('active');

        // Add or update trend visualization
        const navPanel = view.querySelector('.nav-panel');
        let existingTrend = navPanel.querySelector('.category-trend');

        if (existingTrend) {
            existingTrend.remove();
        }

        const trendHTML = renderCategoryTrend(category);
        const trendContainer = document.createElement('div');
        trendContainer.innerHTML = trendHTML;

        // Insert trend after nav-panel-header
        const header = navPanel.querySelector('.nav-panel-header');
        header.insertAdjacentElement('afterend', trendContainer.firstElementChild);
    } else {
        showToast('Detailed breakdown for this category coming soon.');
        showCategories();
    }
}

function showPrograms(agency) {
    hideAllViews();
    document.getElementById('main-methodology').style.display = 'none';

    const viewMap = {
        'cms': 'view-cms',
        'dod': 'view-dod',
    };

    const viewId = viewMap[agency];
    if (viewId) {
        document.getElementById(viewId).classList.add('active');
    } else {
        showToast('Program details for this agency coming soon.');
    }
}

// ==========================================
// TAX DATA BY YEAR
// ==========================================

const taxDataByYear = {
    2019: {
        totalTax: 21650,
        incomeTax: 11890,
        payrollTax: 9760,
        categories: [
            { id: 'social-security', name: 'Social Security', amount: 4763, percent: 22, description: 'Retirement, survivors, and disability benefits' },
            { id: 'health', name: 'Health', amount: 3897, percent: 18, description: 'Medicare, Medicaid, and public health programs' },
            { id: 'defense', name: 'National Defense', amount: 3465, percent: 16, description: 'Military operations, personnel, and equipment' },
            { id: 'income-security', name: 'Income Security', amount: 2382, percent: 11, description: 'Unemployment, food assistance, housing, and disability' },
            { id: 'interest', name: 'Net Interest', amount: 1733, percent: 8, description: 'Interest payments on the national debt' },
            { id: 'veterans', name: 'Veterans Benefits', amount: 1083, percent: 5, description: 'Healthcare, compensation, and services for veterans' },
            { id: 'education', name: 'Education', amount: 866, percent: 4, description: 'K-12, higher education, and student aid programs' },
            { id: 'transportation', name: 'Transportation', amount: 649, percent: 3, description: 'Highways, aviation, rail, and transit systems' },
            { id: 'other', name: 'All Other', amount: 2812, percent: 13, description: 'Science, agriculture, justice, international affairs, and more' }
        ]
    },
    2020: {
        totalTax: 22340,
        incomeTax: 12280,
        payrollTax: 10060,
        categories: [
            { id: 'social-security', name: 'Social Security', amount: 4915, percent: 22, description: 'Retirement, survivors, and disability benefits' },
            { id: 'health', name: 'Health', amount: 4021, percent: 18, description: 'Medicare, Medicaid, and public health programs' },
            { id: 'defense', name: 'National Defense', amount: 3128, percent: 14, description: 'Military operations, personnel, and equipment' },
            { id: 'income-security', name: 'Income Security', amount: 3128, percent: 14, description: 'Unemployment, food assistance, housing, and disability' },
            { id: 'interest', name: 'Net Interest', amount: 1787, percent: 8, description: 'Interest payments on the national debt' },
            { id: 'veterans', name: 'Veterans Benefits', amount: 1117, percent: 5, description: 'Healthcare, compensation, and services for veterans' },
            { id: 'education', name: 'Education', amount: 894, percent: 4, description: 'K-12, higher education, and student aid programs' },
            { id: 'transportation', name: 'Transportation', amount: 670, percent: 3, description: 'Highways, aviation, rail, and transit systems' },
            { id: 'other', name: 'All Other', amount: 2680, percent: 12, description: 'Science, agriculture, justice, international affairs, and more' }
        ]
    },
    2021: {
        totalTax: 23120,
        incomeTax: 12710,
        payrollTax: 10410,
        categories: [
            { id: 'social-security', name: 'Social Security', amount: 5086, percent: 22, description: 'Retirement, survivors, and disability benefits' },
            { id: 'health', name: 'Health', amount: 4162, percent: 18, description: 'Medicare, Medicaid, and public health programs' },
            { id: 'defense', name: 'National Defense', amount: 2774, percent: 12, description: 'Military operations, personnel, and equipment' },
            { id: 'income-security', name: 'Income Security', amount: 3468, percent: 15, description: 'Unemployment, food assistance, housing, and disability' },
            { id: 'interest', name: 'Net Interest', amount: 1618, percent: 7, description: 'Interest payments on the national debt' },
            { id: 'veterans', name: 'Veterans Benefits', amount: 1156, percent: 5, description: 'Healthcare, compensation, and services for veterans' },
            { id: 'education', name: 'Education', amount: 1156, percent: 5, description: 'K-12, higher education, and student aid programs' },
            { id: 'transportation', name: 'Transportation', amount: 693, percent: 3, description: 'Highways, aviation, rail, and transit systems' },
            { id: 'other', name: 'All Other', amount: 3007, percent: 13, description: 'Science, agriculture, justice, international affairs, and more' }
        ]
    },
    2022: {
        totalTax: 23890,
        incomeTax: 13130,
        payrollTax: 10760,
        categories: [
            { id: 'social-security', name: 'Social Security', amount: 5256, percent: 22, description: 'Retirement, survivors, and disability benefits' },
            { id: 'health', name: 'Health', amount: 4300, percent: 18, description: 'Medicare, Medicaid, and public health programs' },
            { id: 'defense', name: 'National Defense', amount: 3106, percent: 13, description: 'Military operations, personnel, and equipment' },
            { id: 'income-security', name: 'Income Security', amount: 2867, percent: 12, description: 'Unemployment, food assistance, housing, and disability' },
            { id: 'interest', name: 'Net Interest', amount: 2151, percent: 9, description: 'Interest payments on the national debt' },
            { id: 'veterans', name: 'Veterans Benefits', amount: 1195, percent: 5, description: 'Healthcare, compensation, and services for veterans' },
            { id: 'education', name: 'Education', amount: 956, percent: 4, description: 'K-12, higher education, and student aid programs' },
            { id: 'transportation', name: 'Transportation', amount: 717, percent: 3, description: 'Highways, aviation, rail, and transit systems' },
            { id: 'other', name: 'All Other', amount: 3342, percent: 14, description: 'Science, agriculture, justice, international affairs, and more' }
        ]
    },
    2023: {
        totalTax: 24180,
        incomeTax: 13279,
        payrollTax: 10901,
        categories: [
            { id: 'social-security', name: 'Social Security', amount: 5320, percent: 22, description: 'Retirement, survivors, and disability benefits' },
            { id: 'health', name: 'Health', amount: 4352, percent: 18, description: 'Medicare, Medicaid, and public health programs' },
            { id: 'defense', name: 'National Defense', amount: 3143, percent: 13, description: 'Military operations, personnel, and equipment' },
            { id: 'income-security', name: 'Income Security', amount: 2660, percent: 11, description: 'Unemployment, food assistance, housing, and disability' },
            { id: 'interest', name: 'Net Interest', amount: 2418, percent: 10, description: 'Interest payments on the national debt' },
            { id: 'veterans', name: 'Veterans Benefits', amount: 1209, percent: 5, description: 'Healthcare, compensation, and services for veterans' },
            { id: 'education', name: 'Education', amount: 967, percent: 4, description: 'K-12, higher education, and student aid programs' },
            { id: 'transportation', name: 'Transportation', amount: 725, percent: 3, description: 'Highways, aviation, rail, and transit systems' },
            { id: 'other', name: 'All Other', amount: 3386, percent: 14, description: 'Science, agriculture, justice, international affairs, and more' }
        ]
    },
    2024: {
        totalTax: 24820,
        incomeTax: 13640,
        payrollTax: 11180,
        categories: [
            { id: 'social-security', name: 'Social Security', amount: 5460, percent: 22, description: 'Retirement, survivors, and disability benefits' },
            { id: 'health', name: 'Health', amount: 4468, percent: 18, description: 'Medicare, Medicaid, and public health programs' },
            { id: 'defense', name: 'National Defense', amount: 3227, percent: 13, description: 'Military operations, personnel, and equipment' },
            { id: 'income-security', name: 'Income Security', amount: 2730, percent: 11, description: 'Unemployment, food assistance, housing, and disability' },
            { id: 'interest', name: 'Net Interest', amount: 2730, percent: 11, description: 'Interest payments on the national debt' },
            { id: 'veterans', name: 'Veterans Benefits', amount: 1241, percent: 5, description: 'Healthcare, compensation, and services for veterans' },
            { id: 'education', name: 'Education', amount: 993, percent: 4, description: 'K-12, higher education, and student aid programs' },
            { id: 'transportation', name: 'Transportation', amount: 745, percent: 3, description: 'Highways, aviation, rail, and transit systems' },
            { id: 'other', name: 'All Other', amount: 3226, percent: 13, description: 'Science, agriculture, justice, international affairs, and more' }
        ]
    }
};

// Annual summary data (total taxes, benefits, net contribution by year)
const annualSummaryByYear = {
    2020: { totalTaxes: 28540, benefits: 2180, netContribution: 26360 },
    2021: { totalTaxes: 31280, benefits: 5840, netContribution: 25440 },
    2022: { totalTaxes: 33650, benefits: 3420, netContribution: 30230 },
    2023: { totalTaxes: 34890, benefits: 2950, netContribution: 31940 },
    2024: { totalTaxes: 36120, benefits: 3180, netContribution: 32940 },
    2025: { totalTaxes: 37290, benefits: 6759, netContribution: 30531 }
};

let currentYear = 2023;

// ==========================================
// TAX HISTORY DATA (Federal/State/City breakdown)
// ==========================================

const taxHistoryByYear = {
    2019: { total: 30320, federal: 19710, state: 9100, city: 1510 },
    2020: { total: 30890, federal: 20080, state: 9270, city: 1540 },
    2021: { total: 32140, federal: 20890, state: 9640, city: 1610 },
    2022: { total: 33450, federal: 21740, state: 10040, city: 1670 },
    2023: { total: 34680, federal: 22540, state: 10410, city: 1730 },
    2024: { total: 35940, federal: 23360, state: 10940, city: 1640 },
    2025: { total: 37290, federal: 24180, state: 11420, city: 1690 }
};

// Policy events that affected the user's taxes
const policyEvents = {
    2021: { text: "Child Tax Credit expansion", impact: "+$1,600", type: "benefit" },
    2022: { text: "Child Tax Credit reduced", impact: "-$1,600", type: "reduction" },
    2017: { text: "SALT cap in effect", impact: "-$4,280/yr", type: "ongoing" }
};

// Why the change explanations by year
const yearOverYearExplanations = {
    2025: {
        summary: "Why you paid $1,350 more in 2025:",
        factors: [
            { type: "income", title: "Modest income growth (+$5,200 reported income)", detail: "Your federal marginal rate stayed at 22%" },
            { type: "credits", title: "Fewer credits claimed (-$200)", detail: "You didn't claim the Saver's Credit this year", action: "Check if you still qualify →", actionPage: "owed" },
            { type: "policy", title: "State tax rate unchanged", detail: "NY rates were flat year-over-year" }
        ]
    },
    2024: {
        summary: "Why you paid $1,260 more in 2024:",
        factors: [
            { type: "income", title: "Cost of living raise (+$4,800 reported income)", detail: "Your effective rate stayed roughly the same" },
            { type: "policy", title: "NY State rate adjustment", detail: "Minor bracket inflation adjustments applied" }
        ]
    },
    2023: {
        summary: "Why you paid $1,230 more in 2023:",
        factors: [
            { type: "income", title: "Annual raise (+$4,500 reported income)", detail: "Your effective rate increased slightly" },
            { type: "policy", title: "Standard deduction adjustment", detail: "Inflation adjustments partially offset the increase" }
        ]
    },
    2022: {
        summary: "Why you paid $1,310 more in 2022:",
        factors: [
            { type: "income", title: "Salary adjustment (+$5,000 reported income)", detail: "Steady career progression" },
            { type: "policy", title: "Child Tax Credit reduced", detail: "The expanded credit from 2021 expired" }
        ]
    },
    2021: {
        summary: "Why you paid $1,250 more in 2021:",
        factors: [
            { type: "income", title: "Income increase (+$4,800 reported income)", detail: "Post-pandemic salary recovery" },
            { type: "policy", title: "Child Tax Credit expansion (+$1,600)", detail: "American Rescue Plan increased the credit — partially offset the increase", action: "Learn about this policy →", actionPage: "voice" }
        ]
    },
    2020: {
        summary: "Why you paid $570 more in 2020:",
        factors: [
            { type: "income", title: "Minimal income change (+$2,100 reported income)", detail: "Pandemic year — limited salary growth" },
            { type: "credits", title: "Standard deduction increase", detail: "Inflation adjustment helped offset some taxes" }
        ]
    }
};

// ==========================================
// TREND CALCULATION
// ==========================================

function calculateTrend(categoryId, fromYear = 2019, toYear = currentYear) {
    const fromData = taxDataByYear[fromYear];
    const toData = taxDataByYear[toYear];

    if (!fromData || !toData) return null;

    const fromCategory = fromData.categories.find(c => c.id === categoryId);
    const toCategory = toData.categories.find(c => c.id === categoryId);

    if (!fromCategory || !toCategory) return null;

    const absoluteChange = toCategory.amount - fromCategory.amount;
    const percentChange = ((toCategory.amount - fromCategory.amount) / fromCategory.amount) * 100;

    // Determine significance and direction
    let direction = 'neutral';
    let type = 'neutral';

    if (Math.abs(percentChange) < 2) {
        direction = 'neutral';
    } else if (percentChange > 0) {
        direction = 'up';
        // Interest growth is concerning
        if (categoryId === 'interest' && percentChange > 15) {
            type = 'concern';
        } else {
            type = 'increase';
        }
    } else {
        direction = 'down';
        type = 'decrease';
    }

    return {
        absoluteChange,
        percentChange,
        direction,
        type,
        fromYear,
        toYear
    };
}

function getTrendBadgeHTML(trend) {
    if (!trend || trend.direction === 'neutral') return '';

    const icon = trend.direction === 'up' ? '↑' : '↓';
    const sign = trend.absoluteChange >= 0 ? '+' : '';

    return `<span class="trend-badge ${trend.type}">
        <span class="trend-badge-icon">${icon}</span>
        ${sign}$${Math.abs(trend.absoluteChange).toLocaleString()} since ${trend.fromYear}
    </span>`;
}

function getCategoryTrendData(categoryId) {
    const years = [2020, 2021, 2022, 2023, 2024, 2025];
    const trendData = years.map(year => {
        const yearData = taxDataByYear[year];
        const category = yearData.categories.find(c => c.id === categoryId);
        return {
            year,
            amount: category.amount,
            percent: category.percent
        };
    });

    // Calculate insights
    const firstYear = trendData[0];
    const lastYear = trendData[trendData.length - 1];
    const totalChange = lastYear.amount - firstYear.amount;
    const totalPercentChange = ((totalChange / firstYear.amount) * 100).toFixed(1);

    // Find biggest year-over-year jump
    let biggestJump = { year: null, amount: 0 };
    for (let i = 1; i < trendData.length; i++) {
        const jump = trendData[i].amount - trendData[i - 1].amount;
        if (Math.abs(jump) > Math.abs(biggestJump.amount)) {
            biggestJump = { year: trendData[i].year, amount: jump };
        }
    }

    return {
        trendData,
        totalChange,
        totalPercentChange,
        biggestJump
    };
}

function getCategoryInsights(categoryId, trendAnalysis) {
    const insights = [];
    const { totalChange, totalPercentChange, biggestJump } = trendAnalysis;

    // Insight 1: Overall change
    if (totalChange > 0) {
        insights.push(`Your allocation increased by $${totalChange.toLocaleString()} (${totalPercentChange}%) from 2020 to 2025`);
    } else if (totalChange < 0) {
        insights.push(`Your allocation decreased by $${Math.abs(totalChange).toLocaleString()} (${Math.abs(totalPercentChange)}%) from 2020 to 2025`);
    }

    // Insight 2: Biggest change
    if (biggestJump.year && Math.abs(biggestJump.amount) > 100) {
        const direction = biggestJump.amount > 0 ? 'jumped' : 'dropped';
        insights.push(`Largest shift was in ${biggestJump.year}, when allocation ${direction} by $${Math.abs(biggestJump.amount).toLocaleString()}`);
    }

    // Insight 3: Category-specific context
    const contextInsights = {
        'interest': 'Rising interest payments reflect the growing national debt and higher interest rates',
        'health': 'Healthcare costs continue rising due to an aging population and medical inflation',
        'defense': 'Defense spending shifts reflect changing security priorities and policy decisions',
        'income-security': 'Income security spending increased during economic downturns, especially during the pandemic',
        'social-security': 'Social Security grows with the retiring Baby Boomer generation',
        'education': 'Education funding reflects federal priorities in K-12 and higher education',
        'veterans': 'Veterans benefits grow with improved care and benefits for returning service members',
        'transportation': 'Infrastructure spending varies with major legislation like the Infrastructure Investment and Jobs Act',
        'other': 'This category includes science, agriculture, justice, and international programs'
    };

    if (contextInsights[categoryId]) {
        insights.push(contextInsights[categoryId]);
    }

    return insights;
}

// ==========================================
// UPDATE DISPLAY WITH YEAR DATA
// ==========================================

function updateTaxDisplay(year) {
    const data = taxDataByYear[year];
    if (!data) return;

    currentYear = year;

    // Update tax summary card (on Where Your Taxes Go page)
    document.querySelector('.tax-summary-card .summary-label').textContent = `Your ${year} federal tax contribution`;
    document.querySelector('.tax-summary-card .summary-value').textContent = `$${data.totalTax.toLocaleString()}`;
    document.querySelector('.tax-summary-breakdown-item:nth-child(1) .tax-summary-breakdown-value').textContent = `$${data.incomeTax.toLocaleString()}`;
    document.querySelector('.tax-summary-breakdown-item:nth-child(2) .tax-summary-breakdown-value').textContent = `$${data.payrollTax.toLocaleString()}`;

    // Update allocation bar
    const allocationBar = document.getElementById('allocation-bar');
    allocationBar.innerHTML = '';

    data.categories.forEach(cat => {
        const segment = document.createElement('div');
        segment.className = 'allocation-segment';
        if (cat.percent <= 5) segment.classList.add('small');
        else if (cat.percent <= 12) segment.classList.add('medium');
        if (cat.id === 'interest') {
            const fill = segment.querySelector('.breakdown-bar-fill');
            if (fill) fill.classList.add('coral');
        }

        segment.style.width = cat.percent + '%';
        segment.dataset.category = cat.id;
        segment.dataset.name = cat.name;
        segment.dataset.amount = '$' + cat.amount.toLocaleString();
        segment.dataset.percent = cat.percent + '%';

        const label = document.createElement('span');
        label.className = 'segment-label';
        label.textContent = cat.name === 'National Defense' ? 'Defense' :
                          cat.name === 'Income Security' ? 'Income' :
                          cat.name === 'Net Interest' ? 'Interest' :
                          cat.name === 'Veterans Benefits' ? 'Veterans' :
                          cat.name === 'Transportation' ? 'Transport' :
                          cat.name === 'All Other' ? 'Other' : cat.name;

        segment.appendChild(label);
        allocationBar.appendChild(segment);

        // Re-attach event listeners for tooltips
        segment.addEventListener('mouseenter', function(e) {
            tooltipName.textContent = this.dataset.name;
            tooltipAmount.textContent = this.dataset.amount;
            tooltipPercent.textContent = this.dataset.percent;
            allocationTooltip.classList.add('visible');
            positionTooltip(e);
        });
        segment.addEventListener('mousemove', function(e) {
            positionTooltip(e);
        });
        segment.addEventListener('mouseleave', function() {
            allocationTooltip.classList.remove('visible');
        });
        segment.addEventListener('click', function() {
            scrollToCategory(this.dataset.category);
        });
    });

    // Update allocation context
    document.querySelector('.allocation-context').textContent =
        `Your $${data.totalTax.toLocaleString()} in federal taxes, allocated across ${data.categories.length} categories.`;

    // Update categories breakdown list
    const breakdownList = document.querySelector('#view-categories .breakdown-list');
    breakdownList.innerHTML = '';

    data.categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'breakdown-list-item';
        item.onclick = function() { showAgencies(cat.id); };

        // Calculate trend for this category
        const trend = calculateTrend(cat.id, 2019, year);
        const trendBadge = getTrendBadgeHTML(trend);

        item.innerHTML = `
            <div class="breakdown-bar-container">
                <div class="breakdown-bar">
                    <div class="breakdown-bar-fill${cat.id === 'interest' ? ' coral' : ''}" style="width: ${cat.percent}%;"></div>
                </div>
            </div>
            <div class="breakdown-content">
                <p class="breakdown-name">${cat.name}</p>
                <p class="breakdown-description">${cat.description}</p>
                ${trendBadge}
            </div>
            <div class="breakdown-figures">
                <span class="breakdown-list-amount">$${cat.amount.toLocaleString()}</span>
                <span class="breakdown-percent">${cat.percent}%</span>
            </div>
            <svg class="breakdown-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        `;

        breakdownList.appendChild(item);
    });
}

// Year selector
document.querySelectorAll('.year-pill').forEach(pill => {
    pill.addEventListener('click', function() {
        document.querySelectorAll('.year-pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        const selectedYear = parseInt(this.dataset.year);
        updateTaxDisplay(selectedYear);
        updateAnnualSummary(selectedYear);

        // Update tax history trend features
        selectTrendYear(selectedYear);
        updateYearComparison(selectedYear);
        updateTaxPaidDisplay(selectedYear);
    });
});

// Update annual summary boxes
function updateAnnualSummary(year) {
    const data = annualSummaryByYear[year];
    if (!data) return;

    // Update values with animation
    const taxesPaid = document.getElementById('annual-taxes-paid');
    const benefits = document.getElementById('annual-benefits');
    const net = document.getElementById('annual-net');

    // Helper function to animate value change
    const animateValue = (element, newValue) => {
        if (!element) return;
        element.classList.remove('value-updated');
        void element.offsetWidth; // Force reflow to restart animation
        element.textContent = newValue;
        element.classList.add('value-updated');
    };

    animateValue(taxesPaid, '$' + data.totalTaxes.toLocaleString());
    animateValue(benefits, '$' + data.benefits.toLocaleString());
    animateValue(net, '$' + data.netContribution.toLocaleString());

    // Update year labels
    const taxesYear = document.getElementById('annual-taxes-year');
    const benefitsYear = document.getElementById('annual-benefits-year');
    const netYear = document.getElementById('annual-net-year');

    if (taxesYear) taxesYear.textContent = year;
    if (benefitsYear) benefitsYear.textContent = year;
    if (netYear) netYear.textContent = year;
}

// ==========================================
// ALLOCATION BAR - Tooltips & Click behavior
// ==========================================

const allocationTooltip = document.getElementById('allocation-tooltip');
const tooltipName = allocationTooltip.querySelector('.allocation-tooltip-name');
const tooltipAmount = allocationTooltip.querySelector('.tooltip-amount');
const tooltipPercent = allocationTooltip.querySelector('.tooltip-percent');

function positionTooltip(e) {
    const tooltipRect = allocationTooltip.getBoundingClientRect();
    const offset = 12;

    let x = e.clientX + offset;
    let y = e.clientY + offset;

    // Keep tooltip within viewport
    if (x + tooltipRect.width > window.innerWidth - 10) {
        x = e.clientX - tooltipRect.width - offset;
    }
    if (y + tooltipRect.height > window.innerHeight - 10) {
        y = e.clientY - tooltipRect.height - offset;
    }

    allocationTooltip.style.left = x + 'px';
    allocationTooltip.style.top = y + 'px';
}

function scrollToCategory(category) {
    // Find the matching breakdown list item
    const categoryMap = {
        'social-security': 'Social Security',
        'health': 'Health',
        'defense': 'National Defense',
        'income-security': 'Income Security',
        'interest': 'Net Interest',
        'veterans': 'Veterans Benefits',
        'education': 'Education',
        'transportation': 'Transportation',
        'other': 'All Other'
    };

    const categoryName = categoryMap[category];
    const breakdownItems = document.querySelectorAll('#view-categories .breakdown-list-item');

    breakdownItems.forEach(item => {
        const nameEl = item.querySelector('.breakdown-name');
        if (nameEl && nameEl.textContent === categoryName) {
            // Scroll to item
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Highlight briefly
            item.style.transition = 'background-color 0.3s';
            item.style.backgroundColor = 'var(--paper-warm)';
            setTimeout(() => {
                item.style.backgroundColor = '';
            }, 1500);
        }
    });
}

// ==========================================
// TAX HISTORY TREND FUNCTIONS
// ==========================================

let selectedTrendYear = 2025;

function initTrendChart() {
    const svg = document.getElementById('trend-chart-svg');
    if (!svg) return;

    const rect = svg.getBoundingClientRect();

    // If dimensions aren't ready yet, wait for next frame
    if (rect.width === 0 || rect.height === 0) {
        requestAnimationFrame(initTrendChart);
        return;
    }

    // Set viewBox to match actual pixel dimensions (prevents stretching)
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);

    const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
    const amounts = years.map(year => taxHistoryByYear[year].total);
    const maxAmount = 40000; // Fixed scale for visual consistency
    const minAmount = 0;

    const chartWidth = rect.width;
    const chartHeight = rect.height;
    const padding = { top: 5, right: 0, bottom: 5, left: 0 };
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;

    // Draw grid lines dynamically
    const gridGroup = document.getElementById('trend-grid');
    gridGroup.innerHTML = '';
    const gridYPositions = [0, 0.25, 0.5, 0.75].map(ratio => padding.top + ratio * plotHeight);
    gridYPositions.forEach(y => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', 0);
        line.setAttribute('y1', y);
        line.setAttribute('x2', chartWidth);
        line.setAttribute('y2', y);
        line.setAttribute('stroke-dasharray', '4');
        gridGroup.appendChild(line);
    });

    // Calculate point positions
    const points = years.map((year, i) => {
        const x = padding.left + (i / (years.length - 1)) * plotWidth;
        const y = padding.top + plotHeight - ((amounts[i] - minAmount) / (maxAmount - minAmount)) * plotHeight;
        return { x, y, year, amount: amounts[i] };
    });

    // Create line path
    const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x},${p.y}`).join(' ');
    document.getElementById('trend-line').setAttribute('d', linePath);

    // Create area path
    const areaPath = linePath +
        ` L${points[points.length - 1].x},${padding.top + plotHeight}` +
        ` L${points[0].x},${padding.top + plotHeight} Z`;
    document.getElementById('trend-area').setAttribute('d', areaPath);

    // Create points
    const pointsGroup = document.getElementById('trend-points');
    pointsGroup.innerHTML = '';
    points.forEach(p => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', p.x);
        circle.setAttribute('cy', p.y);
        circle.setAttribute('r', p.year === selectedTrendYear ? 6 : 4);
        circle.setAttribute('class', 'trend-point' + (p.year === selectedTrendYear ? ' active' : ''));
        circle.setAttribute('data-year', p.year);
        circle.setAttribute('data-amount', p.amount);
        circle.addEventListener('click', () => selectTrendYear(p.year));
        pointsGroup.appendChild(circle);
    });

    // Add policy markers on SVG
    const markersGroup = document.getElementById('policy-markers-svg');
    markersGroup.innerHTML = '';

    // 2021 marker (Child Tax Credit expansion)
    const point2021 = points.find(p => p.year === 2021);
    if (point2021) {
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        marker.innerHTML = `
            <circle cx="${point2021.x}" cy="${point2021.y - 15}" r="4" fill="var(--confirmed)" opacity="0.8"/>
            <line x1="${point2021.x}" y1="${point2021.y - 11}" x2="${point2021.x}" y2="${point2021.y - 5}" stroke="var(--confirmed)" stroke-width="1" stroke-dasharray="2"/>
        `;
        markersGroup.appendChild(marker);
    }

    // 2022 marker (Child Tax Credit reduced)
    const point2022 = points.find(p => p.year === 2022);
    if (point2022) {
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        marker.innerHTML = `
            <circle cx="${point2022.x}" cy="${point2022.y - 15}" r="4" fill="var(--estimate)" opacity="0.8"/>
            <line x1="${point2022.x}" y1="${point2022.y - 11}" x2="${point2022.x}" y2="${point2022.y - 5}" stroke="var(--estimate)" stroke-width="1" stroke-dasharray="2"/>
        `;
        markersGroup.appendChild(marker);
    }

    // Update summary stats
    const totalIncrease = ((taxHistoryByYear[2025].total - taxHistoryByYear[2019].total) / taxHistoryByYear[2019].total * 100).toFixed(0);
    const totalSum = Object.values(taxHistoryByYear).reduce((sum, y) => sum + y.total, 0);
    const average = Math.round(totalSum / years.length);

    document.getElementById('trend-total-increase').textContent = '+' + totalIncrease + '%';
    document.getElementById('trend-average').textContent = '$' + average.toLocaleString();

    // Update tax story summary
    document.getElementById('tax-story-total').textContent = '$' + totalSum.toLocaleString();
    document.getElementById('tax-story-growth').textContent = totalIncrease + '%';
}

function selectTrendYear(year) {
    selectedTrendYear = year;

    // Update trend chart points
    document.querySelectorAll('.trend-point').forEach(point => {
        const pointYear = parseInt(point.getAttribute('data-year'));
        if (pointYear === year) {
            point.classList.add('active');
            point.setAttribute('r', 6);
        } else {
            point.classList.remove('active');
            point.setAttribute('r', 4);
        }
    });

    // Update year labels
    document.querySelectorAll('.trend-year-label').forEach(label => {
        const labelYear = parseInt(label.getAttribute('data-year'));
        if (labelYear === year) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });

    // Update year pills if the year has a pill
    const yearPill = document.querySelector(`.year-pill[data-year="${year}"]`);
    if (yearPill) {
        document.querySelectorAll('.year-pill').forEach(p => p.classList.remove('active'));
        yearPill.classList.add('active');
        updateYearComparison(year);
        updateTaxPaidDisplay(year);
    }
}

function updateYearComparison(year) {
    const currentData = taxHistoryByYear[year];
    const previousYear = year - 1;
    const previousData = taxHistoryByYear[previousYear];

    if (!currentData || !previousData) {
        // Hide comparison card if no previous year data
        document.getElementById('yoy-comparison-card').style.display = 'none';
        return;
    }

    document.getElementById('yoy-comparison-card').style.display = 'block';

    // Calculate changes
    const totalChange = currentData.total - previousData.total;
    const federalChange = currentData.federal - previousData.federal;
    const stateChange = currentData.state - previousData.state;
    const cityChange = currentData.city - previousData.city;

    const totalPercent = ((totalChange / previousData.total) * 100).toFixed(1);
    const federalPercent = ((federalChange / previousData.federal) * 100).toFixed(1);
    const statePercent = ((stateChange / previousData.state) * 100).toFixed(1);
    const cityPercent = ((cityChange / previousData.city) * 100).toFixed(1);

    // Update title
    document.getElementById('yoy-title').textContent = `Your ${year} vs ${previousYear}`;

    // Update badge
    const badge = document.getElementById('yoy-badge');
    const badgeSign = totalChange >= 0 ? '+' : '';
    badge.textContent = badgeSign + totalPercent + '%';
    badge.className = 'yoy-comparison-badge ' + (totalChange >= 0 ? 'increase' : 'decrease');

    // Helper function to format change
    function formatChange(change, percent, elementId) {
        const isIncrease = change >= 0;
        const arrow = isIncrease ? '↑' : '↓';
        const sign = isIncrease ? '+' : '';
        const changeClass = isIncrease ? 'increase' : 'decrease';

        const element = document.getElementById(elementId);
        element.className = 'yoy-change ' + changeClass;
        element.innerHTML = `
            <span class="yoy-change-arrow">${arrow}</span> $${Math.abs(change).toLocaleString()}
            <span class="yoy-change-percent">(${sign}${percent}%)</span>
        `;
    }

    // Update amounts
    document.getElementById('yoy-total-amount').textContent = '$' + currentData.total.toLocaleString();
    document.getElementById('yoy-federal-amount').textContent = '$' + currentData.federal.toLocaleString();
    document.getElementById('yoy-state-amount').textContent = '$' + currentData.state.toLocaleString();
    document.getElementById('yoy-city-amount').textContent = '$' + currentData.city.toLocaleString();

    // Update changes
    formatChange(totalChange, totalPercent, 'yoy-total-change');
    formatChange(federalChange, federalPercent, 'yoy-federal-change');
    formatChange(stateChange, statePercent, 'yoy-state-change');
    formatChange(cityChange, cityPercent, 'yoy-city-change');

    // Update "Why the Change" section
    updateWhyChangeSection(year, totalChange);
}

function updateWhyChangeSection(year, totalChange) {
    const explanation = yearOverYearExplanations[year];

    if (!explanation) {
        document.getElementById('why-change-content').style.display = 'none';
        document.querySelector('.why-change-toggle').style.display = 'none';
        return;
    }

    document.querySelector('.why-change-toggle').style.display = 'flex';

    const changeWord = totalChange >= 0 ? 'more' : 'less';
    document.getElementById('why-change-summary').textContent =
        `Why you paid $${Math.abs(totalChange).toLocaleString()} ${changeWord} in ${year}:`;

    const factorsContainer = document.getElementById('why-change-factors');
    factorsContainer.innerHTML = '';

    explanation.factors.forEach(factor => {
        const factorDiv = document.createElement('div');
        factorDiv.className = 'why-change-factor ' + factor.type;

        let html = `
            <p class="why-change-factor-title">${factor.title}</p>
            <p class="why-change-factor-detail">${factor.detail}</p>
        `;

        if (factor.action) {
            html += `<a class="why-change-factor-action" onclick="navigateTo('${factor.actionPage}'); return false;">${factor.action}</a>`;
        }

        factorDiv.innerHTML = html;
        factorsContainer.appendChild(factorDiv);
    });
}

function toggleWhyChange() {
    const card = document.getElementById('yoy-comparison-card');
    card.classList.toggle('expanded');
}

function updateTaxPaidDisplay(year) {
    const data = taxHistoryByYear[year];
    if (!data) return;

    // Helper function to animate value change
    const animateValue = (element, newValue) => {
        if (!element) return;
        element.classList.remove('value-updated');
        void element.offsetWidth; // Force reflow to restart animation
        element.textContent = newValue;
        element.classList.add('value-updated');
    };

    // Update the "What You Paid" card with animations
    document.querySelector('.taxes-paid-title').textContent = `What You Paid in ${year}`;
    animateValue(document.getElementById('total-taxes-paid'), '$' + data.total.toLocaleString());
    animateValue(document.getElementById('federal-taxes'), '$' + data.federal.toLocaleString());
    animateValue(document.getElementById('state-taxes'), '$' + data.state.toLocaleString());
    animateValue(document.getElementById('city-taxes'), '$' + data.city.toLocaleString());

    // Update bar widths with transition
    const federalPercent = Math.round((data.federal / data.total) * 100);
    const statePercent = Math.round((data.state / data.total) * 100);
    const cityPercent = Math.round((data.city / data.total) * 100);

    const bars = document.querySelectorAll('.tax-type-bar-fill');
    const percentages = document.querySelectorAll('.tax-type-percentage');

    if (bars[0]) bars[0].style.width = federalPercent + '%';
    if (bars[1]) bars[1].style.width = statePercent + '%';
    if (bars[2]) bars[2].style.width = cityPercent + '%';

    if (percentages[0]) percentages[0].textContent = federalPercent + '%';
    if (percentages[1]) percentages[1].textContent = statePercent + '%';
    if (percentages[2]) percentages[2].textContent = cityPercent + '%';

    // Update jurisdiction tab amounts
    const federalTab = document.querySelector('#tab-federal .jurisdiction-tab-amount');
    const stateTab = document.querySelector('#tab-state .jurisdiction-tab-amount');
    const cityTab = document.querySelector('#tab-city .jurisdiction-tab-amount');

    if (federalTab) federalTab.textContent = '$' + data.federal.toLocaleString();
    if (stateTab) stateTab.textContent = '$' + data.state.toLocaleString();
    if (cityTab) cityTab.textContent = '$' + data.city.toLocaleString();
}

// Add event listeners for trend year labels
function initTrendYearLabels() {
    document.querySelectorAll('.trend-year-label').forEach(label => {
        label.addEventListener('click', function() {
            const year = parseInt(this.getAttribute('data-year'));
            selectTrendYear(year);
        });
    });
}

// ==========================================
// CIVIC ENGAGEMENT FEATURES
// ==========================================

// Bill data for Take Action messages
const billData = {
    'salt-repeal': {
        name: 'SALT Deduction Cap Repeal Act',
        billNumber: 'S.1234',
        impact: '+$4,280/year',
        message: `Dear [Representative],

As your constituent in New York, I'm writing to urge your support for the SALT Deduction Cap Repeal Act (S.1234).

The $10,000 cap on state and local tax deductions costs me $4,280 per year in additional federal taxes. This cap disproportionately affects middle-class families in high-cost states like New York who rely on strong public services.

I urge you to support this legislation and prioritize bringing it to a floor vote.

Sincerely,
[Your Name]
[Your Address]`,
        contacts: [
            { name: 'Sen. Charles Schumer', stance: 'support', email: 'senator@schumer.senate.gov', phone: '+12022244451' },
            { name: 'Sen. Kirsten Gillibrand', stance: 'support', email: 'senator@gillibrand.senate.gov', phone: '+12024544752' }
        ]
    },
    'ctc-enhance': {
        name: 'Child Tax Credit Enhancement Act',
        billNumber: 'H.R.5678',
        impact: '+$1,600/year',
        message: `Dear Representative Nadler,

As your constituent in NY-12, I'm writing to urge your support for the Child Tax Credit Enhancement Act (H.R.5678).

As a parent, expanding the Child Tax Credit to $3,600 per child would provide meaningful support for my family - approximately $1,600 more per year. Making the credit fully refundable would also help working families who need it most.

I appreciate your leadership on family tax issues and ask that you prioritize this legislation in committee.

Sincerely,
[Your Name]
[Your Address]`,
        contacts: [
            { name: 'Rep. Jerry Nadler', stance: 'support', email: 'congressman@nadler.house.gov', phone: '+12022255635' }
        ]
    },
    'tcja-extend': {
        name: 'TCJA Extension Act',
        billNumber: 'H.R.9012',
        impact: 'Mixed',
        message: `Dear [Representative],

I'm writing regarding the TCJA Extension Act (H.R.9012).

While some provisions of the 2017 Tax Cuts and Jobs Act have benefited middle-class families like mine, others - particularly the SALT cap - have increased my tax burden by $4,280 per year.

I urge you to consider the full impact of these provisions on working families in high-cost states before voting on this extension.

Sincerely,
[Your Name]
[Your Address]`,
        contacts: [
            { name: 'Rep. Jerry Nadler', stance: 'oppose', email: 'congressman@nadler.house.gov', phone: '+12022255635' }
        ]
    },
    'eitc-expand': {
        name: 'EITC Expansion for Working Families',
        billNumber: 'S.3456',
        impact: '+$800/year',
        message: `Dear Senator,

As your constituent, I'm writing to urge your support for the EITC Expansion for Working Families Act (S.3456).

The Earned Income Tax Credit is one of the most effective anti-poverty programs in America. Expanding it would help working families like mine keep more of what we earn.

I appreciate your attention to this important issue.

Sincerely,
[Your Name]
[Your Address]`,
        contacts: [
            { name: 'Sen. Kirsten Gillibrand', stance: 'support', email: 'senator@gillibrand.senate.gov', phone: '+12024544752' },
            { name: 'Sen. Charles Schumer', stance: 'support', email: 'senator@schumer.senate.gov', phone: '+12022244451' }
        ]
    }
};

// Toggle bill row expansion
function toggleBillRow(row) {
    // Close any other open rows and update their aria-expanded
    document.querySelectorAll('.bill-row.expanded').forEach(openRow => {
        if (openRow !== row) {
            openRow.classList.remove('expanded');
            openRow.setAttribute('aria-expanded', 'false');
        }
    });

    // Toggle this row
    const isExpanded = row.classList.toggle('expanded');
    row.setAttribute('aria-expanded', isExpanded);
}

// Keyboard support for bill rows
document.addEventListener('keydown', (e) => {
    if (e.target.classList.contains('bill-row') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        toggleBillRow(e.target);
    }
});

// Open Take Action module for a specific bill
function openTakeAction(billId) {
    const bill = billData[billId];
    if (!bill) return;

    // Update the Take Action card content
    const billName = document.getElementById('take-action-bill');
    const messageContent = document.getElementById('take-action-message-content');

    if (billName) {
        billName.textContent = bill.name;
    }

    if (messageContent) {
        // Format the message with paragraphs
        const paragraphs = bill.message.split('\n\n');
        messageContent.innerHTML = paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    }

    // Scroll to the Take Action section
    const takeActionSection = document.getElementById('take-action-section');
    if (takeActionSection) {
        takeActionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Add highlight animation
        takeActionSection.classList.add('highlight');
        setTimeout(() => {
            takeActionSection.classList.remove('highlight');
        }, 2000);
    }
}

// Toggle legislation details (expand/collapse)
function toggleLegislationDetails(billId) {
    const item = document.querySelector(`.legislation-item[data-bill="${billId}"]`);
    if (item) {
        item.classList.toggle('expanded');
    }
}

// Copy message to clipboard
function copyMessage() {
    const messageContent = document.getElementById('take-action-message-content');
    const copyBtn = document.querySelector('.message-copy-btn');
    if (!messageContent) return;

    const text = messageContent.innerText;
    const originalHTML = copyBtn ? copyBtn.innerHTML : '';

    // Show loading state
    if (copyBtn) {
        copyBtn.classList.add('loading');
    }

    navigator.clipboard.writeText(text).then(() => {
        // Show success state
        if (copyBtn) {
            copyBtn.classList.remove('loading');
            copyBtn.classList.add('success');
            copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';

            setTimeout(() => {
                copyBtn.classList.remove('success');
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        }
        showToast('Message copied to clipboard', 'success');
    }).catch(err => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        if (copyBtn) {
            copyBtn.classList.remove('loading');
            copyBtn.classList.add('success');
            copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';

            setTimeout(() => {
                copyBtn.classList.remove('success');
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        }
        showToast('Message copied to clipboard', 'success');
    });
}

// Initialize legislation item click handlers
function initLegislationTracker() {
    document.querySelectorAll('.legislation-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on a button inside
            if (e.target.closest('button') || e.target.closest('a')) return;

            const billId = this.getAttribute('data-bill');
            if (billId) {
                openTakeAction(billId);
            }
        });
    });
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tax display with default year
    updateTaxDisplay(currentYear);

    // Initialize tax history trend features
    initTrendChart();
    initTrendYearLabels();
    updateYearComparison(2025);

    // Initialize civic engagement features
    initLegislationTracker();

    // Navigate to default page
    navigateTo('file');

    // Redraw chart on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initTrendChart, 100);
    });
});
