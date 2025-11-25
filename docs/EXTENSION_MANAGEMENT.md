# VS Code Extension Management Guide

## Overview
This project provides tools and scripts for managing VS Code extensions in a development environment.

## Quick Start

```bash
# Setup development environment
node scripts/setup-dev.js

# Generate extension analytics
node scripts/extension-analytics.js

# Backup extensions
node scripts/extension-manager.js backup

# Restore extensions
node scripts/extension-manager.js restore
```

## Scripts Overview

### Extension Manager
- Scan and catalog installed extensions
- Backup extension configurations
- Restore extensions from backup
- Generate workspace recommendations

### Development Setup
- Configure VS Code workspace settings
- Setup launch configurations
- Create build tasks
- Install recommended extensions

### Analytics Dashboard
- Extension usage statistics
- Category breakdown
- Size analysis
- Update tracking

## Best Practices
1. **Regular Backups**: Use the extension manager to backup your configuration
2. **Workspace Settings**: Keep workspace-specific settings in .vscode/settings.json
3. **Extension Recommendations**: Share your essential extensions with the team
4. **Size Management**: Monitor extension sizes to maintain performance

## Custom Extension Development
See [DEVELOPMENT.md](./DEVELOPMENT.md) for guidance on creating custom extensions.
