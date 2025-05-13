module.exports = {
  apps: [
    {
      name: 'depa-api',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      // Error recovery settings
      restart_delay: 3000, // Wait 3 seconds before restarting
      max_restarts: 10, // Limit consecutive restarts to prevent endless crash loops
      exp_backoff_restart_delay: 100, // Use exponential backoff strategy
      // Logs config
      error_file: 'logs/error.log',
      out_file: 'logs/output.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
