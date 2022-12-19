import { createHmac } from 'crypto';

export const passwordMaker = (
  pwd: number,
): { password: string; salt: string } => {
  const salt = String(Math.round(new Date().valueOf() + Math.random()));
  const password: string = createHmac('sha512', process.env.CRYPTO)
    .update(pwd + salt)
    .digest('hex');
  return { password, salt };
};

export const passwordDecoding = (pwd: { password: string; salt: string }) => {
  const { password, salt } = pwd;
  const check: string = createHmac('sha512', process.env.CRYPTO)
    .update(password + salt)
    .digest('hex');
  return check;
};
