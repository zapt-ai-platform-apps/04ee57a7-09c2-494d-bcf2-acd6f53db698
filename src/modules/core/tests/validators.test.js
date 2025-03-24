import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { createValidator } from '../validators';
import * as Sentry from '@sentry/browser';

// Mock Sentry
vi.mock('@sentry/browser', () => ({
  captureException: vi.fn()
}));

// Mock console.error
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

// Restore console.error after tests
afterEach(() => {
  console.error = originalConsoleError;
});

describe('createValidator', () => {
  it('validates correct data successfully', () => {
    const schema = z.object({
      id: z.number(),
      name: z.string()
    });
    
    const validate = createValidator(schema, 'TestObject');
    
    const validData = { id: 1, name: 'Test' };
    expect(validate(validData)).toEqual(validData);
  });
  
  it('throws and logs error for invalid data', () => {
    const schema = z.object({
      id: z.number(),
      name: z.string()
    });
    
    const validate = createValidator(schema, 'TestObject');
    
    const invalidData = { id: 'invalid', name: 123 };
    
    expect(() => validate(invalidData, {
      actionName: 'testAction',
      location: 'test.js',
      direction: 'incoming',
      moduleFrom: 'source',
      moduleTo: 'target'
    })).toThrow();
    
    expect(console.error).toHaveBeenCalled();
    expect(Sentry.captureException).toHaveBeenCalled();
  });
  
  it('includes validation context in error reporting', () => {
    const schema = z.object({
      id: z.number(),
      name: z.string()
    });
    
    const validate = createValidator(schema, 'TestObject');
    
    const options = {
      actionName: 'testAction',
      location: 'test.js',
      direction: 'incoming',
      moduleFrom: 'source',
      moduleTo: 'target'
    };
    
    try {
      validate({ id: 'invalid' }, options);
    } catch (error) {
      expect(error.message).toContain('testAction');
      expect(error.message).toContain('source → target');
      expect(error.message).toContain('TestObject');
    }
    
    const sentryCall = Sentry.captureException.mock.calls[0];
    expect(sentryCall[1].tags.validationType).toBe('TestObject');
    expect(sentryCall[1].tags.validationAction).toBe('testAction');
    expect(sentryCall[1].tags.moduleFlow).toBe('source-to-target');
  });
});