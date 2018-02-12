jest.mock('fs');

const fs = require('fs');
const Service = require('../lib/Service');

const mockPkg = (json) => {
  fs.writeFileSync('/package.json', JSON.stringify(json, null, 2));
};

const createMockService = (plugins = []) => new Service('/', {
  plugins,
  useBuiltIn: false,
});

beforeEach(() => {
  mockPkg({});
});

test('load project options from .webpackrc.js', () => {
  fs.writeFileSync('/.webpackrc.js', `module.exports=${JSON.stringify({ dll: false })}`);
  const service = createMockService();
  // .webpackrc.js has higher priority
  expect(service.projectOptions.dll).toBe(false);
  fs.unlinkSync('/.webpackrc.js');
});
