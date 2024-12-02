#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

async function copyDistFiles() {
    try {
        // Ensure root dist directory exists
        const rootDistDir = path.join(rootDir, 'dist');
        await fs.ensureDir(rootDistDir);

        // Get all package directories
        const packagesDir = path.join(rootDir, 'packages');
        const packages = await fs.readdir(packagesDir);

        // Track successful copies
        let copiedCount = 0;

        for (const pkg of packages) {
            const pkgDistDir = path.join(packagesDir, pkg, 'dist');
            const targetDir = path.join(rootDistDir, pkg);

            // Check if package has a dist directory
            if (await fs.pathExists(pkgDistDir)) {
                // Copy package dist to root dist while maintaining structure
                await fs.copy(pkgDistDir, targetDir, {
                    overwrite: true,
                    errorOnExist: false,
                });
                console.log(
                    `✓ Copied dist files from ${pkg} to root dist/${pkg}`
                );
                copiedCount++;
            }
        }

        if (copiedCount > 0) {
            console.log(
                `\n✨ Successfully copied dist files from ${copiedCount} package(s)`
            );
        } else {
            console.log(
                '\n⚠️  No dist files found to copy. Make sure packages are built first.'
            );
        }
    } catch (error) {
        console.error('\n❌ Error copying dist files:', error);
        process.exit(1);
    }
}

copyDistFiles();
