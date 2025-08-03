// utils/hash.ts
import bcrypt from 'bcryptjs';

/**
 * Hasheia uma senha usando bcrypt com salt de 10 rounds.
 * @param password A senha em texto puro
 * @returns Hash da senha
 */
export async function hashPassword(password: any): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compara uma senha em texto puro com o hash armazenado.
 * @param plainPassword A senha digitada pelo usuário
 * @param hashedPassword O hash da senha armazenada no banco
 * @returns Booleano indicando se a senha confere
 */
export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}