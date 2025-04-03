// Load festival data
let festivalData = null;

async function loadFestivalData() {
    try {
        const response = await fetch('data/festival-data.json');
        if (!response.ok) {
            // If direct fetch fails, try with repository name
            const pathSegments = window.location.pathname.split('/');
            const repoName = pathSegments[1];
            const baseUrl = repoName ? `/${repoName}` : '';
            const secondResponse = await fetch(`${baseUrl}/data/festival-data.json`);
            
            if (!secondResponse.ok) {
                throw new Error('Failed to load festival data');
            }
            festivalData = await secondResponse.json();
        } else {
            festivalData = await response.json();
        }
        updatePageContent();
    } catch (error) {
        console.error('Error loading festival data:', error);
        // Add fallback data for testing
        document.querySelector('.page-header h1').textContent = "Festival Jury";
        document.querySelector('.page-header p').textContent = "Meet our distinguished panel of judges.";
    }
}

// Update page content with loaded data
function updatePageContent() {
    if (!festivalData) return;

    // Update jury section
    const juryContainer = document.querySelector('.jury-grid');
    if (juryContainer && festivalData.jury && Array.isArray(festivalData.jury)) {
        const juryHTML = festivalData.jury.map(member => `
            <div class="jury-card">
                <div class="jury-image">
                    <img src="${member.image}" alt="${member.name}">
                </div>
                <div class="jury-content">
                    <h3>${member.name}</h3>
                    <p class="jury-title">${member.title}</p>
                    <p>${member.bio}</p>
                </div>
            </div>
        `).join('');
        juryContainer.innerHTML = juryHTML;
    }

    // Update contact info in footer
    const footerContactInfo = document.querySelector('footer .contact-info');
    if (footerContactInfo && festivalData.contact) {
        footerContactInfo.innerHTML = `
            <li><i class="fas fa-map-marker-alt"></i> ${festivalData.contact.address}</li>
            <li><i class="fas fa-envelope"></i> ${festivalData.contact.email}</li>
            <li><i class="fas fa-phone"></i> ${festivalData.contact.phone}</li>
        `;
    }

    // Update social media links
    if (festivalData.social) {
        const socialLinks = {
            facebook: document.getElementById('facebook-link'),
            twitter: document.getElementById('twitter-link'),
            instagram: document.getElementById('instagram-link')
        };

        Object.keys(socialLinks).forEach(platform => {
            if (socialLinks[platform] && festivalData.social[platform]) {
                socialLinks[platform].href = festivalData.social[platform];
            }
        });
    }

    // Update copyright year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadFestivalData();
    
    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('section, .jury-card').forEach(element => {
        observer.observe(element);
    });
}); 