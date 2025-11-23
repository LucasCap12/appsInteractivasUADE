/**
 * @AI_CONTEXT Strategy Pattern Implementation - Payment Processing
 * 
 * DESIGN PATTERN: Strategy Pattern (GoF Behavioral Pattern)
 * INTENT: Define a family of algorithms (payment methods), encapsulate each one,
 * and make them interchangeable. Strategy lets the algorithm vary independently
 * from clients that use it.
 * 
 * ARCHITECTURE:
 * - PaymentStrategy: Abstract interface (base class) defining common operations
 * - Concrete Strategies: CreditCardPayment, DebitCardPayment, BankTransferPayment, 
 *   CashPayment, MercadoPagoPayment (each implements process() and validate())
 * - PaymentProcessor: Context class that uses a PaymentStrategy
 * 
 * USE CASE IN E-COMMERCE:
 * Instead of switch/if-else chains in Checkout.jsx, each payment method
 * encapsulates its own processing logic, validation rules, and fee calculations.
 * New payment methods can be added without modifying existing code (Open/Closed Principle).
 * 
 * BUSINESS RULES (Encoded in Each Strategy):
 * - CreditCardPayment: 12 installments, 3% processing fee
 * - DebitCardPayment: Immediate payment, 5% discount
 * - BankTransferPayment: Manual verification required, 10% discount
 * - CashPayment: Payment on delivery, restricted to CABA/GBA
 * - MercadoPagoPayment: Buyer protection, 2.5% processing fee
 * 
 * @EXAMPLE USAGE:
 * ```javascript
 * import { PaymentProcessor, CreditCardPayment } from './strategies/PaymentStrategy';
 * 
 * const processor = new PaymentProcessor(new CreditCardPayment());
 * const orderData = { total: 10000, items: [...], shippingData: {...} };
 * 
 * if (processor.validate(orderData)) {
 *   const result = processor.process(orderData);
 *   console.log(result.message); // "Pago con tarjeta de crédito procesado exitosamente..."
 * }
 * ```
 * 
 * @ACADEMIC_NOTE:
 * This implementation demonstrates:
 * 1. Strategy Pattern (textbook example with payment methods)
 * 2. Polymorphism (all strategies implement same interface)
 * 3. Dependency Injection (PaymentProcessor receives strategy in constructor)
 * 4. Single Responsibility Principle (each strategy handles one payment type)
 * 5. Open/Closed Principle (extensible without modifying existing code)
 */

// @AI_CONTEXT PaymentStrategy Base Class (Abstract Interface)
// Defines contract that all payment strategies must implement
// JavaScript doesn't have abstract classes, so we use Error throws to enforce implementation
class PaymentStrategy {
  /**
   * @TASK process - Execute payment transaction
   * @INPUT orderData { total: number, items: array, shippingData: object }
   * @OUTPUT { success: boolean, transactionId: string, message: string, details: object }
   * 
   * @AI_CONTEXT Template Method Pattern:
   * Each concrete strategy implements specific processing logic
   * (e.g., API calls to payment gateways, fee calculations, discount application)
   */
  process(orderData) {
    throw new Error('process() must be implemented by concrete strategy');
  }

  /**
   * @TASK validate - Validate payment method requirements
   * @INPUT orderData { total: number, items: array, shippingData: object }
   * @OUTPUT { valid: boolean, errors: array }
   * 
   * @VALIDATION Business Rules:
   * Each strategy defines its own validation (e.g., CashPayment checks location)
   */
  validate(orderData) {
    throw new Error('validate() must be implemented by concrete strategy');
  }

  /**
   * @TASK getName - Get payment method display name
   * @OUTPUT string (e.g., "Tarjeta de Crédito")
   */
  getName() {
    throw new Error('getName() must be implemented by concrete strategy');
  }

  /**
   * @TASK calculateFees - Calculate processing fees/discounts
   * @INPUT amount number (order total in ARS)
   * @OUTPUT number (final amount after fees/discounts)
   * 
   * @AI_CONTEXT Fee Strategy:
   * - Positive percentage = fee (credit card 3%)
   * - Negative percentage = discount (debit card -5%)
   */
  calculateFees(amount) {
    return amount; // Default: no fees (overridden by strategies that apply fees)
  }
}

