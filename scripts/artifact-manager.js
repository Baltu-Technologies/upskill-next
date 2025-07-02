#!/usr/bin/env node

/**
 * Comprehensive Artifact Management System for Amplify Gen 2 CI/CD Pipeline
 * 
 * This utility manages build artifacts across all pipeline phases:
 * - Backend Infrastructure (CDK outputs, migrations, database schemas)
 * - Frontend Build (Next.js output, static assets)
 * - Testing (test results, coverage reports, security scans)
 * - Metadata (build info, audit trails, compliance reports)
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class ArtifactManager {
    constructor() {
        this.projectRoot = process.cwd();
        this.artifactDir = path.join(this.projectRoot, 'artifacts');
        this.config = {
            retentionDays: parseInt(process.env.ARTIFACT_RETENTION_DAYS || '30'),
            compression: process.env.ARTIFACT_COMPRESSION === 'true',
            encryption: process.env.ARTIFACT_ENCRYPTION === 'true',
            validation: process.env.ARTIFACT_VALIDATION || 'strict',
            maxArtifactSize: 100 * 1024 * 1024, // 100MB
        };
        this.verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
        this.dryRun = process.argv.includes('--dry-run');
    }

    /**
     * Initialize artifact management system
     */
    async init() {
        this.log('🚀 Initializing Artifact Management System');
        
        try {
            // Create artifact directory structure
            await this.createDirectoryStructure();
            
            // Initialize artifact metadata
            await this.initializeMetadata();
            
            // Setup security configurations
            await this.setupSecurity();
            
            this.log('✅ Artifact management system initialized successfully');
        } catch (error) {
            this.logError('❌ Failed to initialize artifact management system', error);
            throw error;
        }
    }

    /**
     * Create comprehensive directory structure
     */
    async createDirectoryStructure() {
        const directories = [
            // Backend Infrastructure Artifacts
            'backend/cdk-outputs',
            'backend/amplify-outputs', 
            'backend/migrations',
            'backend/migration-reports',
            'backend/schema-validation',
            'backend/infrastructure-config',
            
            // Frontend Build Artifacts
            'frontend/build-output',
            'frontend/static-assets',
            'frontend/bundle-analysis',
            
            // Testing Artifacts
            'testing/test-results',
            'testing/coverage-reports',
            'testing/security-scans',
            
            // Metadata and Audit
            'metadata/build-info',
            'metadata/audit-logs',
            
            // Cache and Temporary
            '.artifact-cache',
            'temp'
        ];

        for (const dir of directories) {
            const fullPath = path.join(this.artifactDir, dir);
            await fs.mkdir(fullPath, { recursive: true });
            this.log(`📁 Created directory: ${dir}`, 'verbose');
        }
    }

    /**
     * Initialize artifact metadata
     */
    async initializeMetadata() {
        const metadata = {
            projectRoot: this.projectRoot,
            initialized: new Date().toISOString(),
            version: '1.0.0',
            branch: process.env.AWS_BRANCH || 'unknown',
            commitId: process.env.AWS_COMMIT_ID || 'unknown',
            buildId: process.env.AWS_BUILD_ID || 'unknown',
            environment: process.env.AWS_BRANCH === 'main' ? 'production' : 'development',
            artifacts: {
                backend: { count: 0, totalSize: 0, lastUpdated: null },
                frontend: { count: 0, totalSize: 0, lastUpdated: null },
                testing: { count: 0, totalSize: 0, lastUpdated: null },
                metadata: { count: 0, totalSize: 0, lastUpdated: null }
            }
        };

        const metadataPath = path.join(this.artifactDir, 'metadata.json');
        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
        this.log('📝 Initialized artifact metadata', 'verbose');
    }

    /**
     * Setup security configurations
     */
    async setupSecurity() {
        const securityConfig = {
            sensitivePatterns: [
                /password\s*[=:]\s*['"]?[^\s'"]+/gi,
                /secret\s*[=:]\s*['"]?[^\s'"]+/gi,
                /api[_-]?key\s*[=:]\s*['"]?[^\s'"]+/gi,
                /token\s*[=:]\s*['"]?[^\s'"]+/gi,
                /-----BEGIN [A-Z ]+-----[\s\S]*?-----END [A-Z ]+-----/gi,
            ],
            allowedExtensions: [
                '.js', '.ts', '.json', '.md', '.txt', '.csv',
                '.html', '.css', '.sql', '.yml', '.yaml',
                '.log', '.report', '.xml'
            ],
            maxFileSize: 10 * 1024 * 1024 // 10MB per file
        };

        const securityPath = path.join(this.artifactDir, '.security-config.json');
        await fs.writeFile(securityPath, JSON.stringify(securityConfig, null, 2));
        this.log('🔒 Security configuration setup complete', 'verbose');
    }

    /**
     * Collect migration artifacts
     */
    async collectMigrations() {
        this.log('📦 Collecting migration artifacts');
        
        try {
            const artifacts = [];
            const migrationsDir = path.join(this.projectRoot, 'migrations');
            
            // Collect migration scripts and logs
            if (await this.pathExists(migrationsDir)) {
                const migrationFiles = await this.findFiles(migrationsDir, ['.sql', '.js', '.log']);
                artifacts.push(...migrationFiles.map(file => ({
                    source: file,
                    destination: path.join(this.artifactDir, 'backend/migrations', path.relative(migrationsDir, file)),
                    type: 'migration'
                })));
            }

            // Collect migration reports
            const reportDirs = [
                '.taskmaster/reports',
                'logs/migrations',
                'temp/migration-reports'
            ];

            for (const reportDir of reportDirs) {
                const fullPath = path.join(this.projectRoot, reportDir);
                if (await this.pathExists(fullPath)) {
                    const reportFiles = await this.findFiles(fullPath, ['.json', '.log', '.txt']);
                    artifacts.push(...reportFiles.map(file => ({
                        source: file,
                        destination: path.join(this.artifactDir, 'backend/migration-reports', path.relative(fullPath, file)),
                        type: 'migration-report'
                    })));
                }
            }

            await this.copyArtifacts(artifacts);
            this.log(`✅ Collected ${artifacts.length} migration artifacts`);
            
        } catch (error) {
            this.logError('❌ Failed to collect migration artifacts', error);
            throw error;
        }
    }

    /**
     * Collect backend infrastructure artifacts
     */
    async collectBackend() {
        this.log('📦 Collecting backend infrastructure artifacts');
        
        try {
            const artifacts = [];
            
            // Collect CDK outputs
            const cdkOutputDirs = [
                'amplify/cdk.out',
                'amplify/.cdk.staging',
                'cdk.out'
            ];

            for (const cdkDir of cdkOutputDirs) {
                const fullPath = path.join(this.projectRoot, cdkDir);
                if (await this.pathExists(fullPath)) {
                    const cdkFiles = await this.findFiles(fullPath, ['.json', '.template', '.yml', '.yaml']);
                    artifacts.push(...cdkFiles.map(file => ({
                        source: file,
                        destination: path.join(this.artifactDir, 'backend/cdk-outputs', path.relative(fullPath, file)),
                        type: 'cdk-output'
                    })));
                }
            }

            // Collect Amplify outputs
            const amplifyOutputs = [
                'amplify_outputs.json',
                'amplify/amplify_outputs.json',
                '.amplify/outputs.json'
            ];

            for (const outputFile of amplifyOutputs) {
                const fullPath = path.join(this.projectRoot, outputFile);
                if (await this.pathExists(fullPath)) {
                    artifacts.push({
                        source: fullPath,
                        destination: path.join(this.artifactDir, 'backend/amplify-outputs', path.basename(outputFile)),
                        type: 'amplify-output'
                    });
                }
            }

            await this.copyArtifacts(artifacts);
            this.log(`✅ Collected ${artifacts.length} backend infrastructure artifacts`);
            
        } catch (error) {
            this.logError('❌ Failed to collect backend artifacts', error);
            throw error;
        }
    }

    /**
     * Collect frontend build artifacts
     */
    async collectFrontend() {
        this.log('📦 Collecting frontend build artifacts');
        
        try {
            const artifacts = [];
            
            // Collect Next.js build output
            const nextBuildDir = path.join(this.projectRoot, '.next');
            if (await this.pathExists(nextBuildDir)) {
                const buildFiles = await this.findFiles(nextBuildDir, ['.js', '.css', '.html', '.json'], {
                    excludeDirs: ['cache']
                });
                
                artifacts.push(...buildFiles.map(file => ({
                    source: file,
                    destination: path.join(this.artifactDir, 'frontend/build-output', path.relative(nextBuildDir, file)),
                    type: 'frontend-build'
                })));
            }

            // Collect static assets
            const staticDirs = ['public', 'static'];
            for (const staticDir of staticDirs) {
                const fullPath = path.join(this.projectRoot, staticDir);
                if (await this.pathExists(fullPath)) {
                    const staticFiles = await this.findFiles(fullPath, ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp']);
                    artifacts.push(...staticFiles.map(file => ({
                        source: file,
                        destination: path.join(this.artifactDir, 'frontend/static-assets', path.relative(fullPath, file)),
                        type: 'static-asset'
                    })));
                }
            }

            await this.copyArtifacts(artifacts);
            this.log(`✅ Collected ${artifacts.length} frontend build artifacts`);
            
        } catch (error) {
            this.logError('❌ Failed to collect frontend artifacts', error);
            throw error;
        }
    }

    /**
     * Collect testing artifacts
     */
    async collectTesting() {
        this.log('📦 Collecting testing artifacts');
        
        try {
            const artifacts = [];
            
            // Collect test results
            const testResultDirs = [
                'test-results',
                'coverage',
                'reports/tests',
                '.nyc_output'
            ];

            for (const testDir of testResultDirs) {
                const fullPath = path.join(this.projectRoot, testDir);
                if (await this.pathExists(fullPath)) {
                    const testFiles = await this.findFiles(fullPath, ['.json', '.xml', '.html', '.txt']);
                    artifacts.push(...testFiles.map(file => ({
                        source: file,
                        destination: path.join(this.artifactDir, 'testing/test-results', path.relative(fullPath, file)),
                        type: 'test-result'
                    })));
                }
            }

            await this.copyArtifacts(artifacts);
            this.log(`✅ Collected ${artifacts.length} testing artifacts`);
            
        } catch (error) {
            this.logError('❌ Failed to collect testing artifacts', error);
            throw error;
        }
    }

    /**
     * Perform security scan on artifacts
     */
    async securityScan() {
        this.log('🔍 Performing security scan on artifacts');
        
        try {
            const securityConfig = JSON.parse(
                await fs.readFile(path.join(this.artifactDir, '.security-config.json'), 'utf8')
            );
            
            const scanResults = {
                scannedFiles: 0,
                sensitiveDataFound: false,
                violations: [],
                timestamp: new Date().toISOString()
            };

            // Scan all collected artifacts
            const artifactFiles = await this.findFiles(this.artifactDir, ['.js', '.ts', '.json', '.txt', '.log']);
            
            for (const file of artifactFiles) {
                const content = await fs.readFile(file, 'utf8');
                scanResults.scannedFiles++;
                
                // Check for sensitive patterns
                for (const pattern of securityConfig.sensitivePatterns) {
                    const matches = content.match(pattern);
                    if (matches) {
                        scanResults.sensitiveDataFound = true;
                        scanResults.violations.push({
                            file: path.relative(this.artifactDir, file),
                            pattern: pattern.toString(),
                            matches: matches.length,
                            severity: 'high'
                        });
                    }
                }
            }

            // Save scan results
            const scanResultsPath = path.join(this.artifactDir, 'testing/security-scans/security-scan-results.json');
            await fs.mkdir(path.dirname(scanResultsPath), { recursive: true });
            await fs.writeFile(scanResultsPath, JSON.stringify(scanResults, null, 2));

            if (scanResults.sensitiveDataFound) {
                this.logError(`⚠️  Security scan found ${scanResults.violations.length} violations`);
            } else {
                this.log('✅ Security scan completed - no sensitive data found');
            }
            
        } catch (error) {
            this.logError('❌ Security scan failed', error);
            throw error;
        }
    }

    /**
     * Finalize artifacts for a specific phase
     */
    async finalize(phase) {
        this.log(`🎯 Finalizing ${phase} artifacts`);
        
        try {
            // Update metadata
            await this.updateMetadata(phase);
            
            // Generate checksums
            await this.generateChecksums(phase);
            
            // Create manifest
            await this.createManifest(phase);
            
            this.log(`✅ ${phase} artifacts finalized successfully`);
            
        } catch (error) {
            this.logError(`❌ Failed to finalize ${phase} artifacts`, error);
            throw error;
        }
    }

    /**
     * Validate artifacts for a specific phase
     */
    async validate(phase) {
        this.log(`🔍 Validating ${phase} artifacts`);
        
        try {
            const phasePath = path.join(this.artifactDir, phase);
            if (!await this.pathExists(phasePath)) {
                throw new Error(`No artifacts found for phase: ${phase}`);
            }

            // Validate checksums
            await this.validateChecksums(phase);
            
            // Validate manifest
            await this.validateManifest(phase);
            
            this.log(`✅ ${phase} artifacts validation successful`);
            
        } catch (error) {
            this.logError(`❌ ${phase} artifacts validation failed`, error);
            throw error;
        }
    }

    /**
     * Download artifacts from a specific phase
     */
    async download(phase) {
        this.log(`⬇️  Downloading ${phase} artifacts`);
        
        try {
            const phasePath = path.join(this.artifactDir, phase);
            
            if (await this.pathExists(phasePath)) {
                this.log(`✅ ${phase} artifacts already available locally`);
            } else {
                this.log(`⚠️  ${phase} artifacts not found locally`);
            }
            
        } catch (error) {
            this.logError(`❌ Failed to download ${phase} artifacts`, error);
            throw error;
        }
    }

    /**
     * Generate comprehensive artifact report
     */
    async generateReport() {
        this.log('📊 Generating comprehensive artifact report');
        
        try {
            const metadata = JSON.parse(
                await fs.readFile(path.join(this.artifactDir, 'metadata.json'), 'utf8')
            );

            const report = {
                summary: {
                    totalArtifacts: 0,
                    totalSize: 0,
                    phases: Object.keys(metadata.artifacts)
                },
                phases: {},
                timestamp: new Date().toISOString(),
                environment: metadata.environment,
                branch: metadata.branch,
                commitId: metadata.commitId
            };

            // Generate phase-specific reports
            for (const phase of report.summary.phases) {
                const phasePath = path.join(this.artifactDir, phase);
                if (await this.pathExists(phasePath)) {
                    const phaseStats = await this.getPhaseStatistics(phasePath);
                    report.phases[phase] = phaseStats;
                    report.summary.totalArtifacts += phaseStats.fileCount;
                    report.summary.totalSize += phaseStats.totalSize;
                }
            }

            // Save report
            const reportPath = path.join(this.artifactDir, 'metadata/audit-logs/artifact-report.json');
            await fs.mkdir(path.dirname(reportPath), { recursive: true });
            await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

            this.log('✅ Artifact report generated successfully');
            this.log(`📄 Report saved to: ${reportPath}`);
            
        } catch (error) {
            this.logError('❌ Failed to generate artifact report', error);
            throw error;
        }
    }

    // Helper methods
    async copyArtifacts(artifacts) {
        for (const artifact of artifacts) {
            if (!this.dryRun) {
                await fs.mkdir(path.dirname(artifact.destination), { recursive: true });
                await fs.copyFile(artifact.source, artifact.destination);
            }
            this.log(`📋 ${this.dryRun ? '[DRY RUN] ' : ''}Copied: ${artifact.source} -> ${artifact.destination}`, 'verbose');
        }
    }

    async findFiles(directory, extensions, options = {}) {
        const files = [];
        const items = await fs.readdir(directory, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(directory, item.name);
            
            if (item.isDirectory()) {
                if (!options.excludeDirs || !options.excludeDirs.includes(item.name)) {
                    files.push(...await this.findFiles(fullPath, extensions, options));
                }
            } else if (item.isFile()) {
                const ext = path.extname(item.name);
                if (extensions.includes(ext)) {
                    files.push(fullPath);
                }
            }
        }

        return files;
    }

    async pathExists(filepath) {
        try {
            await fs.access(filepath);
            return true;
        } catch {
            return false;
        }
    }

    async updateMetadata(phase) {
        const metadataPath = path.join(this.artifactDir, 'metadata.json');
        const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
        
        const phasePath = path.join(this.artifactDir, phase);
        if (await this.pathExists(phasePath)) {
            const stats = await this.getPhaseStatistics(phasePath);
            metadata.artifacts[phase] = {
                count: stats.fileCount,
                totalSize: stats.totalSize,
                lastUpdated: new Date().toISOString()
            };
        }

        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    }

    async getPhaseStatistics(phasePath) {
        const files = await this.findFiles(phasePath, ['.js', '.ts', '.json', '.html', '.css', '.txt', '.log', '.sql']);
        let totalSize = 0;
        
        for (const file of files) {
            const stats = await fs.stat(file);
            totalSize += stats.size;
        }

        return {
            fileCount: files.length,
            totalSize,
            formattedSize: this.formatBytes(totalSize)
        };
    }

    async generateChecksums(phase) {
        const phasePath = path.join(this.artifactDir, phase);
        const files = await this.findFiles(phasePath, ['.js', '.ts', '.json', '.html', '.css', '.txt', '.log', '.sql']);
        const checksums = {};

        for (const file of files) {
            const content = await fs.readFile(file);
            const hash = crypto.createHash('sha256').update(content).digest('hex');
            checksums[path.relative(phasePath, file)] = hash;
        }

        const checksumPath = path.join(phasePath, 'checksums.json');
        await fs.writeFile(checksumPath, JSON.stringify(checksums, null, 2));
    }

    async validateChecksums(phase) {
        const phasePath = path.join(this.artifactDir, phase);
        const checksumPath = path.join(phasePath, 'checksums.json');
        
        if (!await this.pathExists(checksumPath)) {
            throw new Error(`Checksums file not found for phase: ${phase}`);
        }

        const checksums = JSON.parse(await fs.readFile(checksumPath, 'utf8'));
        
        for (const [relativePath, expectedHash] of Object.entries(checksums)) {
            const filePath = path.join(phasePath, relativePath);
            if (await this.pathExists(filePath)) {
                const content = await fs.readFile(filePath);
                const actualHash = crypto.createHash('sha256').update(content).digest('hex');
                
                if (actualHash !== expectedHash) {
                    throw new Error(`Checksum mismatch for file: ${relativePath}`);
                }
            }
        }
    }

    async createManifest(phase) {
        const phasePath = path.join(this.artifactDir, phase);
        const files = await this.findFiles(phasePath, ['.js', '.ts', '.json', '.html', '.css', '.txt', '.log', '.sql']);
        
        const fileInfos = [];
        for (const file of files) {
            const stats = await fs.stat(file);
            fileInfos.push({
                path: path.relative(phasePath, file),
                size: stats.size
            });
        }
        
        const manifest = {
            phase,
            created: new Date().toISOString(),
            fileCount: files.length,
            files: fileInfos
        };

        const manifestPath = path.join(phasePath, 'manifest.json');
        await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    }

    async validateManifest(phase) {
        const phasePath = path.join(this.artifactDir, phase);
        const manifestPath = path.join(phasePath, 'manifest.json');
        
        if (!await this.pathExists(manifestPath)) {
            throw new Error(`Manifest file not found for phase: ${phase}`);
        }

        const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
        
        for (const file of manifest.files) {
            const filePath = path.join(phasePath, file.path);
            if (!await this.pathExists(filePath)) {
                throw new Error(`Manifest file missing: ${file.path}`);
            }
        }
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    log(message, level = 'info') {
        if (level === 'verbose' && !this.verbose) return;
        console.log(`[${new Date().toISOString()}] ${message}`);
    }

    logError(message, error = null) {
        console.error(`[${new Date().toISOString()}] ${message}`);
        if (error && this.verbose) {
            console.error(error);
        }
    }
}

// CLI Interface
async function main() {
    const manager = new ArtifactManager();
    const command = process.argv[2];

    try {
        switch (command) {
            case 'init':
                await manager.init();
                break;
            case 'collect:migrations':
                await manager.collectMigrations();
                break;
            case 'collect:backend':
                await manager.collectBackend();
                break;
            case 'collect:frontend':
                await manager.collectFrontend();
                break;
            case 'collect:testing':
                await manager.collectTesting();
                break;
            case 'security:scan':
                await manager.securityScan();
                break;
            case 'finalize:backend':
                await manager.finalize('backend');
                break;
            case 'finalize:frontend':
                await manager.finalize('frontend');
                break;
            case 'validate:backend':
                await manager.validate('backend');
                break;
            case 'validate:frontend':
                await manager.validate('frontend');
                break;
            case 'download:backend':
                await manager.download('backend');
                break;
            case 'download:testing':
                await manager.download('testing');
                break;
            case 'report':
                await manager.generateReport();
                break;
            case 'test:artifacts':
                // Run comprehensive artifact tests
                await manager.init();
                await manager.collectMigrations();
                await manager.collectBackend();
                await manager.collectFrontend();
                await manager.collectTesting();
                await manager.securityScan();
                await manager.finalize('backend');
                await manager.finalize('frontend');
                await manager.validate('backend');
                await manager.validate('frontend');
                await manager.generateReport();
                break;
            default:
                console.log('Available commands:');
                console.log('  init                    - Initialize artifact management system');
                console.log('  collect:migrations      - Collect database migration artifacts');
                console.log('  collect:backend         - Collect backend infrastructure artifacts');
                console.log('  collect:frontend        - Collect frontend build artifacts');
                console.log('  collect:testing         - Collect testing artifacts');
                console.log('  security:scan           - Perform security scan on artifacts');
                console.log('  finalize:backend        - Finalize backend artifacts');
                console.log('  finalize:frontend       - Finalize frontend artifacts');
                console.log('  validate:backend        - Validate backend artifacts');
                console.log('  validate:frontend       - Validate frontend artifacts');
                console.log('  download:backend        - Download backend artifacts');
                console.log('  download:testing        - Download testing artifacts');
                console.log('  report                  - Generate comprehensive artifact report');
                console.log('  test:artifacts          - Run comprehensive artifact test suite');
                console.log('');
                console.log('Options:');
                console.log('  --verbose, -v           - Enable verbose logging');
                console.log('  --dry-run               - Simulate operations without making changes');
                break;
        }
    } catch (error) {
        console.error(`❌ Command failed: ${error.message}`);
        if (process.argv.includes('--verbose')) {
            console.error(error);
        }
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = ArtifactManager;
