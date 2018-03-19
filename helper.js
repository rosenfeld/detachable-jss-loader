export default (jss, SheetsManager, original, key) => {
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
