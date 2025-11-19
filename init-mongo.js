// MongoDB initialization script for development
db = db.getSiblingDB('kindle_db');

// Create application user
db.createUser({
  user: 'kindle_user',
  pwd: 'kindle_password',
  roles: [
    {
      role: 'readWrite',
      db: 'kindle_db'
    }
  ]
});

// Create collections with validation
db.createCollection('books', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'author', 'createdAt'],
      properties: {
        title: {
          bsonType: 'string',
          description: 'Book title is required and must be a string'
        },
        author: {
          bsonType: 'string',
          description: 'Author is required and must be a string'
        },
        isbn: {
          bsonType: 'string',
          description: 'ISBN must be a string if provided'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Created date is required'
        }
      }
    }
  }
});

db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
          description: 'Email is required and must be a valid email format'
        },
        password: {
          bsonType: 'string',
          minLength: 6,
          description: 'Password is required and must be at least 6 characters'
        },
        role: {
          enum: ['user', 'admin'],
          description: 'Role must be either user or admin'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Created date is required'
        }
      }
    }
  }
});

// Create indexes
db.books.createIndex({ title: 'text', author: 'text' });
db.books.createIndex({ author: 1 });
db.books.createIndex({ isbn: 1 }, { unique: true, sparse: true });
db.books.createIndex({ createdAt: -1 });

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

print('MongoDB initialization completed successfully!');