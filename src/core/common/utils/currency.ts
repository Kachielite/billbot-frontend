const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: '₦',
  KES: 'KSh',
  GHS: 'GH₵',
  ZAR: 'R',
};

export function formatAmount(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}M`;
  }
  return `${sign}${abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCurrency(amount: number | string, currency = 'NGN'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${symbol}${formatAmount(num)}`;
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]/g, ''));
}
