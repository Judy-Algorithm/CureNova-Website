// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // 检查认证状态
    checkAuthStatus();
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    console.log('Nav toggle element:', navToggle);
    console.log('Nav links element:', navLinks);
    
    // 添加更多调试信息
    if (navToggle) {
        console.log('Nav toggle display style:', getComputedStyle(navToggle).display);
        console.log('Nav toggle z-index:', getComputedStyle(navToggle).zIndex);
        console.log('Nav toggle pointer-events:', getComputedStyle(navToggle).pointerEvents);
    }
    
    if (navToggle && navLinks) {
        console.log('Adding click event listener to nav toggle');
        
        // 使用touchstart和click事件来确保移动端兼容性
        const toggleMenu = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile menu toggle clicked');
            
            const isActive = navLinks.classList.contains('active');
            console.log('Menu is currently active:', isActive);
            
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            console.log('Menu is now active:', navLinks.classList.contains('active'));
            
            // 防止页面滚动
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        };
        
        // 添加多个事件监听器以确保兼容性
        navToggle.addEventListener('click', toggleMenu);
        navToggle.addEventListener('touchstart', toggleMenu);
        
        // 确保汉堡菜单可以点击
        navToggle.style.pointerEvents = 'auto';
        navToggle.style.cursor = 'pointer';
        
        // 点击页面其他地方关闭菜单
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // 点击菜单项时关闭菜单
        const menuLinks = navLinks.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // 添加全局点击监听器来调试
        document.addEventListener('click', function(e) {
            if (e.target === navToggle || navToggle.contains(e.target)) {
                console.log('Global click detected on nav toggle');
            }
        });
    }
    const navLinksAll = document.querySelectorAll('a[href^="#"]');
    navLinksAll.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Modal functionality
    const modal = document.getElementById('download');
    const downloadButtons = document.querySelectorAll('a[href="#download"]');
    const closeBtn = document.querySelector('.close');

    // Open modal
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside (only for download modal)
    if (modal) {
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Navbar scroll effect - 保持黑色背景
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 始终保持黑色背景
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';

        lastScrollTop = scrollTop;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.tech-card, .service-card, .feature-item, .stat-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;

            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const isPlus = finalValue.includes('+');
                const isX = finalValue.includes('x');
                
                let numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
                let currentValue = 0;
                const increment = numericValue / 50;
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        currentValue = numericValue;
                        clearInterval(counter);
                    }
                    
                    let displayValue = Math.floor(currentValue);
                    if (isPercentage) displayValue += '%';
                    if (isPlus) displayValue += '+';
                    if (isX) displayValue += 'x';
                    
                    target.textContent = displayValue;
                }, 30);
                
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    `;
    document.head.appendChild(style);
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', optimizedScrollHandler); 

// Sign Up Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status on page load
    checkAuthStatus();
    // Check if we're on the signup page
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        // Form validation and submission
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!name || !email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }
            
            // 检查密码复杂度
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
            if (!passwordRegex.test(password)) {
                alert('Password must contain at least one uppercase letter, one lowercase letter, and one number');
                return;
            }
            
            // Create FormData object for API call
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            
            // Call API registration function
            handleEmailRegistration(formData);
        });
        
        // Social login buttons (both in signup form and login modal)
        const allSocialBtns = document.querySelectorAll('.social-btn');
        allSocialBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (this.classList.contains('google-btn')) {
                    handleGoogleLogin();
                } else if (this.classList.contains('github-btn')) {
                    handleGitHubLogin();
                } else {
                    const platform = this.textContent.trim().split(' ').pop();
                    alert(`${platform} login functionality will be implemented soon!`);
                }
            });
        });
        
        // Password strength indicator
        const passwordInput = document.getElementById('password');
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = getPasswordStrength(password);
            updatePasswordStrengthIndicator(strength);
        });
    }
    
    // Login Modal Functionality
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const backToSignup = document.getElementById('backToSignup');
    const loginForm = document.querySelector('.login-form');
    
    console.log('Login elements found:', {
        loginBtn: !!loginBtn,
        loginModal: !!loginModal,
        closeLoginModal: !!closeLoginModal,
        backToSignup: !!backToSignup,
        loginForm: !!loginForm
    });
    
    // Function to open login modal
    function openLoginModal() {
        if (loginModal) {
            loginModal.style.display = 'flex';
        }
    }
    
    // Function to close login modal
    function closeLoginModalFunc() {
        if (loginModal) {
            loginModal.style.display = 'none';
        }
    }
    
    if (loginModal) {
        // Open login modal from signup page
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openLoginModal();
            });
        }
        

        
        // Close login modal
        if (closeLoginModal) {
            closeLoginModal.addEventListener('click', function() {
                console.log('Close button clicked');
                closeLoginModalFunc();
            });
        }
        
        // Close modal when clicking outside
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                console.log('Clicked outside modal');
                closeLoginModalFunc();
            }
        });
        
        // Back to signup
        if (backToSignup) {
            backToSignup.addEventListener('click', function(e) {
                e.preventDefault();
                closeLoginModalFunc();
            });
        }
        
        // Close modal with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && loginModal.style.display === 'flex') {
                console.log('ESC key pressed');
                closeLoginModalFunc();
            }
        });
        
        // Login form submission
        if (loginForm) {
            console.log('Login form found, adding submit listener');
            loginForm.addEventListener('submit', function(e) {
                console.log('Login form submitted');
                e.preventDefault();
                
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                console.log('Form data:', { email, password });
                
                // Basic validation
                if (!email || !password) {
                    alert('Please fill in all fields');
                    return;
                }
                
                // Create FormData object for API call
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);
                
                // Call API login function
                handleEmailLogin(formData);
            });
        } else {
            console.error('Login form not found');
        }
        
        // Forgot password functionality
        const forgotPassword = document.querySelector('.forgot-password');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Password reset functionality will be implemented soon!');
            });
        }
    }
});

// Password strength checker
function getPasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score < 2) return 'weak';
    if (score < 4) return 'medium';
    return 'strong';
}

// Update password strength indicator
function updatePasswordStrengthIndicator(strength) {
    const passwordInput = document.getElementById('password');
    const existingIndicator = document.querySelector('.password-strength');
    
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    const indicator = document.createElement('div');
    indicator.className = `password-strength ${strength}`;
    indicator.textContent = `Password strength: ${strength}`;
    
    passwordInput.parentNode.appendChild(indicator);
}

// Add CSS for password strength indicator
const style = document.createElement('style');
style.textContent = `
    .password-strength {
        font-size: 0.8rem;
        margin-top: 0.5rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        text-align: center;
    }
    
    .password-strength.weak {
        background: rgba(255, 0, 0, 0.2);
        color: #ff6b6b;
        border: 1px solid #ff6b6b;
    }
    
    .password-strength.medium {
        background: rgba(255, 165, 0, 0.2);
        color: #ffa500;
        border: 1px solid #ffa500;
    }
    
    .password-strength.strong {
        background: rgba(0, 255, 0, 0.2);
        color: #51cf66;
        border: 1px solid #51cf66;
    }
