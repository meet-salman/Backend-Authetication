const app = require('./src/app');
const connectDB = require('./src/db/db');
const port = 3000;

const dns = require('dns');
dns.setServers(['8.8.8.8']);


connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
    })