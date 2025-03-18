import * as ts from 'typescript';

/**
 * Gets exported symbols from a module.
 *
 * @param options.program The TypeScript Program.
 * @param options.typeChecker The TypeScript TypeChecker.
 * @param options.modulePath Path to the module file.
 * @param options.symbolNames Names of symbols to retrieve.
 * @returns Object mapping requested symbol names to their TS symbols.
 */
export function getExportedSymbols<SymbolName extends string>({
  modulePath,
  program,
  symbolNames,
  typeChecker,
}: {
  program: ts.Program;
  typeChecker: ts.TypeChecker;
  modulePath: string;
  symbolNames: readonly SymbolName[];
}): Record<SymbolName, ts.Symbol> {
  // Get or create the source file for this module
  let sourceFile = program.getSourceFile(modulePath);
  if (!sourceFile) {
    // If the file isn't already in the program, create it
    const fileContent = ts.sys.readFile(modulePath);
    if (!fileContent) {
      throw new Error(`Could not read file: ${modulePath}`);
    }
    sourceFile = ts.createSourceFile(
      modulePath,
      fileContent,
      program.getCompilerOptions().target || ts.ScriptTarget.Latest,
      true,
    );
  }

  // Find the exported symbols
  const moduleSymbol = typeChecker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) throw new Error(`Cannot find module symbol for "${modulePath}"`);

  const exports = typeChecker.getExportsOfModule(moduleSymbol);

  // Create result object
  const result: Record<string, ts.Symbol> = {};

  for (const name of symbolNames) {
    const symbol = exports.find((s) => s.name === name);
    if (!symbol) throw new Error(`Cannot find exported symbol \`${name}\` in "${modulePath}"`);
    result[name] = symbol;
  }

  return result;
}

/**
 * Check if a node is an invocation of a specific symbol.
 * @param typeChecker The TypeScript type checker.
 * @param node The node to check.
 * @param targetSymbol The target symbol or symbols to check against.
 * @returns
 */
export const isInvocationOf = (
  typeChecker: ts.TypeChecker,
  node: ts.Node,
  targetSymbol: ts.Symbol | readonly ts.Symbol[],
) => {
  if (!ts.isCallExpression(node)) return false;

  const symbol = typeChecker.getSymbolAtLocation(node.expression);
  if (!symbol) return false;

  const aliasedSymbol =
    symbol.flags & ts.SymbolFlags.Alias ? typeChecker.getAliasedSymbol(symbol) : symbol;

  return Array.isArray(targetSymbol) ?
      targetSymbol.includes(aliasedSymbol)
    : aliasedSymbol === targetSymbol;
};

/**
 * Finds all ancestors of a node up to the source file.
 * @param node The node to start from.
 * @returns
 */
export const getAncestors = (node: ts.Node): ts.Node[] => {
  const ancestors: ts.Node[] = [];
  let current: any = node.parent;
  while (current) {
    ancestors.push(current);
    current = current.parent;
  }
  return ancestors;
};

/**
 * Find all nodes in a source file that match a given predicate.
 * @param node The node to start from.
 * @param predicate The predicate function to test each node.
 * @returns
 */
export const findNodes = <T extends ts.Node>(
  node: ts.Node,
  predicate: (node: ts.Node) => node is T,
): T[] => {
  const results: T[] = [];

  const visit = (node: ts.Node) => {
    if (predicate(node)) results.push(node);
    ts.forEachChild(node, visit);
  };

  visit(node);
  return results;
};
