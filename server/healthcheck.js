const http = require('http');

const options = {
    host: '0.0.0.0', // Changed from localhost
    port: process.env.PORT || 5000,
    path: '/api/health',
    timeout: 2000,
    headers: {
        'Cache-Control': 'no-cache',
        'Connection': 'close'
    }
};

const request = http.request(options, (res) => {
    console.log(`Health check successful (Status: ${res.statusCode})`);
    process.exit(res.statusCode === 200 ? 0 : 1);
});

request.on('error', (err) => {
    console.error('Health check connection failed:', err.message);
    process.exit(1);
});

request.end();