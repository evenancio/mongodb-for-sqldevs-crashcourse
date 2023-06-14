/*
  WELCOME TO THE MONGODB CRASH COURSE FOR SQL DEVELOPERS!

  The idea of this crash course is to give you a quick overview of MongoDB and how it compares to SQL.
*/

// ##############################################
// ########### CHAPTER 1: FIRST STEPS ###########
// ##############################################

/*
    >>> 1. Creating a new collection and inserting documents <<<
    
    In MongoDB, a collection is a group of documents. If you're familiar with SQL, you can think of a collection as a table.

    CREATE TABLE people (
        id INT NOT NULL AUTO_INCREMENT,
        user_id Varchar(30),
        age Number,
        status char(1),
        PRIMARY KEY (id)
    )
    
    INSERT INTO people(user_id, age, status) VALUES ('abc123', 55, 'A');
    
    INSERT INTO people(user_id, age, status) VALUES ('bcd234', 13, 'B')
    INSERT INTO people(user_id, age, status) VALUES ('cde345', 31, 'C')
    INSERT INTO people(user_id, age, status) VALUES ('def456', 23, 'D')

*/

// You can insert just one document...
db.people.insertOne({ user_id: 'abc123', age: 55, status: 'A' });
//... Or you can insert many documents at once
db.people.insertMany([
  {
    user_id: 'bcd234',
    age: 13,
    status: 'B',
  },

  {
    user_id: 'cde345',
    age: 31,
    status: 'C',
  },

  {
    user_id: 'def456',
    age: 23,
    status: 'D',
  },
]);

// That's it! You've created a collection and inserted documents into it.
// You don't need to create a database first, MongoDB will create it for you when you insert the first document.
// Also, you don't need to create a collection before inserting documents into it. MongoDB will create it for you when you insert the first document.

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/* 
  >>> 2. Adding a new field to a document <<<

    ALTER TABLE people
    ADD join_date DATETIME
    
    UPDATE people SET join_date = GETDATE()
    
*/

db.people.updateMany(
  {},
  {
    $set: {
      join_date: new Date(),
    },
  }
);

// Your documents now have a new field called join_date

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
    >>> 3. Creating indexes <<<

    Simple index
    
    CREATE INDEX idx_user_id_asc
    ON people(user_id)
        
    Compound index
    
    CREATE INDEX
       idx_user_id_asc_age_desc
    ON people(user_id, age DESC)
    
*/

// Simple index
db.people.createIndex({ user_id: 1 });
// Compound index
db.people.createIndex({ user_id: 1, age: -1 });

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
    >>> 4. Deleting a collection <<<

    DROP TABLE people
*/
db.people.drop();

// ##############################################
// ############ CHAPTER 2: QUERIES ##############
// ##############################################

// SELECT * FROM people
db.people.find();

// SELECT id, user_id, status FROM people
db.people.find({}, { user_id: 1, status: 1 });

// SELECT user_id, status FROM people
db.people.find({}, { user_id: 1, status: 1, _id: 0 });

/*
    SELECT *
    FROM people
    WHERE status = "A"
*/
db.people.find({ status: 'A' });

/*
    SELECT user_id, status
    FROM people
    WHERE status = "A"
*/
db.people.find({ status: 'A' }, { user_id: 1, status: 1, _id: 0 });

/*
    SELECT *
    FROM people
    WHERE status != "A"
*/
db.people.find({
  status: { $ne: 'A' },
});

/*
    SELECT *
    FROM people
    WHERE status = "A"
    AND age = 50
*/
db.people.find({
  status: 'A',
  age: 50,
});

/*
    SELECT *
    FROM people
    WHERE age > 25
*/
db.people.find({
  age: { $gt: 25 },
});

/*
    SELECT *
    FROM people
    WHERE age >= 31
*/
db.people.find({
  age: { $gte: 31 },
});

/*
    SELECT *
    FROM people
    WHERE age <= 31
*/
db.people.find({
  age: { $lte: 31 },
});

/*
    SELECT *
    FROM people
    WHERE age > 25
    AND   age <= 50
*/
db.people.find({
  age: { $gt: 25, $lte: 50 },
});

/*
    SELECT *
    FROM people
    WHERE user_id like "%bc%"
*/
db.people.find({
  user_id: /bc/,
});

/*
    SELECT *
    FROM people
    WHERE user_id like "bc%"
*/
db.people.find({
  user_id: /^bc/,
});

// Case insensitive
// Just add the "i" option to the regex
db.people.find({
  user_id: /^bc/i,
});

/*
    SELECT *
    FROM people
    WHERE status = "A"
    ORDER BY user_id ASC
*/
db.people
  .find({
    status: 'A',
  })
  .sort({ user_id: 1 });

