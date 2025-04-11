import { EnsureMethodsReturnPromise } from '@octostar/platform-api';
import { Desktop, Ontology } from '@octostar/platform-types';

export const safeStringify = (obj: unknown) => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return `${obj}: ${error}`;
  }
};

export const createEvaluator = (
  DesktopAPI: EnsureMethodsReturnPromise<Desktop> | undefined,
  OntologyAPI: EnsureMethodsReturnPromise<Ontology> | undefined
) => {
  return async function (code: string) {
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      const message = args.map((arg) => safeStringify(arg)).join(' ');
      if (!message.includes('PostRobot:')) {
        originalConsoleLog(...args);
      }
    };

    const context = {
      DesktopAPI,
      OntologyAPI,
      console: {
        ...console,
        log: (...args: string[]) => {
          const message = args.map((arg) => safeStringify(arg)).join(' ');
          if (!message.includes('PostRobot:')) {
            originalConsoleLog(...args);
          }
        },
      },
    };

    try {
      // Wrap the code in an async function if it contains await
      if (code.includes('await')) {
        const asyncFunction = new Function(
          'return (async function() { return ' + code + ' }).call(this)'
        );
        return asyncFunction.call(context);
      } else {
        return function () {
          return eval(code);
        }.call(context);
      }
    } finally {
      console.log = originalConsoleLog;
    }
  };
};
