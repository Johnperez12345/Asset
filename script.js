// =====================================================
// 💖 ZIA'S ASSET UPLOADER - SCRIPT
// =====================================================

// ─── TABS ───
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const tab = this.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(tab).classList.add('active');
    });
});

// ─── UPLOAD HANDLERS ───
const soundInput = document.getElementById('soundInput');
const imageInput = document.getElementById('imageInput');
const soundBtn = document.getElementById('soundBtn');
const imageBtn = document.getElementById('imageBtn');

soundBtn.addEventListener('click', () => soundInput.click());
imageBtn.addEventListener('click', () => imageInput.click());

// ─── SOUND UPLOAD ───
soundInput.addEventListener('change', function(e) {
    const file = this.files[0];
    if (file) handleUpload(file, 'sound');
});

// ─── IMAGE UPLOAD ───
imageInput.addEventListener('change', function(e) {
    const file = this.files[0];
    if (file) handleUpload(file, 'image');
});

// ─── DRAG & DROP ───
['soundDrop', 'imageDrop'].forEach(id => {
    const drop = document.getElementById(id);
    drop.addEventListener('dragover', (e) => {
        e.preventDefault();
        drop.classList.add('dragover');
    });
    drop.addEventListener('dragleave', () => {
        drop.classList.remove('dragover');
    });
    drop.addEventListener('drop', (e) => {
        e.preventDefault();
        drop.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) {
            const type = id === 'soundDrop' ? 'sound' : 'image';
            handleUpload(file, type);
        }
    });
    // Click to upload
    drop.addEventListener('click', () => {
        const input = id === 'soundDrop' ? soundInput : imageInput;
        input.click();
    });
});

// ─── UPLOAD FUNCTION ───
function handleUpload(file, type) {
    const maxSize = type === 'sound' ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
        alert(`File too large! Max ${maxSize / 1024 / 1024}MB`);
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        // Generate a unique ID (simulated asset ID)
        const id = Math.floor(Math.random() * 9000000000) + 1000000000;
        
        // Show result
        const resultDiv = document.getElementById(type + 'Result');
        const idSpan = document.getElementById(type + 'Id');
        const idDisplay = document.getElementById(type + 'IdDisplay');
        
        idSpan.textContent = id;
        idDisplay.textContent = id;
        resultDiv.classList.remove('hidden');
        
        // Update the upload area
        const uploadArea = document.getElementById(type + 'Drop');
        uploadArea.innerHTML = `
            <div class="upload-icon">${type === 'sound' ? '🎵' : '🖼️'}</div>
            <p><strong>${file.name}</strong></p>
            <p class="sub-text">${(file.size / 1024).toFixed(1)} KB • ${type === 'sound' ? 'Audio' : 'Image'}</p>
            <p style="color: #22ff88; font-size: 13px; margin-top: 8px;">✅ Ready for Studio Lite!</p>
        `;
    };
    reader.readAsDataURL(file);
}

// ─── COPY ID ───
function copyId(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('📋 Copied: ' + text);
        });
    } else {
        // Fallback for mobile
        const range = document.createRange();
        range.selectNode(element);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        showToast('📋 Copied: ' + text);
    }
}

// ─── TOAST NOTIFICATION ───
function showToast(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #1a1a2e;
        color: #f0f0ff;
        padding: 12px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        border: 1px solid #2a2a3d;
        z-index: 999;
        animation: fadeInUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ─── KEYBOARD SHORTCUT ───
document.addEventListener('keydown', (e) => {
    if (e.key === '1') {
        document.querySelector('[data-tab="sound"]').click();
    }
    if (e.key === '2') {
        document.querySelector('[data-tab="image"]').click();
    }
});