/*
    SELECT *
    FROM people
    WHERE status <> "A"
    ORDER BY user_id ASC
*/
db.people
  .find({
    status: { $ne: 'A' },
  })
  .sort({ user_id: -1 });

/*
    SELECT COUNT(*)
    FROM people
*/
db.people.count();
db.people.find().count();

/*
    SELECT COUNT(user_id)
    FROM people
*/
db.people.count({
  user_id: { $exists: true },
});

db.people
  .find({
    user_id: { $exists: true },
  })
  .count();

/*
    SELECT COUNT(*)
    FROM people
    WHERE age > 30
*/
db.people
  .find({
    age: { $gt: 30 },
  })
  .count();

/*
    SELECT DISTINCT(status)
    FROM people
*/
db.people.distinct('status');

/*
    SELECT *
    FROM people
    OFFSET 10 ROWS
    FETCH NEXT 5 ROWS ONLY
*/
db.people.find().skip(10).limit(5);

// ##############################################
// ############# CHAPTER 3: UPDATE ##############
// ##############################################

/*
    UPDATE people
    SET status = "C"
    WHERE age > 25
*/
db.people.updateMany({ age: { $gt: 25 } }, { $set: { status: 'C' } });

/*
  UPDATE people
  SET age = age + 3
  WHERE status = "A"
*/
db.people.updateMany({ status: 'A' }, { $incr: { age: 3 } });

// ##############################################
// ############# CHAPTER 4: DELETE ##############
// ##############################################

/*
    DELETE FROM people
    WHERE status = "D"
*/
db.people.deleteOne({ status: 'D' });
db.people.deleteMany({ status: 'D' });

// ##############################################
// ############ CHAPTER 5: AGGREGATE ############
// ##############################################

/*
  You have learned how to perform basic CRUD operations on a MongoDB database.
  However, things start to get more interesting when you need to perform more complex operations.
  That's why Aggregation Framework is so important.
  Basically, it allows you to perform complex queries on your data.
  You can also use it as an alternative to the regular MongoDb find operators either.

  Check the example below:

    SELECT age as idade, status, user_id as id
    FROM people
    WHERE status = "A"
    ORDER BY user_id ASC
*/

db.people.aggregate([
  //1st stage
  { $match: { status: 'A' } },

  //2nd stage
  {
    $project: {
      idade: '$age',
      status: 1,
      id: '$user_id',
      _id: 0,
    },
  },

  //3th stage
  { $sort: { id: 1 } },

  //4th stage
  { $limit: 10 },
]);

// Alright, let's create another collection to play with
db.product.insertMany([
  { name: 'Soap', price: 5, category: 'Hygiene' },
  { name: 'Toothpaste', price: 3.5, category: 'Hygiene' },
  { name: 'Coca Cola', price: 8.75, category: 'Soft Drinks' },
  { name: '7-Up', price: 6, category: 'Soft Drinks' },
  { name: 'Cornflakes', price: 19.9, category: 'Cereals' },
  { name: 'Banana', price: 8.9, category: 'Fruits' },
  { name: 'Apple', price: 12.3, category: 'Fruits' },
  { name: 'Orange', price: 12.5, category: 'Fruits' },
  { name: 'Pear', price: 8.5, category: 'Fruits' },
]);

db.product.find();

// >>> IF-ELSE operator
// Using IF ELSE statements to create a new field
// Then we can use the new field to filter the results
db.product.aggregate([
  {
    $addFields: {
      date: new Date(),
      tag: {
        $cond: {
          if: { $gte: ['$price', 10] },
          then: 'Expensive',
          else: 'Cheap',
        },
      },
    },
  },

  // Filtering the results by Expensive tag
  { $match: { tag: 'Expensive' } },
]);

// * Remember that you can $set instead of $addFields as an alternative, as the example below:
db.product.aggregate([
  {
    $set: {
      date: new Date(),
      tag: {
        $cond: {
          if: { $gte: ['$price', 10] },
          then: 'Expensive',
          else: 'Cheap',
        },
      },
    },
  },

  // Filtering the results by Expensive tag
  { $match: { tag: 'Cheap' } },
]);

// There is also a shortcut for the $cond operator
db.product.aggregate([
  {
    $addFields: {
      date: new Date(),
      tag: {
        $cond: [{ $gte: ['$price', 10] }, 'Caro', 'Barato'],
      },
    },
  },
]);

// >>> GROUP BY
db.product.aggregate([
  {
    $group: {
      _id: '$category',
      qty: { $sum: 1 },
      priceTotal: { $sum: '$price' },
      priceAverage: { $avg: '$price' },
    },
  },
]);

// >>> BUCKET

db.product.aggregate([
  {
    $bucket: {
      groupBy: '$price',
      boundaries: [0, 5, 10, 15, 20, 25, 30],
      default: 'Other',
    },
  },
]);