`;
document.head.appendChild(style); 

// API 基础 URL - 部署后需要更新为实际的后端地址
const API_BASE_URL = 'https://curenova-website-backend.onrender.com/api'; // 后端API地址

// OAuth Login Functions
// async function handleGoogleLogin() {
//     try {
//         // 重定向到后端Google OAuth端点
//         window.location.href = `${API_BASE_URL}/auth/google`;
//     } catch (error) {
//         console.error('Google login error:', error);
//         alert('Google登录失败，请重试');
//     }
// }

// async function handleGitHubLogin() {
//     try {
//         // 重定向到后端GitHub OAuth端点
//         window.location.href = `${API_BASE_URL}/auth/github`;
//     } catch (error) {
//         console.error('GitHub login error:', error);
//         alert('GitHub登录失败，请重试');
//     }
// }

// Email Registration Function
// async function handleEmailRegistration(formData) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/auth/register`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 name: formData.get('name'),
//                 email: formData.get('email'),
//                 password: formData.get('password')
//             })
//         });

//         const data = await response.json();

//         if (response.ok) {
//             alert('注册成功！请检查您的邮箱以完成验证。');
//             // 可以在这里重定向到登录页面或关闭模态框
//         } else {
//             alert(data.message || '注册失败，请重试');
//         }
//     } catch (error) {
//         console.error('Registration error:', error);
//         alert('注册失败，请检查网络连接');
//     }
// }

// Email Login Function
// async function handleEmailLogin(formData) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/auth/login`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 email: formData.get('email'),
//                 password: formData.get('password')
//             })
//         });

//         const data = await response.json();

//         if (response.ok) {
//             // 保存token到localStorage
//             localStorage.setItem('authToken', data.token);
//             localStorage.setItem('user', JSON.stringify(data.user));
            
