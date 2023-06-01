import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { describe, it, expect, vi } from 'vitest';


import { logger, metrics, tracer } from './powertools';


vi.mock('@darkobits/env', () => ({
  default: vi.fn()
}));


describe('logger', () => {
  it('should be an instance of Logger', () => {
    expect(logger).toBeInstanceOf(Logger);
  });
});


describe('metrics', () => {
  it('should be an instance of Metrics', () => {
    expect(metrics).toBeInstanceOf(Metrics);
  });
});


describe('tracer', () => {
  it('should be an instance of Tracer', () => {
    expect(tracer).toBeInstanceOf(Tracer);
  });
});