db.product.aggregate([
  {
    $bucket: {
      groupBy: '$price',
      boundaries: [0, 5, 10, 15, 20, 25, 30],
      default: 'Other',
      output: {
        count: { $sum: 1 },
        product: { $push: { name: '$name' } },
      },
    },
  },

  { $sort: { count: 1 } },
]);

db.product.aggregate([
  {
    $bucketAuto: {
      groupBy: '$price',
      buckets: 6,
      output: {
        count: { $sum: 1 },
        product: { $push: { name: '$name' } },
      },
    },
  },
]);

db.product.aggregate([
  {
    $facet: {
      byCategories: [
        {
          $group: { _id: '$category', qtd: { $sum: 1 } },
        },
      ],
      byPrice: [
        {
          $bucketAuto: {
            groupBy: '$price',
            buckets: 6,
            output: {
              count: { $sum: 1 },
              product: { $push: { name: '$name' } },
            },
          },
        },
      ],
    },
  },
]);

// >>> UNWIND

db.movie.insertMany([
  { title: 'IT', tags: ['Horror'] },
  { title: 'Megan', tags: ['Horror', 'Sci-Fi', 'Triller'] },
  { title: 'Avatar', tags: ['Action', 'Adventure', 'Fantasy'] },
  { title: 'Andor', tags: ['Action', 'Adventure', 'Drama'] },
  { title: 'Barbie', tags: ['Comedy', 'Adventure', 'Fantasy'] },
]);

db.movie.aggregate([{ $unwind: '$tags' }]);

db.movie.aggregate([
  { $unwind: '$tags' },
  {
    $group: {
      _id: '$tags',
      qty: { $sum: 1 },
    },
  },
  { $sort: { qty: -1 } },
  { $limit: 3 },
]);

db.movie.aggregate([
  { $unwind: '$tags' },

  {
    $set: {
      letter: { $substr: ['$title', 0, 1] },
    },
  },

  {
    $group: {
      _id: '$letter',
      movies: { $addToSet: { title: '$title' } }, // $$this
    },
  },

  { $sort: { _id: 1 } },
]);

db.movie.explain('executionStats').aggregate([
  { $unwind: '$tags' },

  {
    $set: {
      letter: { $substr: ['$title', 0, 1] },
    },
  },

  {
    $group: {
      _id: '$letter',
      movies: { $addToSet: { title: '$title' } }, // $$this
    },
  },

  { $sort: { _id: 1 } },
]);

// >>> MAP
// Regular Javascript Map: movie.tags.map(t => t.toUpperCase())
db.movie.aggregate([
  {
    $set: {
      tags: {
        $map: {
          input: '$tags',
          as: 't',
          in: { $toUpper: '$$t' },
        },
      },
    },
  },
]);

// >>> REDUCE
// Expected Output for each title: Horror, Sci-Fi. Thriller (categories in the same line)
// Regular Javascript Reduce: movie.tags.reduce((v,t) => v + t + ';', '')
db.movie.aggregate([
  {
    $set: {
      tags: {
        $reduce: {
          input: '$tags',
          initialValue: '',
          in: { $concat: ['$$value', '$$this', ';'] },
        },
      },
    },
  },
]);

// Pick up random items
db.movie.aggregate([{ $sample: { size: 2 } }]);

// ##############################################
// ############## CHAPTER 6: JOIN ###############
// ##############################################

/*  
  Left Outer Join

  SELECT *
  FROM checkout
  INNER JOIN product
  ON checkout.productId = product.productId
*/

// Let's start by recreating the product collection
db.product.drop();

db.product.insertMany([
  { productId: 1, name: 'Soap', price: 5, category: 'Hygiene' },
  { productId: 2, name: 'Toothpaste', price: 3.5, category: 'Hygiene' },
  { productId: 3, name: 'Coca Cola', price: 8.75, category: 'Hygiene' },
  { productId: 4, name: '7-Up', price: 6, category: 'Soft Drinks' },
  { productId: 5, name: 'Cornflakes', price: 19.9, category: 'Cereals' },
  { productId: 6, name: 'Banana', price: 8.9, category: 'Fruits' },
  { productId: 7, name: 'Apple', price: 12.3, category: 'Fruits' },
  { productId: 8, name: 'Orange', price: 12.5, category: 'Fruits' },
  { productId: 9, name: 'Pear', price: 8.5, category: 'Fruits' },
]);

// Now, let's create the checkout collection
db.checkout.insertMany([
  { customer: 'John', productId: 3, qty: 2 },
  { customer: 'Mary', productId: 1, qty: 5 },
  { customer: 'George', productId: 3, qty: 3 },
]);

