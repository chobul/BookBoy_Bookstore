import mysql from 'mysql2/promise';

import { pool } from '../config/db.js';

export const getFavorites = async (req, res) => {
  try {
    const [favorites] = await pool.query(
      'SELECT f.*, b.* FROM favorites f JOIN books b ON f.book_id = b.id WHERE f.user_id = ?',
      [req.user.id]
    );
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFavorite = async (req, res) => {
  const { bookId } = req.params;

  try {
    const [existingFavorite] = await pool.query(
      'SELECT * FROM favorites WHERE user_id = ? AND book_id = ?',
      [req.user.id, bookId]
    );
    if (existingFavorite.length > 0) {
      return res.status(400).json({ message: 'Book is already in favorites' });
    }

    await pool.query('INSERT INTO favorites (user_id, book_id) VALUES (?, ?)', [req.user.id, bookId]);
    res.status(201).json({ message: 'Book added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  const { bookId } = req.params;

  try {
    const [result] = await pool.query(
      'DELETE FROM favorites WHERE user_id = ? AND book_id = ?',
      [req.user.id, bookId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found in favorites' });
    }

    res.json({ message: 'Book removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
