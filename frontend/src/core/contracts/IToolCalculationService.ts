/**
 * Core Calculation Service Interface (Hexagonal Port)
 * 
 * Any calculation tool must implement this contract.
 * In Phase 1: LocalClientAdapter executes calculations in-memory.
 * In Phase 2: ApiHttpClientAdapter proxies calls to C# ASP.NET Web API.
 */
export interface IToolCalculationService<TInput, TOutput> {
  calculate(input: TInput): TOutput;
  validate(input: TInput): Record<string, string> | null;
}
