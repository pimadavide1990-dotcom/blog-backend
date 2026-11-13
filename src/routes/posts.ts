import { Router, Request, Response } from 'express';
import { Post } from '../models/Post';

const router = Router();

// 1. Mostra l'elenco dei post pubblici (o filtra per hashtag se presente nella query es. ?tag=nodejs)
router.get('/posts', async (req: Request, res: Response) => {
  try {
    const { tag } = req.query;
    let query: any = { status: 'published' }; // Di default mostra solo i pubblicati per il blog

    if (tag) {
      query.hashtags = tag;
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei post' });
  }
});

// (EXTRA CMS) Mostra TUTTI i post (anche le bozze) per la gestione CMS
router.get('/cms/posts', async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei post per il CMS' });
  }
});

// 2. Crea un post (status predefinito: draft, autore: sempre Brian Fox)
router.post('/posts', async (req: Request, res: Response) => {
  try {
    const { title, body, hashtags } = req.body;

    const newPost = new Post({
      title,
      body,
      hashtags: hashtags || [],
      status: 'draft',
      author: 'Brian Fox' // Come da requisito
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ error: 'Errore durante la creazione del post' });
  }
});

// 3. Pubblica un post (cambia lo status da draft a published)
router.patch('/posts/:id/publish', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { status: 'published' },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post non trovato' });
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la pubblicazione del post' });
  }
});

// 4. Elimina un post
router.delete('/posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post non trovato' });
    }

    res.json({ message: 'Post eliminato con successo', deletedPost });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante l'eliminazione del post' });
  }
});

export default router;