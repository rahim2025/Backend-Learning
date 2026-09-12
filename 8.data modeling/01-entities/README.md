# Entities

An entity is a real-world object, person, place, event, or concept that an application needs to store data about.

Simple definition:

```txt
Entity = something important in the business/application that needs to be stored
```

## Examples

In different backend systems, entities can be:

| System | Possible entities |
| --- | --- |
| E-commerce app | User, Product, Order, Payment, Cart |
| Blog app | User, Post, Comment, Category |
| School system | Student, Teacher, Course, Enrollment |
| Banking app | Customer, Account, Transaction |
| Food delivery app | Customer, Restaurant, Order, Delivery |

## Entity vs Object

In backend code, you may work with objects.

In database design, you model entities.

Example JavaScript object:

```js
const user = {
  id: 1,
  name: "Rahim",
  email: "rahim@example.com",
};
```

Database entity:

```txt
Entity: User
Attributes: id, name, email
```

The code object is an in-memory representation. The entity is the design idea behind what should be stored.

## Entity Attributes

An entity usually has attributes.

Attributes describe the entity.

Example:

```txt
Entity: Product

Attributes:
- id
- name
- price
- stock_quantity
- category
- created_at
```

Later, these attributes usually become columns in a table.

## Strong Entity

A strong entity can exist independently.

Example:

```txt
User
Product
Category
```

A user can exist even before placing an order.

A product can exist even if nobody has ordered it yet.

## Weak Entity

A weak entity depends on another entity.

Example:

```txt
OrderItem
```

An order item usually cannot exist without an order.

Example relationship:

```txt
Order -> OrderItem
```

An `OrderItem` depends on the `Order`.

## How to Identify Entities

When reading requirements, look for important nouns.

Requirement:

```txt
A customer can place many orders. Each order contains products.
```

Possible entities:

- Customer
- Order
- Product

But not every noun should become an entity. Only create entities for things that need to store meaningful data.

## Backend Example

Suppose an API needs:

```txt
Users can create posts. Other users can comment on posts.
```

Possible entities:

```txt
User
Post
Comment
```

Possible attributes:

```txt
User: id, name, email
Post: id, user_id, title, body
Comment: id, post_id, user_id, body
```

## Common Mistakes

### Mistake 1: Treating every noun as an entity

Bad thinking:

```txt
"User name" becomes a Name entity
```

Better:

```txt
name is an attribute of User
```

### Mistake 2: Missing relationship entities

Sometimes a relationship needs its own entity.

Example:

```txt
Student enrolls in Course
```

If you need to store enrollment date or grade, `Enrollment` should be an entity.

### Mistake 3: Designing tables before understanding entities

First understand the business concepts. Then design tables.

## Interview Answer

An entity is a real-world object or concept that an application needs to store data about. For example, in an e-commerce system, User, Product, Order, and Payment can be entities. Each entity has attributes, and those attributes usually become columns when the entity is converted into a database table.
