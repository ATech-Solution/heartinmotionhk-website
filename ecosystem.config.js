module.exports = {
  apps: [
    {
      name: 'heartinmotionhk-dev',
      script: 'node',
      args: '.next/standalone/server.js',
      cwd: '/home/deploy/dev',
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
      script: 'node',
      args: '.next/standalone/server.js',
      cwd: '/home/deploy/prod',
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
