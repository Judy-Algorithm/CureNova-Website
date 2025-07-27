// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // 检查认证状态
    checkAuthStatus();
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    console.log('Nav toggle element:', navToggle);
    console.log('Nav links element:', navLinks);
    
    if (navToggle && navLinks) {
        console.log('Adding click event listener to nav toggle');
        
        navToggle.addEventListener('click', function(e) {
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
        });
        
        // 添加触摸事件支持
        navToggle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Touch event on nav toggle');
        });
        
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
    }

    // Smooth scrolling for navigation links
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
        
        .nav-links.active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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
        alert('Google登录失败，请稍后重试');
    }
}

async function handleGitHubLogin() {
    try {
        // 重定向到 GitHub OAuth
        window.location.href = 'https://curenova-website-backend.onrender.com/api/oauth/github';
    } catch (error) {
        console.error('GitHub login error:', error);
        alert('GitHub登录失败，请稍后重试');
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
            alert('注册成功！请检查您的邮箱以确认注册。');
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
                window.location.href = 'index.html';
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
        console.error('注册错误:', error);
        alert('注册失败，请检查网络连接');
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
            // 保存token到localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            alert('登录成功！欢迎回到CureNova Bioscience');
            // 关闭登录模态框
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.style.display = 'none';
            }
            // 更新UI显示用户信息
            if (window.authAPI && window.authAPI.updateAuthUI) {
                window.authAPI.updateAuthUI();
            } else {
                updateUserInterface(data.user);
            }
            // 延迟跳转，确保UI更新完成
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 100);
        } else {
            // 处理详细的错误信息
            let errorMessage = '登录失败，请检查邮箱和密码';
            if (data.error) {
                errorMessage = data.error;
                // 如果是邮箱未验证的错误，提供重新发送验证邮件的选项
                if (data.error.includes('邮箱') || data.error.includes('验证')) {
                    const resend = confirm('您的邮箱可能未验证。是否要重新发送验证邮件？');
                    if (resend) {
                        const email = document.getElementById('loginEmail')?.value || '';
                        if (email) {
                            resendVerificationEmail(email);
                        } else {
                            alert('请先输入邮箱地址');
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
        alert('登录失败，请检查网络连接');
    }
}

// Update UI after login
function updateUserInterface(user) {
    // 更新导航栏显示用户信息
    const signupBtn = document.querySelector('.signup-btn') || document.getElementById('signupBtn');
    if (signupBtn && user) {
        signupBtn.innerHTML = `
            <i class="fas fa-user"></i>
            ${user.name}
        `;
        signupBtn.href = '#';
        signupBtn.onclick = function(e) {
            e.preventDefault();
            // 显示用户菜单或登出选项
            showUserMenu();
        };
    }
}

// Show user menu
function showUserMenu() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const choice = confirm(`欢迎，${user.name}！\n点击确定登出，取消关闭菜单。`);
        if (choice) {
            logout();
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // 恢复原始Sign Up按钮
    const signupBtn = document.querySelector('.signup-btn') || document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.innerHTML = `
            <i class="fas fa-user-plus"></i>
            Sign Up
        `;
        signupBtn.href = 'signup.html';
        signupBtn.onclick = null;
    }
    
    alert('已成功登出');
}

// Check if user is logged in on page load
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        updateUserInterface(JSON.parse(user));
    }
} 

// 重新发送验证邮件
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
            alert('验证邮件已重新发送，请检查您的邮箱');
            return data;
        } else {
            alert(`发送失败: ${data.error}`);
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('重新发送验证邮件错误:', error);
        alert('发送失败，请稍后重试');
    }
}

// 将函数添加到全局作用域
window.resendVerificationEmail = resendVerificationEmail; 

 