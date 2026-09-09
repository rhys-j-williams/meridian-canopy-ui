// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    <T>(id: string): T;
    keys(): string[];
  };
};

// Load every source file, not just the ones a spec happens to import. The package is
// sideEffects: false so a plain barrel import gets shaken out, and files without a spec would
// silently drop out of the coverage denominator (CNPY-1402). Spec discovery itself is done by the
// Angular 15 Karma builder.
const sources = require.context('./lib', true, /^(?!.*\.spec\.ts$).*\.ts$/);
sources.keys().forEach(sources);
