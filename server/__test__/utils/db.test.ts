import { dbConnect } from "../../src/utils/db";
import mongoose from "mongoose";
import log from "../../src/utils/logger";
import { env } from "process";

jest.mock("mongoose", () => ({
  set: jest.fn(),
  connect: jest.fn(),
}));

jest.mock("../src/utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

let capturedExitCode: number | undefined;

describe("Database Connection", () => {
  it("should connect with the database successfully", async () => {
    (mongoose.connect as jest.Mock).mockResolvedValueOnce({});
    await dbConnect();

    expect(mongoose.set).toHaveBeenCalledWith("strictQuery", true);
    expect(mongoose.connect).toHaveBeenCalledWith(env.MONGODB_URL, {
      dbName: "mern_auth",
    });
    expect(log.info).toHaveBeenCalledWith("Connected to MongoDB ✅");
  });

  it("should handle a database connection error", async () => {
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(
      new Error("Connection error")
    );

    const exitMock = jest
      .spyOn(process, "exit")
      .mockImplementation((code?: number) => undefined as never);

    await dbConnect();

    expect(mongoose.set).toHaveBeenCalledWith("strictQuery", true);
    expect(mongoose.connect).toHaveBeenCalledWith(env.MONGODB_URL, {
      dbName: "mern_auth",
    });
    expect(log.error).toHaveBeenCalledWith(
      "Failed to connect to MongoDB ❌: Error: Connection error"
    );
    expect(exitMock).toHaveBeenCalledWith(1); // Assert the exit code

    // Restore process.exit
    exitMock.mockRestore();
  });
});