// @AI_CONTEXT CreditCardPayment Strategy - Concrete Implementation
// @BUSINESS_RULES: 12 installments, 3% processing fee, card validation required
class CreditCardPayment extends PaymentStrategy {
  process(orderData) {
    // @SIMULATION: Real implementation would call payment gateway API (e.g., MercadoPago, Stripe)
    // Here we simulate successful processing with random transaction ID
    const finalAmount = this.calculateFees(orderData.total);
    const transactionId = `CC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      transactionId,
      message: `Pago con tarjeta de crédito procesado exitosamente. Monto total: $${finalAmount.toFixed(2)} (incluye 3% de cargo por procesamiento). Hasta 12 cuotas sin interés disponibles.`,
      details: {
        method: this.getName(),
        originalAmount: orderData.total,
        fee: finalAmount - orderData.total,
        finalAmount,
        installmentsAvailable: 12
      }
    };
  }

  validate(orderData) {
    const errors = [];

    // @VALIDATION Minimum amount check (credit cards have minimum transaction)
    if (orderData.total < 100) {
      errors.push('El monto mínimo para pago con tarjeta de crédito es $100');
    }

    // @VALIDATION Card data check (in real app, would validate card number, CVV, expiry)
    // For demo purposes, we assume card data is collected in a separate secure form
    // and only validate business rules here

    return {
      valid: errors.length === 0,
      errors
    };
  }

  getName() {
    return 'Tarjeta de Crédito';
  }

  calculateFees(amount) {
    // @BUSINESS_RULE 3% processing fee for credit cards
    return amount * 1.03;
  }
}

// @AI_CONTEXT DebitCardPayment Strategy - Immediate Payment with Discount
// @BUSINESS_RULES: No installments, 5% discount, immediate fund deduction
class DebitCardPayment extends PaymentStrategy {
  process(orderData) {
    const finalAmount = this.calculateFees(orderData.total);
    const transactionId = `DB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      transactionId,
      message: `Pago con tarjeta de débito procesado exitosamente. Monto total: $${finalAmount.toFixed(2)} (5% de descuento aplicado). Los fondos se debitarán inmediatamente.`,
      details: {
        method: this.getName(),
        originalAmount: orderData.total,
        discount: orderData.total - finalAmount,
        finalAmount
      }
    };
  }

  validate(orderData) {
    const errors = [];

    if (orderData.total < 50) {
      errors.push('El monto mínimo para pago con tarjeta de débito es $50');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  getName() {
    return 'Tarjeta de Débito';
  }

  calculateFees(amount) {
    // @BUSINESS_RULE 5% discount for debit cards (negative fee)
    return amount * 0.95;
  }
}

// @AI_CONTEXT BankTransferPayment Strategy - Manual Verification Required
// @BUSINESS_RULES: 10% discount, 24-48h verification, requires proof of payment upload
class BankTransferPayment extends PaymentStrategy {
  process(orderData) {
    const finalAmount = this.calculateFees(orderData.total);
    const transactionId = `BT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      transactionId,
      message: `Orden registrada. Monto a transferir: $${finalAmount.toFixed(2)} (10% de descuento aplicado). Por favor, realiza la transferencia a CBU: 0000003100012345678900 (alias: MILAPRO.MARKET). Envía el comprobante a pagos@milapro.com. El pedido se procesará una vez verificado el pago (24-48 horas).`,
      details: {
        method: this.getName(),
        originalAmount: orderData.total,
        discount: orderData.total - finalAmount,
        finalAmount,
        bankDetails: {
          cbu: '0000003100012345678900',
          alias: 'MILAPRO.MARKET',
          bank: 'Banco Nación',
          accountHolder: 'MiLaPro Marketplace SRL'
        },
        verificationTime: '24-48 horas'
      }
    };
  }

  validate(orderData) {
    const errors = [];

    // @BUSINESS_RULE Minimum amount for bank transfer (to offset manual verification cost)
    if (orderData.total < 500) {
      errors.push('El monto mínimo para transferencia bancaria es $500');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  getName() {
    return 'Transferencia Bancaria';
  }

  calculateFees(amount) {
    // @BUSINESS_RULE 10% discount for bank transfers (incentive for low-cost payment method)
    return amount * 0.90;
  }
}

// @AI_CONTEXT CashPayment Strategy - Payment on Delivery (COD)
// @BUSINESS_RULES: Geographic restriction (CABA/GBA only), no fees, exact change recommended
class CashPayment extends PaymentStrategy {
  process(orderData) {
    const transactionId = `CASH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      transactionId,
      message: `Orden registrada para pago en efectivo. Monto a pagar: $${orderData.total.toFixed(2)}. El delivery cobrará el monto total al momento de la entrega. Por favor, tener efectivo o cambio exacto preparado.`,
      details: {
        method: this.getName(),
        amount: orderData.total,
        instructions: 'Pago contra entrega. El repartidor llevará cambio de hasta $1000.'
      }
    };
  }

  validate(orderData) {
    const errors = [];

    // @BUSINESS_RULE Geographic restriction (cash payments only in CABA/GBA for security)
    const allowedProvinces = ['Buenos Aires', 'CABA', 'Capital Federal'];
    const shippingProvince = orderData.shippingData?.provincia || '';
    
    if (!allowedProvinces.some(p => shippingProvince.toLowerCase().includes(p.toLowerCase()))) {
      errors.push('Pago en efectivo solo disponible en CABA y GBA');
    }

    // @BUSINESS_RULE Maximum amount for cash payments (security measure)
    if (orderData.total > 50000) {
      errors.push('El monto máximo para pago en efectivo es $50,000 por razones de seguridad');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  getName() {
    return 'Efectivo';
  }

  calculateFees(amount) {
    // @BUSINESS_RULE No fees for cash payments
    return amount;
  }
}

// @AI_CONTEXT MercadoPagoPayment Strategy - Third-Party Payment Gateway
// @BUSINESS_RULES: Buyer protection, 2.5% fee, redirects to MercadoPago checkout
class MercadoPagoPayment extends PaymentStrategy {
  process(orderData) {
    const finalAmount = this.calculateFees(orderData.total);
    const transactionId = `MP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // @SIMULATION: Real implementation would create MercadoPago preference and return checkout URL
    // Using MercadoPago SDK: mercadopago.preferences.create({ items: [...], back_urls: {...} })
    const checkoutUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${transactionId}`;

    return {
      success: true,
      transactionId,
      message: `Redirigiendo a MercadoPago para completar el pago. Monto total: $${finalAmount.toFixed(2)} (incluye 2.5% de cargo por procesamiento). Serás redirigido a una página segura de MercadoPago.`,
      details: {
        method: this.getName(),
        originalAmount: orderData.total,
        fee: finalAmount - orderData.total,
        finalAmount,
        checkoutUrl,
        features: ['Protección al comprador', 'Múltiples métodos de pago', 'Hasta 18 cuotas']
      }
    };
  }

  validate(orderData) {
    const errors = [];

    // @VALIDATION No minimum amount (MercadoPago handles small transactions well)
    // @VALIDATION MercadoPago is available in all Argentina regions

    return {
      valid: errors.length === 0,
      errors
    };
  }

  getName() {
    return 'MercadoPago';
  }

  calculateFees(amount) {
    // @BUSINESS_RULE 2.5% processing fee (lower than credit card direct)
    return amount * 1.025;
  }
}

// @AI_CONTEXT PaymentProcessor - Context Class (Uses Strategy Pattern)
// @RESPONSIBILITY: Delegates payment processing to selected strategy
// @PATTERN: Dependency Injection (strategy passed in constructor)
class PaymentProcessor {
  constructor(strategy) {
    if (!(strategy instanceof PaymentStrategy)) {
      throw new Error('PaymentProcessor requires a valid PaymentStrategy');
    }
    this.strategy = strategy;
  }

  /**
   * @TASK setStrategy - Change payment strategy at runtime
   * @INPUT strategy (PaymentStrategy instance)
   * @OUTPUT void
   * 
   * @AI_CONTEXT Runtime Strategy Selection:
   * Allows changing payment method after processor instantiation
   * (e.g., user changes selection from Credit Card to Bank Transfer)
   */
  setStrategy(strategy) {
    if (!(strategy instanceof PaymentStrategy)) {
      throw new Error('Invalid PaymentStrategy');
    }
    this.strategy = strategy;
  }

  /**
   * @TASK validate - Validate order using current strategy
   * @INPUT orderData
   * @OUTPUT { valid: boolean, errors: array }
   */
  validate(orderData) {
    return this.strategy.validate(orderData);
  }

  /**
   * @TASK process - Process payment using current strategy
   * @INPUT orderData
   * @OUTPUT { success: boolean, transactionId: string, message: string, details: object }
   */
  process(orderData) {
    // @VALIDATION Pre-process validation
    const validation = this.validate(orderData);
    if (!validation.valid) {
      return {
        success: false,
        transactionId: null,
        message: 'Validación fallida',
        errors: validation.errors
      };
    }

    // @AI_CONTEXT Delegation Pattern: Processor delegates to strategy
    return this.strategy.process(orderData);
  }

  /**
   * @TASK calculateTotal - Calculate final amount with fees/discounts
   * @INPUT amount number
   * @OUTPUT number
   */
  calculateTotal(amount) {
    return this.strategy.calculateFees(amount);
  }

  /**
   * @TASK getMethodName - Get current payment method name
   * @OUTPUT string
   */
  getMethodName() {
    return this.strategy.getName();
  }
}

// @EXAMPLE Factory Function - Create strategy from string identifier
// @PATTERN: Factory Pattern (creates concrete strategies based on identifier)
// @USE_CASE: Convert Checkout.jsx paymentMethod state to PaymentStrategy instance
function createPaymentStrategy(methodName) {
  const strategies = {
    'Tarjeta de Crédito': CreditCardPayment,
    'Tarjeta de Débito': DebitCardPayment,
    'Transferencia Bancaria': BankTransferPayment,
    'Efectivo': CashPayment,
    'MercadoPago': MercadoPagoPayment
  };

  const StrategyClass = strategies[methodName];
  if (!StrategyClass) {
    throw new Error(`Unknown payment method: ${methodName}`);
  }

  return new StrategyClass();
}

// @EXPORT Strategy classes and utility functions
export {
  PaymentStrategy,
  CreditCardPayment,
  DebitCardPayment,
  BankTransferPayment,
  CashPayment,
  MercadoPagoPayment,
  PaymentProcessor,
  createPaymentStrategy
};

// @ACADEMIC_NOTE Integration Example:
// ```javascript
// // In Checkout.jsx (Step 4: ConfirmationStep)
// import { PaymentProcessor, createPaymentStrategy } from '../strategies/PaymentStrategy';
// 
// const handleFinalizePurchase = async () => {
//   try {
//     // Create strategy from user's selection
//     const strategy = createPaymentStrategy(paymentMethod);
//     const processor = new PaymentProcessor(strategy);
//     
//     // Prepare order data
//     const orderData = {
//       total: cartTotal(),
//       items: cartItems,
//       shippingData
//     };
//     
//     // Process payment
//     const result = processor.process(orderData);
//     
//     if (result.success) {
//       // Create order in backend with transactionId
//       const orden = await orderService.create({
//         ...orderData,
//         transactionId: result.transactionId,
//         metodoPago: processor.getMethodName(),
//         montoFinal: result.details.finalAmount
//       });
//       
//       clearCart();
//       navigate(`/orden-confirmada/${orden.id}`);
//     } else {
//       setError(result.errors.join(', '));
//     }
//   } catch (err) {
//     console.error('Payment processing error:', err);
//     setError('Error al procesar el pago');
//   }
// };
// ```
