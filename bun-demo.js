#!/usr/bin/env bun

// Bun performance demo script
console.log('🚀 Bun Performance Demo\n');

console.log(`Runtime: Bun ${Bun.version}`);
console.log(`Platform: ${process.platform} ${process.arch}`);
console.log(`Memory: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB\n`);

// Fast file operations
const start = performance.now();

// Create a test file
const testData = JSON.stringify({
  message: 'Hello from Bun!',
  timestamp: new Date().toISOString(),
  performance: 'ultra-fast',
  features: ['TypeScript support', 'Built-in bundler', 'Fast package manager']
});

await Bun.write('./test-output.json', testData);
const readData = await Bun.file('./test-output.json').text();
const parsed = JSON.parse(readData);

const end = performance.now();

console.log('✅ File operations completed');
console.log(`📄 Written and read: ${readData.length} characters`);
console.log(`⏱️  Time taken: ${(end - start).toFixed(2)}ms\n`);

// Network performance test
const networkStart = performance.now();
try {
  const response = await fetch('https://httpbin.org/json');
  const data = await response.json();
  const networkEnd = performance.now();
  
  console.log('🌐 Network test completed');
  console.log(`📡 Response time: ${(networkEnd - networkStart).toFixed(2)}ms`);
  console.log(`📊 Response size: ${JSON.stringify(data).length} characters\n`);
} catch (error) {
  console.log('🌐 Network test skipped (offline or connection issues)\n');
}

// Memory usage
const memUsage = process.memoryUsage();
console.log('💾 Memory Usage:');
console.log(`   RSS: ${Math.round(memUsage.rss / 1024 / 1024)}MB`);
console.log(`   Heap Used: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
console.log(`   External: ${Math.round(memUsage.external / 1024 / 1024)}MB\n`);

// Cleanup
try {
  await Bun.file('./test-output.json').exists() && 
  await import('fs/promises').then(fs => fs.unlink('./test-output.json'));
  console.log('🧹 Cleanup completed');
} catch {}

console.log('\n⚡ Bun is ready for your high-performance backend!');