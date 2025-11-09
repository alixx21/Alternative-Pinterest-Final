
let currentTheme = 'light';
let userEmail = null;
let uploadedImage = null;

function showToast(message, duration = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) {
    const toastElement = document.createElement('div');
    toastElement.id = 'toast';
    toastElement.className = 'toast-message';
    document.body.appendChild(toastElement);
  }
  
  const toastEl = document.getElementById('toast');
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), duration);
}

function displayError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = message ? 'block' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    const gallery = document.querySelector('.gallery');
    function resizeGridItem(item) {
        if (!gallery) return;
        const galleryStyle = window.getComputedStyle(gallery);
        const rowHeight = parseInt(galleryStyle.getPropertyValue('grid-auto-rows'));
        const rowGap = parseInt(galleryStyle.getPropertyValue('grid-gap'));
        const img = item.querySelector('img');

        if (img && img.complete) {
            const itemHeight = img.getBoundingClientRect().height;
            const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
            item.style.gridRowEnd = 'span ' + rowSpan;
        } else if (img) {
            img.addEventListener('load', () => resizeGridItem(item));
        }
    }

    function resizeAllGridItems() {
        if (gallery) {
            gallery.querySelectorAll('.card').forEach(resizeGridItem);
        }
    }
    resizeAllGridItems();
    window.addEventListener('resize', resizeAllGridItems);

    function displayCurrentDateTime() {
        const dateTimeElement = document.getElementById('current-datetime');
        if (dateTimeElement) {
            const now = new Date();
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            };
            const formattedDate = now.toLocaleString('en-US', options);
            dateTimeElement.textContent = formattedDate;
        }
    }
    displayCurrentDateTime();
    setInterval(displayCurrentDateTime, 1000);

    const colorButton = document.getElementById('change-bg-btn');
    const body = document.body;

    function getRandomColor(darkMode = false) {
        if (darkMode) {
            const r = Math.floor(Math.random() * 50); 
            const g = Math.floor(Math.random() * 50);
            const b = Math.floor(Math.random() * 50);
            return `rgb(${r}, ${g}, ${b})`;
        } else {
            if (Math.random() < 0.2) return '#FFFFFF';
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
    }

    if (colorButton) {
        colorButton.addEventListener('click', () => {
            const isDarkMode = body.classList.contains('dark-mode');
            const randomColor = getRandomColor(isDarkMode);
            body.style.backgroundColor = randomColor;
        });
    }

    const toggleDarkModeBtn = document.getElementById('toggle-dark-mode-btn');

    function loadTheme() {
        try {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                currentTheme = 'dark';
                body.classList.add('dark-mode');
                if (toggleDarkModeBtn) {
                    toggleDarkModeBtn.textContent = 'Toggle Light Mode';
                }
            }
        } catch (e) {
        }
    }

    function toggleTheme() {
        body.classList.toggle('dark-mode');
        body.style.backgroundColor = '';

        if (body.classList.contains('dark-mode')) {
            currentTheme = 'dark';
            try {
                localStorage.setItem('theme', 'dark');
            } catch (e) {
            }
            if (toggleDarkModeBtn) {
                toggleDarkModeBtn.textContent = 'Toggle Light Mode';
            }
        } else {
            currentTheme = 'light';
            try {
                localStorage.setItem('theme', 'light');
            } catch (e) {
            }
            if (toggleDarkModeBtn) {
                toggleDarkModeBtn.textContent = 'Toggle Dark Mode';
            }
        }
    }

    loadTheme();
    if (toggleDarkModeBtn) {
        toggleDarkModeBtn.addEventListener('click', toggleTheme);
    }

    const openPopupBtn = document.getElementById('open-contact-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const modal = document.getElementById('contact-modal');
    const loginForm = document.querySelector('#contact-modal form');

    if (modal) {
        modal.style.display = 'none';
    }

    if (openPopupBtn && modal) {
        openPopupBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const emailInput = document.getElementById('sub-email');
            const enteredEmail = emailInput.value.trim();

            if (!enteredEmail) {
                showToast('⚠️ Please enter your email!');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(enteredEmail)) {
                showToast('⚠️ Please enter a valid email address!');
                return;
            }

            if (userEmail && enteredEmail === userEmail) {
                showToast(`👋 Welcome back, ${enteredEmail}!`);
            } else {
                userEmail = enteredEmail;
                showToast(`✅ Successfully Logged in as ${enteredEmail}`);
            }

            if (openPopupBtn) {
                openPopupBtn.outerHTML = `
                <a href="profile.html" title="Profile">
                    <img 
                        src="images/Profile.png" 
                        alt="User Avatar" 
                        id="user-avatar"
                        class="rounded-circle border"
                        style="width:30px; height:30px; cursor:pointer; object-fit:cover;"
                        title="Logged in as ${enteredEmail}"
                    >
                </a>
                `;
            }

            loginForm.reset();
            modal.style.display = 'none';
        });
    }

    if (closePopupBtn && modal) {
        closePopupBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            header.classList.toggle('active');
            if (header.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = "0";
            }
        });
    });

    const contactForm = document.getElementById('contact-form');
    function validateContactForm(e) {
        e.preventDefault();
        let isValid = true;

        document.querySelectorAll('#contact-form .text-danger').forEach(el => el.textContent = '');

        const name = document.getElementById('contact-name')?.value.trim();
        const email = document.getElementById('contact-email')?.value.trim();
        const message = document.getElementById('contact-message')?.value.trim();

        const MIN_MESSAGE_LENGTH = 10;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            displayError('contact-name', 'Name is required.');
            isValid = false;
        }

        if (!email) {
            displayError('contact-email', 'Email is required.');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            displayError('contact-email', 'Invalid email format.');
            isValid = false;
        }

        if (!message) {
            displayError('contact-message', 'Message is required.');
            isValid = false;
        } else if (message.length < MIN_MESSAGE_LENGTH) {
            displayError('contact-message', `Message must be at least ${MIN_MESSAGE_LENGTH} characters.`);
            isValid = false;
        }

        if (isValid) {
            showToast('✅ Message sent successfully!');
            e.target.reset();
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', validateContactForm);
    }

    const uploadForm = document.getElementById("upload-form");
    const fileInput = document.getElementById("fileInput");
    const preview = document.getElementById("preview");

    if (fileInput) {
        fileInput.addEventListener("change", () => {
            preview.innerHTML = "";
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadedImage = e.target.result;
                    const img = document.createElement("img");
                    img.src = uploadedImage;
                    img.style.maxWidth = "100%";
                    img.style.borderRadius = "12px";
                    img.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (uploadForm) {
        uploadForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;

            document.querySelectorAll('#upload-form .text-danger').forEach(el => el.textContent = '');

            const name = document.getElementById("uploader-name")?.value.trim();
            const email = document.getElementById("uploader-email")?.value.trim();
            const password = document.getElementById("uploader-password")?.value;
            const confirmPassword = document.getElementById("confirm-password")?.value;
            const title = document.getElementById("titleInput")?.value.trim();
            const desc = document.getElementById("descriptionTextarea")?.value.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name) {
                displayError('uploader-name', 'Name is required.');
                isValid = false;
            }

            if (!email) {
                displayError('uploader-email', 'Email is required.');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                displayError('uploader-email', 'Invalid email format.');
                isValid = false;
            }

            if (!password) {
                displayError('uploader-password', 'Password is required.');
                isValid = false;
            } else if (password.length < 8) {
                displayError('uploader-password', 'Password must be at least 8 characters.');
                isValid = false;
            }

            if (!confirmPassword) {
                displayError('confirm-password', 'Please confirm your password.');
                isValid = false;
            } else if (password !== confirmPassword) {
                displayError('confirm-password', 'Passwords do not match.');
                isValid = false;
            }

            if (!title) {
                displayError('titleInput', 'Title is required.');
                isValid = false;
            }

            if (!desc) {
                displayError('descriptionTextarea', 'Description is required.');
                isValid = false;
            }

            if (!uploadedImage) {
                displayError('fileInput', 'Please select an image.');
                isValid = false;
            }

            if (isValid) {
                showToast('✅ Photo uploaded successfully!');

                const photoGallery = document.getElementById("photo-gallery");
                if (photoGallery) {
                    const col = document.createElement("div");
                    col.classList.add("col-md-4", "col-sm-6", "col-12");
                    col.innerHTML = `
                        <div class="photo-card card h-100 shadow-sm">
                            <img class="card-img-top" src="${uploadedImage}" alt="${title}">
                            <div class="card-body p-2">
                                <h5 class="mt-2">${title}</h5>
                                <p class="card-text text-muted">${desc.substring(0, 50)}...</p>
                                <p class="card-text full-desc text-muted" style="display:none;">${desc}</p>
                                <button class="btn btn-link p-0 read-more-btn">Read More</button>
                            </div>
                        </div>
                    `;
                    photoGallery.prepend(col);
                }

                e.target.reset();
                uploadedImage = null;
                preview.innerHTML = "";
            }
        });
    }

    const navItems = document.querySelectorAll('.navbar-nav .nav-link');
    let currentNavIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        if (navItems.length === 0) return;

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            currentNavIndex = (currentNavIndex + 1) % navItems.length;
            navItems[currentNavIndex].focus();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            currentNavIndex = (currentNavIndex - 1 + navItems.length) % navItems.length;
            navItems[currentNavIndex].focus();
        }
    });

    function playClickSound() {
        try {
            const audio = new Audio('sound/click.wav');
            audio.volume = 0.3;
            audio.play();
        } catch (e) {}
    }

    const allButtons = document.querySelectorAll('button, .btn');
    allButtons.forEach(btn => {
        btn.addEventListener('click', playClickSound);
    });

    function filterPinsByCategory(category) {
        const profileCards = document.querySelectorAll('section.container .card[data-category], .container section .card[data-category], .card[data-category]');
        
        if (profileCards.length === 0) {
            return;
        }

        profileCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const shouldShow = (category === 'all') || (cardCategory === category);

            const parentCol = card.closest('[class*="col-"]');
            if (parentCol) {
                if (shouldShow) {
                    parentCol.classList.remove('filtered-hidden');
                    parentCol.style.height = '';
                    parentCol.style.minHeight = '';
                    parentCol.style.width = '';
                    parentCol.style.maxWidth = '';
                    parentCol.style.minWidth = '';
                    parentCol.style.flexBasis = '';
                    parentCol.style.marginTop = '';
                    parentCol.style.marginBottom = '';
                    parentCol.style.paddingTop = '';
                    parentCol.style.paddingBottom = '';
                    parentCol.style.overflow = '';
                    parentCol.style.opacity = '';
                    parentCol.style.transform = '';
                    card.style.animation = 'fadeInScale 0.4s ease-out';
                } else {
                    parentCol.classList.add('filtered-hidden');
                }
            } else {
                if (shouldShow) {
                    card.style.display = '';
                    card.style.visibility = '';
                    card.style.opacity = '';
                } else {
                    card.style.display = 'none';
                    card.style.visibility = 'hidden';
                    card.style.opacity = '0';
                }
            }
        });
    }

    const profileFilterButtons = document.querySelectorAll('[data-filter]');
    if (profileFilterButtons.length > 0) {
        profileFilterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const category = btn.getAttribute('data-filter');
                filterPinsByCategory(category);
                profileFilterButtons.forEach(b => {
                    b.classList.remove('active', 'btn-primary');
                    b.classList.add('btn-outline-primary');
                });
                btn.classList.remove('btn-outline-primary');
                btn.classList.add('btn-primary', 'active');
            });
        });
    }
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('read-more-btn')) {
            const cardBody = e.target.closest('.card-body');
            const shortDesc = cardBody.querySelector('.short-desc');
            const fullDesc = cardBody.querySelector('.full-desc');

            if (fullDesc.style.display === 'none' || fullDesc.style.display === '') {
                fullDesc.style.display = 'block';
                if (shortDesc) shortDesc.style.display = 'none';
                e.target.textContent = 'Read Less';
            } else {
                fullDesc.style.display = 'none';
                if (shortDesc) shortDesc.style.display = 'block';
                e.target.textContent = 'Read More';
            }
        }
    });
});


