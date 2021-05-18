const { readFile, writeFile } = require('fs').promises;
const path = require('path');
const execa = require('execa');
const { VERSION_REGEX } = require('./common');

const writeVersion = async ({ versionFile, nextVersion, logger, cwd }) => {
  // and the published gem version. Replacing `-` with `.` is a smaller difference.
  const fileVersion = nextVersion.replace('-', '.');
  const fullVersionPath = path.resolve(cwd, versionFile);
  const versionContents = await readFile(fullVersionPath, 'utf8');
  const newContents = versionContents.replace(VERSION_REGEX, `$1${fileVersion}$2`);
  logger.log('Writing version %s to `%s`', nextVersion, versionFile);
  await writeFile(fullVersionPath, newContents, 'utf8');

  return { fileVersion };
};

const commitVersion = async () => {
  await execa('git', ['ci', '-am', 'version update']);
  const branch = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  console.log('%s', JSON.stringify(branch));
  await execa('git', ['push', 'origin', branch]);
};

module.exports = async function prepare(
  _pluginConfig,
  { nextRelease: { version }, cwd, logger },
  { versionFile },
) {
  const { fileVersion } = await writeVersion({ versionFile, nextVersion: version, logger, cwd });
  await commitVersion();

  return { fileVersion };
};
