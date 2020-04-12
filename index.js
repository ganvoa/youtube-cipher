const axios = require('axios');
const fs = require('fs');

const getUrlPlayer = async (videoUrl) => {
  let body = await getBody(videoUrl);
  let match = body.match(/assets\":.*?\"js\":"(.*?)"/);
  if (match) {
    return `https://www.youtube.com${match[1].replace(/\\\//g, '/')}`;
  } else {
    throw new Error('Couldnt find JSON');
  }
};

const getBody = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((res) => {
        if (res.status == 200) resolve(res.data);
        else reject(new Error(`Got status ${res.status} - ${res.statusText}`));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getSignature = async (cipher) => {
  const cipherFunction = await getCipherFunction();
  let signature = cipherFunction(cipher);
  return signature;
};

const getCipherFunction = async () => {
  const urlTest = 'https://www.youtube.com';
  const playerUrl = await getUrlPlayer(urlTest);
  const body = await getBody(playerUrl);
  let match = body.match(/=([a-zA-Z0-9\$]+?)\(decodeURIComponent/);
  if (!match) throw new Error('Couldnt find function');
  let functionName = match[1];
  match = body.match(new RegExp(`${functionName}=function(\\(.+?})`));
  if (!match) throw new Error('Couldnt find function');
  let functionBody = match[1];
  match = functionBody.match(/;(.+?)\..+?\(/);
  if (!match) throw new Error('Couldnt find aux function');
  let auxFunctionName = match[1];
  match = body.match(new RegExp(`(var ${auxFunctionName}={[\\s\\S]+?};)`));
  if (!match) throw new Error('Couldnt find aux function body');
  let auxFunctionBody = match[1];
  return new Function(`${auxFunctionBody} function dec${functionBody} return dec(arguments[0])`);
};

const downloadCipherFunction = async (path = 'getSignature.js', fnName = 'getSignature') => {
  const urlTest = 'https://www.youtube.com';
  const playerUrl = await getUrlPlayer(urlTest);
  const body = await getBody(playerUrl);
  let match = body.match(/=([a-zA-Z0-9\$]+?)\(decodeURIComponent/);
  if (!match) throw new Error('Couldnt find function');
  let functionName = match[1];
  match = body.match(new RegExp(`${functionName}(=function\\(.+?})`));
  if (!match) throw new Error('Couldnt find function');
  let functionBody = `module.exports.${fnName}${match[1]}`;
  match = functionBody.match(/;(.+?)\..+?\(/);
  if (!match) throw new Error('Couldnt find aux function');
  let auxFunctionName = match[1];
  match = body.match(new RegExp(`(var ${auxFunctionName}={[\\s\\S]+?};)`));
  if (!match) throw new Error('Couldnt find aux function body');
  let auxFunctionBody = match[1];
  const content = `${auxFunctionBody}\n${functionBody}`;
  fs.writeFileSync(path, content);
  return;
};

module.exports.downloadCipherFunction = downloadCipherFunction;
module.exports.getCipherFunction = getCipherFunction;
module.exports.getSignature = getSignature;
