// 前端与后端集成的JavaScript代码

// 配置
const API_BASE_URL = 'https://curenova-website-backend.onrender.com/api'; // 生产环境

// 1. Google OAuth登录
function loginWithGoogle() {
  window.location.href = `${API_BASE_URL}/oauth/google`;
}

// 2. GitHub OAuth登录
function loginWithGitHub() {
  window.location.href = `${API_BASE_URL}/oauth/github`;
}

// 3. 邮箱注册
async function registerWithEmail(name, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      alert('Registration successful! Please check your email and click the verification link.');
      return data;
    } else {
      alert(`Registration failed: ${data.error}`);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed, please try again later');
  }
}

// 4. 邮箱登录
async function loginWithEmail(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // 更新UI显示用户头像
      updateAuthUI();
      
      // 跳转到主页
      window.location.href = 'index.html';
      return data;
    } else {
      alert(`Login failed: ${data.error}`);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed, please try again later');
  }
}

// 5. 邮箱验证
async function verifyEmail(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      alert('Email verification successful!');
      return data;
    } else {
      alert(`Email verification failed: ${data.error}`);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Email verification error:', error);
    alert('Email verification failed, please try again later');
  }
}

// 6. 检查认证状态
function checkAuthStatus() {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    return {
      isLoggedIn: true,
      user: JSON.parse(user),
      token
    };
  }
  
  return {
    isLoggedIn: false,
    user: null,
    token: null
  };
}

// 7. Logout
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // Update UI, hide user avatar, show login button
  updateAuthUI();
  
  // Show logout success message
  alert('Successfully logged out');
  
  // Refresh page or redirect to homepage
  window.location.href = 'index.html';
}

// 8. Send API request (with authentication)
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options
  });

  if (response.status === 401) {
    logout();
    return;
  }

  return response.json();
}

// 9. Get user information
async function getUserProfile() {
  return await apiRequest('/user/profile');
}

// 10. Update authentication UI (show/hide user avatar)
async function updateAuthUI() {
  const token = localStorage.getItem('authToken');
  const signupBtn = document.getElementById('signupBtn');
  
  if (token) {
    // User is logged in
    try {
      const response = await getUserProfile();
      if (response && response.user) {
        const user = response.user;
        
        // Modify Sign Up button to show username + avatar
        if (signupBtn) {
          // Use real user avatar URL
          const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4A90E2&color=fff&size=24&rounded=true`;
          
          signupBtn.innerHTML = `
            <span style="color: white; font-size: 14px; font-weight: 500; margin-right: 8px;">${user.name}</span>
            <img src="${avatarUrl}" alt="User Avatar" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
          `;
          signupBtn.style.display = 'flex';
          signupBtn.style.alignItems = 'center';
          signupBtn.style.cursor = 'pointer';
          
          // Add mouse hover effect
          signupBtn.addEventListener('mouseenter', function() {
            this.innerHTML = `
              <span style="color: white; font-size: 14px; font-weight: 500; margin-right: 8px;">Log out</span>
              <img src="${avatarUrl}" alt="User Avatar" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
            `;
            this.style.background = '#dc3545';
            this.style.borderColor = '#c82333';
          });
          
          signupBtn.addEventListener('mouseleave', function() {
            this.innerHTML = `
              <span style="color: white; font-size: 14px; font-weight: 500; margin-right: 8px;">${user.name}</span>
              <img src="${avatarUrl}" alt="User Avatar" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
            `;
            this.style.background = '';
            this.style.borderColor = '';
          });
          
          // Add click logout event
          signupBtn.onclick = function(e) {
            e.preventDefault();
            authAPI.logout();
          };
        }
        
        // Update user information in localStorage
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        // Token invalid, clear and show login button
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        resetSignupButton();
      }
    } catch (error) {
      console.error('Failed to get user information:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      resetSignupButton();
    }
  } else {
    // User not logged in
    resetSignupButton();
  }
}

// Reset Sign Up button to default state
function resetSignupButton() {
  const signupBtn = document.getElementById('signupBtn');
  if (signupBtn) {
    signupBtn.innerHTML = `
      <i class="fas fa-user-plus"></i>
      Sign Up
    `;
    signupBtn.style.display = 'flex';
    signupBtn.style.alignItems = 'center';
    signupBtn.style.cursor = 'pointer';
    signupBtn.style.background = '';
    signupBtn.style.borderColor = '';
    signupBtn.onclick = null;
    signupBtn.href = 'signup.html';
  }
}

// 11. Handle OAuth callback
function handleOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const provider = urlParams.get('provider');
  
  if (token) {
    localStorage.setItem('authToken', token);
    
    getUserProfile().then(response => {
      if (response && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        updateAuthUI();
        alert(`${provider} login successful!`);
        window.location.href = 'index.html';
      }
    }).catch(error => {
      console.error('OAuth callback processing failed:', error);
      alert('Login failed, please try again');
    });
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Check if it's an OAuth callback page
  if (window.location.search.includes('token=')) {
    handleOAuthCallback();
  }
  
  // 检查邮箱验证
  const urlParams = new URLSearchParams(window.location.search);
  const emailToken = urlParams.get('token');
  if (emailToken && window.location.pathname.includes('verify-email')) {
    verifyEmail(emailToken);
  }
  
  // 更新认证UI
  updateAuthUI();
});

// Export functions for HTML use
window.authAPI = {
  loginWithGoogle,
  loginWithGitHub,
  registerWithEmail,
  loginWithEmail,
  verifyEmail,
  checkAuthStatus,
  logout: logout, // Use frontend-integration.js logout function
  getUserProfile,
  updateAuthUI
}; 