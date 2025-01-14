import { operations } from 'api-spec/dist/openapi';

export type ResponseSchema<O extends keyof operations, S extends keyof operations[O]['responses']> = 
  operations[O]['responses'][S] extends { content: { 'application/json': any } }
    ? operations[O]['responses'][S]['content']['application/json'] 
    : never;

export type RequestSchema<O extends keyof operations> = 
  operations[O]['requestBody'] extends { content: { 'application/json': any } }
    ? operations[O]['requestBody']['content']['application/json']
    : never;