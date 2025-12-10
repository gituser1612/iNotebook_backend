import express from 'express';
import cors from 'cors'
import connectToMongo from './db.js';
import authRoutes from './routes/auth.js'
import notesRoutes from './routes/notes.js'


// Connect to MongoDB
await connectToMongo();

const app = express();
const port = 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//Available routes 
app.use('/api/auth',authRoutes)
app.use('/api/notes',notesRoutes)

app.listen(port, () => {
  console.log(`iNotebook Server running on http://localhost:${port}`);
});


