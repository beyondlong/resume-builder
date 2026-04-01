const Module = require('module');
const path = require('path');

const originalLoad = Module._load;
const cliRecipesModulePath = require.resolve('gatsby-cli/lib/recipes');
const cliCreateCliModulePath = require.resolve('gatsby-cli/lib/create-cli');
const shouldStubRecipes = (request, parent) =>
  request === 'gatsby-recipes' &&
  parent &&
  (parent.filename === cliRecipesModulePath ||
    parent.filename === cliCreateCliModulePath);

Module._load = function patchedLoad(request, parent, isMain) {
  if (shouldStubRecipes(request, parent)) {
    return {
      startGraphQLServer: async () => ({ port: null }),
      recipesHandler: async () => {
        throw new Error(
          'gatsby-recipes is disabled in local develop mode for this project.'
        );
      },
    };
  }

  return originalLoad.call(this, request, parent, isMain);
};

process.argv = [
  process.execPath,
  path.join(process.cwd(), 'node_modules/gatsby-cli/lib/index.js'),
  ...process.argv.slice(2),
];

require('gatsby-cli/lib/index.js');
