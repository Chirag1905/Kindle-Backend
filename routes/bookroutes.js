import { Router } from 'express';
import { ApiResponse } from '../utils/response.js';

const router = Router();

// GET /api/v1/books - Get all books
router.get('/', async (req, res) => {
  try {
    // Mock data for now
    const books = [
      {
        id: 1,
        title: 'Sample Book',
        author: 'Sample Author',
        isbn: '978-0123456789',
        createdAt: new Date().toISOString()
      }
    ];

    ApiResponse.success(res, books, 'Books retrieved successfully');
  } catch (error) {
    ApiResponse.error(res, 'Failed to retrieve books', 500);
  }
});

// POST /api/v1/books - Create a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, isbn } = req.body;

    // Mock creation
    const newBook = {
      id: Date.now(),
      title,
      author,
      isbn,
      createdAt: new Date().toISOString()
    };

    ApiResponse.created(res, newBook, 'Book created successfully');
  } catch (error) {
    ApiResponse.error(res, 'Failed to create book', 500);
  }
});

export default router;