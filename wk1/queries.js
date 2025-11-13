// queries.js

/* ---------- Basic CRUD ---------- */

// 1. Find all books in a specific genre
db.books.find({ genre: "Fantasy" }).pretty();

// 2. Find books published after a certain year
db.books.find({ published_year: { $gt: 2000 } }).pretty();

// 3. Find books by a specific author
db.books.find({ author: "George Orwell" }).pretty();

// 4. Update the price of a specific book
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 11.5 } }
);

// 5. Delete a book by its title
db.books.deleteOne({ title: "Pride and Prejudice" });


/* ---------- Advanced Queries ---------- */

// 6. Books that are in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } }).pretty();

// 7. Projection (only title, author, and price)
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).pretty();

// 8. Sort by price (ascending)
db.books.find({}, { title: 1, price: 1 }).sort({ price: 1 }).pretty();

// 9. Sort by price (descending)
db.books.find({}, { title: 1, price: 1 }).sort({ price: -1 }).pretty();

// Pagination (5 per page)
db.books.find().skip(0).limit(5).pretty(); // Page 1
db.books.find().skip(5).limit(5).pretty(); // Page 2


/* ---------- Aggregation Pipelines ---------- */

// 10. Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" }, count: { $sum: 1 } } },
  { $sort: { avgPrice: -1 } }
]).pretty();

// 11. Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", totalBooks: { $sum: 1 } } },
  { $sort: { totalBooks: -1 } },
  { $limit: 1 }
]).pretty();

// 12. Group books by publication decade and count them
db.books.aggregate([
  {
    $addFields: {
      decade: {
        $concat: [
          {
            $toString: {
              $multiply: [
                { $floor: { $divide: ["$published_year", 10] } },
                10
              ]
            }
          },
          "s"
        ]
      }
    }
  },
  { $group: { _id: "$decade", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]).pretty();


/* ---------- Indexing ---------- */

// 13. Create index on title
db.books.createIndex({ title: 1 });

// 14. Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// 15. Explain query performance
db.books.find({ title: "The Hobbit" }).explain("executionStats");
