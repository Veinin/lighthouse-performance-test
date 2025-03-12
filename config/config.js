export default {
  // 默认Lighthouse配置
  lighthouseConfig: {
    extends: 'lighthouse:default',
    settings: {
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'desktop',
      screenEmulation: {
        mobile: false,
        disabled: false
      },
      throttling: {
        rttMs: 40,
        throughputKbps: 10 * 1024,
        cpuSlowdownMultiplier: 1,
      },
    },
  },
  
  // 测试站点配置
  sites: [
    {
      name: 'Test_Github',
      baseUrl: 'https://github.com',
      loginUrl: 'https://github.com/login',
      // 登录表单选择器
      loginSelectors: {
        username: '#login_field',
        password: '#password',
        submitButton: 'input.js-sign-in-button'
      },
      // 登录凭据
      credentials: {
        username: 'username',
        password: 'password'
      },
      // 登录成功后的验证选择器（用于确认已经登录）
      authCheckSelector: 'img.avatar',
      // 需要测试的页面路径（相对于baseUrl）
      pagesToTest: [
        '/',
        '/dashboard',
        '/issues',
        '/pulls'
      ]
    }
    // 可以添加更多站点
  ],
  
  // 报告输出配置
  reports: {
    outputDir: './reports',
    // 是否生成性能摘要
    generateSummary: true
  }
};
