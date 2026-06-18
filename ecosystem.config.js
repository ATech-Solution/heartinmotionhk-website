module.exports = {
  apps: [
    {
      name: 'heartinmotionhk-dev',
      script: './start.sh',
      cwd: '/home/deploy/dev',
      interpreter: 'bash',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        HOSTNAME: '0.0.0.0',
      },
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 3000,
    },
    {
      name: 'heartinmotionhk-prod',
      script: './start.sh',
      cwd: '/home/deploy/prod',
      interpreter: 'bash',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 3000,
    },
  ],
}
