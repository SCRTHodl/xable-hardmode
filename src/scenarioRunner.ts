import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import { TestResult } from './types.js';

const require = createRequire(import.meta);

async function runScenarioTest(scenarioPath: string): Promise<TestResult[]> {
  const testPath = path.join(scenarioPath, 'test.ts');
  const results: TestResult[] = [];
  
  try {
    // Dynamic import of the test module
    const testModule = await import(`file://${testPath}`);
    
    if (typeof testModule.runTests === 'function') {
      const testResults = await testModule.runTests();
      results.push(...testResults);
    } else {
      results.push({
        passed: false,
        message: 'Test module missing runTests function',
        admissible: false,
        violations: ['Missing test runner']
      });
    }
  } catch (e) {
    results.push({
      passed: false,
      message: `Failed to load test module: ${e}`,
      admissible: false,
      violations: ['Test execution error']
    });
  }
  
  return results;
}

function checkAdmissibility(scenarioPath: string): string[] {
  const violations: string[] = [];
  const rulesPath = path.join(scenarioPath, 'admissibility-rules.json');
  const brokenPath = path.join(scenarioPath, 'broken.ts');
  
  try {
    const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
    const rules = JSON.parse(rulesContent);
    const brokenContent = fs.readFileSync(brokenPath, 'utf-8');
    
    // Check each admissibility rule
    for (const rule of rules) {
      if (rule.check && !brokenContent.includes(rule.check)) {
        violations.push(`Admissibility violation: ${rule.description}`);
      }
    }
  } catch (e) {
    violations.push(`Failed to check admissibility: ${e}`);
  }
  
  return violations;
}

function printResults(scenarioName: string, results: TestResult[], violations: string[]) {
  console.log(`\n📋 ${scenarioName}`);
  console.log('─'.repeat(50));
  
  for (const result of results) {
    const icon = result.passed ? '✅' : '❌';
    const admissibilityIcon = result.admissible ? '' : ' ⚠️';
    console.log(`${icon} ${result.message}${admissibilityIcon}`);
    
    if (!result.admissible && result.violations.length > 0) {
      for (const violation of result.violations) {
        console.log(`   - ${violation}`);
      }
    }
  }
  
  if (violations.length > 0) {
    console.log('\n⚠️  Admissibility Violations:');
    for (const violation of violations) {
      console.log(`   - ${violation}`);
    }
  }
  
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  console.log(`\nSummary: ${passedCount}/${totalCount} tests passed`);
}

async function main() {
  const args = process.argv.slice(2);
  const scenariosDir = path.join(process.cwd(), 'scenarios');
  
  if (!fs.existsSync(scenariosDir)) {
    console.error('❌ scenarios directory not found');
    process.exit(1);
  }
  
  let scenarioDirs: string[] = [];
  
  if (args.length > 0 && args[0] === '--') {
    const scenarioName = args[1];
    const scenarioPath = path.join(scenariosDir, scenarioName);
    
    if (!fs.existsSync(scenarioPath)) {
      console.error(`❌ Scenario not found: ${scenarioName}`);
      process.exit(1);
    }
    
    scenarioDirs = [scenarioName];
  } else {
    scenarioDirs = fs.readdirSync(scenariosDir, { withFileTypes: true })
      .filter((dirent: any) => dirent.isDirectory())
      .map((dirent: any) => dirent.name);
  }
  
  if (scenarioDirs.length === 0) {
    console.error('❌ No scenarios found');
    process.exit(1);
  }
  
  console.log(`🧪 Running ${scenarioDirs.length} scenario(s)...`);
  
  let totalPassed = 0;
  let totalTests = 0;
  
  for (const scenarioName of scenarioDirs) {
    const scenarioPath = path.join(scenariosDir, scenarioName);
    const results = await runScenarioTest(scenarioPath);
    const violations = checkAdmissibility(scenarioPath);
    
    // Mark results as inadmissible if there are violations
    const resultsWithAdmissibility = results.map(r => ({
      ...r,
      admissible: violations.length === 0,
      violations: violations.length > 0 ? violations : r.violations
    }));
    
    printResults(scenarioName, resultsWithAdmissibility, violations);
    
    totalPassed += resultsWithAdmissibility.filter(r => r.passed && r.admissible).length;
    totalTests += resultsWithAdmissibility.length;
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Total: ${totalPassed}/${totalTests} tests passed and admissible`);
  
  if (totalPassed === totalTests) {
    console.log('✅ All scenarios passed');
    process.exit(0);
  } else {
    console.log('❌ Some scenarios failed or are inadmissible');
    process.exit(1);
  }
}

main();
