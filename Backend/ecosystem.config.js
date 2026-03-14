module.exports = {
  apps: [
    {
      name: 'lms-backend',
      script: 'dist/main.js',
      cwd: './',          // Root of the Backend directory
      instances: 'max',   // Use all available CPU cores (cluster mode)
      exec_mode: 'cluster',
      autorestart: true,  // Restart if app crashes
      watch: false,       // Do NOT watch in production
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      merge_logs: true
    }
  ]
};
