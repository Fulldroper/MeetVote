/**
 * Generates a unique, URL-safe Snowflake-based identifier encoded in Base62.
 *
 * @param {number} [workerId=0] Worker identifier (0-31).
 * @returns {string} Base62-encoded Snowflake ID.
 */
const EPOCH = 1704067200000n // 2024-01-01T00:00:00.000Z
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
let sequence = 0n

export default function generateId(workerId = 0): string {
  const snowflake =
    ((BigInt(Date.now()) - EPOCH) << 17n) |
    ((BigInt(workerId) & 0x1fn) << 12n) |
    ((sequence = (sequence + 1n) & 0xfffn))

  let value = snowflake
  let result = ''

  while (value > 0n) {
    result = ALPHABET[Number(value % 62n)] + result
    value /= 62n
  }

  return result
}
