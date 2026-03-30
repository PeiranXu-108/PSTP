<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-inner">
        <router-link to="/" class="logo" aria-label="回到首页">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="#2563eb" stroke-width="2"/>
            <line x1="12" y1="3" x2="12" y2="21" stroke="#2563eb" stroke-width="2"/>
            <line x1="3" y1="12" x2="21" y2="12" stroke="#2563eb" stroke-width="2"/>
          </svg>
          <span class="logo-text">政治光谱测试</span>
        </router-link>
        <nav class="nav-links" aria-label="主导航">
          <router-link to="/">首页</router-link>
          <router-link to="/stats">数据统计</router-link>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <footer class="app-footer">
      <p>本测试仅供参考与学术探讨，所有答题数据仅保存在您本机浏览器中，不向任何服务器上传。</p>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.app-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text) !important;
  text-decoration: none;
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 4px;
}

.nav-links a {
  color: var(--text-2);
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  transition: var(--transition);
  cursor: pointer;
}

.nav-links a:hover {
  background: var(--bg-subtle);
  color: var(--text);
}

.nav-links a.router-link-exact-active {
  background: var(--primary-light);
  color: var(--primary);
}

.app-main {
  flex: 1;
  max-width: 1120px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px;
}

.app-footer {
  text-align: center;
  padding: 20px 24px;
  color: var(--text-3);
  font-size: 12px;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
}

@media (max-width: 640px) {
  .header-inner { padding: 0 16px; }
  .app-main { padding: 24px 16px; }
  .logo-text { font-size: 15px; }
}
</style>