//             alert('登录成功！欢迎回到CureNova Bioscience');
//             // 关闭登录模态框
//             if (loginModal) {
//                 loginModal.style.display = 'none';
//             }
//             // 更新UI显示用户信息
//             updateUserInterface(data.user);
//         } else {
//             alert(data.message || '登录失败，请检查邮箱和密码');
//         }
//     } catch (error) {
//         console.error('Login error:', error);
//         alert('登录失败，请检查网络连接');
//     }
// }

// 真实的认证函数实现
async function handleGoogleLogin() {
    try {
        // 重定向到 Google OAuth
        window.location.href = 'https://curenova-website-backend.onrender.com/api/oauth/google';
    } catch (error) {
        console.error('Google login error:', error);
        alert('Google login failed, please try again later');
    }
}

async function handleGitHubLogin() {
    try {
        // 重定向到 GitHub OAuth
        window.location.href = 'https://curenova-website-backend.onrender.com/api/oauth/github';
    } catch (error) {
        console.error('GitHub login error:', error);
        alert('GitHub login failed, please try again later');
    }
}

async function handleEmailRegistration(formData) {
    try {
        console.log('开始注册请求...');
        console.log('表单数据:', {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password')
        });
        
        const requestBody = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        console.log('请求URL:', `${API_BASE_URL}/auth/register`);
        console.log('请求体:', requestBody);
        
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log('响应状态:', response.status);
        console.log('响应头:', Object.fromEntries(response.headers.entries()));

        const data = await response.json();
        console.log('响应数据:', data);

        if (response.ok) {
            alert('Registration successful! Please check your email to confirm registration.');
            // 关闭注册模态框
            const signupModal = document.getElementById('signupModal');
            if (signupModal) {
                signupModal.style.display = 'none';
            }
            // 跳转到登录页面或显示登录表单
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.style.display = 'flex';
            } else {
                window.location.href = '/';
            }
        } else {
            console.error('注册失败:', data);
            // 处理详细的错误信息
            let errorMessage = '注册失败，请检查输入信息';
            if (data.error) {
                errorMessage = data.error;
            } else if (data.details && data.details.length > 0) {
                errorMessage = data.details.map(detail => detail.msg).join(', ');
            } else if (data.message) {
                errorMessage = data.message;
            }
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed, please check your network connection');
    }
}

async function handleEmailLogin(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Save token to localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            alert('Login successful! Welcome back to CureNova Bioscience');
            // Close login modal
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.style.display = 'none';
            }
            // Update UI to show user information
            if (window.authAPI && window.authAPI.updateAuthUI) {
                window.authAPI.updateAuthUI();
            } else {
                updateUserInterface(data.user);
            }
            // Delay redirect to ensure UI update completes
            setTimeout(() => {
                window.location.href = '/';
            }, 100);
        } else {
            // Handle detailed error information
            let errorMessage = 'Login failed, please check your email and password';
            if (data.error) {
                errorMessage = data.error;
                // If it's an email verification error, provide option to resend verification email
                if (data.error.includes('email') || data.error.includes('verify') || data.error.includes('verification')) {
                    const resend = confirm('Your email may not be verified. Would you like to resend the verification email?');
                    if (resend) {
                        const email = document.getElementById('loginEmail')?.value || '';
                        if (email) {
                            resendVerificationEmail(email);
                        } else {
                            alert('Please enter your email address first');
                        }
                    }
                }
            } else if (data.message) {
                errorMessage = data.message;
            }
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed, please check your network connection');
    }
}

// Update UI after login
function updateUserInterface(user) {
    // Update navigation bar to show user information
    const signupBtn = document.querySelector('.signup-btn') || document.getElementById('signupBtn');
    if (signupBtn && user) {
        // Create user avatar and name HTML
        const userAvatar = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;
        
        signupBtn.innerHTML = `
            <div class="user-profile">
                <img src="${userAvatar}" alt="${user.name}" class="user-avatar" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}'">
                <span class="user-name">${user.name}</span>
                <i class="fas fa-chevron-down user-dropdown-icon"></i>
            </div>
        `;
        signupBtn.href = '#';
        signupBtn.onclick = function(e) {
            e.preventDefault();
            // Show user menu or logout options
            showUserMenu();
        };
        
        // Add hover effects to change text to "Log out"
        const userProfile = signupBtn.querySelector('.user-profile');
        const userName = userProfile.querySelector('.user-name');
        const originalName = user.name;
        
        signupBtn.addEventListener('mouseenter', function() {
            userName.textContent = 'Log out';
        });
        
        signupBtn.addEventListener('mouseleave', function() {
            userName.textContent = originalName;
        });
        
        // Add user avatar CSS styles
        addUserAvatarStyles();
    }
}

