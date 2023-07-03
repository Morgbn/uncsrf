import { expect, it, describe, assertType } from "vitest";
import "./polyfill";

import * as uncsrfNode from "../src/csrf.node";
import * as uncsrfWeb from "../src/csrf.web";

describe("uncsrf:node", () => {
  runTests(uncsrfNode);
});

describe("uncsrf:web", () => {
  runTests(uncsrfWeb);
});

function runTests(csrf) {
  it("importEncryptSecret", async () => {
    const encryptSecret = await csrf.importEncryptSecret();
    if (encryptSecret instanceof Buffer) {
      expect(encryptSecret.length).toBe(32);
    } else {
      assertType<JsonWebKey>(encryptSecret);
    }
  });

  it("create", async () => {
    const token = await csrf.create(
      "secret",
      await csrf.importEncryptSecret(),
      csrf.defaultEncryptAlgorithm
    );
    expect(token.includes(":")).toBe(true);
    const [iv, encrypted] = token.split(":");
    expect(iv.length).toBe(24);
    expect(encrypted.length).toBe(24);
  });

  it("verify", async () => {
    const encryptSecret = await csrf.importEncryptSecret();
    const token = await csrf.create(
      "secret",
      encryptSecret,
      csrf.defaultEncryptAlgorithm
    );
    expect(
      await csrf.verify(
        "secret",
        token,
        encryptSecret,
        csrf.defaultEncryptAlgorithm
      )
    ).toBe(true);

    expect(
      await csrf.verify(
        "secret",
        "",
        encryptSecret,
        csrf.defaultEncryptAlgorithm
      )
    ).toBe(false);

    expect(
      await csrf.verify(
        "secret",
        token,
        undefined,
        csrf.defaultEncryptAlgorithm
      )
    ).toBe(false);
  });

  it("randomSecret", () => {
    const uuid = csrf.randomSecret();
    expect(uuid).toEqual(
      expect.stringMatching(
        /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/
      )
    );
  });
}
