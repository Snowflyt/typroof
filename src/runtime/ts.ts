import type { Node, Symbol } from 'ts-morph';
import { ts } from 'ts-morph';

export const isCallOfSymbol = (s: Symbol) => (call: Node) => {
  if (!call.isKind(ts.SyntaxKind.CallExpression)) return false;
  const expression = call.getExpression();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!expression) return false;
  const symbol = expression.getSymbol();
  if (!symbol) return false;
  return symbol.getAliasedSymbol() === s;
};
export const isCallOfSymbols = (ss: readonly Symbol[]) => (call: Node) => {
  if (!call.isKind(ts.SyntaxKind.CallExpression)) return false;
  const expression = call.getExpression();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!expression) return false;
  const symbol = expression.getSymbol();
  if (!symbol) return false;
  const aliasedSymbol = symbol.getAliasedSymbol();
  if (!aliasedSymbol) return false;
  return ss.includes(aliasedSymbol);
};
