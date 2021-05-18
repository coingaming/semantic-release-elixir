const fileVerify = require('./src/verifyConditions');
const filePrepare = require('./src/prepare');

let versionFile;

async function verifyConditions(pluginConfig, context) {
  ({ versionFile } = await fileVerify(pluginConfig, context));
}

async function prepare(pluginConfig, context) {
  ({ versionFile } = await filePrepare(pluginConfig, context, { versionFile }));
}

module.exports = { verifyConditions, prepare };
