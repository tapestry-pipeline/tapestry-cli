const fs = require('fs');
const yaml = require('js-yaml');

const yamlWriter = (imageUrl) => {
  const data = {
    version: '3.1',
    services: {
      redis: {
        'container_name': 'grouparoo_redis',
        image: 'redis',
        restart: 'always',
        networks: [
          'grouparoo_backend'
        ]
      },
      db: {
        'container_name': 'grouparoo_db',
        image: 'postgres',
        restart: 'always',
        environment: {
          'POSTGRES_PASSWORD': 'password',
          'POSTGRES_DB': 'grouparoo_docker'
        },
        networks: [
          'grouparoo_backend'
        ],
        volumes: [
          'postgres-data:/var/lib/postgresql/data'
        ],
      },
      'grouparoo-web': {
        image: `${imageUrl}`,
        restart: 'always',
        ports: [
          {
            target: 3000,
            'x-aws-protocol': 'http'
          }
        ],
        environment: {
          PORT: 3000,
          'REDIS_URL': 'redis://redis:6379/0',
          'DATABASE_URL': 'postgresql://postgres:password@db:5432/grouparoo_docker',
          'WEB_SERVER': 'true',
          'WORKERS': 0,
          'SERVER_TOKEN': 'default-server-token',
        },
        'env_file': [
          '.env'
        ],
        'depends_on': [
          'db',
          'redis'
        ],
        networks: [
          'grouparoo_frontend',
          'grouparoo_backend'
        ],
      },
      'grouparoo-worker': {
        'image': `${imageUrl}`,
        restart: 'always',
        'environment': {
          'REDIS_URL': 'redis://redis:6379/0',
          'DATABASE_URL': 'postgresql://postgres:password@db:5432/grouparoo_docker',
          'WEB_SERVER': 'false',
          'WORKERS': 10,
          'SERVER_TOKEN': 'default-server-token'
        },
        'depends_on': [
          'db',
          'redis',
          'grouparoo-web'
        ],
        networks: [
          'grouparoo_frontend',
          'grouparoo_backend'
        ],
        'env_file': [
          '.env'
        ],
      },
    },
    'networks': {
      'grouparoo_frontend': null,
      'grouparoo_backend': null
    },
    'volumes': {
      'postgres-data': null
    }
  };

  const yamlStr = yaml.dump(data);
  fs.writeFileSync('docker-compose.yml', yamlStr, 'utf8');
}

module.exports = {
  yamlWriter
}
