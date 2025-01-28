import basicNumber from './basicNumber';
import { defaultOptions } from './shared';

function integerNumber(value, reference = value, options) {
  const finalOptions = {...defaultOptions, ...options}
  reference = Math.max(100, Math.abs(reference))

  return basicNumber(value, reference, undefined, finalOptions)
}

export default integerNumber;
