const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Product = require("../src/models/Product");

function validProduct(overrides = {}) {
  return new Product({
    tenantId: new mongoose.Types.ObjectId(),
    title: "Gaming Laptop",
    description: "Performance laptop",
    price: 50000,
    category: "Electronics",
    ...overrides,
  });
}

test("accepts a product with valid required fields", async () => {
  await assert.doesNotReject(() => validProduct().validate());
});

test("requires tenant, title, price and category", async () => {
  const product = new Product({});

  await assert.rejects(
    () => product.validate(),
    (error) => {
      assert.equal(error.name, "ValidationError");
      assert.ok(error.errors.tenantId);
      assert.ok(error.errors.title);
      assert.ok(error.errors.price);
      assert.ok(error.errors.category);
      return true;
    }
  );
});

test("rejects a negative price", async () => {
  await assert.rejects(
    () => validProduct({ price: -1 }).validate(),
    (error) => error.name === "ValidationError" && Boolean(error.errors.price)
  );
});

test("rejects a rating above 5", async () => {
  await assert.rejects(
    () => validProduct({ rating: 6 }).validate(),
    (error) => error.name === "ValidationError" && Boolean(error.errors.rating)
  );
});

test("rejects an unsupported product status", async () => {
  await assert.rejects(
    () => validProduct({ status: "unknown" }).validate(),
    (error) => error.name === "ValidationError" && Boolean(error.errors.status)
  );
});

test("applies the expected product defaults", () => {
  const product = validProduct();

  assert.equal(product.status, "active");
  assert.equal(product.stock, 10);
  assert.equal(product.rating, 4.8);
  assert.deepEqual(product.images, []);
});

test("allows a product with zero price and zero stock", async () => {
  await assert.doesNotReject(
    () => validProduct({ price: 0, stock: 0 }).validate()
  );
});
