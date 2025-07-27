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
      alert('注册成功！请检查您的邮箱并点击验证链接。');
      return data;
    } else {
      alert(`注册失败: ${data.error}`);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('注册错误:', error);
    alert('注册失败，请稍后重试');
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
      window.location.href = '/';
      return data;
    } else {
      alert(`登录失败: ${data.error}`);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('登录错误:', error);
    alert('登录失败，请稍后重试');
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
      alert('邮箱验证成功！');
      return data;
    } else {
      alert(`邮箱验证失败: ${data.error}`);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('邮箱验证错误:', error);
    alert('邮箱验证失败，请稍后重试');
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
  window.location.href = '/';
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
        
        // 隐藏Sign Up按钮
        if (signupBtn) {
          signupBtn.style.display = 'none';
        }
        
        // 显示用户头像
        showUserAvatar(user);
        
        // 更新localStorage中的用户信息
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        // token无效，清除并显示登录按钮
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        hideUserAvatar();
        if (signupBtn) signupBtn.style.display = 'flex';
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      hideUserAvatar();
      if (signupBtn) signupBtn.style.display = 'flex';
    }
  } else {
    // 用户未登录
    hideUserAvatar();
    if (signupBtn) signupBtn.style.display = 'flex';
  }
}

// 11. 显示用户头像
function showUserAvatar(user) {
  let userProfileDisplay = document.getElementById('userProfileDisplay');
  
  if (!userProfileDisplay) {
    userProfileDisplay = document.createElement('div');
    userProfileDisplay.id = 'userProfileDisplay';
    document.body.appendChild(userProfileDisplay);
  }
  
  // 设置样式
  userProfileDisplay.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.95);
    padding: 8px 16px;
    border-radius: 25px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
  `;
  
  // 生成头像URL（如果没有头像，使用用户名的首字母）
  const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4A90E2&color=fff&size=40&rounded=true`;
  
  userProfileDisplay.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <img src="${avatarUrl}" alt="User Avatar" style="
        width: 36px; 
        height: 36px; 
        border-radius: 50%; 
        object-fit: cover; 
        border: 2px solid #4A90E2;
        box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
      ">
      <span style="
        font-weight: 500; 
        color: #333; 
        font-size: 14px;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      ">${user.name}</span>
    </div>
    <button onclick="authAPI.logout()" style="
      padding: 6px 12px; 
      background-color: #dc3545; 
      color: white; 
      border: none; 
      border-radius: 15px; 
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
    " onmouseover="this.style.backgroundColor='#c82333'; this.style.transform='translateY(-1px)'" 
       onmouseout="this.style.backgroundColor='#dc3545'; this.style.transform='translateY(0)'">
      登出
    </button>
  `;
  
  userProfileDisplay.style.display = 'flex';
}

// 12. 隐藏用户头像
function hideUserAvatar() {
  const userProfileDisplay = document.getElementById('userProfileDisplay');
  if (userProfileDisplay) {
    userProfileDisplay.style.display = 'none';
  }
}

// 13. 处理OAuth回调
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
        alert(`${provider} 登录成功！`);
        window.location.href = '/';
      }
    }).catch(error => {
      console.error('OAuth回调处理失败:', error);
      alert('登录失败，请重试');
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