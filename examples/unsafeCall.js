const { getCipherFunction } = require('../index');

const getSignature = async (cipher) => {
  const cipherFunction = await getCipherFunction();
  let signature = cipherFunction(cipher);
  return signature;
};

const main = async () => {
  const cipher = '1771777UfURdFo-egQSLQOpRjiLIKpLwC9tEnlgvmn7PNC3FTcAICg6xEfQw-KM9WL6Q9R4f3Awcfu4-PoZer9wDjsCt-4WZgIARwsLlPpJA';
  const signature = await getSignature(cipher);
  console.log(`Signature for ${cipher} is ${signature}`);
};

main();
