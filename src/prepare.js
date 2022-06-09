const { readFile, writeFile } = require('fs').promises;
const path = require('path');
const execa = require('execa');
const { VERSION_REGEX } = require('./common');

const writeVersion = async ({ versionFile, nextVersion, logger, cwd }) => {
  const fullVersionPath = path.resolve(cwd, versionFile);
  const versionContents = await readFile(fullVersionPath, 'utf8');
  const versionTrimmed = versionContents.trim();
  const newContents = versionTrimmed.replace(VERSION_REGEX, `${nextVersion}`);
  logger.log('Writing version %s to `%s`', nextVersion, versionFile);
  await writeFile(fullVersionPath, newContents, 'utf8');

  return { nextVersion };
};

const commitVersion = async (command) => {
  if (command === 'git') {
    await execa(command, ['commit', '-m', '[skip ci] version update', 'VERSION']);
    const result = await execa(command, ['rev-parse', '--abbrev-ref', 'HEAD']);
    await execa(command, ['push', 'origin', result.stdout]);
  }
};

module.exports = async function prepare(
  _pluginConfig,
  { nextRelease: { version }, cwd, logger },
  { versionFile, command },
) {
  if (command === undefined) {
    command = 'git';
  }
  const { fileVersion } = await writeVersion({ versionFile, nextVersion: version, logger, cwd });
  await commitVersion(command);

  return { fileVersion };
};
