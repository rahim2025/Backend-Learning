# The basic Sequelize TypeScript model

```ts
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

import { sequelize } from "../config/database";

class Product extends Model<  //this extends the model means Product is a Sequelize Model.
    InferAttributes<Product>,
    InferCreationAttributes<Product>
> {
    declare id: CreationOptional<number>;

    declare name: string;

    declare price: number;

    declare stock: number;

    declare category: string;

    declare createdAt: CreationOptional<Date>;

    declare updatedAt: CreationOptional<Date>;
}
```

## Why does Model have <...>?

Those are generic type parameters.
Here are the types of Product's attributes, and here are the types used when creating a Product

## InferAttributes<Product>

This type will infer the attributes of the Product model, which are the properties that exist on instances of the model. It will include all the attributes defined in the model, including those that are optional or have default values.

So we dont need to manually define

```ts
interface ProductAttributes {
    id: number;
    name: string;
    price: number;
    stock: number;
}
```

## InferCreationAttributes<Product>

This is about creating a new record.

This distinction matters because not every database attribute needs to be supplied when creating a record.
For example:

id

is usually generated automatically.

Similarly:

createdAt
updatedAt

may be generated automatically.
So when we write:

```ts
Product.create({
    name: "iPhone",
    price: 1000,
    stock: 10,
});
```

we don't want TypeScript complaining:

Where is id?
Where is createdAt?
Where is updatedAt?

That's where CreationOptional comes in.

## CreationOptional

Consider:

```ts
declare id: CreationOptional<number>;
```

This means:
id exists and is a number, but it doesn't have to be provided when creating the model.

## Why use declare?

This property exists for type-checking purposes, but don't generate a JavaScript class field for it

## Now Product.init()

Defining the TypeScript class isn't enough.

We also need to tell Sequelize how the database columns work.

```ts 

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(100),
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
    {
        sequelize,
        tableName: "products",
        timestamps: true,
    }
);
```

## A complete Product model

```ts
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

import { sequelize } from "../config/database";

class Product extends Model<
    InferAttributes<Product>,
    InferCreationAttributes<Product>
> {
    declare id: CreationOptional<number>;

    declare name: string;

    declare price: number;

    declare stock: number;

    declare category: string;

    declare createdAt: CreationOptional<Date>;

    declare updatedAt: CreationOptional<Date>;
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(100),
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

        category: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "products",
        timestamps: true,
    }
);

export default Product;
```

