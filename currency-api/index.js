import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
    console.log(`Server Currencies is running on http://localhost:${PORT}`);
});