// const https = require('https');
// const http = require('http');
import https from 'https';
import http from 'http';

// Get the URL from environment or use default
const url = process.env.MONITOR_URL || 'http://localhost:8000/health';

console.log(`Monitoring health endpoint: ${url}`);

// Create the correct client based on the URL
const client = url.startsWith('https') ? https : http;

function checkHealth() {
  const start = Date.now();

  const req = client.get(url, (res) => {
    const { statusCode } = res;
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const responseTime = Date.now() - start;

      try {
        const healthData = JSON.parse(data);
        console.log(`Health Check (${new Date().toISOString()}):`);
        console.log(`Status: ${statusCode}, Response Time: ${responseTime}ms`);
        console.log(`Application Uptime: ${healthData.uptime}s`);
        console.log(`Database Status: ${healthData.database.status}`);
        console.log(`Memory Usage: ${healthData.memory.heapUsed}`);
        console.log('----------------------------');

        if (statusCode !== 200 || healthData.database.status !== 'healthy') {
          console.error('Health check failed!');
          process.exit(1);
        }
      } catch (error) {
        console.error('Failed to parse health check data:', error);
        process.exit(1);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Health check request failed:', error.message);
    process.exit(1);
  });

  req.end();
}

// Run once immediately
checkHealth();

// If used as a monitoring tool, run periodically
if (process.env.MONITOR_INTERVAL) {
  const interval = parseInt(process.env.MONITOR_INTERVAL, 10) || 60000; // Default to 1 minute
  setInterval(checkHealth, interval);
}
