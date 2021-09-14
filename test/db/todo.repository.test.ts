import { DbConnection } from "../../src/db/db-connection";


describe("Todo Repository", () => {

    let db;

    beforeAll(() => {
        jest.mock("./../../src/db/db-connection.ts")
        const DbConnectionMock = DbConnection as jest.Mocked<typeof DbConnection>
        new DbConnectionMock("wsddqw").query
    })


})