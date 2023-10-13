import { test, expect, afterAll } from "vitest";
import request from "supertest";
import { resetAllTables } from "../db/helpers.js";
import { pool } from "../db/index.js";
import app from "../app.js";

// 1. Getting all todos
test("GET /api/todos", async function () {
  const resetTable = await resetAllTables();
  const response = await request(app).get("/api/todos");
  expect();
  // assert that response body.success is true
  expect(response.body.success).toBe(true);
  // assert that response body.payload is displaying correct information
  expect(Array.isArray(response.body.payload)).toBe(true);
  expect(response.status).toEqual(200);
  expect(response.header["content-type"]).toMatch("application/json");
});

// 2. Creating a todo
test("POST /api/todos", async function () {
  // Reset database for expected testing
  const resetTable = await resetAllTables();

  const response = await request(app)
    .post("/api/todos")
    .set("content-type", "application/json")
    .send({ task: "Washing", completionDate: "2023-10-13" })
    .expect(201);

  // Response body success is true
  expect(response.body.success).toBe(true);
  // assert that response body.payload is displaying correct information
  expect(typeof response.body.payload).toEqual("object");
  // assert that there's a Content-Type response header which contains `application/json`
  expect(response.header["content-type"]).toMatch("application/json");
});

// 3. Deleting a todo

test("DELETE /api/todos/some_id", async function () {
  // Reset database for expected testing
  const resetTable = await resetAllTables();

  const fillTable = await request(app)
    .post("/api/todos")
    .set("content-type", "application/json")
    .send({ task: "Washing", completionDate: "2023-10-13" })
    .expect(201);
  const fillTableId = fillTable.body.payload.id;

  const response = await request(app)
    .delete(`/api/todos/${fillTableId}`)
    .expect(200);

  //console.log(response);
  // Response body success is true
  expect(response.body.success).toBe(true);
  // assert that the payload is an object
  expect(typeof response.body.payload).to.equal("object");

  // assert that there's a Content-Type response header which contains `application/json`
  expect(response.header["content-type"]).toMatch("application/json");
});

// 4. Invalid request

test("POST /api/todos", async function () {
  // Reset database for expected testing
  const resetTable = await resetAllTables();

  const response = await request(app)
    .post("/api/todos")
    .set("content-type", "application/json")
    .send({})
    .expect(400);

  expect(typeof response.body).toBe("object");
  // Response body success is false
  expect(response.body.success).toBe(false);
  expect(response.body.error).toMatch(
    "Please provide a 'task' and 'completionDate'"
  );

  // assert that there's a Content-Type response header which contains `application/json`
  expect(response.header["content-type"]).toMatch("application/json");
});

// 5. Invalid request

test("	DELETE /api/todos/NONEXISTENT_ID", async function () {
  // Reset database for expected testing
  const resetTable = await resetAllTables();

  const response = await request(app).delete("/api/todos/564").expect(404);
  expect(typeof response.body).toBe("object");
  // Response body success is false
  expect(response.body.success).toBe(false);
  // assert that eror is "No user with id 564 found"
  expect(response.body.error).toMatch("No todo with id 564 found");

  // assert that there's a Content-Type response header which contains `application/json`
  expect(response.header["content-type"]).toMatch("application/json");
});


/* afterAll(async () => {
       await pool.end()
})
 */