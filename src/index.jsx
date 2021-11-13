import React from 'react';
import { render } from 'react-dom';

import { Provider as RollBarProvider, ErrorBoundary, LEVEL_WARN } from '@rollbar/react';
import InitializedApp from './init.jsx';
import { rollbarConfig } from './rollbar';

render(
  <RollBarProvider config={rollbarConfig}>
    <ErrorBoundary level={LEVEL_WARN}>
      <InitializedApp />
    </ErrorBoundary>
  </RollBarProvider>,
  document.getElementById('chat'),
);
