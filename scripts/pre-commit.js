#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 Running pre-commit checks...\n');

try {
  // Check if we're in a git repository
  execSync('git rev-parse --is-inside-work-tree', { stdio: 'inherit' });

  console.log('📝 Formatting code with Prettier...');
  execSync('npm run format', { stdio: 'inherit' });

  console.log('\n🔍 Running ESLint...');
  execSync('npm run lint', { stdio: 'inherit' });

  console.log('\n🏗️ Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ All checks passed! Ready to commit.');
} catch (error) {
  console.error('\n❌ Pre-commit checks failed!');
  console.error('Please fix the issues above before committing.');
  process.exit(1);
}
