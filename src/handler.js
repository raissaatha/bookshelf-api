// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const books = require('./book');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const newBookList = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBookList);

  const isSuccess = books.filter((addBookList) => addBookList.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (!name && !reading && !finished) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((getAllBookList) => ({
          id: getAllBookList.id,
          name: getAllBookList.name,
          publisher: getAllBookList.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  if (name) {
    const filterBookName = books.filter((filterBook) => {
      const nameRegEx = new RegExp(name, 'gi');
      return nameRegEx.test(filterBook.name);
    });

    const response = h.response({
      status: 'success',
      data: {
        books: filterBookName.map((getAllBookList) => ({
          id: getAllBookList.id,
          name: getAllBookList.name,
          publisher: getAllBookList.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  if (reading) {
    // eslint-disable-next-line max-len
    const filterBookReading = books.filter((filterBook) => Number(filterBook.reading) === Number(reading));
    const response = h.response({
      status: 'success',
      data: {
        books: filterBookReading.map((getAllBookList) => ({
          id: getAllBookList.id,
          name: getAllBookList.name,
          publisher: getAllBookList.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  // eslint-disable-next-line max-len
  const filterBookFinished = books.filter((filterBook) => Number(filterBook.finished) === Number(finished));
  const response = h.response({
    status: 'success',
    data: {
      books: filterBookFinished.map((getAllBookList) => ({
        id: getAllBookList.id,
        name: getAllBookList.name,
        publisher: getAllBookList.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};

// view book book detail by ID
const getBookIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((getBookListId) => getBookListId.id === id)[0];
  if (book) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

// change book data by ID
const editBookIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const index = books.findIndex((editBookListId) => editBookListId.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

// delete book by ID
const deleteBookIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((deleteBookListId) => deleteBookListId.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookIdHandler,
  editBookIdHandler,
  deleteBookIdHandler,
};
