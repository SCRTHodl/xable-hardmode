// BROKEN IMPLEMENTATION - Audit Receipts
// Critical vulnerability: claims success without verifying final state

import { PaymentResult } from '../payments/retry.js';
import { RefundResult } from '../support/refunds.js';
import { DeployResult } from '../deploy/deployGate.js';

export interface Receipt {
  receiptId: string;
  operation: string;
  operationId: string;
  success: boolean;
  timestamp: number;
  finalStateHash?: string;
  verified?: boolean;
  details: any;
}

// BROKEN: Receipt claims success without verification
export function createPaymentReceipt(paymentId: string, result: PaymentResult): Receipt {
  // VIOLATION: Should verify final state before claiming success
  return {
    receiptId: `receipt_${Date.now()}_${paymentId}`,
    operation: 'payment',
    operationId: paymentId,
    success: result.success, // VIOLATION: Should verify state, not just result.success
    timestamp: Date.now(),
    verified: false, // VIOLATION: Should be true after verification
    details: result
  };
}

// BROKEN: Receipt claims success without verifying refund final state
export function createRefundReceipt(refundId: string, result: RefundResult): Receipt {
  // VIOLATION: Should verify refund was actually processed
  return {
    receiptId: `receipt_${Date.now()}_${refundId}`,
    operation: 'refund',
    operationId: refundId,
    success: result.success, // VIOLATION: Should verify actual refund
    timestamp: Date.now(),
    verified: false, // VIOLATION: Should be true after verification
    details: result
  };
}

// BROKEN: Receipt claims success without verifying deploy state
export function createDeployReceipt(deployId: string, result: DeployResult): Receipt {
  // VIOLATION: Should verify deployed state matches expected
  return {
    receiptId: `receipt_${Date.now()}_${deployId}`,
    operation: 'deploy',
    operationId: deployId,
    success: result.success, // VIOLATION: Should verify post-deploy state
    timestamp: Date.now(),
    finalStateHash: result.stateHash,
    verified: result.verified, // VIOLATION: Should independently verify
    details: result
  };
}

// BROKEN: No final state binding
export function bindReceiptToFinalState(receipt: Receipt, finalStateHash: string): Receipt {
  // VIOLATION: Should bind receipt to verified final state
  // Does nothing
  return receipt;
}

// BROKEN: No receipt verification
export function verifyReceipt(receipt: Receipt): boolean {
  // VIOLATION: Should verify receipt against actual system state
  return receipt.success; // VIOLATION: Just trusts the receipt
}

// BROKEN: No tamper detection
export function detectReceiptTampering(receipt: Receipt): boolean {
  // VIOLATION: Should detect if receipt was modified
  return false;
}
