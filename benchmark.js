const http = require('http');

function sendReq(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const headers = { 'Content-Type': 'application/json' };
    if (postData) headers['Content-Length'] = Buffer.byteLength(postData);

    const tStart = Date.now();
    const req = http.request({
      hostname: 'localhost',
      port: 5002,
      path,
      method,
      headers
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const clientLatency = Date.now() - tStart;
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body), clientLatency });
        } catch (e) {
          resolve({ status: res.statusCode, body, clientLatency });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runBenchmark() {
  console.log('=== PRACTICAL 9: IN-MEMORY CACHING BENCHMARK ===\n');

  console.log('Step 1: Baseline Uncached Requests (3 Samples)');
  for (let i = 1; i <= 3; i++) {
    const res = await sendReq('/api/tasks/uncached');
    console.log(` Sample #${i} -> Status: ${res.status} | Source: ${res.body.source} | Server Latency: ${res.body.responseTimeMs} ms | Total: ${res.clientLatency} ms`);
  }

  console.log('\nStep 2: First Cached GET Request (Cold Miss)');
  const missRes = await sendReq('/api/tasks');
  console.log(` Request -> Status: ${missRes.status} | Source: ${missRes.body.source} | Server Latency: ${missRes.body.responseTimeMs} ms | Total: ${missRes.clientLatency} ms`);

  console.log('\nStep 3: Subsequent Cached GET Requests (3 Cache Hits)');
  for (let i = 1; i <= 3; i++) {
    const hitRes = await sendReq('/api/tasks');
    console.log(` Hit #${i}    -> Status: ${hitRes.status} | Source: ${hitRes.body.source} | Server Latency: ${hitRes.body.responseTimeMs} ms | Total: ${hitRes.clientLatency} ms`);
  }

  console.log('\nStep 4: Cache Invalidation Verification via Write (POST /api/tasks)');
  const postRes = await sendReq('/api/tasks', 'POST', { title: 'New Task Invalidation Check' });
  console.log(` POST -> Status: ${postRes.status} | Message: ${postRes.body.message}`);

  console.log('\nStep 5: Immediate Read After Invalidation (Must be Cache Miss)');
  const afterWriteRes = await sendReq('/api/tasks');
  console.log(` Read -> Status: ${afterWriteRes.status} | Source: ${afterWriteRes.body.source} | Server Latency: ${afterWriteRes.body.responseTimeMs} ms`);

  console.log('\nStep 6: Cache Statistics Summary');
  const statsRes = await sendReq('/api/tasks/cache-stats');
  console.log(JSON.stringify(statsRes.body.stats, null, 2));
}

runBenchmark().catch(console.error);