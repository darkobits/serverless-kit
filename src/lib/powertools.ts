import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import env from '@darkobits/env';


const defaultValues = {
  region: env('AWS_REGION'),
  executionEnv: env('AWS_EXECUTION_ENV'),
  version: env('GIT_VERSION', true)
};


export const logger = new Logger({
  persistentLogAttributes: defaultValues
});


export const metrics = new Metrics({
  defaultDimensions: defaultValues
});


export const tracer = new Tracer();
