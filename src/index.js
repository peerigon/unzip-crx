"use strict";

const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const mkdirp = require("mkdirp");
const promisify = require("yaku/lib/promisify");

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

function crxToZip(buf) {
    function calcLength(a, b, c, d) {
        let length = 0;

        length += a;
        length += b << 8;
        length += c << 16;
        length += d << 24;
        return length;
    }

    // 50 4b 03 04
    // This is actually a zip file
    if (buf[0] === 80 && buf[1] === 75 && buf[2] === 3 && buf[3] === 4) {
        return buf;
    }

    // 43 72 32 34 (Cr24)
    if (buf[0] !== 67 || buf[1] !== 114 || buf[2] !== 50 || buf[3] !== 52) {
        throw new Error("Invalid header: Does not start with Cr24");
    }

    // 02 00 00 00
    if (buf[4] !== 2 || buf[5] || buf[6] || buf[7]) {
        throw new Error("Unexpected crx format version number.");
    }

    const publicKeyLength = calcLength(buf[8], buf[9], buf[10], buf[11]);
    const signatureLength = calcLength(buf[12], buf[13], buf[14], buf[15]);

    // 16 = Magic number (4), CRX format version (4), lengths (2x4)
    const zipStartOffset = 16 + publicKeyLength + signatureLength;

    return buf.slice(zipStartOffset, buf.length);
}

function unzip(crxFilePath, destination) {
    return readFile(crxFilePath)
        .then((buf) => {
            const zipBuf = crxToZip(buf);
            const zip = new JSZip(zipBuf);
            const zipFileKeys = Object.keys(zip.files);

            return Promise.all(zipFileKeys.map((filename) => {
                return new Promise((resolve, reject) => {
                    const isFile = !zip.files[filename].dir;
                    const fullPath = path.join(destination, filename);
                    const directory = isFile && path.dirname(fullPath) || fullPath;
                    const content = zip.files[filename].asNodeBuffer();

                    mkdirp(directory, (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        if (isFile) {
                            resolve(writeFile(fullPath, content));
                            return;
                        }

                        resolve(true);
                        return;
                    });
                });
            }));
        });
}

module.exports = unzip;