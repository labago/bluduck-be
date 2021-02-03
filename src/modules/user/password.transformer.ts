import { Hash } from '../../utils/Hash';
import { ValueTransformer } from 'typeorm';

export class PasswordTransformer implements ValueTransformer {
  to(value) {
    return Hash.make(value);
  }

  from(value) {
    return value;
  }
}
