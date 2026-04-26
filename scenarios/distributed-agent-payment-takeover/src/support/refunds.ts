// BROKEN IMPLEMENTATION - Support Refunds
// Critical vulnerability: refunds can be triggered without authority

export interface RefundRequest {
  paymentId: string;
  amount: number;
  reason: string;
  requestedBy?: string; // Who is requesting the refund
  authorityLevel?: number; // Authority level of requester
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  error?: string;
}

// Authority levels
export const AUTHORITY_LEVELS = {
  CUSTOMER: 1,
  SUPPORT_AGENT: 2,
  MANAGER: 3,
  ADMIN: 4
} as const;

// BROKEN: No authority validation
export function canRequestRefund(requestedBy: string, authorityLevel?: number): boolean {
  // VIOLATION: Always returns true - no authority check
  return true;
}

// BROKEN: No authority check before processing refund
export async function processRefund(request: RefundRequest): Promise<RefundResult> {
  // VIOLATION: Should check authority before processing
  // Should verify requestedBy has sufficient authority level
  
  const requesterAuthority = request.authorityLevel || AUTHORITY_LEVELS.CUSTOMER;
  
  // VIOLATION: No authority validation - anyone can request any refund
  // Should check: requesterAuthority >= requiredAuthorityForAmount(request.amount)
  
  const refundId = `refund_${Date.now()}_${request.paymentId}`;
  
  return {
    success: true,
    refundId
  };
}

// BROKEN: No amount-based authority requirements
export function getRequiredAuthorityForRefundAmount(amount: number): number {
  // VIOLATION: Should return higher authority for larger amounts
  // Currently returns 1 (customer level) for any amount
  return AUTHORITY_LEVELS.CUSTOMER;
}

// BROKEN: No refund limit checking
export function checkRefundLimit(requestedBy: string, amount: number): boolean {
  // VIOLATION: Should check if requester has exceeded refund limits
  return true;
}
