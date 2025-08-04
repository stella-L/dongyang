// Main JavaScript for 창원 동양한의원 website

// Admin functionality
class AdminManager {
    constructor() {
        this.isAdmin = localStorage.getItem('dongyang_admin') === 'true';
        this.adminPassword = 'dongyang2024!';
        this.editableElements = [];
        this.init();
    }
    
    init() {
        this.createAdminUI();
        if (this.isAdmin) {
            this.enableAdminMode();
        }
        this.addAdminKeyboardShortcut();
    }
    
    createAdminUI() {
        const adminPanel = document.createElement('div');
        adminPanel.id = 'admin-panel';
        adminPanel.innerHTML = `
            <div class="admin-panel ${this.isAdmin ? 'admin-mode' : ''}">
                <button id="admin-toggle" class="admin-btn ${this.isAdmin ? 'admin-active' : ''}">
                    ${this.isAdmin ? '관리자 모드 OFF' : '관리자 모드'}
                </button>
                ${this.isAdmin ? '<button id="save-changes" class="admin-btn save-btn">변경사항 저장</button>' : ''}
            </div>
        `;
        document.body.appendChild(adminPanel);
        
        this.addAdminStyles();
        this.attachAdminEvents();
    }
    
    addAdminStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .admin-panel {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 1000;
                display: flex;
                gap: 10px;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            .admin-panel:hover {
                opacity: 1;
            }
            .admin-btn {
                background: #1c1917;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .admin-btn:hover {
                background: #292524;
                transform: translateY(-1px);
            }
            .admin-active {
                background: #dc2626 !important;
            }
            .save-btn {
                background: #059669 !important;
            }
            .editable-text {
                position: relative;
                outline: 2px dashed transparent;
                transition: outline 0.3s;
                padding: 2px;
                border-radius: 3px;
            }
            .admin-mode .editable-text:hover {
                outline-color: #3b82f6;
                background: rgba(59, 130, 246, 0.05);
                cursor: text;
            }
            .editable-text.editing {
                outline-color: #dc2626;
                background: rgba(220, 38, 38, 0.05);
            }
            .editable-text::after {
                content: '클릭하여 편집';
                position: absolute;
                top: -25px;
                left: 0;
                background: #1c1917;
                color: white;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s;
                white-space: nowrap;
                z-index: 1001;
            }
            .admin-mode .editable-text:hover::after {
                opacity: 1;
            }
            .editable-image {
                position: relative;
                outline: 2px dashed transparent;
                transition: outline 0.3s;
                cursor: pointer;
            }
            .admin-mode .editable-image:hover {
                outline-color: #10b981;
                background: rgba(16, 185, 129, 0.05);
            }
            .editable-image::after {
                content: '클릭하여 이미지 변경';
                position: absolute;
                top: -25px;
                left: 0;
                background: #10b981;
                color: white;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s;
                white-space: nowrap;
                z-index: 1001;
            }
            .admin-mode .editable-image:hover::after {
                opacity: 1;
            }
            .editable-background {
                position: relative;
                outline: 2px dashed transparent;
                transition: outline 0.3s;
                cursor: pointer;
            }
            .admin-mode .editable-background:hover {
                outline-color: #f59e0b;
                box-shadow: inset 0 0 0 2px rgba(245, 158, 11, 0.1);
            }
            .editable-background::after {
                content: '클릭하여 배경 이미지 변경';
                position: absolute;
                top: 10px;
                right: 10px;
                background: #f59e0b;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 10px;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s;
                white-space: nowrap;
                z-index: 1001;
            }
            .admin-mode .editable-background:hover::after {
                opacity: 1;
            }
            .background-editor {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-width: 700px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }
            .background-options {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 15px;
                margin-bottom: 20px;
            }
            .background-option {
                padding: 15px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
            }
            .background-option:hover {
                border-color: #f59e0b;
                background: rgba(245, 158, 11, 0.05);
            }
            .background-option.active {
                border-color: #f59e0b;
                background: rgba(245, 158, 11, 0.1);
            }
            .color-picker-container {
                display: flex;
                align-items: center;
                gap: 10px;
                margin: 10px 0;
            }
            .color-picker {
                width: 50px;
                height: 40px;
                border: 1px solid #d6d3d1;
                border-radius: 6px;
                cursor: pointer;
            }
            .gradient-presets {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                margin: 15px 0;
            }
            .gradient-preset {
                height: 40px;
                border-radius: 6px;
                cursor: pointer;
                border: 2px solid transparent;
                transition: border-color 0.3s;
            }
            .gradient-preset:hover,
            .gradient-preset.active {
                border-color: #f59e0b;
            }
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            }
            .image-editor {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }
            .modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 30px;
                height: 30px;
                border: none;
                background: #f3f4f6;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                color: #6b7280;
                transition: all 0.3s;
            }
            .modal-close:hover {
                background: #e5e7eb;
                color: #374151;
            }
            .image-editor h3 {
                margin-bottom: 20px;
                text-align: center;
                color: #1c1917;
            }
            .image-options {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
            }
            .image-option {
                flex: 1;
                padding: 15px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
            }
            .image-option:hover {
                border-color: #10b981;
                background: rgba(16, 185, 129, 0.05);
            }
            .image-option.active {
                border-color: #10b981;
                background: rgba(16, 185, 129, 0.1);
            }
            .upload-area {
                border: 2px dashed #d1d5db;
                border-radius: 8px;
                padding: 40px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
            }
            .upload-area:hover {
                border-color: #10b981;
                background: rgba(16, 185, 129, 0.05);
            }
            .upload-area.dragover {
                border-color: #10b981;
                background: rgba(16, 185, 129, 0.1);
            }
            .url-input {
                width: 100%;
                padding: 12px;
                border: 1px solid #d6d3d1;
                border-radius: 6px;
                margin: 10px 0;
                font-size: 14px;
            }
            .preview-image {
                max-width: 100%;
                max-height: 200px;
                object-fit: cover;
                border-radius: 6px;
                margin: 15px 0;
            }
            .image-editor-buttons {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                margin-top: 20px;
            }
            .image-editor-buttons button {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s;
            }
            .btn-primary {
                background: #10b981;
                color: white;
            }
            .btn-primary:hover {
                background: #059669;
            }
            .btn-secondary {
                background: #6b7280;
                color: white;
            }
            .btn-secondary:hover {
                background: #4b5563;
            }
            .login-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            }
            .login-form {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                max-width: 300px;
                width: 100%;
            }
            .login-form input {
                width: 100%;
                padding: 12px;
                border: 1px solid #d6d3d1;
                border-radius: 6px;
                margin: 10px 0;
                font-size: 14px;
            }
            .login-form button {
                width: 100%;
                padding: 12px;
                background: #1c1917;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            }
            .login-form button:hover {
                background: #292524;
            }
            .error-message {
                color: #dc2626;
                font-size: 12px;
                margin-top: 5px;
            }
        `;
        document.head.appendChild(style);
    }
    
    attachAdminEvents() {
        const adminToggle = document.getElementById('admin-toggle');
        adminToggle.addEventListener('click', () => {
            if (this.isAdmin) {
                this.disableAdminMode();
            } else {
                this.showLoginModal();
            }
        });
        
        const saveButton = document.getElementById('save-changes');
        if (saveButton) {
            saveButton.addEventListener('click', () => this.saveChanges());
        }
    }
    
    showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'login-modal';
        modal.innerHTML = `
            <div class="login-form">
                <h3 style="margin-bottom: 20px; text-align: center;">관리자 로그인</h3>
                <input type="password" id="admin-password" placeholder="비밀번호를 입력하세요">
                <div id="login-error" class="error-message" style="display: none;">잘못된 비밀번호입니다.</div>
                <button onclick="adminManager.login()">로그인</button>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #6b7280; margin-top: 10px;">취소</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        const passwordInput = document.getElementById('admin-password');
        passwordInput.focus();
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.login();
            }
        });
    }
    
    login() {
        const passwordInput = document.getElementById('admin-password');
        const errorDiv = document.getElementById('login-error');
        
        if (passwordInput.value === this.adminPassword) {
            localStorage.setItem('dongyang_admin', 'true');
            this.isAdmin = true;
            document.querySelector('.login-modal').remove();
            this.enableAdminMode();
        } else {
            errorDiv.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
    
    enableAdminMode() {
        this.isAdmin = true;
        const adminToggle = document.getElementById('admin-toggle');
        const adminPanel = document.querySelector('.admin-panel');
        
        adminToggle.textContent = '관리자 모드 OFF';
        adminToggle.classList.add('admin-active');
        adminPanel.classList.add('admin-mode');
        
        if (!document.getElementById('save-changes')) {
            const saveBtn = document.createElement('button');
            saveBtn.id = 'save-changes';
            saveBtn.className = 'admin-btn save-btn';
            saveBtn.textContent = '변경사항 저장';
            saveBtn.addEventListener('click', () => this.saveChanges());
            adminPanel.appendChild(saveBtn);
        }
        
        this.markEditableElements();
        this.markEditableImages();
        this.markEditableBackgrounds();
        
        // Load previously saved changes after marking elements
        setTimeout(() => {
            this.loadSavedChanges();
            this.loadSavedImageChanges();
            this.loadSavedBlogImageChanges();
            this.loadSavedBackgroundChanges();
        }, 100);
    }
    
    disableAdminMode() {
        this.isAdmin = false;
        localStorage.removeItem('dongyang_admin');
        
        const adminToggle = document.getElementById('admin-toggle');
        const adminPanel = document.querySelector('.admin-panel');
        const saveBtn = document.getElementById('save-changes');
        
        adminToggle.textContent = '관리자 모드';
        adminToggle.classList.remove('admin-active');
        adminPanel.classList.remove('admin-mode');
        
        if (saveBtn) {
            saveBtn.remove();
        }
        
        this.removeEditableElements();
        this.removeEditableImages();
        this.removeEditableBackgrounds();
    }
    
    markEditableElements() {
        const selectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p:not(footer p)', 
            '.text-xl', '.text-lg', '.text-base',
            'article h3', 'article p',
            'address',
            'time'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (!element.closest('script') && 
                    !element.closest('style') && 
                    !element.closest('#admin-panel') &&
                    !element.closest('nav') &&
                    element.textContent.trim().length > 0) {
                    
                    element.classList.add('editable-text');
                    element.contentEditable = true;
                    element.addEventListener('click', this.handleElementClick.bind(this));
                    element.addEventListener('blur', this.handleElementBlur.bind(this));
                    element.addEventListener('keypress', this.handleElementKeypress.bind(this));
                    this.editableElements.push(element);
                }
            });
        });
    }
    
    removeEditableElements() {
        this.editableElements.forEach(element => {
            element.classList.remove('editable-text', 'editing');
            element.contentEditable = false;
            element.removeEventListener('click', this.handleElementClick);
            element.removeEventListener('blur', this.handleElementBlur);
            element.removeEventListener('keypress', this.handleElementKeypress);
        });
        this.editableElements = [];
    }
    
    markEditableImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.closest('#admin-panel')) {
                img.classList.add('editable-image');
                img.addEventListener('click', this.handleImageClick.bind(this));
            }
        });
        
        // Also mark blog card images (div elements with blog-image class)
        const blogImages = document.querySelectorAll('.blog-image');
        blogImages.forEach(blogImg => {
            blogImg.classList.add('editable-image');
            blogImg.addEventListener('click', this.handleBlogImageClick.bind(this));
        });
    }
    
    removeEditableImages() {
        const images = document.querySelectorAll('.editable-image');
        images.forEach(img => {
            img.classList.remove('editable-image');
            img.removeEventListener('click', this.handleImageClick);
            img.removeEventListener('click', this.handleBlogImageClick);
        });
    }
    
    handleImageClick(e) {
        if (this.isAdmin) {
            e.preventDefault();
            this.showImageEditor(e.target);
        }
    }
    
    handleBlogImageClick(e) {
        if (this.isAdmin) {
            e.preventDefault();
            e.stopPropagation(); // Prevent blog card click
            this.showBlogImageEditor(e.target);
        }
    }
    
    showBlogImageEditor(blogImageElement) {
        this.currentBlogImageElement = blogImageElement;
        
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-editor">
                <button class="modal-close" onclick="this.closest('.image-modal').remove()">&times;</button>
                <h3>블로그 카드 이미지 변경</h3>
                
                <div class="image-options">
                    <div class="image-option active" data-type="url">
                        <div style="font-weight: bold; margin-bottom: 5px;">URL로 변경</div>
                        <div style="font-size: 12px; color: #6b7280;">웹 주소를 입력하세요</div>
                    </div>
                    <div class="image-option" data-type="upload">
                        <div style="font-weight: bold; margin-bottom: 5px;">파일 업로드</div>
                        <div style="font-size: 12px; color: #6b7280;">컴퓨터에서 선택</div>
                    </div>
                </div>
                
                <div id="url-section">
                    <input type="text" class="url-input" id="blog-image-url" placeholder="이미지 URL을 입력하세요" value="${blogImageElement.style.backgroundImage ? blogImageElement.style.backgroundImage.slice(5, -2) : ''}">
                    <div id="blog-url-preview"></div>
                </div>
                
                <div id="upload-section" style="display: none;">
                    <div class="upload-area" id="blog-upload-area">
                        <div>
                            <svg style="width: 48px; height: 48px; margin: 0 auto 16px; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <div style="font-weight: bold; margin-bottom: 8px;">파일을 드래그하거나 클릭하여 선택</div>
                            <div style="font-size: 12px; color: #6b7280;">JPG, PNG, GIF 파일 지원</div>
                        </div>
                        <input type="file" id="blog-image-file" accept="image/*" style="display: none;">
                    </div>
                    <div id="blog-upload-preview"></div>
                </div>
                
                <div class="image-editor-buttons">
                    <button class="btn-secondary" onclick="this.closest('.image-modal').remove()">취소</button>
                    <button class="btn-primary" id="apply-blog-image">적용</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupBlogImageEditor();
    }
    
    setupBlogImageEditor() {
        const options = document.querySelectorAll('.image-option');
        const urlSection = document.getElementById('url-section');
        const uploadSection = document.getElementById('upload-section');
        const urlInput = document.getElementById('blog-image-url');
        const urlPreview = document.getElementById('blog-url-preview');
        const uploadArea = document.getElementById('blog-upload-area');
        const fileInput = document.getElementById('blog-image-file');
        const uploadPreview = document.getElementById('blog-upload-preview');
        const applyButton = document.getElementById('apply-blog-image');
        
        // Option switching
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                if (option.dataset.type === 'url') {
                    urlSection.style.display = 'block';
                    uploadSection.style.display = 'none';
                } else {
                    urlSection.style.display = 'none';
                    uploadSection.style.display = 'block';
                }
            });
        });
        
        // URL preview
        urlInput.addEventListener('input', () => {
            const url = urlInput.value.trim();
            if (url && this.isValidImageUrl(url)) {
                urlPreview.innerHTML = `<img src="${url}" class="preview-image" alt="미리보기">`;
            } else {
                urlPreview.innerHTML = '';
            }
        });
        
        // Initial URL preview
        if (urlInput.value && this.isValidImageUrl(urlInput.value)) {
            urlPreview.innerHTML = `<img src="${urlInput.value}" class="preview-image" alt="미리보기">`;
        }
        
        // File upload
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.handleFileSelect(files[0], uploadPreview);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0], uploadPreview);
            }
        });
        
        // Apply button
        applyButton.addEventListener('click', () => {
            const activeOption = document.querySelector('.image-option.active');
            
            if (activeOption.dataset.type === 'url') {
                const url = urlInput.value.trim();
                if (url && this.isValidImageUrl(url)) {
                    this.applyBlogImageChange(url);
                } else {
                    alert('올바른 이미지 URL을 입력해주세요.');
                    return;
                }
            } else {
                const previewImg = uploadPreview.querySelector('img');
                if (previewImg) {
                    this.applyBlogImageChange(previewImg.src);
                } else {
                    alert('이미지 파일을 선택해주세요.');
                    return;
                }
            }
            
            document.querySelector('.image-modal').remove();
        });
    }
    
    applyBlogImageChange(newSrc) {
        if (this.currentBlogImageElement) {
            this.currentBlogImageElement.style.backgroundImage = `url('${newSrc}')`;
            
            // Store blog image changes
            const blogImageChanges = JSON.parse(localStorage.getItem('dongyang_blog_image_changes') || '{}');
            const imageId = this.getBlogImageIdentifier(this.currentBlogImageElement);
            blogImageChanges[imageId] = newSrc;
            localStorage.setItem('dongyang_blog_image_changes', JSON.stringify(blogImageChanges));
            
            // Show success notification
            alert('이미지 적용이 완료되었습니다!');
            this.showNotification('블로그 카드 이미지가 변경되었습니다!', 'success');
        }
    }
    
    getBlogImageIdentifier(blogImg) {
        const currentPage = this.getCurrentPageName();
        const parent = blogImg.closest('.blog-card');
        const allBlogCards = document.querySelectorAll('.blog-card');
        const index = Array.from(allBlogCards).indexOf(parent);
        return `${currentPage}_blog_card_${index}`;
    }
    
    loadSavedBlogImageChanges() {
        const blogImageChanges = JSON.parse(localStorage.getItem('dongyang_blog_image_changes') || '{}');
        const blogImages = document.querySelectorAll('.blog-image');
        
        blogImages.forEach(img => {
            const imageId = this.getBlogImageIdentifier(img);
            if (blogImageChanges[imageId]) {
                img.style.backgroundImage = `url('${blogImageChanges[imageId]}')`;
            }
        });
    }
    
    showImageEditor(imageElement) {
        this.currentImageElement = imageElement;
        
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-editor">
                <button class="modal-close" onclick="this.closest('.image-modal').remove()">&times;</button>
                <h3>이미지 변경</h3>
                
                <div class="image-options">
                    <div class="image-option active" data-type="url">
                        <div style="font-weight: bold; margin-bottom: 5px;">URL로 변경</div>
                        <div style="font-size: 12px; color: #6b7280;">웹 주소를 입력하세요</div>
                    </div>
                    <div class="image-option" data-type="upload">
                        <div style="font-weight: bold; margin-bottom: 5px;">파일 업로드</div>
                        <div style="font-size: 12px; color: #6b7280;">컴퓨터에서 선택</div>
                    </div>
                </div>
                
                <div id="url-section">
                    <input type="text" class="url-input" id="image-url" placeholder="이미지 URL을 입력하세요 (예: https://example.com/image.jpg)" value="${imageElement.src}">
                    <div id="url-preview"></div>
                </div>
                
                <div id="upload-section" style="display: none;">
                    <div class="upload-area" id="upload-area">
                        <div>
                            <svg style="width: 48px; height: 48px; margin: 0 auto 16px; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <div style="font-weight: bold; margin-bottom: 8px;">파일을 드래그하거나 클릭하여 선택</div>
                            <div style="font-size: 12px; color: #6b7280;">JPG, PNG, GIF 파일 지원</div>
                        </div>
                        <input type="file" id="image-file" accept="image/*" style="display: none;">
                    </div>
                    <div id="upload-preview"></div>
                </div>
                
                <div class="image-editor-buttons">
                    <button class="btn-secondary" onclick="this.closest('.image-modal').remove()">취소</button>
                    <button class="btn-primary" id="apply-image">적용</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupImageEditor();
    }
    
    setupImageEditor() {
        const options = document.querySelectorAll('.image-option');
        const urlSection = document.getElementById('url-section');
        const uploadSection = document.getElementById('upload-section');
        const urlInput = document.getElementById('image-url');
        const urlPreview = document.getElementById('url-preview');
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('image-file');
        const uploadPreview = document.getElementById('upload-preview');
        const applyButton = document.getElementById('apply-image');
        
        // Option switching
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                if (option.dataset.type === 'url') {
                    urlSection.style.display = 'block';
                    uploadSection.style.display = 'none';
                } else {
                    urlSection.style.display = 'none';
                    uploadSection.style.display = 'block';
                }
            });
        });
        
        // URL preview
        urlInput.addEventListener('input', () => {
            const url = urlInput.value.trim();
            if (url && this.isValidImageUrl(url)) {
                urlPreview.innerHTML = `<img src="${url}" class="preview-image" alt="미리보기">`;
            } else {
                urlPreview.innerHTML = '';
            }
        });
        
        // Initial URL preview
        if (urlInput.value && this.isValidImageUrl(urlInput.value)) {
            urlPreview.innerHTML = `<img src="${urlInput.value}" class="preview-image" alt="미리보기">`;
        }
        
        // File upload
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.handleFileSelect(files[0], uploadPreview);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0], uploadPreview);
            }
        });
        
        // Apply button
        applyButton.addEventListener('click', () => {
            const activeOption = document.querySelector('.image-option.active');
            
            if (activeOption.dataset.type === 'url') {
                const url = urlInput.value.trim();
                if (url && this.isValidImageUrl(url)) {
                    this.applyImageChange(url);
                } else {
                    alert('올바른 이미지 URL을 입력해주세요.');
                    return;
                }
            } else {
                const previewImg = uploadPreview.querySelector('img');
                if (previewImg) {
                    this.applyImageChange(previewImg.src);
                } else {
                    alert('이미지 파일을 선택해주세요.');
                    return;
                }
            }
            
            document.querySelector('.image-modal').remove();
        });
    }
    
    handleFileSelect(file, previewContainer) {
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            previewContainer.innerHTML = `<img src="${e.target.result}" class="preview-image" alt="미리보기">`;
        };
        reader.readAsDataURL(file);
    }
    
    isValidImageUrl(url) {
        try {
            new URL(url);
            return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes('unsplash.com') || url.includes('images.');
        } catch {
            return false;
        }
    }
    
    applyImageChange(newSrc) {
        if (this.currentImageElement) {
            this.currentImageElement.src = newSrc;
            
            // Store image changes
            const imageChanges = JSON.parse(localStorage.getItem('dongyang_image_changes') || '{}');
            const imageId = this.getImageIdentifier(this.currentImageElement);
            imageChanges[imageId] = newSrc;
            localStorage.setItem('dongyang_image_changes', JSON.stringify(imageChanges));
            
            // Show success notification
            alert('이미지 적용이 완료되었습니다!');
            this.showNotification('이미지가 변경되었습니다!', 'success');
        }
    }
    
    getImageIdentifier(img) {
        // Create a unique identifier for the image based on its position, alt text, and current page
        const currentPage = this.getCurrentPageName();
        const parent = img.parentElement;
        const siblings = Array.from(parent.querySelectorAll('img'));
        const index = siblings.indexOf(img);
        const alt = img.alt || '';
        const parentClass = parent.className || '';
        const src = img.src.split('/').pop() || ''; // Get filename from src
        return `${currentPage}_${parentClass}_${index}_${alt}_${src}`.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    }
    
    getCurrentPageName() {
        const path = window.location.pathname;
        if (path === '/' || path.includes('index.html')) return 'home';
        if (path.includes('column.html')) return 'column';
        if (path.includes('blog.html')) return 'blog';
        if (path.includes('treatment.html')) return 'treatment';
        if (path.includes('consultation.html')) return 'consultation';
        if (path.includes('location.html')) return 'location';
        return 'unknown';
    }
    
    loadSavedImageChanges() {
        const imageChanges = JSON.parse(localStorage.getItem('dongyang_image_changes') || '{}');
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            const imageId = this.getImageIdentifier(img);
            if (imageChanges[imageId]) {
                img.src = imageChanges[imageId];
            }
        });
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? '#059669' : '#dc2626';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 20px;
            border-radius: 6px;
            z-index: 3000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    markEditableBackgrounds() {
        const backgroundElements = document.querySelectorAll('section, .hero-section, .bg-gradient-to-b, .bg-white, .bg-warm-gray-50, .bg-warm-gray-900');
        backgroundElements.forEach(element => {
            if (!element.closest('#admin-panel')) {
                element.classList.add('editable-background');
                element.addEventListener('click', this.handleBackgroundClick.bind(this));
            }
        });
    }
    
    removeEditableBackgrounds() {
        const backgroundElements = document.querySelectorAll('.editable-background');
        backgroundElements.forEach(element => {
            element.classList.remove('editable-background');
            element.removeEventListener('click', this.handleBackgroundClick);
        });
    }
    
    handleBackgroundClick(e) {
        if (this.isAdmin && e.target === e.currentTarget) {
            e.preventDefault();
            e.stopPropagation();
            this.showBackgroundEditor(e.currentTarget);
        }
    }
    
    showBackgroundEditor(backgroundElement) {
        this.currentBackgroundElement = backgroundElement;
        
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="background-editor">
                <button class="modal-close" onclick="this.closest('.image-modal').remove()">&times;</button>
                <h3>배경 변경</h3>
                
                <div class="background-options">
                    <div class="background-option active" data-type="image">
                        <div style="font-weight: bold; margin-bottom: 5px;">🖼️ 이미지</div>
                        <div style="font-size: 12px; color: #6b7280;">배경 이미지 설정</div>
                    </div>
                    <div class="background-option" data-type="color">
                        <div style="font-weight: bold; margin-bottom: 5px;">🎨 단색</div>
                        <div style="font-size: 12px; color: #6b7280;">단일 색상 배경</div>
                    </div>
                    <div class="background-option" data-type="gradient">
                        <div style="font-weight: bold; margin-bottom: 5px;">🌈 그라데이션</div>
                        <div style="font-size: 12px; color: #6b7280;">그라데이션 배경</div>
                    </div>
                </div>
                
                <div id="image-background-section">
                    <input type="text" class="url-input" id="background-image-url" placeholder="배경 이미지 URL을 입력하세요">
                    <div class="upload-area" id="background-upload-area">
                        <div>
                            <svg style="width: 32px; height: 32px; margin: 0 auto 12px; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <div style="font-size: 12px;">파일을 드래그하거나 클릭하여 선택</div>
                        </div>
                        <input type="file" id="background-file" accept="image/*" style="display: none;">
                    </div>
                    <div id="background-preview"></div>
                </div>
                
                <div id="color-background-section" style="display: none;">
                    <div class="color-picker-container">
                        <input type="color" id="background-color" class="color-picker" value="#ffffff">
                        <span>배경 색상 선택</span>
                    </div>
                </div>
                
                <div id="gradient-background-section" style="display: none;">
                    <div class="gradient-presets">
                        <div class="gradient-preset" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)" data-gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"></div>
                        <div class="gradient-preset" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" data-gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"></div>
                        <div class="gradient-preset" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" data-gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"></div>
                        <div class="gradient-preset" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" data-gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"></div>
                        <div class="gradient-preset" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)" data-gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"></div>
                        <div class="gradient-preset" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" data-gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"></div>
                        <div class="gradient-preset" style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" data-gradient="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"></div>
                        <div class="gradient-preset" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" data-gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"></div>
                    </div>
                    <input type="text" class="url-input" id="custom-gradient" placeholder="사용자 정의 그라데이션 CSS (예: linear-gradient(45deg, #ff6b6b, #4ecdc4))">
                </div>
                
                <div class="image-editor-buttons">
                    <button class="btn-secondary" onclick="this.closest('.image-modal').remove()">취소</button>
                    <button class="btn-secondary" id="reset-background">원래대로</button>
                    <button class="btn-primary" id="apply-background">적용</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupBackgroundEditor();
    }
    
    setupBackgroundEditor() {
        const options = document.querySelectorAll('.background-option');
        const imageSection = document.getElementById('image-background-section');
        const colorSection = document.getElementById('color-background-section');
        const gradientSection = document.getElementById('gradient-background-section');
        const imageUrlInput = document.getElementById('background-image-url');
        const backgroundPreview = document.getElementById('background-preview');
        const uploadArea = document.getElementById('background-upload-area');
        const fileInput = document.getElementById('background-file');
        const colorPicker = document.getElementById('background-color');
        const gradientPresets = document.querySelectorAll('.gradient-preset');
        const customGradientInput = document.getElementById('custom-gradient');
        const applyButton = document.getElementById('apply-background');
        const resetButton = document.getElementById('reset-background');
        
        // Option switching
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                imageSection.style.display = 'none';
                colorSection.style.display = 'none';
                gradientSection.style.display = 'none';
                
                switch(option.dataset.type) {
                    case 'image':
                        imageSection.style.display = 'block';
                        break;
                    case 'color':
                        colorSection.style.display = 'block';
                        break;
                    case 'gradient':
                        gradientSection.style.display = 'block';
                        break;
                }
            });
        });
        
        // Image URL preview
        imageUrlInput.addEventListener('input', () => {
            const url = imageUrlInput.value.trim();
            if (url && this.isValidImageUrl(url)) {
                backgroundPreview.innerHTML = `<div style="width: 100%; height: 100px; background-image: url('${url}'); background-size: cover; background-position: center; border-radius: 6px; margin: 10px 0;"></div>`;
            } else {
                backgroundPreview.innerHTML = '';
            }
        });
        
        // File upload for background
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.handleBackgroundFileSelect(files[0], backgroundPreview);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleBackgroundFileSelect(e.target.files[0], backgroundPreview);
            }
        });
        
        // Gradient presets
        gradientPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                gradientPresets.forEach(p => p.classList.remove('active'));
                preset.classList.add('active');
                customGradientInput.value = preset.dataset.gradient;
            });
        });
        
        // Apply button
        applyButton.addEventListener('click', () => {
            const activeOption = document.querySelector('.background-option.active');
            
            switch(activeOption.dataset.type) {
                case 'image':
                    const imageUrl = imageUrlInput.value.trim();
                    const uploadedImage = backgroundPreview.querySelector('div[style*="background-image"]');
                    
                    if (imageUrl && this.isValidImageUrl(imageUrl)) {
                        this.applyBackgroundChange(`url('${imageUrl}')`);
                    } else if (uploadedImage) {
                        const backgroundImage = uploadedImage.style.backgroundImage;
                        this.applyBackgroundChange(backgroundImage);
                    } else {
                        alert('이미지 URL을 입력하거나 파일을 선택해주세요.');
                        return;
                    }
                    break;
                    
                case 'color':
                    this.applyBackgroundChange(colorPicker.value);
                    break;
                    
                case 'gradient':
                    const customGradient = customGradientInput.value.trim();
                    const activePreset = document.querySelector('.gradient-preset.active');
                    
                    if (customGradient) {
                        this.applyBackgroundChange(customGradient);
                    } else if (activePreset) {
                        this.applyBackgroundChange(activePreset.dataset.gradient);
                    } else {
                        alert('그라데이션을 선택하거나 사용자 정의 그라데이션을 입력해주세요.');
                        return;
                    }
                    break;
            }
            
            document.querySelector('.image-modal').remove();
        });
        
        // Reset button
        resetButton.addEventListener('click', () => {
            this.resetBackground();
            document.querySelector('.image-modal').remove();
        });
    }
    
    handleBackgroundFileSelect(file, previewContainer) {
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            previewContainer.innerHTML = `<div style="width: 100%; height: 100px; background-image: url('${e.target.result}'); background-size: cover; background-position: center; border-radius: 6px; margin: 10px 0;"></div>`;
        };
        reader.readAsDataURL(file);
    }
    
    applyBackgroundChange(backgroundValue) {
        if (this.currentBackgroundElement) {
            if (backgroundValue.startsWith('url(') || backgroundValue.includes('gradient')) {
                this.currentBackgroundElement.style.backgroundImage = backgroundValue;
                this.currentBackgroundElement.style.backgroundSize = 'cover';
                this.currentBackgroundElement.style.backgroundPosition = 'center';
                this.currentBackgroundElement.style.backgroundRepeat = 'no-repeat';
            } else {
                // It's a color
                this.currentBackgroundElement.style.background = backgroundValue;
            }
            
            // Store background changes
            const backgroundChanges = JSON.parse(localStorage.getItem('dongyang_background_changes') || '{}');
            const elementId = this.getBackgroundElementIdentifier(this.currentBackgroundElement);
            backgroundChanges[elementId] = {
                backgroundImage: this.currentBackgroundElement.style.backgroundImage,
                background: this.currentBackgroundElement.style.background,
                backgroundSize: this.currentBackgroundElement.style.backgroundSize,
                backgroundPosition: this.currentBackgroundElement.style.backgroundPosition,
                backgroundRepeat: this.currentBackgroundElement.style.backgroundRepeat
            };
            localStorage.setItem('dongyang_background_changes', JSON.stringify(backgroundChanges));
            
            this.showNotification('배경이 변경되었습니다!', 'success');
        }
    }
    
    resetBackground() {
        if (this.currentBackgroundElement) {
            this.currentBackgroundElement.style.background = '';
            this.currentBackgroundElement.style.backgroundImage = '';
            this.currentBackgroundElement.style.backgroundSize = '';
            this.currentBackgroundElement.style.backgroundPosition = '';
            this.currentBackgroundElement.style.backgroundRepeat = '';
            
            // Remove from storage
            const backgroundChanges = JSON.parse(localStorage.getItem('dongyang_background_changes') || '{}');
            const elementId = this.getBackgroundElementIdentifier(this.currentBackgroundElement);
            delete backgroundChanges[elementId];
            localStorage.setItem('dongyang_background_changes', JSON.stringify(backgroundChanges));
            
            this.showNotification('배경이 원래대로 복원되었습니다!', 'success');
        }
    }
    
    getBackgroundElementIdentifier(element) {
        const currentPage = this.getCurrentPageName();
        const tagName = element.tagName.toLowerCase();
        const className = element.className || '';
        const parent = element.parentElement;
        const siblings = Array.from(parent.children).filter(el => el.tagName === element.tagName);
        const index = siblings.indexOf(element);
        return `${currentPage}_${tagName}_${className.replace(/\s+/g, '_')}_${index}`.replace(/[^a-zA-Z0-9_]/g, '');
    }
    
    loadSavedBackgroundChanges() {
        const backgroundChanges = JSON.parse(localStorage.getItem('dongyang_background_changes') || '{}');
        const backgroundElements = document.querySelectorAll('.editable-background');
        
        backgroundElements.forEach(element => {
            const elementId = this.getBackgroundElementIdentifier(element);
            if (backgroundChanges[elementId]) {
                const changes = backgroundChanges[elementId];
                if (changes.backgroundImage) element.style.backgroundImage = changes.backgroundImage;
                if (changes.background) element.style.background = changes.background;
                if (changes.backgroundSize) element.style.backgroundSize = changes.backgroundSize;
                if (changes.backgroundPosition) element.style.backgroundPosition = changes.backgroundPosition;
                if (changes.backgroundRepeat) element.style.backgroundRepeat = changes.backgroundRepeat;
            }
        });
    }
    
    handleElementClick(e) {
        if (this.isAdmin) {
            e.target.classList.add('editing');
            e.target.focus();
        }
    }
    
    handleElementBlur(e) {
        e.target.classList.remove('editing');
    }
    
    handleElementKeypress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.target.blur();
        }
    }
    
    addAdminKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'a') {
                e.preventDefault();
                if (this.isAdmin) {
                    this.disableAdminMode();
                } else {
                    this.showLoginModal();
                }
            }
        });
    }
    
    saveChanges() {
        const changes = {};
        this.editableElements.forEach((element, index) => {
            const originalKey = `element_${index}`;
            changes[originalKey] = element.innerHTML;
        });
        
        localStorage.setItem('dongyang_content_changes', JSON.stringify(changes));
        
        this.showNotification('모든 변경사항이 저장되었습니다!');
    }
    
    loadSavedChanges() {
        const savedChanges = localStorage.getItem('dongyang_content_changes');
        if (savedChanges) {
            try {
                const changes = JSON.parse(savedChanges);
                Object.keys(changes).forEach(key => {
                    const index = parseInt(key.replace('element_', ''));
                    if (this.editableElements[index]) {
                        this.editableElements[index].innerHTML = changes[key];
                    }
                });
            } catch (e) {
                console.error('저장된 변경사항을 불러올 수 없습니다:', e);
            }
        }
    }
}

// Initialize admin manager
let adminManager;

document.addEventListener('DOMContentLoaded', function() {
    adminManager = new AdminManager();
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
    
    // Blog card click handlers
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        });
        
        // Add keyboard support
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const url = this.getAttribute('data-url');
                if (url) {
                    window.location.href = url;
                }
            }
        });
        
        // Make it focusable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
    });
});