import { defineComponent, inject, ref, watchEffect, createTextVNode, h, toRef, computed, Transition, Fragment, provide, Comment, unref, shallowRef, isVNode, mergeProps, hasInjectionContext, getCurrentInstance, TransitionGroup, nextTick, version, defineAsyncComponent, shallowReactive, watch, Suspense, markRaw, cloneVNode, withDirectives, vShow, normalizeClass, useSSRContext, createApp, reactive, onErrorCaptured, onServerPrefetch, createVNode, resolveDynamicComponent, effectScope, isReadonly, isRef, isShallow, isReactive, toRaw, getCurrentScope, withCtx } from 'vue';
import { f as createError$1, l as hasProtocol, m as isScriptProtocol, o as joinURL, w as withQuery, s as sanitizeStatusCode, p as getContext, $ as $fetch, q as createHooks, t as toRouteMatcher, v as createRouter$1, x as defu } from '../_/nitro.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { createPinia, setActivePinia, shouldHydrate } from 'pinia';
import { getActiveHead, CapoPlugin } from 'unhead';
import { defineHeadPlugin } from '@unhead/shared';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { useSsrAdapter, setup } from '@css-render/vue3-ssr';
import Prism from 'prismjs';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderAttrs } from 'vue/server-renderer';
import { scaleColor, depx, getPadding, changeColor, rgba, composite, getPreciseEventTarget, getMargin, createId } from 'seemly';
import { upperFirst, merge } from 'lodash-es';
import { plugin as plugin$3 } from '@css-render/plugin-bem';
import { CssRender, hash, exists } from 'css-render';
import { useIsMounted, useIsIos, useMemo, useClicked, useClickPosition } from 'vooks';
import { clickoutside, zindexable } from 'vdirs';
import { VResizeObserver, VFocusTrap, VLazyTeleport } from 'vueuc';
import { on, off } from 'evtd';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
const appLayoutTransition = false;
const appPageTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "value": null, "errorValue": null, "deep": true };
const fetchDefaults = {};
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  var _a;
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: undefined,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.15.4";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...((_a = options.ssrContext) == null ? undefined : _a.payload) || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b, _c, _d;
  const resolvedPlugins = [];
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    var _a2;
    const unresolvedPluginsForThisPlugin = ((_a2 = plugin2.dependsOn) == null ? undefined : _a2.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.includes(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.push(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin2.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? undefined : _a.islandContext) && ((_b = plugin2.env) == null ? undefined : _b.islands) === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (((_c = nuxtApp.ssrContext) == null ? undefined : _c.islandContext) && ((_d = plugin2.env) == null ? undefined : _d.islands) === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup2, args) {
  const fn = () => setup2();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? undefined : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? undefined : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = (options == null ? undefined : options.external) || isExternalHost;
  if (isExternal) {
    if (!(options == null ? undefined : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? undefined : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : undefined);
        return to;
      }
      return redirect(!inMiddleware ? undefined : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? undefined : options.replace) {
      (undefined).replace(toPath);
    } else {
      (undefined).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? undefined : options.replace) ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value = error2.value || nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
version[0] === "3";
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2) {
  if (ref2 instanceof Promise || ref2 instanceof Date || ref2 instanceof RegExp)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r));
  if (typeof root === "object") {
    const resolved = {};
    for (const k in root) {
      if (!Object.prototype.hasOwnProperty.call(root, k)) {
        continue;
      }
      if (k === "titleTemplate" || k[0] === "o" && k[1] === "n") {
        resolved[k] = unref(root[k]);
        continue;
      }
      resolved[k] = resolveUnrefHeadInput(root[k]);
    }
    return resolved;
  }
  return root;
}
defineHeadPlugin({
  hooks: {
    "entries:resolve": (ctx) => {
      for (const entry2 of ctx.entries)
        entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
    }
  }
});
const headSymbol = "usehead";
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey$1 = "__unhead_injection_handler__";
function setHeadInjectionHandler(handler) {
  _global[globalKey$1] = handler;
}
function injectHead() {
  if (globalKey$1 in _global) {
    return _global[globalKey$1]();
  }
  const head = inject(headSymbol);
  return head || getActiveHead();
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
[CapoPlugin({ track: true })];
const unhead_KgADcZ0jPj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    setHeadInjectionHandler(
      // need a fresh instance of the nuxt app to avoid parallel requests interfering with each other
      () => useNuxtApp().vueApp._context.provides.usehead
    );
    nuxtApp.vueApp.use(head);
  }
});
function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== undefined) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === undefined) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = undefined;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = undefined;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : undefined;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
_globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}
const ROUTE_KEY_PARENTHESES_RE$1 = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE$1 = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE$1 = /:\w+/g;
const interpolatePath = (route, match) => {
  return match.path.replace(ROUTE_KEY_PARENTHESES_RE$1, "$1").replace(ROUTE_KEY_SYMBOLS_RE$1, "$1").replace(ROUTE_KEY_NORMAL_RE$1, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? undefined : _a.toString()) || "";
  });
};
const generateRouteKey$1 = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a;
    return ((_a = m.components) == null ? undefined : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? undefined : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const __nuxt_page_meta = {
  layout: "default"
  // Garante que o layout padrão será usado
};
function handleHotUpdate(_router, _generateRoutes) {
}
const _routes = [
  {
    name: "index",
    path: "/",
    meta: __nuxt_page_meta || {},
    component: () => import('./index-BYP4SMMt.mjs')
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => {
    var _a;
    return (_a = children.default) == null ? undefined : _a.call(children);
  } };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = (route == null ? undefined : route.meta.key) ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? undefined : _a.toString()) || "";
  });
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => {
      var _a, _b;
      return comp.components && comp.components.default === ((_b = (_a = from.matched[index]) == null ? undefined : _a.components) == null ? undefined : _b.default);
    }
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    var _a;
    const nuxtApp = useNuxtApp();
    const behavior = ((_a = useRouter().options) == null ? undefined : _a.scrollBehaviorType) ?? "auto";
    let position = savedPosition || undefined;
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (!position && from && to && routeAllowsScrollToTop !== false && isChangingPage(to, from)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
      return false;
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await new Promise((resolve2) => setTimeout(resolve2, 0));
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? undefined : _a.validate)) {
    return;
  }
  const nuxtApp = useNuxtApp();
  const router = useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  const unsub = router.beforeResolve((final) => {
    unsub();
    if (final === to) {
      const unsub2 = router.afterEach(async () => {
        unsub2();
        await nuxtApp.runWithContext(() => showError(error));
      });
      return false;
    }
  });
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin$2 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b, _c;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = ((_a = routerOptions.history) == null ? undefined : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (undefined).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (undefined).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    handleHotUpdate(router, routerOptions.routes ? routerOptions.routes : (routes2) => routes2);
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c2, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? undefined : _a2.components) == null ? undefined : _b2.default) === ((_d = (_c2 = from.matched[0]) == null ? undefined : _c2.components) == null ? undefined : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    useError();
    if (!((_b = nuxtApp.ssrContext) == null ? undefined : _b.islandContext)) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if ((failure == null ? undefined : failure.type) === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if ((_c = nuxtApp.ssrContext) == null ? undefined : _c.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? undefined : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? undefined : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          const result = await nuxtApp.runWithContext(() => middleware(to, from));
          {
            if (result === false || result instanceof Error) {
              const error2 = result || createError$1({
                statusCode: 404,
                statusMessage: `Page Not Found: ${initialURL}`
              });
              await nuxtApp.runWithContext(() => showError(error2));
              return false;
            }
          }
          if (result === true) {
            continue;
          }
          if (result || result === false) {
            return result;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach(async (to, _from) => {
      if (to.matched.length === 0) {
        await nuxtApp.runWithContext(() => showError(createError$1({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_eJ33V7gbc6 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    {
      nuxtApp.payload.pinia = toRaw(pinia.state.value);
    }
    return {
      provide: {
        pinia
      }
    };
  }
});
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const unocss_MzCDxu9LMj = /* @__PURE__ */ defineNuxtPlugin(() => {
});
const plugin_nLxjltirRS = /* @__PURE__ */ defineNuxtPlugin((_nuxtApp) => {
  {
    const { collect } = setup(_nuxtApp.vueApp);
    _nuxtApp.hooks.hook("app:rendered", () => {
      if (_nuxtApp.ssrContext) {
        if (typeof _nuxtApp.ssrContext.styles === "string") {
          _nuxtApp.ssrContext.styles += collect();
        } else if (!_nuxtApp.ssrContext.styles) {
          _nuxtApp.ssrContext.styles = collect();
        }
      }
    });
  }
});
const prism_IbSO6xpRLU = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("prism", Prism);
});
const plugins = [
  payloadPlugin,
  unhead_KgADcZ0jPj,
  plugin$2,
  revive_payload_server_eJ33V7gbc6,
  plugin$1,
  components_plugin_KR1HBZs4kY,
  unocss_MzCDxu9LMj,
  plugin_nLxjltirRS,
  prism_IbSO6xpRLU
];
const layouts = {
  default: defineAsyncComponent(() => import('./default-CYAs_Efm.mjs').then((m) => m.default || m))
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const __nuxt_component_0 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    },
    fallback: {
      type: [String, Object],
      default: null
    }
  },
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = ref();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route.meta.layoutTransition ?? appLayoutTransition;
      return _wrapInTransition(hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || undefined,
              name: layout.value,
              shouldProvide: !props.name,
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    return () => {
      var _a, _b;
      if (!name || typeof name === "string" && !(name in layouts)) {
        return (_b = (_a = context.slots).default) == null ? undefined : _b.call(_a);
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const RouteProvider = defineComponent({
  props: {
    vnode: {
      type: Object,
      required: true
    },
    route: {
      type: Object,
      required: true
    },
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const __nuxt_component_1 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: undefined
    },
    keepalive: {
      type: [Boolean, Object],
      default: undefined
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    const forkRoute = inject(PageRouteSymbol, null);
    let previousPageKey;
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    let vnode;
    const done = nuxtApp.deferHydration();
    if (props.pageKey) {
      watch(() => props.pageKey, (next, prev) => {
        if (next !== prev) {
          nuxtApp.callHook("page:loading:start");
        }
      });
    }
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            done();
            return;
          }
          const key = generateRouteKey$1(routeProps, props.pageKey);
          if (!nuxtApp.isHydrating && !hasChildrenRoutes(forkRoute, routeProps.route, routeProps.Component) && previousPageKey === key) {
            nuxtApp.callHook("page:loading:end");
          }
          previousPageKey = key;
          {
            vnode = h(Suspense, {
              suspensible: true
            }, {
              default: () => {
                const providerVNode = h(RouteProvider, {
                  key: key || undefined,
                  vnode: slots.default ? h(Fragment, undefined, slots.default(routeProps)) : routeProps.Component,
                  route: routeProps.route,
                  renderKey: key || undefined,
                  vnodeRef: pageRef
                });
                return providerVNode;
              }
            });
            return vnode;
          }
        }
      });
    };
  }
});
function hasChildrenRoutes(fork, newRoute, Component) {
  if (!fork) {
    return false;
  }
  const index = newRoute.matched.findIndex((m) => {
    var _a;
    return ((_a = m.components) == null ? undefined : _a.default) === (Component == null ? undefined : Component.type);
  });
  return index < newRoute.matched.length - 1;
}
const namespace = "n";
const prefix = `.${namespace}-`;
const elementPrefix = "__";
const modifierPrefix = "--";
const cssr = CssRender();
const plugin = plugin$3({
  blockPrefix: prefix,
  elementPrefix,
  modifierPrefix
});
cssr.use(plugin);
const {
  c,
  find
} = cssr;
const {
  cB,
  cE,
  cM,
  cNotM
} = plugin;
function insideModal(style2) {
  return c(({
    props: {
      bPrefix
    }
  }) => `${bPrefix || prefix}modal, ${bPrefix || prefix}drawer`, [style2]);
}
function insidePopover(style2) {
  return c(({
    props: {
      bPrefix
    }
  }) => `${bPrefix || prefix}popover`, [style2]);
}
function asModal(style2) {
  return c(({
    props: {
      bPrefix
    }
  }) => `&${bPrefix || prefix}modal`, style2);
}
const cCB = (...args) => {
  return c(">", [cB(...args)]);
};
function createKey(prefix2, suffix) {
  return prefix2 + (suffix === "default" ? "" : suffix.replace(/^[a-z]/, (startChar) => startChar.toUpperCase()));
}
function createInjectionKey(key) {
  return key;
}
const drawerBodyInjectionKey = createInjectionKey("n-drawer-body");
const modalBodyInjectionKey = createInjectionKey("n-modal-body");
const modalProviderInjectionKey = createInjectionKey("n-modal-provider");
const modalInjectionKey = createInjectionKey("n-modal");
const popoverBodyInjectionKey = createInjectionKey("n-popover-body");
const isComposingRef = ref(false);
function useIsComposing() {
  return isComposingRef;
}
ref("0px");
function useLockHtmlScroll(lockRef) {
  return;
}
function color2Class(color) {
  return color.replace(/#|\(|\)|,|\s|\./g, "_");
}
function rtlInset(inset) {
  const {
    left,
    right,
    top,
    bottom
  } = getPadding(inset);
  return `${top} ${left} ${bottom} ${right}`;
}
const eventSet = /* @__PURE__ */ new WeakSet();
function markEventEffectPerformed(event) {
  eventSet.add(event);
}
function eventEffectNotPerformed(event) {
  return !eventSet.has(event);
}
const warnedMessages = /* @__PURE__ */ new Set();
function warnOnce(location, message) {
  const mergedMessage = `[naive/${location}]: ${message}`;
  if (warnedMessages.has(mergedMessage)) return;
  warnedMessages.add(mergedMessage);
  console.error(mergedMessage);
}
function warn(location, message) {
  console.error(`[naive/${location}]: ${message}`);
}
function throwError(location, message) {
  throw new Error(`[naive/${location}]: ${message}`);
}
function call(funcs, ...args) {
  if (Array.isArray(funcs)) {
    funcs.forEach((func) => call(func, ...args));
  } else {
    return funcs(...args);
  }
}
function flatten(vNodes, filterCommentNode = true, result = []) {
  vNodes.forEach((vNode) => {
    if (vNode === null) return;
    if (typeof vNode !== "object") {
      if (typeof vNode === "string" || typeof vNode === "number") {
        result.push(createTextVNode(String(vNode)));
      }
      return;
    }
    if (Array.isArray(vNode)) {
      flatten(vNode, filterCommentNode, result);
      return;
    }
    if (vNode.type === Fragment) {
      if (vNode.children === null) return;
      if (Array.isArray(vNode.children)) {
        flatten(vNode.children, filterCommentNode, result);
      }
    } else {
      if (vNode.type === Comment && filterCommentNode) return;
      result.push(vNode);
    }
  });
  return result;
}
function getFirstSlotVNode(slots, slotName = "default", props = undefined) {
  const slot = slots[slotName];
  if (!slot) {
    warn("getFirstSlotVNode", `slot[${slotName}] is empty`);
    return null;
  }
  const slotContent = flatten(slot(props));
  if (slotContent.length === 1) {
    return slotContent[0];
  } else {
    warn("getFirstSlotVNode", `slot[${slotName}] should have exactly one child`);
    return null;
  }
}
function getFirstSlotVNodeWithTypedProps(slotName, slot, props) {
  if (!slot) {
    return null;
  }
  const slotContent = flatten(slot(props));
  if (slotContent.length === 1) {
    return slotContent[0];
  } else {
    warn("getFirstSlotVNode", `slot[${slotName}] should have exactly one child`);
    return null;
  }
}
function keep(object, keys = [], rest) {
  const keepedObject = {};
  keys.forEach((key) => {
    keepedObject[key] = object[key];
  });
  return Object.assign(keepedObject, rest);
}
function keysOf(obj) {
  return Object.keys(obj);
}
function omit(object, keys = [], rest) {
  const omitedObject = {};
  const originalKeys = Object.getOwnPropertyNames(object);
  originalKeys.forEach((originalKey) => {
    if (!keys.includes(originalKey)) {
      omitedObject[originalKey] = object[originalKey];
    }
  });
  return Object.assign(omitedObject, rest);
}
function render(r, ...args) {
  if (typeof r === "function") {
    return r(...args);
  } else if (typeof r === "string") {
    return createTextVNode(r);
  } else if (typeof r === "number") {
    return createTextVNode(String(r));
  } else {
    return null;
  }
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child)) {
      return true;
    }
    if (child.type === Comment) {
      return false;
    }
    if (child.type === Fragment && !ensureValidVNode(child.children)) {
      return false;
    }
    return true;
  }) ? vnodes : null;
}
function resolveSlot(slot, fallback) {
  return slot && ensureValidVNode(slot()) || fallback();
}
function resolveSlotWithTypedProps(slot, props, fallback) {
  return slot && ensureValidVNode(slot(props)) || fallback(props);
}
function resolveWrappedSlot(slot, wrapper) {
  const children = slot && ensureValidVNode(slot());
  return wrapper(children || null);
}
function isSlotEmpty(slot) {
  return !(slot && ensureValidVNode(slot()));
}
const Wrapper = defineComponent({
  render() {
    var _a, _b;
    return (_b = (_a = this.$slots).default) === null || _b === undefined ? undefined : _b.call(_a);
  }
});
const configProviderInjectionKey = createInjectionKey("n-config-provider");
const defaultClsPrefix = "n";
function useConfig(props = {}, options = {
  defaultBordered: true
}) {
  const NConfigProvider = inject(configProviderInjectionKey, null);
  return {
    // NConfigProvider,
    inlineThemeDisabled: NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.inlineThemeDisabled,
    mergedRtlRef: NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedRtlRef,
    mergedComponentPropsRef: NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedComponentPropsRef,
    mergedBreakpointsRef: NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedBreakpointsRef,
    mergedBorderedRef: computed(() => {
      var _a, _b;
      const {
        bordered
      } = props;
      if (bordered !== undefined) return bordered;
      return (_b = (_a = NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedBorderedRef.value) !== null && _a !== undefined ? _a : options.defaultBordered) !== null && _b !== undefined ? _b : true;
    }),
    mergedClsPrefixRef: NConfigProvider ? NConfigProvider.mergedClsPrefixRef : shallowRef(defaultClsPrefix),
    namespaceRef: computed(() => NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedNamespaceRef.value)
  };
}
function useThemeClass(componentName, hashRef, cssVarsRef, props) {
  if (!cssVarsRef) throwError("useThemeClass", "cssVarsRef is not passed");
  const NConfigProvider = inject(configProviderInjectionKey, null);
  const mergedThemeHashRef = NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedThemeHashRef;
  const styleMountTarget = NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.styleMountTarget;
  const themeClassRef = ref("");
  const ssrAdapter = useSsrAdapter();
  let renderCallback;
  const hashClassPrefix = `__${componentName}`;
  const mountStyle = () => {
    let finalThemeHash = hashClassPrefix;
    const hashValue = hashRef ? hashRef.value : undefined;
    const themeHash = mergedThemeHashRef === null || mergedThemeHashRef === undefined ? undefined : mergedThemeHashRef.value;
    if (themeHash) finalThemeHash += `-${themeHash}`;
    if (hashValue) finalThemeHash += `-${hashValue}`;
    const {
      themeOverrides,
      builtinThemeOverrides
    } = props;
    if (themeOverrides) {
      finalThemeHash += `-${hash(JSON.stringify(themeOverrides))}`;
    }
    if (builtinThemeOverrides) {
      finalThemeHash += `-${hash(JSON.stringify(builtinThemeOverrides))}`;
    }
    themeClassRef.value = finalThemeHash;
    renderCallback = () => {
      const cssVars = cssVarsRef.value;
      let style2 = "";
      for (const key in cssVars) {
        style2 += `${key}: ${cssVars[key]};`;
      }
      c(`.${finalThemeHash}`, style2).mount({
        id: finalThemeHash,
        ssr: ssrAdapter,
        parent: styleMountTarget
      });
      renderCallback = undefined;
    };
  };
  watchEffect(() => {
    mountStyle();
  });
  return {
    themeClass: themeClassRef,
    onRender: () => {
      renderCallback === null || renderCallback === undefined ? undefined : renderCallback();
    }
  };
}
const formItemInjectionKey = createInjectionKey("n-form-item");
function useFormItem(props, {
  defaultSize = "medium",
  mergedSize,
  mergedDisabled
} = {}) {
  const NFormItem = inject(formItemInjectionKey, null);
  provide(formItemInjectionKey, null);
  const mergedSizeRef = computed(mergedSize ? () => mergedSize(NFormItem) : () => {
    const {
      size
    } = props;
    if (size) return size;
    if (NFormItem) {
      const {
        mergedSize: mergedSize2
      } = NFormItem;
      if (mergedSize2.value !== undefined) {
        return mergedSize2.value;
      }
    }
    return defaultSize;
  });
  const mergedDisabledRef = computed(mergedDisabled ? () => mergedDisabled(NFormItem) : () => {
    const {
      disabled
    } = props;
    if (disabled !== undefined) {
      return disabled;
    }
    if (NFormItem) {
      return NFormItem.disabled.value;
    }
    return false;
  });
  const mergedStatusRef = computed(() => {
    const {
      status
    } = props;
    if (status) return status;
    return NFormItem === null || NFormItem === undefined ? undefined : NFormItem.mergedValidationStatus.value;
  });
  return {
    mergedSizeRef,
    mergedDisabledRef,
    mergedStatusRef,
    nTriggerFormBlur() {
      if (NFormItem) {
        NFormItem.handleContentBlur();
      }
    },
    nTriggerFormChange() {
      if (NFormItem) {
        NFormItem.handleContentChange();
      }
    },
    nTriggerFormFocus() {
      if (NFormItem) {
        NFormItem.handleContentFocus();
      }
    },
    nTriggerFormInput() {
      if (NFormItem) {
        NFormItem.handleContentInput();
      }
    }
  };
}
const cssrAnchorMetaName = "naive-ui-style";
function useRtl(mountId, rtlStateRef, clsPrefixRef) {
  if (!rtlStateRef) return undefined;
  const ssrAdapter = useSsrAdapter();
  const componentRtlStateRef = computed(() => {
    const {
      value: rtlState
    } = rtlStateRef;
    if (!rtlState) {
      return undefined;
    }
    const componentRtlState = rtlState[mountId];
    if (!componentRtlState) {
      return undefined;
    }
    return componentRtlState;
  });
  const NConfigProvider = inject(configProviderInjectionKey, null);
  const mountStyle = () => {
    watchEffect(() => {
      const {
        value: clsPrefix
      } = clsPrefixRef;
      const id = `${clsPrefix}${mountId}Rtl`;
      if (exists(id, ssrAdapter)) return;
      const {
        value: componentRtlState
      } = componentRtlStateRef;
      if (!componentRtlState) return;
      componentRtlState.style.mount({
        id,
        head: true,
        anchorMetaName: cssrAnchorMetaName,
        props: {
          bPrefix: clsPrefix ? `.${clsPrefix}-` : undefined
        },
        ssr: ssrAdapter,
        parent: NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.styleMountTarget
      });
    });
  };
  if (ssrAdapter) {
    mountStyle();
  }
  return componentRtlStateRef;
}
const commonVariables$n = {
  fontFamily: 'v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontFamilyMono: "v-mono, SFMono-Regular, Menlo, Consolas, Courier, monospace",
  fontWeight: "400",
  fontWeightStrong: "500",
  cubicBezierEaseInOut: "cubic-bezier(.4, 0, .2, 1)",
  cubicBezierEaseOut: "cubic-bezier(0, 0, .2, 1)",
  cubicBezierEaseIn: "cubic-bezier(.4, 0, 1, 1)",
  borderRadius: "3px",
  borderRadiusSmall: "2px",
  fontSize: "14px",
  fontSizeMini: "12px",
  fontSizeTiny: "12px",
  fontSizeSmall: "14px",
  fontSizeMedium: "14px",
  fontSizeLarge: "15px",
  fontSizeHuge: "16px",
  lineHeight: "1.6",
  heightMini: "16px",
  // private now, it's too small
  heightTiny: "22px",
  heightSmall: "28px",
  heightMedium: "34px",
  heightLarge: "40px",
  heightHuge: "46px"
};
const {
  fontSize,
  fontFamily,
  lineHeight
} = commonVariables$n;
const globalStyle = c("body", `
 margin: 0;
 font-size: ${fontSize};
 font-family: ${fontFamily};
 line-height: ${lineHeight};
 -webkit-text-size-adjust: 100%;
 -webkit-tap-highlight-color: transparent;
`, [c("input", `
 font-family: inherit;
 font-size: inherit;
 `)]);
function useStyle(mountId, style2, clsPrefixRef) {
  if (!style2) {
    return;
  }
  const ssrAdapter = useSsrAdapter();
  const NConfigProvider = inject(configProviderInjectionKey, null);
  const mountStyle = () => {
    const clsPrefix = clsPrefixRef.value;
    style2.mount({
      id: clsPrefix === undefined ? mountId : clsPrefix + mountId,
      head: true,
      anchorMetaName: cssrAnchorMetaName,
      props: {
        bPrefix: clsPrefix ? `.${clsPrefix}-` : undefined
      },
      ssr: ssrAdapter,
      parent: NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.styleMountTarget
    });
    if (!(NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.preflightStyleDisabled)) {
      globalStyle.mount({
        id: "n-global",
        head: true,
        anchorMetaName: cssrAnchorMetaName,
        ssr: ssrAdapter,
        parent: NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.styleMountTarget
      });
    }
  };
  if (ssrAdapter) {
    mountStyle();
  }
}
function createTheme(theme) {
  return theme;
}
function useTheme(resolveId, mountId, style2, defaultTheme, props, clsPrefixRef) {
  const ssrAdapter = useSsrAdapter();
  const NConfigProvider = inject(configProviderInjectionKey, null);
  if (style2) {
    const mountStyle = () => {
      const clsPrefix = clsPrefixRef === null || clsPrefixRef === undefined ? undefined : clsPrefixRef.value;
      style2.mount({
        id: clsPrefix === undefined ? mountId : clsPrefix + mountId,
        head: true,
        props: {
          bPrefix: clsPrefix ? `.${clsPrefix}-` : undefined
        },
        anchorMetaName: cssrAnchorMetaName,
        ssr: ssrAdapter,
        parent: NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.styleMountTarget
      });
      if (!(NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.preflightStyleDisabled)) {
        globalStyle.mount({
          id: "n-global",
          head: true,
          anchorMetaName: cssrAnchorMetaName,
          ssr: ssrAdapter,
          parent: NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.styleMountTarget
        });
      }
    };
    if (ssrAdapter) {
      mountStyle();
    }
  }
  const mergedThemeRef = computed(() => {
    var _a;
    const {
      theme: {
        common: selfCommon,
        self: self2,
        peers = {}
      } = {},
      themeOverrides: selfOverrides = {},
      builtinThemeOverrides: builtinOverrides = {}
    } = props;
    const {
      common: selfCommonOverrides,
      peers: peersOverrides
    } = selfOverrides;
    const {
      common: globalCommon = undefined,
      [resolveId]: {
        common: globalSelfCommon = undefined,
        self: globalSelf = undefined,
        peers: globalPeers = {}
      } = {}
    } = (NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedThemeRef.value) || {};
    const {
      common: globalCommonOverrides = undefined,
      [resolveId]: globalSelfOverrides = {}
    } = (NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedThemeOverridesRef.value) || {};
    const {
      common: globalSelfCommonOverrides,
      peers: globalPeersOverrides = {}
    } = globalSelfOverrides;
    const mergedCommon = merge({}, selfCommon || globalSelfCommon || globalCommon || defaultTheme.common, globalCommonOverrides, globalSelfCommonOverrides, selfCommonOverrides);
    const mergedSelf = merge(
      // {}, executed every time, no need for empty obj
      (_a = self2 || globalSelf || defaultTheme.self) === null || _a === undefined ? undefined : _a(mergedCommon),
      builtinOverrides,
      globalSelfOverrides,
      selfOverrides
    );
    return {
      common: mergedCommon,
      self: mergedSelf,
      peers: merge({}, defaultTheme.peers, globalPeers, peers),
      peerOverrides: merge({}, builtinOverrides.peers, globalPeersOverrides, peersOverrides)
    };
  });
  return mergedThemeRef;
}
useTheme.props = {
  theme: Object,
  themeOverrides: Object,
  builtinThemeOverrides: Object
};
const style$8 = cB("base-icon", `
 height: 1em;
 width: 1em;
 line-height: 1em;
 text-align: center;
 display: inline-block;
 position: relative;
 fill: currentColor;
 transform: translateZ(0);
`, [c("svg", `
 height: 1em;
 width: 1em;
 `)]);
