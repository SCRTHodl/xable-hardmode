// BROKEN IMPLEMENTATION - Payment Idempotency
// Critical vulnerability: no idempotency tracking

import { PaymentResult } from './retry.js';

export interface IdempotencyRecord {
  idempotencyKey: string;
  result: PaymentResult;
  timestamp: number;
}

// BROKEN: Empty store - no idempotency tracking
const idempotencyStore = new Map<string, IdempotencyRecord>();

// BROKEN: Always returns null - no actual idempotency check
export function getIdempotencyRecord(idempotencyKey: string): IdempotencyRecord | null {
  // VIOLATION: Should check store, but returns null
  return null;
}

// BROKEN: Does nothing - no idempotency storage
export function setIdempotencyRecord(idempotencyKey: string, result: PaymentResult): void {
  // VIOLATION: Should store record, but does nothing
  const record: IdempotencyRecord = {
    idempotencyKey,
    result,
    timestamp: Date.now()
  };
  // Commented out - this is the broken part
  // idempotencyStore.set(idempotencyKey, record);
}

// BROKEN: No duplicate detection
export function isDuplicatePayment(idempotencyKey: string): boolean {
  // VIOLATION: Should check for existing records
  return false;
}

// BROKEN: No cleanup of old records
export function cleanupOldRecords(maxAgeMs: number): void {
  // VIOLATION: Should remove old records, but does nothing
}
