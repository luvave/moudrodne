#!/usr/bin/env node

import path from 'path';
import orval from 'orval';

async function start() {
  try {
    console.log('Generating react queries');
    await orval.generate({
      output: {
        client: 'react-query',
        schemas: path.resolve('src/types/generated'),
        mode: 'tags',
        target: path.resolve('src/api/generated/reactQueries'),
        override: {
          mutator: {
            path: path.resolve('src/utils/axiosInstance.ts'),
            name: 'axiosInstance',
          },
          header: ({ title, description, version }) => [
            `Generated by orval 🍺`,
            `Do not edit manually.`,
            ...(title ? [title] : []),
            ...(description ? [description] : []),
            ...(version ? [`OpenAPI spec version: ${version}`] : []),
          ],
          useDates: true,
          query: {
            useQuery: true,
            useMutation: true,
            useInfinite: false,
            signal: true,
          },
        },
        prettier: true,
      },
      input: {
        target: path.resolve('../../apps/backend/src/swagger_output.json'),
      },
    });

    console.log('\n');
    console.log('🎉 TS types, api functions and react queries generated successfully. You may rock!!!');
  } catch (error) {
    console.log('Generation has failed', error);
  }
}

start();
