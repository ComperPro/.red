// Animate numbers on scroll
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const value = stat.textContent;
        let current = 0;
        
        if (value.includes('$')) {
            // Handle money values
            const target = parseFloat(value.replace(/[^0-9.]/g, ''));
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = '$' + current.toFixed(1) + 'M';
            }, 30);
        } else if (value.includes('%')) {
            // Handle percentages
            const target = parseInt(value);
            const timer = setInterval(() => {
                current += 1;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = current + '%';
            }, 30);
        } else {
            // Handle regular numbers
            const target = parseInt(value);
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 30);
        }
    });
}

// Trigger animation when page loads
window.addEventListener('load', () => {
    setTimeout(animateNumbers, 500);
});

// Add smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Update live stats
function updateLiveStats() {
    const propertiesAnalyzed = document.querySelector('.stat-number');
    if (propertiesAnalyzed && propertiesAnalyzed.textContent.includes('437')) {
        const newValue = 437 + Math.floor(Math.random() * 10);
        propertiesAnalyzed.textContent = newValue;
    }
}

// Update every 30 seconds
setInterval(updateLiveStats, 30000);