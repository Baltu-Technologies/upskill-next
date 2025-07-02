#!/usr/bin/env node

/**
 * Cache Manager for Upskill Platform
 * Provides utilities for managing Amplify CI/CD pipeline caches
 * 
 * Features:
 * - Cache inspection and analysis
 * - Selective cache clearing
 * - Cache optimization recommendations
 * - Performance monitoring
 * - Environment-specific cache management
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class CacheManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.cacheConfig = {
      paths: [
        'node_modules',
        'amplify/node_modules',
        '.next/cache',
        '.npm',
        '.tsbuildinfo',
        'amplify/.tsbuildinfo',
        'migrations/.migration-cache',
        'amplify/cdk.out',
        'amplify/.cdk.staging',
        'build-cache',
        'temp-build'
      ],
      keyFiles: [
        'package.json',
        'package-lock.json',
        'amplify/package.json',
        'amplify/package-lock.json',
        'next.config.js',
        'tsconfig.json',
        'amplify.yml'
      ]
    };
  }

  /**
   * Calculate cache key based on critical files
   */
  async calculateCacheKey() {
    const hashes = [];
    
    for (const filePath of this.cacheConfig.keyFiles) {
      const fullPath = path.join(this.projectRoot, filePath);
      try {
        const content = await fs.readFile(fullPath, 'utf8');
        const hash = crypto.createHash('sha256').update(content).digest('hex').substring(0, 12);
        hashes.push(`${path.basename(filePath)}:${hash}`);
      } catch (error) {
        // File doesn't exist, include in key as 'missing'
        hashes.push(`${path.basename(filePath)}:missing`);
      }
    }
    
    return hashes.join('|');
  }

  /**
   * Get directory size recursively
   */
  async getDirectorySize(dirPath) {
    try {
      const stats = await fs.stat(dirPath);
      if (!stats.isDirectory()) {
        return stats.size;
      }

      const files = await fs.readdir(dirPath);
      let totalSize = 0;

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const fileStats = await fs.stat(filePath);
        
        if (fileStats.isDirectory()) {
          totalSize += await this.getDirectorySize(filePath);
        } else {
          totalSize += fileStats.size;
        }
      }

      return totalSize;
    } catch (error) {
      return 0; // Directory doesn't exist or can't be accessed
    }
  }

  /**
   * Format bytes into human-readable format
   */
  formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Inspect cache status
   */
  async inspectCache() {
    console.log('🔍 Cache Inspection Report');
    console.log('========================\n');

    const cacheKey = await this.calculateCacheKey();
    console.log(`Current Cache Key: ${cacheKey}\n`);

    console.log('Cache Directory Analysis:');
    console.log('------------------------');

    let totalCacheSize = 0;
    const cacheReport = [];

    for (const cachePath of this.cacheConfig.paths) {
      const fullPath = path.join(this.projectRoot, cachePath);
      const size = await this.getDirectorySize(fullPath);
      totalCacheSize += size;

      const status = size > 0 ? '✅ Exists' : '❌ Missing';
      const formattedSize = this.formatBytes(size);
      
      cacheReport.push({
        path: cachePath,
        size: size,
        formattedSize: formattedSize,
        status: status
      });

      console.log(`${status} ${cachePath.padEnd(30)} ${formattedSize}`);
    }

    console.log(`\n📊 Total Cache Size: ${this.formatBytes(totalCacheSize)}`);

    // Cache efficiency analysis
    console.log('\n🎯 Cache Efficiency Analysis:');
    console.log('-----------------------------');
    
    const nodeModulesSize = cacheReport.find(r => r.path === 'node_modules')?.size || 0;
    const nextCacheSize = cacheReport.find(r => r.path === '.next/cache')?.size || 0;
    
    if (nodeModulesSize > 0) {
      console.log(`✅ Node.js dependencies cached (${this.formatBytes(nodeModulesSize)})`);
    } else {
      console.log('⚠️  Node.js dependencies not cached - first build or cache cleared');
    }

    if (nextCacheSize > 0) {
      console.log(`✅ Next.js build cache active (${this.formatBytes(nextCacheSize)})`);
    } else {
      console.log('⚠️  Next.js build cache empty - builds may be slower');
    }

    return {
      cacheKey,
      totalSize: totalCacheSize,
      report: cacheReport
    };
  }

  /**
   * Clear specific cache directories
   */
  async clearCache(options = {}) {
    const { selective = false, force = false, paths = [] } = options;
    
    console.log('🧹 Cache Clearing Operation');
    console.log('===========================\n');

    let pathsToClean = selective ? paths : this.cacheConfig.paths;
    
    if (!force) {
      console.log('Preview mode - add --force to actually clear caches\n');
    }

    for (const cachePath of pathsToClean) {
      const fullPath = path.join(this.projectRoot, cachePath);
      const size = await this.getDirectorySize(fullPath);
      
      if (size > 0) {
        console.log(`${force ? '🗑️  Clearing' : '📋 Would clear'} ${cachePath} (${this.formatBytes(size)})`);
        
        if (force) {
          try {
            await fs.rm(fullPath, { recursive: true, force: true });
            console.log(`✅ Cleared ${cachePath}`);
          } catch (error) {
            console.log(`❌ Failed to clear ${cachePath}: ${error.message}`);
          }
        }
      } else {
        console.log(`⏭️  Skipping ${cachePath} (already empty)`);
      }
    }

    if (!force) {
      console.log('\n💡 Run with --force to actually clear the caches');
    }
  }

  /**
   * Optimize cache configuration
   */
  async optimizeCache() {
    console.log('🚀 Cache Optimization Report');
    console.log('============================\n');

    const report = await this.inspectCache();
    const recommendations = [];

    // Check for oversized caches
    const largeCaches = report.report.filter(r => r.size > 1000000000); // > 1GB
    if (largeCaches.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `Large cache directories detected: ${largeCaches.map(c => c.path).join(', ')}`,
        action: 'Consider clearing these caches if builds are slow'
      });
    }

    // Check for missing important caches
    const missingNodeModules = report.report.find(r => r.path === 'node_modules' && r.size === 0);
    if (missingNodeModules) {
      recommendations.push({
        type: 'info',
        message: 'Node.js dependencies not cached',
        action: 'This is normal for first builds or after cache clearing'
      });
    }

    // Cache key freshness
    console.log('📅 Cache Key Analysis:');
    console.log('---------------------');
    console.log(`Current key: ${report.cacheKey}`);
    console.log('Key includes hashes of: package.json, lockfiles, config files');

    console.log('\n💡 Optimization Recommendations:');
    console.log('--------------------------------');
    
    if (recommendations.length === 0) {
      console.log('✅ Cache configuration appears optimal');
    } else {
      recommendations.forEach((rec, index) => {
        const icon = rec.type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${icon}  ${rec.message}`);
        console.log(`   Action: ${rec.action}\n`);
      });
    }

    return recommendations;
  }

  /**
   * Monitor cache performance
   */
  async monitorPerformance() {
    console.log('📈 Cache Performance Monitoring');
    console.log('===============================\n');

    // This would typically integrate with CI/CD metrics
    // For now, we'll provide a framework for monitoring
    
    const report = await this.inspectCache();
    
    console.log('Performance Metrics:');
    console.log('-------------------');
    console.log(`Total cache size: ${this.formatBytes(report.totalSize)}`);
    console.log(`Number of cached directories: ${report.report.filter(r => r.size > 0).length}/${report.report.length}`);
    
    // Estimated build time savings
    const nodeModulesSize = report.report.find(r => r.path === 'node_modules')?.size || 0;
    const estimatedSavings = nodeModulesSize > 0 ? 'Estimated 2-5 minutes saved on dependency installation' : 'No dependency cache - full install required';
    
    console.log(`Cache efficiency: ${estimatedSavings}`);
    
    console.log('\n📊 Recommendations for CI/CD:');
    console.log('-----------------------------');
    console.log('• Monitor build times before/after cache implementation');
    console.log('• Track cache hit rates in CI/CD logs');
    console.log('• Review cache sizes monthly to prevent excessive storage use');
    console.log('• Clear caches if build issues persist after code changes');
    
    return report;
  }
}

// CLI Interface
async function main() {
  const cacheManager = new CacheManager();
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'inspect':
        await cacheManager.inspectCache();
        break;
        
      case 'clear':
        const force = process.argv.includes('--force');
        const selective = process.argv.includes('--selective');
        const pathsIndex = process.argv.indexOf('--paths');
        const paths = pathsIndex !== -1 ? process.argv[pathsIndex + 1]?.split(',') || [] : [];
        
        await cacheManager.clearCache({ force, selective, paths });
        break;
        
      case 'optimize':
        await cacheManager.optimizeCache();
        break;
        
      case 'monitor':
        await cacheManager.monitorPerformance();
        break;
        
      case 'key':
        const key = await cacheManager.calculateCacheKey();
        console.log(`Current cache key: ${key}`);
        break;
        
      default:
        console.log('Cache Manager for Upskill Platform');
        console.log('=================================\n');
        console.log('Usage: node scripts/cache-manager.js <command> [options]\n');
        console.log('Commands:');
        console.log('  inspect    Show cache status and analysis');
        console.log('  clear      Clear cache directories [--force] [--selective --paths=path1,path2]');
        console.log('  optimize   Analyze and recommend cache optimizations');
        console.log('  monitor    Display cache performance metrics');
        console.log('  key        Show current cache key\n');
        console.log('Examples:');
        console.log('  node scripts/cache-manager.js inspect');
        console.log('  node scripts/cache-manager.js clear --force');
        console.log('  node scripts/cache-manager.js clear --selective --paths=node_modules,.next/cache');
        console.log('  node scripts/cache-manager.js optimize');
    }
  } catch (error) {
    console.error('❌ Cache Manager Error:', error.message);
    if (process.argv.includes('--verbose')) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = CacheManager; 