const path = require('path');
// const { readFile } = require('fs').promises;
const SemanticReleaseError = require('@semantic-release/error');
const verifyConditions = require('../src/verifyConditions');

const validCwd = path.resolve(__dirname, './fixtures/valid');

describe('when there is no VERSION file', () => {
    it('throws an error', async () => {
        await expect(
            verifyConditions(process.cwd()),
        ).rejects.toThrow(new SemanticReleaseError("Couldn't find a `VERSION` file."));
    });
});

describe('when the VERSION file is invalid', () => {
    it('throws an error', async () => {
        const cwd = path.resolve(__dirname, './fixtures/invalid');
        await expect(
            verifyConditions(cwd),
        ).rejects.toThrow("Couldn't find a valid version constant defined in `VERSION`.");
    });
});

it('verifies the version file', async () => {
    const { versionFile } = await verifyConditions(validCwd);
    expect(versionFile).toEqual('VERSION');
});
