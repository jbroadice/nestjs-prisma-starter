import { PipeTransform } from '@nestjs/common';
import { isArray, isObject } from 'lodash';

/**
 * Converts bool strings ('true', 'false') to their actual Boolean representation.
 */
export class ParseBoolStringsPipe implements PipeTransform {
  transform(value) {
    if (isArray(value)) {
      return value.map((v) => this.transform(v));
    }
    if (isObject(value)) {
      const out = {};
      Object.keys(value).forEach((k) => {
        out[k] = this.transform(value[k]);
      });
      return out;
    }
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    return value;
  }
}
