import { Plugin } from 'vite';
import fs from 'fs-extra';
import path from 'path';

interface DistCopyOptions {
    rootDir?: string;
    packagesDir?: string;
    verbose?: boolean;
}

export function viteDistCopy(options: DistCopyOptions = {}): Plugin {
    const {
        rootDir = process.cwd(),
        packagesDir = 'packages',
        verbose = true,
    } = options;
    console.log(
        '🚀~ file.vite-plugin-dist-copy method.viteDistCopy line.17 ----',
        options
    );

    return {
        name: 'vite-plugin-dist-copy',
        enforce: 'post',
        async closeBundle() {
            try {
                const rootDistDir = path.join(rootDir, 'dist');
                await fs.ensureDir(rootDistDir);

                const packagesDirPath = path.join(rootDir, packagesDir);
                const packages = await fs.readdir(packagesDirPath);
                for (const pkg of packages) {
                    const pkgDistDir = path.join(packagesDirPath, pkg, 'dist');
                    const targetDir = path.join(rootDistDir, pkg);
                    if (await fs.pathExists(pkgDistDir)) {
                        await fs.copy(pkgDistDir, targetDir, {
                            overwrite: true,
                            errorOnExist: false,
                        });

                        if (verbose) {
                            console.log(
                                `✓ Copied dist files from ${pkg} to root dist directory`
                            );
                        }
                    }
                }

                if (verbose) {
                    console.log(
                        '✨ All dist files have been copied successfully!'
                    );
                }
            } catch (error) {
                console.error('Error copying dist files:', error);
                throw error;
            }
        },
    };
}
