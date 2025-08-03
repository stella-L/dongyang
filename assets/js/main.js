// Main JavaScript for 창원 동양한의원 website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput && searchButton) {
        // Sample data for search (in a real implementation, this would come from a database or API)
        const searchData = [
            {
                title: '부정맥 치료',
                content: '심계, 두근거림, 불규칙한 맥박 치료',
                url: 'treatment.html#arrhythmia',
                category: 'treatment'
            },
            {
                title: '난소기능부전증',
                content: '여성 호르몬 불균형, 생리불순 치료',
                url: 'treatment.html#ovarian',
                category: 'treatment'
            },
            {
                title: '봄철 몸의 변화와 한약의 역할',
                content: '계절 변화에 따른 체질 관리법',
                url: 'column.html#spring-herbs',
                category: 'column'
            },
            {
                title: '마음과 몸이 하나가 되는 순간',
                content: '심신일체의 한의학적 이해',
                url: 'column.html#mind-body',
                category: 'column'
            },
            {
                title: '체질에 맞는 음식 선택하기',
                content: '개인 체질별 권장 식품과 주의사항',
                url: 'blog.html#constitution-food',
                category: 'blog'
            },
            {
                title: '두근거림 완화를 위한 호흡법',
                content: '마음 안정을 위한 호흡 실습법',
                url: 'blog.html#breathing',
                category: 'blog'
            }
        ];
        
        // Create search results container
        const searchContainer = searchInput.parentElement;
        const searchResults = document.createElement('div');
        searchResults.id = 'search-results';
        searchContainer.appendChild(searchResults);
        
        // Search function
        function performSearch(query) {
            if (query.length < 2) {
                searchResults.classList.remove('show');
                return;
            }
            
            const filteredResults = searchData.filter(item => 
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.content.toLowerCase().includes(query.toLowerCase())
            );
            
            if (filteredResults.length > 0) {
                searchResults.innerHTML = filteredResults.map(item => `
                    <div class="search-result-item" data-url="${item.url}">
                        <div class="font-medium text-sm text-warm-gray-900">${item.title}</div>
                        <div class="text-xs text-warm-gray-600 mt-1">${item.content}</div>
                        <div class="text-xs text-warm-gray-400 mt-1">${getCategoryName(item.category)}</div>
                    </div>
                `).join('');
                
                searchResults.classList.add('show');
                
                // Add click handlers to search results
                searchResults.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', function() {
                        window.location.href = this.dataset.url;
                    });
                });
            } else {
                searchResults.innerHTML = '<div class="search-result-item text-warm-gray-500">검색 결과가 없습니다.</div>';
                searchResults.classList.add('show');
            }
        }
        
        // Helper function to get category name in Korean
        function getCategoryName(category) {
            const categoryNames = {
                'treatment': '진료안내',
                'column': '삼촌의 한약 고찰',
                'blog': '블로그'
            };
            return categoryNames[category] || '';
        }
        
        // Search event listeners
        searchInput.addEventListener('input', function() {
            performSearch(this.value);
        });
        
        searchButton.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        // Enter key support
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
        
        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchContainer.contains(e.target)) {
                searchResults.classList.remove('show');
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to header
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // If image is already loaded (cached)
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
    
    // Add intersection observer for animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements that should animate in
        document.querySelectorAll('section > div > div').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // Add form validation if needed (for future contact forms)
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('border-red-500');
                
                // Remove error styling when user starts typing
                field.addEventListener('input', function() {
                    this.classList.remove('border-red-500');
                }, { once: true });
            }
        });
        
        return isValid;
    }
    
    // Accessibility enhancements
    document.addEventListener('keydown', function(e) {
        // Skip to main content with keyboard
        if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
            const main = document.querySelector('main');
            if (main) {
                main.focus();
                e.preventDefault();
            }
        }
    });
    
    // Add focus indicators for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: Lazy load images if needed
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Initialize lazy loading if there are images with data-src
document.addEventListener('DOMContentLoaded', function() {
    lazyLoadImages();
});