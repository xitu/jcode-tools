import {getCustomCode} from './get-custom-code';
import {CodeXClient} from './codex-client';
import {logger} from './logger';

export {logger};
export {getCustomCode};

function getBlobURL(jsCode) {
  const blob = new Blob([jsCode], {type: 'text/javascript'});
  const blobURL = URL.createObjectURL(blob);
  return blobURL;
}

export const getURL = async () => {
  const code = await getCustomCode();
  return getBlobURL(code);
};

export {CodeXClient};