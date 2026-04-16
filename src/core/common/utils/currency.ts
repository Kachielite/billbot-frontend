const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: '₦',
  KES: 'KSh',
  GHS: 'GH₵',
  ZAR: 'R',
};

export function formatCurrency(amount: number | string, currency = 'NGN'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${symbol}${num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]/g, ''));
}
