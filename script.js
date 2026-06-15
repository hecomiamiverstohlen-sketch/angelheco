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

    class HeartParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 15 + 8; // Size between 8px and 23px
            this.speedX = Math.random() * 1.5 - 0.75;
            this.speedY = -(Math.random() * 1.5 + 0.5); // Upward movement
            this.opacity = Math.random() * 0.4 + 0.2; // Keep it subtle (0.2 - 0.6)
            this.fadeSpeed = Math.random() * 0.002 + 0.001;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Re-spawn if particle moves off-screen or fades completely
            if (this.y < -this.size || this.opacity <= 0 || this.x < -this.size || this.x > canvas.width + this.size) {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 50;
                this.size = Math.random() * 15 + 8;
                this.speedX = Math.random() * 1.5 - 0.75;
                this.speedY = -(Math.random() * 1.5 + 0.5);
                this.opacity = Math.random() * 0.4 + 0.2;
            }
        }

        draw() {
            // Heart path formula centered at (this.x, this.y)
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = 'rgba(59, 130, 246, ' + this.opacity + ')';
            ctx.beginPath();
            const x = this.x;
            const y = this.y;
            const size = this.size;
            
            ctx.moveTo(x, y - size / 4);
            // Left curve
            ctx.bezierCurveTo(x - size/2, y - size, x - size, y - size/3, x, y + size/2);
            // Right curve
            ctx.bezierCurveTo(x + size, y - size/3, x + size/2, y - size, x, y - size/4);
            
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize particles
    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < maxParticles; i++) {
            particlesArray.push(new HeartParticle());
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

    musicBtn.addEventListener('click', () => {
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
        heartEl.innerHTML = '💙';
        
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

    // --- Supabase Configuration ---
    const SUPABASE_URL = 'https://unwkuwipxkezilwotkdy.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud2t1d2lweGtlemlsd290a2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1Mjc1NjUsImV4cCI6MjA5NzEwMzU2NX0.7JeOKbF95S-T5pjD1DFZCcfX8VzigGUAcTR5FE2SpUQ';
    const STORAGE_BUCKET = 'memories';

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
            data.forEach(row => {
                // Build the public URL from the storage path
                const { data: urlData } = supabase.storage
                    .from(STORAGE_BUCKET)
                    .getPublicUrl(row.photo_path);
                photos[row.date_key] = urlData.publicUrl;
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
                console.log('Successfully saved photo to local storage fallback.');
                // Show a helpful notification to the user so they know it fell back
                alert('Supabase is not configured yet (or table/bucket memories does not exist). Saving to your browser\'s local storage instead!');
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
    }

    initMemoryBank();

});

