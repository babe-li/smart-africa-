export function formatTzs(amount: number): string {
  return 'TSh ' + Math.round(amount).toLocaleString('en-TZ');
}

export function formatShortTzs(amount: number): string {
  if (amount >= 1000000) {
    return `TSh ${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 1000) {
    return `TSh ${(amount / 1000).toFixed(0)}K`;
  }
  return `TSh ${amount}`;
}
