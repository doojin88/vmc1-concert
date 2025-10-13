# AI Coding Agent Guidelines

## TypeScript & Type Safety

### Supabase Query Type Handling
- Cast Supabase query results through `unknown` first when type mismatch occurs: `data as unknown as TargetType`
- Never assume Supabase select query return types are correctly inferred
- Always validate data existence before type casting: `if (error || !data) return`
- Use explicit type definitions for joined relations in Supabase queries

### Generic Type Constraints
- Use `any` type for flexible query builder functions instead of complex generic constraints
- Avoid overly strict generic type parameters that cannot be satisfied
- Prefer runtime type validation over compile-time constraints for dynamic data

### Optional vs Required Properties
- Ensure schema definitions match component prop requirements
- Remove unused fields from response schemas to prevent type conflicts
- Use `z.infer<typeof Schema>` for component props to maintain type consistency

## ESLint Rules

### Variable Declarations
- Use `const` for variables that are never reassigned
- Avoid `let` declarations for variables assigned only once

## Supabase API Usage

### Raw SQL Operations
- Never use `client.raw()` - it does not exist in Supabase client
- Fetch current value and perform arithmetic operations in application layer
- Use `select().single()` to get current value before updating counters
- Implement counter updates as: fetch → calculate → update

### Query Builder Patterns
- Always handle both `error` and `!data` cases after Supabase queries
- Use `.maybeSingle()` when record might not exist
- Use `.single()` when expecting exactly one record

## Component Architecture

### Schema-Driven Development
- Define response schemas first in backend
- Reuse backend schemas for frontend component props via `z.infer`
- Export schemas from backend and re-export in lib/dto.ts

### Missing UI Components
- Check for required shadcn-ui components before build
- Install missing components: `npx shadcn@latest add [component-name]`
- Common missing components: skeleton, alert, alert-dialog

## Build & Validation Workflow

### Pre-Build Checklist
1. Run `npm run lint` to catch ESLint errors early
2. Fix type errors before attempting build
3. Install missing dependencies/components before build

### Type Error Resolution
- Address Supabase type inference issues with explicit casting
- Fix optional/required property mismatches in schemas
- Verify all imported types exist and are correctly exported

## Best Practices

### Error Prevention
- Always use `const` by default, only use `let` when necessary
- Type cast through `unknown` for complex Supabase responses
- Validate data existence before accessing properties
- Keep response schemas minimal - include only used fields
- Test imports after creating new schemas/types
