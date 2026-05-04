module.exports = {
  apps: [
    {
      name: 'heartinmotionhk-dev',
      script: 'npm',
      args: 'run start',
      cwd: '/var/www/heartinmotionhk-dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      watch: false,
      max_memory_restart: '512M',
      restart_delay: 3000,
      log_file: '/var/log/pm2/heartinmotionhk-dev.log',
      error_file: '/var/log/pm2/heartinmotionhk-dev-error.log',
      out_file: '/var/log/pm2/heartinmotionhk-dev-out.log',
    },
    {
      name: 'heartinmotionhk-prod',
      script: 'npm',
      args: 'run start',
      cwd: '/var/www/heartinmotionhk-prod',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 3000,
      log_file: '/var/log/pm2/heartinmotionhk-prod.log',
      error_file: '/var/log/pm2/heartinmotionhk-prod-error.log',
      out_file: '/var/log/pm2/heartinmotionhk-prod-out.log',
    },
  ],
}
