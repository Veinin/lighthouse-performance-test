import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import fs from 'fs';
import path from 'path';
import config from '../config/config.js';
import login from './utils/login.js';
import { generateReport } from './utils/report.js';
import { generateDatePath } from './utils/report.js';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

async function main() {
    const argv = yargs(hideBin(process.argv))
        .option('site', {
            alias: 's',
            describe: '要测试的站点名称',
            default: config.sites[0].name
        })
        .option('pages', {
            alias: 'p',
            describe: '要测试的页面路径（逗号分隔）',
            type: 'string'
        })
        .help()
        .argv;

    // 找到要测试的站点配置
    const siteConfig = config.sites.find(site => site.name === argv.site);
    if (!siteConfig) {
        console.error(`找不到站点: ${argv.site}`);
        process.exit(1);
    }

    // 确定要测试的页面
    const pagesToTest = argv.pages
        ? argv.pages.split(',')
        : siteConfig.pagesToTest;

    console.log(`准备测试站点: ${siteConfig.name}`);
    console.log(`将测试页面: ${pagesToTest.join(', ')}`);

    const browser = await puppeteer.launch({
        headless: false,  // 设置为true可以隐藏浏览器界面
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        // 登录
        const page = await browser.newPage();
        await login(page, siteConfig);

        // 获取登录后的cookies
        const cookies = await browser.cookies();

        // 创建报告目录
        const dateStr = generateDatePath();
        const reportDir = path.join(config.reports.outputDir, siteConfig.name, dateStr);
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }

        const results = [];

        // 对每个页面运行测试
        for (const pagePath of pagesToTest) {
            const url = new URL(pagePath, siteConfig.baseUrl).toString();
            console.log(`测试页面: ${url}`);

            // 准备Lighthouse选项
            const options = {
                ...config.lighthouseConfig.settings,
                disableStorageReset: true,
                extraHeaders: {
                    Cookie: cookies.map(c => `${c.name}=${c.value}`).join('; ')
                }
            };

            // 运行测试
            const result = await lighthouse(url, options, undefined, page);

            // 保存报告
            await generateReport(result, url, pagePath, reportDir);

            results.push({
                url,
                scores: result.lhr.categories
            });

            console.log(`完成页面: ${url}\n`);
        }

        // 生成摘要报告
        if (config.reports.generateSummary) {
            const summaryPath = path.join(reportDir, 'summary.json');
            fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
            console.log(`摘要报告已保存至: ${summaryPath}`);
        }
    } finally {
        await browser.close();
    }
}

main().catch(error => {
    console.error('测试过程中发生错误:', error);
    process.exit(1);
});
