import compiler from './compiler.js';

test('Imports jss and return manageable stylesheet', async () => {
  const stats = await compiler('example.css.js');
  expect(stats.compilation.errors.length).toBe(0);
  const sources = stats.toJson().modules.filter(m => !m.id.startsWith('../node_modules/')).
    map(m => m.source );

  expect(sources.length).toEqual(3);

  expect(sources[0]).toBe(`export default (jss, SheetsManager, original, key) => {
  let manager, sheet;
  function lazyLoad() {
    if (manager) return;
    manager = new SheetsManager();
    sheet = jss.createStyleSheet(original);
    manager.add(key, sheet);
  }
  return {
    rules: original,
    manage: () => { lazyLoad(); return manager.manage(key); },
    unmanage: () => manager.unmanage(key)
  };
};
`);
  expect(sources[1]).toBe(`export default {
  myCssClass: { zIndex: 10 }
};
`);
  expect(sources[2]).toMatch(/import jss, { SheetsManager } from 'jss';\n/);
  expect(sources[2]).toMatch(/import original from '.*index\.js\?.*test\/example\.css\.js';\n/);
  expect(sources[2]).toMatch(/import helper from '\.\.\/helper\.js';\n/);
  expect(sources[2]).
    toMatch(/const key = {}, wrapper = helper\(jss, SheetsManager, original, key\);\n/);
  expect(sources[2]).toMatch(/export default wrapper;/);
});

test('Allow some jss-setup', async () => {
  const stats = await compiler('example.css.js', { jssModule: './jss-setup.js' });
  expect(stats.compilation.errors.length).toBe(0);
  const sources = stats.toJson().modules.
    map(m => m.source );

  expect(sources.length).toEqual(4);

  expect(sources[0]).toBe(`export default (jss, SheetsManager, original, key) => {
  let manager, sheet;
  function lazyLoad() {
    if (manager) return;
    manager = new SheetsManager();
    sheet = jss.createStyleSheet(original);
    manager.add(key, sheet);
  }
  return {
    rules: original,
    manage: () => { lazyLoad(); return manager.manage(key); },
    unmanage: () => manager.unmanage(key)
  };
};
`);

  expect(sources[1]).toBe(`export default {
  myCssClass: { zIndex: 10 }
};
`);
  expect(sources[2]).toMatch(/import jss, { SheetsManager } from '\.\/jss-setup\.js';\n/);
  expect(sources[2]).toMatch(/import original from '.*index\.js\?.*test\/example\.css\.js';\n/);
  expect(sources[2]).toMatch(/import helper from '\.\.\/helper\.js';\n/);
  expect(sources[2]).
    toMatch(/const key = {}, wrapper = helper\(jss, SheetsManager, original, key\);\n/);
  expect(sources[2]).toMatch(/export default wrapper;/);

  expect(sources[3]).toBe('export default { myCustomJssSetup: true };\n');
});

