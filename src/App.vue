<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-inner">
        <router-link to="/" class="logo">
          <span class="logo-icon"></span>
          <span class="logo-text">政治光谱测试</span>
        </router-link>
        <nav class="nav-links">
          <router-link to="/">首页</router-link>
          <router-link to="/stats">数据统计</router-link>
        </nav>
      </div>
    </header>
    <main class="app-main">
      <router-view />
    </main>
    <footer class="app-footer">
      <p>本测试仅供参考与学术探讨，所有数据均保存在您的本地浏览器中。</p>
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
}

.app-header {
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1200px;
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
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text) !important;
  text-decoration: none;
}

.logo-icon {
  font-size: 24px;
  color: var(--color-primary);
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-links a {
  color: var(--color-text-secondary);
  font-size: 14px;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--color-primary);
}

.app-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
}

.app-footer {
  text-align: center;
  padding: 24px;
  color: var(--color-text-secondary);
  font-size: 12px;
  border-top: 1px solid var(--color-border);
}

@media (max-width: 640px) {
  .header-inner {
    padding: 0 16px;
  }
  .app-main {
    padding: 20px 16px;
  }
  .logo-text {
    font-size: 15px;
  }
}
</style>
