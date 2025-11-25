const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class ExtensionAnalytics {
    constructor() {
        this.extensionsDir = path.join(__dirname, '..', 'extensions');
    }

    generateReport() {
        const extensions = this.scanExtensions();
        const report = this.analyzeExtensions(extensions);
        this.displayReport(report);
        return report;
    }

    scanExtensions() {
        const extensions = [];
        const items = fs.readdirSync(this.extensionsDir);

        items.forEach(item => {
            const extPath = path.join(this.extensionsDir, item);
            if (fs.statSync(extPath).isDirectory()) {
                const packageJsonPath = path.join(extPath, 'package.json');
                const stats = fs.statSync(extPath);

                if (fs.existsSync(packageJsonPath)) {
                    try {
                        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                        extensions.push({
                            name: packageJson.name,
                            version: packageJson.version,
                            displayName: packageJson.displayName,
                            publisher: packageJson.publisher,
                            installedSize: this.getFolderSize(extPath),
                            installDate: stats.birthtime,
                            lastUpdated: stats.mtime,
                            category: packageJson.categories ? packageJson.categories[0] : 'Other'
                        });
                    } catch (error) {
                        // Skip invalid package.json
                    }
                }
            }
        });

        return extensions;
    }

    getFolderSize(folderPath) {
        let size = 0;

        function calculateSize(currentPath) {
            const items = fs.readdirSync(currentPath);
            items.forEach(item => {
                const itemPath = path.join(currentPath, item);
                const stat = fs.statSync(itemPath);

                if (stat.isDirectory()) {
                    calculateSize(itemPath);
                } else {
                    size += stat.size;
                }
            });
        }

        calculateSize(folderPath);
        return this.formatBytes(size);
    }

    formatBytes(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    analyzeExtensions(extensions) {
        const categories = {};
        let totalSize = 0;

        extensions.forEach(ext => {
            // Extract numeric size for calculation
            const sizeValue = parseFloat(ext.installedSize);
            totalSize += sizeValue;

            if (categories[ext.category]) {
                categories[ext.category]++;
            } else {
                categories[ext.category] = 1;
            }
        });

        return {
            totalExtensions: extensions.length,
            categories,
            totalSize: this.formatBytes(totalSize * 1024), // Convert back to bytes approximation
            byPublisher: this.groupByPublisher(extensions),
            recentlyUpdated: extensions
                .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
                .slice(0, 5)
        };
    }

    groupByPublisher(extensions) {
        const publishers = {};
        extensions.forEach(ext => {
            const publisher = ext.publisher || 'unknown';
            if (publishers[publisher]) {
                publishers[publisher]++;
            } else {
                publishers[publisher] = 1;
            }
        });
        return publishers;
    }

    displayReport(report) {
        console.log(chalk.cyan('\n📊 VS Code Extensions Analytics Report'));
        console.log(chalk.cyan('=====================================\n'));

        console.log(chalk.green(`Total Extensions: ${report.totalExtensions}`));
        console.log(chalk.green(`Total Size: ${report.totalSize}\n`));

        console.log(chalk.yellow('📁 Categories:'));
        Object.entries(report.categories).forEach(([category, count]) => {
            console.log(`  ${category}: ${count}`);
        });

        console.log(chalk.yellow('\n🏢 Publishers:'));
        Object.entries(report.byPublisher).forEach(([publisher, count]) => {
            console.log(`  ${publisher}: ${count}`);
        });

        console.log(chalk.yellow('\n🕒 Recently Updated:'));
        report.recentlyUpdated.forEach(ext => {
            console.log(`  ${ext.displayName} (${ext.version})`);
        });
    }
}

module.exports = ExtensionAnalytics;
