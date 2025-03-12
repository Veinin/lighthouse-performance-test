import fs from 'fs';
import path from 'path';
import { ReportGenerator } from 'lighthouse/report/generator/report-generator.js';

export function generateDatePath() {
    const now = new Date();

    // 获取年、月、日、时、分、秒
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要+1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // 格式化为 "YYYY-MM-DD-HH:MM:SS" 字符串
    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
}

/**
 * 生成并保存测试报告
 * @param {Object} result - Lighthouse测试结果
 * @param {string} url - 测试的URL
 * @param {string} pagePath - 页面路径
 * @param {string} reportDir - 报告保存目录
 */
export async function generateReport(result, url, pagePath, reportDir) {
    const pageName = pagePath === '/' ? 'home' : pagePath.replace(/\//g, '_').replace(/^_/, '');

    // 保存HTML报告
    const lhr = result.lhr;
    const report = ReportGenerator.generateReport(lhr, 'html');
    const htmlPath = path.join(reportDir, `${pageName}.html`);
    fs.writeFileSync(htmlPath, report);
    console.log(`HTML报告已保存至: ${htmlPath}`);

    // 打印性能评分
    console.log('性能评分:');
    Object.keys(result.lhr.categories).forEach(category => {
        console.log(`${result.lhr.categories[category].title}: ${result.lhr.categories[category].score * 100}/100`);
    });

    return {
        url,
        scores: result.lhr.categories
    };
}