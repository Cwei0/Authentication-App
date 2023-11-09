import App from "../src/utils";
import supertest from "supertest";
import { UserController } from "../src/controllers/auth.controller";

const app = new App().start();

const userInput = {
  name: "Gabe Bott",
  email: "gabe@gmail.com",
  password: "Aa$12345",
  confirmPassword: "Aa$12345",
};

const userPayload = {
  _id: "6525a09e3082cd6cb5840caa",
  email: "gabe@gmail.com",
  name: "Gabe Bott",
  password: "$2b$10$WSThCPST6gX5/NCVnEJeY.pygKUX6ELrnRxRu4FT7eukAKP4mLWFi",
  createdAt: "2023-10-10T19:06:06.840Z",
  updatedAt: "2023-10-10T19:06:06.840Z",
  __v: 0,
};

describe("authentication", () => {
  // User registration

  describe("user registration", () => {
    describe("given the input info are valid", () => {
      it("should return user payload and status of 201", async () => {
        const createUserServiceMock = jest
          .spyOn(new UserController(), "createNewUser")
          //@ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await supertest(app)
          .post("/auth/local/signup")
          .send(userInput);

        expect(statusCode).toBe(201);
        expect(body).toEqual(userPayload);
        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });

    describe('given the input info are invalid', () => {});
  });
});
