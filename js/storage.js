/* ============================================================
   Kweha — Armazenamento seguro
   Garante que o jogo continua a funcionar mesmo quando o
   navegador bloqueia o localStorage.
   ============================================================ */

(function () {
  'use strict';

  let storage = null;

  try {
    const key = '__kweha_storage_test__';
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    storage = window.localStorage;
  } catch (error) {
    storage = null;
  }

  if (storage) return;

  const data = new Map();

  function loadFromWindowName() {
    try {
      const raw = window.name;
      if (!raw || raw.charAt(0) !== '{') return;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.__kwehaStorage) return;
      Object.keys(parsed.data || {}).forEach(function (key) {
        data.set(key, String(parsed.data[key]));
      });
    } catch (error) {
      /* dados inválidos: começar vazio */
    }
  }

  function persist() {
    try {
      const snapshot = {};
      data.forEach(function (value, key) {
        snapshot[key] = value;
      });
      window.name = JSON.stringify({ __kwehaStorage: true, data: snapshot });
    } catch (error) {
      /* sem persistência entre páginas */
    }
  }

  loadFromWindowName();

  const fallback = {
    get length() {
      return data.size;
    },
    key: function (index) {
      const keys = Array.from(data.keys());
      return index >= 0 && index < keys.length ? keys[index] : null;
    },
    getItem: function (key) {
      const normalized = String(key);
      return data.has(normalized) ? data.get(normalized) : null;
    },
    setItem: function (key, value) {
      data.set(String(key), String(value));
      persist();
    },
    removeItem: function (key) {
      data.delete(String(key));
      persist();
    },
    clear: function () {
      data.clear();
      persist();
    }
  };

  try {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: function () {
        return fallback;
      }
    });
  } catch (error) {
    /* manter o localStorage nativo, se possível */
  }
})();
