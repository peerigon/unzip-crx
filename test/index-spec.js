"use strict";

import expect from "unexpected";
import unzip from "../src";
import temp from "temp";
import path from "path";
import fs from "fs";
import mockfs from "mock-fs";

describe("unzip-crx", () => {
    let tempDir;

    before(() => {
        temp.track();
    });

    beforeEach(() => {
        tempDir = temp.mkdirSync("unzip-crx-test-files");
    });

    it("should unpack the given crx file", (done) => {
        const unzipPath = path.resolve(tempDir, "ext");
        const readmeFile = path.resolve(tempDir, "ext/README.md");

        unzip("./test/fixtures/extension.crx", unzipPath)
            .then(() => {
                const file = fs.readFileSync(readmeFile, "utf8");

                expect(file, "to equal", "# Crazy Readme File");
                done();
            })
            .catch((err) => done(err));
    });

    it("should unpack the given regular zip file", (done) => {
        const expectBinary = fs.readFileSync(
            path.join(__dirname, "./fixtures/extension/test.bin")
        );

        const unzipPath = path.resolve(tempDir, "ext");
        const readmeFile = path.resolve(tempDir, "ext/README.md");
        const binaryFile = path.resolve(tempDir, "ext/test.bin");

        unzip("./test/fixtures/extension-zipped.crx", unzipPath)
            .then(() => {
                const file = fs.readFileSync(readmeFile, "utf8");
                const binaryContent = fs.readFileSync(binaryFile);

                expect(file, "to equal", "# Crazy Readme File");
                expect(binaryContent, "to equal", expectBinary);
                done();
            })
            .catch((err) => done(err));
    });

    it("should throw if crx file header malformed", () => {
        const unzipPath = path.resolve(tempDir, "ext");

        return expect(
            unzip("./test/fixtures/extension-malformed.crx", unzipPath),
            "to be rejected with",
            new Error("Invalid header: Does not start with Cr24")
        );
    });

    it("should throw if crx version number is malformed", () => {
        const unzipPath = path.resolve(tempDir, "ext");

        return expect(
            unzip("./test/fixtures/extension-malformed-v.crx", unzipPath),
            "to be rejected with",
            new Error("Unexpected crx format version number.")
        );
    });

    describe("- ext dir is not writable", () => {
        it("should throw if directory is not writable", () => {
            const unzipPath = path.resolve(tempDir);

            fs.chmodSync(unzipPath, "644");

            return expect(
                unzip("./test/fixtures/extension.crx", unzipPath),
                "to be rejected with",
                /EACCES: permission denied/
            );
        });
    });

    afterEach(() => {
        temp.cleanupSync();
    });
});