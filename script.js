document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. DATE CONFIGURATION & LOVE COUNTER
    // ==========================================
    // Setting relationship start date: October 15, 2025 at 00:00:00
    const startDate = new Date('2025-10-15T00:00:00');
    
    const countDays = document.getElementById('count-days');
    const countHours = document.getElementById('count-hours');
    const countMinutes = document.getElementById('count-minutes');
    const countSeconds = document.getElementById('count-seconds');

    function updateCounter() {
        const now = new Date();
        const diff = now - startDate;

        if (diff < 0) {
            // In case the start date is in the future (fallback)
            countDays.textContent = '00';
            countHours.textContent = '00';
            countMinutes.textContent = '00';
            countSeconds.textContent = '00';
            return;
        }

        // Calculate time units
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Format to 2 digits
        countDays.textContent = String(days).padStart(2, '0');
        countHours.textContent = String(hours).padStart(2, '0');
        countMinutes.textContent = String(minutes).padStart(2, '0');
        countSeconds.textContent = String(seconds).padStart(2, '0');
    }

    // Run immediately and update every second
    updateCounter();
    setInterval(updateCounter, 1000);


    // ==========================================
    // 2. CANVAS FLOATING HEARTS SYSTEM
    // ==========================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    const maxParticles = 30; // Limit for performance & clean visuals

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class CelestialParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 50;
            this.size = Math.random() * 12 + 6;
            this.speedX = Math.random() * 1.2 - 0.6;
            this.speedY = -(Math.random() * 1.2 + 0.4);
            this.opacity = Math.random() * 0.45 + 0.15;
            this.isStar = Math.random() > 0.4;
            // Palette: cyan, periwinkle, starlight gold, sapphire
            const colors = [
                '56, 189, 248',  // Cyan starlight
                '129, 140, 248', // Periwinkle
                '250, 204, 21',  // Moonlight gold
                '96, 165, 250'   // Sapphire
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.y < -this.size || this.x < -this.size || this.x > canvas.width + this.size) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `rgba(${this.color}, 0.5)`;
            const x = this.x;
            const y = this.y;
            const size = this.size;

            if (this.isStar) {
                // 4-point twinkling star
                ctx.beginPath();
                ctx.moveTo(x, y - size);
                ctx.quadraticCurveTo(x, y, x + size, y);
                ctx.quadraticCurveTo(x, y, x, y + size);
                ctx.quadraticCurveTo(x, y, x - size, y);
                ctx.quadraticCurveTo(x, y, x, y - size);
                ctx.closePath();
                ctx.fill();
            } else {
                // Celestial heart
                ctx.beginPath();
                ctx.moveTo(x, y - size / 4);
                ctx.bezierCurveTo(x - size/2, y - size, x - size, y - size/3, x, y + size/2);
                ctx.bezierCurveTo(x + size, y - size/3, x + size/2, y - size, x, y - size/4);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Initialize particles
    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < maxParticles; i++) {
            particlesArray.push(new CelestialParticle());
        }
    }
    initParticles();

    // Loop animation
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // ==========================================
    // 3. MUSIC PLAYER CONTROL
    // ==========================================
    const musicController = document.getElementById('music-controller');
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    const playIcon = musicBtn.querySelector('.play-icon');
    const pauseIcon = musicBtn.querySelector('.pause-icon');

    // Reduce volume slightly to make it non-intrusive
    bgMusic.volume = 0.35;

    // Helper to start playing audio and update UI state
    function playAudio() {
        bgMusic.play().then(() => {
            musicBtn.classList.add('playing');
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            removeAutoplayTriggers();
        }).catch(err => {
            console.log("Autoplay waiting for user interaction.", err);
        });
    }

    // Attempt autoplay immediately
    playAudio();

    // Workaround: trigger play on first user interaction anywhere on the document
    const autoplayTriggers = ['click', 'touchstart', 'scroll', 'keydown'];
    function triggerAutoplay() {
        playAudio();
    }
    
    autoplayTriggers.forEach(trigger => {
        document.addEventListener(trigger, triggerAutoplay, { once: true, passive: true });
    });

    function removeAutoplayTriggers() {
        autoplayTriggers.forEach(trigger => {
            document.removeEventListener(trigger, triggerAutoplay);
        });
    }

    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop propagation to avoid document trigger
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicBtn.classList.add('playing');
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            }).catch(err => {
                console.log("Audio play blocked by browser. User interaction needed first.", err);
            });
        } else {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    });


    // ==========================================
    // 4. INTERACTIVE 3D ENVELOPE (LOVE LETTER)
    // ==========================================
    const envelope = document.getElementById('envelope');
    const envelopeHeartsContainer = document.getElementById('envelope-hearts');

    envelope.addEventListener('click', function(e) {
        // Stop propagating if they are clicking scrollbar inside letter
        if (e.target.closest('.letter-inner')) {
            return;
        }

        const isOpen = this.classList.toggle('open');

        if (isOpen) {
            // Trigger 12 burst heart elements
            for (let i = 0; i < 12; i++) {
                createEnvHeart();
            }
        }
    });

    function createEnvHeart() {
        const heartEl = document.createElement('div');
        heartEl.className = 'env-heart';
        const celestialEmojis = ['💙', '✨', '⭐', '💫', '🌙'];
        heartEl.innerHTML = celestialEmojis[Math.floor(Math.random() * celestialEmojis.length)];
        
        // Random horizontal travel range (-80px to 80px)
        const randX = (Math.random() * 160 - 80) + 'px';
        // Random rotation (-30deg to 30deg)
        const randR = (Math.random() * 60 - 30) + 'deg';
        // Random size
        const randSize = (Math.random() * 10 + 12) + 'px';
        
        heartEl.style.setProperty('--x', randX);
        heartEl.style.setProperty('--r', randR);
        heartEl.style.fontSize = randSize;
        
        // Position at center of envelope
        heartEl.style.left = '50%';
        heartEl.style.top = '50%';

        envelopeHeartsContainer.appendChild(heartEl);

        // Remove element after animation completes
        setTimeout(() => {
            heartEl.remove();
        }, 2000);
    }


    // ==========================================
    // 5. SCROLL FADE-IN ANIMATION OBSERVER
    // ==========================================
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });


    // ==========================================
    // 6. MEMORY BANK (Supabase-backed Calendar)
    // ==========================================

    // --- Supabase Configuration (reads from env.js or .env if available) ---
    const envConfig = window.__ENV__ || {};
    const SUPABASE_URL = envConfig.SUPABASE_URL || 'https://unwkuwipxkezilwotkdy.supabase.co';
    const SUPABASE_ANON_KEY = envConfig.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud2t1d2lweGtlemlsd290a2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1Mjc1NjUsImV4cCI6MjA5NzEwMzU2NX0.7JeOKbF95S-T5pjD1DFZCcfX8VzigGUAcTR5FE2SpUQ';
    const STORAGE_BUCKET = envConfig.STORAGE_BUCKET || 'memories';

    let supabase = null;
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase connected');
    } catch (err) {
        console.warn('⚠️ Supabase not available, using localStorage fallback', err);
    }

    // --- DOM Elements ---
    const calGrid = document.getElementById('cal-grid');
    const calMonthLabel = document.getElementById('cal-month-label');
    const calPrev = document.getElementById('cal-prev');
    const calNext = document.getElementById('cal-next');
    const modalOverlay = document.getElementById('memory-modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDateLabel = document.getElementById('modal-date-label');
    const modalUploadState = document.getElementById('modal-upload-state');
    const modalViewState = document.getElementById('modal-view-state');
    const modalPhoto = document.getElementById('modal-photo');
    const modalReplaceBtn = document.getElementById('modal-replace-btn');
    const modalDeleteBtn = document.getElementById('modal-delete-btn');
    const uploadDropzone = document.getElementById('upload-dropzone');
    const memoryFileInput = document.getElementById('memory-file-input');
    const statTotalEl = document.getElementById('stat-total');
    const statStreakEl = document.getElementById('stat-streak');

    // Relationship start date
    const relationshipStart = new Date('2025-10-15');

    // Current calendar view month (start at current month)
    let currentCalMonth = new Date().getMonth();
    let currentCalYear = new Date().getFullYear();
    let selectedDate = null;

    // In-memory cache of photos: { 'YYYY-MM-DD': 'https://...' }
    let photosCache = {};

    // --- Supabase Data Layer ---

    // Load all photos from Supabase DB
    async function loadPhotosFromSupabase() {
        if (!supabase) return loadPhotosFromLocalStorage();

        try {
            const { data, error } = await supabase
                .from('memories')
                .select('date_key, photo_path');

            if (error) throw error;

            const photos = {};
            const loadTime = Date.now(); // Cache buster
            data.forEach(row => {
                // Build the public URL from the storage path
                const { data: urlData } = supabase.storage
                    .from(STORAGE_BUCKET)
                    .getPublicUrl(row.photo_path);
                photos[row.date_key] = urlData.publicUrl + '?t=' + loadTime;
            });

            return photos;
        } catch (err) {
            console.warn('Failed to load from Supabase, falling back to localStorage', err);
            return loadPhotosFromLocalStorage();
        }
    }

    // Upload photo to Supabase Storage + save record in DB
    async function uploadPhotoToSupabase(dateStr, file) {
        if (!supabase) return uploadPhotoToLocalStorage(dateStr, file);

        try {
            // Show a loading indicator on the dropzone
            uploadDropzone.innerHTML = `
                <div class="upload-spinner"></div>
                <p class="upload-text">Uploading...</p>
            `;

            // Resize image before uploading
            const resizedBlob = await resizeImageFile(file, 1200, 0.8);

            // Generate a unique filename
            const ext = file.type === 'image/png' ? 'png' : 'jpg';
            const filePath = `${dateStr}.${ext}`;

            // Upload to Storage (upsert to overwrite if exists)
            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(filePath, resizedBlob, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: resizedBlob.type
                });

            if (uploadError) throw uploadError;

            // Upsert record in DB
            const { error: dbError } = await supabase
                .from('memories')
                .upsert({
                    date_key: dateStr,
                    photo_path: filePath
                }, { onConflict: 'date_key' });

            if (dbError) throw dbError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(filePath);

            // Add cache buster to force browser refresh
            const freshUrl = urlData.publicUrl + '?t=' + Date.now();

            // Update cache
            photosCache[dateStr] = freshUrl;

            return freshUrl;
        } catch (err) {
            console.warn('Supabase upload failed, falling back to local storage:', err);
            
            // Try saving to local storage instead
            const localUrl = await uploadPhotoToLocalStorage(dateStr, file);
            if (localUrl) {
                console.log('Successfully saved photo to local storage fallback. Note: Supabase is not configured yet (or table/bucket memories does not exist).');
                return localUrl;
            }
            
            alert('Upload failed: ' + err.message);
            resetDropzoneUI();
            return null;
        }
    }

    // Delete photo from Supabase
    async function deletePhotoFromSupabase(dateStr) {
        if (!supabase) return deletePhotoFromLocalStorage(dateStr);

        try {
            // Get the file path from DB
            const { data, error: fetchError } = await supabase
                .from('memories')
                .select('photo_path')
                .eq('date_key', dateStr)
                .single();

            if (fetchError) throw fetchError;

            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .remove([data.photo_path]);

            if (storageError) console.warn('Storage delete warning:', storageError);

            // Delete from DB
            const { error: dbError } = await supabase
                .from('memories')
                .delete()
                .eq('date_key', dateStr);

            if (dbError) throw dbError;

            // Update cache
            delete photosCache[dateStr];
            return true;
        } catch (err) {
            console.warn('Supabase delete failed, falling back to local storage:', err);
            
            // Try deleting from local storage instead
            const localSuccess = deletePhotoFromLocalStorage(dateStr);
            if (localSuccess) {
                console.log('Successfully deleted photo from local storage fallback.');
                return true;
            }
            
            alert('Delete failed: ' + err.message);
            return false;
        }
    }

    // --- localStorage Fallback ---
    function loadPhotosFromLocalStorage() {
        try {
            return JSON.parse(localStorage.getItem('memoryBankPhotos')) || {};
        } catch {
            return {};
        }
    }

    async function uploadPhotoToLocalStorage(dateStr, file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const resizedUrl = await resizeImageToDataUrl(e.target.result, 600, 0.7);
                const photos = loadPhotosFromLocalStorage();
                photos[dateStr] = resizedUrl;
                try {
                    localStorage.setItem('memoryBankPhotos', JSON.stringify(photos));
                } catch {
                    alert('Storage is full! Try deleting some older photos.');
                    resolve(null);
                    return;
                }
                photosCache[dateStr] = resizedUrl;
                resolve(resizedUrl);
            };
            reader.readAsDataURL(file);
        });
    }

    function deletePhotoFromLocalStorage(dateStr) {
        const photos = loadPhotosFromLocalStorage();
        delete photos[dateStr];
        localStorage.setItem('memoryBankPhotos', JSON.stringify(photos));
        delete photosCache[dateStr];
        return true;
    }

    // --- Image Resize Utilities ---

    // Resize file to blob (for Supabase upload)
    function resizeImageFile(file, maxSize, quality) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;

                    if (width > maxSize || height > maxSize) {
                        if (width > height) {
                            height = Math.round((height / width) * maxSize);
                            width = maxSize;
                        } else {
                            width = Math.round((width / height) * maxSize);
                            height = maxSize;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const c = canvas.getContext('2d');
                    c.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Resize to data URL (for localStorage fallback)
    function resizeImageToDataUrl(dataUrl, maxSize, quality) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = Math.round((height / width) * maxSize);
                        width = maxSize;
                    } else {
                        width = Math.round((width / height) * maxSize);
                        height = maxSize;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const c = canvas.getContext('2d');
                c.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = dataUrl;
        });
    }

    // --- Date Utilities ---
    function dateKey(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    function prettyDate(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    // --- Calendar Rendering ---
    function renderCalendar() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        calMonthLabel.textContent = `${MONTH_NAMES[currentCalMonth]} ${currentCalYear}`;

        // Disable nav at boundaries
        const startMonth = relationshipStart.getMonth();
        const startYear = relationshipStart.getFullYear();
        calPrev.disabled = (currentCalYear === startYear && currentCalMonth <= startMonth);
        calNext.disabled = (currentCalYear === today.getFullYear() && currentCalMonth >= today.getMonth());

        // Build grid
        const firstDay = new Date(currentCalYear, currentCalMonth, 1).getDay();
        const daysInMonth = new Date(currentCalYear, currentCalMonth + 1, 0).getDate();

        let html = '';

        // Empty cells before month start
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="cal-day empty"></div>';
        }

        // Day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const key = dateKey(currentCalYear, currentCalMonth, day);
            const cellDate = new Date(currentCalYear, currentCalMonth, day);
            cellDate.setHours(0, 0, 0, 0);

            let classes = 'cal-day';
            let content = '';

            const relStart = new Date(relationshipStart.getFullYear(), relationshipStart.getMonth(), relationshipStart.getDate());
            relStart.setHours(0, 0, 0, 0);

            if (cellDate < relStart) {
                classes += ' before-start';
            } else if (cellDate > today) {
                classes += ' future';
            }

            if (cellDate.getTime() === today.getTime()) {
                classes += ' today';
            }

            // Has photo?
            if (photosCache[key]) {
                classes += ' has-photo';
                content = `<img src="${photosCache[key]}" alt="Memory" class="day-thumb" loading="lazy">`;
            }

            content += `<span class="day-number">${day}</span>`;

            if (!photosCache[key] && !classes.includes('before-start') && !classes.includes('future')) {
                content += '<span class="day-add-icon">+</span>';
            }

            html += `<div class="${classes}" data-date="${key}">${content}</div>`;
        }

        calGrid.innerHTML = html;

        // Click listeners
        calGrid.querySelectorAll('.cal-day:not(.empty):not(.future):not(.before-start)').forEach(cell => {
            cell.addEventListener('click', () => {
                openModal(cell.dataset.date);
            });
        });

        updateStats();
    }

    // --- Stats ---
    function updateStats() {
        const totalPhotos = Object.keys(photosCache).length;
        statTotalEl.textContent = totalPhotos;

        // Calculate streak
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let checkDate = new Date(today);
        let safeIterations = 0;

        while (safeIterations < 1000) {
            safeIterations++;
            const key = dateKey(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
            if (photosCache[key]) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        statStreakEl.textContent = streak;
    }

    // --- Navigation ---
    calPrev.addEventListener('click', () => {
        currentCalMonth--;
        if (currentCalMonth < 0) {
            currentCalMonth = 11;
            currentCalYear--;
        }
        renderCalendar();
    });

    calNext.addEventListener('click', () => {
        currentCalMonth++;
        if (currentCalMonth > 11) {
            currentCalMonth = 0;
            currentCalYear++;
        }
        renderCalendar();
    });

    // --- Modal ---
    function resetDropzoneUI() {
        uploadDropzone.innerHTML = `
            <svg viewBox="0 0 24 24" width="48" height="48" class="upload-icon">
                <path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            <p class="upload-text">Tap to upload our selfie</p>
            <p class="upload-hint">or drag & drop an image here</p>
        `;
    }

    function openModal(dateStr) {
        selectedDate = dateStr;
        modalDateLabel.textContent = prettyDate(dateStr);

        if (photosCache[dateStr]) {
            modalUploadState.classList.add('hidden');
            modalViewState.classList.remove('hidden');
            modalPhoto.src = photosCache[dateStr];
        } else {
            modalUploadState.classList.remove('hidden');
            modalViewState.classList.add('hidden');
            resetDropzoneUI();
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        selectedDate = null;
        memoryFileInput.value = '';
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // --- Upload Handling ---
    uploadDropzone.addEventListener('click', () => {
        memoryFileInput.click();
    });

    uploadDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadDropzone.classList.add('dragover');
    });

    uploadDropzone.addEventListener('dragleave', () => {
        uploadDropzone.classList.remove('dragover');
    });

    uploadDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadDropzone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileUpload(file);
        }
    });

    memoryFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });

    async function handleFileUpload(file) {
        if (!selectedDate) return;

        const photoUrl = await uploadPhotoToSupabase(selectedDate, file);
        if (photoUrl) {
            renderCalendar();
            populateTimelinePhotos();
            // Show the photo in the modal
            modalUploadState.classList.add('hidden');
            modalViewState.classList.remove('hidden');
            modalPhoto.src = photoUrl;
        }
    }

    // Replace button
    modalReplaceBtn.addEventListener('click', () => {
        memoryFileInput.click();
    });

    // Delete button
    modalDeleteBtn.addEventListener('click', async () => {
        if (selectedDate) {
            const success = await deletePhotoFromSupabase(selectedDate);
            if (success) {
                renderCalendar();
                populateTimelinePhotos();
                closeModal();
            }
        }
    });

    // --- Initial Load ---
    async function initMemoryBank() {
        // Show loading state on the grid
        calGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:40px; color: var(--text-muted);">Loading memories...</div>';

        photosCache = await loadPhotosFromSupabase();
        renderCalendar();
        // Initialize slideshow after photos are loaded
        initSlideshow();
        // Populate timeline cards with random memory bank photos
        populateTimelinePhotos();
    }

    // Pick 3 random photos from the Memory Bank and set them on timeline cards
    function populateTimelinePhotos() {
        const allKeys = Object.keys(photosCache);
        if (allKeys.length === 0) return;

        // Shuffle all available memory bank keys
        const shuffled = [...allKeys].sort(() => Math.random() - 0.5);

        const timelineImgs = [
            document.getElementById('timeline-img-1'),
            document.getElementById('timeline-img-2'),
            document.getElementById('timeline-img-3')
        ];

        // Populate all 3 cards, wrapping around if there are fewer than 3 photos in the Memory Bank
        timelineImgs.forEach((img, i) => {
            if (img) {
                const key = shuffled[i % shuffled.length];
                if (photosCache[key]) {
                    img.src = photosCache[key];
                }
            }
        });
    }

    initMemoryBank();


    // ==========================================
    // 7. REASONS I LOVE YOU — CAROUSEL
    // ==========================================
    const reasonsTrack = document.getElementById('reasons-track');
    const reasonsPrev = document.getElementById('reasons-prev');
    const reasonsNext = document.getElementById('reasons-next');
    const carouselDotsContainer = document.getElementById('carousel-dots');

    if (reasonsTrack) {
        const cards = reasonsTrack.querySelectorAll('.reason-card');
        const totalCards = cards.length;
        let currentCard = 0;
        let autoAdvanceTimer = null;

        // Create dots
        for (let i = 0; i < totalCards; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to reason ' + (i + 1));
            dot.addEventListener('click', () => scrollToCard(i));
            carouselDotsContainer.appendChild(dot);
        }

        function scrollToCard(index) {
            currentCard = Math.max(0, Math.min(index, totalCards - 1));
            const card = cards[currentCard];
            const trackRect = reasonsTrack.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const scrollLeft = card.offsetLeft - reasonsTrack.offsetLeft - (trackRect.width / 2) + (cardRect.width / 2);
            reasonsTrack.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            updateDots();
            resetAutoAdvance();
        }

        function updateDots() {
            const dots = carouselDotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentCard);
            });
        }

        // Detect current card from scroll position
        reasonsTrack.addEventListener('scroll', () => {
            const scrollCenter = reasonsTrack.scrollLeft + reasonsTrack.clientWidth / 2;
            let closest = 0;
            let minDist = Infinity;
            cards.forEach((card, i) => {
                const cardCenter = card.offsetLeft - reasonsTrack.offsetLeft + card.offsetWidth / 2;
                const dist = Math.abs(scrollCenter - cardCenter);
                if (dist < minDist) {
                    minDist = dist;
                    closest = i;
                }
            });
            if (closest !== currentCard) {
                currentCard = closest;
                updateDots();
            }
        });

        reasonsPrev.addEventListener('click', () => scrollToCard(currentCard - 1));
        reasonsNext.addEventListener('click', () => scrollToCard(currentCard + 1));

        // Auto-advance every 5 seconds
        function startAutoAdvance() {
            autoAdvanceTimer = setInterval(() => {
                const next = (currentCard + 1) % totalCards;
                scrollToCard(next);
            }, 5000);
        }

        function resetAutoAdvance() {
            clearInterval(autoAdvanceTimer);
            startAutoAdvance();
        }

        // Pause on hover/touch
        reasonsTrack.addEventListener('mouseenter', () => clearInterval(autoAdvanceTimer));
        reasonsTrack.addEventListener('mouseleave', startAutoAdvance);
        reasonsTrack.addEventListener('touchstart', () => clearInterval(autoAdvanceTimer), { passive: true });
        reasonsTrack.addEventListener('touchend', () => {
            clearInterval(autoAdvanceTimer);
            setTimeout(startAutoAdvance, 3000);
        });

        startAutoAdvance();
    }





    // ==========================================
    // 9. MEMORY SLIDESHOW
    // ==========================================
    const slideshowDisplay = document.getElementById('slideshow-display');
    const slideshowDateOverlay = document.getElementById('slideshow-date-overlay');
    const slideshowControls = document.getElementById('slideshow-controls');
    const slideshowPrev = document.getElementById('slideshow-prev');
    const slideshowNext = document.getElementById('slideshow-next');
    const slideshowPlayBtn = document.getElementById('slideshow-play');
    const slideshowThumbs = document.getElementById('slideshow-thumbs');
    const slideshowEmpty = document.getElementById('slideshow-empty');

    let slideshowPhotos = []; // Array of { dateKey, url }
    let slideshowIndex = 0;
    let slideshowTimer = null;
    let slideshowPlaying = true;

    // Get photos from the past monthsary period (16th to 15th)
    function getSlideshowPhotos() {
        const photos = [];
        // Current monthsary period: June 16 -> July 15
        // The monthsary is on the 16th of each month
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Period start: previous month 16th
        let periodStart, periodEnd;
        if (now.getDate() >= 16) {
            // We're past the 16th, period is this month's 16th to next month's 15th
            periodStart = new Date(currentYear, currentMonth, 16);
            periodEnd = new Date(currentYear, currentMonth + 1, 15);
        } else {
            // Before the 16th, period is last month's 16th to this month's 15th
            periodStart = new Date(currentYear, currentMonth - 1, 16);
            periodEnd = new Date(currentYear, currentMonth, 15);
        }

        // Filter photosCache for dates in this range
        const sortedKeys = Object.keys(photosCache).sort();
        sortedKeys.forEach(key => {
            const d = new Date(key + 'T00:00:00');
            if (d >= periodStart && d <= periodEnd) {
                photos.push({ dateKey: key, url: photosCache[key] });
            }
        });

        return photos;
    }

    function initSlideshow() {
        slideshowPhotos = getSlideshowPhotos();

        if (slideshowPhotos.length === 0) {
            // Show empty state
            slideshowDisplay.style.display = 'none';
            slideshowControls.style.display = 'none';
            slideshowThumbs.style.display = 'none';
            slideshowEmpty.classList.remove('hidden');
            return;
        }

        // Show slideshow, hide empty
        slideshowDisplay.style.display = '';
        slideshowControls.style.display = '';
        slideshowThumbs.style.display = '';
        slideshowEmpty.classList.add('hidden');

        // Create image elements
        slideshowDisplay.querySelectorAll('.slideshow-img').forEach(img => img.remove());
        slideshowPhotos.forEach((photo, i) => {
            const img = document.createElement('img');
            img.className = 'slideshow-img' + (i === 0 ? ' active' : '');
            img.src = photo.url;
            img.alt = 'Memory from ' + photo.dateKey;
            img.loading = 'lazy';
            slideshowDisplay.insertBefore(img, slideshowDateOverlay);
        });

        // Create thumbnails
        slideshowThumbs.innerHTML = '';
        slideshowPhotos.forEach((photo, i) => {
            const thumb = document.createElement('img');
            thumb.className = 'slideshow-thumb' + (i === 0 ? ' active' : '');
            thumb.src = photo.url;
            thumb.alt = 'Thumbnail ' + photo.dateKey;
            thumb.loading = 'lazy';
            thumb.addEventListener('click', () => goToSlide(i));
            slideshowThumbs.appendChild(thumb);
        });

        // Show first date
        slideshowDateOverlay.textContent = prettyDate(slideshowPhotos[0].dateKey);

        // Start auto-advance
        startSlideshowTimer();
    }

    function goToSlide(index) {
        if (index < 0 || index >= slideshowPhotos.length) return;

        const imgs = slideshowDisplay.querySelectorAll('.slideshow-img');
        const thumbs = slideshowThumbs.querySelectorAll('.slideshow-thumb');

        // Remove active from current
        if (imgs[slideshowIndex]) imgs[slideshowIndex].classList.remove('active');
        if (thumbs[slideshowIndex]) thumbs[slideshowIndex].classList.remove('active');

        slideshowIndex = index;

        // Add active to new
        if (imgs[slideshowIndex]) imgs[slideshowIndex].classList.add('active');
        if (thumbs[slideshowIndex]) thumbs[slideshowIndex].classList.add('active');

        // Update date
        slideshowDateOverlay.textContent = prettyDate(slideshowPhotos[slideshowIndex].dateKey);

        // Scroll thumbnail into view horizontally without scrolling the vertical page
        if (thumbs[slideshowIndex]) {
            const thumb = thumbs[slideshowIndex];
            const scrollLeft = thumb.offsetLeft - slideshowThumbs.offsetLeft - (slideshowThumbs.clientWidth / 2) + (thumb.clientWidth / 2);
            slideshowThumbs.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }

    function startSlideshowTimer() {
        clearInterval(slideshowTimer);
        if (slideshowPlaying && slideshowPhotos.length > 1) {
            slideshowTimer = setInterval(() => {
                const next = (slideshowIndex + 1) % slideshowPhotos.length;
                goToSlide(next);
            }, 4000);
        }
    }

    if (slideshowPrev) {
        slideshowPrev.addEventListener('click', () => {
            const prev = (slideshowIndex - 1 + slideshowPhotos.length) % slideshowPhotos.length;
            goToSlide(prev);
            if (slideshowPlaying) startSlideshowTimer();
        });
    }

    if (slideshowNext) {
        slideshowNext.addEventListener('click', () => {
            const next = (slideshowIndex + 1) % slideshowPhotos.length;
            goToSlide(next);
            if (slideshowPlaying) startSlideshowTimer();
        });
    }

    if (slideshowPlayBtn) {
        slideshowPlayBtn.addEventListener('click', () => {
            slideshowPlaying = !slideshowPlaying;
            const playIcon = slideshowPlayBtn.querySelector('.ss-play-icon');
            const pauseIcon = slideshowPlayBtn.querySelector('.ss-pause-icon');

            if (slideshowPlaying) {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
                startSlideshowTimer();
            } else {
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
                clearInterval(slideshowTimer);
            }
        });
    }

    /* ==========================================
       9. PHOTOBOOTH (REMOVED)
       ========================================== */
    if (false) {
    const boothStep1 = document.getElementById('booth-step-1');
    const boothStep2 = document.getElementById('booth-step-2');
    const boothStep3 = document.getElementById('booth-step-3');
    const boothStartBtn = document.getElementById('booth-start-btn');
    const boothJoinBtnSubmit = document.getElementById('booth-join-submit');
    const boothRoomInput = document.getElementById('booth-room-input');
    const boothBackToStep1 = document.getElementById('booth-back-to-step1');
    const boothCurrentRoomEl = document.getElementById('booth-current-room');
    const boothRoleBadge = document.getElementById('booth-role-badge');
    const boothVideo = document.getElementById('booth-video');
    const boothCountdown = document.getElementById('booth-countdown');
    const boothFlash = document.getElementById('booth-flash');
    const boothStatusText = document.getElementById('booth-status-text');
    const boothPartnerOverlay = document.getElementById('booth-partner-overlay');
    const boothPartnerPreview = document.getElementById('booth-partner-preview');
    const boothCaptureStartBtn = document.getElementById('booth-capture-start');
    const boothRetakeBtn = document.getElementById('booth-retake-btn');
    const boothNextStepBtn = document.getElementById('booth-next-step-btn');

    const boothAiLoading = document.getElementById('booth-ai-loading');
    const boothAiStatus = document.getElementById('booth-ai-status');
    const boothWaiting = document.getElementById('booth-waiting');
    const boothShareCode = document.getElementById('booth-share-code');
    const boothPartnerStatusEl = document.getElementById('booth-partner-status');
    const boothSimulatePartnerBtn = document.getElementById('booth-simulate-partner-btn');
    const boothResult = document.getElementById('booth-result');
    const btnLayoutStrip = document.getElementById('btn-layout-strip');
    const btnLayoutGrid = document.getElementById('btn-layout-grid');
    const boothCanvasStrip = document.getElementById('booth-canvas-strip');
    const boothCanvasGrid = document.getElementById('booth-canvas-grid');
    const boothDownloadBtn = document.getElementById('booth-download-btn');
    const boothSaveMemoryBtn = document.getElementById('booth-save-memory-btn');
    const boothRestartBtn = document.getElementById('booth-restart-btn');

    let boothStream = null;
    let boothRoomCode = 'HECO';
    let boothIsPartnerA = true;
    let boothMyPoses = []; // Array of 4 data URLs
    let boothPartnerPoses = null; // Array of 4 data URLs when joined/synced
    let boothActiveLayout = 'strip'; // 'strip' or 'grid'
    let boothHasAutoSaved = false;

    // Switch step view
    function showBoothStep(stepNum) {
        boothStep1.classList.add('hidden');
        boothStep2.classList.add('hidden');
        boothStep3.classList.add('hidden');
        if (stepNum === 1) boothStep1.classList.remove('hidden');
        if (stepNum === 2) boothStep2.classList.remove('hidden');
        if (stepNum === 3) boothStep3.classList.remove('hidden');
    }

    // Start Camera
    async function startBoothCamera() {
        try {
            if (boothStream) {
                boothStream.getTracks().forEach(track => track.stop());
            }
            boothStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
                audio: false
            });
            if (boothVideo) {
                boothVideo.srcObject = boothStream;
            }
        } catch (err) {
            console.error('Camera access error:', err);
            boothStatusText.textContent = '⚠️ Camera permission required to take poses!';
        }
    }

    // Stop Camera
    function stopBoothCamera() {
        if (boothStream) {
            boothStream.getTracks().forEach(track => track.stop());
            boothStream = null;
        }
    }

    // Step 1: Start Session button
    if (boothStartBtn) {
        boothStartBtn.addEventListener('click', async () => {
            boothIsPartnerA = true;
            boothRoomCode = 'HECO';
            boothMyPoses = [];
            boothPartnerPoses = null;
            boothCurrentRoomEl.textContent = boothRoomCode;
            boothRoleBadge.textContent = 'Partner A (Left Side)';
            resetLiveStripSlots();
            boothRetakeBtn.classList.add('hidden');
            boothNextStepBtn.classList.add('hidden');
            boothCaptureStartBtn.classList.remove('hidden');
            boothPartnerOverlay.classList.add('hidden');
            boothStatusText.textContent = 'Get ready for pose 1 of 4!';
            showBoothStep(2);
            await startBoothCamera();
        });
    }

    // Step 1: Join Room submit
    if (boothJoinBtnSubmit) {
        boothJoinBtnSubmit.addEventListener('click', async () => {
            const inputVal = (boothRoomInput.value || 'HECO').trim().toUpperCase();
            if (!inputVal) {
                alert('Please enter a valid Room Code!');
                return;
            }
            boothRoomCode = inputVal;
            boothIsPartnerA = false;
            boothMyPoses = [];
            boothCurrentRoomEl.textContent = boothRoomCode;
            boothRoleBadge.textContent = 'Partner B (Right Side)';
            resetLiveStripSlots();
            boothRetakeBtn.classList.add('hidden');
            boothNextStepBtn.classList.add('hidden');
            boothCaptureStartBtn.classList.remove('hidden');
            boothStatusText.textContent = 'Loading partner poses from room ' + boothRoomCode + '...';
            showBoothStep(2);
            await startBoothCamera();

            // Try to load Partner A poses from localStorage or Supabase
            boothPartnerPoses = await fetchPartnerPosesFromStorage(boothRoomCode, true);
            if (boothPartnerPoses && boothPartnerPoses.length === 4) {
                boothPartnerOverlay.classList.remove('hidden');
                boothPartnerPreview.src = boothPartnerPoses[0];
                boothStatusText.textContent = 'Partner poses loaded! Match their energy!';
            } else {
                boothStatusText.textContent = 'Ready! (Partner poses not found yet, you can still take yours)';
            }
        });
    }

    if (boothBackToStep1) {
        boothBackToStep1.addEventListener('click', () => {
            stopBoothCamera();
            showBoothStep(1);
        });
    }

    function resetLiveStripSlots() {
        for (let i = 0; i < 4; i++) {
            const slot = document.getElementById('booth-slot-' + i);
            if (slot) {
                slot.classList.remove('filled');
                slot.innerHTML = `<span>${i + 1}</span>`;
            }
        }
    }

    // Capture 4 poses (3-second burst cycle)
    if (boothCaptureStartBtn) {
        boothCaptureStartBtn.addEventListener('click', async () => {
            boothCaptureStartBtn.classList.add('hidden');
            boothRetakeBtn.classList.add('hidden');
            boothNextStepBtn.classList.add('hidden');
            boothMyPoses = [];
            resetLiveStripSlots();

            for (let shot = 0; shot < 4; shot++) {
                boothStatusText.textContent = `Pose ${shot + 1} of 4: Strike a pose!`;
                if (boothPartnerPoses && boothPartnerPoses[shot] && boothPartnerPreview) {
                    boothPartnerPreview.src = boothPartnerPoses[shot];
                }

                // 3-2-1 Countdown
                for (let count = 3; count >= 1; count--) {
                    boothCountdown.textContent = count;
                    boothCountdown.classList.remove('hidden');
                    await new Promise(r => setTimeout(r, 800));
                }
                boothCountdown.classList.add('hidden');

                // Flash overlay
                boothFlash.classList.remove('hidden');
                boothFlash.style.opacity = '1';
                setTimeout(() => { boothFlash.style.opacity = '0'; setTimeout(() => boothFlash.classList.add('hidden'), 300); }, 150);

                // Capture snapshot from video
                const offCanvas = document.createElement('canvas');
                offCanvas.width = 600;
                offCanvas.height = 800;
                const ctx = offCanvas.getContext('2d');
                // Mirror self
                ctx.translate(600, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(boothVideo, 0, 0, 600, 800);
                const dataUrl = offCanvas.toDataURL('image/jpeg', 0.85);
                boothMyPoses.push(dataUrl);

                // Show in live strip slot
                const slot = document.getElementById('booth-slot-' + shot);
                if (slot) {
                    slot.classList.add('filled');
                    slot.innerHTML = `<img src="${dataUrl}" alt="Pose ${shot + 1}">`;
                }

                await new Promise(r => setTimeout(r, 600));
            }

            boothStatusText.textContent = 'All 4 poses captured beautifully! 💖';
            boothRetakeBtn.classList.remove('hidden');
            boothNextStepBtn.classList.remove('hidden');

            // Save poses to storage so partner can access
            await saveMyPosesToStorage(boothRoomCode, boothIsPartnerA, boothMyPoses);
        });
    }

    if (boothRetakeBtn) {
        boothRetakeBtn.addEventListener('click', () => {
            boothCaptureStartBtn.click();
        });
    }

    // Storage Sync helpers
    async function saveMyPosesToStorage(roomCode, isPartnerA, poses) {
        const suffix = isPartnerA ? '_A' : '_B';
        const key = `boothSession_${roomCode}${suffix}`;
        try {
            localStorage.setItem(key, JSON.stringify(poses));
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }

        // Upload to Supabase memories bucket if connected
        if (supabase) {
            try {
                for (let i = 0; i < poses.length; i++) {
                    const blob = await (await fetch(poses[i])).blob();
                    const path = `booth_sessions/${roomCode}/partner_${isPartnerA ? 'a' : 'b'}_${i}.jpg`;
                    await supabase.storage.from(STORAGE_BUCKET).upload(path, blob, { upsert: true, contentType: 'image/jpeg' });
                }
            } catch (err) {
                console.warn('Supabase booth storage warning:', err);
            }
        }
    }

    async function fetchPartnerPosesFromStorage(roomCode, fetchingPartnerA) {
        const suffix = fetchingPartnerA ? '_A' : '_B';
        const key = `boothSession_${roomCode}${suffix}`;
        const local = localStorage.getItem(key);
        if (local) {
            try { return JSON.parse(local); } catch (e) {}
        }

        if (supabase) {
            try {
                const poses = [];
                for (let i = 0; i < 4; i++) {
                    const path = `booth_sessions/${roomCode}/partner_${fetchingPartnerA ? 'a' : 'b'}_${i}.jpg`;
                    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
                    poses.push(urlData.publicUrl + '?t=' + Date.now());
                }
                return poses;
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    // Step 2 to Step 3 (Proceed to AI Merge)
    if (boothNextStepBtn) {
        boothNextStepBtn.addEventListener('click', async () => {
            stopBoothCamera();
            showBoothStep(3);
            boothAiLoading.classList.add('hidden');
            boothWaiting.classList.add('hidden');
            boothResult.classList.add('hidden');
            boothHasAutoSaved = false;

            // If partner poses aren't loaded yet, try fetching again
            if (!boothPartnerPoses || boothPartnerPoses.length < 4) {
                boothPartnerPoses = await fetchPartnerPosesFromStorage(boothRoomCode, !boothIsPartnerA);
            }

            if (boothPartnerPoses && boothPartnerPoses.length === 4) {
                // We have both halves! Run AI processing
                await runAiBoothCompositing();
            } else {
                // Show waiting screen
                boothWaiting.classList.remove('hidden');
                if (boothShareCode) boothShareCode.textContent = boothRoomCode;
                boothPartnerStatusEl.textContent = 'Checking for partner poses...';
            }
        });
    }
    }

});
