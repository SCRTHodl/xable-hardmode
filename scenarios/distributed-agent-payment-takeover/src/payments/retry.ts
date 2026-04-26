// BROKEN IMPLEMENTATION - Payment Retry Logic
// Critical vulnerability: infinite retry without idempotency

export interface PaymentRequest {
  id: string;
  amount: number;
  recipient: string;
  idempotencyKey?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  duplicate?: boolean;
}

// Simulated payment processor
export async function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  // Simulate 40% failure rate
  if (Math.random() < 0.4) {
    return { success: false, error: 'Network timeout' };
  }
  return { 
    success: true, 
    transactionId: `txn_${Date.now()}_${request.id}` 
  };
}

// BROKEN: No retry limit, no idempotency check
export async function executePaymentWithRetry(request: PaymentRequest): Promise<PaymentResult> {
  let result: PaymentResult;
  let attempts = 0;
  
  // VIOLATION: Infinite loop - no max retry limit
  // VIOLATION: No idempotency check - can cause duplicate charges
  while (true) {
    attempts++;
    result = await processPayment(request);
    
    if (result.success) {
      return result;
    }
    
    console.log(`Retry attempt ${attempts} for payment ${request.id}...`);
  }
}

// BROKEN: No idempotency validation
export function checkIdempotency(idempotencyKey: string): PaymentResult | null {
  // VIOLATION: Always returns null - no idempotency tracking
  return null;
}

// BROKEN: No idempotency storage
export function storeIdempotencyResult(idempotencyKey: string, result: PaymentResult): void {
  // VIOLATION: Does nothing - no storage
}
