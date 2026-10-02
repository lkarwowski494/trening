const K = k => 'kv:' + k;
export async function openDatabaseAsync() { return {
  execAsync: async () => {},
  getFirstAsync: async (_q, k) => { const v = localStorage.getItem(K(k)); return v == null ? null : { v }; },
  runAsync: async (_q, k, v) => { localStorage.setItem(K(k), v); },
}; }
