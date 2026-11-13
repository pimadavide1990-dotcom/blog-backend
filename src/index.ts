import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from './routes/posts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blog-cms';

app.use(cors());
app.use(express.json());

// Usa le rotte dei post con il prefisso /api
app.use('/api', postRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connesso a MongoDB con successo!');
    app.listen(PORT, () => {
      console.log(`Server avviato sulla porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Errore di connessione a MongoDB:', error);
  });

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API del Blog CMS attiva e funzionante!' });
});