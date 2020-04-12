const { downloadCipherFunction } = require('../index');
const path = require('path');

const main = async () => {
  const cipher = '1771777UfURdFo-egQSLQOpRjiLIKpLwC9tEnlgvmn7PNC3FTcAICg6xEfQw-KM9WL6Q9R4f3Awcfu4-PoZer9wDjsCt-4WZgIARwsLlPpJA';
  const pathToFn = path.join(__dirname + '/signature.js');
  await downloadCipherFunction(pathToFn, 'signature');
  const { signature } = require(pathToFn);
  const sig = await signature(cipher);
  console.log(`Signature for ${cipher} is ${sig}`);
};

main();
