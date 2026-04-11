import fetch from 'node-fetch';

const GATEWAY_URL = 'http://localhost:8080/api';

async function runTests() {
  console.log('🧪 CAMPUS SPARK: AUTOMATED PRODUCTION VALIDATION SUITE');
  console.log('----------------------------------------------------');

  const tests = [
    {
      name: 'GATEWAY HEALTH SCAN',
      url: 'http://localhost:8080/health',
      method: 'GET',
      check: (data) => data.gateway === 'UP' && data.status === 'Healthy'
    },
    {
      name: 'AUTH SERVICE ROUTING',
      url: `${GATEWAY_URL}/auth/me`,
      method: 'GET',
      check: (data, status) => status === 401 || status === 200 // 401 means it reached the auth-service and was rejected properly
    },
    {
      name: 'EVENT SERVICE ROUTING',
      url: `${GATEWAY_URL}/events`,
      method: 'GET',
      check: (data) => Array.isArray(data)
    },
    {
      name: 'REGISTRATION SERVICE ROUTING',
      url: `${GATEWAY_URL}/register/health`,
      method: 'GET',
      check: (data) => data.status.includes('Registration')
    },
    {
        name: 'AD SERVICE ROUTING',
        url: `${GATEWAY_URL}/ads/active`,
        method: 'GET',
        check: (data) => Array.isArray(data)
    }
  ];

  let passed = 0;

  for (const test of tests) {
    try {
      process.stdout.write(`📡 Testing ${test.name}... `);
      const res = await fetch(test.url, { 
        method: test.method,
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000 
      });
      
      let data;
      try {
        data = await res.json();
      } catch (e) {
        data = {};
      }

      if (test.check(data, res.status)) {
        console.log('✅ PASS');
        passed++;
      } else {
        console.log('❌ FAIL (Invalid response structure)');
        console.log('   Response Status:', res.status);
        console.log('   Response Data:', JSON.stringify(data).substring(0, 100));
      }
    } catch (err) {
      console.log(`❌ ERROR: ${err.message}`);
    }
  }

  console.log('----------------------------------------------------');
  console.log(`📊 FINAL REPORT: ${passed}/${tests.length} TESTS PASSED`);
  
  if (passed === tests.length) {
    console.log('🚀 SYSTEM STATUS: READY FOR PRODUCTION');
  } else {
    console.log('⚠️ SYSTEM STATUS: DEGRADED - CHECK INDIVIDUAL SERVICES');
  }
}

runTests();
