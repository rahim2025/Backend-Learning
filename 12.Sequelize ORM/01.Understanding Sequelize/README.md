# Sequelize is an ORM for Node.js

Sequelize is an Object-Relational Mapping (ORM) library for Node.js that provides a way to interact with relational databases using JavaScript. It supports various SQL dialects, including PostgreSQL, MySQL, SQLite, and MSSQL. Sequelize allows developers to define models that represent database tables and provides methods for querying and manipulating data in a more intuitive and object-oriented manner.

Product.findAll()
       ↓
    Sequelize
       ↓
      SQL
       ↓
    mysql2
       ↓
     MySQL

A Sequelize Model represents a database table in our application

```ts
Creating a Sequelize instance

Create:

src/config/database.ts

Start with:

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    "sequelize_learning",
    "root",
    "your_password",
    {
        host: "localhost",
        dialect: "mysql",
    }
);

```

This is an object that manages our application's connection/configuration to the database.
The word dialect means which database system Sequelize is communicating with.

Now in our server :

```ts
import { sequelize } from "./config/database";

async function startServer() {
    try {
        await sequelize.authenticate();

        console.log("Database connected!");

    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

startServer();
```

this code will try to connect to the database and log a message indicating whether the 
connection was successful or not. If the connection fails, it will log the error message. 

Now create our first model using sequelize

```ts 
import {
    DataTypes,
    Model
} from "sequelize";

import { sequelize } from "../config/database";

class Product extends Model {}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {  // this part will connect the model to Sequelize
        sequelize,
        tableName: "products",
    }
);

export default Product;
```

Those are the basic CRUD API of Sequelize

we'll use these methods constantly:

CREATE
Product.create()

READ
Product.findAll()
Product.findByPk()

UPDATE
product.update()
product.save()

DELETE
product.destroy()

