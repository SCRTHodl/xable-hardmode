// BROKEN IMPLEMENTATION
// This payment retry loop has critical governance violations

interface PaymentRequest {
  id: string;
  amount: number;
  recipient: string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Simulated payment processor (would be external in real system)
async function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  // Simulate 30% failure rate
  if (Math.random() < 0.3) {
    return { success: false, error: 'Network timeout' };
  }
  return { 
    success: true, 
    transactionId: `txn_${Date.now()}_${request.id}` 
  };
}

// BROKEN: Retries indefinitely without limits or backoff
export async function executePaymentWithRetry(request: PaymentRequest): Promise<PaymentResult> {
  let result: PaymentResult;
  
  while (true) {
    result = await processPayment(request);
    
    if (result.success) {
      return result;
    }
    
    // VIOLATION: No delay, no backoff, no limit
    // This can cause system overload and infinite loops
    console.log(`Retrying payment ${request.id}...`);
  }
}

// BROKEN: No idempotency check
export async function processPaymentBatch(requests: PaymentRequest[]): Promise<PaymentResult[]> {
  const results: PaymentResult[] = [];
  
  for (const request of requests) {
    const result = await executePaymentWithRetry(request);
    results.push(result);
  }
  
  return results;
}
