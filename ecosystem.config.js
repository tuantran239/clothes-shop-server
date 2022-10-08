module.exports = {
  apps: [{
    name: 'node-server',
    script: 'npm',
    args: 'start',
    time: true,
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
