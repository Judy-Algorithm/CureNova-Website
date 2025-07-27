// 前端与后端集成的JavaScript代码

// 配置
const API_BASE_URL = 'http://curenova-website-backend.onrender.com/api'; // 生产环境

// 1. Google OAuth登录
function loginWithGoogle() {
  window.location.href = `${API_BASE_URL}/oauth/google/callback`;
}

// 2. GitHub OAuth登录
function loginWithGitHub() {
  window.location.href = `${API_BASE_URL}/oauth/github/callback`;
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
      window.location.href = '/index.html';
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

// 7. 登出
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // 更新UI，隐藏用户头像，显示登录按钮
  updateAuthUI();
  
  // 刷新页面或跳转到主页
          window.location.href = '/index.html';
}

// 8. 发送API请求（带认证）
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

// 9. 获取用户信息
async function getUserProfile() {
  return await apiRequest('/user/profile');
}

// 10. 更新认证UI（显示/隐藏用户头像）
async function updateAuthUI() {
  const token = localStorage.getItem('authToken');
  const signupBtn = document.getElementById('signupBtn');
  
  if (token) {
    // 用户已登录
    try {
      const response = await getUserProfile();
      if (response && response.user) {
        const user = response.user;
        
        // 修改Sign Up按钮为用户名+头像
        if (signupBtn) {
          // 使用真实的用户头像URL
          const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4A90E2&color=fff&size=24&rounded=true`;
          
          signupBtn.innerHTML = `
            <span style="color: white; font-size: 14px; font-weight: 500; margin-right: 8px;">${user.name}</span>
            <img src="${avatarUrl}" alt="User Avatar" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
          `;
          signupBtn.style.display = 'flex';
          signupBtn.style.alignItems = 'center';
          signupBtn.style.cursor = 'pointer';
          
          // 添加鼠标悬停效果
          signupBtn.addEventListener('mouseenter', function() {
            this.innerHTML = `
              <span style="color: white; font-size: 14px; font-weight: 500; margin-right: 8px;">Logout</span>
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
          
          // 添加点击登出事件
          signupBtn.onclick = function(e) {
            e.preventDefault();
            authAPI.logout();
          };
        }
        
        // 更新localStorage中的用户信息
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        // token无效，清除并显示登录按钮
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
    // 用户未登录
    resetSignupButton();
  }
}

// 重置Sign Up按钮为默认状态
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

// 11. 处理OAuth回调
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
        window.location.href = '/index.html';
      }
    }).catch(error => {
      console.error('OAuth callback processing failed:', error);
      alert('Login failed, please try again');
    });
  }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
  // 检查是否是OAuth回调页面
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

// 导出函数供HTML使用
window.authAPI = {
  loginWithGoogle,
  loginWithGitHub,
  registerWithEmail,
  loginWithEmail,
  verifyEmail,
  checkAuthStatus,
  logout,
  getUserProfile,
  updateAuthUI
}; 