import * as bcrypt from 'bcryptjs';

export const compare = async (value: string, hashedValue: string) => {
  return await bcrypt.compare(value, hashedValue);
};

export const hash = async (value: string, salt: number = 10) => {
  return await bcrypt.hash(value, salt);
};