// Finally it's time to join both collections
db.checkout.aggregate([
  {
    $lookup: {
      from: 'product',
      localField: 'productId',
      foreignField: 'productId',
      as: 'products',
    },
  },
]);

// Let's try a more complex example that calculates the total price of each checkout
db.checkout.aggregate([
  {
    $lookup: {
      from: 'product',
      localField: 'productId',
      foreignField: 'productId',
      as: 'products',
    },
  },

  {
    $set: {
      product: { $first: '$products' },
    },
  },

  {
    $set: {
      productName: '$product.name',
      productPrice: '$product.price',
    },
  },

  { $unset: ['product', 'products', '_id'] },

  {
    $set: {
      totalPrice: { $multiply: ['$productPrice', '$qty'] },
    },
  },
]);

// Let's dive deeper into the $lookup operator.
// We want to allow customers to checkout many items at once, so let's recreate the checkout collection
db.checkout.drop();
db.checkout.insertMany([
  {
    customer: 'John',
    basket: [
      { productId: 3, qty: 2 },
      { productId: 7, qty: 1 },
    ],
  },
  {
    customer: 'Mary',
    basket: [
      { productId: 1, qty: 5 },
      { productId: 4, qty: 6 },
      { productId: 9, qty: 1 },
    ],
  },
  { customer: 'George', basket: [{ productId: 3, qty: 3 }] },
]);

// Now, let's join the checkout collection with the product collection
db.checkout.aggregate([
  { $unwind: '$basket' },

  {
    $lookup: {
      from: 'product',
      localField: 'basket.productId',
      foreignField: 'productId',
      as: 'products',
    },
  },

  {
    $set: {
      product: { $first: '$products' },
    },
  },

  {
    $set: {
      customer: '$customer',
      lines: {
        productName: '$product.name',
        unitPrice: '$product.price',
        qty: '$basket.qty',
        totalPrice: { $multiply: ['$basket.qty', '$product.price'] },
      },
    },
  },

  { $unset: ['product', 'products'] },

  {
    $group: {
      _id: '$customer',
      lines: { $addToSet: '$lines' },
      totalPrice: { $sum: '$lines.totalPrice' },
    },
  },
]);

// ##############################################
// ########### CHAPTER 7: GEOSPATIAL ############
// ##############################################

/*
    https://geojson.org/
    longitude first, latitude last
    
    location: {
      type: "Point",
      coordinates: [-73.856077, 40.848447]
    }
    
    '2d' - like a flat map
    '2dsphere' - like the earth
*/

// Let's create a new collection called home to store the location of a few customers
db.home.insertMany([
  {
    name: 'São Caetano do Sul',
    location: {
      type: 'Point',
      coordinates: [-23.62527669750674, -46.56971455639664],
    },
  },
  {
    name: 'São Bernardo',
    location: {
      type: 'Point',
      coordinates: [-23.711258584529705, -46.55599302841044],
    },
  },
  {
    name: 'Jundiai',
    location: {
      type: 'Point',
      coordinates: [-23.188335445024357, -46.888094024670174],
    },
  },
  {
    name: 'Americana',
    location: {
      type: 'Point',
      coordinates: [-22.73669783870568, -47.32923303022884],
    },
  },
  {
    name: 'Itapolis',
    location: {
      type: 'Point',
      coordinates: [-21.594918135766388, -48.81194161390744],
    },
  },
  {
    name: 'Curitiba',
    location: {
      type: 'Point',
      coordinates: [-25.46839615438761, -49.295300080927426],
    },
  },
]);

// You must create a specific index to use geospatial queries
db.home.createIndex({ location: '2dsphere' });

// From the coordinate -23.62527669750674, -46.56971455639664, let's find the nearest home
// where the distance is less than 50km and greater than 1km
// https://www.google.com/maps/dir/-23.62527669750674,+-46.56971455639664/-23.7112586,-46.555993/@-23.6680443,-46.6126023,13z/data=!3m1!4b1!4m6!4m5!1m3!2m2!1d-46.5697146!2d-23.6252767!1m0?entry=ttu
//
db.home.find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [-23.62527669750674, -46.56971455639664],
      },
      $maxDistance: 50 * 1000,
      $minDistance: 1000,
    },
  },
});

// Let's try a more complex example
// We want to return all homes and the distance from the coordinate
// -23.62527669750674, -46.56971455639664, except the home called Americana
db.home.aggregate([
  {
    $geoNear: {
      near: {
        type: 'Point',
        coordinates: [-23.62527669750674, -46.56971455639664],
      },
      distanceField: 'distance',
      minDistance: 1,
      query: { name: { $nin: ['Americana'] } },
    },
  },
]);

/*

WHERE SHOULD I GO NOW?

https://www.practical-mongodb-aggregations.com/
https://learn.mongodb.com/

*/
