import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Server Kycs is running on http://localhost:${PORT}`);
});