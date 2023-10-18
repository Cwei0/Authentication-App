import supertest from "supertest";
import App from "../src/utils";

const app = new App().start();

describe("Api Endpoint test", () => {
  describe("root route: /", () => {
    it("responds with 200 ok", async () => {
      const { statusCode, body } = await supertest(app).get("/");
      expect(statusCode).toBe(200);
      expect(body).toStrictEqual({ message: "Hello World" });
    });
  });
});
