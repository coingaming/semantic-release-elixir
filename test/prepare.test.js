const path = require('path');
const { readFile } = require('fs').promises;
const prepare = require('../src/prepare');

const cwd = path.resolve(__dirname, './fixtures/valid');

const context = {
    nextRelease: { version: '1.2.0' },
    cwd,
    logger: { log: () => { } },
};

const versionFile = 'VERSION';

it('writes the new version to the VERSION file', async () => {
    await prepare({}, context, { versionFile });
    const versionContents = await readFile(path.resolve(cwd, versionFile), 'utf8');
    expect(versionContents).toEqual('VERSION="1.2.0"');
});
