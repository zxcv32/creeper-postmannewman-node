# Newman Creeper (`creeper-postmannewman-node`)

## Getting Started

### Requirements
1. RabbitMQ ([Docker](https://github.com/Sea-Creeper/ansible-playbooks/tree/main/docker/rabbitmq))
2. Configure .env


Run following commands
```
npm install
npm ./src/index.js
```

---
### Testing
Run the following to upload a test collection to queue
```
node ./tests/src/send.js
```
