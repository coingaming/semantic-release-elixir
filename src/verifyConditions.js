const util = require('util');
const path = require('path');
const { readFile } = require('fs').promises;
const SemanticReleaseError = require('@semantic-release/error');
const glob = util.promisify(require('glob'));

const { VERSION_REGEX } = require('./common');

const verifyVersionFile = async cwd => {
    const versionFiles = await glob('VERSION', { cwd });
    if (versionFiles.length !== 1) {
        throw new SemanticReleaseError(
            "Couldn't find a `VERSION` file.",
            'ENOVERSIONFILE',
            `A \`VERSION\` file in the root of your project is required.
Please create a \`VERSION\` file with a defined \`VERSION\` constant in your root dir.
      `,
        );
    }

    const [versionFile] = versionFiles;
    const fullVersionPath = path.resolve(cwd, versionFile);
    const versionContents = await readFile(fullVersionPath, 'utf8');
    const versionTrimmed = versionContents.trim();
    if (!VERSION_REGEX.test(versionTrimmed)) {
        throw new SemanticReleaseError(
            `Couldn't find a valid version constant defined in \`${versionFile}\`.`,
            'EINVALIDVERSIONFILE',
            `Your \`VERSION\` file must define a \`VERSION\` constant.
Please define your app's version a string constant named \`VERSION\` inside your \`VERSION\` file.
      `,
        );
    }

    return versionFile;
};

/**
 * Called by semantic-release during the verification step
 * @param {*} pluginConfig The semantic-release plugin config
 * @param {*} context The context provided by semantic-release
 */
module.exports = async function verify({ cwd }) {
    if (cwd === undefined) {
        cwd = process.cwd();
    }
    const versionFile = await verifyVersionFile(cwd);

    return { versionFile };
};
