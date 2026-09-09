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

// Spec discovery and the coverage denominator are both driven by the `include` option of the
// karma target in angular.json (`**/*.spec.ts` plus `lib/**/*.ts`). The Angular 15 Karma builder
// disables webpack's `require.context`, so every source file is added as an entry point instead of
// being required from here; files without a spec still count towards coverage (CNPY-1402).