const NBaseIcon = defineComponent({
  name: "BaseIcon",
  props: {
    role: String,
    ariaLabel: String,
    ariaDisabled: {
      type: Boolean,
      default: undefined
    },
    ariaHidden: {
      type: Boolean,
      default: undefined
    },
    clsPrefix: {
      type: String,
      required: true
    },
    onClick: Function,
    onMousedown: Function,
    onMouseup: Function
  },
  setup(props) {
    useStyle("-base-icon", style$8, toRef(props, "clsPrefix"));
  },
  render() {
    return h("i", {
      class: `${this.clsPrefix}-base-icon`,
      onClick: this.onClick,
      onMousedown: this.onMousedown,
      onMouseup: this.onMouseup,
      role: this.role,
      "aria-label": this.ariaLabel,
      "aria-hidden": this.ariaHidden,
      "aria-disabled": this.ariaDisabled
    }, this.$slots);
  }
});
const NIconSwitchTransition = defineComponent({
  name: "BaseIconSwitchTransition",
  setup(_, {
    slots
  }) {
    const isMountedRef = useIsMounted();
    return () => h(Transition, {
      name: "icon-switch-transition",
      appear: isMountedRef.value
    }, slots);
  }
});
function replaceable(name, icon) {
  const IconComponent = defineComponent({
    render() {
      return icon();
    }
  });
  return defineComponent({
    name: upperFirst(name),
    setup() {
      var _a;
      const mergedIconsRef = (_a = inject(configProviderInjectionKey, null)) === null || _a === undefined ? undefined : _a.mergedIconsRef;
      return () => {
        var _a2;
        const iconOverride = (_a2 = mergedIconsRef === null || mergedIconsRef === undefined ? undefined : mergedIconsRef.value) === null || _a2 === undefined ? undefined : _a2[name];
        return iconOverride ? iconOverride() : h(IconComponent, null);
      };
    }
  });
}
const ErrorIcon$1 = replaceable("close", () => h("svg", {
  viewBox: "0 0 12 12",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true
}, h("g", {
  stroke: "none",
  "stroke-width": "1",
  fill: "none",
  "fill-rule": "evenodd"
}, h("g", {
  fill: "currentColor",
  "fill-rule": "nonzero"
}, h("path", {
  d: "M2.08859116,2.2156945 L2.14644661,2.14644661 C2.32001296,1.97288026 2.58943736,1.95359511 2.7843055,2.08859116 L2.85355339,2.14644661 L6,5.293 L9.14644661,2.14644661 C9.34170876,1.95118446 9.65829124,1.95118446 9.85355339,2.14644661 C10.0488155,2.34170876 10.0488155,2.65829124 9.85355339,2.85355339 L6.707,6 L9.85355339,9.14644661 C10.0271197,9.32001296 10.0464049,9.58943736 9.91140884,9.7843055 L9.85355339,9.85355339 C9.67998704,10.0271197 9.41056264,10.0464049 9.2156945,9.91140884 L9.14644661,9.85355339 L6,6.707 L2.85355339,9.85355339 C2.65829124,10.0488155 2.34170876,10.0488155 2.14644661,9.85355339 C1.95118446,9.65829124 1.95118446,9.34170876 2.14644661,9.14644661 L5.293,6 L2.14644661,2.85355339 C1.97288026,2.67998704 1.95359511,2.41056264 2.08859116,2.2156945 L2.14644661,2.14644661 L2.08859116,2.2156945 Z"
})))));
const ErrorIcon = replaceable("error", () => h("svg", {
  viewBox: "0 0 48 48",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
}, h("g", {
  stroke: "none",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, h("g", {
  "fill-rule": "nonzero"
}, h("path", {
  d: "M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M17.8838835,16.1161165 L17.7823881,16.0249942 C17.3266086,15.6583353 16.6733914,15.6583353 16.2176119,16.0249942 L16.1161165,16.1161165 L16.0249942,16.2176119 C15.6583353,16.6733914 15.6583353,17.3266086 16.0249942,17.7823881 L16.1161165,17.8838835 L22.233,24 L16.1161165,30.1161165 L16.0249942,30.2176119 C15.6583353,30.6733914 15.6583353,31.3266086 16.0249942,31.7823881 L16.1161165,31.8838835 L16.2176119,31.9750058 C16.6733914,32.3416647 17.3266086,32.3416647 17.7823881,31.9750058 L17.8838835,31.8838835 L24,25.767 L30.1161165,31.8838835 L30.2176119,31.9750058 C30.6733914,32.3416647 31.3266086,32.3416647 31.7823881,31.9750058 L31.8838835,31.8838835 L31.9750058,31.7823881 C32.3416647,31.3266086 32.3416647,30.6733914 31.9750058,30.2176119 L31.8838835,30.1161165 L25.767,24 L31.8838835,17.8838835 L31.9750058,17.7823881 C32.3416647,17.3266086 32.3416647,16.6733914 31.9750058,16.2176119 L31.8838835,16.1161165 L31.7823881,16.0249942 C31.3266086,15.6583353 30.6733914,15.6583353 30.2176119,16.0249942 L30.1161165,16.1161165 L24,22.233 L17.8838835,16.1161165 L17.7823881,16.0249942 L17.8838835,16.1161165 Z"
})))));
const InfoIcon = replaceable("info", () => h("svg", {
  viewBox: "0 0 28 28",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
}, h("g", {
  stroke: "none",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, h("g", {
  "fill-rule": "nonzero"
}, h("path", {
  d: "M14,2 C20.6274,2 26,7.37258 26,14 C26,20.6274 20.6274,26 14,26 C7.37258,26 2,20.6274 2,14 C2,7.37258 7.37258,2 14,2 Z M14,11 C13.4477,11 13,11.4477 13,12 L13,12 L13,20 C13,20.5523 13.4477,21 14,21 C14.5523,21 15,20.5523 15,20 L15,20 L15,12 C15,11.4477 14.5523,11 14,11 Z M14,6.75 C13.3096,6.75 12.75,7.30964 12.75,8 C12.75,8.69036 13.3096,9.25 14,9.25 C14.6904,9.25 15.25,8.69036 15.25,8 C15.25,7.30964 14.6904,6.75 14,6.75 Z"
})))));
const SuccessIcon = replaceable("success", () => h("svg", {
  viewBox: "0 0 48 48",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
}, h("g", {
  stroke: "none",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, h("g", {
  "fill-rule": "nonzero"
}, h("path", {
  d: "M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M32.6338835,17.6161165 C32.1782718,17.1605048 31.4584514,17.1301307 30.9676119,17.5249942 L30.8661165,17.6161165 L20.75,27.732233 L17.1338835,24.1161165 C16.6457281,23.6279612 15.8542719,23.6279612 15.3661165,24.1161165 C14.9105048,24.5717282 14.8801307,25.2915486 15.2749942,25.7823881 L15.3661165,25.8838835 L19.8661165,30.3838835 C20.3217282,30.8394952 21.0415486,30.8698693 21.5323881,30.4750058 L21.6338835,30.3838835 L32.6338835,19.3838835 C33.1220388,18.8957281 33.1220388,18.1042719 32.6338835,17.6161165 Z"
})))));
const WarningIcon = replaceable("warning", () => h("svg", {
  viewBox: "0 0 24 24",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
}, h("g", {
  stroke: "none",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, h("g", {
  "fill-rule": "nonzero"
}, h("path", {
  d: "M12,2 C17.523,2 22,6.478 22,12 C22,17.522 17.523,22 12,22 C6.477,22 2,17.522 2,12 C2,6.478 6.477,2 12,2 Z M12.0018002,15.0037242 C11.450254,15.0037242 11.0031376,15.4508407 11.0031376,16.0023869 C11.0031376,16.553933 11.450254,17.0010495 12.0018002,17.0010495 C12.5533463,17.0010495 13.0004628,16.553933 13.0004628,16.0023869 C13.0004628,15.4508407 12.5533463,15.0037242 12.0018002,15.0037242 Z M11.99964,7 C11.4868042,7.00018474 11.0642719,7.38637706 11.0066858,7.8837365 L11,8.00036004 L11.0018003,13.0012393 L11.00857,13.117858 C11.0665141,13.6151758 11.4893244,14.0010638 12.0021602,14.0008793 C12.514996,14.0006946 12.9375283,13.6145023 12.9951144,13.1171428 L13.0018002,13.0005193 L13,7.99964009 L12.9932303,7.8830214 C12.9352861,7.38570354 12.5124758,6.99981552 11.99964,7 Z"
})))));
const {
  cubicBezierEaseInOut: cubicBezierEaseInOut$2
} = commonVariables$n;
function iconSwitchTransition({
  originalTransform = "",
  left = 0,
  top = 0,
  transition = `all .3s ${cubicBezierEaseInOut$2} !important`
} = {}) {
  return [c("&.icon-switch-transition-enter-from, &.icon-switch-transition-leave-to", {
    transform: `${originalTransform} scale(0.75)`,
    left,
    top,
    opacity: 0
  }), c("&.icon-switch-transition-enter-to, &.icon-switch-transition-leave-from", {
    transform: `scale(1) ${originalTransform}`,
    left,
    top,
    opacity: 1
  }), c("&.icon-switch-transition-enter-active, &.icon-switch-transition-leave-active", {
    transformOrigin: "center",
    position: "absolute",
    left,
    top,
    transition
  })];
}
const style$7 = cB("base-close", `
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;
 background-color: transparent;
 color: var(--n-close-icon-color);
 border-radius: var(--n-close-border-radius);
 height: var(--n-close-size);
 width: var(--n-close-size);
 font-size: var(--n-close-icon-size);
 outline: none;
 border: none;
 position: relative;
 padding: 0;
`, [cM("absolute", `
 height: var(--n-close-icon-size);
 width: var(--n-close-icon-size);
 `), c("&::before", `
 content: "";
 position: absolute;
 width: var(--n-close-size);
 height: var(--n-close-size);
 left: 50%;
 top: 50%;
 transform: translateY(-50%) translateX(-50%);
 transition: inherit;
 border-radius: inherit;
 `), cNotM("disabled", [c("&:hover", `
 color: var(--n-close-icon-color-hover);
 `), c("&:hover::before", `
 background-color: var(--n-close-color-hover);
 `), c("&:focus::before", `
 background-color: var(--n-close-color-hover);
 `), c("&:active", `
 color: var(--n-close-icon-color-pressed);
 `), c("&:active::before", `
 background-color: var(--n-close-color-pressed);
 `)]), cM("disabled", `
 cursor: not-allowed;
 color: var(--n-close-icon-color-disabled);
 background-color: transparent;
 `), cM("round", [c("&::before", `
 border-radius: 50%;
 `)])]);
const NBaseClose = defineComponent({
  name: "BaseClose",
  props: {
    isButtonTag: {
      type: Boolean,
      default: true
    },
    clsPrefix: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: undefined
    },
    focusable: {
      type: Boolean,
      default: true
    },
    round: Boolean,
    onClick: Function,
    absolute: Boolean
  },
  setup(props) {
    useStyle("-base-close", style$7, toRef(props, "clsPrefix"));
    return () => {
      const {
        clsPrefix,
        disabled,
        absolute,
        round,
        isButtonTag
      } = props;
      const Tag = isButtonTag ? "button" : "div";
      return h(Tag, {
        type: isButtonTag ? "button" : undefined,
        tabindex: disabled || !props.focusable ? -1 : 0,
        "aria-disabled": disabled,
        "aria-label": "close",
        role: isButtonTag ? undefined : "button",
        disabled,
        class: [`${clsPrefix}-base-close`, absolute && `${clsPrefix}-base-close--absolute`, disabled && `${clsPrefix}-base-close--disabled`, round && `${clsPrefix}-base-close--round`],
        onMousedown: (e) => {
          if (!props.focusable) {
            e.preventDefault();
          }
        },
        onClick: props.onClick
      }, h(NBaseIcon, {
        clsPrefix
      }, {
        default: () => h(ErrorIcon$1, null)
      }));
    };
  }
});
const NFadeInExpandTransition = defineComponent({
  name: "FadeInExpandTransition",
  props: {
    appear: Boolean,
    group: Boolean,
    mode: String,
    onLeave: Function,
    onAfterLeave: Function,
    onAfterEnter: Function,
    width: Boolean,
    // reverse mode is only used in tree
    // it make it from expanded to collapsed after mounted
    reverse: Boolean
  },
  setup(props, {
    slots
  }) {
    function handleBeforeLeave(el) {
      if (props.width) {
        el.style.maxWidth = `${el.offsetWidth}px`;
      } else {
        el.style.maxHeight = `${el.offsetHeight}px`;
      }
      void el.offsetWidth;
    }
    function handleLeave(el) {
      if (props.width) {
        el.style.maxWidth = "0";
      } else {
        el.style.maxHeight = "0";
      }
      void el.offsetWidth;
      const {
        onLeave
      } = props;
      if (onLeave) onLeave();
    }
    function handleAfterLeave(el) {
      if (props.width) {
        el.style.maxWidth = "";
      } else {
        el.style.maxHeight = "";
      }
      const {
        onAfterLeave
      } = props;
      if (onAfterLeave) onAfterLeave();
    }
    function handleEnter(el) {
      el.style.transition = "none";
      if (props.width) {
        const memorizedWidth = el.offsetWidth;
        el.style.maxWidth = "0";
        void el.offsetWidth;
        el.style.transition = "";
        el.style.maxWidth = `${memorizedWidth}px`;
      } else {
        if (props.reverse) {
          el.style.maxHeight = `${el.offsetHeight}px`;
          void el.offsetHeight;
          el.style.transition = "";
          el.style.maxHeight = "0";
        } else {
          const memorizedHeight = el.offsetHeight;
          el.style.maxHeight = "0";
          void el.offsetWidth;
          el.style.transition = "";
          el.style.maxHeight = `${memorizedHeight}px`;
        }
      }
      void el.offsetWidth;
    }
    function handleAfterEnter(el) {
      var _a;
      if (props.width) {
        el.style.maxWidth = "";
      } else {
        if (!props.reverse) {
          el.style.maxHeight = "";
        }
      }
      (_a = props.onAfterEnter) === null || _a === undefined ? undefined : _a.call(props);
    }
    return () => {
      const {
        group,
        width,
        appear,
        mode
      } = props;
      const type = group ? TransitionGroup : Transition;
      const resolvedProps = {
        name: width ? "fade-in-width-expand-transition" : "fade-in-height-expand-transition",
        appear,
        onEnter: handleEnter,
        onAfterEnter: handleAfterEnter,
        onBeforeLeave: handleBeforeLeave,
        onLeave: handleLeave,
        onAfterLeave: handleAfterLeave
      };
      if (!group) {
        resolvedProps.mode = mode;
      }
      return h(type, resolvedProps, slots);
    };
  }
});
const style$6 = c([c("@keyframes rotator", `
 0% {
 -webkit-transform: rotate(0deg);
 transform: rotate(0deg);
 }
 100% {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
 }`), cB("base-loading", `
 position: relative;
 line-height: 0;
 width: 1em;
 height: 1em;
 `, [cE("transition-wrapper", `
 position: absolute;
 width: 100%;
 height: 100%;
 `, [iconSwitchTransition()]), cE("placeholder", `
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `, [iconSwitchTransition({
  left: "50%",
  top: "50%",
  originalTransform: "translateX(-50%) translateY(-50%)"
})]), cE("container", `
 animation: rotator 3s linear infinite both;
 `, [cE("icon", `
 height: 1em;
 width: 1em;
 `)])])]);
const duration = "1.6s";
const exposedLoadingProps = {
  strokeWidth: {
    type: Number,
    default: 28
  },
  stroke: {
    type: String,
    default: undefined
  }
};
const NBaseLoading = defineComponent({
  name: "BaseLoading",
  props: Object.assign({
    clsPrefix: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      default: true
    },
    scale: {
      type: Number,
      default: 1
    },
    radius: {
      type: Number,
      default: 100
    }
  }, exposedLoadingProps),
  setup(props) {
    useStyle("-base-loading", style$6, toRef(props, "clsPrefix"));
  },
  render() {
    const {
      clsPrefix,
      radius,
      strokeWidth,
      stroke,
      scale
    } = this;
    const scaledRadius = radius / scale;
    return h("div", {
      class: `${clsPrefix}-base-loading`,
      role: "img",
      "aria-label": "loading"
    }, h(NIconSwitchTransition, null, {
      default: () => this.show ? h("div", {
        key: "icon",
        class: `${clsPrefix}-base-loading__transition-wrapper`
      }, h("div", {
        class: `${clsPrefix}-base-loading__container`
      }, h("svg", {
        class: `${clsPrefix}-base-loading__icon`,
        viewBox: `0 0 ${2 * scaledRadius} ${2 * scaledRadius}`,
        xmlns: "http://www.w3.org/2000/svg",
        style: {
          color: stroke
        }
      }, h("g", null, h("animateTransform", {
        attributeName: "transform",
        type: "rotate",
        values: `0 ${scaledRadius} ${scaledRadius};270 ${scaledRadius} ${scaledRadius}`,
        begin: "0s",
        dur: duration,
        fill: "freeze",
        repeatCount: "indefinite"
      }), h("circle", {
        class: `${clsPrefix}-base-loading__icon`,
        fill: "none",
        stroke: "currentColor",
        "stroke-width": strokeWidth,
        "stroke-linecap": "round",
        cx: scaledRadius,
        cy: scaledRadius,
        r: radius - strokeWidth / 2,
        "stroke-dasharray": 5.67 * radius,
        "stroke-dashoffset": 18.48 * radius
      }, h("animateTransform", {
        attributeName: "transform",
        type: "rotate",
        values: `0 ${scaledRadius} ${scaledRadius};135 ${scaledRadius} ${scaledRadius};450 ${scaledRadius} ${scaledRadius}`,
        begin: "0s",
        dur: duration,
        fill: "freeze",
        repeatCount: "indefinite"
      }), h("animate", {
        attributeName: "stroke-dashoffset",
        values: `${5.67 * radius};${1.42 * radius};${5.67 * radius}`,
        begin: "0s",
        dur: duration,
        fill: "freeze",
        repeatCount: "indefinite"
      })))))) : h("div", {
        key: "placeholder",
        class: `${clsPrefix}-base-loading__placeholder`
      }, this.$slots)
    }));
  }
});
const {
  cubicBezierEaseInOut: cubicBezierEaseInOut$1
} = commonVariables$n;
function fadeInTransition({
  name = "fade-in",
  enterDuration = "0.2s",
  leaveDuration = "0.2s",
  enterCubicBezier = cubicBezierEaseInOut$1,
  leaveCubicBezier = cubicBezierEaseInOut$1
} = {}) {
  return [c(`&.${name}-transition-enter-active`, {
    transition: `all ${enterDuration} ${enterCubicBezier}!important`
  }), c(`&.${name}-transition-leave-active`, {
    transition: `all ${leaveDuration} ${leaveCubicBezier}!important`
  }), c(`&.${name}-transition-enter-from, &.${name}-transition-leave-to`, {
    opacity: 0
  }), c(`&.${name}-transition-leave-from, &.${name}-transition-enter-to`, {
    opacity: 1
  })];
}
const base$1 = {
  neutralBase: "#000",
  neutralInvertBase: "#fff",
  neutralTextBase: "#fff",
  neutralPopover: "rgb(72, 72, 78)",
  neutralCard: "rgb(24, 24, 28)",
  neutralModal: "rgb(44, 44, 50)",
  neutralBody: "rgb(16, 16, 20)",
  alpha1: "0.9",
  alpha2: "0.82",
  alpha3: "0.52",
  alpha4: "0.38",
  alpha5: "0.28",
  alphaClose: "0.52",
  alphaDisabled: "0.38",
  alphaDisabledInput: "0.06",
  alphaPending: "0.09",
  alphaTablePending: "0.06",
  alphaTableStriped: "0.05",
  alphaPressed: "0.05",
  alphaAvatar: "0.18",
  alphaRail: "0.2",
  alphaProgressRail: "0.12",
  alphaBorder: "0.24",
  alphaDivider: "0.09",
  alphaInput: "0.1",
  alphaAction: "0.06",
  alphaTab: "0.04",
  alphaScrollbar: "0.2",
  alphaScrollbarHover: "0.3",
  alphaCode: "0.12",
  alphaTag: "0.2",
  // primary
  primaryHover: "#7fe7c4",
  primaryDefault: "#63e2b7",
  primaryActive: "#5acea7",
  primarySuppl: "rgb(42, 148, 125)",
  // info
  infoHover: "#8acbec",
  infoDefault: "#70c0e8",
  infoActive: "#66afd3",
  infoSuppl: "rgb(56, 137, 197)",
  // error
  errorHover: "#e98b8b",
  errorDefault: "#e88080",
  errorActive: "#e57272",
  errorSuppl: "rgb(208, 58, 82)",
  // warning
  warningHover: "#f5d599",
  warningDefault: "#f2c97d",
  warningActive: "#e6c260",
  warningSuppl: "rgb(240, 138, 0)",
  // success
  successHover: "#7fe7c4",
  successDefault: "#63e2b7",
  successActive: "#5acea7",
  successSuppl: "rgb(42, 148, 125)"
};
const baseBackgroundRgb$1 = rgba(base$1.neutralBase);
const baseInvertBackgroundRgb$1 = rgba(base$1.neutralInvertBase);
const overlayPrefix$1 = `rgba(${baseInvertBackgroundRgb$1.slice(0, 3).join(", ")}, `;
function overlay$1(alpha) {
  return `${overlayPrefix$1 + String(alpha)})`;
}
function neutral$1(alpha) {
  const overlayRgba = Array.from(baseInvertBackgroundRgb$1);
  overlayRgba[3] = Number(alpha);
  return composite(baseBackgroundRgb$1, overlayRgba);
}
const derived$1 = Object.assign(Object.assign({
  name: "common"
}, commonVariables$n), {
  baseColor: base$1.neutralBase,
  // primary color
  primaryColor: base$1.primaryDefault,
  primaryColorHover: base$1.primaryHover,
  primaryColorPressed: base$1.primaryActive,
  primaryColorSuppl: base$1.primarySuppl,
  // info color
  infoColor: base$1.infoDefault,
  infoColorHover: base$1.infoHover,
  infoColorPressed: base$1.infoActive,
  infoColorSuppl: base$1.infoSuppl,
  // success color
  successColor: base$1.successDefault,
  successColorHover: base$1.successHover,
  successColorPressed: base$1.successActive,
  successColorSuppl: base$1.successSuppl,
  // warning color
  warningColor: base$1.warningDefault,
  warningColorHover: base$1.warningHover,
  warningColorPressed: base$1.warningActive,
  warningColorSuppl: base$1.warningSuppl,
  // error color
  errorColor: base$1.errorDefault,
  errorColorHover: base$1.errorHover,
  errorColorPressed: base$1.errorActive,
  errorColorSuppl: base$1.errorSuppl,
  // text color
  textColorBase: base$1.neutralTextBase,
  textColor1: overlay$1(base$1.alpha1),
  textColor2: overlay$1(base$1.alpha2),
  textColor3: overlay$1(base$1.alpha3),
  // textColor4: overlay(base.alpha4), // disabled, placeholder, icon
  // textColor5: overlay(base.alpha5),
  textColorDisabled: overlay$1(base$1.alpha4),
  placeholderColor: overlay$1(base$1.alpha4),
  placeholderColorDisabled: overlay$1(base$1.alpha5),
  iconColor: overlay$1(base$1.alpha4),
  iconColorDisabled: overlay$1(base$1.alpha5),
  iconColorHover: overlay$1(Number(base$1.alpha4) * 1.25),
  iconColorPressed: overlay$1(Number(base$1.alpha4) * 0.8),
  opacity1: base$1.alpha1,
  opacity2: base$1.alpha2,
  opacity3: base$1.alpha3,
  opacity4: base$1.alpha4,
  opacity5: base$1.alpha5,
  dividerColor: overlay$1(base$1.alphaDivider),
  borderColor: overlay$1(base$1.alphaBorder),
  // close
  closeIconColorHover: overlay$1(Number(base$1.alphaClose)),
  closeIconColor: overlay$1(Number(base$1.alphaClose)),
  closeIconColorPressed: overlay$1(Number(base$1.alphaClose)),
  closeColorHover: "rgba(255, 255, 255, .12)",
  closeColorPressed: "rgba(255, 255, 255, .08)",
  // clear
  clearColor: overlay$1(base$1.alpha4),
  clearColorHover: scaleColor(overlay$1(base$1.alpha4), {
    alpha: 1.25
  }),
  clearColorPressed: scaleColor(overlay$1(base$1.alpha4), {
    alpha: 0.8
  }),
  scrollbarColor: overlay$1(base$1.alphaScrollbar),
  scrollbarColorHover: overlay$1(base$1.alphaScrollbarHover),
  scrollbarWidth: "5px",
  scrollbarHeight: "5px",
  scrollbarBorderRadius: "5px",
  progressRailColor: overlay$1(base$1.alphaProgressRail),
  railColor: overlay$1(base$1.alphaRail),
  popoverColor: base$1.neutralPopover,
  tableColor: base$1.neutralCard,
  cardColor: base$1.neutralCard,
  modalColor: base$1.neutralModal,
  bodyColor: base$1.neutralBody,
  tagColor: neutral$1(base$1.alphaTag),
  avatarColor: overlay$1(base$1.alphaAvatar),
  invertedColor: base$1.neutralBase,
  inputColor: overlay$1(base$1.alphaInput),
  codeColor: overlay$1(base$1.alphaCode),
  tabColor: overlay$1(base$1.alphaTab),
  actionColor: overlay$1(base$1.alphaAction),
  tableHeaderColor: overlay$1(base$1.alphaAction),
  hoverColor: overlay$1(base$1.alphaPending),
  tableColorHover: overlay$1(base$1.alphaTablePending),
  tableColorStriped: overlay$1(base$1.alphaTableStriped),
  pressedColor: overlay$1(base$1.alphaPressed),
  opacityDisabled: base$1.alphaDisabled,
  inputColorDisabled: overlay$1(base$1.alphaDisabledInput),
  buttonColor2: "rgba(255, 255, 255, .08)",
  buttonColor2Hover: "rgba(255, 255, 255, .12)",
  buttonColor2Pressed: "rgba(255, 255, 255, .08)",
  boxShadow1: "0 1px 2px -2px rgba(0, 0, 0, .24), 0 3px 6px 0 rgba(0, 0, 0, .18), 0 5px 12px 4px rgba(0, 0, 0, .12)",
  boxShadow2: "0 3px 6px -4px rgba(0, 0, 0, .24), 0 6px 12px 0 rgba(0, 0, 0, .16), 0 9px 18px 8px rgba(0, 0, 0, .10)",
  boxShadow3: "0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)"
});
const base = {
  neutralBase: "#FFF",
  neutralInvertBase: "#000",
  neutralTextBase: "#000",
  neutralPopover: "#fff",
  neutralCard: "#fff",
  neutralModal: "#fff",
  neutralBody: "#fff",
  alpha1: "0.82",
  alpha2: "0.72",
  alpha3: "0.38",
  alpha4: "0.24",
  // disabled text, placeholder, icon
  alpha5: "0.18",
  // disabled placeholder
  alphaClose: "0.6",
  alphaDisabled: "0.5",
  alphaAvatar: "0.2",
  alphaProgressRail: ".08",
  alphaInput: "0",
  alphaScrollbar: "0.25",
  alphaScrollbarHover: "0.4",
  // primary
  primaryHover: "#36ad6a",
  primaryDefault: "#18a058",
  primaryActive: "#0c7a43",
  primarySuppl: "#36ad6a",
  // info
  infoHover: "#4098fc",
  infoDefault: "#2080f0",
  infoActive: "#1060c9",
  infoSuppl: "#4098fc",
  // error
  errorHover: "#de576d",
  errorDefault: "#d03050",
  errorActive: "#ab1f3f",
  errorSuppl: "#de576d",
  // warning
  warningHover: "#fcb040",
  warningDefault: "#f0a020",
  warningActive: "#c97c10",
  warningSuppl: "#fcb040",
  // success
  successHover: "#36ad6a",
  successDefault: "#18a058",
  successActive: "#0c7a43",
  successSuppl: "#36ad6a"
};
const baseBackgroundRgb = rgba(base.neutralBase);
const baseInvertBackgroundRgb = rgba(base.neutralInvertBase);
const overlayPrefix = `rgba(${baseInvertBackgroundRgb.slice(0, 3).join(", ")}, `;
function overlay(alpha) {
  return `${overlayPrefix + String(alpha)})`;
}
function neutral(alpha) {
  const overlayRgba = Array.from(baseInvertBackgroundRgb);
  overlayRgba[3] = Number(alpha);
  return composite(baseBackgroundRgb, overlayRgba);
}
const derived = Object.assign(Object.assign({
  name: "common"
}, commonVariables$n), {
  baseColor: base.neutralBase,
  // primary color
  primaryColor: base.primaryDefault,
  primaryColorHover: base.primaryHover,
  primaryColorPressed: base.primaryActive,
  primaryColorSuppl: base.primarySuppl,
  // info color
  infoColor: base.infoDefault,
  infoColorHover: base.infoHover,
  infoColorPressed: base.infoActive,
  infoColorSuppl: base.infoSuppl,
  // success color
  successColor: base.successDefault,
  successColorHover: base.successHover,
  successColorPressed: base.successActive,
  successColorSuppl: base.successSuppl,
  // warning color
  warningColor: base.warningDefault,
  warningColorHover: base.warningHover,
  warningColorPressed: base.warningActive,
  warningColorSuppl: base.warningSuppl,
  // error color
  errorColor: base.errorDefault,
  errorColorHover: base.errorHover,
  errorColorPressed: base.errorActive,
  errorColorSuppl: base.errorSuppl,
  // text color
  textColorBase: base.neutralTextBase,
  textColor1: "rgb(31, 34, 37)",
  textColor2: "rgb(51, 54, 57)",
  textColor3: "rgb(118, 124, 130)",
  // textColor4: neutral(base.alpha4), // disabled, placeholder, icon
  // textColor5: neutral(base.alpha5),
  textColorDisabled: neutral(base.alpha4),
  placeholderColor: neutral(base.alpha4),
  placeholderColorDisabled: neutral(base.alpha5),
  iconColor: neutral(base.alpha4),
  iconColorHover: scaleColor(neutral(base.alpha4), {
    lightness: 0.75
  }),
  iconColorPressed: scaleColor(neutral(base.alpha4), {
    lightness: 0.9
  }),
  iconColorDisabled: neutral(base.alpha5),
  opacity1: base.alpha1,
  opacity2: base.alpha2,
  opacity3: base.alpha3,
  opacity4: base.alpha4,
  opacity5: base.alpha5,
  dividerColor: "rgb(239, 239, 245)",
  borderColor: "rgb(224, 224, 230)",
  // close
  closeIconColor: neutral(Number(base.alphaClose)),
  closeIconColorHover: neutral(Number(base.alphaClose)),
  closeIconColorPressed: neutral(Number(base.alphaClose)),
  closeColorHover: "rgba(0, 0, 0, .09)",
  closeColorPressed: "rgba(0, 0, 0, .13)",
  // clear
  clearColor: neutral(base.alpha4),
  clearColorHover: scaleColor(neutral(base.alpha4), {
    lightness: 0.75
  }),
  clearColorPressed: scaleColor(neutral(base.alpha4), {
    lightness: 0.9
  }),
  scrollbarColor: overlay(base.alphaScrollbar),
  scrollbarColorHover: overlay(base.alphaScrollbarHover),
  scrollbarWidth: "5px",
  scrollbarHeight: "5px",
  scrollbarBorderRadius: "5px",
  progressRailColor: neutral(base.alphaProgressRail),
  railColor: "rgb(219, 219, 223)",
  popoverColor: base.neutralPopover,
  tableColor: base.neutralCard,
  cardColor: base.neutralCard,
  modalColor: base.neutralModal,
  bodyColor: base.neutralBody,
  tagColor: "#eee",
  avatarColor: neutral(base.alphaAvatar),
  invertedColor: "rgb(0, 20, 40)",
  inputColor: neutral(base.alphaInput),
  codeColor: "rgb(244, 244, 248)",
  tabColor: "rgb(247, 247, 250)",
  actionColor: "rgb(250, 250, 252)",
  tableHeaderColor: "rgb(250, 250, 252)",
  hoverColor: "rgb(243, 243, 245)",
  // use color with alpha since it can be nested with header filter & sorter effect
  tableColorHover: "rgba(0, 0, 100, 0.03)",
  tableColorStriped: "rgba(0, 0, 100, 0.02)",
  pressedColor: "rgb(237, 237, 239)",
  opacityDisabled: base.alphaDisabled,
  inputColorDisabled: "rgb(250, 250, 252)",
  // secondary button color
  // can also be used in tertiary button & quaternary button
  buttonColor2: "rgba(46, 51, 56, .05)",
  buttonColor2Hover: "rgba(46, 51, 56, .09)",
  buttonColor2Pressed: "rgba(46, 51, 56, .13)",
  boxShadow1: "0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04)",
  boxShadow2: "0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05)",
  boxShadow3: "0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)"
});
const commonVars$d = {
  railInsetHorizontalBottom: "auto 2px 4px 2px",
  railInsetHorizontalTop: "4px 2px auto 2px",
  railInsetVerticalRight: "2px 4px 2px auto",
  railInsetVerticalLeft: "2px auto 2px 4px",
  railColor: "transparent"
};
function self$Q(vars) {
  const {
    scrollbarColor,
    scrollbarColorHover,
    scrollbarHeight,
    scrollbarWidth,
    scrollbarBorderRadius
  } = vars;
  return Object.assign(Object.assign({}, commonVars$d), {
    height: scrollbarHeight,
    width: scrollbarWidth,
    borderRadius: scrollbarBorderRadius,
    color: scrollbarColor,
    colorHover: scrollbarColorHover
  });
}
const scrollbarLight = {
  name: "Scrollbar",
  common: derived,
  self: self$Q
};
const scrollbarDark = {
  name: "Scrollbar",
  common: derived$1,
  self: self$Q
};
const style$5 = cB("scrollbar", `
 overflow: hidden;
 position: relative;
 z-index: auto;
 height: 100%;
 width: 100%;
`, [c(">", [cB("scrollbar-container", `
 width: 100%;
 overflow: scroll;
 height: 100%;
 min-height: inherit;
 max-height: inherit;
 scrollbar-width: none;
 `, [c("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb", `
 width: 0;
 height: 0;
 display: none;
 `), c(">", [
  // We can't set overflow hidden since it affects positioning.
  cB("scrollbar-content", `
 box-sizing: border-box;
 min-width: 100%;
 `)
])])]), c(">, +", [cB("scrollbar-rail", `
 position: absolute;
 pointer-events: none;
 user-select: none;
 background: var(--n-scrollbar-rail-color);
 -webkit-user-select: none;
 `, [cM("horizontal", `
 height: var(--n-scrollbar-height);
 `, [c(">", [cE("scrollbar", `
 height: var(--n-scrollbar-height);
 border-radius: var(--n-scrollbar-border-radius);
 right: 0;
 `)])]), cM("horizontal--top", `
 top: var(--n-scrollbar-rail-top-horizontal-top); 
 right: var(--n-scrollbar-rail-right-horizontal-top); 
 bottom: var(--n-scrollbar-rail-bottom-horizontal-top); 
 left: var(--n-scrollbar-rail-left-horizontal-top); 
 `), cM("horizontal--bottom", `
 top: var(--n-scrollbar-rail-top-horizontal-bottom); 
 right: var(--n-scrollbar-rail-right-horizontal-bottom); 
 bottom: var(--n-scrollbar-rail-bottom-horizontal-bottom); 
 left: var(--n-scrollbar-rail-left-horizontal-bottom); 
 `), cM("vertical", `
 width: var(--n-scrollbar-width);
 `, [c(">", [cE("scrollbar", `
 width: var(--n-scrollbar-width);
 border-radius: var(--n-scrollbar-border-radius);
 bottom: 0;
 `)])]), cM("vertical--left", `
 top: var(--n-scrollbar-rail-top-vertical-left); 
 right: var(--n-scrollbar-rail-right-vertical-left); 
 bottom: var(--n-scrollbar-rail-bottom-vertical-left); 
 left: var(--n-scrollbar-rail-left-vertical-left); 
 `), cM("vertical--right", `
 top: var(--n-scrollbar-rail-top-vertical-right); 
 right: var(--n-scrollbar-rail-right-vertical-right); 
 bottom: var(--n-scrollbar-rail-bottom-vertical-right); 
 left: var(--n-scrollbar-rail-left-vertical-right); 
 `), cM("disabled", [c(">", [cE("scrollbar", "pointer-events: none;")])]), c(">", [cE("scrollbar", `
 z-index: 1;
 position: absolute;
 cursor: pointer;
 pointer-events: all;
 background-color: var(--n-scrollbar-color);
 transition: background-color .2s var(--n-scrollbar-bezier);
 `, [fadeInTransition(), c("&:hover", "background-color: var(--n-scrollbar-color-hover);")])])])])]);
const scrollbarProps = Object.assign(Object.assign({}, useTheme.props), {
  duration: {
    type: Number,
    default: 0
  },
  scrollable: {
    type: Boolean,
    default: true
  },
  xScrollable: Boolean,
  trigger: {
    type: String,
    default: "hover"
  },
  useUnifiedContainer: Boolean,
  triggerDisplayManually: Boolean,
  // If container is set, resize observer won't not attached
  container: Function,
  content: Function,
  containerClass: String,
  containerStyle: [String, Object],
  contentClass: [String, Array],
  contentStyle: [String, Object],
  horizontalRailStyle: [String, Object],
  verticalRailStyle: [String, Object],
  onScroll: Function,
  onWheel: Function,
  onResize: Function,
  internalOnUpdateScrollLeft: Function,
  internalHoistYRail: Boolean,
  yPlacement: {
    type: String,
    default: "right"
  },
  xPlacement: {
    type: String,
    default: "bottom"
  }
});
const Scrollbar = defineComponent({
  name: "Scrollbar",
  props: scrollbarProps,
  inheritAttrs: false,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("Scrollbar", mergedRtlRef, mergedClsPrefixRef);
    const wrapperRef = ref(null);
    const containerRef = ref(null);
    const contentRef = ref(null);
    const yRailRef = ref(null);
    const xRailRef = ref(null);
    const contentHeightRef = ref(null);
    const contentWidthRef = ref(null);
    const containerHeightRef = ref(null);
    const containerWidthRef = ref(null);
    const yRailSizeRef = ref(null);
    const xRailSizeRef = ref(null);
    const containerScrollTopRef = ref(0);
    const containerScrollLeftRef = ref(0);
    const isShowXBarRef = ref(false);
    const isShowYBarRef = ref(false);
    let yBarPressed = false;
    let xBarPressed = false;
    let xBarVanishTimerId;
    let yBarVanishTimerId;
    let memoYTop = 0;
    let memoXLeft = 0;
    let memoMouseX = 0;
    let memoMouseY = 0;
    const isIos = useIsIos();
    const themeRef = useTheme("Scrollbar", "-scrollbar", style$5, scrollbarLight, props, mergedClsPrefixRef);
    const yBarSizeRef = computed(() => {
      const {
        value: containerHeight
      } = containerHeightRef;
      const {
        value: contentHeight
      } = contentHeightRef;
      const {
        value: yRailSize
      } = yRailSizeRef;
      if (containerHeight === null || contentHeight === null || yRailSize === null) {
        return 0;
      } else {
        return Math.min(containerHeight, yRailSize * containerHeight / contentHeight + depx(themeRef.value.self.width) * 1.5);
      }
    });
    const yBarSizePxRef = computed(() => {
      return `${yBarSizeRef.value}px`;
    });
    const xBarSizeRef = computed(() => {
      const {
        value: containerWidth
      } = containerWidthRef;
      const {
        value: contentWidth
      } = contentWidthRef;
      const {
        value: xRailSize
      } = xRailSizeRef;
      if (containerWidth === null || contentWidth === null || xRailSize === null) {
        return 0;
      } else {
        return xRailSize * containerWidth / contentWidth + depx(themeRef.value.self.height) * 1.5;
      }
    });
    const xBarSizePxRef = computed(() => {
      return `${xBarSizeRef.value}px`;
    });
    const yBarTopRef = computed(() => {
      const {
        value: containerHeight
      } = containerHeightRef;
      const {
        value: containerScrollTop
      } = containerScrollTopRef;
      const {
        value: contentHeight
      } = contentHeightRef;
      const {
        value: yRailSize
      } = yRailSizeRef;
      if (containerHeight === null || contentHeight === null || yRailSize === null) {
        return 0;
      } else {
        const heightDiff = contentHeight - containerHeight;
        if (!heightDiff) return 0;
        return containerScrollTop / heightDiff * (yRailSize - yBarSizeRef.value);
      }
    });
    const yBarTopPxRef = computed(() => {
      return `${yBarTopRef.value}px`;
    });
    const xBarLeftRef = computed(() => {
      const {
        value: containerWidth
      } = containerWidthRef;
      const {
        value: containerScrollLeft
      } = containerScrollLeftRef;
      const {
        value: contentWidth
      } = contentWidthRef;
      const {
        value: xRailSize
      } = xRailSizeRef;
      if (containerWidth === null || contentWidth === null || xRailSize === null) {
        return 0;
      } else {
        const widthDiff = contentWidth - containerWidth;
        if (!widthDiff) return 0;
        return containerScrollLeft / widthDiff * (xRailSize - xBarSizeRef.value);
      }
    });
    const xBarLeftPxRef = computed(() => {
      return `${xBarLeftRef.value}px`;
    });
    const needYBarRef = computed(() => {
      const {
        value: containerHeight
      } = containerHeightRef;
      const {
        value: contentHeight
      } = contentHeightRef;
      return containerHeight !== null && contentHeight !== null && contentHeight > containerHeight;
    });
    const needXBarRef = computed(() => {
      const {
        value: containerWidth
      } = containerWidthRef;
      const {
        value: contentWidth
      } = contentWidthRef;
      return containerWidth !== null && contentWidth !== null && contentWidth > containerWidth;
    });
    const mergedShowXBarRef = computed(() => {
      const {
        trigger
      } = props;
      return trigger === "none" || isShowXBarRef.value;
    });
    const mergedShowYBarRef = computed(() => {
      const {
        trigger
      } = props;
      return trigger === "none" || isShowYBarRef.value;
    });
    const mergedContainerRef = computed(() => {
      const {
        container
      } = props;
      if (container) return container();
      return containerRef.value;
    });
    const mergedContentRef = computed(() => {
      const {
        content
      } = props;
      if (content) return content();
      return contentRef.value;
    });
    const scrollTo = (options, y) => {
      if (!props.scrollable) return;
      if (typeof options === "number") {
        scrollToPosition(options, y !== null && y !== undefined ? y : 0, 0, false, "auto");
        return;
      }
      const {
        left,
        top,
        index,
        elSize,
        position,
        behavior,
        el,
        debounce = true
      } = options;
      if (left !== undefined || top !== undefined) {
        scrollToPosition(left !== null && left !== undefined ? left : 0, top !== null && top !== undefined ? top : 0, 0, false, behavior);
      }
      if (el !== undefined) {
        scrollToPosition(0, el.offsetTop, el.offsetHeight, debounce, behavior);
      } else if (index !== undefined && elSize !== undefined) {
        scrollToPosition(0, index * elSize, elSize, debounce, behavior);
      } else if (position === "bottom") {
        scrollToPosition(0, Number.MAX_SAFE_INTEGER, 0, false, behavior);
      } else if (position === "top") {
        scrollToPosition(0, 0, 0, false, behavior);
      }
    };
    const handleContentResize = () => {
      sync();
    };
    const handleContainerResize = (e) => {
      const {
        onResize
      } = props;
      if (onResize) onResize(e);
      sync();
    };
    const scrollBy = (options, y) => {
      if (!props.scrollable) return;
      const {
        value: container
      } = mergedContainerRef;
      if (!container) return;
      if (typeof options === "object") {
        container.scrollBy(options);
      } else {
        container.scrollBy(options, y || 0);
      }
    };
    function scrollToPosition(left, top, elSize, debounce, behavior) {
      const {
        value: container
      } = mergedContainerRef;
      if (!container) return;
      if (debounce) {
        const {
          scrollTop,
          offsetHeight
        } = container;
        if (top > scrollTop) {
          if (top + elSize <= scrollTop + offsetHeight) ;
          else {
            container.scrollTo({
              left,
              top: top + elSize - offsetHeight,
              behavior
            });
          }
          return;
        }
      }
      container.scrollTo({
        left,
        top,
        behavior
      });
    }
    function handleMouseEnterWrapper() {
      showXBar();
      showYBar();
      sync();
    }
    function handleMouseLeaveWrapper() {
      hideBar();
    }
    function hideBar() {
      hideYBar();
      hideXBar();
    }
    function hideYBar() {
      if (yBarVanishTimerId !== undefined) {
        (undefined).clearTimeout(yBarVanishTimerId);
      }
      yBarVanishTimerId = (undefined).setTimeout(() => {
        isShowYBarRef.value = false;
      }, props.duration);
    }
    function hideXBar() {
      if (xBarVanishTimerId !== undefined) {
        (undefined).clearTimeout(xBarVanishTimerId);
      }
      xBarVanishTimerId = (undefined).setTimeout(() => {
        isShowXBarRef.value = false;
      }, props.duration);
    }
    function showXBar() {
      if (xBarVanishTimerId !== undefined) {
        (undefined).clearTimeout(xBarVanishTimerId);
      }
      isShowXBarRef.value = true;
    }
    function showYBar() {
      if (yBarVanishTimerId !== undefined) {
        (undefined).clearTimeout(yBarVanishTimerId);
      }
      isShowYBarRef.value = true;
    }
    function handleScroll(e) {
      const {
        onScroll
      } = props;
      if (onScroll) onScroll(e);
      syncScrollState();
    }
    function syncScrollState() {
      const {
        value: container
      } = mergedContainerRef;
      if (container) {
        containerScrollTopRef.value = container.scrollTop;
        containerScrollLeftRef.value = container.scrollLeft * ((rtlEnabledRef === null || rtlEnabledRef === undefined ? undefined : rtlEnabledRef.value) ? -1 : 1);
      }
    }
    function syncPositionState() {
      const {
        value: content
      } = mergedContentRef;
      if (content) {
        contentHeightRef.value = content.offsetHeight;
        contentWidthRef.value = content.offsetWidth;
      }
      const {
        value: container
      } = mergedContainerRef;
      if (container) {
        containerHeightRef.value = container.offsetHeight;
        containerWidthRef.value = container.offsetWidth;
      }
      const {
        value: xRailEl
      } = xRailRef;
      const {
        value: yRailEl
      } = yRailRef;
      if (xRailEl) {
        xRailSizeRef.value = xRailEl.offsetWidth;
      }
      if (yRailEl) {
        yRailSizeRef.value = yRailEl.offsetHeight;
      }
    }
    function syncUnifiedContainer() {
      const {
        value: container
      } = mergedContainerRef;
      if (container) {
        containerScrollTopRef.value = container.scrollTop;
        containerScrollLeftRef.value = container.scrollLeft * ((rtlEnabledRef === null || rtlEnabledRef === undefined ? undefined : rtlEnabledRef.value) ? -1 : 1);
        containerHeightRef.value = container.offsetHeight;
        containerWidthRef.value = container.offsetWidth;
        contentHeightRef.value = container.scrollHeight;
        contentWidthRef.value = container.scrollWidth;
      }
      const {
        value: xRailEl
      } = xRailRef;
      const {
        value: yRailEl
      } = yRailRef;
      if (xRailEl) {
        xRailSizeRef.value = xRailEl.offsetWidth;
      }
      if (yRailEl) {
        yRailSizeRef.value = yRailEl.offsetHeight;
      }
    }
    function sync() {
      if (!props.scrollable) return;
      if (props.useUnifiedContainer) {
        syncUnifiedContainer();
      } else {
        syncPositionState();
        syncScrollState();
      }
    }
    function isMouseUpAway(e) {
      var _a;
      return !((_a = wrapperRef.value) === null || _a === undefined ? undefined : _a.contains(getPreciseEventTarget(e)));
    }
    function handleXScrollMouseDown(e) {
      e.preventDefault();
      e.stopPropagation();
      xBarPressed = true;
      on("mousemove", undefined, handleXScrollMouseMove, true);
      on("mouseup", undefined, handleXScrollMouseUp, true);
      memoXLeft = containerScrollLeftRef.value;
      memoMouseX = (rtlEnabledRef === null || rtlEnabledRef === undefined ? undefined : rtlEnabledRef.value) ? (undefined).innerWidth - e.clientX : e.clientX;
    }
    function handleXScrollMouseMove(e) {
      if (!xBarPressed) return;
      if (xBarVanishTimerId !== undefined) {
        (undefined).clearTimeout(xBarVanishTimerId);
      }
      if (yBarVanishTimerId !== undefined) {
        (undefined).clearTimeout(yBarVanishTimerId);
      }
      const {
        value: containerWidth
      } = containerWidthRef;
      const {
        value: contentWidth
      } = contentWidthRef;
      const {
        value: xBarSize
      } = xBarSizeRef;
      if (containerWidth === null || contentWidth === null) return;
      const dX = (rtlEnabledRef === null || rtlEnabledRef === undefined ? undefined : rtlEnabledRef.value) ? (undefined).innerWidth - e.clientX - memoMouseX : e.clientX - memoMouseX;
      const dScrollLeft = dX * (contentWidth - containerWidth) / (containerWidth - xBarSize);
      const toScrollLeftUpperBound = contentWidth - containerWidth;
      let toScrollLeft = memoXLeft + dScrollLeft;
      toScrollLeft = Math.min(toScrollLeftUpperBound, toScrollLeft);
      toScrollLeft = Math.max(toScrollLeft, 0);
      const {
        value: container
      } = mergedContainerRef;
      if (container) {
        container.scrollLeft = toScrollLeft * ((rtlEnabledRef === null || rtlEnabledRef === undefined ? undefined : rtlEnabledRef.value) ? -1 : 1);
        const {
          internalOnUpdateScrollLeft
        } = props;
        if (internalOnUpdateScrollLeft) internalOnUpdateScrollLeft(toScrollLeft);
      }
    }
    function handleXScrollMouseUp(e) {
      e.preventDefault();
      e.stopPropagation();
      off("mousemove", undefined, handleXScrollMouseMove, true);
      off("mouseup", undefined, handleXScrollMouseUp, true);
      xBarPressed = false;
      sync();
      if (isMouseUpAway(e)) {
        hideBar();
      }
    }
    function handleYScrollMouseDown(e) {
      e.preventDefault();
      e.stopPropagation();
      yBarPressed = true;
      on("mousemove", undefined, handleYScrollMouseMove, true);
      on("mouseup", undefined, handleYScrollMouseUp, true);
      memoYTop = containerScrollTopRef.value;
      memoMouseY = e.clientY;
    }
    function handleYScrollMouseMove(e) {
      if (!yBarPressed) return;
      if (xBarVanishTimerId !== undefined) {
        (undefined).clearTimeout(xBarVanishTimerId);
      }
      if (yBarVanishTimerId !== undefined) {
        (undefined).clearTimeout(yBarVanishTimerId);
      }
      const {
        value: containerHeight
      } = containerHeightRef;
      const {
        value: contentHeight
      } = contentHeightRef;
      const {
        value: yBarSize
      } = yBarSizeRef;
      if (containerHeight === null || contentHeight === null) return;
      const dY = e.clientY - memoMouseY;
      const dScrollTop = dY * (contentHeight - containerHeight) / (containerHeight - yBarSize);
      const toScrollTopUpperBound = contentHeight - containerHeight;
      let toScrollTop = memoYTop + dScrollTop;
      toScrollTop = Math.min(toScrollTopUpperBound, toScrollTop);
      toScrollTop = Math.max(toScrollTop, 0);
      const {
        value: container
      } = mergedContainerRef;
      if (container) {
        container.scrollTop = toScrollTop;
      }
    }
    function handleYScrollMouseUp(e) {
      e.preventDefault();
      e.stopPropagation();
      off("mousemove", undefined, handleYScrollMouseMove, true);
      off("mouseup", undefined, handleYScrollMouseUp, true);
      yBarPressed = false;
      sync();
      if (isMouseUpAway(e)) {
        hideBar();
      }
    }
    watchEffect(() => {
      const {
        value: needXBar
      } = needXBarRef;
      const {
        value: needYBar
      } = needYBarRef;
      const {
        value: mergedClsPrefix
      } = mergedClsPrefixRef;
      const {
        value: xRailEl
      } = xRailRef;
      const {
        value: yRailEl
      } = yRailRef;
      if (xRailEl) {
        if (!needXBar) {
          xRailEl.classList.add(`${mergedClsPrefix}-scrollbar-rail--disabled`);
        } else {
          xRailEl.classList.remove(`${mergedClsPrefix}-scrollbar-rail--disabled`);
        }
      }
      if (yRailEl) {
        if (!needYBar) {
          yRailEl.classList.add(`${mergedClsPrefix}-scrollbar-rail--disabled`);
        } else {
          yRailEl.classList.remove(`${mergedClsPrefix}-scrollbar-rail--disabled`);
        }
      }
    });
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut: cubicBezierEaseInOut2
        },
        self: {
          color,
          colorHover,
          height,
          width,
          borderRadius,
          railInsetHorizontalTop,
          railInsetHorizontalBottom,
          railInsetVerticalRight,
          railInsetVerticalLeft,
          railColor
        }
      } = themeRef.value;
      const {
        top: railTopHorizontalTop,
        right: railRightHorizontalTop,
        bottom: railBottomHorizontalTop,
        left: railLeftHorizontalTop
      } = getPadding(railInsetHorizontalTop);
      const {
        top: railTopHorizontalBottom,
        right: railRightHorizontalBottom,
        bottom: railBottomHorizontalBottom,
        left: railLeftHorizontalBottom
      } = getPadding(railInsetHorizontalBottom);
      const {
        top: railTopVerticalRight,
        right: railRightVerticalRight,
        bottom: railBottomVerticalRight,
        left: railLeftVerticalRight
      } = getPadding((rtlEnabledRef === null || rtlEnabledRef === undefined ? undefined : rtlEnabledRef.value) ? rtlInset(railInsetVerticalRight) : railInsetVerticalRight);
      const {
        top: railTopVerticalLeft,
        right: railRightVerticalLeft,
        bottom: railBottomVerticalLeft,
        left: railLeftVerticalLeft
      } = getPadding((rtlEnabledRef === null || rtlEnabledRef === undefined ? undefined : rtlEnabledRef.value) ? rtlInset(railInsetVerticalLeft) : railInsetVerticalLeft);
      return {
        "--n-scrollbar-bezier": cubicBezierEaseInOut2,
        "--n-scrollbar-color": color,
        "--n-scrollbar-color-hover": colorHover,
        "--n-scrollbar-border-radius": borderRadius,
        "--n-scrollbar-width": width,
        "--n-scrollbar-height": height,
        "--n-scrollbar-rail-top-horizontal-top": railTopHorizontalTop,
        "--n-scrollbar-rail-right-horizontal-top": railRightHorizontalTop,
        "--n-scrollbar-rail-bottom-horizontal-top": railBottomHorizontalTop,
        "--n-scrollbar-rail-left-horizontal-top": railLeftHorizontalTop,
        "--n-scrollbar-rail-top-horizontal-bottom": railTopHorizontalBottom,
        "--n-scrollbar-rail-right-horizontal-bottom": railRightHorizontalBottom,
        "--n-scrollbar-rail-bottom-horizontal-bottom": railBottomHorizontalBottom,
        "--n-scrollbar-rail-left-horizontal-bottom": railLeftHorizontalBottom,
        "--n-scrollbar-rail-top-vertical-right": railTopVerticalRight,
        "--n-scrollbar-rail-right-vertical-right": railRightVerticalRight,
        "--n-scrollbar-rail-bottom-vertical-right": railBottomVerticalRight,
        "--n-scrollbar-rail-left-vertical-right": railLeftVerticalRight,
        "--n-scrollbar-rail-top-vertical-left": railTopVerticalLeft,
        "--n-scrollbar-rail-right-vertical-left": railRightVerticalLeft,
        "--n-scrollbar-rail-bottom-vertical-left": railBottomVerticalLeft,
        "--n-scrollbar-rail-left-vertical-left": railLeftVerticalLeft,
        "--n-scrollbar-rail-color": railColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("scrollbar", undefined, cssVarsRef, props) : undefined;
    const exposedMethods = {
      scrollTo,
      scrollBy,
      sync,
      syncUnifiedContainer,
      handleMouseEnterWrapper,
      handleMouseLeaveWrapper
    };
    return Object.assign(Object.assign({}, exposedMethods), {
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      containerScrollTop: containerScrollTopRef,
      wrapperRef,
      containerRef,
      contentRef,
      yRailRef,
      xRailRef,
      needYBar: needYBarRef,
      needXBar: needXBarRef,
      yBarSizePx: yBarSizePxRef,
      xBarSizePx: xBarSizePxRef,
      yBarTopPx: yBarTopPxRef,
      xBarLeftPx: xBarLeftPxRef,
      isShowXBar: mergedShowXBarRef,
      isShowYBar: mergedShowYBarRef,
      isIos,
      handleScroll,
      handleContentResize,
      handleContainerResize,
      handleYScrollMouseDown,
      handleXScrollMouseDown,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    });
  },
  render() {
    var _a;
    const {
      $slots,
      mergedClsPrefix,
      triggerDisplayManually,
      rtlEnabled,
      internalHoistYRail,
      yPlacement,
      xPlacement,
      xScrollable
    } = this;
    if (!this.scrollable) return (_a = $slots.default) === null || _a === undefined ? undefined : _a.call($slots);
    const triggerIsNone = this.trigger === "none";
    const createYRail = (className, style2) => {
      return h("div", {
        ref: "yRailRef",
        class: [`${mergedClsPrefix}-scrollbar-rail`, `${mergedClsPrefix}-scrollbar-rail--vertical`, `${mergedClsPrefix}-scrollbar-rail--vertical--${yPlacement}`, className],
        "data-scrollbar-rail": true,
        style: [style2 || "", this.verticalRailStyle],
        "aria-hidden": true
      }, h(triggerIsNone ? Wrapper : Transition, triggerIsNone ? null : {
        name: "fade-in-transition"
      }, {
        default: () => this.needYBar && this.isShowYBar && !this.isIos ? h("div", {
          class: `${mergedClsPrefix}-scrollbar-rail__scrollbar`,
          style: {
            height: this.yBarSizePx,
            top: this.yBarTopPx
          },
          onMousedown: this.handleYScrollMouseDown
        }) : null
      }));
    };
    const createChildren = () => {
      var _a2, _b;
      (_a2 = this.onRender) === null || _a2 === undefined ? undefined : _a2.call(this);
      return h("div", mergeProps(this.$attrs, {
        role: "none",
        ref: "wrapperRef",
        class: [`${mergedClsPrefix}-scrollbar`, this.themeClass, rtlEnabled && `${mergedClsPrefix}-scrollbar--rtl`],
        style: this.cssVars,
        onMouseenter: triggerDisplayManually ? undefined : this.handleMouseEnterWrapper,
        onMouseleave: triggerDisplayManually ? undefined : this.handleMouseLeaveWrapper
      }), [this.container ? (_b = $slots.default) === null || _b === undefined ? undefined : _b.call($slots) : h("div", {
        role: "none",
        ref: "containerRef",
        class: [`${mergedClsPrefix}-scrollbar-container`, this.containerClass],
        style: this.containerStyle,
        onScroll: this.handleScroll,
        onWheel: this.onWheel
      }, h(VResizeObserver, {
        onResize: this.handleContentResize
      }, {
        default: () => h("div", {
          ref: "contentRef",
          role: "none",
          style: [{
            width: this.xScrollable ? "fit-content" : null
          }, this.contentStyle],
          class: [`${mergedClsPrefix}-scrollbar-content`, this.contentClass]
        }, $slots)
      })), internalHoistYRail ? null : createYRail(undefined, undefined), xScrollable && h("div", {
        ref: "xRailRef",
        class: [`${mergedClsPrefix}-scrollbar-rail`, `${mergedClsPrefix}-scrollbar-rail--horizontal`, `${mergedClsPrefix}-scrollbar-rail--horizontal--${xPlacement}`],
        style: this.horizontalRailStyle,
        "data-scrollbar-rail": true,
        "aria-hidden": true
      }, h(triggerIsNone ? Wrapper : Transition, triggerIsNone ? null : {
        name: "fade-in-transition"
      }, {
        default: () => this.needXBar && this.isShowXBar && !this.isIos ? h("div", {
          class: `${mergedClsPrefix}-scrollbar-rail__scrollbar`,
          style: {
            width: this.xBarSizePx,
            right: rtlEnabled ? this.xBarLeftPx : undefined,
            left: rtlEnabled ? undefined : this.xBarLeftPx
          },
          onMousedown: this.handleXScrollMouseDown
        }) : null
      }))]);
    };
    const scrollbarNode = this.container ? createChildren() : h(VResizeObserver, {
      onResize: this.handleContainerResize
    }, {
      default: createChildren
    });
    if (internalHoistYRail) {
      return h(Fragment, null, scrollbarNode, createYRail(this.themeClass, this.cssVars));
    } else {
      return scrollbarNode;
    }
  }
});
const XScrollbar = Scrollbar;
const commonVars$c = {
  iconSizeTiny: "28px",
  iconSizeSmall: "34px",
  iconSizeMedium: "40px",
  iconSizeLarge: "46px",
  iconSizeHuge: "52px"
};
function self$P(vars) {
  const {
    textColorDisabled,
    iconColor,
    textColor2,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    fontSizeHuge
  } = vars;
  return Object.assign(Object.assign({}, commonVars$c), {
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    fontSizeHuge,
    textColor: textColorDisabled,
    iconColor,
    extraTextColor: textColor2
  });
}
const emptyLight = {
  name: "Empty",
  common: derived,
  self: self$P
};
const emptyDark = {
  name: "Empty",
  common: derived$1,
  self: self$P
};
const commonVariables$m = {
  height: "calc(var(--n-option-height) * 7.6)",
  paddingTiny: "4px 0",
  paddingSmall: "4px 0",
  paddingMedium: "4px 0",
  paddingLarge: "4px 0",
  paddingHuge: "4px 0",
  optionPaddingTiny: "0 12px",
  optionPaddingSmall: "0 12px",
  optionPaddingMedium: "0 12px",
  optionPaddingLarge: "0 12px",
  optionPaddingHuge: "0 12px",
  loadingSize: "18px"
};
function self$O(vars) {
  const {
    borderRadius,
    popoverColor,
    textColor3,
    dividerColor,
    textColor2,
    primaryColorPressed,
    textColorDisabled,
    primaryColor,
    opacityDisabled,
    hoverColor,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    fontSizeHuge,
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    heightHuge
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$m), {
    optionFontSizeTiny: fontSizeTiny,
    optionFontSizeSmall: fontSizeSmall,
    optionFontSizeMedium: fontSizeMedium,
    optionFontSizeLarge: fontSizeLarge,
    optionFontSizeHuge: fontSizeHuge,
    optionHeightTiny: heightTiny,
    optionHeightSmall: heightSmall,
    optionHeightMedium: heightMedium,
    optionHeightLarge: heightLarge,
    optionHeightHuge: heightHuge,
    borderRadius,
    color: popoverColor,
    groupHeaderTextColor: textColor3,
    actionDividerColor: dividerColor,
    optionTextColor: textColor2,
    optionTextColorPressed: primaryColorPressed,
    optionTextColorDisabled: textColorDisabled,
    optionTextColorActive: primaryColor,
    optionOpacityDisabled: opacityDisabled,
    optionCheckColor: primaryColor,
    optionColorPending: hoverColor,
    optionColorActive: "rgba(0, 0, 0, 0)",
    optionColorActivePending: hoverColor,
    actionTextColor: textColor2,
    loadingColor: primaryColor
  });
}
const internalSelectMenuLight = createTheme({
  name: "InternalSelectMenu",
  common: derived,
  peers: {
    Scrollbar: scrollbarLight,
    Empty: emptyLight
  },
  self: self$O
});
const internalSelectMenuDark = {
  name: "InternalSelectMenu",
  common: derived$1,
  peers: {
    Scrollbar: scrollbarDark,
    Empty: emptyDark
  },
  self: self$O
};
const {
  cubicBezierEaseIn,
  cubicBezierEaseOut
} = commonVariables$n;
function fadeInScaleUpTransition({
  transformOrigin = "inherit",
  duration: duration2 = ".2s",
  enterScale = ".9",
  originalTransform = "",
  originalTransition = ""
} = {}) {
  return [c("&.fade-in-scale-up-transition-leave-active", {
    transformOrigin,
    transition: `opacity ${duration2} ${cubicBezierEaseIn}, transform ${duration2} ${cubicBezierEaseIn} ${originalTransition && `,${originalTransition}`}`
  }), c("&.fade-in-scale-up-transition-enter-active", {
    transformOrigin,
    transition: `opacity ${duration2} ${cubicBezierEaseOut}, transform ${duration2} ${cubicBezierEaseOut} ${originalTransition && `,${originalTransition}`}`
  }), c("&.fade-in-scale-up-transition-enter-from, &.fade-in-scale-up-transition-leave-to", {
    opacity: 0,
    transform: `${originalTransform} scale(${enterScale})`
  }), c("&.fade-in-scale-up-transition-leave-from, &.fade-in-scale-up-transition-enter-to", {
    opacity: 1,
    transform: `${originalTransform} scale(1)`
  })];
}
const commonVariables$l = {
  space: "6px",
  spaceArrow: "10px",
  arrowOffset: "10px",
  arrowOffsetVertical: "10px",
  arrowHeight: "6px",
  padding: "8px 14px"
};
function self$N(vars) {
  const {
    boxShadow2,
    popoverColor,
    textColor2,
    borderRadius,
    fontSize: fontSize2,
    dividerColor
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$l), {
    fontSize: fontSize2,
    borderRadius,
    color: popoverColor,
    dividerColor,
    textColor: textColor2,
    boxShadow: boxShadow2
  });
}
const popoverLight = {
  name: "Popover",
  common: derived,
  self: self$N
};
const popoverDark = {
  name: "Popover",
  common: derived$1,
  self: self$N
};
const commonVariables$k = {
  closeIconSizeTiny: "12px",
  closeIconSizeSmall: "12px",
  closeIconSizeMedium: "14px",
  closeIconSizeLarge: "14px",
  closeSizeTiny: "16px",
  closeSizeSmall: "16px",
  closeSizeMedium: "18px",
  closeSizeLarge: "18px",
  padding: "0 7px",
  closeMargin: "0 0 0 4px"
};
const tagDark = {
  name: "Tag",
  common: derived$1,
  self(vars) {
    const {
      textColor2,
      primaryColorHover,
      primaryColorPressed,
      primaryColor,
      infoColor,
      successColor,
      warningColor,
      errorColor,
      baseColor,
      borderColor,
      tagColor,
      opacityDisabled,
      closeIconColor,
      closeIconColorHover,
      closeIconColorPressed,
      closeColorHover,
      closeColorPressed,
      borderRadiusSmall: borderRadius,
      fontSizeMini,
      fontSizeTiny,
      fontSizeSmall,
      fontSizeMedium,
      heightMini,
      heightTiny,
      heightSmall,
      heightMedium,
      buttonColor2Hover,
      buttonColor2Pressed,
      fontWeightStrong
    } = vars;
    return Object.assign(Object.assign({}, commonVariables$k), {
      closeBorderRadius: borderRadius,
      heightTiny: heightMini,
      heightSmall: heightTiny,
      heightMedium: heightSmall,
      heightLarge: heightMedium,
      borderRadius,
      opacityDisabled,
      fontSizeTiny: fontSizeMini,
      fontSizeSmall: fontSizeTiny,
      fontSizeMedium: fontSizeSmall,
      fontSizeLarge: fontSizeMedium,
      fontWeightStrong,
      // checked
      textColorCheckable: textColor2,
      textColorHoverCheckable: textColor2,
      textColorPressedCheckable: textColor2,
      textColorChecked: baseColor,
      colorCheckable: "#0000",
      colorHoverCheckable: buttonColor2Hover,
      colorPressedCheckable: buttonColor2Pressed,
      colorChecked: primaryColor,
      colorCheckedHover: primaryColorHover,
      colorCheckedPressed: primaryColorPressed,
      // default
      border: `1px solid ${borderColor}`,
      textColor: textColor2,
      color: tagColor,
      colorBordered: "#0000",
      closeIconColor,
      closeIconColorHover,
      closeIconColorPressed,
      closeColorHover,
      closeColorPressed,
      borderPrimary: `1px solid ${changeColor(primaryColor, {
        alpha: 0.3
      })}`,
      textColorPrimary: primaryColor,
      colorPrimary: changeColor(primaryColor, {
        alpha: 0.16
      }),
      colorBorderedPrimary: "#0000",
      closeIconColorPrimary: scaleColor(primaryColor, {
        lightness: 0.7
      }),
      closeIconColorHoverPrimary: scaleColor(primaryColor, {
        lightness: 0.7
      }),
      closeIconColorPressedPrimary: scaleColor(primaryColor, {
        lightness: 0.7
      }),
      closeColorHoverPrimary: changeColor(primaryColor, {
        alpha: 0.16
      }),
      closeColorPressedPrimary: changeColor(primaryColor, {
        alpha: 0.12
      }),
      borderInfo: `1px solid ${changeColor(infoColor, {
        alpha: 0.3
      })}`,
      textColorInfo: infoColor,
      colorInfo: changeColor(infoColor, {
        alpha: 0.16
      }),
      colorBorderedInfo: "#0000",
      closeIconColorInfo: scaleColor(infoColor, {
        alpha: 0.7
      }),
      closeIconColorHoverInfo: scaleColor(infoColor, {
        alpha: 0.7
      }),
      closeIconColorPressedInfo: scaleColor(infoColor, {
        alpha: 0.7
      }),
      closeColorHoverInfo: changeColor(infoColor, {
        alpha: 0.16
      }),
      closeColorPressedInfo: changeColor(infoColor, {
        alpha: 0.12
      }),
      borderSuccess: `1px solid ${changeColor(successColor, {
        alpha: 0.3
      })}`,
      textColorSuccess: successColor,
      colorSuccess: changeColor(successColor, {
        alpha: 0.16
      }),
      colorBorderedSuccess: "#0000",
      closeIconColorSuccess: scaleColor(successColor, {
        alpha: 0.7
      }),
      closeIconColorHoverSuccess: scaleColor(successColor, {
        alpha: 0.7
      }),
      closeIconColorPressedSuccess: scaleColor(successColor, {
        alpha: 0.7
      }),
      closeColorHoverSuccess: changeColor(successColor, {
        alpha: 0.16
      }),
      closeColorPressedSuccess: changeColor(successColor, {
        alpha: 0.12
      }),
      borderWarning: `1px solid ${changeColor(warningColor, {
        alpha: 0.3
      })}`,
      textColorWarning: warningColor,
      colorWarning: changeColor(warningColor, {
        alpha: 0.16
      }),
      colorBorderedWarning: "#0000",
      closeIconColorWarning: scaleColor(warningColor, {
        alpha: 0.7
      }),
      closeIconColorHoverWarning: scaleColor(warningColor, {
        alpha: 0.7
      }),
      closeIconColorPressedWarning: scaleColor(warningColor, {
        alpha: 0.7
      }),
      closeColorHoverWarning: changeColor(warningColor, {
        alpha: 0.16
      }),
      closeColorPressedWarning: changeColor(warningColor, {
        alpha: 0.11
      }),
      borderError: `1px solid ${changeColor(errorColor, {
        alpha: 0.3
      })}`,
      textColorError: errorColor,
      colorError: changeColor(errorColor, {
        alpha: 0.16
      }),
      colorBorderedError: "#0000",
      closeIconColorError: scaleColor(errorColor, {
        alpha: 0.7
      }),
      closeIconColorHoverError: scaleColor(errorColor, {
        alpha: 0.7
      }),
      closeIconColorPressedError: scaleColor(errorColor, {
        alpha: 0.7
      }),
      closeColorHoverError: changeColor(errorColor, {
        alpha: 0.16
      }),
      closeColorPressedError: changeColor(errorColor, {
        alpha: 0.12
      })
    });
  }
};
const commonVariables$j = {
  paddingSingle: "0 26px 0 12px",
  paddingMultiple: "3px 26px 0 12px",
  clearSize: "16px",
  arrowSize: "16px"
};
const internalSelectionDark = {
  name: "InternalSelection",
  common: derived$1,
  peers: {
    Popover: popoverDark
  },
  self(vars) {
    const {
      borderRadius,
      textColor2,
      textColorDisabled,
      inputColor,
      inputColorDisabled,
      primaryColor,
      primaryColorHover,
      warningColor,
      warningColorHover,
      errorColor,
      errorColorHover,
      iconColor,
      iconColorDisabled,
      clearColor,
      clearColorHover,
      clearColorPressed,
      placeholderColor,
      placeholderColorDisabled,
      fontSizeTiny,
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      heightTiny,
      heightSmall,
      heightMedium,
      heightLarge,
      fontWeight
    } = vars;
    return Object.assign(Object.assign({}, commonVariables$j), {
      fontWeight,
      fontSizeTiny,
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      heightTiny,
      heightSmall,
      heightMedium,
      heightLarge,
      borderRadius,
      // default
      textColor: textColor2,
      textColorDisabled,
      placeholderColor,
      placeholderColorDisabled,
      color: inputColor,
      colorDisabled: inputColorDisabled,
      colorActive: changeColor(primaryColor, {
        alpha: 0.1
      }),
      border: "1px solid #0000",
      borderHover: `1px solid ${primaryColorHover}`,
      borderActive: `1px solid ${primaryColor}`,
      borderFocus: `1px solid ${primaryColorHover}`,
      boxShadowHover: "none",
      boxShadowActive: `0 0 8px 0 ${changeColor(primaryColor, {
        alpha: 0.4
      })}`,
      boxShadowFocus: `0 0 8px 0 ${changeColor(primaryColor, {
        alpha: 0.4
      })}`,
      caretColor: primaryColor,
      arrowColor: iconColor,
      arrowColorDisabled: iconColorDisabled,
      loadingColor: primaryColor,
      // warning
      borderWarning: `1px solid ${warningColor}`,
      borderHoverWarning: `1px solid ${warningColorHover}`,
      borderActiveWarning: `1px solid ${warningColor}`,
      borderFocusWarning: `1px solid ${warningColorHover}`,
      boxShadowHoverWarning: "none",
      boxShadowActiveWarning: `0 0 8px 0 ${changeColor(warningColor, {
        alpha: 0.4
      })}`,
      boxShadowFocusWarning: `0 0 8px 0 ${changeColor(warningColor, {
        alpha: 0.4
      })}`,
      colorActiveWarning: changeColor(warningColor, {
        alpha: 0.1
      }),
      caretColorWarning: warningColor,
      // error
      borderError: `1px solid ${errorColor}`,
      borderHoverError: `1px solid ${errorColorHover}`,
      borderActiveError: `1px solid ${errorColor}`,
      borderFocusError: `1px solid ${errorColorHover}`,
      boxShadowHoverError: "none",
      boxShadowActiveError: `0 0 8px 0 ${changeColor(errorColor, {
        alpha: 0.4
      })}`,
      boxShadowFocusError: `0 0 8px 0 ${changeColor(errorColor, {
        alpha: 0.4
      })}`,
      colorActiveError: changeColor(errorColor, {
        alpha: 0.1
      }),
      caretColorError: errorColor,
      clearColor,
      clearColorHover,
      clearColorPressed
    });
  }
};
function self$M(vars) {
  const {
    borderRadius,
    textColor2,
    textColorDisabled,
    inputColor,
    inputColorDisabled,
    primaryColor,
    primaryColorHover,
    warningColor,
    warningColorHover,
    errorColor,
    errorColorHover,
    borderColor,
    iconColor,
    iconColorDisabled,
    clearColor,
    clearColorHover,
    clearColorPressed,
    placeholderColor,
    placeholderColorDisabled,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    fontWeight
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$j), {
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    borderRadius,
    fontWeight,
    // default
    textColor: textColor2,
    textColorDisabled,
    placeholderColor,
    placeholderColorDisabled,
    color: inputColor,
    colorDisabled: inputColorDisabled,
    colorActive: inputColor,
    border: `1px solid ${borderColor}`,
    borderHover: `1px solid ${primaryColorHover}`,
    borderActive: `1px solid ${primaryColor}`,
    borderFocus: `1px solid ${primaryColorHover}`,
    boxShadowHover: "none",
    boxShadowActive: `0 0 0 2px ${changeColor(primaryColor, {
      alpha: 0.2
    })}`,
    boxShadowFocus: `0 0 0 2px ${changeColor(primaryColor, {
      alpha: 0.2
    })}`,
    caretColor: primaryColor,
    arrowColor: iconColor,
    arrowColorDisabled: iconColorDisabled,
    loadingColor: primaryColor,
    // warning
    borderWarning: `1px solid ${warningColor}`,
    borderHoverWarning: `1px solid ${warningColorHover}`,
    borderActiveWarning: `1px solid ${warningColor}`,
    borderFocusWarning: `1px solid ${warningColorHover}`,
    boxShadowHoverWarning: "none",
    boxShadowActiveWarning: `0 0 0 2px ${changeColor(warningColor, {
      alpha: 0.2
    })}`,
    boxShadowFocusWarning: `0 0 0 2px ${changeColor(warningColor, {
      alpha: 0.2
    })}`,
    colorActiveWarning: inputColor,
    caretColorWarning: warningColor,
    // error
    borderError: `1px solid ${errorColor}`,
    borderHoverError: `1px solid ${errorColorHover}`,
    borderActiveError: `1px solid ${errorColor}`,
    borderFocusError: `1px solid ${errorColorHover}`,
    boxShadowHoverError: "none",
    boxShadowActiveError: `0 0 0 2px ${changeColor(errorColor, {
      alpha: 0.2
    })}`,
    boxShadowFocusError: `0 0 0 2px ${changeColor(errorColor, {
      alpha: 0.2
    })}`,
    colorActiveError: inputColor,
    caretColorError: errorColor,
    clearColor,
    clearColorHover,
    clearColorPressed
  });
}
const internalSelectionLight = createTheme({
  name: "InternalSelection",
  common: derived,
  peers: {
    Popover: popoverLight
  },
  self: self$M
});
const {
  cubicBezierEaseInOut
} = commonVariables$n;
function fadeInWidthExpandTransition({
  duration: duration2 = ".2s",
  delay = ".1s"
} = {}) {
  return [c("&.fade-in-width-expand-transition-leave-from, &.fade-in-width-expand-transition-enter-to", {
    opacity: 1
  }), c("&.fade-in-width-expand-transition-leave-to, &.fade-in-width-expand-transition-enter-from", `
 opacity: 0!important;
 margin-left: 0!important;
 margin-right: 0!important;
 `), c("&.fade-in-width-expand-transition-leave-active", `
 overflow: hidden;
 transition:
 opacity ${duration2} ${cubicBezierEaseInOut},
 max-width ${duration2} ${cubicBezierEaseInOut} ${delay},
 margin-left ${duration2} ${cubicBezierEaseInOut} ${delay},
 margin-right ${duration2} ${cubicBezierEaseInOut} ${delay};
 `), c("&.fade-in-width-expand-transition-enter-active", `
 overflow: hidden;
 transition:
 opacity ${duration2} ${cubicBezierEaseInOut} ${delay},
 max-width ${duration2} ${cubicBezierEaseInOut},
 margin-left ${duration2} ${cubicBezierEaseInOut},
 margin-right ${duration2} ${cubicBezierEaseInOut};
 `)];
}
const style$4 = cB("base-wave", `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
`);
const NBaseWave = defineComponent({
  name: "BaseWave",
  props: {
    clsPrefix: {
      type: String,
      required: true
    }
  },
  setup(props) {
    useStyle("-base-wave", style$4, toRef(props, "clsPrefix"));
    const selfRef = ref(null);
    const activeRef = ref(false);
    let animationTimerId = null;
    return {
      active: activeRef,
      selfRef,
      play() {
        if (animationTimerId !== null) {
          (undefined).clearTimeout(animationTimerId);
          activeRef.value = false;
          animationTimerId = null;
        }
        void nextTick(() => {
          var _a;
          void ((_a = selfRef.value) === null || _a === undefined ? undefined : _a.offsetHeight);
          activeRef.value = true;
          animationTimerId = (undefined).setTimeout(() => {
            activeRef.value = false;
            animationTimerId = null;
          }, 1e3);
        });
      }
    };
  },
  render() {
    const {
      clsPrefix
    } = this;
    return h("div", {
      ref: "selfRef",
      "aria-hidden": true,
      class: [`${clsPrefix}-base-wave`, this.active && `${clsPrefix}-base-wave--active`]
    });
  }
});
const commonVars$b = {
  iconMargin: "11px 8px 0 12px",
  iconMarginRtl: "11px 12px 0 8px",
  iconSize: "24px",
  closeIconSize: "16px",
  closeSize: "20px",
  closeMargin: "13px 14px 0 0",
  closeMarginRtl: "13px 0 0 14px",
  padding: "13px"
};
const alertDark = {
  name: "Alert",
  common: derived$1,
  self(vars) {
    const {
      lineHeight: lineHeight2,
      borderRadius,
      fontWeightStrong,
      dividerColor,
      inputColor,
      textColor1,
      textColor2,
      closeColorHover,
      closeColorPressed,
      closeIconColor,
      closeIconColorHover,
      closeIconColorPressed,
      infoColorSuppl,
      successColorSuppl,
      warningColorSuppl,
      errorColorSuppl,
      fontSize: fontSize2
    } = vars;
    return Object.assign(Object.assign({}, commonVars$b), {
      fontSize: fontSize2,
      lineHeight: lineHeight2,
      titleFontWeight: fontWeightStrong,
      borderRadius,
      border: `1px solid ${dividerColor}`,
      color: inputColor,
      titleTextColor: textColor1,
      iconColor: textColor2,
      contentTextColor: textColor2,
      closeBorderRadius: borderRadius,
      closeColorHover,
      closeColorPressed,
      closeIconColor,
      closeIconColorHover,
      closeIconColorPressed,
      borderInfo: `1px solid ${changeColor(infoColorSuppl, {
        alpha: 0.35
      })}`,
      colorInfo: changeColor(infoColorSuppl, {
        alpha: 0.25
      }),
      titleTextColorInfo: textColor1,
      iconColorInfo: infoColorSuppl,
      contentTextColorInfo: textColor2,
      closeColorHoverInfo: closeColorHover,
      closeColorPressedInfo: closeColorPressed,
      closeIconColorInfo: closeIconColor,
      closeIconColorHoverInfo: closeIconColorHover,
      closeIconColorPressedInfo: closeIconColorPressed,
      borderSuccess: `1px solid ${changeColor(successColorSuppl, {
        alpha: 0.35
      })}`,
      colorSuccess: changeColor(successColorSuppl, {
        alpha: 0.25
      }),
      titleTextColorSuccess: textColor1,
      iconColorSuccess: successColorSuppl,
      contentTextColorSuccess: textColor2,
      closeColorHoverSuccess: closeColorHover,
      closeColorPressedSuccess: closeColorPressed,
      closeIconColorSuccess: closeIconColor,
      closeIconColorHoverSuccess: closeIconColorHover,
      closeIconColorPressedSuccess: closeIconColorPressed,
      borderWarning: `1px solid ${changeColor(warningColorSuppl, {
        alpha: 0.35
      })}`,
      colorWarning: changeColor(warningColorSuppl, {
        alpha: 0.25
      }),
      titleTextColorWarning: textColor1,
      iconColorWarning: warningColorSuppl,
      contentTextColorWarning: textColor2,
      closeColorHoverWarning: closeColorHover,
      closeColorPressedWarning: closeColorPressed,
      closeIconColorWarning: closeIconColor,
      closeIconColorHoverWarning: closeIconColorHover,
      closeIconColorPressedWarning: closeIconColorPressed,
      borderError: `1px solid ${changeColor(errorColorSuppl, {
        alpha: 0.35
      })}`,
      colorError: changeColor(errorColorSuppl, {
        alpha: 0.25
      }),
      titleTextColorError: textColor1,
      iconColorError: errorColorSuppl,
      contentTextColorError: textColor2,
      closeColorHoverError: closeColorHover,
      closeColorPressedError: closeColorPressed,
      closeIconColorError: closeIconColor,
      closeIconColorHoverError: closeIconColorHover,
      closeIconColorPressedError: closeIconColorPressed
    });
  }
};
const commonVars$a = {
  linkFontSize: "13px",
  linkPadding: "0 0 0 16px",
  railWidth: "4px"
};
function self$L(vars) {
  const {
    borderRadius,
    railColor,
    primaryColor,
    primaryColorHover,
    primaryColorPressed,
    textColor2
  } = vars;
  return Object.assign(Object.assign({}, commonVars$a), {
    borderRadius,
    railColor,
    railColorActive: primaryColor,
    linkColor: changeColor(primaryColor, {
      alpha: 0.15
    }),
    linkTextColor: textColor2,
    linkTextColorHover: primaryColorHover,
    linkTextColorPressed: primaryColorPressed,
    linkTextColorActive: primaryColor
  });
}
const anchorDark = {
  name: "Anchor",
  common: derived$1,
  self: self$L
};
const commonVariables$i = {
  paddingTiny: "0 8px",
  paddingSmall: "0 10px",
  paddingMedium: "0 12px",
  paddingLarge: "0 14px",
  clearSize: "16px"
};
const inputDark = {
  name: "Input",
  common: derived$1,
  self(vars) {
    const {
      textColor2,
      textColor3,
      textColorDisabled,
      primaryColor,
      primaryColorHover,
      inputColor,
      inputColorDisabled,
      warningColor,
      warningColorHover,
      errorColor,
      errorColorHover,
      borderRadius,
      lineHeight: lineHeight2,
      fontSizeTiny,
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      heightTiny,
      heightSmall,
      heightMedium,
      heightLarge,
      clearColor,
      clearColorHover,
      clearColorPressed,
      placeholderColor,
      placeholderColorDisabled,
      iconColor,
      iconColorDisabled,
      iconColorHover,
      iconColorPressed,
      fontWeight
    } = vars;
    return Object.assign(Object.assign({}, commonVariables$i), {
      fontWeight,
      countTextColorDisabled: textColorDisabled,
      countTextColor: textColor3,
      heightTiny,
      heightSmall,
      heightMedium,
      heightLarge,
      fontSizeTiny,
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      lineHeight: lineHeight2,
      lineHeightTextarea: lineHeight2,
      borderRadius,
      iconSize: "16px",
      groupLabelColor: inputColor,
      textColor: textColor2,
      textColorDisabled,
      textDecorationColor: textColor2,
      groupLabelTextColor: textColor2,
      caretColor: primaryColor,
      placeholderColor,
      placeholderColorDisabled,
      color: inputColor,
      colorDisabled: inputColorDisabled,
      colorFocus: changeColor(primaryColor, {
        alpha: 0.1
      }),
      groupLabelBorder: "1px solid #0000",
      border: "1px solid #0000",
      borderHover: `1px solid ${primaryColorHover}`,
      borderDisabled: "1px solid #0000",
      borderFocus: `1px solid ${primaryColorHover}`,
      boxShadowFocus: `0 0 8px 0 ${changeColor(primaryColor, {
        alpha: 0.3
      })}`,
      loadingColor: primaryColor,
      // warning
      loadingColorWarning: warningColor,
      borderWarning: `1px solid ${warningColor}`,
      borderHoverWarning: `1px solid ${warningColorHover}`,
      colorFocusWarning: changeColor(warningColor, {
        alpha: 0.1
      }),
      borderFocusWarning: `1px solid ${warningColorHover}`,
      boxShadowFocusWarning: `0 0 8px 0 ${changeColor(warningColor, {
        alpha: 0.3
      })}`,
      caretColorWarning: warningColor,
      // error
      loadingColorError: errorColor,
      borderError: `1px solid ${errorColor}`,
      borderHoverError: `1px solid ${errorColorHover}`,
      colorFocusError: changeColor(errorColor, {
        alpha: 0.1
      }),
      borderFocusError: `1px solid ${errorColorHover}`,
      boxShadowFocusError: `0 0 8px 0 ${changeColor(errorColor, {
        alpha: 0.3
      })}`,
      caretColorError: errorColor,
      clearColor,
      clearColorHover,
      clearColorPressed,
      iconColor,
      iconColorDisabled,
      iconColorHover,
      iconColorPressed,
      suffixTextColor: textColor2
    });
  }
};
function self$K(vars) {
  const {
    boxShadow2
  } = vars;
  return {
    menuBoxShadow: boxShadow2
  };
}
const autoCompleteDark = {
  name: "AutoComplete",
  common: derived$1,
  peers: {
    InternalSelectMenu: internalSelectMenuDark,
    Input: inputDark
  },
  self: self$K
};
function self$J(vars) {
  const {
    borderRadius,
    avatarColor,
    cardColor,
    fontSize: fontSize2,
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    heightHuge,
    modalColor,
    popoverColor
  } = vars;
  return {
    borderRadius,
    fontSize: fontSize2,
    border: `2px solid ${cardColor}`,
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    heightHuge,
    color: composite(cardColor, avatarColor),
    colorModal: composite(modalColor, avatarColor),
    colorPopover: composite(popoverColor, avatarColor)
  };
}
const avatarDark = {
  name: "Avatar",
  common: derived$1,
  self: self$J
};
function self$I() {
  return {
    gap: "-12px"
  };
}
const avatarGroupDark = {
  name: "AvatarGroup",
  common: derived$1,
  peers: {
    Avatar: avatarDark
  },
  self: self$I
};
const commonVariables$h = {
  width: "44px",
  height: "44px",
  borderRadius: "22px",
  iconSize: "26px"
};
const backTopDark = {
  name: "BackTop",
  common: derived$1,
  self(vars) {
    const {
      popoverColor,
      textColor2,
      primaryColorHover,
      primaryColorPressed
    } = vars;
    return Object.assign(Object.assign({}, commonVariables$h), {
      color: popoverColor,
      textColor: textColor2,
      iconColor: textColor2,
      iconColorHover: primaryColorHover,
      iconColorPressed: primaryColorPressed,
      boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)",
      boxShadowHover: "0 2px 12px 0px rgba(0, 0, 0, .18)",
      boxShadowPressed: "0 2px 12px 0px rgba(0, 0, 0, .18)"
    });
  }
};
const badgeDark = {
  name: "Badge",
  common: derived$1,
  self(vars) {
    const {
      errorColorSuppl,
      infoColorSuppl,
      successColorSuppl,
      warningColorSuppl,
      fontFamily: fontFamily2
    } = vars;
    return {
      color: errorColorSuppl,
      colorInfo: infoColorSuppl,
      colorSuccess: successColorSuppl,
      colorError: errorColorSuppl,
      colorWarning: warningColorSuppl,
      fontSize: "12px",
      fontFamily: fontFamily2
    };
  }
};
const commonVariables$g = {
  fontWeightActive: "400"
};
function self$H(vars) {
  const {
    fontSize: fontSize2,
    textColor3,
    textColor2,
    borderRadius,
    buttonColor2Hover,
    buttonColor2Pressed
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$g), {
    fontSize: fontSize2,
    itemLineHeight: "1.25",
    itemTextColor: textColor3,
    itemTextColorHover: textColor2,
    itemTextColorPressed: textColor2,
    itemTextColorActive: textColor2,
    itemBorderRadius: borderRadius,
    itemColorHover: buttonColor2Hover,
    itemColorPressed: buttonColor2Pressed,
    separatorColor: textColor3
  });
}
const breadcrumbDark = {
  name: "Breadcrumb",
  common: derived$1,
  self: self$H
};
function createHoverColor(rgb) {
  return composite(rgb, [255, 255, 255, 0.16]);
}
function createPressedColor(rgb) {
  return composite(rgb, [0, 0, 0, 0.12]);
}
const buttonGroupInjectionKey = createInjectionKey("n-button-group");
const commonVariables$f = {
  paddingTiny: "0 6px",
  paddingSmall: "0 10px",
  paddingMedium: "0 14px",
  paddingLarge: "0 18px",
  paddingRoundTiny: "0 10px",
  paddingRoundSmall: "0 14px",
  paddingRoundMedium: "0 18px",
  paddingRoundLarge: "0 22px",
  iconMarginTiny: "6px",
  iconMarginSmall: "6px",
  iconMarginMedium: "6px",
  iconMarginLarge: "6px",
  iconSizeTiny: "14px",
  iconSizeSmall: "18px",
  iconSizeMedium: "18px",
  iconSizeLarge: "20px",
  rippleDuration: ".6s"
};
function self$G(vars) {
  const {
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    borderRadius,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    opacityDisabled,
    textColor2,
    textColor3,
    primaryColorHover,
    primaryColorPressed,
    borderColor,
    primaryColor,
    baseColor,
    infoColor,
    infoColorHover,
    infoColorPressed,
    successColor,
    successColorHover,
    successColorPressed,
    warningColor,
    warningColorHover,
    warningColorPressed,
    errorColor,
    errorColorHover,
    errorColorPressed,
    fontWeight,
    buttonColor2,
    buttonColor2Hover,
    buttonColor2Pressed,
    fontWeightStrong
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$f), {
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    borderRadiusTiny: borderRadius,
    borderRadiusSmall: borderRadius,
    borderRadiusMedium: borderRadius,
    borderRadiusLarge: borderRadius,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    opacityDisabled,
    // secondary
    colorOpacitySecondary: "0.16",
    colorOpacitySecondaryHover: "0.22",
    colorOpacitySecondaryPressed: "0.28",
    colorSecondary: buttonColor2,
    colorSecondaryHover: buttonColor2Hover,
    colorSecondaryPressed: buttonColor2Pressed,
    // tertiary
    colorTertiary: buttonColor2,
    colorTertiaryHover: buttonColor2Hover,
    colorTertiaryPressed: buttonColor2Pressed,
    // quaternary
    colorQuaternary: "#0000",
    colorQuaternaryHover: buttonColor2Hover,
    colorQuaternaryPressed: buttonColor2Pressed,
    // default type
    color: "#0000",
    colorHover: "#0000",
    colorPressed: "#0000",
    colorFocus: "#0000",
    colorDisabled: "#0000",
    textColor: textColor2,
    textColorTertiary: textColor3,
    textColorHover: primaryColorHover,
    textColorPressed: primaryColorPressed,
    textColorFocus: primaryColorHover,
    textColorDisabled: textColor2,
    textColorText: textColor2,
    textColorTextHover: primaryColorHover,
    textColorTextPressed: primaryColorPressed,
    textColorTextFocus: primaryColorHover,
    textColorTextDisabled: textColor2,
    textColorGhost: textColor2,
    textColorGhostHover: primaryColorHover,
    textColorGhostPressed: primaryColorPressed,
    textColorGhostFocus: primaryColorHover,
    textColorGhostDisabled: textColor2,
    border: `1px solid ${borderColor}`,
    borderHover: `1px solid ${primaryColorHover}`,
    borderPressed: `1px solid ${primaryColorPressed}`,
    borderFocus: `1px solid ${primaryColorHover}`,
    borderDisabled: `1px solid ${borderColor}`,
    rippleColor: primaryColor,
    // primary
    colorPrimary: primaryColor,
    colorHoverPrimary: primaryColorHover,
    colorPressedPrimary: primaryColorPressed,
    colorFocusPrimary: primaryColorHover,
    colorDisabledPrimary: primaryColor,
    textColorPrimary: baseColor,
    textColorHoverPrimary: baseColor,
    textColorPressedPrimary: baseColor,
    textColorFocusPrimary: baseColor,
    textColorDisabledPrimary: baseColor,
    textColorTextPrimary: primaryColor,
    textColorTextHoverPrimary: primaryColorHover,
    textColorTextPressedPrimary: primaryColorPressed,
    textColorTextFocusPrimary: primaryColorHover,
    textColorTextDisabledPrimary: textColor2,
    textColorGhostPrimary: primaryColor,
    textColorGhostHoverPrimary: primaryColorHover,
    textColorGhostPressedPrimary: primaryColorPressed,
    textColorGhostFocusPrimary: primaryColorHover,
    textColorGhostDisabledPrimary: primaryColor,
    borderPrimary: `1px solid ${primaryColor}`,
    borderHoverPrimary: `1px solid ${primaryColorHover}`,
    borderPressedPrimary: `1px solid ${primaryColorPressed}`,
    borderFocusPrimary: `1px solid ${primaryColorHover}`,
    borderDisabledPrimary: `1px solid ${primaryColor}`,
    rippleColorPrimary: primaryColor,
    // info
    colorInfo: infoColor,
    colorHoverInfo: infoColorHover,
    colorPressedInfo: infoColorPressed,
    colorFocusInfo: infoColorHover,
    colorDisabledInfo: infoColor,
    textColorInfo: baseColor,
    textColorHoverInfo: baseColor,
    textColorPressedInfo: baseColor,
    textColorFocusInfo: baseColor,
    textColorDisabledInfo: baseColor,
    textColorTextInfo: infoColor,
    textColorTextHoverInfo: infoColorHover,
    textColorTextPressedInfo: infoColorPressed,
    textColorTextFocusInfo: infoColorHover,
    textColorTextDisabledInfo: textColor2,
    textColorGhostInfo: infoColor,
    textColorGhostHoverInfo: infoColorHover,
    textColorGhostPressedInfo: infoColorPressed,
    textColorGhostFocusInfo: infoColorHover,
    textColorGhostDisabledInfo: infoColor,
    borderInfo: `1px solid ${infoColor}`,
    borderHoverInfo: `1px solid ${infoColorHover}`,
    borderPressedInfo: `1px solid ${infoColorPressed}`,
    borderFocusInfo: `1px solid ${infoColorHover}`,
    borderDisabledInfo: `1px solid ${infoColor}`,
    rippleColorInfo: infoColor,
    // success
    colorSuccess: successColor,
    colorHoverSuccess: successColorHover,
    colorPressedSuccess: successColorPressed,
    colorFocusSuccess: successColorHover,
    colorDisabledSuccess: successColor,
    textColorSuccess: baseColor,
    textColorHoverSuccess: baseColor,
    textColorPressedSuccess: baseColor,
    textColorFocusSuccess: baseColor,
    textColorDisabledSuccess: baseColor,
    textColorTextSuccess: successColor,
    textColorTextHoverSuccess: successColorHover,
    textColorTextPressedSuccess: successColorPressed,
    textColorTextFocusSuccess: successColorHover,
    textColorTextDisabledSuccess: textColor2,
    textColorGhostSuccess: successColor,
    textColorGhostHoverSuccess: successColorHover,
    textColorGhostPressedSuccess: successColorPressed,
    textColorGhostFocusSuccess: successColorHover,
    textColorGhostDisabledSuccess: successColor,
    borderSuccess: `1px solid ${successColor}`,
    borderHoverSuccess: `1px solid ${successColorHover}`,
    borderPressedSuccess: `1px solid ${successColorPressed}`,
    borderFocusSuccess: `1px solid ${successColorHover}`,
    borderDisabledSuccess: `1px solid ${successColor}`,
    rippleColorSuccess: successColor,
    // warning
    colorWarning: warningColor,
    colorHoverWarning: warningColorHover,
    colorPressedWarning: warningColorPressed,
    colorFocusWarning: warningColorHover,
    colorDisabledWarning: warningColor,
    textColorWarning: baseColor,
    textColorHoverWarning: baseColor,
    textColorPressedWarning: baseColor,
    textColorFocusWarning: baseColor,
    textColorDisabledWarning: baseColor,
    textColorTextWarning: warningColor,
    textColorTextHoverWarning: warningColorHover,
    textColorTextPressedWarning: warningColorPressed,
    textColorTextFocusWarning: warningColorHover,
    textColorTextDisabledWarning: textColor2,
    textColorGhostWarning: warningColor,
    textColorGhostHoverWarning: warningColorHover,
    textColorGhostPressedWarning: warningColorPressed,
    textColorGhostFocusWarning: warningColorHover,
    textColorGhostDisabledWarning: warningColor,
    borderWarning: `1px solid ${warningColor}`,
    borderHoverWarning: `1px solid ${warningColorHover}`,
    borderPressedWarning: `1px solid ${warningColorPressed}`,
    borderFocusWarning: `1px solid ${warningColorHover}`,
    borderDisabledWarning: `1px solid ${warningColor}`,
    rippleColorWarning: warningColor,
    // error
    colorError: errorColor,
    colorHoverError: errorColorHover,
    colorPressedError: errorColorPressed,
    colorFocusError: errorColorHover,
    colorDisabledError: errorColor,
    textColorError: baseColor,
    textColorHoverError: baseColor,
    textColorPressedError: baseColor,
    textColorFocusError: baseColor,
    textColorDisabledError: baseColor,
    textColorTextError: errorColor,
    textColorTextHoverError: errorColorHover,
    textColorTextPressedError: errorColorPressed,
    textColorTextFocusError: errorColorHover,
    textColorTextDisabledError: textColor2,
    textColorGhostError: errorColor,
    textColorGhostHoverError: errorColorHover,
    textColorGhostPressedError: errorColorPressed,
    textColorGhostFocusError: errorColorHover,
    textColorGhostDisabledError: errorColor,
    borderError: `1px solid ${errorColor}`,
    borderHoverError: `1px solid ${errorColorHover}`,
    borderPressedError: `1px solid ${errorColorPressed}`,
    borderFocusError: `1px solid ${errorColorHover}`,
    borderDisabledError: `1px solid ${errorColor}`,
    rippleColorError: errorColor,
    waveOpacity: "0.6",
    fontWeight,
    fontWeightStrong
  });
}
const buttonLight = {
  name: "Button",
  common: derived,
  self: self$G
};
const buttonDark = {
  name: "Button",
  common: derived$1,
  self(vars) {
    const commonSelf = self$G(vars);
    commonSelf.waveOpacity = "0.8";
    commonSelf.colorOpacitySecondary = "0.16";
    commonSelf.colorOpacitySecondaryHover = "0.2";
    commonSelf.colorOpacitySecondaryPressed = "0.12";
    return commonSelf;
  }
};
const style$3 = c([cB("button", `
 margin: 0;
 font-weight: var(--n-font-weight);
 line-height: 1;
 font-family: inherit;
 padding: var(--n-padding);
 height: var(--n-height);
 font-size: var(--n-font-size);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 width: var(--n-width);
 white-space: nowrap;
 outline: none;
 position: relative;
 z-index: auto;
 border: none;
 display: inline-flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 align-items: center;
 justify-content: center;
 user-select: none;
 -webkit-user-select: none;
 text-align: center;
 cursor: pointer;
 text-decoration: none;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `, [cM("color", [cE("border", {
  borderColor: "var(--n-border-color)"
}), cM("disabled", [cE("border", {
  borderColor: "var(--n-border-color-disabled)"
})]), cNotM("disabled", [c("&:focus", [cE("state-border", {
  borderColor: "var(--n-border-color-focus)"
})]), c("&:hover", [cE("state-border", {
  borderColor: "var(--n-border-color-hover)"
})]), c("&:active", [cE("state-border", {
  borderColor: "var(--n-border-color-pressed)"
})]), cM("pressed", [cE("state-border", {
  borderColor: "var(--n-border-color-pressed)"
})])])]), cM("disabled", {
  backgroundColor: "var(--n-color-disabled)",
  color: "var(--n-text-color-disabled)"
}, [cE("border", {
  border: "var(--n-border-disabled)"
})]), cNotM("disabled", [c("&:focus", {
  backgroundColor: "var(--n-color-focus)",
  color: "var(--n-text-color-focus)"
}, [cE("state-border", {
  border: "var(--n-border-focus)"
})]), c("&:hover", {
  backgroundColor: "var(--n-color-hover)",
  color: "var(--n-text-color-hover)"
}, [cE("state-border", {
  border: "var(--n-border-hover)"
})]), c("&:active", {
  backgroundColor: "var(--n-color-pressed)",
  color: "var(--n-text-color-pressed)"
}, [cE("state-border", {
  border: "var(--n-border-pressed)"
})]), cM("pressed", {
  backgroundColor: "var(--n-color-pressed)",
  color: "var(--n-text-color-pressed)"
}, [cE("state-border", {
  border: "var(--n-border-pressed)"
})])]), cM("loading", "cursor: wait;"), cB("base-wave", `
 pointer-events: none;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 animation-iteration-count: 1;
 animation-duration: var(--n-ripple-duration);
 animation-timing-function: var(--n-bezier-ease-out), var(--n-bezier-ease-out);
 `, [cM("active", {
  zIndex: 1,
  animationName: "button-wave-spread, button-wave-opacity"
})]), null, cE("border, state-border", `
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 border-radius: inherit;
 transition: border-color .3s var(--n-bezier);
 pointer-events: none;
 `), cE("border", {
  border: "var(--n-border)"
}), cE("state-border", {
  border: "var(--n-border)",
  borderColor: "#0000",
  zIndex: 1
}), cE("icon", `
 margin: var(--n-icon-margin);
 margin-left: 0;
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 max-width: var(--n-icon-size);
 font-size: var(--n-icon-size);
 position: relative;
 flex-shrink: 0;
 `, [cB("icon-slot", `
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 `, [iconSwitchTransition({
  top: "50%",
  originalTransform: "translateY(-50%)"
})]), fadeInWidthExpandTransition()]), cE("content", `
 display: flex;
 align-items: center;
 flex-wrap: nowrap;
 min-width: 0;
 `, [c("~", [cE("icon", {
  margin: "var(--n-icon-margin)",
  marginRight: 0
})])]), cM("block", `
 display: flex;
 width: 100%;
 `), cM("dashed", [cE("border, state-border", {
  borderStyle: "dashed !important"
})]), cM("disabled", {
  cursor: "not-allowed",
  opacity: "var(--n-opacity-disabled)"
})]), c("@keyframes button-wave-spread", {
  from: {
    boxShadow: "0 0 0.5px 0 var(--n-ripple-color)"
  },
  to: {
    // don't use exact 5px since chrome will display the animation with glitches
    boxShadow: "0 0 0.5px 4.5px var(--n-ripple-color)"
  }
}), c("@keyframes button-wave-opacity", {
  from: {
    opacity: "var(--n-wave-opacity)"
  },
  to: {
    opacity: 0
  }
})]);
const buttonProps = Object.assign(Object.assign({}, useTheme.props), {
  color: String,
  textColor: String,
  text: Boolean,
  block: Boolean,
  loading: Boolean,
  disabled: Boolean,
  circle: Boolean,
  size: String,
  ghost: Boolean,
  round: Boolean,
  secondary: Boolean,
  tertiary: Boolean,
  quaternary: Boolean,
  strong: Boolean,
  focusable: {
    type: Boolean,
    default: true
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  tag: {
    type: String,
    default: "button"
  },
  type: {
    type: String,
    default: "default"
  },
  dashed: Boolean,
  renderIcon: Function,
  iconPlacement: {
    type: String,
    default: "left"
  },
  attrType: {
    type: String,
    default: "button"
  },
  bordered: {
    type: Boolean,
    default: true
  },
  onClick: [Function, Array],
  nativeFocusBehavior: {
    type: Boolean,
    default: true
  }
});
const Button = defineComponent({
  name: "Button",
  props: buttonProps,
  slots: Object,
  setup(props) {
    const selfElRef = ref(null);
    const waveElRef = ref(null);
    const enterPressedRef = ref(false);
    const showBorderRef = useMemo(() => {
      return !props.quaternary && !props.tertiary && !props.secondary && !props.text && (!props.color || props.ghost || props.dashed) && props.bordered;
    });
    const NButtonGroup = inject(buttonGroupInjectionKey, {});
    const {
      mergedSizeRef
    } = useFormItem({}, {
      defaultSize: "medium",
      mergedSize: (NFormItem) => {
        const {
          size
        } = props;
        if (size) return size;
        const {
          size: buttonGroupSize
        } = NButtonGroup;
        if (buttonGroupSize) return buttonGroupSize;
        const {
          mergedSize: formItemSize
        } = NFormItem || {};
        if (formItemSize) {
          return formItemSize.value;
        }
        return "medium";
      }
    });
    const mergedFocusableRef = computed(() => {
      return props.focusable && !props.disabled;
    });
    const handleMousedown = (e) => {
      var _a;
      if (!mergedFocusableRef.value) {
        e.preventDefault();
      }
      if (props.nativeFocusBehavior) {
        return;
      }
      e.preventDefault();
      if (props.disabled) {
        return;
      }
      if (mergedFocusableRef.value) {
        (_a = selfElRef.value) === null || _a === undefined ? undefined : _a.focus({
          preventScroll: true
        });
      }
    };
    const handleClick = (e) => {
      var _a;
      if (!props.disabled && !props.loading) {
        const {
          onClick
        } = props;
        if (onClick) call(onClick, e);
        if (!props.text) {
          (_a = waveElRef.value) === null || _a === undefined ? undefined : _a.play();
        }
      }
    };
    const handleKeyup = (e) => {
      switch (e.key) {
        case "Enter":
          if (!props.keyboard) {
            return;
          }
          enterPressedRef.value = false;
      }
    };
    const handleKeydown = (e) => {
      switch (e.key) {
        case "Enter":
          if (!props.keyboard || props.loading) {
            e.preventDefault();
            return;
          }
          enterPressedRef.value = true;
      }
    };
    const handleBlur = () => {
      enterPressedRef.value = false;
    };
    const {
      inlineThemeDisabled,
      mergedClsPrefixRef,
      mergedRtlRef
    } = useConfig(props);
    const themeRef = useTheme("Button", "-button", style$3, buttonLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("Button", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const theme = themeRef.value;
      const {
        common: {
          cubicBezierEaseInOut: cubicBezierEaseInOut2,
          cubicBezierEaseOut: cubicBezierEaseOut2
        },
        self: self2
      } = theme;
      const {
        rippleDuration,
        opacityDisabled,
        fontWeight,
        fontWeightStrong
      } = self2;
      const size = mergedSizeRef.value;
      const {
        dashed,
        type,
        ghost,
        text,
        color,
        round,
        circle,
        textColor,
        secondary,
        tertiary,
        quaternary,
        strong
      } = props;
      const fontProps = {
        "--n-font-weight": strong ? fontWeightStrong : fontWeight
      };
      let colorProps = {
        "--n-color": "initial",
        "--n-color-hover": "initial",
        "--n-color-pressed": "initial",
        "--n-color-focus": "initial",
        "--n-color-disabled": "initial",
        "--n-ripple-color": "initial",
        "--n-text-color": "initial",
        "--n-text-color-hover": "initial",
        "--n-text-color-pressed": "initial",
        "--n-text-color-focus": "initial",
        "--n-text-color-disabled": "initial"
      };
      const typeIsTertiary = type === "tertiary";
      const typeIsDefault = type === "default";
      const mergedType = typeIsTertiary ? "default" : type;
      if (text) {
        const propTextColor = textColor || color;
        const mergedTextColor = propTextColor || self2[createKey("textColorText", mergedType)];
        colorProps = {
          "--n-color": "#0000",
          "--n-color-hover": "#0000",
          "--n-color-pressed": "#0000",
          "--n-color-focus": "#0000",
          "--n-color-disabled": "#0000",
          "--n-ripple-color": "#0000",
          "--n-text-color": mergedTextColor,
          "--n-text-color-hover": propTextColor ? createHoverColor(propTextColor) : self2[createKey("textColorTextHover", mergedType)],
          "--n-text-color-pressed": propTextColor ? createPressedColor(propTextColor) : self2[createKey("textColorTextPressed", mergedType)],
          "--n-text-color-focus": propTextColor ? createHoverColor(propTextColor) : self2[createKey("textColorTextHover", mergedType)],
          "--n-text-color-disabled": propTextColor || self2[createKey("textColorTextDisabled", mergedType)]
        };
      } else if (ghost || dashed) {
        const mergedTextColor = textColor || color;
        colorProps = {
          "--n-color": "#0000",
          "--n-color-hover": "#0000",
          "--n-color-pressed": "#0000",
          "--n-color-focus": "#0000",
          "--n-color-disabled": "#0000",
          "--n-ripple-color": color || self2[createKey("rippleColor", mergedType)],
          "--n-text-color": mergedTextColor || self2[createKey("textColorGhost", mergedType)],
          "--n-text-color-hover": mergedTextColor ? createHoverColor(mergedTextColor) : self2[createKey("textColorGhostHover", mergedType)],
          "--n-text-color-pressed": mergedTextColor ? createPressedColor(mergedTextColor) : self2[createKey("textColorGhostPressed", mergedType)],
          "--n-text-color-focus": mergedTextColor ? createHoverColor(mergedTextColor) : self2[createKey("textColorGhostHover", mergedType)],
          "--n-text-color-disabled": mergedTextColor || self2[createKey("textColorGhostDisabled", mergedType)]
        };
      } else if (secondary) {
        const typeTextColor = typeIsDefault ? self2.textColor : typeIsTertiary ? self2.textColorTertiary : self2[createKey("color", mergedType)];
        const mergedTextColor = color || typeTextColor;
        const isColoredType = type !== "default" && type !== "tertiary";
        colorProps = {
          "--n-color": isColoredType ? changeColor(mergedTextColor, {
            alpha: Number(self2.colorOpacitySecondary)
          }) : self2.colorSecondary,
          "--n-color-hover": isColoredType ? changeColor(mergedTextColor, {
            alpha: Number(self2.colorOpacitySecondaryHover)
          }) : self2.colorSecondaryHover,
          "--n-color-pressed": isColoredType ? changeColor(mergedTextColor, {
            alpha: Number(self2.colorOpacitySecondaryPressed)
          }) : self2.colorSecondaryPressed,
          "--n-color-focus": isColoredType ? changeColor(mergedTextColor, {
            alpha: Number(self2.colorOpacitySecondaryHover)
          }) : self2.colorSecondaryHover,
          "--n-color-disabled": self2.colorSecondary,
          "--n-ripple-color": "#0000",
          "--n-text-color": mergedTextColor,
          "--n-text-color-hover": mergedTextColor,
          "--n-text-color-pressed": mergedTextColor,
          "--n-text-color-focus": mergedTextColor,
          "--n-text-color-disabled": mergedTextColor
        };
      } else if (tertiary || quaternary) {
        const typeColor = typeIsDefault ? self2.textColor : typeIsTertiary ? self2.textColorTertiary : self2[createKey("color", mergedType)];
        const mergedColor = color || typeColor;
        if (tertiary) {
          colorProps["--n-color"] = self2.colorTertiary;
          colorProps["--n-color-hover"] = self2.colorTertiaryHover;
          colorProps["--n-color-pressed"] = self2.colorTertiaryPressed;
          colorProps["--n-color-focus"] = self2.colorSecondaryHover;
          colorProps["--n-color-disabled"] = self2.colorTertiary;
        } else {
          colorProps["--n-color"] = self2.colorQuaternary;
          colorProps["--n-color-hover"] = self2.colorQuaternaryHover;
          colorProps["--n-color-pressed"] = self2.colorQuaternaryPressed;
          colorProps["--n-color-focus"] = self2.colorQuaternaryHover;
          colorProps["--n-color-disabled"] = self2.colorQuaternary;
        }
        colorProps["--n-ripple-color"] = "#0000";
        colorProps["--n-text-color"] = mergedColor;
        colorProps["--n-text-color-hover"] = mergedColor;
        colorProps["--n-text-color-pressed"] = mergedColor;
        colorProps["--n-text-color-focus"] = mergedColor;
        colorProps["--n-text-color-disabled"] = mergedColor;
      } else {
        colorProps = {
          "--n-color": color || self2[createKey("color", mergedType)],
          "--n-color-hover": color ? createHoverColor(color) : self2[createKey("colorHover", mergedType)],
          "--n-color-pressed": color ? createPressedColor(color) : self2[createKey("colorPressed", mergedType)],
          "--n-color-focus": color ? createHoverColor(color) : self2[createKey("colorFocus", mergedType)],
          "--n-color-disabled": color || self2[createKey("colorDisabled", mergedType)],
          "--n-ripple-color": color || self2[createKey("rippleColor", mergedType)],
          "--n-text-color": textColor || (color ? self2.textColorPrimary : typeIsTertiary ? self2.textColorTertiary : self2[createKey("textColor", mergedType)]),
          "--n-text-color-hover": textColor || (color ? self2.textColorHoverPrimary : self2[createKey("textColorHover", mergedType)]),
          "--n-text-color-pressed": textColor || (color ? self2.textColorPressedPrimary : self2[createKey("textColorPressed", mergedType)]),
          "--n-text-color-focus": textColor || (color ? self2.textColorFocusPrimary : self2[createKey("textColorFocus", mergedType)]),
          "--n-text-color-disabled": textColor || (color ? self2.textColorDisabledPrimary : self2[createKey("textColorDisabled", mergedType)])
        };
      }
      let borderProps = {
        "--n-border": "initial",
        "--n-border-hover": "initial",
        "--n-border-pressed": "initial",
        "--n-border-focus": "initial",
        "--n-border-disabled": "initial"
      };
      if (text) {
        borderProps = {
          "--n-border": "none",
          "--n-border-hover": "none",
          "--n-border-pressed": "none",
          "--n-border-focus": "none",
          "--n-border-disabled": "none"
        };
      } else {
        borderProps = {
          "--n-border": self2[createKey("border", mergedType)],
          "--n-border-hover": self2[createKey("borderHover", mergedType)],
          "--n-border-pressed": self2[createKey("borderPressed", mergedType)],
          "--n-border-focus": self2[createKey("borderFocus", mergedType)],
          "--n-border-disabled": self2[createKey("borderDisabled", mergedType)]
        };
      }
      const {
        [createKey("height", size)]: height,
        [createKey("fontSize", size)]: fontSize2,
        [createKey("padding", size)]: padding,
        [createKey("paddingRound", size)]: paddingRound,
        [createKey("iconSize", size)]: iconSize,
        [createKey("borderRadius", size)]: borderRadius,
        [createKey("iconMargin", size)]: iconMargin,
        waveOpacity
      } = self2;
      const sizeProps = {
        "--n-width": circle && !text ? height : "initial",
        "--n-height": text ? "initial" : height,
        "--n-font-size": fontSize2,
        "--n-padding": circle ? "initial" : text ? "initial" : round ? paddingRound : padding,
        "--n-icon-size": iconSize,
        "--n-icon-margin": iconMargin,
        "--n-border-radius": text ? "initial" : circle || round ? height : borderRadius
      };
      return Object.assign(Object.assign(Object.assign(Object.assign({
        "--n-bezier": cubicBezierEaseInOut2,
        "--n-bezier-ease-out": cubicBezierEaseOut2,
        "--n-ripple-duration": rippleDuration,
        "--n-opacity-disabled": opacityDisabled,
        "--n-wave-opacity": waveOpacity
      }, fontProps), colorProps), borderProps), sizeProps);
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("button", computed(() => {
      let hash2 = "";
      const {
        dashed,
        type,
        ghost,
        text,
        color,
        round,
        circle,
        textColor,
        secondary,
        tertiary,
        quaternary,
        strong
      } = props;
      if (dashed) hash2 += "a";
      if (ghost) hash2 += "b";
      if (text) hash2 += "c";
      if (round) hash2 += "d";
      if (circle) hash2 += "e";
      if (secondary) hash2 += "f";
      if (tertiary) hash2 += "g";
      if (quaternary) hash2 += "h";
      if (strong) hash2 += "i";
      if (color) hash2 += `j${color2Class(color)}`;
      if (textColor) hash2 += `k${color2Class(textColor)}`;
      const {
        value: size
      } = mergedSizeRef;
      hash2 += `l${size[0]}`;
      hash2 += `m${type[0]}`;
      return hash2;
    }), cssVarsRef, props) : undefined;
    return {
      selfElRef,
      waveElRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedFocusable: mergedFocusableRef,
      mergedSize: mergedSizeRef,
      showBorder: showBorderRef,
      enterPressed: enterPressedRef,
      rtlEnabled: rtlEnabledRef,
      handleMousedown,
      handleKeydown,
      handleBlur,
      handleKeyup,
      handleClick,
      customColorCssVars: computed(() => {
        const {
          color
        } = props;
        if (!color) return null;
        const hoverColor = createHoverColor(color);
        return {
          "--n-border-color": color,
          "--n-border-color-hover": hoverColor,
          "--n-border-color-pressed": createPressedColor(color),
          "--n-border-color-focus": hoverColor,
          "--n-border-color-disabled": color
        };
      }),
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix,
      tag: Component,
      onRender
    } = this;
    onRender === null || onRender === undefined ? undefined : onRender();
    const children = resolveWrappedSlot(this.$slots.default, (children2) => children2 && h("span", {
      class: `${mergedClsPrefix}-button__content`
    }, children2));
    return h(Component, {
      ref: "selfElRef",
      class: [
        this.themeClass,
        `${mergedClsPrefix}-button`,
        `${mergedClsPrefix}-button--${this.type}-type`,
        `${mergedClsPrefix}-button--${this.mergedSize}-type`,
        this.rtlEnabled && `${mergedClsPrefix}-button--rtl`,
        this.disabled && `${mergedClsPrefix}-button--disabled`,
        this.block && `${mergedClsPrefix}-button--block`,
        this.enterPressed && `${mergedClsPrefix}-button--pressed`,
        !this.text && this.dashed && `${mergedClsPrefix}-button--dashed`,
        this.color && `${mergedClsPrefix}-button--color`,
        this.secondary && `${mergedClsPrefix}-button--secondary`,
        this.loading && `${mergedClsPrefix}-button--loading`,
        this.ghost && `${mergedClsPrefix}-button--ghost`
        // required for button group border collapse
      ],
      tabindex: this.mergedFocusable ? 0 : -1,
      type: this.attrType,
      style: this.cssVars,
      disabled: this.disabled,
      onClick: this.handleClick,
      onBlur: this.handleBlur,
      onMousedown: this.handleMousedown,
      onKeyup: this.handleKeyup,
      onKeydown: this.handleKeydown
    }, this.iconPlacement === "right" && children, h(NFadeInExpandTransition, {
      width: true
    }, {
      default: () => resolveWrappedSlot(this.$slots.icon, (children2) => (this.loading || this.renderIcon || children2) && h("span", {
        class: `${mergedClsPrefix}-button__icon`,
        style: {
          margin: isSlotEmpty(this.$slots.default) ? "0" : ""
        }
      }, h(NIconSwitchTransition, null, {
        default: () => this.loading ? h(NBaseLoading, {
          clsPrefix: mergedClsPrefix,
          key: "loading",
          class: `${mergedClsPrefix}-icon-slot`,
          strokeWidth: 20
        }) : h("div", {
          key: "icon",
          class: `${mergedClsPrefix}-icon-slot`,
          role: "none"
        }, this.renderIcon ? this.renderIcon() : children2)
      })))
    }), this.iconPlacement === "left" && children, !this.text ? h(NBaseWave, {
      ref: "waveElRef",
      clsPrefix: mergedClsPrefix
    }) : null, this.showBorder ? h("div", {
      "aria-hidden": true,
      class: `${mergedClsPrefix}-button__border`,
      style: this.customColorCssVars
    }) : null, this.showBorder ? h("div", {
      "aria-hidden": true,
      class: `${mergedClsPrefix}-button__state-border`,
      style: this.customColorCssVars
    }) : null);
  }
});
const commonVariables$e = {
  titleFontSize: "22px"
};
function self$F(vars) {
  const {
    borderRadius,
    fontSize: fontSize2,
    lineHeight: lineHeight2,
    textColor2,
    textColor1,
    textColorDisabled,
    dividerColor,
    fontWeightStrong,
    primaryColor,
    baseColor,
    hoverColor,
    cardColor,
    modalColor,
    popoverColor
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$e), {
    borderRadius,
    borderColor: composite(cardColor, dividerColor),
    borderColorModal: composite(modalColor, dividerColor),
    borderColorPopover: composite(popoverColor, dividerColor),
    textColor: textColor2,
    titleFontWeight: fontWeightStrong,
    titleTextColor: textColor1,
    dayTextColor: textColorDisabled,
    fontSize: fontSize2,
    lineHeight: lineHeight2,
    dateColorCurrent: primaryColor,
    dateTextColorCurrent: baseColor,
    cellColorHover: composite(cardColor, hoverColor),
    cellColorHoverModal: composite(modalColor, hoverColor),
    cellColorHoverPopover: composite(popoverColor, hoverColor),
    cellColor: cardColor,
    cellColorModal: modalColor,
    cellColorPopover: popoverColor,
    barColor: primaryColor
  });
}
const calendarDark = {
  name: "Calendar",
  common: derived$1,
  peers: {
    Button: buttonDark
  },
  self: self$F
};
const commonVariables$d = {
  paddingSmall: "12px 16px 12px",
  paddingMedium: "19px 24px 20px",
  paddingLarge: "23px 32px 24px",
  paddingHuge: "27px 40px 28px",
  titleFontSizeSmall: "16px",
  titleFontSizeMedium: "18px",
  titleFontSizeLarge: "18px",
  titleFontSizeHuge: "18px",
  closeIconSize: "18px",
  closeSize: "22px"
};
function self$E(vars) {
  const {
    primaryColor,
    borderRadius,
    lineHeight: lineHeight2,
    fontSize: fontSize2,
    cardColor,
    textColor2,
    textColor1,
    dividerColor,
    fontWeightStrong,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    closeColorHover,
    closeColorPressed,
    modalColor,
    boxShadow1,
    popoverColor,
    actionColor
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$d), {
    lineHeight: lineHeight2,
    color: cardColor,
    colorModal: modalColor,
    colorPopover: popoverColor,
    colorTarget: primaryColor,
    colorEmbedded: actionColor,
    colorEmbeddedModal: actionColor,
    colorEmbeddedPopover: actionColor,
    textColor: textColor2,
    titleTextColor: textColor1,
    borderColor: dividerColor,
    actionColor,
    titleFontWeight: fontWeightStrong,
    closeColorHover,
    closeColorPressed,
    closeBorderRadius: borderRadius,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    fontSizeSmall: fontSize2,
    fontSizeMedium: fontSize2,
    fontSizeLarge: fontSize2,
    fontSizeHuge: fontSize2,
    boxShadow: boxShadow1,
    borderRadius
  });
}
const cardLight = {
  name: "Card",
  common: derived,
  self: self$E
};
const cardDark = {
  name: "Card",
  common: derived$1,
  self(vars) {
    const commonSelf = self$E(vars);
    const {
      cardColor,
      modalColor,
      popoverColor
    } = vars;
    commonSelf.colorEmbedded = cardColor;
    commonSelf.colorEmbeddedModal = modalColor;
    commonSelf.colorEmbeddedPopover = popoverColor;
    return commonSelf;
  }
};
const style$2 = c([cB("card", `
 font-size: var(--n-font-size);
 line-height: var(--n-line-height);
 display: flex;
 flex-direction: column;
 width: 100%;
 box-sizing: border-box;
 position: relative;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 color: var(--n-text-color);
 word-break: break-word;
 transition: 
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `, [asModal({
  background: "var(--n-color-modal)"
}), cM("hoverable", [c("&:hover", "box-shadow: var(--n-box-shadow);")]), cM("content-segmented", [c(">", [cE("content", {
  paddingTop: "var(--n-padding-bottom)"
})])]), cM("content-soft-segmented", [c(">", [cE("content", `
 margin: 0 var(--n-padding-left);
 padding: var(--n-padding-bottom) 0;
 `)])]), cM("footer-segmented", [c(">", [cE("footer", {
  paddingTop: "var(--n-padding-bottom)"
})])]), cM("footer-soft-segmented", [c(">", [cE("footer", `
 padding: var(--n-padding-bottom) 0;
 margin: 0 var(--n-padding-left);
 `)])]), c(">", [cB("card-header", `
 box-sizing: border-box;
 display: flex;
 align-items: center;
 font-size: var(--n-title-font-size);
 padding:
 var(--n-padding-top)
 var(--n-padding-left)
 var(--n-padding-bottom)
 var(--n-padding-left);
 `, [cE("main", `
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 flex: 1;
 min-width: 0;
 color: var(--n-title-text-color);
 `), cE("extra", `
 display: flex;
 align-items: center;
 font-size: var(--n-font-size);
 font-weight: 400;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `), cE("close", `
 margin: 0 0 0 8px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]), cE("action", `
 box-sizing: border-box;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 background-clip: padding-box;
 background-color: var(--n-action-color);
 `), cE("content", "flex: 1; min-width: 0;"), cE("content, footer", `
 box-sizing: border-box;
 padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
 font-size: var(--n-font-size);
 `, [c("&:first-child", {
  paddingTop: "var(--n-padding-bottom)"
})]), cE("action", `
 background-color: var(--n-action-color);
 padding: var(--n-padding-bottom) var(--n-padding-left);
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `)]), cB("card-cover", `
 overflow: hidden;
 width: 100%;
 border-radius: var(--n-border-radius) var(--n-border-radius) 0 0;
 `, [c("img", `
 display: block;
 width: 100%;
 `)]), cM("bordered", `
 border: 1px solid var(--n-border-color);
 `, [c("&:target", "border-color: var(--n-color-target);")]), cM("action-segmented", [c(">", [cE("action", [c("&:not(:first-child)", {
  borderTop: "1px solid var(--n-border-color)"
})])])]), cM("content-segmented, content-soft-segmented", [c(">", [cE("content", {
  transition: "border-color 0.3s var(--n-bezier)"
}, [c("&:not(:first-child)", {
  borderTop: "1px solid var(--n-border-color)"
})])])]), cM("footer-segmented, footer-soft-segmented", [c(">", [cE("footer", {
  transition: "border-color 0.3s var(--n-bezier)"
}, [c("&:not(:first-child)", {
  borderTop: "1px solid var(--n-border-color)"
})])])]), cM("embedded", `
 background-color: var(--n-color-embedded);
 `)]), insideModal(cB("card", `
 background: var(--n-color-modal);
 `, [cM("embedded", `
 background-color: var(--n-color-embedded-modal);
 `)])), insidePopover(cB("card", `
 background: var(--n-color-popover);
 `, [cM("embedded", `
 background-color: var(--n-color-embedded-popover);
 `)]))]);
const cardBaseProps = {
  title: [String, Function],
  contentClass: String,
  contentStyle: [Object, String],
  headerClass: String,
  headerStyle: [Object, String],
  headerExtraClass: String,
  headerExtraStyle: [Object, String],
  footerClass: String,
  footerStyle: [Object, String],
  embedded: Boolean,
  segmented: {
    type: [Boolean, Object],
    default: false
  },
  size: {
    type: String,
    default: "medium"
  },
  bordered: {
    type: Boolean,
    default: true
  },
  closable: Boolean,
  hoverable: Boolean,
  role: String,
  onClose: [Function, Array],
  tag: {
    type: String,
    default: "div"
  },
  cover: Function,
  content: [String, Function],
  footer: Function,
  action: Function,
  headerExtra: Function
};
const cardBasePropKeys = keysOf(cardBaseProps);
const cardProps = Object.assign(Object.assign({}, useTheme.props), cardBaseProps);
const NCard = defineComponent({
  name: "Card",
  props: cardProps,
  slots: Object,
  setup(props) {
    const handleCloseClick = () => {
      const {
        onClose
      } = props;
      if (onClose) call(onClose);
    };
    const {
      inlineThemeDisabled,
      mergedClsPrefixRef,
      mergedRtlRef
    } = useConfig(props);
    const themeRef = useTheme("Card", "-card", style$2, cardLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("Card", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        size
      } = props;
      const {
        self: {
          color,
          colorModal,
          colorTarget,
          textColor,
          titleTextColor,
          titleFontWeight,
          borderColor,
          actionColor,
          borderRadius,
          lineHeight: lineHeight2,
          closeIconColor,
          closeIconColorHover,
          closeIconColorPressed,
          closeColorHover,
          closeColorPressed,
          closeBorderRadius,
          closeIconSize,
          closeSize,
          boxShadow,
          colorPopover,
          colorEmbedded,
          colorEmbeddedModal,
          colorEmbeddedPopover,
          [createKey("padding", size)]: padding,
          [createKey("fontSize", size)]: fontSize2,
          [createKey("titleFontSize", size)]: titleFontSize
        },
        common: {
          cubicBezierEaseInOut: cubicBezierEaseInOut2
        }
      } = themeRef.value;
      const {
        top: paddingTop,
        left: paddingLeft,
        bottom: paddingBottom
      } = getPadding(padding);
      return {
        "--n-bezier": cubicBezierEaseInOut2,
        "--n-border-radius": borderRadius,
        "--n-color": color,
        "--n-color-modal": colorModal,
        "--n-color-popover": colorPopover,
        "--n-color-embedded": colorEmbedded,
        "--n-color-embedded-modal": colorEmbeddedModal,
        "--n-color-embedded-popover": colorEmbeddedPopover,
        "--n-color-target": colorTarget,
        "--n-text-color": textColor,
        "--n-line-height": lineHeight2,
        "--n-action-color": actionColor,
        "--n-title-text-color": titleTextColor,
        "--n-title-font-weight": titleFontWeight,
        "--n-close-icon-color": closeIconColor,
        "--n-close-icon-color-hover": closeIconColorHover,
        "--n-close-icon-color-pressed": closeIconColorPressed,
        "--n-close-color-hover": closeColorHover,
        "--n-close-color-pressed": closeColorPressed,
        "--n-border-color": borderColor,
        "--n-box-shadow": boxShadow,
        // size
        "--n-padding-top": paddingTop,
        "--n-padding-bottom": paddingBottom,
        "--n-padding-left": paddingLeft,
        "--n-font-size": fontSize2,
        "--n-title-font-size": titleFontSize,
        "--n-close-size": closeSize,
        "--n-close-icon-size": closeIconSize,
        "--n-close-border-radius": closeBorderRadius
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("card", computed(() => {
      return props.size[0];
    }), cssVarsRef, props) : undefined;
    return {
      rtlEnabled: rtlEnabledRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedTheme: themeRef,
      handleCloseClick,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    };
  },
  render() {
    const {
      segmented,
      bordered,
      hoverable,
      mergedClsPrefix,
      rtlEnabled,
      onRender,
      embedded,
      tag: Component,
      $slots
    } = this;
    onRender === null || onRender === undefined ? undefined : onRender();
    return h(Component, {
      class: [`${mergedClsPrefix}-card`, this.themeClass, embedded && `${mergedClsPrefix}-card--embedded`, {
        [`${mergedClsPrefix}-card--rtl`]: rtlEnabled,
        [`${mergedClsPrefix}-card--content${typeof segmented !== "boolean" && segmented.content === "soft" ? "-soft" : ""}-segmented`]: segmented === true || segmented !== false && segmented.content,
        [`${mergedClsPrefix}-card--footer${typeof segmented !== "boolean" && segmented.footer === "soft" ? "-soft" : ""}-segmented`]: segmented === true || segmented !== false && segmented.footer,
        [`${mergedClsPrefix}-card--action-segmented`]: segmented === true || segmented !== false && segmented.action,
        [`${mergedClsPrefix}-card--bordered`]: bordered,
        [`${mergedClsPrefix}-card--hoverable`]: hoverable
      }],
      style: this.cssVars,
      role: this.role
    }, resolveWrappedSlot($slots.cover, (children) => {
      const mergedChildren = this.cover ? ensureValidVNode([this.cover()]) : children;
      return mergedChildren && h("div", {
        class: `${mergedClsPrefix}-card-cover`,
        role: "none"
      }, mergedChildren);
    }), resolveWrappedSlot($slots.header, (children) => {
      const {
        title
      } = this;
      const mergedChildren = title ? ensureValidVNode(typeof title === "function" ? [title()] : [title]) : children;
      return mergedChildren || this.closable ? h("div", {
        class: [`${mergedClsPrefix}-card-header`, this.headerClass],
        style: this.headerStyle,
        role: "heading"
      }, h("div", {
        class: `${mergedClsPrefix}-card-header__main`,
        role: "heading"
      }, mergedChildren), resolveWrappedSlot($slots["header-extra"], (children2) => {
        const mergedChildren2 = this.headerExtra ? ensureValidVNode([this.headerExtra()]) : children2;
        return mergedChildren2 && h("div", {
          class: [`${mergedClsPrefix}-card-header__extra`, this.headerExtraClass],
          style: this.headerExtraStyle
        }, mergedChildren2);
      }), this.closable && h(NBaseClose, {
        clsPrefix: mergedClsPrefix,
        class: `${mergedClsPrefix}-card-header__close`,
        onClick: this.handleCloseClick,
        absolute: true
      })) : null;
    }), resolveWrappedSlot($slots.default, (children) => {
      const {
        content
      } = this;
      const mergedChildren = content ? ensureValidVNode(typeof content === "function" ? [content()] : [content]) : children;
      return mergedChildren && h("div", {
        class: [`${mergedClsPrefix}-card__content`, this.contentClass],
        style: this.contentStyle,
        role: "none"
      }, mergedChildren);
    }), resolveWrappedSlot($slots.footer, (children) => {
      const mergedChildren = this.footer ? ensureValidVNode([this.footer()]) : children;
      return mergedChildren && h("div", {
        class: [`${mergedClsPrefix}-card__footer`, this.footerClass],
        style: this.footerStyle,
        role: "none"
      }, mergedChildren);
    }), resolveWrappedSlot($slots.action, (children) => {
      const mergedChildren = this.action ? ensureValidVNode([this.action()]) : children;
      return mergedChildren && h("div", {
        class: `${mergedClsPrefix}-card__action`,
        role: "none"
      }, mergedChildren);
    }));
  }
});
function self$D() {
  return {
    dotSize: "8px",
    dotColor: "rgba(255, 255, 255, .3)",
    dotColorActive: "rgba(255, 255, 255, 1)",
    dotColorFocus: "rgba(255, 255, 255, .5)",
    dotLineWidth: "16px",
    dotLineWidthActive: "24px",
    arrowColor: "#eee"
  };
}
const carouselDark = {
  name: "Carousel",
  common: derived$1,
  self: self$D
};
const commonVariables$c = {
  sizeSmall: "14px",
  sizeMedium: "16px",
  sizeLarge: "18px",
  labelPadding: "0 8px",
  labelFontWeight: "400"
};
function self$C(vars) {
  const {
    baseColor,
    inputColorDisabled,
    cardColor,
    modalColor,
    popoverColor,
    textColorDisabled,
    borderColor,
    primaryColor,
    textColor2,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    borderRadiusSmall,
    lineHeight: lineHeight2
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$c), {
    labelLineHeight: lineHeight2,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    borderRadius: borderRadiusSmall,
    color: baseColor,
    colorChecked: primaryColor,
    colorDisabled: inputColorDisabled,
    colorDisabledChecked: inputColorDisabled,
    colorTableHeader: cardColor,
    colorTableHeaderModal: modalColor,
    colorTableHeaderPopover: popoverColor,
    checkMarkColor: baseColor,
    checkMarkColorDisabled: textColorDisabled,
    checkMarkColorDisabledChecked: textColorDisabled,
    border: `1px solid ${borderColor}`,
    borderDisabled: `1px solid ${borderColor}`,
    borderDisabledChecked: `1px solid ${borderColor}`,
    borderChecked: `1px solid ${primaryColor}`,
    borderFocus: `1px solid ${primaryColor}`,
    boxShadowFocus: `0 0 0 2px ${changeColor(primaryColor, {
      alpha: 0.3
    })}`,
    textColor: textColor2,
    textColorDisabled
  });
}
const checkboxDark = {
  name: "Checkbox",
  common: derived$1,
  self(vars) {
    const {
      cardColor
    } = vars;
    const commonSelf = self$C(vars);
    commonSelf.color = "#0000";
    commonSelf.checkMarkColor = cardColor;
    return commonSelf;
  }
};
function self$B(vars) {
  const {
    borderRadius,
    boxShadow2,
    popoverColor,
    textColor2,
    textColor3,
    primaryColor,
    textColorDisabled,
    dividerColor,
    hoverColor,
    fontSizeMedium,
    heightMedium
  } = vars;
  return {
    menuBorderRadius: borderRadius,
    menuColor: popoverColor,
    menuBoxShadow: boxShadow2,
    menuDividerColor: dividerColor,
    menuHeight: "calc(var(--n-option-height) * 6.6)",
    optionArrowColor: textColor3,
    optionHeight: heightMedium,
    optionFontSize: fontSizeMedium,
    optionColorHover: hoverColor,
    optionTextColor: textColor2,
    optionTextColorActive: primaryColor,
    optionTextColorDisabled: textColorDisabled,
    optionCheckMarkColor: primaryColor,
    loadingColor: primaryColor,
    columnWidth: "180px"
  };
}
const cascaderDark = {
  name: "Cascader",
  common: derived$1,
  peers: {
    InternalSelectMenu: internalSelectMenuDark,
    InternalSelection: internalSelectionDark,
    Scrollbar: scrollbarDark,
    Checkbox: checkboxDark,
    Empty: emptyLight
  },
  self: self$B
};
const codeDark = {
  name: "Code",
  common: derived$1,
  self(vars) {
    const {
      textColor2,
      fontSize: fontSize2,
      fontWeightStrong,
      textColor3
    } = vars;
    return {
      textColor: textColor2,
      fontSize: fontSize2,
      fontWeightStrong,
      // extracted from hljs atom-one-dark.scss
      "mono-3": "#5c6370",
      "hue-1": "#56b6c2",
      "hue-2": "#61aeee",
      "hue-3": "#c678dd",
      "hue-4": "#98c379",
      "hue-5": "#e06c75",
      "hue-5-2": "#be5046",
      "hue-6": "#d19a66",
      "hue-6-2": "#e6c07b",
      // line-number styles
      lineNumberTextColor: textColor3
    };
  }
};
function self$A(vars) {
  const {
    fontWeight,
    textColor1,
    textColor2,
    textColorDisabled,
    dividerColor,
    fontSize: fontSize2
  } = vars;
  return {
    titleFontSize: fontSize2,
    titleFontWeight: fontWeight,
    dividerColor,
    titleTextColor: textColor1,
    titleTextColorDisabled: textColorDisabled,
    fontSize: fontSize2,
    textColor: textColor2,
    arrowColor: textColor2,
    arrowColorDisabled: textColorDisabled,
    itemMargin: "16px 0 0 0",
    titlePadding: "16px 0 0 0"
  };
}
const collapseDark = {
  name: "Collapse",
  common: derived$1,
  self: self$A
};
function self$z(vars) {
  const {
    cubicBezierEaseInOut: cubicBezierEaseInOut2
  } = vars;
  return {
    bezier: cubicBezierEaseInOut2
  };
}
const collapseTransitionDark = {
  name: "CollapseTransition",
  common: derived$1,
  self: self$z
};
function self$y(vars) {
  const {
    fontSize: fontSize2,
    boxShadow2,
    popoverColor,
    textColor2,
    borderRadius,
    borderColor,
    heightSmall,
    heightMedium,
    heightLarge,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    dividerColor
  } = vars;
  return {
    panelFontSize: fontSize2,
    boxShadow: boxShadow2,
    color: popoverColor,
    textColor: textColor2,
    borderRadius,
    border: `1px solid ${borderColor}`,
    heightSmall,
    heightMedium,
    heightLarge,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    dividerColor
  };
}
const colorPickerDark = {
  name: "ColorPicker",
  common: derived$1,
  peers: {
    Input: inputDark,
    Button: buttonDark
  },
  self: self$y
};
const configProviderProps = {
  abstract: Boolean,
  bordered: {
    type: Boolean,
    default: undefined
  },
  clsPrefix: String,
  locale: Object,
  dateLocale: Object,
  namespace: String,
  rtl: Array,
  tag: {
    type: String,
    default: "div"
  },
  hljs: Object,
  katex: Object,
  theme: Object,
  themeOverrides: Object,
  componentOptions: Object,
  icons: Object,
  breakpoints: Object,
  preflightStyleDisabled: Boolean,
  styleMountTarget: Object,
  inlineThemeDisabled: {
    type: Boolean,
    default: undefined
  },
  // deprecated
  as: {
    type: String,
    validator: () => {
      warn("config-provider", "`as` is deprecated, please use `tag` instead.");
      return true;
    },
    default: undefined
  }
};
const __unplugin_components_0 = defineComponent({
  name: "ConfigProvider",
  alias: ["App"],
  props: configProviderProps,
  setup(props) {
    const NConfigProvider = inject(configProviderInjectionKey, null);
    const mergedThemeRef = computed(() => {
      const {
        theme
      } = props;
      if (theme === null) return undefined;
      const inheritedTheme = NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedThemeRef.value;
      return theme === undefined ? inheritedTheme : inheritedTheme === undefined ? theme : Object.assign({}, inheritedTheme, theme);
    });
    const mergedThemeOverridesRef = computed(() => {
      const {
        themeOverrides
      } = props;
      if (themeOverrides === null) return undefined;
      if (themeOverrides === undefined) {
        return NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedThemeOverridesRef.value;
      } else {
        const inheritedThemeOverrides = NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedThemeOverridesRef.value;
        if (inheritedThemeOverrides === undefined) {
          return themeOverrides;
        } else {
          return merge({}, inheritedThemeOverrides, themeOverrides);
        }
      }
    });
    const mergedNamespaceRef = useMemo(() => {
      const {
        namespace: namespace2
      } = props;
      return namespace2 === undefined ? NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedNamespaceRef.value : namespace2;
    });
    const mergedBorderedRef = useMemo(() => {
      const {
        bordered
      } = props;
      return bordered === undefined ? NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedBorderedRef.value : bordered;
    });
    const mergedIconsRef = computed(() => {
      const {
        icons
      } = props;
      return icons === undefined ? NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedIconsRef.value : icons;
    });
    const mergedComponentPropsRef = computed(() => {
      const {
        componentOptions
      } = props;
      if (componentOptions !== undefined) return componentOptions;
      return NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedComponentPropsRef.value;
    });
    const mergedClsPrefixRef = computed(() => {
      const {
        clsPrefix
      } = props;
      if (clsPrefix !== undefined) return clsPrefix;
      if (NConfigProvider) return NConfigProvider.mergedClsPrefixRef.value;
      return defaultClsPrefix;
    });
    const mergedRtlRef = computed(() => {
      var _a;
      const {
        rtl
      } = props;
      if (rtl === undefined) {
        return NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedRtlRef.value;
      }
      const rtlEnabledState = {};
      for (const rtlInfo of rtl) {
        rtlEnabledState[rtlInfo.name] = markRaw(rtlInfo);
        (_a = rtlInfo.peers) === null || _a === undefined ? undefined : _a.forEach((peerRtlInfo) => {
          if (!(peerRtlInfo.name in rtlEnabledState)) {
            rtlEnabledState[peerRtlInfo.name] = markRaw(peerRtlInfo);
          }
        });
      }
      return rtlEnabledState;
    });
    const mergedBreakpointsRef = computed(() => {
      return props.breakpoints || (NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedBreakpointsRef.value);
    });
    const inlineThemeDisabled = props.inlineThemeDisabled || (NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.inlineThemeDisabled);
    const preflightStyleDisabled = props.preflightStyleDisabled || (NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.preflightStyleDisabled);
    const styleMountTarget = props.styleMountTarget || (NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.styleMountTarget);
    const mergedThemeHashRef = computed(() => {
      const {
        value: theme
      } = mergedThemeRef;
      const {
        value: mergedThemeOverrides
      } = mergedThemeOverridesRef;
      const hasThemeOverrides = mergedThemeOverrides && Object.keys(mergedThemeOverrides).length !== 0;
      const themeName = theme === null || theme === undefined ? undefined : theme.name;
      if (themeName) {
        if (hasThemeOverrides) {
          return `${themeName}-${hash(JSON.stringify(mergedThemeOverridesRef.value))}`;
        }
        return themeName;
      } else {
        if (hasThemeOverrides) {
          return hash(JSON.stringify(mergedThemeOverridesRef.value));
        }
        return "";
      }
    });
    provide(configProviderInjectionKey, {
      mergedThemeHashRef,
      mergedBreakpointsRef,
      mergedRtlRef,
      mergedIconsRef,
      mergedComponentPropsRef,
      mergedBorderedRef,
      mergedNamespaceRef,
      mergedClsPrefixRef,
      mergedLocaleRef: computed(() => {
        const {
          locale
        } = props;
        if (locale === null) return undefined;
        return locale === undefined ? NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedLocaleRef.value : locale;
      }),
      mergedDateLocaleRef: computed(() => {
        const {
          dateLocale
        } = props;
        if (dateLocale === null) return undefined;
        return dateLocale === undefined ? NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedDateLocaleRef.value : dateLocale;
      }),
      mergedHljsRef: computed(() => {
        const {
          hljs
        } = props;
        return hljs === undefined ? NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedHljsRef.value : hljs;
      }),
      mergedKatexRef: computed(() => {
        const {
          katex
        } = props;
        return katex === undefined ? NConfigProvider === null || NConfigProvider === undefined ? undefined : NConfigProvider.mergedKatexRef.value : katex;
      }),
      mergedThemeRef,
      mergedThemeOverridesRef,
      inlineThemeDisabled: inlineThemeDisabled || false,
      preflightStyleDisabled: preflightStyleDisabled || false,
      styleMountTarget
    });
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedBordered: mergedBorderedRef,
      mergedNamespace: mergedNamespaceRef,
      mergedTheme: mergedThemeRef,
      mergedThemeOverrides: mergedThemeOverridesRef
    };
  },
  render() {
    var _a, _b, _c, _d;
    return !this.abstract ? h(this.as || this.tag, {
      class: `${this.mergedClsPrefix || defaultClsPrefix}-config-provider`
    }, (_b = (_a = this.$slots).default) === null || _b === undefined ? undefined : _b.call(_a)) : (_d = (_c = this.$slots).default) === null || _d === undefined ? undefined : _d.call(_c);
  }
});
const popselect = {
  name: "Popselect",
  common: derived$1,
  peers: {
    Popover: popoverDark,
    InternalSelectMenu: internalSelectMenuDark
  }
};
function self$x(vars) {
  const {
    boxShadow2
  } = vars;
  return {
    menuBoxShadow: boxShadow2
  };
}
const selectLight = createTheme({
  name: "Select",
  common: derived,
  peers: {
    InternalSelection: internalSelectionLight,
    InternalSelectMenu: internalSelectMenuLight
  },
  self: self$x
});
const selectDark = {
  name: "Select",
  common: derived$1,
  peers: {
    InternalSelection: internalSelectionDark,
    InternalSelectMenu: internalSelectMenuDark
  },
  self: self$x
};
const commonVariables$b = {
  itemPaddingSmall: "0 4px",
  itemMarginSmall: "0 0 0 8px",
  itemMarginSmallRtl: "0 8px 0 0",
  itemPaddingMedium: "0 4px",
  itemMarginMedium: "0 0 0 8px",
  itemMarginMediumRtl: "0 8px 0 0",
  itemPaddingLarge: "0 4px",
  itemMarginLarge: "0 0 0 8px",
  itemMarginLargeRtl: "0 8px 0 0",
  buttonIconSizeSmall: "14px",
  buttonIconSizeMedium: "16px",
  buttonIconSizeLarge: "18px",
  inputWidthSmall: "60px",
  selectWidthSmall: "unset",
  inputMarginSmall: "0 0 0 8px",
  inputMarginSmallRtl: "0 8px 0 0",
  selectMarginSmall: "0 0 0 8px",
  prefixMarginSmall: "0 8px 0 0",
  suffixMarginSmall: "0 0 0 8px",
  inputWidthMedium: "60px",
  selectWidthMedium: "unset",
  inputMarginMedium: "0 0 0 8px",
  inputMarginMediumRtl: "0 8px 0 0",
  selectMarginMedium: "0 0 0 8px",
  prefixMarginMedium: "0 8px 0 0",
  suffixMarginMedium: "0 0 0 8px",
  inputWidthLarge: "60px",
  selectWidthLarge: "unset",
  inputMarginLarge: "0 0 0 8px",
  inputMarginLargeRtl: "0 8px 0 0",
  selectMarginLarge: "0 0 0 8px",
  prefixMarginLarge: "0 8px 0 0",
  suffixMarginLarge: "0 0 0 8px"
};
function self$w(vars) {
  const {
    textColor2,
    primaryColor,
    primaryColorHover,
    primaryColorPressed,
    inputColorDisabled,
    textColorDisabled,
    borderColor,
    borderRadius,
    // item font size
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    // item size
    heightTiny,
    heightSmall,
    heightMedium
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$b), {
    buttonColor: "#0000",
    buttonColorHover: "#0000",
    buttonColorPressed: "#0000",
    buttonBorder: `1px solid ${borderColor}`,
    buttonBorderHover: `1px solid ${borderColor}`,
    buttonBorderPressed: `1px solid ${borderColor}`,
    buttonIconColor: textColor2,
    buttonIconColorHover: textColor2,
    buttonIconColorPressed: textColor2,
    itemTextColor: textColor2,
    itemTextColorHover: primaryColorHover,
    itemTextColorPressed: primaryColorPressed,
    itemTextColorActive: primaryColor,
    itemTextColorDisabled: textColorDisabled,
    itemColor: "#0000",
    itemColorHover: "#0000",
    itemColorPressed: "#0000",
    itemColorActive: "#0000",
    itemColorActiveHover: "#0000",
    itemColorDisabled: inputColorDisabled,
    itemBorder: "1px solid #0000",
    itemBorderHover: "1px solid #0000",
    itemBorderPressed: "1px solid #0000",
    itemBorderActive: `1px solid ${primaryColor}`,
    itemBorderDisabled: `1px solid ${borderColor}`,
    itemBorderRadius: borderRadius,
    itemSizeSmall: heightTiny,
    itemSizeMedium: heightSmall,
    itemSizeLarge: heightMedium,
    itemFontSizeSmall: fontSizeTiny,
    itemFontSizeMedium: fontSizeSmall,
    itemFontSizeLarge: fontSizeMedium,
    jumperFontSizeSmall: fontSizeTiny,
    jumperFontSizeMedium: fontSizeSmall,
    jumperFontSizeLarge: fontSizeMedium,
    jumperTextColor: textColor2,
    jumperTextColorDisabled: textColorDisabled
  });
}
const paginationDark = {
  name: "Pagination",
  common: derived$1,
  peers: {
    Select: selectDark,
    Input: inputDark,
    Popselect: popselect
  },
  self(vars) {
    const {
      primaryColor,
      opacity3
    } = vars;
    const borderColorActive = changeColor(primaryColor, {
      alpha: Number(opacity3)
    });
    const commonSelf = self$w(vars);
    commonSelf.itemBorderActive = `1px solid ${borderColorActive}`;
    commonSelf.itemBorderDisabled = "1px solid #0000";
    return commonSelf;
  }
};
const commonVariables$a = {
  padding: "4px 0",
  optionIconSizeSmall: "14px",
  optionIconSizeMedium: "16px",
  optionIconSizeLarge: "16px",
  optionIconSizeHuge: "18px",
  optionSuffixWidthSmall: "14px",
  optionSuffixWidthMedium: "14px",
  optionSuffixWidthLarge: "16px",
  optionSuffixWidthHuge: "16px",
  optionIconSuffixWidthSmall: "32px",
  optionIconSuffixWidthMedium: "32px",
  optionIconSuffixWidthLarge: "36px",
  optionIconSuffixWidthHuge: "36px",
  optionPrefixWidthSmall: "14px",
  optionPrefixWidthMedium: "14px",
  optionPrefixWidthLarge: "16px",
  optionPrefixWidthHuge: "16px",
  optionIconPrefixWidthSmall: "36px",
  optionIconPrefixWidthMedium: "36px",
  optionIconPrefixWidthLarge: "40px",
  optionIconPrefixWidthHuge: "40px"
};
function self$v(vars) {
  const {
    primaryColor,
    textColor2,
    dividerColor,
    hoverColor,
    popoverColor,
    invertedColor,
    borderRadius,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    fontSizeHuge,
    heightSmall,
    heightMedium,
    heightLarge,
    heightHuge,
    textColor3,
    opacityDisabled
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$a), {
    optionHeightSmall: heightSmall,
    optionHeightMedium: heightMedium,
    optionHeightLarge: heightLarge,
    optionHeightHuge: heightHuge,
    borderRadius,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    fontSizeHuge,
    // non-inverted
    optionTextColor: textColor2,
    optionTextColorHover: textColor2,
    optionTextColorActive: primaryColor,
    optionTextColorChildActive: primaryColor,
    color: popoverColor,
    dividerColor,
    suffixColor: textColor2,
    prefixColor: textColor2,
    optionColorHover: hoverColor,
    optionColorActive: changeColor(primaryColor, {
      alpha: 0.1
    }),
    groupHeaderTextColor: textColor3,
    // inverted
    optionTextColorInverted: "#BBB",
    optionTextColorHoverInverted: "#FFF",
    optionTextColorActiveInverted: "#FFF",
    optionTextColorChildActiveInverted: "#FFF",
    colorInverted: invertedColor,
    dividerColorInverted: "#BBB",
    suffixColorInverted: "#BBB",
    prefixColorInverted: "#BBB",
    optionColorHoverInverted: primaryColor,
    optionColorActiveInverted: primaryColor,
    groupHeaderTextColorInverted: "#AAA",
    optionOpacityDisabled: opacityDisabled
  });
}
const dropdownDark = {
  name: "Dropdown",
  common: derived$1,
  peers: {
    Popover: popoverDark
  },
  self(vars) {
    const {
      primaryColorSuppl,
      primaryColor,
      popoverColor
    } = vars;
    const commonSelf = self$v(vars);
    commonSelf.colorInverted = popoverColor;
    commonSelf.optionColorActive = changeColor(primaryColor, {
      alpha: 0.15
    });
    commonSelf.optionColorActiveInverted = primaryColorSuppl;
    commonSelf.optionColorHoverInverted = primaryColorSuppl;
    return commonSelf;
  }
};
const commonVars$9 = {
  padding: "8px 14px"
};
const tooltipDark = {
  name: "Tooltip",
  common: derived$1,
  peers: {
    Popover: popoverDark
  },
  self(vars) {
    const {
      borderRadius,
      boxShadow2,
      popoverColor,
      textColor2
    } = vars;
    return Object.assign(Object.assign({}, commonVars$9), {
      borderRadius,
      boxShadow: boxShadow2,
      color: popoverColor,
      textColor: textColor2
    });
  }
};
const ellipsisDark = {
  name: "Ellipsis",
  common: derived$1,
  peers: {
    Tooltip: tooltipDark
  }
};
const commonVariables$9 = {
  radioSizeSmall: "14px",
  radioSizeMedium: "16px",
  radioSizeLarge: "18px",
  labelPadding: "0 8px",
  labelFontWeight: "400"
};
const radioDark = {
  name: "Radio",
  common: derived$1,
  self(vars) {
    const {
      borderColor,
      primaryColor,
      baseColor,
      textColorDisabled,
      inputColorDisabled,
      textColor2,
      opacityDisabled,
      borderRadius,
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      heightSmall,
      heightMedium,
      heightLarge,
      lineHeight: lineHeight2
    } = vars;
    return Object.assign(Object.assign({}, commonVariables$9), {
      labelLineHeight: lineHeight2,
      buttonHeightSmall: heightSmall,
      buttonHeightMedium: heightMedium,
      buttonHeightLarge: heightLarge,
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      boxShadow: `inset 0 0 0 1px ${borderColor}`,
      boxShadowActive: `inset 0 0 0 1px ${primaryColor}`,
      boxShadowFocus: `inset 0 0 0 1px ${primaryColor}, 0 0 0 2px ${changeColor(primaryColor, {
        alpha: 0.3
      })}`,
      boxShadowHover: `inset 0 0 0 1px ${primaryColor}`,
      boxShadowDisabled: `inset 0 0 0 1px ${borderColor}`,
      color: "#0000",
      colorDisabled: inputColorDisabled,
      colorActive: "#0000",
      textColor: textColor2,
      textColorDisabled,
      dotColorActive: primaryColor,
      dotColorDisabled: borderColor,
      buttonBorderColor: borderColor,
      buttonBorderColorActive: primaryColor,
      buttonBorderColorHover: primaryColor,
      buttonColor: "#0000",
      buttonColorActive: primaryColor,
      buttonTextColor: textColor2,
      buttonTextColorActive: baseColor,
      buttonTextColorHover: primaryColor,
      opacityDisabled,
      buttonBoxShadowFocus: `inset 0 0 0 1px ${primaryColor}, 0 0 0 2px ${changeColor(primaryColor, {
        alpha: 0.3
      })}`,
      buttonBoxShadowHover: `inset 0 0 0 1px ${primaryColor}`,
      buttonBoxShadow: "inset 0 0 0 1px #0000",
      buttonBorderRadius: borderRadius
    });
  }
};
const commonVariables$8 = {
  thPaddingSmall: "8px",
  thPaddingMedium: "12px",
  thPaddingLarge: "12px",
  tdPaddingSmall: "8px",
  tdPaddingMedium: "12px",
  tdPaddingLarge: "12px",
  sorterSize: "15px",
  resizableContainerSize: "8px",
  resizableSize: "2px",
  filterSize: "15px",
  paginationMargin: "12px 0 0 0",
  emptyPadding: "48px 0",
  actionPadding: "8px 12px",
  actionButtonMargin: "0 8px 0 0"
};
function self$u(vars) {
  const {
    cardColor,
    modalColor,
    popoverColor,
    textColor2,
    textColor1,
    tableHeaderColor,
    tableColorHover,
    iconColor,
    primaryColor,
    fontWeightStrong,
    borderRadius,
    lineHeight: lineHeight2,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    dividerColor,
    heightSmall,
    opacityDisabled,
    tableColorStriped
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$8), {
    actionDividerColor: dividerColor,
    lineHeight: lineHeight2,
    borderRadius,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    borderColor: composite(cardColor, dividerColor),
    tdColorHover: composite(cardColor, tableColorHover),
    tdColorSorting: composite(cardColor, tableColorHover),
    tdColorStriped: composite(cardColor, tableColorStriped),
    thColor: composite(cardColor, tableHeaderColor),
    thColorHover: composite(composite(cardColor, tableHeaderColor), tableColorHover),
    thColorSorting: composite(composite(cardColor, tableHeaderColor), tableColorHover),
    tdColor: cardColor,
    tdTextColor: textColor2,
    thTextColor: textColor1,
    thFontWeight: fontWeightStrong,
    thButtonColorHover: tableColorHover,
    thIconColor: iconColor,
    thIconColorActive: primaryColor,
    // modal
    borderColorModal: composite(modalColor, dividerColor),
    tdColorHoverModal: composite(modalColor, tableColorHover),
    tdColorSortingModal: composite(modalColor, tableColorHover),
    tdColorStripedModal: composite(modalColor, tableColorStriped),
    thColorModal: composite(modalColor, tableHeaderColor),
    thColorHoverModal: composite(composite(modalColor, tableHeaderColor), tableColorHover),
    thColorSortingModal: composite(composite(modalColor, tableHeaderColor), tableColorHover),
    tdColorModal: modalColor,
    // popover
    borderColorPopover: composite(popoverColor, dividerColor),
    tdColorHoverPopover: composite(popoverColor, tableColorHover),
    tdColorSortingPopover: composite(popoverColor, tableColorHover),
    tdColorStripedPopover: composite(popoverColor, tableColorStriped),
    thColorPopover: composite(popoverColor, tableHeaderColor),
    thColorHoverPopover: composite(composite(popoverColor, tableHeaderColor), tableColorHover),
    thColorSortingPopover: composite(composite(popoverColor, tableHeaderColor), tableColorHover),
    tdColorPopover: popoverColor,
    boxShadowBefore: "inset -12px 0 8px -12px rgba(0, 0, 0, .18)",
    boxShadowAfter: "inset 12px 0 8px -12px rgba(0, 0, 0, .18)",
    // loading
    loadingColor: primaryColor,
    loadingSize: heightSmall,
    opacityLoading: opacityDisabled
  });
}
const dataTableDark = {
  name: "DataTable",
  common: derived$1,
  peers: {
    Button: buttonDark,
    Checkbox: checkboxDark,
    Radio: radioDark,
    Pagination: paginationDark,
    Scrollbar: scrollbarDark,
    Empty: emptyDark,
    Popover: popoverDark,
    Ellipsis: ellipsisDark,
    Dropdown: dropdownDark
  },
  self(vars) {
    const commonSelf = self$u(vars);
    commonSelf.boxShadowAfter = "inset 12px 0 8px -12px rgba(0, 0, 0, .36)";
    commonSelf.boxShadowBefore = "inset -12px 0 8px -12px rgba(0, 0, 0, .36)";
    return commonSelf;
  }
};
function self$t(vars) {
  const {
    textColorBase,
    opacity1,
    opacity2,
    opacity3,
    opacity4,
    opacity5
  } = vars;
  return {
    color: textColorBase,
    opacity1Depth: opacity1,
    opacity2Depth: opacity2,
    opacity3Depth: opacity3,
    opacity4Depth: opacity4,
    opacity5Depth: opacity5
  };
}
const iconLight = {
  common: derived,
  self: self$t
};
const iconDark$1 = {
  name: "Icon",
  common: derived$1,
  self: self$t
};
const commonVars$8 = {
  itemFontSize: "12px",
  itemHeight: "36px",
  itemWidth: "52px",
  panelActionPadding: "8px 0"
};
function self$s(vars) {
  const {
    popoverColor,
    textColor2,
    primaryColor,
    hoverColor,
    dividerColor,
    opacityDisabled,
    boxShadow2,
    borderRadius,
    iconColor,
    iconColorDisabled
  } = vars;
  return Object.assign(Object.assign({}, commonVars$8), {
    panelColor: popoverColor,
    panelBoxShadow: boxShadow2,
    panelDividerColor: dividerColor,
    itemTextColor: textColor2,
    itemTextColorActive: primaryColor,
    itemColorHover: hoverColor,
    itemOpacityDisabled: opacityDisabled,
    itemBorderRadius: borderRadius,
    borderRadius,
    iconColor,
    iconColorDisabled
  });
}
const timePickerDark = {
  name: "TimePicker",
  common: derived$1,
  peers: {
    Scrollbar: scrollbarDark,
    Button: buttonDark,
    Input: inputDark
  },
  self: self$s
};
const commonVars$7 = {
  itemSize: "24px",
  itemCellWidth: "38px",
  itemCellHeight: "32px",
  scrollItemWidth: "80px",
  scrollItemHeight: "40px",
  panelExtraFooterPadding: "8px 12px",
  panelActionPadding: "8px 12px",
  calendarTitlePadding: "0",
  calendarTitleHeight: "28px",
  arrowSize: "14px",
  panelHeaderPadding: "8px 12px",
  calendarDaysHeight: "32px",
  calendarTitleGridTempateColumns: "28px 28px 1fr 28px 28px",
  // type
  calendarLeftPaddingDate: "6px 12px 4px 12px",
  calendarLeftPaddingDatetime: "4px 12px",
  calendarLeftPaddingDaterange: "6px 12px 4px 12px",
  calendarLeftPaddingDatetimerange: "4px 12px",
  calendarLeftPaddingMonth: "0",
  // TODO: make it actually effective
  calendarLeftPaddingYear: "0",
  calendarLeftPaddingQuarter: "0",
  calendarLeftPaddingMonthrange: "0",
  calendarLeftPaddingQuarterrange: "0",
  calendarLeftPaddingYearrange: "0",
  calendarLeftPaddingWeek: "6px 12px 4px 12px",
  calendarRightPaddingDate: "6px 12px 4px 12px",
  calendarRightPaddingDatetime: "4px 12px",
  calendarRightPaddingDaterange: "6px 12px 4px 12px",
  calendarRightPaddingDatetimerange: "4px 12px",
  calendarRightPaddingMonth: "0",
  calendarRightPaddingYear: "0",
  calendarRightPaddingQuarter: "0",
  calendarRightPaddingMonthrange: "0",
  calendarRightPaddingQuarterrange: "0",
  calendarRightPaddingYearrange: "0",
  calendarRightPaddingWeek: "0"
};
function self$r(vars) {
  const {
    hoverColor,
    fontSize: fontSize2,
    textColor2,
    textColorDisabled,
    popoverColor,
    primaryColor,
    borderRadiusSmall,
    iconColor,
    iconColorDisabled,
    textColor1,
    dividerColor,
    boxShadow2,
    borderRadius,
    fontWeightStrong
  } = vars;
  return Object.assign(Object.assign({}, commonVars$7), {
    itemFontSize: fontSize2,
    calendarDaysFontSize: fontSize2,
    calendarTitleFontSize: fontSize2,
    itemTextColor: textColor2,
    itemTextColorDisabled: textColorDisabled,
    itemTextColorActive: popoverColor,
    itemTextColorCurrent: primaryColor,
    itemColorIncluded: changeColor(primaryColor, {
      alpha: 0.1
    }),
    itemColorHover: hoverColor,
    itemColorDisabled: hoverColor,
    itemColorActive: primaryColor,
    itemBorderRadius: borderRadiusSmall,
    panelColor: popoverColor,
    panelTextColor: textColor2,
    arrowColor: iconColor,
    calendarTitleTextColor: textColor1,
    calendarTitleColorHover: hoverColor,
    calendarDaysTextColor: textColor2,
    panelHeaderDividerColor: dividerColor,
    calendarDaysDividerColor: dividerColor,
    calendarDividerColor: dividerColor,
    panelActionDividerColor: dividerColor,
    panelBoxShadow: boxShadow2,
    panelBorderRadius: borderRadius,
    calendarTitleFontWeight: fontWeightStrong,
    scrollItemBorderRadius: borderRadius,
    iconColor,
    iconColorDisabled
  });
}
const datePickerDark = {
  name: "DatePicker",
  common: derived$1,
  peers: {
    Input: inputDark,
    Button: buttonDark,
    TimePicker: timePickerDark,
    Scrollbar: scrollbarDark
  },
  self(vars) {
    const {
      popoverColor,
      hoverColor,
      primaryColor
    } = vars;
    const commonSelf = self$r(vars);
    commonSelf.itemColorDisabled = composite(popoverColor, hoverColor);
    commonSelf.itemColorIncluded = changeColor(primaryColor, {
      alpha: 0.15
    });
    commonSelf.itemColorHover = composite(popoverColor, hoverColor);
    return commonSelf;
  }
};
const commonVariables$7 = {
  thPaddingBorderedSmall: "8px 12px",
  thPaddingBorderedMedium: "12px 16px",
  thPaddingBorderedLarge: "16px 24px",
  thPaddingSmall: "0",
  thPaddingMedium: "0",
  thPaddingLarge: "0",
  tdPaddingBorderedSmall: "8px 12px",
  tdPaddingBorderedMedium: "12px 16px",
  tdPaddingBorderedLarge: "16px 24px",
  tdPaddingSmall: "0 0 8px 0",
  tdPaddingMedium: "0 0 12px 0",
  tdPaddingLarge: "0 0 16px 0"
};
function self$q(vars) {
  const {
    tableHeaderColor,
    textColor2,
    textColor1,
    cardColor,
    modalColor,
    popoverColor,
    dividerColor,
    borderRadius,
    fontWeightStrong,
    lineHeight: lineHeight2,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$7), {
    lineHeight: lineHeight2,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    titleTextColor: textColor1,
    thColor: composite(cardColor, tableHeaderColor),
    thColorModal: composite(modalColor, tableHeaderColor),
    thColorPopover: composite(popoverColor, tableHeaderColor),
    thTextColor: textColor1,
    thFontWeight: fontWeightStrong,
    tdTextColor: textColor2,
    tdColor: cardColor,
    tdColorModal: modalColor,
    tdColorPopover: popoverColor,
    borderColor: composite(cardColor, dividerColor),
    borderColorModal: composite(modalColor, dividerColor),
    borderColorPopover: composite(popoverColor, dividerColor),
    borderRadius
  });
}
const descriptionsDark = {
  name: "Descriptions",
  common: derived$1,
  self: self$q
};
const dialogProviderInjectionKey = createInjectionKey("n-dialog-provider");
const dialogApiInjectionKey = createInjectionKey("n-dialog-api");
const dialogReactiveListInjectionKey = createInjectionKey("n-dialog-reactive-list");
const commonVars$6 = {
  titleFontSize: "18px",
  padding: "16px 28px 20px 28px",
  iconSize: "28px",
  actionSpace: "12px",
  contentMargin: "8px 0 16px 0",
  iconMargin: "0 4px 0 0",
  iconMarginIconTop: "4px 0 8px 0",
  closeSize: "22px",
  closeIconSize: "18px",
  closeMargin: "20px 26px 0 0",
  closeMarginIconTop: "10px 16px 0 0"
};
function self$p(vars) {
  const {
    textColor1,
    textColor2,
    modalColor,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    closeColorHover,
    closeColorPressed,
    infoColor,
    successColor,
    warningColor,
    errorColor,
    primaryColor,
    dividerColor,
    borderRadius,
    fontWeightStrong,
    lineHeight: lineHeight2,
    fontSize: fontSize2
  } = vars;
  return Object.assign(Object.assign({}, commonVars$6), {
    fontSize: fontSize2,
    lineHeight: lineHeight2,
    border: `1px solid ${dividerColor}`,
    titleTextColor: textColor1,
    textColor: textColor2,
    color: modalColor,
    closeColorHover,
    closeColorPressed,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    closeBorderRadius: borderRadius,
    iconColor: primaryColor,
    iconColorInfo: infoColor,
    iconColorSuccess: successColor,
    iconColorWarning: warningColor,
    iconColorError: errorColor,
    borderRadius,
    titleFontWeight: fontWeightStrong
  });
}
const dialogLight = createTheme({
  name: "Dialog",
  common: derived,
  peers: {
    Button: buttonLight
  },
  self: self$p
});
const dialogDark = {
  name: "Dialog",
  common: derived$1,
  peers: {
    Button: buttonDark
  },
  self: self$p
};
const dialogProps = {
  icon: Function,
  type: {
    type: String,
    default: "default"
  },
  title: [String, Function],
  closable: {
    type: Boolean,
    default: true
  },
  negativeText: String,
  positiveText: String,
  positiveButtonProps: Object,
  negativeButtonProps: Object,
  content: [String, Function],
  action: Function,
  showIcon: {
    type: Boolean,
    default: true
  },
  loading: Boolean,
  bordered: Boolean,
  iconPlacement: String,
  titleClass: [String, Array],
  titleStyle: [String, Object],
  contentClass: [String, Array],
  contentStyle: [String, Object],
  actionClass: [String, Array],
  actionStyle: [String, Object],
  onPositiveClick: Function,
  onNegativeClick: Function,
  onClose: Function
};
const dialogPropKeys = keysOf(dialogProps);
const style$1 = c([cB("dialog", `
 --n-icon-margin: var(--n-icon-margin-top) var(--n-icon-margin-right) var(--n-icon-margin-bottom) var(--n-icon-margin-left);
 word-break: break-word;
 line-height: var(--n-line-height);
 position: relative;
 background: var(--n-color);
 color: var(--n-text-color);
 box-sizing: border-box;
 margin: auto;
 border-radius: var(--n-border-radius);
 padding: var(--n-padding);
 transition: 
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `, [cE("icon", {
  color: "var(--n-icon-color)"
}), cM("bordered", {
  border: "var(--n-border)"
}), cM("icon-top", [cE("close", {
  margin: "var(--n-close-margin)"
}), cE("icon", {
  margin: "var(--n-icon-margin)"
}), cE("content", {
  textAlign: "center"
}), cE("title", {
  justifyContent: "center"
}), cE("action", {
  justifyContent: "center"
})]), cM("icon-left", [cE("icon", {
  margin: "var(--n-icon-margin)"
}), cM("closable", [cE("title", `
 padding-right: calc(var(--n-close-size) + 6px);
 `)])]), cE("close", `
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 z-index: 1;
 `), cE("content", `
 font-size: var(--n-font-size);
 margin: var(--n-content-margin);
 position: relative;
 word-break: break-word;
 `, [cM("last", "margin-bottom: 0;")]), cE("action", `
 display: flex;
 justify-content: flex-end;
 `, [c("> *:not(:last-child)", `
 margin-right: var(--n-action-space);
 `)]), cE("icon", `
 font-size: var(--n-icon-size);
 transition: color .3s var(--n-bezier);
 `), cE("title", `
 transition: color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 font-size: var(--n-title-font-size);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `), cB("dialog-icon-container", `
 display: flex;
 justify-content: center;
 `)]), insideModal(cB("dialog", `
 width: 446px;
 max-width: calc(100vw - 32px);
 `)), cB("dialog", [asModal(`
 width: 446px;
 max-width: calc(100vw - 32px);
 `)])]);
const iconRenderMap = {
  default: () => h(InfoIcon, null),
  info: () => h(InfoIcon, null),
  success: () => h(SuccessIcon, null),
  warning: () => h(WarningIcon, null),
  error: () => h(ErrorIcon, null)
};
const NDialog = defineComponent({
  name: "Dialog",
  alias: [
    "NimbusConfirmCard",
    // deprecated
    "Confirm"
    // deprecated
  ],
  props: Object.assign(Object.assign({}, useTheme.props), dialogProps),
  slots: Object,
  setup(props) {
    const {
      mergedComponentPropsRef,
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("Dialog", mergedRtlRef, mergedClsPrefixRef);
    const mergedIconPlacementRef = computed(() => {
      var _a, _b;
      const {
        iconPlacement
      } = props;
      return iconPlacement || ((_b = (_a = mergedComponentPropsRef === null || mergedComponentPropsRef === undefined ? undefined : mergedComponentPropsRef.value) === null || _a === undefined ? undefined : _a.Dialog) === null || _b === undefined ? undefined : _b.iconPlacement) || "left";
    });
    function handlePositiveClick(e) {
      const {
        onPositiveClick
      } = props;
      if (onPositiveClick) onPositiveClick(e);
    }
    function handleNegativeClick(e) {
      const {
        onNegativeClick
      } = props;
      if (onNegativeClick) onNegativeClick(e);
    }
    function handleCloseClick() {
      const {
        onClose
      } = props;
      if (onClose) onClose();
    }
    const themeRef = useTheme("Dialog", "-dialog", style$1, dialogLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        type
      } = props;
      const iconPlacement = mergedIconPlacementRef.value;
      const {
        common: {
          cubicBezierEaseInOut: cubicBezierEaseInOut2
        },
        self: {
          fontSize: fontSize2,
          lineHeight: lineHeight2,
          border,
          titleTextColor,
          textColor,
          color,
          closeBorderRadius,
          closeColorHover,
          closeColorPressed,
          closeIconColor,
          closeIconColorHover,
          closeIconColorPressed,
          closeIconSize,
          borderRadius,
          titleFontWeight,
          titleFontSize,
          padding,
          iconSize,
          actionSpace,
          contentMargin,
          closeSize,
          [iconPlacement === "top" ? "iconMarginIconTop" : "iconMargin"]: iconMargin,
          [iconPlacement === "top" ? "closeMarginIconTop" : "closeMargin"]: closeMargin,
          [createKey("iconColor", type)]: iconColor
        }
      } = themeRef.value;
      const iconMarginDiscrete = getMargin(iconMargin);
      return {
        "--n-font-size": fontSize2,
        "--n-icon-color": iconColor,
        "--n-bezier": cubicBezierEaseInOut2,
        "--n-close-margin": closeMargin,
        "--n-icon-margin-top": iconMarginDiscrete.top,
        "--n-icon-margin-right": iconMarginDiscrete.right,
        "--n-icon-margin-bottom": iconMarginDiscrete.bottom,
        "--n-icon-margin-left": iconMarginDiscrete.left,
        "--n-icon-size": iconSize,
        "--n-close-size": closeSize,
        "--n-close-icon-size": closeIconSize,
        "--n-close-border-radius": closeBorderRadius,
        "--n-close-color-hover": closeColorHover,
        "--n-close-color-pressed": closeColorPressed,
        "--n-close-icon-color": closeIconColor,
        "--n-close-icon-color-hover": closeIconColorHover,
        "--n-close-icon-color-pressed": closeIconColorPressed,
        "--n-color": color,
        "--n-text-color": textColor,
        "--n-border-radius": borderRadius,
        "--n-padding": padding,
        "--n-line-height": lineHeight2,
        "--n-border": border,
        "--n-content-margin": contentMargin,
        "--n-title-font-size": titleFontSize,
        "--n-title-font-weight": titleFontWeight,
        "--n-title-text-color": titleTextColor,
        "--n-action-space": actionSpace
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("dialog", computed(() => `${props.type[0]}${mergedIconPlacementRef.value[0]}`), cssVarsRef, props) : undefined;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      mergedIconPlacement: mergedIconPlacementRef,
      mergedTheme: themeRef,
      handlePositiveClick,
      handleNegativeClick,
      handleCloseClick,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    };
  },
  render() {
    var _a;
    const {
      bordered,
      mergedIconPlacement,
      cssVars,
      closable,
      showIcon,
      title,
      content,
      action,
      negativeText,
      positiveText,
      positiveButtonProps,
      negativeButtonProps,
      handlePositiveClick,
      handleNegativeClick,
      mergedTheme,
      loading,
      type,
      mergedClsPrefix
    } = this;
    (_a = this.onRender) === null || _a === undefined ? undefined : _a.call(this);
    const icon = showIcon ? h(NBaseIcon, {
      clsPrefix: mergedClsPrefix,
      class: `${mergedClsPrefix}-dialog__icon`
    }, {
      default: () => resolveWrappedSlot(this.$slots.icon, (children) => children || (this.icon ? render(this.icon) : iconRenderMap[this.type]()))
    }) : null;
    const actionNode = resolveWrappedSlot(this.$slots.action, (children) => children || positiveText || negativeText || action ? h("div", {
      class: [`${mergedClsPrefix}-dialog__action`, this.actionClass],
      style: this.actionStyle
    }, children || (action ? [render(action)] : [this.negativeText && h(Button, Object.assign({
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      ghost: true,
      size: "small",
      onClick: handleNegativeClick
    }, negativeButtonProps), {
      default: () => render(this.negativeText)
    }), this.positiveText && h(Button, Object.assign({
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      size: "small",
      type: type === "default" ? "primary" : type,
      disabled: loading,
      loading,
      onClick: handlePositiveClick
    }, positiveButtonProps), {
      default: () => render(this.positiveText)
    })])) : null);
    return h("div", {
      class: [`${mergedClsPrefix}-dialog`, this.themeClass, this.closable && `${mergedClsPrefix}-dialog--closable`, `${mergedClsPrefix}-dialog--icon-${mergedIconPlacement}`, bordered && `${mergedClsPrefix}-dialog--bordered`, this.rtlEnabled && `${mergedClsPrefix}-dialog--rtl`],
      style: cssVars,
      role: "dialog"
    }, closable ? resolveWrappedSlot(this.$slots.close, (node) => {
      const classNames = [`${mergedClsPrefix}-dialog__close`, this.rtlEnabled && `${mergedClsPrefix}-dialog--rtl`];
      return node ? h("div", {
        class: classNames
      }, node) : h(NBaseClose, {
        clsPrefix: mergedClsPrefix,
        class: classNames,
        onClick: this.handleCloseClick
      });
    }) : null, showIcon && mergedIconPlacement === "top" ? h("div", {
      class: `${mergedClsPrefix}-dialog-icon-container`
    }, icon) : null, h("div", {
      class: [`${mergedClsPrefix}-dialog__title`, this.titleClass],
      style: this.titleStyle
    }, showIcon && mergedIconPlacement === "left" ? icon : null, resolveSlot(this.$slots.header, () => [render(title)])), h("div", {
      class: [`${mergedClsPrefix}-dialog__content`, actionNode ? "" : `${mergedClsPrefix}-dialog__content--last`, this.contentClass],
      style: this.contentStyle
    }, resolveSlot(this.$slots.default, () => [render(content)])), actionNode);
  }
});
function self$o(vars) {
  const {
    modalColor,
    textColor2,
    boxShadow3
  } = vars;
  return {
    color: modalColor,
    textColor: textColor2,
    boxShadow: boxShadow3
  };
}
const modalLight = createTheme({
  name: "Modal",
  common: derived,
  peers: {
    Scrollbar: scrollbarLight,
    Dialog: dialogLight,
    Card: cardLight
  },
  self: self$o
});
const modalDark = {
  name: "Modal",
  common: derived$1,
  peers: {
    Scrollbar: scrollbarDark,
    Dialog: dialogDark,
    Card: cardDark
  },
  self: self$o
};
const DRAGGABLE_CLASS = "n-draggable";
function useDragModal(draggablePropsRef, options) {
  let cleanup;
  const draggableRef = computed(() => {
    return draggablePropsRef.value !== false;
  });
  const draggableClassRef = computed(() => {
    return draggableRef.value ? DRAGGABLE_CLASS : "";
  });
  const boundsToWindowRef = computed(() => {
    const draggableProps = draggablePropsRef.value;
    if (draggableProps === true || draggableProps === false) {
      return true;
    } else if (draggableProps) {
      return draggableProps.bounds !== "none";
    } else {
      return true;
    }
  });
  function startDrag(modal) {
    const header = modal.querySelector(`.${DRAGGABLE_CLASS}`);
    if (!header || !draggableClassRef.value) {
      return;
    }
    let maxMoveX = 0;
    let minMoveX = 0;
    let maxMoveY = 0;
    let minMoveY = 0;
    let prevMoveY = 0;
    let prevMoveX = 0;
    let mousedownEvent;
    function handleMouseDown(event) {
      event.preventDefault();
      mousedownEvent = event;
      const {
        x,
        y,
        right,
        bottom
      } = modal.getBoundingClientRect();
      minMoveX = x;
      minMoveY = y;
      maxMoveX = (undefined).innerWidth - right;
      maxMoveY = (undefined).innerHeight - bottom;
      const {
        left,
        top
      } = modal.style;
      prevMoveY = +top.slice(0, -2);
      prevMoveX = +left.slice(0, -2);
    }
    function handleMouseMove(event) {
      if (!mousedownEvent) return;
      const {
        clientX: downX,
        clientY: downY
      } = mousedownEvent;
      let moveX = event.clientX - downX;
      let moveY = event.clientY - downY;
      if (boundsToWindowRef.value) {
        if (moveX > maxMoveX) {
          moveX = maxMoveX;
        } else if (-moveX > minMoveX) {
          moveX = -minMoveX;
        }
        if (moveY > maxMoveY) {
          moveY = maxMoveY;
        } else if (-moveY > minMoveY) {
          moveY = -minMoveY;
        }
      }
      const x = moveX + prevMoveX;
      const y = moveY + prevMoveY;
      modal.style.top = `${y}px`;
      modal.style.left = `${x}px`;
    }
    function handleMouseUp() {
      mousedownEvent = undefined;
      options.onEnd(modal);
    }
    on("mousedown", header, handleMouseDown);
    on("mousemove", undefined, handleMouseMove);
    on("mouseup", undefined, handleMouseUp);
    cleanup = () => {
      off("mousedown", header, handleMouseDown);
      on("mousemove", undefined, handleMouseMove);
      on("mouseup", undefined, handleMouseUp);
    };
  }
  function stopDrag() {
    if (cleanup) {
      cleanup();
      cleanup = undefined;
    }
  }
  return {
    stopDrag,
    startDrag,
    draggableRef,
    draggableClassRef
  };
}
const presetProps = Object.assign(Object.assign({}, cardBaseProps), dialogProps);
const presetPropsKeys = keysOf(presetProps);
const NModalBodyWrapper = defineComponent({
  name: "ModalBody",
  inheritAttrs: false,
  slots: Object,
  props: Object.assign(Object.assign({
    show: {
      type: Boolean,
      required: true
    },
    preset: String,
    displayDirective: {
      type: String,
      required: true
    },
    trapFocus: {
      type: Boolean,
      default: true
    },
    autoFocus: {
      type: Boolean,
      default: true
    },
    blockScroll: Boolean,
    draggable: {
      type: [Boolean, Object],
      default: false
    }
  }, presetProps), {
    renderMask: Function,
    // events
    onClickoutside: Function,
    onBeforeLeave: {
      type: Function,
      required: true
    },
    onAfterLeave: {
      type: Function,
      required: true
    },
    onPositiveClick: {
      type: Function,
      required: true
    },
    onNegativeClick: {
      type: Function,
      required: true
    },
    onClose: {
      type: Function,
      required: true
    },
    onAfterEnter: Function,
    onEsc: Function
  }),
  setup(props) {
    const bodyRef = ref(null);
    const scrollbarRef = ref(null);
    const displayedRef = ref(props.show);
    const transformOriginXRef = ref(null);
    const transformOriginYRef = ref(null);
    const NModal2 = inject(modalInjectionKey);
    let mousePosition = null;
    watch(toRef(props, "show"), (value) => {
      if (value) {
        mousePosition = NModal2.getMousePosition();
      }
    }, {
      immediate: true
    });
    const {
      stopDrag,
      startDrag,
      draggableRef,
      draggableClassRef
    } = useDragModal(toRef(props, "draggable"), {
      onEnd: (el) => {
        syncTransformOrigin(el);
      }
    });
    const dialogTitleClassRef = computed(() => {
      return normalizeClass([props.titleClass, draggableClassRef.value]);
    });
    const cardHeaderClassRef = computed(() => {
      return normalizeClass([props.headerClass, draggableClassRef.value]);
    });
    watch(toRef(props, "show"), (value) => {
      if (value) displayedRef.value = true;
    });
    useLockHtmlScroll(computed(() => props.blockScroll && displayedRef.value));
    function styleTransformOrigin() {
      if (NModal2.transformOriginRef.value === "center") {
        return "";
      }
      const {
        value: transformOriginX
      } = transformOriginXRef;
      const {
        value: transformOriginY
      } = transformOriginYRef;
      if (transformOriginX === null || transformOriginY === null) {
        return "";
      } else if (scrollbarRef.value) {
        const scrollTop = scrollbarRef.value.containerScrollTop;
        return `${transformOriginX}px ${transformOriginY + scrollTop}px`;
      }
      return "";
    }
    function syncTransformOrigin(el) {
      if (NModal2.transformOriginRef.value === "center") {
        return;
      }
      if (!mousePosition) {
        return;
      }
      if (!scrollbarRef.value) return;
      const scrollTop = scrollbarRef.value.containerScrollTop;
      const {
        offsetLeft,
        offsetTop
      } = el;
      const top = mousePosition.y;
      const left = mousePosition.x;
      transformOriginXRef.value = -(offsetLeft - left);
      transformOriginYRef.value = -(offsetTop - top - scrollTop);
      el.style.transformOrigin = styleTransformOrigin();
    }
    function handleEnter(el) {
      void nextTick(() => {
        syncTransformOrigin(el);
      });
    }
    function handleBeforeLeave(el) {
      el.style.transformOrigin = styleTransformOrigin();
      props.onBeforeLeave();
    }
    function handleAfterEnter(el) {
      const element = el;
      draggableRef.value && startDrag(element);
      props.onAfterEnter && props.onAfterEnter(element);
    }
    function handleAfterLeave() {
      displayedRef.value = false;
      transformOriginXRef.value = null;
      transformOriginYRef.value = null;
      stopDrag();
      props.onAfterLeave();
    }
    function handleCloseClick() {
      const {
        onClose
      } = props;
      if (onClose) {
        onClose();
      }
    }
    function handleNegativeClick() {
      props.onNegativeClick();
    }
    function handlePositiveClick() {
      props.onPositiveClick();
    }
    const childNodeRef = ref(null);
    watch(childNodeRef, (node) => {
      if (node) {
        void nextTick(() => {
          const el = node.el;
          if (el && bodyRef.value !== el) {
            bodyRef.value = el;
          }
        });
      }
    });
    provide(modalBodyInjectionKey, bodyRef);
    provide(drawerBodyInjectionKey, null);
    provide(popoverBodyInjectionKey, null);
    return {
      mergedTheme: NModal2.mergedThemeRef,
      appear: NModal2.appearRef,
      isMounted: NModal2.isMountedRef,
      mergedClsPrefix: NModal2.mergedClsPrefixRef,
      bodyRef,
      scrollbarRef,
      draggableClass: draggableClassRef,
      displayed: displayedRef,
      childNodeRef,
      cardHeaderClass: cardHeaderClassRef,
      dialogTitleClass: dialogTitleClassRef,
      handlePositiveClick,
      handleNegativeClick,
      handleCloseClick,
      handleAfterEnter,
      handleAfterLeave,
      handleBeforeLeave,
      handleEnter
    };
  },
  render() {
    const {
      $slots,
      $attrs,
      handleEnter,
      handleAfterEnter,
      handleAfterLeave,
      handleBeforeLeave,
      preset,
      mergedClsPrefix
    } = this;
    let childNode = null;
    if (!preset) {
      childNode = getFirstSlotVNodeWithTypedProps("default", $slots.default, {
        draggableClass: this.draggableClass
      });
      if (!childNode) {
        warn("modal", "default slot is empty");
        return;
      }
      childNode = cloneVNode(childNode);
      childNode.props = mergeProps({
        class: `${mergedClsPrefix}-modal`
      }, $attrs, childNode.props || {});
    }
    return this.displayDirective === "show" || this.displayed || this.show ? withDirectives(h("div", {
      role: "none",
      class: `${mergedClsPrefix}-modal-body-wrapper`
    }, h(Scrollbar, {
      ref: "scrollbarRef",
      theme: this.mergedTheme.peers.Scrollbar,
      themeOverrides: this.mergedTheme.peerOverrides.Scrollbar,
      contentClass: `${mergedClsPrefix}-modal-scroll-content`
    }, {
      default: () => {
        var _a;
        return [(_a = this.renderMask) === null || _a === undefined ? undefined : _a.call(this), h(VFocusTrap, {
          disabled: !this.trapFocus,
          active: this.show,
          onEsc: this.onEsc,
          autoFocus: this.autoFocus
        }, {
          default: () => {
            var _a2;
            return h(Transition, {
              name: "fade-in-scale-up-transition",
              appear: (_a2 = this.appear) !== null && _a2 !== undefined ? _a2 : this.isMounted,
              onEnter: handleEnter,
              onAfterEnter: handleAfterEnter,
              onAfterLeave: handleAfterLeave,
              onBeforeLeave: handleBeforeLeave
            }, {
              default: () => {
                const dirs = [[vShow, this.show]];
                const {
                  onClickoutside
                } = this;
                if (onClickoutside) {
                  dirs.push([clickoutside, this.onClickoutside, undefined, {
                    capture: true
                  }]);
                }
                return withDirectives(this.preset === "confirm" || this.preset === "dialog" ? h(NDialog, Object.assign({}, this.$attrs, {
                  class: [`${mergedClsPrefix}-modal`, this.$attrs.class],
                  ref: "bodyRef",
                  theme: this.mergedTheme.peers.Dialog,
                  themeOverrides: this.mergedTheme.peerOverrides.Dialog
                }, keep(this.$props, dialogPropKeys), {
                  titleClass: this.dialogTitleClass,
                  "aria-modal": "true"
                }), $slots) : this.preset === "card" ? h(NCard, Object.assign({}, this.$attrs, {
                  ref: "bodyRef",
                  class: [`${mergedClsPrefix}-modal`, this.$attrs.class],
                  theme: this.mergedTheme.peers.Card,
                  themeOverrides: this.mergedTheme.peerOverrides.Card
                }, keep(this.$props, cardBasePropKeys), {
                  headerClass: this.cardHeaderClass,
                  "aria-modal": "true",
                  role: "dialog"
                }), $slots) : this.childNodeRef = childNode, dirs);
              }
            });
          }
        })];
      }
    })), [[vShow, this.displayDirective === "if" || this.displayed || this.show]]) : null;
  }
});
const style = c([cB("modal-container", `
 position: fixed;
 left: 0;
 top: 0;
 height: 0;
 width: 0;
 display: flex;
 `), cB("modal-mask", `
 position: fixed;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 background-color: rgba(0, 0, 0, .4);
 `, [fadeInTransition({
  enterDuration: ".25s",
  leaveDuration: ".25s",
  enterCubicBezier: "var(--n-bezier-ease-out)",
  leaveCubicBezier: "var(--n-bezier-ease-out)"
})]), cB("modal-body-wrapper", `
 position: fixed;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 overflow: visible;
 `, [cB("modal-scroll-content", `
 min-height: 100%;
 display: flex;
 position: relative;
 `)]), cB("modal", `
 position: relative;
 align-self: center;
 color: var(--n-text-color);
 margin: auto;
 box-shadow: var(--n-box-shadow);
 `, [fadeInScaleUpTransition({
  duration: ".25s",
  enterScale: ".5"
}), c(`.${DRAGGABLE_CLASS}`, `
 cursor: move;
 user-select: none;
 `)])]);
const modalProps = Object.assign(Object.assign(Object.assign(Object.assign({}, useTheme.props), {
  show: Boolean,
  unstableShowMask: {
    type: Boolean,
    default: true
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  preset: String,
  to: [String, Object],
  displayDirective: {
    type: String,
    default: "if"
  },
  transformOrigin: {
    type: String,
    default: "mouse"
  },
  zIndex: Number,
  autoFocus: {
    type: Boolean,
    default: true
  },
  trapFocus: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  blockScroll: {
    type: Boolean,
    default: true
  }
}), presetProps), {
  draggable: [Boolean, Object],
  // events
  onEsc: Function,
  "onUpdate:show": [Function, Array],
  onUpdateShow: [Function, Array],
  onAfterEnter: Function,
  onBeforeLeave: Function,
  onAfterLeave: Function,
  onClose: Function,
  onPositiveClick: Function,
  onNegativeClick: Function,
  onMaskClick: Function,
  // private
  internalDialog: Boolean,
  internalModal: Boolean,
  internalAppear: {
    type: Boolean,
    default: undefined
  },
  // deprecated
  overlayStyle: [String, Object],
  onBeforeHide: Function,
  onAfterHide: Function,
  onHide: Function
});
const NModal = defineComponent({
  name: "Modal",
  inheritAttrs: false,
  props: modalProps,
  slots: Object,
  setup(props) {
    const containerRef = ref(null);
    const {
      mergedClsPrefixRef,
      namespaceRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Modal", "-modal", style, modalLight, props, mergedClsPrefixRef);
    const clickedRef = useClicked(64);
    const clickedPositionRef = useClickPosition();
    const isMountedRef = useIsMounted();
    const NDialogProvider2 = props.internalDialog ? inject(dialogProviderInjectionKey, null) : null;
    const NModalProvider = props.internalModal ? inject(modalProviderInjectionKey, null) : null;
    const isComposingRef2 = useIsComposing();
    function doUpdateShow(show) {
      const {
        onUpdateShow,
        "onUpdate:show": _onUpdateShow,
        onHide
      } = props;
      if (onUpdateShow) call(onUpdateShow, show);
      if (_onUpdateShow) call(_onUpdateShow, show);
      if (onHide && !show) onHide(show);
    }
    function handleCloseClick() {
      const {
        onClose
      } = props;
      if (onClose) {
        void Promise.resolve(onClose()).then((value) => {
          if (value === false) return;
          doUpdateShow(false);
        });
      } else {
        doUpdateShow(false);
      }
    }
    function handlePositiveClick() {
      const {
        onPositiveClick
      } = props;
      if (onPositiveClick) {
        void Promise.resolve(onPositiveClick()).then((value) => {
          if (value === false) return;
          doUpdateShow(false);
        });
      } else {
        doUpdateShow(false);
      }
    }
    function handleNegativeClick() {
      const {
        onNegativeClick
      } = props;
      if (onNegativeClick) {
        void Promise.resolve(onNegativeClick()).then((value) => {
          if (value === false) return;
          doUpdateShow(false);
        });
      } else {
        doUpdateShow(false);
      }
    }
    function handleBeforeLeave() {
      const {
        onBeforeLeave,
        onBeforeHide
      } = props;
      if (onBeforeLeave) call(onBeforeLeave);
      if (onBeforeHide) onBeforeHide();
    }
    function handleAfterLeave() {
      const {
        onAfterLeave,
        onAfterHide
      } = props;
      if (onAfterLeave) call(onAfterLeave);
      if (onAfterHide) onAfterHide();
    }
    function handleClickoutside(e) {
      var _a;
      const {
        onMaskClick
      } = props;
      if (onMaskClick) {
        onMaskClick(e);
      }
      if (props.maskClosable) {
        if ((_a = containerRef.value) === null || _a === undefined ? undefined : _a.contains(getPreciseEventTarget(e))) {
          doUpdateShow(false);
        }
      }
    }
    function handleEsc(e) {
      var _a;
      (_a = props.onEsc) === null || _a === undefined ? undefined : _a.call(props);
      if (props.show && props.closeOnEsc && eventEffectNotPerformed(e)) {
        if (!isComposingRef2.value) {
          doUpdateShow(false);
        }
      }
    }
    provide(modalInjectionKey, {
      getMousePosition: () => {
        const mergedProvider = NDialogProvider2 || NModalProvider;
        if (mergedProvider) {
          const {
            clickedRef: clickedRef2,
            clickedPositionRef: clickedPositionRef2
          } = mergedProvider;
          if (clickedRef2.value && clickedPositionRef2.value) {
            return clickedPositionRef2.value;
          }
        }
        if (clickedRef.value) {
          return clickedPositionRef.value;
        }
        return null;
      },
      mergedClsPrefixRef,
      mergedThemeRef: themeRef,
      isMountedRef,
      appearRef: toRef(props, "internalAppear"),
      transformOriginRef: toRef(props, "transformOrigin")
    });
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseOut: cubicBezierEaseOut2
        },
        self: {
          boxShadow,
          color,
          textColor
        }
      } = themeRef.value;
      return {
        "--n-bezier-ease-out": cubicBezierEaseOut2,
        "--n-box-shadow": boxShadow,
        "--n-color": color,
        "--n-text-color": textColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("theme-class", undefined, cssVarsRef, props) : undefined;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      namespace: namespaceRef,
      isMounted: isMountedRef,
      containerRef,
      presetProps: computed(() => {
        const pickedProps = keep(props, presetPropsKeys);
        return pickedProps;
      }),
      handleEsc,
      handleAfterLeave,
      handleClickoutside,
      handleBeforeLeave,
      doUpdateShow,
      handleNegativeClick,
      handlePositiveClick,
      handleCloseClick,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    return h(VLazyTeleport, {
      to: this.to,
      show: this.show
    }, {
      default: () => {
        var _a;
        (_a = this.onRender) === null || _a === undefined ? undefined : _a.call(this);
        const {
          unstableShowMask
        } = this;
        return withDirectives(h("div", {
          role: "none",
          ref: "containerRef",
          class: [`${mergedClsPrefix}-modal-container`, this.themeClass, this.namespace],
          style: this.cssVars
        }, h(NModalBodyWrapper, Object.assign({
          style: this.overlayStyle
        }, this.$attrs, {
          ref: "bodyWrapper",
          displayDirective: this.displayDirective,
          show: this.show,
          preset: this.preset,
          autoFocus: this.autoFocus,
          trapFocus: this.trapFocus,
          draggable: this.draggable,
          blockScroll: this.blockScroll
        }, this.presetProps, {
          onEsc: this.handleEsc,
          onClose: this.handleCloseClick,
          onNegativeClick: this.handleNegativeClick,
          onPositiveClick: this.handlePositiveClick,
          onBeforeLeave: this.handleBeforeLeave,
          onAfterEnter: this.onAfterEnter,
          onAfterLeave: this.handleAfterLeave,
          onClickoutside: unstableShowMask ? undefined : this.handleClickoutside,
          renderMask: unstableShowMask ? () => {
            var _a2;
            return h(Transition, {
              name: "fade-in-transition",
              key: "mask",
              appear: (_a2 = this.internalAppear) !== null && _a2 !== undefined ? _a2 : this.isMounted
            }, {
              default: () => {
                return this.show ? h("div", {
                  "aria-hidden": true,
                  ref: "containerRef",
                  class: `${mergedClsPrefix}-modal-mask`,
                  onClick: this.handleClickoutside
                }) : null;
              }
            });
          } : undefined
        }), this.$slots)), [[zindexable, {
          zIndex: this.zIndex,
          enabled: this.show
        }]]);
      }
    });
  }
});
const exposedDialogEnvProps = Object.assign(Object.assign({}, dialogProps), {
  onAfterEnter: Function,
  onAfterLeave: Function,
  transformOrigin: String,
  blockScroll: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  onEsc: Function,
  autoFocus: {
    type: Boolean,
    default: true
  },
  internalStyle: [String, Object],
  maskClosable: {
    type: Boolean,
    default: true
  },
  onPositiveClick: Function,
  onNegativeClick: Function,
  onClose: Function,
  onMaskClick: Function,
  draggable: [Boolean, Object]
});
const NDialogEnvironment = defineComponent({
  name: "DialogEnvironment",
  props: Object.assign(Object.assign({}, exposedDialogEnvProps), {
    internalKey: {
      type: String,
      required: true
    },
    to: [String, Object],
    // private
    onInternalAfterLeave: {
      type: Function,
      required: true
    }
  }),
  setup(props) {
    const showRef = ref(true);
    function handleAfterLeave() {
      const {
        onInternalAfterLeave,
        internalKey,
        onAfterLeave
      } = props;
      if (onInternalAfterLeave) onInternalAfterLeave(internalKey);
      if (onAfterLeave) onAfterLeave();
    }
    function handlePositiveClick(e) {
      const {
        onPositiveClick
      } = props;
      if (onPositiveClick) {
        void Promise.resolve(onPositiveClick(e)).then((result) => {
          if (result === false) return;
          hide();
        });
      } else {
        hide();
      }
    }
    function handleNegativeClick(e) {
      const {
        onNegativeClick
      } = props;
      if (onNegativeClick) {
        void Promise.resolve(onNegativeClick(e)).then((result) => {
          if (result === false) return;
          hide();
        });
      } else {
        hide();
      }
    }
    function handleCloseClick() {
      const {
        onClose
      } = props;
      if (onClose) {
        void Promise.resolve(onClose()).then((result) => {
          if (result === false) return;
          hide();
        });
      } else {
        hide();
      }
    }
    function handleMaskClick(e) {
      const {
        onMaskClick,
        maskClosable
      } = props;
      if (onMaskClick) {
        onMaskClick(e);
        if (maskClosable) {
          hide();
        }
      }
    }
    function handleEsc() {
      const {
        onEsc
      } = props;
      if (onEsc) {
        onEsc();
      }
    }
    function hide() {
      showRef.value = false;
    }
    function handleUpdateShow(value) {
      showRef.value = value;
    }
    return {
      show: showRef,
      hide,
      handleUpdateShow,
      handleAfterLeave,
      handleCloseClick,
      handleNegativeClick,
      handlePositiveClick,
      handleMaskClick,
      handleEsc
    };
  },
  render() {
    const {
      handlePositiveClick,
      handleUpdateShow,
      handleNegativeClick,
      handleCloseClick,
      handleAfterLeave,
      handleMaskClick,
      handleEsc,
      to,
      maskClosable,
      show
    } = this;
    return h(NModal, {
      show,
      onUpdateShow: handleUpdateShow,
      onMaskClick: handleMaskClick,
      onEsc: handleEsc,
      to,
      maskClosable,
      onAfterEnter: this.onAfterEnter,
      onAfterLeave: handleAfterLeave,
      closeOnEsc: this.closeOnEsc,
      blockScroll: this.blockScroll,
      autoFocus: this.autoFocus,
      transformOrigin: this.transformOrigin,
      draggable: this.draggable,
      internalAppear: true,
      internalDialog: true
    }, {
      default: ({
        draggableClass
      }) => h(NDialog, Object.assign({}, keep(this.$props, dialogPropKeys), {
        titleClass: normalizeClass([this.titleClass, draggableClass]),
        style: this.internalStyle,
        onClose: handleCloseClick,
        onNegativeClick: handleNegativeClick,
        onPositiveClick: handlePositiveClick
      }))
    });
  }
});
const dialogProviderProps = {
  injectionKey: String,
  to: [String, Object]
};
const NDialogProvider = defineComponent({
  name: "DialogProvider",
  props: dialogProviderProps,
  setup() {
    const dialogListRef = ref([]);
    const dialogInstRefs = {};
    function create(options = {}) {
      const key = createId();
      const dialogReactive = reactive(Object.assign(Object.assign({}, options), {
        key,
        destroy: () => {
          var _a;
          (_a = dialogInstRefs[`n-dialog-${key}`]) === null || _a === undefined ? undefined : _a.hide();
        }
      }));
      dialogListRef.value.push(dialogReactive);
      return dialogReactive;
    }
    const typedApi = ["info", "success", "warning", "error"].map((type) => (options) => {
      return create(Object.assign(Object.assign({}, options), {
        type
      }));
    });
    function handleAfterLeave(key) {
      const {
        value: dialogList
      } = dialogListRef;
      dialogList.splice(dialogList.findIndex((dialog) => dialog.key === key), 1);
    }
    function destroyAll() {
      Object.values(dialogInstRefs).forEach((dialogInstRef) => {
        dialogInstRef === null || dialogInstRef === undefined ? undefined : dialogInstRef.hide();
      });
    }
    const api = {
      create,
      destroyAll,
      info: typedApi[0],
      success: typedApi[1],
      warning: typedApi[2],
      error: typedApi[3]
    };
    provide(dialogApiInjectionKey, api);
    provide(dialogProviderInjectionKey, {
      clickedRef: useClicked(64),
      clickedPositionRef: useClickPosition()
    });
    provide(dialogReactiveListInjectionKey, dialogListRef);
    return Object.assign(Object.assign({}, api), {
      dialogList: dialogListRef,
      dialogInstRefs,
      handleAfterLeave
    });
  },
  render() {
    var _a, _b;
    return h(Fragment, null, [this.dialogList.map((dialog) => h(NDialogEnvironment, omit(dialog, ["destroy", "style"], {
      internalStyle: dialog.style,
      to: this.to,
      ref: (inst) => {
        if (inst === null) {
          delete this.dialogInstRefs[`n-dialog-${dialog.key}`];
        } else {
          this.dialogInstRefs[`n-dialog-${dialog.key}`] = inst;
        }
      },
      internalKey: dialog.key,
      onInternalAfterLeave: this.handleAfterLeave
    }))), (_b = (_a = this.$slots).default) === null || _b === undefined ? undefined : _b.call(_a)]);
  }
});
const loadingBarDark = {
  name: "LoadingBar",
  common: derived$1,
  self(vars) {
    const {
      primaryColor
    } = vars;
    return {
      colorError: "red",
      colorLoading: primaryColor,
      height: "2px"
    };
  }
};
const commonVariables$6 = {
  margin: "0 0 8px 0",
  padding: "10px 20px",
  maxWidth: "720px",
  minWidth: "420px",
  iconMargin: "0 10px 0 0",
  closeMargin: "0 0 0 10px",
  closeSize: "20px",
  closeIconSize: "16px",
  iconSize: "20px",
  fontSize: "14px"
};
function self$n(vars) {
  const {
    textColor2,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    infoColor,
    successColor,
    errorColor,
    warningColor,
    popoverColor,
    boxShadow2,
    primaryColor,
    lineHeight: lineHeight2,
    borderRadius,
    closeColorHover,
    closeColorPressed
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$6), {
    closeBorderRadius: borderRadius,
    textColor: textColor2,
    textColorInfo: textColor2,
    textColorSuccess: textColor2,
    textColorError: textColor2,
    textColorWarning: textColor2,
    textColorLoading: textColor2,
    color: popoverColor,
    colorInfo: popoverColor,
    colorSuccess: popoverColor,
    colorError: popoverColor,
    colorWarning: popoverColor,
    colorLoading: popoverColor,
    boxShadow: boxShadow2,
    boxShadowInfo: boxShadow2,
    boxShadowSuccess: boxShadow2,
    boxShadowError: boxShadow2,
    boxShadowWarning: boxShadow2,
    boxShadowLoading: boxShadow2,
    iconColor: textColor2,
    iconColorInfo: infoColor,
    iconColorSuccess: successColor,
    iconColorWarning: warningColor,
    iconColorError: errorColor,
    iconColorLoading: primaryColor,
    closeColorHover,
    closeColorPressed,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    closeColorHoverInfo: closeColorHover,
    closeColorPressedInfo: closeColorPressed,
    closeIconColorInfo: closeIconColor,
    closeIconColorHoverInfo: closeIconColorHover,
    closeIconColorPressedInfo: closeIconColorPressed,
    closeColorHoverSuccess: closeColorHover,
    closeColorPressedSuccess: closeColorPressed,
    closeIconColorSuccess: closeIconColor,
    closeIconColorHoverSuccess: closeIconColorHover,
    closeIconColorPressedSuccess: closeIconColorPressed,
    closeColorHoverError: closeColorHover,
    closeColorPressedError: closeColorPressed,
    closeIconColorError: closeIconColor,
    closeIconColorHoverError: closeIconColorHover,
    closeIconColorPressedError: closeIconColorPressed,
    closeColorHoverWarning: closeColorHover,
    closeColorPressedWarning: closeColorPressed,
    closeIconColorWarning: closeIconColor,
    closeIconColorHoverWarning: closeIconColorHover,
    closeIconColorPressedWarning: closeIconColorPressed,
    closeColorHoverLoading: closeColorHover,
    closeColorPressedLoading: closeColorPressed,
    closeIconColorLoading: closeIconColor,
    closeIconColorHoverLoading: closeIconColorHover,
    closeIconColorPressedLoading: closeIconColorPressed,
    loadingColor: primaryColor,
    lineHeight: lineHeight2,
    borderRadius
  });
}
const messageDark = {
  name: "Message",
  common: derived$1,
  self: self$n
};
const commonVars$5 = {
  closeMargin: "16px 12px",
  closeSize: "20px",
  closeIconSize: "16px",
  width: "365px",
  padding: "16px",
  titleFontSize: "16px",
  metaFontSize: "12px",
  descriptionFontSize: "12px"
};
function self$m(vars) {
  const {
    textColor2,
    successColor,
    infoColor,
    warningColor,
    errorColor,
    popoverColor,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    closeColorHover,
    closeColorPressed,
    textColor1,
    textColor3,
    borderRadius,
    fontWeightStrong,
    boxShadow2,
    lineHeight: lineHeight2,
    fontSize: fontSize2
  } = vars;
  return Object.assign(Object.assign({}, commonVars$5), {
    borderRadius,
    lineHeight: lineHeight2,
    fontSize: fontSize2,
    headerFontWeight: fontWeightStrong,
    iconColor: textColor2,
    iconColorSuccess: successColor,
    iconColorInfo: infoColor,
    iconColorWarning: warningColor,
    iconColorError: errorColor,
    color: popoverColor,
    textColor: textColor2,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    closeBorderRadius: borderRadius,
    closeColorHover,
    closeColorPressed,
    headerTextColor: textColor1,
    descriptionTextColor: textColor3,
    actionTextColor: textColor2,
    boxShadow: boxShadow2
  });
}
const notificationDark = {
  name: "Notification",
  common: derived$1,
  peers: {
    Scrollbar: scrollbarDark
  },
  self: self$m
};
function self$l(vars) {
  const {
    textColor1,
    dividerColor,
    fontWeightStrong
  } = vars;
  return {
    textColor: textColor1,
    color: dividerColor,
    fontWeight: fontWeightStrong
  };
}
const dividerDark = {
  name: "Divider",
  common: derived$1,
  self: self$l
};
function self$k(vars) {
  const {
    modalColor,
    textColor1,
    textColor2,
    boxShadow3,
    lineHeight: lineHeight2,
    fontWeightStrong,
    dividerColor,
    closeColorHover,
    closeColorPressed,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    borderRadius,
    primaryColorHover
  } = vars;
  return {
    bodyPadding: "16px 24px",
    borderRadius,
    headerPadding: "16px 24px",
    footerPadding: "16px 24px",
    color: modalColor,
    textColor: textColor2,
    titleTextColor: textColor1,
    titleFontSize: "18px",
    titleFontWeight: fontWeightStrong,
    boxShadow: boxShadow3,
    lineHeight: lineHeight2,
    headerBorderBottom: `1px solid ${dividerColor}`,
    footerBorderTop: `1px solid ${dividerColor}`,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    closeSize: "22px",
    closeIconSize: "18px",
    closeColorHover,
    closeColorPressed,
    closeBorderRadius: borderRadius,
    resizableTriggerColorHover: primaryColorHover
  };
}
const drawerDark = {
  name: "Drawer",
  common: derived$1,
  peers: {
    Scrollbar: scrollbarDark
  },
  self: self$k
};
const commonVariables$5 = {
  actionMargin: "0 0 0 20px",
  actionMarginRtl: "0 20px 0 0"
};
const dynamicInputDark = {
  name: "DynamicInput",
  common: derived$1,
  peers: {
    Input: inputDark,
    Button: buttonDark
  },
  self() {
    return commonVariables$5;
  }
};
const commonVars$4 = {
  gapSmall: "4px 8px",
  gapMedium: "8px 12px",
  gapLarge: "12px 16px"
};
const spaceDark = {
  name: "Space",
  self() {
    return commonVars$4;
  }
};
const dynamicTagsDark = {
  name: "DynamicTags",
  common: derived$1,
  peers: {
    Input: inputDark,
    Button: buttonDark,
    Tag: tagDark,
    Space: spaceDark
  },
  self() {
    return {
      inputWidth: "64px"
    };
  }
};
const elementDark = {
  name: "Element",
  common: derived$1
};
const commonVars$3 = {
  gapSmall: "4px 8px",
  gapMedium: "8px 12px",
  gapLarge: "12px 16px"
};
const flexDark = {
  name: "Flex",
  self() {
    return commonVars$3;
  }
};
const buttonGroupDark = {
  name: "ButtonGroup",
  common: derived$1
};
const commonVariables$4 = {
  feedbackPadding: "4px 0 0 2px",
  feedbackHeightSmall: "24px",
  feedbackHeightMedium: "24px",
  feedbackHeightLarge: "26px",
  feedbackFontSizeSmall: "13px",
  feedbackFontSizeMedium: "14px",
  feedbackFontSizeLarge: "14px",
  labelFontSizeLeftSmall: "14px",
  labelFontSizeLeftMedium: "14px",
  labelFontSizeLeftLarge: "15px",
  labelFontSizeTopSmall: "13px",
  labelFontSizeTopMedium: "14px",
  labelFontSizeTopLarge: "14px",
  labelHeightSmall: "24px",
  labelHeightMedium: "26px",
  labelHeightLarge: "28px",
  labelPaddingVertical: "0 0 6px 2px",
  labelPaddingHorizontal: "0 12px 0 0",
  labelTextAlignVertical: "left",
  labelTextAlignHorizontal: "right",
  labelFontWeight: "400"
};
function self$j(vars) {
  const {
    heightSmall,
    heightMedium,
    heightLarge,
    textColor1,
    errorColor,
    warningColor,
    lineHeight: lineHeight2,
    textColor3
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$4), {
    blankHeightSmall: heightSmall,
    blankHeightMedium: heightMedium,
    blankHeightLarge: heightLarge,
    lineHeight: lineHeight2,
    labelTextColor: textColor1,
    asteriskColor: errorColor,
    feedbackTextColorError: errorColor,
    feedbackTextColorWarning: warningColor,
    feedbackTextColor: textColor3
  });
}
const formItemDark = {
  name: "Form",
  common: derived$1,
  self: self$j
};
const gradientTextDark = {
  name: "GradientText",
  common: derived$1,
  self(vars) {
    const {
      primaryColor,
      successColor,
      warningColor,
      errorColor,
      infoColor,
      primaryColorSuppl,
      successColorSuppl,
      warningColorSuppl,
      errorColorSuppl,
      infoColorSuppl,
      fontWeightStrong
    } = vars;
    return {
      fontWeight: fontWeightStrong,
      rotate: "252deg",
      colorStartPrimary: primaryColor,
      colorEndPrimary: primaryColorSuppl,
      colorStartInfo: infoColor,
      colorEndInfo: infoColorSuppl,
      colorStartWarning: warningColor,
      colorEndWarning: warningColorSuppl,
      colorStartError: errorColor,
      colorEndError: errorColorSuppl,
      colorStartSuccess: successColor,
      colorEndSuccess: successColorSuppl
    };
  }
};
const inputNumberDark = {
  name: "InputNumber",
  common: derived$1,
  peers: {
    Button: buttonDark,
    Input: inputDark
  },
  self(vars) {
    const {
      textColorDisabled
    } = vars;
    return {
      iconColorDisabled: textColorDisabled
    };
  }
};
const layoutDark = {
  name: "Layout",
  common: derived$1,
  peers: {
    Scrollbar: scrollbarDark
  },
  self(vars) {
    const {
      textColor2,
      bodyColor,
      popoverColor,
      cardColor,
      dividerColor,
      scrollbarColor,
      scrollbarColorHover
    } = vars;
    return {
      textColor: textColor2,
      textColorInverted: textColor2,
      color: bodyColor,
      colorEmbedded: bodyColor,
      headerColor: cardColor,
      headerColorInverted: cardColor,
      footerColor: cardColor,
      footerColorInverted: cardColor,
      headerBorderColor: dividerColor,
      headerBorderColorInverted: dividerColor,
      footerBorderColor: dividerColor,
      footerBorderColorInverted: dividerColor,
      siderBorderColor: dividerColor,
      siderBorderColorInverted: dividerColor,
      siderColor: cardColor,
      siderColorInverted: cardColor,
      siderToggleButtonBorder: "1px solid transparent",
      siderToggleButtonColor: popoverColor,
      siderToggleButtonIconColor: textColor2,
      siderToggleButtonIconColorInverted: textColor2,
      siderToggleBarColor: composite(bodyColor, scrollbarColor),
      siderToggleBarColorHover: composite(bodyColor, scrollbarColorHover),
      __invertScrollbar: "false"
    };
  }
};
const rowDark = {
  name: "Row",
  common: derived$1
};
function self$i(vars) {
  const {
    textColor2,
    cardColor,
    modalColor,
    popoverColor,
    dividerColor,
    borderRadius,
    fontSize: fontSize2,
    hoverColor
  } = vars;
  return {
    textColor: textColor2,
    color: cardColor,
    colorHover: hoverColor,
    colorModal: modalColor,
    colorHoverModal: composite(modalColor, hoverColor),
    colorPopover: popoverColor,
    colorHoverPopover: composite(popoverColor, hoverColor),
    borderColor: dividerColor,
    borderColorModal: composite(modalColor, dividerColor),
    borderColorPopover: composite(popoverColor, dividerColor),
    borderRadius,
    fontSize: fontSize2
  };
}
const listDark$1 = {
  name: "List",
  common: derived$1,
  self: self$i
};
const logDark = {
  name: "Log",
  common: derived$1,
  peers: {
    Scrollbar: scrollbarDark,
    Code: codeDark
  },
  self(vars) {
    const {
      textColor2,
      inputColor,
      fontSize: fontSize2,
      primaryColor
    } = vars;
    return {
      loaderFontSize: fontSize2,
      loaderTextColor: textColor2,
      loaderColor: inputColor,
      loaderBorder: "1px solid #0000",
      loadingColor: primaryColor
    };
  }
};
const listDark = {
  name: "Mention",
  common: derived$1,
  peers: {
    InternalSelectMenu: internalSelectMenuDark,
    Input: inputDark
  },
  self(vars) {
    const {
      boxShadow2
    } = vars;
    return {
      menuBoxShadow: boxShadow2
    };
  }
};
function createPartialInvertedVars(color, activeItemColor, activeTextColor, groupTextColor) {
  return {
    itemColorHoverInverted: "#0000",
    itemColorActiveInverted: activeItemColor,
    itemColorActiveHoverInverted: activeItemColor,
    itemColorActiveCollapsedInverted: activeItemColor,
    itemTextColorInverted: color,
    itemTextColorHoverInverted: activeTextColor,
    itemTextColorChildActiveInverted: activeTextColor,
    itemTextColorChildActiveHoverInverted: activeTextColor,
    itemTextColorActiveInverted: activeTextColor,
    itemTextColorActiveHoverInverted: activeTextColor,
    itemTextColorHorizontalInverted: color,
    itemTextColorHoverHorizontalInverted: activeTextColor,
    itemTextColorChildActiveHorizontalInverted: activeTextColor,
    itemTextColorChildActiveHoverHorizontalInverted: activeTextColor,
    itemTextColorActiveHorizontalInverted: activeTextColor,
    itemTextColorActiveHoverHorizontalInverted: activeTextColor,
    itemIconColorInverted: color,
    itemIconColorHoverInverted: activeTextColor,
    itemIconColorActiveInverted: activeTextColor,
    itemIconColorActiveHoverInverted: activeTextColor,
    itemIconColorChildActiveInverted: activeTextColor,
    itemIconColorChildActiveHoverInverted: activeTextColor,
    itemIconColorCollapsedInverted: color,
    itemIconColorHorizontalInverted: color,
    itemIconColorHoverHorizontalInverted: activeTextColor,
    itemIconColorActiveHorizontalInverted: activeTextColor,
    itemIconColorActiveHoverHorizontalInverted: activeTextColor,
    itemIconColorChildActiveHorizontalInverted: activeTextColor,
    itemIconColorChildActiveHoverHorizontalInverted: activeTextColor,
    arrowColorInverted: color,
    arrowColorHoverInverted: activeTextColor,
    arrowColorActiveInverted: activeTextColor,
    arrowColorActiveHoverInverted: activeTextColor,
    arrowColorChildActiveInverted: activeTextColor,
    arrowColorChildActiveHoverInverted: activeTextColor,
    groupTextColorInverted: groupTextColor
  };
}
function self$h(vars) {
  const {
    borderRadius,
    textColor3,
    primaryColor,
    textColor2,
    textColor1,
    fontSize: fontSize2,
    dividerColor,
    hoverColor,
    primaryColorHover
  } = vars;
  return Object.assign({
    borderRadius,
    color: "#0000",
    groupTextColor: textColor3,
    itemColorHover: hoverColor,
    itemColorActive: changeColor(primaryColor, {
      alpha: 0.1
    }),
    itemColorActiveHover: changeColor(primaryColor, {
      alpha: 0.1
    }),
    itemColorActiveCollapsed: changeColor(primaryColor, {
      alpha: 0.1
    }),
    itemTextColor: textColor2,
    itemTextColorHover: textColor2,
    itemTextColorActive: primaryColor,
    itemTextColorActiveHover: primaryColor,
    itemTextColorChildActive: primaryColor,
    itemTextColorChildActiveHover: primaryColor,
    itemTextColorHorizontal: textColor2,
    itemTextColorHoverHorizontal: primaryColorHover,
    itemTextColorActiveHorizontal: primaryColor,
    itemTextColorActiveHoverHorizontal: primaryColor,
    itemTextColorChildActiveHorizontal: primaryColor,
    itemTextColorChildActiveHoverHorizontal: primaryColor,
    itemIconColor: textColor1,
    itemIconColorHover: textColor1,
    itemIconColorActive: primaryColor,
    itemIconColorActiveHover: primaryColor,
    itemIconColorChildActive: primaryColor,
    itemIconColorChildActiveHover: primaryColor,
    itemIconColorCollapsed: textColor1,
    itemIconColorHorizontal: textColor1,
    itemIconColorHoverHorizontal: primaryColorHover,
    itemIconColorActiveHorizontal: primaryColor,
    itemIconColorActiveHoverHorizontal: primaryColor,
    itemIconColorChildActiveHorizontal: primaryColor,
    itemIconColorChildActiveHoverHorizontal: primaryColor,
    itemHeight: "42px",
    arrowColor: textColor2,
    arrowColorHover: textColor2,
    arrowColorActive: primaryColor,
    arrowColorActiveHover: primaryColor,
    arrowColorChildActive: primaryColor,
    arrowColorChildActiveHover: primaryColor,
    colorInverted: "#0000",
    borderColorHorizontal: "#0000",
    fontSize: fontSize2,
    dividerColor
  }, createPartialInvertedVars("#BBB", primaryColor, "#FFF", "#AAA"));
}
const menuDark = {
  name: "Menu",
  common: derived$1,
  peers: {
    Tooltip: tooltipDark,
    Dropdown: dropdownDark
  },
  self(vars) {
    const {
      primaryColor,
      primaryColorSuppl
    } = vars;
    const commonSelf = self$h(vars);
    commonSelf.itemColorActive = changeColor(primaryColor, {
      alpha: 0.15
    });
    commonSelf.itemColorActiveHover = changeColor(primaryColor, {
      alpha: 0.15
    });
    commonSelf.itemColorActiveCollapsed = changeColor(primaryColor, {
      alpha: 0.15
    });
    commonSelf.itemColorActiveInverted = primaryColorSuppl;
    commonSelf.itemColorActiveHoverInverted = primaryColorSuppl;
    commonSelf.itemColorActiveCollapsedInverted = primaryColorSuppl;
    return commonSelf;
  }
};
const common = {
  titleFontSize: "18px",
  backSize: "22px"
};
function self$g(vars) {
  const {
    textColor1,
    textColor2,
    textColor3,
    fontSize: fontSize2,
    fontWeightStrong,
    primaryColorHover,
    primaryColorPressed
  } = vars;
  return Object.assign(Object.assign({}, common), {
    titleFontWeight: fontWeightStrong,
    fontSize: fontSize2,
    titleTextColor: textColor1,
    backColor: textColor2,
    backColorHover: primaryColorHover,
    backColorPressed: primaryColorPressed,
    subtitleTextColor: textColor3
  });
}
const pageHeaderDark = {
  name: "PageHeader",
  common: derived$1,
  self: self$g
};
const commonVars$2 = {
  iconSize: "22px"
};
function self$f(vars) {
  const {
    fontSize: fontSize2,
    warningColor
  } = vars;
  return Object.assign(Object.assign({}, commonVars$2), {
    fontSize: fontSize2,
    iconColor: warningColor
  });
}
const popconfirmDark = {
  name: "Popconfirm",
  common: derived$1,
  peers: {
    Button: buttonDark,
    Popover: popoverDark
  },
  self: self$f
};
function self$e(vars) {
  const {
    infoColor,
    successColor,
    warningColor,
    errorColor,
    textColor2,
    progressRailColor,
    fontSize: fontSize2,
    fontWeight
  } = vars;
  return {
    fontSize: fontSize2,
    fontSizeCircle: "28px",
    fontWeightCircle: fontWeight,
    railColor: progressRailColor,
    railHeight: "8px",
    iconSizeCircle: "36px",
    iconSizeLine: "18px",
    iconColor: infoColor,
    iconColorInfo: infoColor,
    iconColorSuccess: successColor,
    iconColorWarning: warningColor,
    iconColorError: errorColor,
    textColorCircle: textColor2,
    textColorLineInner: "rgb(255, 255, 255)",
    textColorLineOuter: textColor2,
    fillColor: infoColor,
    fillColorInfo: infoColor,
    fillColorSuccess: successColor,
    fillColorWarning: warningColor,
    fillColorError: errorColor,
    lineBgProcessing: "linear-gradient(90deg, rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .5) 100%)"
  };
}
const progressDark = {
  name: "Progress",
  common: derived$1,
  self(vars) {
    const commonSelf = self$e(vars);
    commonSelf.textColorLineInner = "rgb(0, 0, 0)";
    commonSelf.lineBgProcessing = "linear-gradient(90deg, rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .5) 100%)";
    return commonSelf;
  }
};
const rateDark = {
  name: "Rate",
  common: derived$1,
  self(vars) {
    const {
      railColor
    } = vars;
    return {
      itemColor: railColor,
      itemColorActive: "#CCAA33",
      itemSize: "20px",
      sizeSmall: "16px",
      sizeMedium: "20px",
      sizeLarge: "24px"
    };
  }
};
const commonVariables$3 = {
  titleFontSizeSmall: "26px",
  titleFontSizeMedium: "32px",
  titleFontSizeLarge: "40px",
  titleFontSizeHuge: "48px",
  fontSizeSmall: "14px",
  fontSizeMedium: "14px",
  fontSizeLarge: "15px",
  fontSizeHuge: "16px",
  iconSizeSmall: "64px",
  iconSizeMedium: "80px",
  iconSizeLarge: "100px",
  iconSizeHuge: "125px",
  iconColor418: undefined,
  iconColor404: undefined,
  iconColor403: undefined,
  iconColor500: undefined
};
function self$d(vars) {
  const {
    textColor2,
    textColor1,
    errorColor,
    successColor,
    infoColor,
    warningColor,
    lineHeight: lineHeight2,
    fontWeightStrong
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$3), {
    lineHeight: lineHeight2,
    titleFontWeight: fontWeightStrong,
    titleTextColor: textColor1,
    textColor: textColor2,
    iconColorError: errorColor,
    iconColorSuccess: successColor,
    iconColorInfo: infoColor,
    iconColorWarning: warningColor
  });
}
const resultDark = {
  name: "Result",
  common: derived$1,
  self: self$d
};
const sizeVariables$3 = {
  railHeight: "4px",
  railWidthVertical: "4px",
  handleSize: "18px",
  dotHeight: "8px",
  dotWidth: "8px",
  dotBorderRadius: "4px"
};
const sliderDark = {
  name: "Slider",
  common: derived$1,
  self(vars) {
    const boxShadow = "0 2px 8px 0 rgba(0, 0, 0, 0.12)";
    const {
      railColor,
      modalColor,
      primaryColorSuppl,
      popoverColor,
      textColor2,
      cardColor,
      borderRadius,
      fontSize: fontSize2,
      opacityDisabled
    } = vars;
    return Object.assign(Object.assign({}, sizeVariables$3), {
      fontSize: fontSize2,
      markFontSize: fontSize2,
      railColor,
      railColorHover: railColor,
      fillColor: primaryColorSuppl,
      fillColorHover: primaryColorSuppl,
      opacityDisabled,
      handleColor: "#FFF",
      dotColor: cardColor,
      dotColorModal: modalColor,
      dotColorPopover: popoverColor,
      handleBoxShadow: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
      handleBoxShadowHover: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
      handleBoxShadowActive: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
      handleBoxShadowFocus: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
      indicatorColor: popoverColor,
      indicatorBoxShadow: boxShadow,
      indicatorTextColor: textColor2,
      indicatorBorderRadius: borderRadius,
      dotBorder: `2px solid ${railColor}`,
      dotBorderActive: `2px solid ${primaryColorSuppl}`,
      dotBoxShadow: ""
    });
  }
};
function self$c(vars) {
  const {
    opacityDisabled,
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    heightHuge,
    primaryColor,
    fontSize: fontSize2
  } = vars;
  return {
    fontSize: fontSize2,
    textColor: primaryColor,
    sizeTiny: heightTiny,
    sizeSmall: heightSmall,
    sizeMedium: heightMedium,
    sizeLarge: heightLarge,
    sizeHuge: heightHuge,
    color: primaryColor,
    opacitySpinning: opacityDisabled
  };
}
const spinDark = {
  name: "Spin",
  common: derived$1,
  self: self$c
};
function self$b(vars) {
  const {
    textColor2,
    textColor3,
    fontSize: fontSize2,
    fontWeight
  } = vars;
  return {
    labelFontSize: fontSize2,
    labelFontWeight: fontWeight,
    valueFontWeight: fontWeight,
    valueFontSize: "24px",
    labelTextColor: textColor3,
    valuePrefixTextColor: textColor2,
    valueSuffixTextColor: textColor2,
    valueTextColor: textColor2
  };
}
const statisticDark = {
  name: "Statistic",
  common: derived$1,
  self: self$b
};
const commonVariables$2 = {
  stepHeaderFontSizeSmall: "14px",
  stepHeaderFontSizeMedium: "16px",
  indicatorIndexFontSizeSmall: "14px",
  indicatorIndexFontSizeMedium: "16px",
  indicatorSizeSmall: "22px",
  indicatorSizeMedium: "28px",
  indicatorIconSizeSmall: "14px",
  indicatorIconSizeMedium: "18px"
};
function self$a(vars) {
  const {
    fontWeightStrong,
    baseColor,
    textColorDisabled,
    primaryColor,
    errorColor,
    textColor1,
    textColor2
  } = vars;
  return Object.assign(Object.assign({}, commonVariables$2), {
    stepHeaderFontWeight: fontWeightStrong,
    indicatorTextColorProcess: baseColor,
    indicatorTextColorWait: textColorDisabled,
    indicatorTextColorFinish: primaryColor,
    indicatorTextColorError: errorColor,
    indicatorBorderColorProcess: primaryColor,
    indicatorBorderColorWait: textColorDisabled,
    indicatorBorderColorFinish: primaryColor,
    indicatorBorderColorError: errorColor,
    indicatorColorProcess: primaryColor,
    indicatorColorWait: "#0000",
    indicatorColorFinish: "#0000",
    indicatorColorError: "#0000",
    splitorColorProcess: textColorDisabled,
    splitorColorWait: textColorDisabled,
    splitorColorFinish: primaryColor,
    splitorColorError: textColorDisabled,
    headerTextColorProcess: textColor1,
    headerTextColorWait: textColorDisabled,
    headerTextColorFinish: textColorDisabled,
    headerTextColorError: errorColor,
    descriptionTextColorProcess: textColor2,
    descriptionTextColorWait: textColorDisabled,
    descriptionTextColorFinish: textColorDisabled,
    descriptionTextColorError: errorColor
  });
}
const stepsDark = {
  name: "Steps",
  common: derived$1,
  self: self$a
};
const commonVars$1 = {
  buttonHeightSmall: "14px",
  buttonHeightMedium: "18px",
  buttonHeightLarge: "22px",
  buttonWidthSmall: "14px",
  buttonWidthMedium: "18px",
  buttonWidthLarge: "22px",
  buttonWidthPressedSmall: "20px",
  buttonWidthPressedMedium: "24px",
  buttonWidthPressedLarge: "28px",
  railHeightSmall: "18px",
  railHeightMedium: "22px",
  railHeightLarge: "26px",
  railWidthSmall: "32px",
  railWidthMedium: "40px",
  railWidthLarge: "48px"
};
const switchDark = {
  name: "Switch",
  common: derived$1,
  self(vars) {
    const {
      primaryColorSuppl,
      opacityDisabled,
      borderRadius,
      primaryColor,
      textColor2,
      baseColor
    } = vars;
    const railOverlayColor = "rgba(255, 255, 255, .20)";
    return Object.assign(Object.assign({}, commonVars$1), {
      iconColor: baseColor,
      textColor: textColor2,
      loadingColor: primaryColorSuppl,
      opacityDisabled,
      railColor: railOverlayColor,
      railColorActive: primaryColorSuppl,
      buttonBoxShadow: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
      buttonColor: "#FFF",
      railBorderRadiusSmall: borderRadius,
      railBorderRadiusMedium: borderRadius,
      railBorderRadiusLarge: borderRadius,
      buttonBorderRadiusSmall: borderRadius,
      buttonBorderRadiusMedium: borderRadius,
      buttonBorderRadiusLarge: borderRadius,
      boxShadowFocus: `0 0 8px 0 ${changeColor(primaryColor, {
        alpha: 0.3
      })}`
    });
  }
};
const sizeVariables$2 = {
  thPaddingSmall: "6px",
  thPaddingMedium: "12px",
  thPaddingLarge: "12px",
  tdPaddingSmall: "6px",
  tdPaddingMedium: "12px",
  tdPaddingLarge: "12px"
};
function self$9(vars) {
  const {
    dividerColor,
    cardColor,
    modalColor,
    popoverColor,
    tableHeaderColor,
    tableColorStriped,
    textColor1,
    textColor2,
    borderRadius,
    fontWeightStrong,
    lineHeight: lineHeight2,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge
  } = vars;
  return Object.assign(Object.assign({}, sizeVariables$2), {
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    lineHeight: lineHeight2,
    borderRadius,
    borderColor: composite(cardColor, dividerColor),
    borderColorModal: composite(modalColor, dividerColor),
    borderColorPopover: composite(popoverColor, dividerColor),
    tdColor: cardColor,
    tdColorModal: modalColor,
    tdColorPopover: popoverColor,
    tdColorStriped: composite(cardColor, tableColorStriped),
    tdColorStripedModal: composite(modalColor, tableColorStriped),
    tdColorStripedPopover: composite(popoverColor, tableColorStriped),
    thColor: composite(cardColor, tableHeaderColor),
    thColorModal: composite(modalColor, tableHeaderColor),
    thColorPopover: composite(popoverColor, tableHeaderColor),
    thTextColor: textColor1,
    tdTextColor: textColor2,
    thFontWeight: fontWeightStrong
  });
}
const tableDark = {
  name: "Table",
  common: derived$1,
  self: self$9
};
const sizeVariables$1 = {
  tabFontSizeSmall: "14px",
  tabFontSizeMedium: "14px",
  tabFontSizeLarge: "16px",
  tabGapSmallLine: "36px",
  tabGapMediumLine: "36px",
  tabGapLargeLine: "36px",
  tabGapSmallLineVertical: "8px",
  tabGapMediumLineVertical: "8px",
  tabGapLargeLineVertical: "8px",
  tabPaddingSmallLine: "6px 0",
  tabPaddingMediumLine: "10px 0",
  tabPaddingLargeLine: "14px 0",
  tabPaddingVerticalSmallLine: "6px 12px",
  tabPaddingVerticalMediumLine: "8px 16px",
  tabPaddingVerticalLargeLine: "10px 20px",
  tabGapSmallBar: "36px",
  tabGapMediumBar: "36px",
  tabGapLargeBar: "36px",
  tabGapSmallBarVertical: "8px",
  tabGapMediumBarVertical: "8px",
  tabGapLargeBarVertical: "8px",
  tabPaddingSmallBar: "4px 0",
  tabPaddingMediumBar: "6px 0",
  tabPaddingLargeBar: "10px 0",
  tabPaddingVerticalSmallBar: "6px 12px",
  tabPaddingVerticalMediumBar: "8px 16px",
  tabPaddingVerticalLargeBar: "10px 20px",
  tabGapSmallCard: "4px",
  tabGapMediumCard: "4px",
  tabGapLargeCard: "4px",
  tabGapSmallCardVertical: "4px",
  tabGapMediumCardVertical: "4px",
  tabGapLargeCardVertical: "4px",
  tabPaddingSmallCard: "8px 16px",
  tabPaddingMediumCard: "10px 20px",
  tabPaddingLargeCard: "12px 24px",
  tabPaddingSmallSegment: "4px 0",
  tabPaddingMediumSegment: "6px 0",
  tabPaddingLargeSegment: "8px 0",
  tabPaddingVerticalLargeSegment: "0 8px",
  tabPaddingVerticalSmallCard: "8px 12px",
  tabPaddingVerticalMediumCard: "10px 16px",
  tabPaddingVerticalLargeCard: "12px 20px",
  tabPaddingVerticalSmallSegment: "0 4px",
  tabPaddingVerticalMediumSegment: "0 6px",
  tabGapSmallSegment: "0",
  tabGapMediumSegment: "0",
  tabGapLargeSegment: "0",
  tabGapSmallSegmentVertical: "0",
  tabGapMediumSegmentVertical: "0",
  tabGapLargeSegmentVertical: "0",
  panePaddingSmall: "8px 0 0 0",
  panePaddingMedium: "12px 0 0 0",
  panePaddingLarge: "16px 0 0 0",
  closeSize: "18px",
  closeIconSize: "14px"
};
function self$8(vars) {
  const {
    textColor2,
    primaryColor,
    textColorDisabled,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    closeColorHover,
    closeColorPressed,
    tabColor,
    baseColor,
    dividerColor,
    fontWeight,
    textColor1,
    borderRadius,
    fontSize: fontSize2,
    fontWeightStrong
  } = vars;
  return Object.assign(Object.assign({}, sizeVariables$1), {
    colorSegment: tabColor,
    tabFontSizeCard: fontSize2,
    tabTextColorLine: textColor1,
    tabTextColorActiveLine: primaryColor,
    tabTextColorHoverLine: primaryColor,
    tabTextColorDisabledLine: textColorDisabled,
    tabTextColorSegment: textColor1,
    tabTextColorActiveSegment: textColor2,
    tabTextColorHoverSegment: textColor2,
    tabTextColorDisabledSegment: textColorDisabled,
    tabTextColorBar: textColor1,
    tabTextColorActiveBar: primaryColor,
    tabTextColorHoverBar: primaryColor,
    tabTextColorDisabledBar: textColorDisabled,
    tabTextColorCard: textColor1,
    tabTextColorHoverCard: textColor1,
    tabTextColorActiveCard: primaryColor,
    tabTextColorDisabledCard: textColorDisabled,
    barColor: primaryColor,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    closeColorHover,
    closeColorPressed,
    closeBorderRadius: borderRadius,
    tabColor,
    tabColorSegment: baseColor,
    tabBorderColor: dividerColor,
    tabFontWeightActive: fontWeight,
    tabFontWeight: fontWeight,
    tabBorderRadius: borderRadius,
    paneTextColor: textColor2,
    fontWeightStrong
  });
}
const tabsDark = {
  name: "Tabs",
  common: derived$1,
  self(vars) {
    const commonSelf = self$8(vars);
    const {
      inputColor
    } = vars;
    commonSelf.colorSegment = inputColor;
    commonSelf.tabColorSegment = inputColor;
    return commonSelf;
  }
};
function self$7(vars) {
  const {
    textColor1,
    textColor2,
    fontWeightStrong,
    fontSize: fontSize2
  } = vars;
  return {
    fontSize: fontSize2,
    titleTextColor: textColor1,
    textColor: textColor2,
    titleFontWeight: fontWeightStrong
  };
}
const thingDark = {
  name: "Thing",
  common: derived$1,
  self: self$7
};
const sizeVariables = {
  titleMarginMedium: "0 0 6px 0",
  titleMarginLarge: "-2px 0 6px 0",
  titleFontSizeMedium: "14px",
  titleFontSizeLarge: "16px",
  iconSizeMedium: "14px",
  iconSizeLarge: "14px"
};
const timelineDark = {
  name: "Timeline",
  common: derived$1,
  self(vars) {
    const {
      textColor3,
      infoColorSuppl,
      errorColorSuppl,
      successColorSuppl,
      warningColorSuppl,
      textColor1,
      textColor2,
      railColor,
      fontWeightStrong,
      fontSize: fontSize2
    } = vars;
    return Object.assign(Object.assign({}, sizeVariables), {
      contentFontSize: fontSize2,
      titleFontWeight: fontWeightStrong,
      circleBorder: `2px solid ${textColor3}`,
      circleBorderInfo: `2px solid ${infoColorSuppl}`,
      circleBorderError: `2px solid ${errorColorSuppl}`,
      circleBorderSuccess: `2px solid ${successColorSuppl}`,
      circleBorderWarning: `2px solid ${warningColorSuppl}`,
      iconColor: textColor3,
      iconColorInfo: infoColorSuppl,
      iconColorError: errorColorSuppl,
      iconColorSuccess: successColorSuppl,
      iconColorWarning: warningColorSuppl,
      titleTextColor: textColor1,
      contentTextColor: textColor2,
      metaTextColor: textColor3,
      lineColor: railColor
    });
  }
};
const commonVariables$1 = {
  extraFontSizeSmall: "12px",
  extraFontSizeMedium: "12px",
  extraFontSizeLarge: "14px",
  titleFontSizeSmall: "14px",
  titleFontSizeMedium: "16px",
  titleFontSizeLarge: "16px",
  closeSize: "20px",
  closeIconSize: "16px",
  headerHeightSmall: "44px",
  headerHeightMedium: "44px",
  headerHeightLarge: "50px"
};
const transferDark$1 = {
  name: "Transfer",
  common: derived$1,
  peers: {
    Checkbox: checkboxDark,
    Scrollbar: scrollbarDark,
    Input: inputDark,
    Empty: emptyDark,
    Button: buttonDark
  },
  self(vars) {
    const {
      fontWeight,
      fontSizeLarge,
      fontSizeMedium,
      fontSizeSmall,
      heightLarge,
      heightMedium,
      borderRadius,
      inputColor,
      tableHeaderColor,
      textColor1,
      textColorDisabled,
      textColor2,
      textColor3,
      hoverColor,
      closeColorHover,
      closeColorPressed,
      closeIconColor,
      closeIconColorHover,
      closeIconColorPressed,
      dividerColor
    } = vars;
    return Object.assign(Object.assign({}, commonVariables$1), {
      itemHeightSmall: heightMedium,
      itemHeightMedium: heightMedium,
      itemHeightLarge: heightLarge,
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      borderRadius,
      dividerColor,
      borderColor: "#0000",
      listColor: inputColor,
      headerColor: tableHeaderColor,
      titleTextColor: textColor1,
      titleTextColorDisabled: textColorDisabled,
      extraTextColor: textColor3,
      extraTextColorDisabled: textColorDisabled,
      itemTextColor: textColor2,
      itemTextColorDisabled: textColorDisabled,
      itemColorPending: hoverColor,
      titleFontWeight: fontWeight,
      closeColorHover,
      closeColorPressed,
      closeIconColor,
      closeIconColorHover,
      closeIconColorPressed
    });
  }
};
function self$6(vars) {
  const {
    borderRadiusSmall,
    dividerColor,
    hoverColor,
    pressedColor,
    primaryColor,
    textColor3,
    textColor2,
    textColorDisabled,
    fontSize: fontSize2
  } = vars;
  return {
    fontSize: fontSize2,
    lineHeight: "1.5",
    nodeHeight: "30px",
    nodeWrapperPadding: "3px 0",
    nodeBorderRadius: borderRadiusSmall,
    nodeColorHover: hoverColor,
    nodeColorPressed: pressedColor,
    nodeColorActive: changeColor(primaryColor, {
      alpha: 0.1
    }),
    arrowColor: textColor3,
    nodeTextColor: textColor2,
    nodeTextColorDisabled: textColorDisabled,
    loadingColor: primaryColor,
    dropMarkColor: primaryColor,
    lineColor: dividerColor
  };
}
const treeDark = {
  name: "Tree",
  common: derived$1,
  peers: {
    Checkbox: checkboxDark,
    Scrollbar: scrollbarDark,
    Empty: emptyDark
  },
  self(vars) {
    const {
      primaryColor
    } = vars;
    const commonSelf = self$6(vars);
    commonSelf.nodeColorActive = changeColor(primaryColor, {
      alpha: 0.15
    });
    return commonSelf;
  }
};
const treeSelectDark = {
  name: "TreeSelect",
  common: derived$1,
  peers: {
    Tree: treeDark,
    Empty: emptyDark,
    InternalSelection: internalSelectionDark
  }
};
const commonVars = {
  headerFontSize1: "30px",
  headerFontSize2: "22px",
  headerFontSize3: "18px",
  headerFontSize4: "16px",
  headerFontSize5: "16px",
  headerFontSize6: "16px",
  headerMargin1: "28px 0 20px 0",
  headerMargin2: "28px 0 20px 0",
  headerMargin3: "28px 0 20px 0",
  headerMargin4: "28px 0 18px 0",
  headerMargin5: "28px 0 18px 0",
  headerMargin6: "28px 0 18px 0",
  headerPrefixWidth1: "16px",
  headerPrefixWidth2: "16px",
  headerPrefixWidth3: "12px",
  headerPrefixWidth4: "12px",
  headerPrefixWidth5: "12px",
  headerPrefixWidth6: "12px",
  headerBarWidth1: "4px",
  headerBarWidth2: "4px",
  headerBarWidth3: "3px",
  headerBarWidth4: "3px",
  headerBarWidth5: "3px",
  headerBarWidth6: "3px",
  pMargin: "16px 0 16px 0",
  liMargin: ".25em 0 0 0",
  olPadding: "0 0 0 2em",
  ulPadding: "0 0 0 2em"
};
function self$5(vars) {
  const {
    primaryColor,
    textColor2,
    borderColor,
    lineHeight: lineHeight2,
    fontSize: fontSize2,
    borderRadiusSmall,
    dividerColor,
    fontWeightStrong,
    textColor1,
    textColor3,
    infoColor,
    warningColor,
    errorColor,
    successColor,
    codeColor
  } = vars;
  return Object.assign(Object.assign({}, commonVars), {
    aTextColor: primaryColor,
    blockquoteTextColor: textColor2,
    blockquotePrefixColor: borderColor,
    blockquoteLineHeight: lineHeight2,
    blockquoteFontSize: fontSize2,
    codeBorderRadius: borderRadiusSmall,
    liTextColor: textColor2,
    liLineHeight: lineHeight2,
    liFontSize: fontSize2,
    hrColor: dividerColor,
    headerFontWeight: fontWeightStrong,
    headerTextColor: textColor1,
    pTextColor: textColor2,
    pTextColor1Depth: textColor1,
    pTextColor2Depth: textColor2,
    pTextColor3Depth: textColor3,
    pLineHeight: lineHeight2,
    pFontSize: fontSize2,
    headerBarColor: primaryColor,
    headerBarColorPrimary: primaryColor,
    headerBarColorInfo: infoColor,
    headerBarColorError: errorColor,
    headerBarColorWarning: warningColor,
    headerBarColorSuccess: successColor,
    textColor: textColor2,
    textColor1Depth: textColor1,
    textColor2Depth: textColor2,
    textColor3Depth: textColor3,
    textColorPrimary: primaryColor,
    textColorInfo: infoColor,
    textColorSuccess: successColor,
    textColorWarning: warningColor,
    textColorError: errorColor,
    codeTextColor: textColor2,
    codeColor,
    codeBorder: "1px solid #0000"
  });
}
const typographyLight = {
  common: derived,
  self: self$5
};
const typographyDark = {
  name: "Typography",
  common: derived$1,
  self: self$5
};
function self$4(vars) {
  const {
    iconColor,
    primaryColor,
    errorColor,
    textColor2,
    successColor,
    opacityDisabled,
    actionColor,
    borderColor,
    hoverColor,
    lineHeight: lineHeight2,
    borderRadius,
    fontSize: fontSize2
  } = vars;
  return {
    fontSize: fontSize2,
    lineHeight: lineHeight2,
    borderRadius,
    draggerColor: actionColor,
    draggerBorder: `1px dashed ${borderColor}`,
    draggerBorderHover: `1px dashed ${primaryColor}`,
    itemColorHover: hoverColor,
    itemColorHoverError: changeColor(errorColor, {
      alpha: 0.06
    }),
    itemTextColor: textColor2,
    itemTextColorError: errorColor,
    itemTextColorSuccess: successColor,
    itemIconColor: iconColor,
    itemDisabledOpacity: opacityDisabled,
    itemBorderImageCardError: `1px solid ${errorColor}`,
    itemBorderImageCard: `1px solid ${borderColor}`
  };
}
const uploadDark = {
  name: "Upload",
  common: derived$1,
  peers: {
    Button: buttonDark,
    Progress: progressDark
  },
  self(vars) {
    const {
      errorColor
    } = vars;
    const commonSelf = self$4(vars);
    commonSelf.itemColorHoverError = changeColor(errorColor, {
      alpha: 0.09
    });
    return commonSelf;
  }
};
const watermarkDark = {
  name: "Watermark",
  common: derived$1,
  self(vars) {
    const {
      fontFamily: fontFamily2
    } = vars;
    return {
      fontFamily: fontFamily2
    };
  }
};
const floatButtonDark = {
  name: "FloatButton",
  common: derived$1,
  self(vars) {
    const {
      popoverColor,
      textColor2,
      buttonColor2Hover,
      buttonColor2Pressed,
      primaryColor,
      primaryColorHover,
      primaryColorPressed,
      baseColor,
      borderRadius
    } = vars;
    return {
      color: popoverColor,
      textColor: textColor2,
      boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)",
      boxShadowHover: "0 2px 12px 0px rgba(0, 0, 0, .18)",
      boxShadowPressed: "0 2px 12px 0px rgba(0, 0, 0, .18)",
      colorHover: buttonColor2Hover,
      colorPressed: buttonColor2Pressed,
      colorPrimary: primaryColor,
      colorPrimaryHover: primaryColorHover,
      colorPrimaryPressed: primaryColorPressed,
      textColorPrimary: baseColor,
      borderRadiusSquare: borderRadius
    };
  }
};
function self$3(vars) {
  const {
    primaryColor,
    baseColor
  } = vars;
  return {
    color: primaryColor,
    iconColor: baseColor
  };
}
const iconDark = {
  name: "IconWrapper",
  common: derived$1,
  self: self$3
};
const imageDark = {
  name: "Image",
  common: derived$1,
  peers: {
    Tooltip: tooltipDark
  },
  self: (vars) => {
    const {
      textColor2
    } = vars;
    return {
      toolbarIconColor: textColor2,
      toolbarColor: "rgba(0, 0, 0, .35)",
      toolbarBoxShadow: "none",
      toolbarBorderRadius: "24px"
    };
  }
};
const commonVariables = {
  extraFontSize: "12px",
  width: "440px"
};
const transferDark = {
  name: "Transfer",
  common: derived$1,
  peers: {
    Checkbox: checkboxDark,
    Scrollbar: scrollbarDark,
    Input: inputDark,
    Empty: emptyDark,
    Button: buttonDark
  },
  self(vars) {
    const {
      iconColorDisabled,
      iconColor,
      fontWeight,
      fontSizeLarge,
      fontSizeMedium,
      fontSizeSmall,
      heightLarge,
      heightMedium,
      heightSmall,
      borderRadius,
      inputColor,
      tableHeaderColor,
      textColor1,
      textColorDisabled,
      textColor2,
      hoverColor
    } = vars;
    return Object.assign(Object.assign({}, commonVariables), {
      itemHeightSmall: heightSmall,
      itemHeightMedium: heightMedium,
      itemHeightLarge: heightLarge,
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      borderRadius,
      borderColor: "#0000",
      listColor: inputColor,
      headerColor: tableHeaderColor,
      titleTextColor: textColor1,
      titleTextColorDisabled: textColorDisabled,
      extraTextColor: textColor2,
      filterDividerColor: "#0000",
      itemTextColor: textColor2,
      itemTextColorDisabled: textColorDisabled,
      itemColorPending: hoverColor,
      titleFontWeight: fontWeight,
      iconColor,
      iconColorDisabled
    });
  }
};
function self$2() {
  return {};
}
const marqueeDark = {
  name: "Marquee",
  common: derived$1,
  self: self$2
};
const qrcodeDark = {
  name: "QrCode",
  common: derived$1,
  self: (vars) => {
    return {
      borderRadius: vars.borderRadius
    };
  }
};
const skeletonDark = {
  name: "Skeleton",
  common: derived$1,
  self(vars) {
    const {
      heightSmall,
      heightMedium,
      heightLarge,
      borderRadius
    } = vars;
    return {
      color: "rgba(255, 255, 255, 0.12)",
      colorEnd: "rgba(255, 255, 255, 0.18)",
      borderRadius,
      heightSmall,
      heightMedium,
      heightLarge
    };
  }
};
const splitDark = {
  name: "Split",
  common: derived$1
};
const self$1 = () => ({});
const equationDark = {
  name: "Equation",
  common: derived$1,
  self: self$1
};
const floatButtonGroupDark = {
  name: "FloatButtonGroup",
  common: derived$1,
  self(vars) {
    const {
      popoverColor,
      dividerColor,
      borderRadius
    } = vars;
    return {
      color: popoverColor,
      buttonBorderColor: dividerColor,
      borderRadiusSquare: borderRadius,
      boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)"
    };
  }
};
const darkTheme = {
  name: "dark",
  common: derived$1,
  Alert: alertDark,
  Anchor: anchorDark,
  AutoComplete: autoCompleteDark,
  Avatar: avatarDark,
  AvatarGroup: avatarGroupDark,
  BackTop: backTopDark,
  Badge: badgeDark,
  Breadcrumb: breadcrumbDark,
  Button: buttonDark,
  ButtonGroup: buttonGroupDark,
  Calendar: calendarDark,
  Card: cardDark,
  Carousel: carouselDark,
  Cascader: cascaderDark,
  Checkbox: checkboxDark,
  Code: codeDark,
  Collapse: collapseDark,
  CollapseTransition: collapseTransitionDark,
  ColorPicker: colorPickerDark,
  DataTable: dataTableDark,
  DatePicker: datePickerDark,
  Descriptions: descriptionsDark,
  Dialog: dialogDark,
  Divider: dividerDark,
  Drawer: drawerDark,
  Dropdown: dropdownDark,
  DynamicInput: dynamicInputDark,
  DynamicTags: dynamicTagsDark,
  Element: elementDark,
  Empty: emptyDark,
  Ellipsis: ellipsisDark,
  Equation: equationDark,
  Flex: flexDark,
  Form: formItemDark,
  GradientText: gradientTextDark,
  Icon: iconDark$1,
  IconWrapper: iconDark,
  Image: imageDark,
  Input: inputDark,
  InputNumber: inputNumberDark,
  LegacyTransfer: transferDark,
  Layout: layoutDark,
  List: listDark$1,
  LoadingBar: loadingBarDark,
  Log: logDark,
  Menu: menuDark,
  Mention: listDark,
  Message: messageDark,
  Modal: modalDark,
  Notification: notificationDark,
  PageHeader: pageHeaderDark,
  Pagination: paginationDark,
  Popconfirm: popconfirmDark,
  Popover: popoverDark,
  Popselect: popselect,
  Progress: progressDark,
  QrCode: qrcodeDark,
  Radio: radioDark,
  Rate: rateDark,
  Result: resultDark,
  Row: rowDark,
  Scrollbar: scrollbarDark,
  Select: selectDark,
  Skeleton: skeletonDark,
  Slider: sliderDark,
  Space: spaceDark,
  Spin: spinDark,
  Statistic: statisticDark,
  Steps: stepsDark,
  Switch: switchDark,
  Table: tableDark,
  Tabs: tabsDark,
  Tag: tagDark,
  Thing: thingDark,
  TimePicker: timePickerDark,
  Timeline: timelineDark,
  Tooltip: tooltipDark,
  Transfer: transferDark$1,
  Tree: treeDark,
  TreeSelect: treeSelectDark,
  Typography: typographyDark,
  Upload: uploadDark,
  Watermark: watermarkDark,
  Split: splitDark,
  FloatButton: floatButtonDark,
  FloatButtonGroup: floatButtonGroupDark,
  Marquee: marqueeDark
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$2 = defineComponent({
  setup() {
    return {
      darkTheme
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLayout = __nuxt_component_0;
  const _component_n_config_provider = __unplugin_components_0;
  const _component_n_dialog_provider = NDialogProvider;
  const _component_NuxtPage = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_NuxtLayout, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_n_config_provider, { theme: _ctx.darkTheme }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(ssrRenderComponent(_component_n_dialog_provider, null, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent(_component_NuxtPage, null, null, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode(_component_NuxtPage)
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
            } else {
              return [
                createVNode(_component_n_dialog_provider, null, {
                  default: withCtx(() => [
                    createVNode(_component_NuxtPage)
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_n_config_provider, { theme: _ctx.darkTheme }, {
            default: withCtx(() => [
              createVNode(_component_n_dialog_provider, null, {
                default: withCtx(() => [
                  createVNode(_component_NuxtPage)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["theme"])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : undefined;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = undefined;
    const _Error404 = defineAsyncComponent(() => import('./error-404-D-RS3I6N.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-Dr5QXQe6.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : undefined;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error = nuxt.payload.error || createError(error);
    }
    if (ssrContext == null ? undefined : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { internalSelectionLight as $, emptyLight as A, createKey as B, useThemeClass as C, render as D, cM as E, cNotM as F, fadeInScaleUpTransition as G, resolveWrappedSlot as H, NBaseLoading as I, useRtl as J, internalSelectMenuLight as K, cCB as L, popoverLight as M, NIconSwitchTransition as N, isSlotEmpty as O, getFirstSlotVNode as P, keep as Q, warnOnce as R, Scrollbar as S, call as T, derived as U, commonVariables$k as V, NBaseClose as W, XScrollbar as X, color2Class as Y, Wrapper as Z, _export_sfc as _, useNuxtApp as a, commonVariables$i as a0, resolveSlotWithTypedProps as a1, useFormItem as a2, selectLight as a3, markEventEffectPerformed as a4, dialogApiInjectionKey as a5, throwError as a6, commonVars$3 as a7, flatten as a8, Button as a9, warn as aa, iconLight as ab, createTheme as ac, scrollbarLight as ad, typographyLight as ae, commonVars$4 as af, useRuntimeConfig as b, nuxtLinkDefaults as c, resolveUnrefHeadInput as d, entry$1 as default, asyncDataDefaults as e, createError as f, fetchDefaults as g, createInjectionKey as h, injectHead as i, drawerBodyInjectionKey as j, configProviderInjectionKey as k, replaceable as l, modalBodyInjectionKey as m, navigateTo as n, cB as o, popoverBodyInjectionKey as p, c as q, resolveRouteObject as r, cE as s, iconSwitchTransition as t, useRouter as u, resolveSlot as v, useStyle as w, NBaseIcon as x, useConfig as y, useTheme as z };
//# sourceMappingURL=server.mjs.map
