/**
 * 处理页面登录逻辑
 */
async function login(page, siteConfig) {
    console.log(`开始登录: ${siteConfig.loginUrl}`);

    // 导航到登录页面
    await page.goto(siteConfig.loginUrl, { waitUntil: 'networkidle2' });

    // 填写登录表单
    const { username, password, submitButton } = siteConfig.loginSelectors;
    await page.waitForSelector(username);
    await page.waitForSelector(password);

    // 输入凭据
    await page.type(username, siteConfig.credentials.username);
    await page.type(password, siteConfig.credentials.password);

    // 提交表单
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click(submitButton)
    ]);

    // 验证登录是否成功
    try {
        await page.waitForSelector(siteConfig.authCheckSelector, { timeout: 5000 });
        console.log('登录成功!\n');
    } catch (error) {
        throw new Error('登录失败，无法找到验证元素');
    }

    return true;
}

export default login;