// Add user avatar CSS styles
function addUserAvatarStyles() {
    // Check if styles have already been added
    if (document.getElementById('user-avatar-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'user-avatar-styles';
    style.textContent = `
        .user-profile {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 2px 6px;
            border-radius: 14px;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .user-profile:hover {
            transform: translateY(-1px);
        }
        
        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .user-name {
            color: #fff;
            font-weight: 500;
            font-size: 14px;
            white-space: nowrap;
        }
        
        .user-dropdown-icon {
            color: rgba(255, 255, 255, 0.7);
            font-size: 9px;
            transition: transform 0.3s ease;
        }
        
        .user-profile:hover .user-dropdown-icon {
            transform: rotate(180deg);
        }
        
        /* Mobile adaptation */
        @media (max-width: 768px) {
            .user-profile {
                padding: 4px 8px;
                gap: 6px;
            }
            
            .user-avatar {
                width: 24px;
                height: 24px;
            }
            
            .user-name {
                font-size: 13px;
            }
            
            .user-dropdown-icon {
                font-size: 10px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Show user menu
function showUserMenu() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // 创建用户菜单
        createUserMenu(user);
    }
}

// 创建用户菜单
function createUserMenu(user) {
    // 移除已存在的菜单
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // 创建菜单容器
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-content">
            <div class="user-menu-header">
                <img src="${user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}" alt="${user.name}" class="user-menu-avatar">
                <div class="user-menu-info">
                    <div class="user-menu-name">${user.name}</div>
                    <div class="user-menu-email">${user.email}</div>
                </div>
            </div>
            <div class="user-menu-actions">
                <button class="user-menu-btn logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Log out</span>
                </button>
            </div>
        </div>
    `;
    
    // 添加菜单样式
    addUserMenuStyles();
    
    // 将菜单添加到页面
    document.body.appendChild(menu);
    
    // 点击其他地方关闭菜单
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !e.target.closest('.signup-btn')) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// 添加用户菜单样式
function addUserMenuStyles() {
    if (document.getElementById('user-menu-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'user-menu-styles';
    style.textContent = `
        .user-menu {
            position: fixed;
            top: 80px;
            right: 20px;
            background: #1a1a1a;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            min-width: 280px;
            backdrop-filter: blur(10px);
        }
        
        .user-menu-content {
            padding: 20px;
        }
        
        .user-menu-header {
            display: flex;
            align-items: center;
            gap: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 15px;
        }
        
        .user-menu-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid rgba(255, 255, 255, 0.3);
        }
        
        .user-menu-info {
            flex: 1;
        }
        
        .user-menu-name {
            color: #fff;
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 3px;
        }
        
        .user-menu-email {
            color: rgba(255, 255, 255, 0.6);
            font-size: 13px;
        }
        
        .user-menu-actions {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .user-menu-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 15px;
            background: transparent;
            border: none;
            border-radius: 12px;
            color: #fff;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: left;
            width: 100%;
        }
        
        .user-menu-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .logout-btn {
            color: #ff6b6b;
        }
        
        .logout-btn:hover {
            background: rgba(255, 107, 107, 0.1);
        }
        
        /* Mobile adaptation */
        @media (max-width: 768px) {
            .user-menu {
                top: 70px;
                right: 10px;
                left: 10px;
                min-width: auto;
            }
        }
    `;
    document.head.appendChild(style);
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Restore original Sign Up button
    const signupBtn = document.querySelector('.signup-btn') || document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.innerHTML = `
            <i class="fas fa-user-plus"></i>
            Sign Up
        `;
        signupBtn.href = 'signup.html';
        signupBtn.onclick = null;
    }
    
    // Remove user avatar styles
    const userAvatarStyles = document.getElementById('user-avatar-styles');
    if (userAvatarStyles) {
        userAvatarStyles.remove();
    }
    
    // Remove user menu styles
    const userMenuStyles = document.getElementById('user-menu-styles');
    if (userMenuStyles) {
        userMenuStyles.remove();
    }
    
    // Remove user menu
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.remove();
    }
    
    alert('Successfully logged out');
}

// Check if user is logged in on page load
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        updateUserInterface(JSON.parse(user));
    }
} 

// Resend verification email
async function resendVerificationEmail(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Verification email has been resent, please check your email');
            return data;
        } else {
            alert(`Send failed: ${data.error}`);
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Resend verification email error:', error);
        alert('Send failed, please try again later');
    }
}

// Add functions to global scope
window.resendVerificationEmail = resendVerificationEmail;
window.scriptLogout = logout; 

 