$(document).ready(function () {
    $('.search-bar').on('keyup', function() {
        const query = $(this).val().toLowerCase().trim();
        
        let searchSelectors;
        
        if (window.location.pathname.includes('profile.html') || window.location.href.includes('profile.html')) {
            searchSelectors = 'section.container .card[data-category], .container section .card[data-category], .row .card[data-category], #favorites-gallery .card';
        } else {
            searchSelectors = '.gallery .card';
        }
        
        if (query === '') {
            $(searchSelectors).removeClass('search-hidden');
            $('[class*="col-"].search-hidden').removeClass('search-hidden').show();
            return;
        }
        
        const categoryList = ['anime', 'football', 'nature', 'art', 'cars', 'tech', 'frontend'];
        const isCategorySearch = categoryList.includes(query);
        
        $(searchSelectors).each(function() {
            const card = $(this);
            const img = card.find('img');
            const category = card.attr('data-category') || img.attr('data-category') || '';
            let matches = false;
            
            if (isCategorySearch) {
                matches = category.toLowerCase() === query;
            } else {
                const cardText = card.text().toLowerCase();
                const imgAlt = (img.attr('alt') || '').toLowerCase();
                const title = (img.attr('data-title') || card.find('.card-title').text() || '').toLowerCase();
                const description = (img.attr('data-description') || card.find('.card-text').text() || '').toLowerCase();
                
                matches = cardText.includes(query) || 
                          imgAlt.includes(query) || 
                          title.includes(query) ||
                          description.includes(query) ||
                          category.toLowerCase().includes(query);
            }
            
            const parentCol = card.closest('[class*="col-"]');
            
            if (matches) {
                card.removeClass('search-hidden');
                if (parentCol.length) {
                    parentCol.removeClass('search-hidden').show();
                }
            } else {
                card.addClass('search-hidden');
                if (parentCol.length) {
                    parentCol.addClass('search-hidden').hide();
                } else {
                    card.hide();
                }
            }
        });
    });

$('.search-bar').on('keyup', async function() {
  const query = $(this).val().toLowerCase().trim();
  const gallery = $('#api-gallery');

  if (query === '') {
    gallery.empty();
    return;
  }

  const ACCESS_KEY = "aPDohcrWdTw7aoD4t5JCsV7We6t5TApXC6epz0nGS4Q";
  const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${ACCESS_KEY}&per_page=12`;
  const res = await fetch(url);
  const data = await res.json();

  gallery.empty();

  data.results.forEach(photo => {
    const col = $(`
      <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
        <div class="card shadow-sm h-100" data-category="${query}">
          <img src="${photo.urls.small}" class="card-img-top" alt="${photo.alt_description || query}">
          <div class="card-body">
            <h5 class="card-title">${photo.user.name}</h5>
<p class="card-text">
  ${truncateText(photo.description || photo.alt_description || 'No description available.', 32)}
</p>
          </div>
        </div>
      </div>
    `);
    gallery.append(col);
  });
});
function truncateText(text, limit) {
  if (!text) return '';
  return text.length > limit ? text.substring(0, limit) + '…' : text;
}



    const searchInput = $('.search-bar');
    const suggestionsBox = $('#suggestions');
    const items = [
        'Anime', 'Football', 'Nature', 'Art', 'Cars', 
        'Tech', 'Frontend', 'Technology',
        'Profile', 'Upload', 'About', 'Home'
    ];

    searchInput.on('keyup', function () {
        const query = $(this).val().toLowerCase();
        suggestionsBox.empty();

        if (query.length === 0) {
            suggestionsBox.hide();
            return;
        }

        const matches = items.filter(item => item.toLowerCase().includes(query));
        if (matches.length === 0) {
            suggestionsBox.hide();
            return;
        }

        matches.forEach(match => {
            suggestionsBox.append(`<li class="list-group-item suggestion-item">${match}</li>`);
        });

        suggestionsBox.show();
    });

    suggestionsBox.on('click', '.suggestion-item', function () {
        searchInput.val($(this).text());
        suggestionsBox.hide();
        searchInput.trigger('keyup');
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.autocomplete-container').length) {
            suggestionsBox.hide();
        }
    });

    const highlightInput = $('#highlight-search');
    let highlightTimeout;

    function removeHighlight() {
        $('.highlight-wrapper').each(function() {
            const text = $(this).text();
            $(this).replaceWith(text);
        });
        
        $('.accordion-header').each(function() {
            const header = $(this);
            const content = header.next('.accordion-content');
            
            if (header.hasClass('active')) {
                header.removeClass('active');
                content.css({
                    'max-height': '0',
                    'padding-top': '0',
                    'padding-bottom': '0'
                });
            }
        });
    }

    function highlightText(keyword) {
        if (!keyword || keyword.length < 2) {
            removeHighlight();
            return;
        }

        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedKeyword})`, 'gi');

        const targetSelectors = [
            '.accordion-content p',
            '.accordion-header h3',
            '.about-text',
            '.about-card p',
            '.card-text',
            '.card-title',
            'main h1, main h2, main h3, main h4',
            '.member h3',
            '.role',
            '.team-list li'
        ];

        let faqMatchesFound = false;

        $(targetSelectors.join(',')).each(function() {
            const element = $(this);
            
            if (element.find('.highlight-wrapper').length > 0) return;
            if (element.closest('nav, .navbar, #highlight-search').length > 0) return;
            
            let html = element.html();
            
            if (regex.test(html)) {
                const highlightedHtml = html.replace(regex, '<span class="highlight-wrapper">$1</span>');
                element.html(highlightedHtml);
                
                const accordionHeader = element.closest('.accordion-item').find('.accordion-header');
                const accordionContent = element.closest('.accordion-item').find('.accordion-content');
                
                if (accordionHeader.length > 0 || accordionContent.length > 0) {
                    faqMatchesFound = true;
                    
                    const header = element.closest('.accordion-item').find('.accordion-header').first();
                    const content = element.closest('.accordion-item').find('.accordion-content').first();
                    
                    if (header.length && content.length) {
                        if (!header.hasClass('active')) {
                            header.addClass('active');
                            const contentHeight = content[0].scrollHeight;
                            content.css({
                                'max-height': contentHeight + 'px',
                                'padding-top': '10px',
                                'padding-bottom': '15px'
                            });
                        }
                    }
                }
            }
        });

        const matchCount = $('.highlight-wrapper').length;
        if (matchCount > 0) {
            if (faqMatchesFound) {
                showToast(`🔍 Found ${matchCount} matches for "${keyword}" - FAQ sections opened!`);
            } else {
                showToast(`🔍 Found ${matchCount} matches for "${keyword}"`);
            }
        } else {
            showToast(`❌ No matches found for "${keyword}"`);
        }
    }

    if (highlightInput.length) {
        highlightInput.on('input', function() {
            clearTimeout(highlightTimeout);
            const keyword = $(this).val().trim();
            
            removeHighlight();
            
            if (keyword.length === 0) {
                $('.accordion-header').each(function() {
                    const header = $(this);
                    const content = header.next('.accordion-content');
                    
                    if (header.hasClass('active')) {
                        header.removeClass('active');
                        content.css({
                            'max-height': '0',
                            'padding-top': '0',
                            'padding-bottom': '0'
                        });
                    }
                });
                return;
            }

            highlightTimeout = setTimeout(function() {
                highlightText(keyword);
            }, 400);
        });
        
        highlightInput.on('keypress', function(e) {
            if (e.which === 13) {
                const keyword = $(this).val().trim();
                if (keyword.length === 0) {
                    removeHighlight();
                    showToast('🧹 Search cleared');
                }
            }
        });
    }

    $('#clear-highlight').on('click', function() {
        $('#highlight-search').val('');
        removeHighlight();
        showToast('🧹 Highlights cleared');
    });

    $(window).on('scroll', function () {
        const scrollTop = $(window).scrollTop();
        const docHeight = $(document).height() - $(window).height();
        const scrollPercent = (scrollTop / docHeight) * 100;
        $('#scroll-progress-bar').css('width', scrollPercent + '%');
    });

    const counters = $('.counter');
    const speed = 40;
    let countersStarted = false;

    function runCounters() {
        counters.each(function () {
            const counter = $(this);
            const target = +counter.attr('data-target');
            let count = 0;
            counter.css({opacity: 0, transform: 'scale(0.9)'}).animate({opacity: 1}, 600);
            
            const updateCount = () => {
                const increment = target / speed;
                if (count < target) {
                    count += increment;
                    counter.text(Math.ceil(count));
                    requestAnimationFrame(updateCount);
                } else {
                    counter.text(target);
                }
            };
            updateCount();
        });
    }

    $(window).on('scroll', function () {
        const section = $('.stats-section');
        if (!section.length || countersStarted) return;
        
        const sectionTop = section.offset().top;
        const scrollPos = $(window).scrollTop() + $(window).height();
        
        if (sectionTop < scrollPos) {
            runCounters();
            countersStarted = true;
        }
    });

    $('#copy-btn').on('click', function () {
        const text = $('#copy-text').text().trim();
        
        navigator.clipboard.writeText(text).then(() => {
            const btn = $('#copy-btn');
            const originalText = btn.text();
            
            btn.addClass('copied').text('✅ Copied!');
            showToast('📋 Copied to clipboard!');
            
            setTimeout(() => {
                btn.removeClass('copied').text(originalText);
            }, 2000);
        }).catch(err => {
            showToast('❌ Failed to copy');
        });
    });

    $('#copy-btn').css('color', '').text('📄 Copy Email');

    const lazyImages = $('.lazy-img');

    function lazyLoad() {
        lazyImages.each(function () {
            const img = $(this);
            
            const imgTop = img.offset().top;
            const imgBottom = imgTop + img.height();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (imgBottom > viewportTop - 200 && imgTop < viewportBottom + 200) {
                if (!img.attr('src') && img.data('src')) {
                    img.attr('src', img.data('src'));
                    
                    img.on('load', function () {
                        img.addClass('loaded');
                    });
                }
            }
        });
    }

    if (lazyImages.length) {
        $(window).on('scroll resize', lazyLoad);
        lazyLoad();
    }

    $(document).on('click', '.overlay button:has([alt="Избранное"]), .overlay button:has([alt="Favorite"])', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const btn = $(this);
        const card = btn.closest('.card');
        const img = card.find('img');
        
        if (!img.length || !card.length) {
            return false;
        }
        
        const imageSrc = img.attr('src') || img.data('src') || img.data('image') || '';
        const imageAlt = img.attr('alt') || img.data('title') || 'Untitled';
        
        if (!imageSrc) {
            showToast('❌ Error: Image source not found');
            return false;
        }
        
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        const wasFavorite = btn.hasClass('fav-active');
        
        btn.toggleClass('fav-active');
        
        const isNowFavorite = btn.hasClass('fav-active');
        const isAdding = isNowFavorite && !wasFavorite;
        
        if (isAdding) {
            let category = img.data('category') || img.attr('data-category') || card.attr('data-category') || 'general';
            
            if (category === 'general' && imageSrc) {
                const filename = imageSrc.toLowerCase();
                if (filename.includes('anime')) category = 'anime';
                else if (filename.includes('football')) category = 'football';
                else if (filename.includes('nature')) category = 'nature';
                else if (filename.includes('art')) category = 'art';
                else if (filename.includes('cars')) category = 'cars';
                else if (filename.includes('tech')) category = 'tech';
                else if (filename.includes('front')) category = 'frontend';
            }
            
            const hasAuthorData = img.data('author') || img.attr('data-author');
            const hasAuthorRole = img.data('author-role') || img.attr('data-author-role');
            const hasAuthorAvatar = img.data('author-avatar') || img.attr('data-author-avatar');
            const isFromFeaturedPins = hasAuthorData === 'Alikhan';
            
            let author, authorRole, authorAvatar;
            
            if (isFromFeaturedPins) {
                author = 'Alikhan';
                authorRole = 'Designer & UI';
                authorAvatar = 'images/rugd.jpg';
            } else if (hasAuthorData && hasAuthorRole && hasAuthorAvatar) {
                author = hasAuthorData;
                authorRole = hasAuthorRole;
                authorAvatar = hasAuthorAvatar;
            } else {
                const indexAuthors = [
                    { name: 'Sarah Johnson', role: 'Photographer', avatar: 'images/rugd.jpg' },
                    { name: 'Michael Chen', role: 'Digital Artist', avatar: 'images/rugd.jpg' },
                    { name: 'Emma Wilson', role: 'Graphic Designer', avatar: 'images/rugd.jpg' },
                    { name: 'David Martinez', role: 'Visual Artist', avatar: 'images/rugd.jpg' },
                    { name: 'Lisa Anderson', role: 'Creative Director', avatar: 'images/rugd.jpg' },
                    { name: 'James Brown', role: 'Illustrator', avatar: 'images/rugd.jpg' }
                ];
                const authorIndex = Math.floor(Math.random() * indexAuthors.length);
                const selectedAuthor = indexAuthors[authorIndex];
                author = selectedAuthor.name;
                authorRole = selectedAuthor.role;
                authorAvatar = selectedAuthor.avatar;
            }
            
            const imageData = {
                image: imageSrc,
                title: imageAlt || img.data('title') || 'Untitled',
                description: img.data('description') || '',
                author: author,
                authorRole: authorRole,
                authorAvatar: authorAvatar,
                category: category,
                dateAdded: new Date().toISOString(),
                source: isFromFeaturedPins ? 'featured-pins' : 'index'
            };
            
            const exists = favorites.some(fav => fav.image === imageSrc);
            
            if (!exists) {
                favorites.push(imageData);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                showToast('❤️ Added to favorites!');
            } else {
                showToast('❤️ Already in favorites!');
            }
        } else {
            favorites = favorites.filter(fav => fav.image !== imageSrc);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            showToast('💔 Removed from favorites');
        }
        return false;
    });

    $(document).on('click', '.overlay button:has([alt="Сохранить"]), .overlay button:has([alt="Save"])', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const btn = $(this);
        const card = btn.closest('.card');
        const img = card.find('img');
        const imageSrc = img.attr('src') || img.data('src') || '';
        
        if (imageSrc) {
            const link = document.createElement('a');
            link.href = imageSrc;
            link.download = imageSrc.split('/').pop() || 'image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('💾 Image download started!');
        } else {
        showToast('💾 Image saved!');
        }
        return false;
    });

    $(document).on('click', '.overlay button:has([alt="Поделиться"]), .overlay button:has([alt="Share"])', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const btn = $(this);
        const card = btn.closest('.card');
        const img = card.find('img');
        const imageSrc = img.attr('src') || img.data('src') || '';
        const imageAlt = img.attr('alt') || 'AsuStar Image';
        
        if (navigator.share) {
            navigator.share({
                title: imageAlt,
                text: 'Check out this image on AsuStar!',
                url: imageSrc || window.location.href
            }).then(() => {
                showToast('🔗 Shared successfully!');
            }).catch(() => {
                const shareUrl = imageSrc || window.location.href;
                navigator.clipboard.writeText(shareUrl).then(() => {
                    showToast('🔗 Link copied to clipboard!');
                }).catch(() => {
                    showToast('🔗 Link: ' + shareUrl);
                });
            });
        } else {
            const shareUrl = imageSrc || window.location.href;
            navigator.clipboard.writeText(shareUrl).then(() => {
                showToast('🔗 Link copied to clipboard!');
            }).catch(() => {
                showToast('🔗 Link: ' + shareUrl);
            });
        }
        return false;
    });

    $(document).on('click', '.btn-primary', function() {
        const btnText = $(this).text().trim();
        const btn = $(this);
        
        if (btn.closest('form').length === 0 && btnText !== 'Upload' && btnText !== 'Send' && btnText !== 'Log-in') {
            if (btnText === 'Follow') {
                if (btn.text() === 'Follow') {
                    btn.text('Following').removeClass('btn-primary').addClass('btn-success');
                    showToast('✅ Now following this user!');
                } else {
                    btn.text('Follow').removeClass('btn-success').addClass('btn-primary');
                    showToast('👋 Unfollowed this user');
                }
                return false;
            } else if (btnText === 'Message') {
                showToast('💬 Opening message dialog...');
                return false;
            } else if (btnText === 'Share') {
                if (navigator.share) {
                    navigator.share({
                        title: 'AsuStar Profile',
                        text: 'Check out this profile on AsuStar!',
                        url: window.location.href
                    }).catch(() => {
                        showToast('🔗 Profile link copied!');
                    });
                } else {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        showToast('🔗 Profile link copied to clipboard!');
                    }).catch(() => {
                        showToast('🔗 Link: ' + window.location.href);
                    });
                }
                return false;
            } else if (btnText === 'Customize') {
                const customizeBtn = btn;
                const imageData = {
                    title: customizeBtn.data('title') || 'Untitled',
                    description: customizeBtn.data('description') || '',
                    author: customizeBtn.data('author') || 'Alikhan',
                    authorRole: customizeBtn.data('author-role') || 'Designer & UI',
                    authorAvatar: customizeBtn.data('author-avatar') || 'images/rugd.jpg',
                    image: customizeBtn.data('image') || '',
                    category: customizeBtn.data('category') || 'general',
                    source: 'featured-pins'
                };
                
                localStorage.setItem('selectedImage', JSON.stringify(imageData));
                window.location.href = 'detail.html';
                return false;
            }
        }
    });

    $(document).on('click', '.clickable-image', function(e) {
        if ($(e.target).closest('.overlay, .overlay button').length > 0) {
            return;
        }
        
        e.preventDefault();
        const img = $(this);
        const imageSrc = img.attr('src') || img.data('src') || img.data('image') || '';
        
        const dataSource = img.data('source') || img.attr('data-source');
        const hasAuthorData = img.data('author') || img.attr('data-author');
        let source;
        
        if (dataSource) {
            source = dataSource;
        } else {
            const isFromFeaturedPins = hasAuthorData === 'Alikhan';
            source = isFromFeaturedPins ? 'featured-pins' : 'index';
        }
        
        let imageData = {
            title: img.data('title') || img.attr('alt') || 'Untitled',
            description: img.data('description') || '',
            author: img.data('author') || 'Alikhan',
            authorRole: img.data('author-role') || 'Designer & UI',
            authorAvatar: img.data('author-avatar') || 'images/rugd.jpg',
            image: imageSrc,
            category: img.data('category') || 'general',
            source: source
        };
        
        if (!imageData.image && img.data('src')) {
            imageData.image = img.data('src');
        }
        
        try {
            const editedImages = JSON.parse(localStorage.getItem('editedImages') || '{}');
            if (editedImages[imageData.image]) {
                imageData = { ...imageData, ...editedImages[imageData.image] };
            }
        } catch (e) {}
        
        localStorage.setItem('selectedImage', JSON.stringify(imageData));
        window.location.href = 'detail.html';
    });

    $(document).on('click', '.customize-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const btn = $(this);
        const img = btn.closest('.card').find('.clickable-image');
        
        const imageSrc = img.attr('src') || img.data('src') || img.data('image') || btn.data('image') || '';
        
        let imageData = {
            title: btn.data('title') || img.data('title') || 'Untitled',
            description: btn.data('description') || img.data('description') || '',
            author: btn.data('author') || img.data('author') || 'Alikhan',
            authorRole: btn.data('author-role') || img.data('author-role') || 'Designer & UI',
            authorAvatar: btn.data('author-avatar') || img.data('author-avatar') || 'images/rugd.jpg',
            image: imageSrc,
            category: btn.data('category') || img.data('category') || 'general',
            source: 'featured-pins'
        };
        
        try {
            const editedImages = JSON.parse(localStorage.getItem('editedImages') || '{}');
            if (editedImages[imageSrc]) {
                imageData = { ...imageData, ...editedImages[imageSrc] };
            }
        } catch (e) {}
        
        localStorage.setItem('selectedImage', JSON.stringify(imageData));
        window.location.href = 'detail.html';
        return false;
    });
    
    function updatePageWithEditedImages() {
        try {
            const editedImages = JSON.parse(localStorage.getItem('editedImages') || '{}');
            
            $('.clickable-image').each(function() {
                const img = $(this);
                const imageSrc = img.attr('src') || img.data('src') || img.data('image') || img.attr('data-image');
                
                if (!imageSrc) return;
                
                if (editedImages[imageSrc]) {
                    const editedData = editedImages[imageSrc];
                    
                    if (editedData.title) {
                        img.data('title', editedData.title);
                        img.attr('alt', editedData.title);
                    }
                    if (editedData.description) img.data('description', editedData.description);
                    if (editedData.author) img.data('author', editedData.author);
                    if (editedData.authorRole) img.data('author-role', editedData.authorRole);
                    if (editedData.category) img.data('category', editedData.category);
                    
                    const card = img.closest('.card');
                    if (card.length) {
                        const cardTitle = card.find('.card-title');
                        const cardText = card.find('.card-text');
                        
                        if (cardTitle.length && editedData.title) {
                            cardTitle.text(editedData.title);
                        }
                        if (cardText.length && editedData.description) {
                            cardText.text(editedData.description);
                        }
                    }
                }
            });
        } catch (e) {}
    }
    
    updatePageWithEditedImages();
    
    function markFavoriteButtons() {
        try {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            const favoriteImages = favorites.map(fav => fav.image);
            
            $('.card').each(function() {
                const card = $(this);
                const img = card.find('img');
                const imageSrc = img.attr('src') || img.data('src') || img.data('image') || '';
                const favBtn = card.find('.overlay button:has([alt="Избранное"]), .overlay button:has([alt="Favorite"])');
                const isFavorite = favoriteImages.includes(imageSrc);
                
                if (isFavorite && favBtn.length) {
                    favBtn.addClass('fav-active');
                }
            });
        } catch (e) {}
    }
    
    markFavoriteButtons();
    
    const isProfilePage = window.location.pathname.includes('profile.html') || 
                         window.location.href.includes('profile.html') ||
                         window.location.pathname.endsWith('/profile.html') ||
                         document.title.includes('Profile');
    
    if (isProfilePage) {
        function loadFavorites() {
            try {
                const favoritesData = localStorage.getItem('favorites');
                
                const favorites = JSON.parse(favoritesData || '[]');
                
                const favoritesGallery = $('#favorites-gallery');
                const noFavorites = $('#no-favorites');
                
                if (favoritesGallery.length === 0) {
                    return;
                }
                
                favoritesGallery.empty();
                
                if (favorites.length === 0) {
                        if (noFavorites.length) noFavorites.show();
                    return;
                }
                
                if (noFavorites.length) noFavorites.hide();
                
                const favoriteAuthors = [
                    { name: 'Sarah Johnson', role: 'Photographer', avatar: 'images/rugd.jpg' },
                    { name: 'Michael Chen', role: 'Digital Artist', avatar: 'images/rugd.jpg' },
                    { name: 'Emma Wilson', role: 'Graphic Designer', avatar: 'images/rugd.jpg' },
                    { name: 'David Martinez', role: 'Visual Artist', avatar: 'images/rugd.jpg' },
                    { name: 'Lisa Anderson', role: 'Creative Director', avatar: 'images/rugd.jpg' },
                    { name: 'James Brown', role: 'Illustrator', avatar: 'images/rugd.jpg' },
                    { name: 'Olivia Taylor', role: 'Photo Editor', avatar: 'images/rugd.jpg' },
                    { name: 'Robert Lee', role: 'UI/UX Designer', avatar: 'images/rugd.jpg' }
                ];
                
                favorites.forEach(function(fav, index) {
                    const col = $('<div></div>').addClass('col-lg-4 col-md-6 col-sm-12 mb-4');
                    const card = $('<div></div>').addClass('card h-100 shadow-sm').attr('data-category', fav.category || 'general');
                    
                    let favoriteAuthor, favoriteRole, favoriteAvatar;
                    
                    if (fav.author === 'Alikhan') {
                        favoriteAuthor = 'Alikhan';
                        favoriteRole = 'Designer & UI';
                        favoriteAvatar = 'images/rugd.jpg';
                    } else if (fav.author) {
                        favoriteAuthor = fav.author;
                        favoriteRole = fav.authorRole || 'Photographer';
                        favoriteAvatar = fav.authorAvatar || 'images/rugd.jpg';
                    } else {
                        const selectedAuthor = favoriteAuthors[index % favoriteAuthors.length];
                        favoriteAuthor = selectedAuthor.name;
                        favoriteRole = selectedAuthor.role;
                        favoriteAvatar = selectedAuthor.avatar;
                    }
                    
                    const img = $('<img>')
                        .addClass('card-img-top clickable-image favorites-image')
                        .attr('src', fav.image)
                        .attr('data-src', fav.image)
                        .attr('alt', fav.title)
                        .attr('data-title', fav.title)
                        .attr('data-description', fav.description || '')
                        .attr('data-author', favoriteAuthor)
                        .attr('data-author-role', favoriteRole)
                        .attr('data-author-avatar', favoriteAvatar)
                        .attr('data-image', fav.image)
                        .attr('data-category', fav.category || 'general')
                        .attr('data-source', fav.source || (fav.author === 'Alikhan' ? 'featured-pins' : 'index'))
                        .css({
                            'cursor': 'pointer',
                            'width': '100%',
                            'height': '250px',
                            'object-fit': 'cover',
                            'object-position': 'center'
                        })
                        .on('load', function() {
                            $(this).addClass('loaded');
                        });
                    
                    const cardBody = $('<div></div>').addClass('card-body');
                    cardBody.append($('<h3></h3>').addClass('card-title').text(fav.title));
                    if (fav.description) {
                        cardBody.append($('<p></p>').addClass('card-text').text(fav.description));
                    }
                    const authorInfo = $('<div></div>').addClass('author-info');
                    authorInfo.append($('<span></span>').text('By ' + favoriteAuthor));
                    cardBody.append(authorInfo);
                    
                    const overlay = $('<div></div>').addClass('overlay');
                    const favBtn = $('<button></button>')
                        .addClass('btn btn-sm btn-light border fav-active remove-fav-btn')
                        .attr('data-image', fav.image)
                        .html('<img src="images/Fav.png" alt="Избранное">');
                    
                    favBtn.on('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const imageSrc = $(this).attr('data-image');
                        
                        try {
                            let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                            favorites = favorites.filter(fav => fav.image !== imageSrc);
                            localStorage.setItem('favorites', JSON.stringify(favorites));
                            
                            showToast('💔 Removed from favorites');
                            
                            loadFavorites();
                        } catch (err) {
                            showToast('❌ Error removing from favorites');
                        }
                        
                        return false;
                    });
                    
                    overlay.append(favBtn);
                    overlay.append($('<button></button>')
                        .addClass('btn btn-sm btn-light border')
                        .html('<img src="images/Download.png" alt="Сохранить">'));
                    overlay.append($('<button></button>')
                        .addClass('btn btn-sm btn-light border')
                        .html('<img src="images/Share.png" alt="Поделиться">'));
                    
                    card.append(img);
                    card.append(overlay);
                    card.append(cardBody);
                    col.append(card);
                    favoritesGallery.append(col);
                });
            } catch (e) {}
        }
        
        window.loadFavorites = loadFavorites;
        
        function updateProfileCards() {
            try {
                const editedImages = JSON.parse(localStorage.getItem('editedImages') || '{}');
                
                $('.clickable-image').each(function() {
                    const img = $(this);
                    const imageSrc = img.attr('src') || img.data('src') || img.data('image') || img.attr('data-image');
                    
                    if (!imageSrc) return;
                    
                    if (editedImages[imageSrc]) {
                        const editedData = editedImages[imageSrc];
                    
                    if (editedData.title) {
                            img.data('title', editedData.title);
                            img.attr('alt', editedData.title);
                        }
                        if (editedData.description) {
                            img.data('description', editedData.description);
                        }
                        if (editedData.author) {
                            img.data('author', editedData.author);
                        }
                        if (editedData.authorRole) {
                            img.data('author-role', editedData.authorRole);
                        }
                        if (editedData.category) {
                            img.data('category', editedData.category);
                    }
                    
                    const card = img.closest('.card');
                        if (card.length) {
                            const cardTitle = card.find('.card-title');
                            const cardText = card.find('.card-text');
                            
                            if (cardTitle.length && editedData.title) {
                                cardTitle.text(editedData.title);
                            }
                        if (cardText.length && editedData.description) {
                            cardText.text(editedData.description);
                        }
                        
                        const customizeBtn = card.find('.customize-btn');
                            if (customizeBtn.length) {
                                if (editedData.title) customizeBtn.data('title', editedData.title);
                                if (editedData.description) customizeBtn.data('description', editedData.description);
                                if (editedData.author) customizeBtn.data('author', editedData.author);
                                if (editedData.authorRole) customizeBtn.data('author-role', editedData.authorRole);
                                if (editedData.category) customizeBtn.data('category', editedData.category);
                            }
                        }
                    }
                });
            } catch (e) {}
        }
        
        $(document).ready(function() {
            updateProfileCards();
            loadFavorites();
        });
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                updateProfileCards();
                loadFavorites();
            });
        } else {
            setTimeout(function() {
                updateProfileCards();
                loadFavorites();
            }, 100);
        }
        
        window.addEventListener('storage', function(e) {
            if (e.key === 'favorites') {
                loadFavorites();
            } else if (e.key === 'editedImages') {
                updateProfileCards();
            }
        });
        
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                updateProfileCards();
                loadFavorites();
            }
        });
        
        window.addEventListener('focus', function() {
            updateProfileCards();
            loadFavorites();
        });
    }
    
    if (window.location.pathname.includes('detail.html') || window.location.href.includes('detail.html')) {
        let currentImageData = {};
        
        function initDetailPage() {
            const urlParams = new URLSearchParams(window.location.search);
            currentImageData = urlParams.get('data') 
                ? JSON.parse(decodeURIComponent(urlParams.get('data')))
                : JSON.parse(localStorage.getItem('selectedImage') || '{}');
            
            if (currentImageData.title) {
                const titleEl = document.getElementById('detail-title');
                const descEl = document.getElementById('detail-description');
                const imgEl = document.getElementById('detail-image');
                const authorNameEl = document.getElementById('detail-author-name');
                const authorRoleEl = document.getElementById('detail-author-role');
                const authorAvatarEl = document.getElementById('detail-author-avatar');
                const categoryEl = document.getElementById('detail-category');
                
                if (titleEl) titleEl.textContent = currentImageData.title;
                if (descEl) descEl.textContent = currentImageData.description || 'No description available.';
                if (imgEl) {
                    imgEl.src = currentImageData.image || currentImageData.imageSrc || '';
                    imgEl.alt = currentImageData.title;
                }
                if (authorNameEl) authorNameEl.textContent = currentImageData.author || 'Alikhan';
                if (authorRoleEl) authorRoleEl.textContent = currentImageData.authorRole || 'Designer & UI';
                if (authorAvatarEl) authorAvatarEl.src = currentImageData.authorAvatar || 'images/rugd.jpg';
                if (categoryEl) categoryEl.textContent = (currentImageData.category || 'General').charAt(0).toUpperCase() + (currentImageData.category || 'General').slice(1);
                
                const customizeBtn = document.getElementById('detail-customize-btn');
                if (customizeBtn) {
                    const source = currentImageData.source;
                    const author = currentImageData.author || 'Alikhan';
                    const isFromIndex = source === 'index' || (source !== 'featured-pins' && author !== 'Alikhan');
                    
                    if (isFromIndex) {
                        customizeBtn.style.display = 'none';
                    } else {
                        customizeBtn.style.display = 'block';
                    }
                }
                
                if (currentImageData.tags && currentImageData.tags.trim()) {
                    const tagsContainer = document.getElementById('tags-container');
                    const tagsElement = document.getElementById('detail-tags');
                    const tags = currentImageData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
                    if (tags.length > 0 && tagsContainer && tagsElement) {
                        tagsContainer.style.display = 'block';
                        tagsElement.innerHTML = tags.map(tag => 
                            `<span class="badge bg-secondary me-1 mb-1">${tag}</span>`
                        ).join('');
                    }
                }
                
                const date = new Date();
                const dateElement = document.getElementById('detail-date');
                if (dateElement) {
                    dateElement.textContent = date.toLocaleDateString();
                }
                
                document.title = currentImageData.title + ' – AsuStar';
            } else {
                window.location.href = 'index.html';
                return;
            }
            
            setupDetailButtons();
        }
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDetailPage);
        } else {
            initDetailPage();
        }
        
        function setupDetailButtons() {
            const favBtn = document.getElementById('detail-fav-btn');
            if (favBtn) {
                try {
                    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                    const isInFavorites = favorites.some(fav => fav.image === currentImageData.image);
                    if (isInFavorites) {
                        favBtn.classList.add('active', 'btn-danger');
                        favBtn.classList.remove('btn-outline-danger');
                        favBtn.innerHTML = '<img src="images/Fav.png" alt="Favorite" style="width: 20px; height: 20px;"><span class="ms-2">In Favorites</span>';
                    }
                    } catch (e) {}
                
                favBtn.addEventListener('click', function() {
                    const isFav = favBtn.classList.contains('active');
                    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                    
                    if (isFav) {
                        favorites = favorites.filter(fav => fav.image !== currentImageData.image);
                        localStorage.setItem('favorites', JSON.stringify(favorites));
                        favBtn.classList.remove('active', 'btn-danger');
                        favBtn.classList.add('btn-outline-danger');
                        favBtn.innerHTML = '<img src="images/Fav.png" alt="Favorite" style="width: 20px; height: 20px;"><span class="ms-2">Add to Favorites</span>';
                        showToast('💔 Removed from favorites');
                    } else {
                        const imageData = {
                            image: currentImageData.image || '',
                            title: currentImageData.title || 'Untitled',
                            description: currentImageData.description || '',
                            author: currentImageData.author || 'Alikhan',
                            authorRole: currentImageData.authorRole || 'Designer & UI',
                            authorAvatar: currentImageData.authorAvatar || 'images/rugd.jpg',
                            category: currentImageData.category || 'general',
                            dateAdded: new Date().toISOString()
                        };
                        
                        const exists = favorites.some(fav => fav.image === imageData.image);
                        if (!exists) {
                            favorites.push(imageData);
                            localStorage.setItem('favorites', JSON.stringify(favorites));
                            favBtn.classList.add('active', 'btn-danger');
                            favBtn.classList.remove('btn-outline-danger');
                            favBtn.innerHTML = '<img src="images/Fav.png" alt="Favorite" style="width: 20px; height: 20px;"><span class="ms-2">In Favorites</span>';
                            showToast('❤️ Added to favorites!');
                        } else {
                            showToast('❤️ Already in favorites!');
                        }
                    }
                });
            }
            
            const downloadBtn = document.getElementById('detail-download-btn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', function() {
                    const img = document.getElementById('detail-image');
                    const link = document.createElement('a');
                    link.href = img.src;
                    link.download = currentImageData.title.replace(/\s+/g, '-') + '.jpg';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showToast('💾 Image download started!');
                });
            }
            
            const shareBtn = document.getElementById('detail-share-btn');
            if (shareBtn) {
                shareBtn.addEventListener('click', function() {
                    if (navigator.share) {
                        navigator.share({
                            title: currentImageData.title,
                            text: currentImageData.description,
                            url: window.location.href
                        }).then(() => {
                            showToast('🔗 Shared successfully!');
                        }).catch(() => {
                            copyToClipboard();
                        });
                    } else {
                        copyToClipboard();
                    }
                });
            }
            
            setupCustomizeModal();
        }
        
        function setupCustomizeModal() {
            const customizeModal = document.getElementById('customizeModal');
            const customizeBtn = document.getElementById('detail-customize-btn');
            const saveBtn = document.getElementById('save-customize-btn');
            const customizeForm = document.getElementById('customize-form');
            
            if (customizeModal) {
                customizeModal.addEventListener('show.bs.modal', function() {
                    const titleInput = document.getElementById('customize-title');
                    const descInput = document.getElementById('customize-description');
                    const authorInput = document.getElementById('customize-author');
                    const roleInput = document.getElementById('customize-author-role');
                    const categorySelect = document.getElementById('customize-category');
                    const tagsInput = document.getElementById('customize-tags');
                    
                    if (titleInput) titleInput.value = currentImageData.title || '';
                    if (descInput) descInput.value = currentImageData.description || '';
                    if (authorInput) authorInput.value = currentImageData.author || '';
                    if (roleInput) roleInput.value = currentImageData.authorRole || '';
                    if (categorySelect) categorySelect.value = currentImageData.category || 'general';
                    if (tagsInput) tagsInput.value = currentImageData.tags || '';
                });
            }
            
            if (saveBtn && customizeForm) {
                saveBtn.addEventListener('click', function() {
                    const titleInput = document.getElementById('customize-title');
                    const title = titleInput ? titleInput.value.trim() : '';
                    
                    if (!title) {
                        showToast('⚠️ Title is required!');
                        return;
                    }
                    
                    currentImageData.title = title;
                    const descInput = document.getElementById('customize-description');
                    const authorInput = document.getElementById('customize-author');
                    const roleInput = document.getElementById('customize-author-role');
                    const categorySelect = document.getElementById('customize-category');
                    const tagsInput = document.getElementById('customize-tags');
                    
                    if (descInput) currentImageData.description = descInput.value.trim();
                    if (authorInput) currentImageData.author = authorInput.value.trim() || currentImageData.author;
                    if (roleInput) currentImageData.authorRole = roleInput.value.trim() || currentImageData.authorRole;
                    if (categorySelect) currentImageData.category = categorySelect.value;
                    if (tagsInput) currentImageData.tags = tagsInput.value.trim();
                    
                    const imageKey = currentImageData.image || '';
                    
                    if (!imageKey) {
                        showToast('❌ Error: Image source not found');
                        return;
                    }
                    
                    saveEditedImage(imageKey, currentImageData);
                    updateDetailPage();
                    localStorage.setItem('selectedImage', JSON.stringify(currentImageData));
                    
                    const modalInstance = bootstrap.Modal.getInstance(customizeModal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                    
                    showToast('✅ Changes saved successfully!');
                });
            }
        }
        
        function updateDetailPage() {
            const titleElement = document.getElementById('detail-title');
            const descElement = document.getElementById('detail-description');
            const authorNameElement = document.getElementById('detail-author-name');
            const authorRoleElement = document.getElementById('detail-author-role');
            const categoryElement = document.getElementById('detail-category');
            const tagsContainer = document.getElementById('tags-container');
            const tagsElement = document.getElementById('detail-tags');
            
            if (currentImageData.title && titleElement) {
                titleElement.textContent = currentImageData.title;
                document.title = currentImageData.title + ' – AsuStar';
            }
            
            if (currentImageData.description && descElement) {
                descElement.textContent = currentImageData.description;
            }
            
            if (currentImageData.author && authorNameElement) {
                authorNameElement.textContent = currentImageData.author;
            }
            
            if (currentImageData.authorRole && authorRoleElement) {
                authorRoleElement.textContent = currentImageData.authorRole;
            }
            
            if (currentImageData.category && categoryElement) {
                const categoryText = currentImageData.category.charAt(0).toUpperCase() + currentImageData.category.slice(1);
                categoryElement.textContent = categoryText;
            }
            
            if (currentImageData.tags && currentImageData.tags.trim() && tagsContainer && tagsElement) {
                const tags = currentImageData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
                if (tags.length > 0) {
                    tagsContainer.style.display = 'block';
                    tagsElement.innerHTML = tags.map(tag => 
                        `<span class="badge bg-secondary me-1 mb-1">${tag}</span>`
                    ).join('');
                } else {
                    tagsContainer.style.display = 'none';
                }
            } else if (tagsContainer) {
                tagsContainer.style.display = 'none';
            }
        }
        
        function copyToClipboard() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('🔗 Link copied to clipboard!');
            }).catch(() => {
                showToast('🔗 Link: ' + window.location.href);
            });
        }
        
        function saveEditedImage(imageKey, imageData) {
            try {
                if (!imageKey) return;
                
                const editedImages = JSON.parse(localStorage.getItem('editedImages') || '{}');
                editedImages[imageKey] = imageData;
                localStorage.setItem('editedImages', JSON.stringify(editedImages));
            } catch (e) {}
        }
        
        window.currentImageData = currentImageData;
        window.setupDetailButtons = setupDetailButtons;
        window.updateDetailPage = updateDetailPage;
        window.copyToClipboard = copyToClipboard;
        window.saveEditedImage = saveEditedImage;
    }




});