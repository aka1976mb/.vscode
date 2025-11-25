const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DevSetup {
    constructor() {
        this.projectRoot = path.join(__dirname, '..');
        this.vscodeDir = path.join(this.projectRoot, '.vscode');
    }

    setupDevelopmentEnvironment() {
        console.log('🚀 Setting up development environment...');
        this.ensureVscodeDir();
        this.setupWorkspaceSettings();
        this.setupLaunchConfig();
        this.setupTasks();
        this.installRecommendedExtensions();
        console.log('✅ Development environment setup complete');
    }

    ensureVscodeDir() {
        if (!fs.existsSync(this.vscodeDir)) {
            fs.mkdirSync(this.vscodeDir, { recursive: true });
        }
    }

    setupWorkspaceSettings() {
        const settings = {
            "files.exclude": {
                "**/node_modules": true,
                "**/dist": true,
                "**/*.js.map": true,
                "**/*.tsbuildinfo": true
            },
            "search.exclude": {
                "**/node_modules": true,
                "**/dist": true,
                "**/coverage": true
            },
            "typescript.preferences.includePackageJsonAutoImports": "auto",
            "editor.codeActionsOnSave": {
                "source.fixAll.eslint": true
            },
            "eslint.validate": [
                "javascript",
                "typescript"
            ]
        };
        fs.writeFileSync(
            path.join(this.vscodeDir, 'settings.json'),
            JSON.stringify(settings, null, 2)
        );
        console.log('📝 Workspace settings configured');
    }

    setupLaunchConfig() {
        const launchConfig = {
            "version": "0.2.0",
            "configurations": [
                {
                    "name": "Run Extension",
                    "type": "extensionHost",
                    "request": "launch",
                    "args": [
                        "--extensionDevelopmentPath=${workspaceFolder}/extensions/aka-enhanced-renderer"
                    ]
                },
                {
                    "name": "Extension Tests",
                    "type": "extensionHost",
                    "request": "launch",
                    "args": [
                        "--extensionDevelopmentPath=${workspaceFolder}",
                        "--extensionTestsPath=${workspaceFolder}/out/test"
                    ]
                }
            ]
        };
        fs.writeFileSync(
            path.join(this.vscodeDir, 'launch.json'),
            JSON.stringify(launchConfig, null, 2)
        );
        console.log('🎯 Launch configurations created');
    }

    setupTasks() {
        const tasks = {
            "version": "2.0.0",
            "tasks": [
                {
                    "label": "Build Extension",
                    "type": "shell",
                    "command": "npm run compile",
                    "group": "build",
                    "presentation": {
                        "echo": true,
                        "reveal": "always",
                        "focus": false,
                        "panel": "shared"
                    },
                    "problemMatcher": "$tsc"
                },
                {
                    "label": "Watch Extension",
                    "type": "shell",
                    "command": "npm run watch",
                    "group": "build",
                    "isBackground": true,
                    "presentation": {
                        "echo": true,
                        "reveal": "always",
                        "focus": false,
                        "panel": "shared"
                    },
                    "problemMatcher": "$tsc-watch"
                }
            ]
        };
        fs.writeFileSync(
            path.join(this.vscodeDir, 'tasks.json'),
            JSON.stringify(tasks, null, 2)
        );
        console.log('⚙️  Task configurations created');
    }

    installRecommendedExtensions() {
        console.log('📦 Checking for recommended extensions...');

        try {
            execSync('code --list-extensions', { stdio: 'pipe' });
            console.log('VS Code command line interface is available');
        } catch (error) {
            console.log('⚠️  VS Code command line interface not available');
            console.log('Please install extensions manually from recommendations');
        }
    }
}

// Run setup if called directly
if (require.main === module) {
    const setup = new DevSetup();
    setup.setupDevelopmentEnvironment();
}

module.exports = DevSetup;
