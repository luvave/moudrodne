import { prettierConfig } from '@moudrodne/prettier-config';

/**
 *
 * Have to define prettier in the root directory to force whole repository to have consistent code style
 * @type {import("prettier").Config}
 */
const config = {
  ...prettierConfig,
};

export default config;
