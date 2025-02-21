import { defineComponent, mergeProps, withCtx, createTextVNode, createVNode, ref, h, computed, Fragment, toRef, getCurrentInstance, watchEffect, watch, provide, inject, nextTick, toDisplayString, Transition, withDirectives, vShow, toValue, reactive, shallowRef, onServerPrefetch, cloneVNode, Text, unref, useSSRContext } from 'vue';
import { defineStore } from 'pinia';
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, a9 as Button, a8 as flatten, y as useConfig, z as useTheme, J as useRtl, B as createKey, U as derived, o as cB, C as useThemeClass, H as resolveWrappedSlot, S as Scrollbar, v as resolveSlot, x as NBaseIcon, a2 as useFormItem, h as createInjectionKey, a5 as dialogApiInjectionKey, a6 as throwError, a7 as commonVars$3, N as NIconSwitchTransition, l as replaceable, w as useStyle, I as NBaseLoading, a1 as resolveSlotWithTypedProps, a0 as commonVariables$i, s as cE, E as cM, F as cNotM, q as c, k as configProviderInjectionKey, T as call, a3 as selectLight, t as iconSwitchTransition, g as fetchDefaults, Z as Wrapper, D as render, $ as internalSelectionLight, m as modalBodyInjectionKey, j as drawerBodyInjectionKey, p as popoverBodyInjectionKey, K as internalSelectMenuLight, G as fadeInScaleUpTransition, a4 as markEventEffectPerformed, a as useNuxtApp, e as asyncDataDefaults, W as NBaseClose, Y as color2Class, P as getFirstSlotVNode, Q as keep, A as emptyLight, V as commonVariables$k, M as popoverLight, O as isSlotEmpty, L as cCB, X as XScrollbar, f as createError } from './server.mjs';
import { _ as __unplugin_components_2$1, g as getSlot, f as formatLength } from './Space-Bo1T0CPB.mjs';
import { getGap, depx, getPadding, changeColor, happensIn, getPreciseEventTarget, getMargin } from 'seemly';
import { createTreeMate, createIndexGetter } from 'treemate';
import { clickoutside, zindexable, mousemoveoutside } from 'vdirs';
import { useMergedState, useMemo, useCompitable, useIsMounted } from 'vooks';
import { VResizeObserver, VBinder, VTarget, VFollower, VOverflow, VirtualList, resizeObserverManager, VFocusTrap } from 'vueuc';
import { map } from 'lodash-es';
import { enUS as enUS$1 } from 'date-fns/locale';
import { y as hash } from '../_/nitro.mjs';
import { format } from 'sql-formatter';
import { on, off } from 'evtd';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@css-render/vue3-ssr';
import 'prismjs';
import '@css-render/plugin-bem';
import 'css-render';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';

const isDefer = (dedupe) => dedupe === "defer" || dedupe === false;
function useAsyncData(...args) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h;
  var _b;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : undefined;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  let [key, _handler, options = {}] = args;
  if (typeof key !== "string") {
    throw new TypeError("[nuxt] [asyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [asyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  const handler = _handler ;
  const getDefault = () => asyncDataDefaults.value;
  const getDefaultCachedData = () => nuxtApp.isHydrating ? nuxtApp.payload.data[key] : nuxtApp.static.data[key];
  options.server = (_a2 = options.server) != null ? _a2 : true;
  options.default = (_b2 = options.default) != null ? _b2 : getDefault;
  options.getCachedData = (_c = options.getCachedData) != null ? _c : getDefaultCachedData;
  options.lazy = (_d = options.lazy) != null ? _d : false;
  options.immediate = (_e = options.immediate) != null ? _e : true;
  options.deep = (_f = options.deep) != null ? _f : asyncDataDefaults.deep;
  options.dedupe = (_g = options.dedupe) != null ? _g : "cancel";
  const initialCachedData = options.getCachedData(key, nuxtApp);
  const hasCachedData = initialCachedData != null;
  if (!nuxtApp._asyncData[key] || !options.immediate) {
    (_h = (_b = nuxtApp.payload._errors)[key]) != null ? _h : _b[key] = asyncDataDefaults.errorValue;
    const _ref = options.deep ? ref : shallowRef;
    nuxtApp._asyncData[key] = {
      data: _ref(hasCachedData ? initialCachedData : options.default()),
      pending: ref(!hasCachedData),
      error: toRef(nuxtApp.payload._errors, key),
      status: ref("idle"),
      _default: options.default
    };
  }
  const asyncData = { ...nuxtApp._asyncData[key] };
  delete asyncData._default;
  asyncData.refresh = asyncData.execute = (opts = {}) => {
    var _a3;
    if (nuxtApp._asyncDataPromises[key]) {
      if (isDefer((_a3 = opts.dedupe) != null ? _a3 : options.dedupe)) {
        return nuxtApp._asyncDataPromises[key];
      }
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    if (opts._initial || nuxtApp.isHydrating && opts._initial !== false) {
      const cachedData = opts._initial ? initialCachedData : options.getCachedData(key, nuxtApp);
      if (cachedData != null) {
        return Promise.resolve(cachedData);
      }
    }
    asyncData.pending.value = true;
    asyncData.status.value = "pending";
    const promise = new Promise(
      (resolve, reject) => {
        try {
          resolve(handler(nuxtApp));
        } catch (err) {
          reject(err);
        }
      }
    ).then(async (_result) => {
      if (promise.cancelled) {
        return nuxtApp._asyncDataPromises[key];
      }
      let result = _result;
      if (options.transform) {
        result = await options.transform(_result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      nuxtApp.payload.data[key] = result;
      asyncData.data.value = result;
      asyncData.error.value = asyncDataDefaults.errorValue;
      asyncData.status.value = "success";
    }).catch((error) => {
      if (promise.cancelled) {
        return nuxtApp._asyncDataPromises[key];
      }
      asyncData.error.value = createError(error);
      asyncData.data.value = unref(options.default());
      asyncData.status.value = "error";
    }).finally(() => {
      if (promise.cancelled) {
        return;
      }
      asyncData.pending.value = false;
      delete nuxtApp._asyncDataPromises[key];
    });
    nuxtApp._asyncDataPromises[key] = promise;
    return nuxtApp._asyncDataPromises[key];
  };
  asyncData.clear = () => clearNuxtDataByKey(nuxtApp, key);
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = undefined;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = asyncDataDefaults.errorValue;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = undefined;
    nuxtApp._asyncData[key].error.value = asyncDataDefaults.errorValue;
    nuxtApp._asyncData[key].pending.value = false;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = undefined;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? undefined : _a.event;
}
function useRequestFetch() {
  var _a;
  return ((_a = useRequestEvent()) == null ? undefined : _a.$fetch) || globalThis.$fetch;
}
function useFetch(request, arg1, arg2) {
  const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
  const _request = computed(() => toValue(request));
  const _key = opts.key || hash([autoKey, typeof _request.value === "string" ? _request.value : "", ...generateOptionSegments(opts)]);
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useFetch] key must be a string: " + _key);
  }
  const key = _key === autoKey ? "$f" + _key : _key;
  if (!opts.baseURL && typeof _request.value === "string" && (_request.value[0] === "/" && _request.value[1] === "/")) {
    throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
  }
  const {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    watch: watch2,
    immediate,
    getCachedData,
    deep,
    dedupe,
    ...fetchOptions
  } = opts;
  const _fetchOptions = reactive({
    ...fetchDefaults,
    ...fetchOptions,
    cache: typeof opts.cache === "boolean" ? undefined : opts.cache
  });
  const _asyncDataOptions = {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    immediate,
    getCachedData,
    deep,
    dedupe,
    watch: watch2 === false ? [] : [_fetchOptions, _request, ...watch2 || []]
  };
  let controller;
  const asyncData = useAsyncData(key, () => {
    var _a;
    (_a = controller == null ? undefined : controller.abort) == null ? undefined : _a.call(controller, new DOMException("Request aborted as another request to the same endpoint was initiated.", "AbortError"));
    controller = typeof AbortController !== "undefined" ? new AbortController() : {};
    const timeoutLength = toValue(opts.timeout);
    let timeoutId;
    if (timeoutLength) {
      timeoutId = setTimeout(() => controller.abort(new DOMException("Request aborted due to timeout.", "AbortError")), timeoutLength);
      controller.signal.onabort = () => clearTimeout(timeoutId);
    }
    let _$fetch = opts.$fetch || globalThis.$fetch;
    if (!opts.$fetch) {
      const isLocalFetch = typeof _request.value === "string" && _request.value[0] === "/" && (!toValue(opts.baseURL) || toValue(opts.baseURL)[0] === "/");
      if (isLocalFetch) {
        _$fetch = useRequestFetch();
      }
    }
    return _$fetch(_request.value, { signal: controller.signal, ..._fetchOptions }).finally(() => {
      clearTimeout(timeoutId);
    });
  }, _asyncDataOptions);
  return asyncData;
}
function generateOptionSegments(opts) {
  var _a;
  const segments = [
    ((_a = toValue(opts.method)) == null ? undefined : _a.toUpperCase()) || "GET",
    toValue(opts.baseURL)
  ];
  for (const _obj of [opts.params || opts.query]) {
    const obj = toValue(_obj);
    if (!obj) {
      continue;
    }
    const unwrapped = {};
    for (const [key, value] of Object.entries(obj)) {
      unwrapped[toValue(key)] = toValue(value);
    }
    segments.push(unwrapped);
  }
  return segments;
}
const internalSelectionMenuInjectionKey = createInjectionKey("n-internal-select-menu");
const internalSelectionMenuBodyInjectionKey = createInjectionKey("n-internal-select-menu-body");
const teleportDisabled = "__disabled__";
function useAdjustedTo(props) {
  const modal = inject(modalBodyInjectionKey, null);
  const drawer = inject(drawerBodyInjectionKey, null);
  const popover = inject(popoverBodyInjectionKey, null);
  const selectMenu = inject(internalSelectionMenuBodyInjectionKey, null);
  const fullscreenElementRef = ref();
  return useMemo(() => {
    var _a;
    const {
      to
    } = props;
    if (to !== undefined) {
      if (to === false) return teleportDisabled;
      if (to === true) return fullscreenElementRef.value || "body";
      return to;
    }
    if (modal === null || modal === undefined ? undefined : modal.value) {
      return (_a = modal.value.$el) !== null && _a !== undefined ? _a : modal.value;
    }
    if (drawer === null || drawer === undefined ? undefined : drawer.value) return drawer.value;
    if (popover === null || popover === undefined ? undefined : popover.value) return popover.value;
    if (selectMenu === null || selectMenu === undefined ? undefined : selectMenu.value) return selectMenu.value;
    return to !== null && to !== undefined ? to : fullscreenElementRef.value || "body";
  });
}
useAdjustedTo.tdkey = teleportDisabled;
useAdjustedTo.propTo = {
  type: [String, Object, Boolean],
  default: undefined
};
function useOnResize(elRef, onResize) {
  if (onResize) {
    watch(elRef, (_, oldEl) => {
      if (oldEl) {
        resizeObserverManager.unregisterHandler(oldEl);
      }
    }, {
      deep: false
    });
  }
}
let _isJsdom;
function isJsdom() {
  if (_isJsdom === undefined) {
    _isJsdom = (undefined).userAgent.includes("Node.js") || (undefined).userAgent.includes("jsdom");
  }
  return _isJsdom;
}
function getTitleAttribute(value) {
  switch (typeof value) {
    case "string":
      return value || undefined;
    case "number":
      return String(value);
    default:
      return undefined;
  }
}
function mergeEventHandlers(handlers) {
  const filteredHandlers = handlers.filter((handler) => handler !== undefined);
  if (filteredHandlers.length === 0) return undefined;
  if (filteredHandlers.length === 1) return filteredHandlers[0];
  return (e) => {
    handlers.forEach((handler) => {
      if (handler) {
        handler(e);
      }
    });
  };
}
const enUS = {
  name: "en-US",
  global: {
    undo: "Undo",
    redo: "Redo",
    confirm: "Confirm",
    clear: "Clear"
  },
  Popconfirm: {
    positiveText: "Confirm",
    negativeText: "Cancel"
  },
  Cascader: {
    placeholder: "Please Select",
    loading: "Loading",
    loadingRequiredMessage: (label) => `Please load all ${label}'s descendants before checking it.`
  },
  Time: {
    dateFormat: "yyyy-MM-dd",
    dateTimeFormat: "yyyy-MM-dd HH:mm:ss"
  },
  DatePicker: {
    yearFormat: "yyyy",
    monthFormat: "MMM",
    dayFormat: "eeeeee",
    yearTypeFormat: "yyyy",
    monthTypeFormat: "yyyy-MM",
    dateFormat: "yyyy-MM-dd",
    dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
    quarterFormat: "yyyy-qqq",
    weekFormat: "YYYY-w",
    clear: "Clear",
    now: "Now",
    confirm: "Confirm",
    selectTime: "Select Time",
    selectDate: "Select Date",
    datePlaceholder: "Select Date",
    datetimePlaceholder: "Select Date and Time",
    monthPlaceholder: "Select Month",
    yearPlaceholder: "Select Year",
    quarterPlaceholder: "Select Quarter",
    weekPlaceholder: "Select Week",
    startDatePlaceholder: "Start Date",
    endDatePlaceholder: "End Date",
    startDatetimePlaceholder: "Start Date and Time",
    endDatetimePlaceholder: "End Date and Time",
    startMonthPlaceholder: "Start Month",
    endMonthPlaceholder: "End Month",
    monthBeforeYear: true,
    firstDayOfWeek: 6,
    today: "Today"
  },
  DataTable: {
    checkTableAll: "Select all in the table",
    uncheckTableAll: "Unselect all in the table",
    confirm: "Confirm",
    clear: "Clear"
  },
  LegacyTransfer: {
    sourceTitle: "Source",
    targetTitle: "Target"
  },
  Transfer: {
    selectAll: "Select all",
    unselectAll: "Unselect all",
    clearAll: "Clear",
    total: (num) => `Total ${num} items`,
    selected: (num) => `${num} items selected`
  },
  Empty: {
    description: "No Data"
  },
  Select: {
    placeholder: "Please Select"
  },
  TimePicker: {
    placeholder: "Select Time",
    positiveText: "OK",
    negativeText: "Cancel",
    now: "Now",
    clear: "Clear"
  },
  Pagination: {
    goto: "Goto",
    selectionSuffix: "page"
  },
  DynamicTags: {
    add: "Add"
  },
  Log: {
    loading: "Loading"
  },
  Input: {
    placeholder: "Please Input"
  },
  InputNumber: {
    placeholder: "Please Input"
  },
  DynamicInput: {
    create: "Create"
  },
  ThemeEditor: {
    title: "Theme Editor",
    clearAllVars: "Clear All Variables",
    clearSearch: "Clear Search",
    filterCompName: "Filter Component Name",
    filterVarName: "Filter Variable Name",
    import: "Import",
    export: "Export",
    restore: "Reset to Default"
  },
  Image: {
    tipPrevious: "Previous picture (\u2190)",
    tipNext: "Next picture (\u2192)",
    tipCounterclockwise: "Counterclockwise",
    tipClockwise: "Clockwise",
    tipZoomOut: "Zoom out",
    tipZoomIn: "Zoom in",
    tipDownload: "Download",
    tipClose: "Close (Esc)",
    // TODO: translation
    tipOriginalSize: "Zoom to original size"
  }
};
const dateEnUs = {
  name: "en-US",
  locale: enUS$1
};
function useLocale(ns) {
  const {
    mergedLocaleRef,
    mergedDateLocaleRef
  } = inject(configProviderInjectionKey, null) || {};
  const localeRef = computed(() => {
    var _a, _b;
    return (_b = (_a = mergedLocaleRef === null || mergedLocaleRef === undefined ? undefined : mergedLocaleRef.value) === null || _a === undefined ? undefined : _a[ns]) !== null && _b !== undefined ? _b : enUS[ns];
  });
  const dateLocaleRef = computed(() => {
    var _a;
    return (_a = mergedDateLocaleRef === null || mergedDateLocaleRef === undefined ? undefined : mergedDateLocaleRef.value) !== null && _a !== undefined ? _a : dateEnUs;
  });
  return {
    dateLocaleRef,
    localeRef
  };
}
const FinishedIcon = defineComponent({
  name: "Checkmark",
  render() {
    return h("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16"
    }, h("g", {
      fill: "none"
    }, h("path", {
      d: "M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z",
      fill: "currentColor"
    })));
  }
});
const ChevronDownIcon = defineComponent({
  name: "ChevronDown",
  render() {
    return h("svg", {
      viewBox: "0 0 16 16",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, h("path", {
      d: "M3.14645 5.64645C3.34171 5.45118 3.65829 5.45118 3.85355 5.64645L8 9.79289L12.1464 5.64645C12.3417 5.45118 12.6583 5.45118 12.8536 5.64645C13.0488 5.84171 13.0488 6.15829 12.8536 6.35355L8.35355 10.8536C8.15829 11.0488 7.84171 11.0488 7.64645 10.8536L3.14645 6.35355C2.95118 6.15829 2.95118 5.84171 3.14645 5.64645Z",
      fill: "currentColor"
    }));
  }
});
const ClearIcon = replaceable("clear", () => h("svg", {
  viewBox: "0 0 16 16",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
}, h("g", {
  stroke: "none",
  "stroke-width": "1",
  fill: "none",
  "fill-rule": "evenodd"
}, h("g", {
  fill: "currentColor",
  "fill-rule": "nonzero"
}, h("path", {
  d: "M8,2 C11.3137085,2 14,4.6862915 14,8 C14,11.3137085 11.3137085,14 8,14 C4.6862915,14 2,11.3137085 2,8 C2,4.6862915 4.6862915,2 8,2 Z M6.5343055,5.83859116 C6.33943736,5.70359511 6.07001296,5.72288026 5.89644661,5.89644661 L5.89644661,5.89644661 L5.83859116,5.9656945 C5.70359511,6.16056264 5.72288026,6.42998704 5.89644661,6.60355339 L5.89644661,6.60355339 L7.293,8 L5.89644661,9.39644661 L5.83859116,9.4656945 C5.70359511,9.66056264 5.72288026,9.92998704 5.89644661,10.1035534 L5.89644661,10.1035534 L5.9656945,10.1614088 C6.16056264,10.2964049 6.42998704,10.2771197 6.60355339,10.1035534 L6.60355339,10.1035534 L8,8.707 L9.39644661,10.1035534 L9.4656945,10.1614088 C9.66056264,10.2964049 9.92998704,10.2771197 10.1035534,10.1035534 L10.1035534,10.1035534 L10.1614088,10.0343055 C10.2964049,9.83943736 10.2771197,9.57001296 10.1035534,9.39644661 L10.1035534,9.39644661 L8.707,8 L10.1035534,6.60355339 L10.1614088,6.5343055 C10.2964049,6.33943736 10.2771197,6.07001296 10.1035534,5.89644661 L10.1035534,5.89644661 L10.0343055,5.83859116 C9.83943736,5.70359511 9.57001296,5.72288026 9.39644661,5.89644661 L9.39644661,5.89644661 L8,7.293 L6.60355339,5.89644661 Z"
})))));
const EmptyIcon = defineComponent({
  name: "Empty",
  render() {
    return h("svg", {
      viewBox: "0 0 28 28",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, h("path", {
      d: "M26 7.5C26 11.0899 23.0899 14 19.5 14C15.9101 14 13 11.0899 13 7.5C13 3.91015 15.9101 1 19.5 1C23.0899 1 26 3.91015 26 7.5ZM16.8536 4.14645C16.6583 3.95118 16.3417 3.95118 16.1464 4.14645C15.9512 4.34171 15.9512 4.65829 16.1464 4.85355L18.7929 7.5L16.1464 10.1464C15.9512 10.3417 15.9512 10.6583 16.1464 10.8536C16.3417 11.0488 16.6583 11.0488 16.8536 10.8536L19.5 8.20711L22.1464 10.8536C22.3417 11.0488 22.6583 11.0488 22.8536 10.8536C23.0488 10.6583 23.0488 10.3417 22.8536 10.1464L20.2071 7.5L22.8536 4.85355C23.0488 4.65829 23.0488 4.34171 22.8536 4.14645C22.6583 3.95118 22.3417 3.95118 22.1464 4.14645L19.5 6.79289L16.8536 4.14645Z",
      fill: "currentColor"
    }), h("path", {
      d: "M25 22.75V12.5991C24.5572 13.0765 24.053 13.4961 23.5 13.8454V16H17.5L17.3982 16.0068C17.0322 16.0565 16.75 16.3703 16.75 16.75C16.75 18.2688 15.5188 19.5 14 19.5C12.4812 19.5 11.25 18.2688 11.25 16.75L11.2432 16.6482C11.1935 16.2822 10.8797 16 10.5 16H4.5V7.25C4.5 6.2835 5.2835 5.5 6.25 5.5H12.2696C12.4146 4.97463 12.6153 4.47237 12.865 4H6.25C4.45507 4 3 5.45507 3 7.25V22.75C3 24.5449 4.45507 26 6.25 26H21.75C23.5449 26 25 24.5449 25 22.75ZM4.5 22.75V17.5H9.81597L9.85751 17.7041C10.2905 19.5919 11.9808 21 14 21L14.215 20.9947C16.2095 20.8953 17.842 19.4209 18.184 17.5H23.5V22.75C23.5 23.7165 22.7165 24.5 21.75 24.5H6.25C5.2835 24.5 4.5 23.7165 4.5 22.75Z",
      fill: "currentColor"
    }));
  }
});
const EyeIcon = defineComponent({
  name: "Eye",
  render() {
    return h("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512"
    }, h("path", {
      d: "M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 0 0-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 0 0 0-17.47C428.89 172.28 347.8 112 255.66 112z",
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "32"
    }), h("circle", {
      cx: "256",
      cy: "256",
      r: "80",
      fill: "none",
      stroke: "currentColor",
      "stroke-miterlimit": "10",
      "stroke-width": "32"
    }));
  }
});
const EyeOffIcon = defineComponent({
  name: "EyeOff",
  render() {
    return h("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512"
    }, h("path", {
      d: "M432 448a15.92 15.92 0 0 1-11.31-4.69l-352-352a16 16 0 0 1 22.62-22.62l352 352A16 16 0 0 1 432 448z",
      fill: "currentColor"
    }), h("path", {
      d: "M255.66 384c-41.49 0-81.5-12.28-118.92-36.5c-34.07-22-64.74-53.51-88.7-91v-.08c19.94-28.57 41.78-52.73 65.24-72.21a2 2 0 0 0 .14-2.94L93.5 161.38a2 2 0 0 0-2.71-.12c-24.92 21-48.05 46.76-69.08 76.92a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416a239.13 239.13 0 0 0 75.8-12.58a2 2 0 0 0 .77-3.31l-21.58-21.58a4 4 0 0 0-3.83-1a204.8 204.8 0 0 1-51.16 6.47z",
      fill: "currentColor"
    }), h("path", {
      d: "M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96a227.34 227.34 0 0 0-74.89 12.83a2 2 0 0 0-.75 3.31l21.55 21.55a4 4 0 0 0 3.88 1a192.82 192.82 0 0 1 50.21-6.69c40.69 0 80.58 12.43 118.55 37c34.71 22.4 65.74 53.88 89.76 91a.13.13 0 0 1 0 .16a310.72 310.72 0 0 1-64.12 72.73a2 2 0 0 0-.15 2.95l19.9 19.89a2 2 0 0 0 2.7.13a343.49 343.49 0 0 0 68.64-78.48a32.2 32.2 0 0 0-.1-34.78z",
      fill: "currentColor"
    }), h("path", {
      d: "M256 160a95.88 95.88 0 0 0-21.37 2.4a2 2 0 0 0-1 3.38l112.59 112.56a2 2 0 0 0 3.38-1A96 96 0 0 0 256 160z",
      fill: "currentColor"
    }), h("path", {
      d: "M165.78 233.66a2 2 0 0 0-3.38 1a96 96 0 0 0 115 115a2 2 0 0 0 1-3.38z",
      fill: "currentColor"
    }));
  }
});
const style$8 = cB("base-clear", `
 flex-shrink: 0;
 height: 1em;
 width: 1em;
 position: relative;
`, [c(">", [cE("clear", `
 font-size: var(--n-clear-size);
 height: 1em;
 width: 1em;
 cursor: pointer;
 color: var(--n-clear-color);
 transition: color .3s var(--n-bezier);
 display: flex;
 `, [c("&:hover", `
 color: var(--n-clear-color-hover)!important;
 `), c("&:active", `
 color: var(--n-clear-color-pressed)!important;
 `)]), cE("placeholder", `
 display: flex;
 `), cE("clear, placeholder", `
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `, [iconSwitchTransition({
  originalTransform: "translateX(-50%) translateY(-50%)",
  left: "50%",
  top: "50%"
})])])]);
const NBaseClear = defineComponent({
  name: "BaseClear",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    show: Boolean,
    onClear: Function
  },
  setup(props) {
    useStyle("-base-clear", style$8, toRef(props, "clsPrefix"));
    return {
      handleMouseDown(e) {
        e.preventDefault();
      }
    };
  },
  render() {
    const {
      clsPrefix
    } = this;
    return h("div", {
      class: `${clsPrefix}-base-clear`
    }, h(NIconSwitchTransition, null, {
      default: () => {
        var _a, _b;
        return this.show ? h("div", {
          key: "dismiss",
          class: `${clsPrefix}-base-clear__clear`,
          onClick: this.onClear,
          onMousedown: this.handleMouseDown,
          "data-clear": true
        }, resolveSlot(this.$slots.icon, () => [h(NBaseIcon, {
          clsPrefix
        }, {
          default: () => h(ClearIcon, null)
        })])) : h("div", {
          key: "icon",
          class: `${clsPrefix}-base-clear__placeholder`
        }, (_b = (_a = this.$slots).placeholder) === null || _b === undefined ? undefined : _b.call(_a));
      }
    }));
  }
});
const FocusDetector = defineComponent({
  props: {
    onFocus: Function,
    onBlur: Function
  },
  setup(props) {
    return () => h("div", {
      style: "width: 0; height: 0",
      tabindex: 0,
      onFocus: props.onFocus,
      onBlur: props.onBlur
    });
  }
});
const style$7 = cB("empty", `
 display: flex;
 flex-direction: column;
 align-items: center;
 font-size: var(--n-font-size);
`, [cE("icon", `
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 line-height: var(--n-icon-size);
 color: var(--n-icon-color);
 transition:
 color .3s var(--n-bezier);
 `, [c("+", [cE("description", `
 margin-top: 8px;
 `)])]), cE("description", `
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `), cE("extra", `
 text-align: center;
 transition: color .3s var(--n-bezier);
 margin-top: 12px;
 color: var(--n-extra-text-color);
 `)]);
const emptyProps = Object.assign(Object.assign({}, useTheme.props), {
  description: String,
  showDescription: {
    type: Boolean,
    default: true
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: "medium"
  },
  renderIcon: Function
});
const NEmpty = defineComponent({
  name: "Empty",
  props: emptyProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const themeRef = useTheme("Empty", "-empty", style$7, emptyLight, props, mergedClsPrefixRef);
    const {
      localeRef
    } = useLocale("Empty");
    const mergedDescriptionRef = computed(() => {
      var _a, _b, _c;
      return (_a = props.description) !== null && _a !== undefined ? _a : (_c = (_b = mergedComponentPropsRef === null || mergedComponentPropsRef === undefined ? undefined : mergedComponentPropsRef.value) === null || _b === undefined ? undefined : _b.Empty) === null || _c === undefined ? undefined : _c.description;
    });
    const mergedRenderIconRef = computed(() => {
      var _a, _b;
      return ((_b = (_a = mergedComponentPropsRef === null || mergedComponentPropsRef === undefined ? undefined : mergedComponentPropsRef.value) === null || _a === undefined ? undefined : _a.Empty) === null || _b === undefined ? undefined : _b.renderIcon) || (() => h(EmptyIcon, null));
    });
    const cssVarsRef = computed(() => {
      const {
        size
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          [createKey("iconSize", size)]: iconSize,
          [createKey("fontSize", size)]: fontSize,
          textColor,
          iconColor,
          extraTextColor
        }
      } = themeRef.value;
      return {
        "--n-icon-size": iconSize,
        "--n-font-size": fontSize,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-text-color": textColor,
        "--n-icon-color": iconColor,
        "--n-extra-text-color": extraTextColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("empty", computed(() => {
      let hash2 = "";
      const {
        size
      } = props;
      hash2 += size[0];
      return hash2;
    }), cssVarsRef, props) : undefined;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedRenderIcon: mergedRenderIconRef,
      localizedDescription: computed(() => {
        return mergedDescriptionRef.value || localeRef.value.description;
      }),
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    };
  },
  render() {
    const {
      $slots,
      mergedClsPrefix,
      onRender
    } = this;
    onRender === null || onRender === undefined ? undefined : onRender();
    return h("div", {
      class: [`${mergedClsPrefix}-empty`, this.themeClass],
      style: this.cssVars
    }, this.showIcon ? h("div", {
      class: `${mergedClsPrefix}-empty__icon`
    }, $slots.icon ? $slots.icon() : h(NBaseIcon, {
      clsPrefix: mergedClsPrefix
    }, {
      default: this.mergedRenderIcon
    })) : null, this.showDescription ? h("div", {
      class: `${mergedClsPrefix}-empty__description`
    }, $slots.default ? $slots.default() : this.localizedDescription) : null, $slots.extra ? h("div", {
      class: `${mergedClsPrefix}-empty__extra`
    }, $slots.extra()) : null);
  }
});
const NSelectGroupHeader = defineComponent({
  name: "NBaseSelectGroupHeader",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    tmNode: {
      type: Object,
      required: true
    }
  },
  setup() {
    const {
      renderLabelRef,
      renderOptionRef,
      labelFieldRef,
      nodePropsRef
    } = inject(internalSelectionMenuInjectionKey);
    return {
      labelField: labelFieldRef,
      nodeProps: nodePropsRef,
      renderLabel: renderLabelRef,
      renderOption: renderOptionRef
    };
  },
  render() {
    const {
      clsPrefix,
      renderLabel,
      renderOption,
      nodeProps,
      tmNode: {
        rawNode
      }
    } = this;
    const attrs = nodeProps === null || nodeProps === undefined ? undefined : nodeProps(rawNode);
    const children = renderLabel ? renderLabel(rawNode, false) : render(rawNode[this.labelField], rawNode, false);
    const node = h("div", Object.assign({}, attrs, {
      class: [`${clsPrefix}-base-select-group-header`, attrs === null || attrs === undefined ? undefined : attrs.class]
    }), children);
    return rawNode.render ? rawNode.render({
      node,
      option: rawNode
    }) : renderOption ? renderOption({
      node,
      option: rawNode,
      selected: false
    }) : node;
  }
});
function renderCheckMark(show, clsPrefix) {
  return h(Transition, {
    name: "fade-in-scale-up-transition"
  }, {
    default: () => show ? h(NBaseIcon, {
      clsPrefix,
      class: `${clsPrefix}-base-select-option__check`
    }, {
      default: () => h(FinishedIcon)
    }) : null
  });
}
const NSelectOption = defineComponent({
  name: "NBaseSelectOption",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    tmNode: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const {
      valueRef,
      pendingTmNodeRef,
      multipleRef,
      valueSetRef,
      renderLabelRef,
      renderOptionRef,
      labelFieldRef,
      valueFieldRef,
      showCheckmarkRef,
      nodePropsRef,
      handleOptionClick,
      handleOptionMouseEnter
    } = inject(internalSelectionMenuInjectionKey);
    const isPendingRef = useMemo(() => {
      const {
        value: pendingTmNode
      } = pendingTmNodeRef;
      if (!pendingTmNode) return false;
      return props.tmNode.key === pendingTmNode.key;
    });
    function handleClick(e) {
      const {
        tmNode
      } = props;
      if (tmNode.disabled) return;
      handleOptionClick(e, tmNode);
    }
    function handleMouseEnter(e) {
      const {
        tmNode
      } = props;
      if (tmNode.disabled) return;
      handleOptionMouseEnter(e, tmNode);
    }
    function handleMouseMove(e) {
      const {
        tmNode
      } = props;
      const {
        value: isPending
      } = isPendingRef;
      if (tmNode.disabled || isPending) return;
      handleOptionMouseEnter(e, tmNode);
    }
    return {
      multiple: multipleRef,
      isGrouped: useMemo(() => {
        const {
          tmNode
        } = props;
        const {
          parent
        } = tmNode;
        return parent && parent.rawNode.type === "group";
      }),
      showCheckmark: showCheckmarkRef,
      nodeProps: nodePropsRef,
      isPending: isPendingRef,
      isSelected: useMemo(() => {
        const {
          value
        } = valueRef;
        const {
          value: multiple
        } = multipleRef;
        if (value === null) return false;
        const optionValue = props.tmNode.rawNode[valueFieldRef.value];
        if (multiple) {
          const {
            value: valueSet
          } = valueSetRef;
          return valueSet.has(optionValue);
        } else {
          return value === optionValue;
        }
      }),
      labelField: labelFieldRef,
      renderLabel: renderLabelRef,
      renderOption: renderOptionRef,
      handleMouseMove,
      handleMouseEnter,
      handleClick
    };
  },
  render() {
    const {
      clsPrefix,
      tmNode: {
        rawNode
      },
      isSelected,
      isPending,
      isGrouped,
      showCheckmark,
      nodeProps,
      renderOption,
      renderLabel,
      handleClick,
      handleMouseEnter,
      handleMouseMove
    } = this;
    const checkmark = renderCheckMark(isSelected, clsPrefix);
    const children = renderLabel ? [renderLabel(rawNode, isSelected), showCheckmark && checkmark] : [render(rawNode[this.labelField], rawNode, isSelected), showCheckmark && checkmark];
    const attrs = nodeProps === null || nodeProps === undefined ? undefined : nodeProps(rawNode);
    const node = h("div", Object.assign({}, attrs, {
      class: [`${clsPrefix}-base-select-option`, rawNode.class, attrs === null || attrs === undefined ? undefined : attrs.class, {
        [`${clsPrefix}-base-select-option--disabled`]: rawNode.disabled,
        [`${clsPrefix}-base-select-option--selected`]: isSelected,
        [`${clsPrefix}-base-select-option--grouped`]: isGrouped,
        [`${clsPrefix}-base-select-option--pending`]: isPending,
        [`${clsPrefix}-base-select-option--show-checkmark`]: showCheckmark
      }],
      style: [(attrs === null || attrs === undefined ? undefined : attrs.style) || "", rawNode.style || ""],
      onClick: mergeEventHandlers([handleClick, attrs === null || attrs === undefined ? undefined : attrs.onClick]),
      onMouseenter: mergeEventHandlers([handleMouseEnter, attrs === null || attrs === undefined ? undefined : attrs.onMouseenter]),
      onMousemove: mergeEventHandlers([handleMouseMove, attrs === null || attrs === undefined ? undefined : attrs.onMousemove])
    }), h("div", {
      class: `${clsPrefix}-base-select-option__content`
    }, children));
    return rawNode.render ? rawNode.render({
      node,
      option: rawNode,
      selected: isSelected
    }) : renderOption ? renderOption({
      node,
      option: rawNode,
      selected: isSelected
    }) : node;
  }
});
const style$6 = cB("base-select-menu", `
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`, [cB("scrollbar", `
 max-height: var(--n-height);
 `), cB("virtual-list", `
 max-height: var(--n-height);
 `), cB("base-select-option", `
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `, [cE("content", `
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]), cB("base-select-group-header", `
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `), cB("base-select-menu-option-wrapper", `
 position: relative;
 width: 100%;
 `), cE("loading, empty", `
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `), cE("loading", `
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `), cE("header", `
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `), cE("action", `
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `), cB("base-select-group-header", `
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `), cB("base-select-option", `
 cursor: pointer;
 position: relative;
 padding: var(--n-option-padding);
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 box-sizing: border-box;
 color: var(--n-option-text-color);
 opacity: 1;
 `, [cM("show-checkmark", `
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `), c("&::before", `
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `), c("&:active", `
 color: var(--n-option-text-color-pressed);
 `), cM("grouped", `
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `), cM("pending", [c("&::before", `
 background-color: var(--n-option-color-pending);
 `)]), cM("selected", `
 color: var(--n-option-text-color-active);
 `, [c("&::before", `
 background-color: var(--n-option-color-active);
 `), cM("pending", [c("&::before", `
 background-color: var(--n-option-color-active-pending);
 `)])]), cM("disabled", `
 cursor: not-allowed;
 `, [cNotM("selected", `
 color: var(--n-option-text-color-disabled);
 `), cM("selected", `
 opacity: var(--n-option-opacity-disabled);
 `)]), cE("check", `
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `, [fadeInScaleUpTransition({
  enterScale: "0.5"
})])])]);
const NInternalSelectMenu = defineComponent({
  name: "InternalSelectMenu",
  props: Object.assign(Object.assign({}, useTheme.props), {
    clsPrefix: {
      type: String,
      required: true
    },
    scrollable: {
      type: Boolean,
      default: true
    },
    treeMate: {
      type: Object,
      required: true
    },
    multiple: Boolean,
    size: {
      type: String,
      default: "medium"
    },
    value: {
      type: [String, Number, Array],
      default: null
    },
    autoPending: Boolean,
    virtualScroll: {
      type: Boolean,
      default: true
    },
    // show is used to toggle pending state initialization
    show: {
      type: Boolean,
      default: true
    },
    labelField: {
      type: String,
      default: "label"
    },
    valueField: {
      type: String,
      default: "value"
    },
    loading: Boolean,
    focusable: Boolean,
    renderLabel: Function,
    renderOption: Function,
    nodeProps: Function,
    showCheckmark: {
      type: Boolean,
      default: true
    },
    onMousedown: Function,
    onScroll: Function,
    onFocus: Function,
    onBlur: Function,
    onKeyup: Function,
    onKeydown: Function,
    onTabOut: Function,
    onMouseenter: Function,
    onMouseleave: Function,
    onResize: Function,
    resetMenuOnOptionsChange: {
      type: Boolean,
      default: true
    },
    inlineThemeDisabled: Boolean,
    // deprecated
    onToggle: Function
  }),
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("InternalSelectMenu", mergedRtlRef, mergedClsPrefixRef);
    const themeRef = useTheme("InternalSelectMenu", "-internal-select-menu", style$6, internalSelectMenuLight, props, toRef(props, "clsPrefix"));
    const selfRef = ref(null);
    const virtualListRef = ref(null);
    const scrollbarRef = ref(null);
    const flattenedNodesRef = computed(() => props.treeMate.getFlattenedNodes());
    const fIndexGetterRef = computed(() => createIndexGetter(flattenedNodesRef.value));
    const pendingNodeRef = ref(null);
    function initPendingNode() {
      const {
        treeMate
      } = props;
      let defaultPendingNode = null;
      const {
        value
      } = props;
      if (value === null) {
        defaultPendingNode = treeMate.getFirstAvailableNode();
      } else {
        if (props.multiple) {
          defaultPendingNode = treeMate.getNode((value || [])[(value || []).length - 1]);
        } else {
          defaultPendingNode = treeMate.getNode(value);
        }
        if (!defaultPendingNode || defaultPendingNode.disabled) {
          defaultPendingNode = treeMate.getFirstAvailableNode();
        }
      }
      if (defaultPendingNode) {
        setPendingTmNode(defaultPendingNode);
      } else {
        setPendingTmNode(null);
      }
    }
    function clearPendingNodeIfInvalid() {
      const {
        value: pendingNode
      } = pendingNodeRef;
      if (pendingNode && !props.treeMate.getNode(pendingNode.key)) {
        pendingNodeRef.value = null;
      }
    }
    let initPendingNodeWatchStopHandle;
    watch(() => props.show, (show) => {
      if (show) {
        initPendingNodeWatchStopHandle = watch(() => props.treeMate, () => {
          if (props.resetMenuOnOptionsChange) {
            if (props.autoPending) {
              initPendingNode();
            } else {
              clearPendingNodeIfInvalid();
            }
            void nextTick(scrollToPendingNode);
          } else {
            clearPendingNodeIfInvalid();
          }
        }, {
          immediate: true
        });
      } else {
        initPendingNodeWatchStopHandle === null || initPendingNodeWatchStopHandle === undefined ? undefined : initPendingNodeWatchStopHandle();
      }
    }, {
      immediate: true
    });
    const itemSizeRef = computed(() => {
      return depx(themeRef.value.self[createKey("optionHeight", props.size)]);
    });
    const paddingRef = computed(() => {
      return getPadding(themeRef.value.self[createKey("padding", props.size)]);
    });
    const valueSetRef = computed(() => {
      if (props.multiple && Array.isArray(props.value)) {
        return new Set(props.value);
      }
      return /* @__PURE__ */ new Set();
    });
    const emptyRef = computed(() => {
      const tmNodes = flattenedNodesRef.value;
      return tmNodes && tmNodes.length === 0;
    });
    function doToggle(tmNode) {
      const {
        onToggle
      } = props;
      if (onToggle) onToggle(tmNode);
    }
    function doScroll(e) {
      const {
        onScroll
      } = props;
      if (onScroll) onScroll(e);
    }
    function handleVirtualListScroll(e) {
      var _a;
      (_a = scrollbarRef.value) === null || _a === undefined ? undefined : _a.sync();
      doScroll(e);
    }
    function handleVirtualListResize() {
      var _a;
      (_a = scrollbarRef.value) === null || _a === undefined ? undefined : _a.sync();
    }
    function getPendingTmNode() {
      const {
        value: pendingTmNode
      } = pendingNodeRef;
      if (pendingTmNode) return pendingTmNode;
      return null;
    }
    function handleOptionMouseEnter(e, tmNode) {
      if (tmNode.disabled) return;
      setPendingTmNode(tmNode, false);
    }
    function handleOptionClick(e, tmNode) {
      if (tmNode.disabled) return;
      doToggle(tmNode);
    }
    function handleKeyUp(e) {
      var _a;
      if (happensIn(e, "action")) return;
      (_a = props.onKeyup) === null || _a === undefined ? undefined : _a.call(props, e);
    }
    function handleKeyDown(e) {
      var _a;
      if (happensIn(e, "action")) return;
      (_a = props.onKeydown) === null || _a === undefined ? undefined : _a.call(props, e);
    }
    function handleMouseDown(e) {
      var _a;
      (_a = props.onMousedown) === null || _a === undefined ? undefined : _a.call(props, e);
      if (props.focusable) return;
      e.preventDefault();
    }
    function next() {
      const {
        value: pendingTmNode
      } = pendingNodeRef;
      if (pendingTmNode) {
        setPendingTmNode(pendingTmNode.getNext({
          loop: true
        }), true);
      }
    }
    function prev() {
      const {
        value: pendingTmNode
      } = pendingNodeRef;
      if (pendingTmNode) {
        setPendingTmNode(pendingTmNode.getPrev({
          loop: true
        }), true);
      }
    }
    function setPendingTmNode(tmNode, doScroll2 = false) {
      pendingNodeRef.value = tmNode;
      if (doScroll2) scrollToPendingNode();
    }
    function scrollToPendingNode() {
      var _a, _b;
      const tmNode = pendingNodeRef.value;
      if (!tmNode) return;
      const fIndex = fIndexGetterRef.value(tmNode.key);
      if (fIndex === null) return;
      if (props.virtualScroll) {
        (_a = virtualListRef.value) === null || _a === undefined ? undefined : _a.scrollTo({
          index: fIndex
        });
      } else {
        (_b = scrollbarRef.value) === null || _b === undefined ? undefined : _b.scrollTo({
          index: fIndex,
          elSize: itemSizeRef.value
        });
      }
    }
    function handleFocusin(e) {
      var _a, _b;
      if ((_a = selfRef.value) === null || _a === undefined ? undefined : _a.contains(e.target)) {
        (_b = props.onFocus) === null || _b === undefined ? undefined : _b.call(props, e);
      }
    }
    function handleFocusout(e) {
      var _a, _b;
      if (!((_a = selfRef.value) === null || _a === undefined ? undefined : _a.contains(e.relatedTarget))) {
        (_b = props.onBlur) === null || _b === undefined ? undefined : _b.call(props, e);
      }
    }
    provide(internalSelectionMenuInjectionKey, {
      handleOptionMouseEnter,
      handleOptionClick,
      valueSetRef,
      pendingTmNodeRef: pendingNodeRef,
      nodePropsRef: toRef(props, "nodeProps"),
      showCheckmarkRef: toRef(props, "showCheckmark"),
      multipleRef: toRef(props, "multiple"),
      valueRef: toRef(props, "value"),
      renderLabelRef: toRef(props, "renderLabel"),
      renderOptionRef: toRef(props, "renderOption"),
      labelFieldRef: toRef(props, "labelField"),
      valueFieldRef: toRef(props, "valueField")
    });
    provide(internalSelectionMenuBodyInjectionKey, selfRef);
    const cssVarsRef = computed(() => {
      const {
        size
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          height,
          borderRadius,
          color,
          groupHeaderTextColor,
          actionDividerColor,
          optionTextColorPressed,
          optionTextColor,
          optionTextColorDisabled,
          optionTextColorActive,
          optionOpacityDisabled,
          optionCheckColor,
          actionTextColor,
          optionColorPending,
          optionColorActive,
          loadingColor,
          loadingSize,
          optionColorActivePending,
          [createKey("optionFontSize", size)]: fontSize,
          [createKey("optionHeight", size)]: optionHeight,
          [createKey("optionPadding", size)]: optionPadding
        }
      } = themeRef.value;
      return {
        "--n-height": height,
        "--n-action-divider-color": actionDividerColor,
        "--n-action-text-color": actionTextColor,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-border-radius": borderRadius,
        "--n-color": color,
        "--n-option-font-size": fontSize,
        "--n-group-header-text-color": groupHeaderTextColor,
        "--n-option-check-color": optionCheckColor,
        "--n-option-color-pending": optionColorPending,
        "--n-option-color-active": optionColorActive,
        "--n-option-color-active-pending": optionColorActivePending,
        "--n-option-height": optionHeight,
        "--n-option-opacity-disabled": optionOpacityDisabled,
        "--n-option-text-color": optionTextColor,
        "--n-option-text-color-active": optionTextColorActive,
        "--n-option-text-color-disabled": optionTextColorDisabled,
        "--n-option-text-color-pressed": optionTextColorPressed,
        "--n-option-padding": optionPadding,
        "--n-option-padding-left": getPadding(optionPadding, "left"),
        "--n-option-padding-right": getPadding(optionPadding, "right"),
        "--n-loading-color": loadingColor,
        "--n-loading-size": loadingSize
      };
    });
    const {
      inlineThemeDisabled
    } = props;
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("internal-select-menu", computed(() => props.size[0]), cssVarsRef, props) : undefined;
    const exposedProps = {
      selfRef,
      next,
      prev,
      getPendingTmNode
    };
    useOnResize(selfRef, props.onResize);
    return Object.assign({
      mergedTheme: themeRef,
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      virtualListRef,
      scrollbarRef,
      itemSize: itemSizeRef,
      padding: paddingRef,
      flattenedNodes: flattenedNodesRef,
      empty: emptyRef,
      virtualListContainer() {
        const {
          value
        } = virtualListRef;
        return value === null || value === undefined ? undefined : value.listElRef;
      },
      virtualListContent() {
        const {
          value
        } = virtualListRef;
        return value === null || value === undefined ? undefined : value.itemsElRef;
      },
      doScroll,
      handleFocusin,
      handleFocusout,
      handleKeyUp,
      handleKeyDown,
      handleMouseDown,
      handleVirtualListResize,
      handleVirtualListScroll,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    }, exposedProps);
  },
  render() {
    const {
      $slots,
      virtualScroll,
      clsPrefix,
      mergedTheme,
      themeClass,
      onRender
    } = this;
    onRender === null || onRender === undefined ? undefined : onRender();
    return h("div", {
      ref: "selfRef",
      tabindex: this.focusable ? 0 : -1,
      class: [`${clsPrefix}-base-select-menu`, this.rtlEnabled && `${clsPrefix}-base-select-menu--rtl`, themeClass, this.multiple && `${clsPrefix}-base-select-menu--multiple`],
      style: this.cssVars,
      onFocusin: this.handleFocusin,
      onFocusout: this.handleFocusout,
      onKeyup: this.handleKeyUp,
      onKeydown: this.handleKeyDown,
      onMousedown: this.handleMouseDown,
      onMouseenter: this.onMouseenter,
      onMouseleave: this.onMouseleave
    }, resolveWrappedSlot($slots.header, (children) => children && h("div", {
      class: `${clsPrefix}-base-select-menu__header`,
      "data-header": true,
      key: "header"
    }, children)), this.loading ? h("div", {
      class: `${clsPrefix}-base-select-menu__loading`
    }, h(NBaseLoading, {
      clsPrefix,
      strokeWidth: 20
    })) : !this.empty ? h(Scrollbar, {
      ref: "scrollbarRef",
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar,
      scrollable: this.scrollable,
      container: virtualScroll ? this.virtualListContainer : undefined,
      content: virtualScroll ? this.virtualListContent : undefined,
      onScroll: virtualScroll ? undefined : this.doScroll
    }, {
      default: () => {
        return virtualScroll ? h(VirtualList, {
          ref: "virtualListRef",
          class: `${clsPrefix}-virtual-list`,
          items: this.flattenedNodes,
          itemSize: this.itemSize,
          showScrollbar: false,
          paddingTop: this.padding.top,
          paddingBottom: this.padding.bottom,
          onResize: this.handleVirtualListResize,
          onScroll: this.handleVirtualListScroll,
          itemResizable: true
        }, {
          default: ({
            item: tmNode
          }) => {
            return tmNode.isGroup ? h(NSelectGroupHeader, {
              key: tmNode.key,
              clsPrefix,
              tmNode
            }) : tmNode.ignored ? null : h(NSelectOption, {
              clsPrefix,
              key: tmNode.key,
              tmNode
            });
          }
        }) : h("div", {
          class: `${clsPrefix}-base-select-menu-option-wrapper`,
          style: {
            paddingTop: this.padding.top,
            paddingBottom: this.padding.bottom
          }
        }, this.flattenedNodes.map((tmNode) => tmNode.isGroup ? h(NSelectGroupHeader, {
          key: tmNode.key,
          clsPrefix,
          tmNode
        }) : h(NSelectOption, {
          clsPrefix,
          key: tmNode.key,
          tmNode
        })));
      }
    }) : h("div", {
      class: `${clsPrefix}-base-select-menu__empty`,
      "data-empty": true
    }, resolveSlot($slots.empty, () => [h(NEmpty, {
      theme: mergedTheme.peers.Empty,
      themeOverrides: mergedTheme.peerOverrides.Empty,
      size: this.size
    })])), resolveWrappedSlot($slots.action, (children) => children && [h("div", {
      class: `${clsPrefix}-base-select-menu__action`,
      "data-action": true,
      key: "action"
    }, children), h(FocusDetector, {
      onFocus: this.onTabOut,
      key: "focus-detector"
    })]));
  }
});
const oppositePlacement = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
};
const arrowSize = "var(--n-arrow-height) * 1.414";
const style$5 = c([cB("popover", `
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 position: relative;
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 box-shadow: var(--n-box-shadow);
 word-break: break-word;
 `, [c(">", [cB("scrollbar", `
 height: inherit;
 max-height: inherit;
 `)]), cNotM("raw", `
 background-color: var(--n-color);
 border-radius: var(--n-border-radius);
 `, [cNotM("scrollable", [cNotM("show-header-or-footer", "padding: var(--n-padding);")])]), cE("header", `
 padding: var(--n-padding);
 border-bottom: 1px solid var(--n-divider-color);
 transition: border-color .3s var(--n-bezier);
 `), cE("footer", `
 padding: var(--n-padding);
 border-top: 1px solid var(--n-divider-color);
 transition: border-color .3s var(--n-bezier);
 `), cM("scrollable, show-header-or-footer", [cE("content", `
 padding: var(--n-padding);
 `)])]), cB("popover-shared", `
 transform-origin: inherit;
 `, [
  cB("popover-arrow-wrapper", `
 position: absolute;
 overflow: hidden;
 pointer-events: none;
 `, [cB("popover-arrow", `
 transition: background-color .3s var(--n-bezier);
 position: absolute;
 display: block;
 width: calc(${arrowSize});
 height: calc(${arrowSize});
 box-shadow: 0 0 8px 0 rgba(0, 0, 0, .12);
 transform: rotate(45deg);
 background-color: var(--n-color);
 pointer-events: all;
 `)]),
  // body transition
  c("&.popover-transition-enter-from, &.popover-transition-leave-to", `
 opacity: 0;
 transform: scale(.85);
 `),
  c("&.popover-transition-enter-to, &.popover-transition-leave-from", `
 transform: scale(1);
 opacity: 1;
 `),
  c("&.popover-transition-enter-active", `
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .15s var(--n-bezier-ease-out),
 transform .15s var(--n-bezier-ease-out);
 `),
  c("&.popover-transition-leave-active", `
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .15s var(--n-bezier-ease-in),
 transform .15s var(--n-bezier-ease-in);
 `)
]), placementStyle("top-start", `
 top: calc(${arrowSize} / -2);
 left: calc(${getArrowOffset("top-start")} - var(--v-offset-left));
 `), placementStyle("top", `
 top: calc(${arrowSize} / -2);
 transform: translateX(calc(${arrowSize} / -2)) rotate(45deg);
 left: 50%;
 `), placementStyle("top-end", `
 top: calc(${arrowSize} / -2);
 right: calc(${getArrowOffset("top-end")} + var(--v-offset-left));
 `), placementStyle("bottom-start", `
 bottom: calc(${arrowSize} / -2);
 left: calc(${getArrowOffset("bottom-start")} - var(--v-offset-left));
 `), placementStyle("bottom", `
 bottom: calc(${arrowSize} / -2);
 transform: translateX(calc(${arrowSize} / -2)) rotate(45deg);
 left: 50%;
 `), placementStyle("bottom-end", `
 bottom: calc(${arrowSize} / -2);
 right: calc(${getArrowOffset("bottom-end")} + var(--v-offset-left));
 `), placementStyle("left-start", `
 left: calc(${arrowSize} / -2);
 top: calc(${getArrowOffset("left-start")} - var(--v-offset-top));
 `), placementStyle("left", `
 left: calc(${arrowSize} / -2);
 transform: translateY(calc(${arrowSize} / -2)) rotate(45deg);
 top: 50%;
 `), placementStyle("left-end", `
 left: calc(${arrowSize} / -2);
 bottom: calc(${getArrowOffset("left-end")} + var(--v-offset-top));
 `), placementStyle("right-start", `
 right: calc(${arrowSize} / -2);
 top: calc(${getArrowOffset("right-start")} - var(--v-offset-top));
 `), placementStyle("right", `
 right: calc(${arrowSize} / -2);
 transform: translateY(calc(${arrowSize} / -2)) rotate(45deg);
 top: 50%;
 `), placementStyle("right-end", `
 right: calc(${arrowSize} / -2);
 bottom: calc(${getArrowOffset("right-end")} + var(--v-offset-top));
 `), ...map({
  top: ["right-start", "left-start"],
  right: ["top-end", "bottom-end"],
  bottom: ["right-end", "left-end"],
  left: ["top-start", "bottom-start"]
}, (placements, direction) => {
  const isVertical = ["right", "left"].includes(direction);
  const sizeType = isVertical ? "width" : "height";
  return placements.map((placement) => {
    const isReverse = placement.split("-")[1] === "end";
    const targetSize = `var(--v-target-${sizeType}, 0px)`;
    const centerOffset = `calc((${targetSize} - ${arrowSize}) / 2)`;
    const offset = getArrowOffset(placement);
    return c(`[v-placement="${placement}"] >`, [cB("popover-shared", [cM("center-arrow", [cB("popover-arrow", `${direction}: calc(max(${centerOffset}, ${offset}) ${isReverse ? "+" : "-"} var(--v-offset-${isVertical ? "left" : "top"}));`)])])]);
  });
})]);
function getArrowOffset(placement) {
  return ["top", "bottom"].includes(placement.split("-")[0]) ? "var(--n-arrow-offset)" : "var(--n-arrow-offset-vertical)";
}
function placementStyle(placement, arrowStyleLiteral) {
  const position = placement.split("-")[0];
  const sizeStyle = ["top", "bottom"].includes(position) ? "height: var(--n-space-arrow);" : "width: var(--n-space-arrow);";
  return c(`[v-placement="${placement}"] >`, [cB("popover-shared", `
 margin-${oppositePlacement[position]}: var(--n-space);
 `, [cM("show-arrow", `
 margin-${oppositePlacement[position]}: var(--n-space-arrow);
 `), cM("overlap", `
 margin: 0;
 `), cCB("popover-arrow-wrapper", `
 right: 0;
 left: 0;
 top: 0;
 bottom: 0;
 ${position}: 100%;
 ${oppositePlacement[position]}: auto;
 ${sizeStyle}
 `, [cB("popover-arrow", arrowStyleLiteral)])])]);
}
const popoverBodyProps = Object.assign(Object.assign({}, useTheme.props), {
  to: useAdjustedTo.propTo,
  show: Boolean,
  trigger: String,
  showArrow: Boolean,
  delay: Number,
  duration: Number,
  raw: Boolean,
  arrowPointToCenter: Boolean,
  arrowClass: String,
  arrowStyle: [String, Object],
  arrowWrapperClass: String,
  arrowWrapperStyle: [String, Object],
  displayDirective: String,
  x: Number,
  y: Number,
  flip: Boolean,
  overlap: Boolean,
  placement: String,
  width: [Number, String],
  keepAliveOnHover: Boolean,
  scrollable: Boolean,
  contentClass: String,
  contentStyle: [Object, String],
  headerClass: String,
  headerStyle: [Object, String],
  footerClass: String,
  footerStyle: [Object, String],
  // private
  internalDeactivateImmediately: Boolean,
  animated: Boolean,
  onClickoutside: Function,
  internalTrapFocus: Boolean,
  internalOnAfterLeave: Function,
  // deprecated
  minWidth: Number,
  maxWidth: Number
});
function renderArrow({
  arrowClass,
  arrowStyle,
  arrowWrapperClass,
  arrowWrapperStyle,
  clsPrefix
}) {
  return h("div", {
    key: "__popover-arrow__",
    style: arrowWrapperStyle,
    class: [`${clsPrefix}-popover-arrow-wrapper`, arrowWrapperClass]
  }, h("div", {
    class: [`${clsPrefix}-popover-arrow`, arrowClass],
    style: arrowStyle
  }));
}
const NPopoverBody = defineComponent({
  name: "PopoverBody",
  inheritAttrs: false,
  props: popoverBodyProps,
  setup(props, {
    slots,
    attrs
  }) {
    const {
      namespaceRef,
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Popover", "-popover", style$5, popoverLight, props, mergedClsPrefixRef);
    const followerRef = ref(null);
    const NPopover2 = inject("NPopover");
    const bodyRef = ref(null);
    const followerEnabledRef = ref(props.show);
    const displayedRef = ref(false);
    watchEffect(() => {
      const {
        show
      } = props;
      if (show && !isJsdom() && !props.internalDeactivateImmediately) {
        displayedRef.value = true;
      }
    });
    const directivesRef = computed(() => {
      const {
        trigger,
        onClickoutside
      } = props;
      const directives = [];
      const {
        positionManuallyRef: {
          value: positionManually
        }
      } = NPopover2;
      if (!positionManually) {
        if (trigger === "click" && !onClickoutside) {
          directives.push([clickoutside, handleClickOutside, undefined, {
            capture: true
          }]);
        }
        if (trigger === "hover") {
          directives.push([mousemoveoutside, handleMouseMoveOutside]);
        }
      }
      if (onClickoutside) {
        directives.push([clickoutside, handleClickOutside, undefined, {
          capture: true
        }]);
      }
      if (props.displayDirective === "show" || props.animated && displayedRef.value) {
        directives.push([vShow, props.show]);
      }
      return directives;
    });
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut,
          cubicBezierEaseIn,
          cubicBezierEaseOut
        },
        self: {
          space,
          spaceArrow,
          padding,
          fontSize,
          textColor,
          dividerColor,
          color,
          boxShadow,
          borderRadius,
          arrowHeight,
          arrowOffset,
          arrowOffsetVertical
        }
      } = themeRef.value;
      return {
        "--n-box-shadow": boxShadow,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-bezier-ease-in": cubicBezierEaseIn,
        "--n-bezier-ease-out": cubicBezierEaseOut,
        "--n-font-size": fontSize,
        "--n-text-color": textColor,
        "--n-color": color,
        "--n-divider-color": dividerColor,
        "--n-border-radius": borderRadius,
        "--n-arrow-height": arrowHeight,
        "--n-arrow-offset": arrowOffset,
        "--n-arrow-offset-vertical": arrowOffsetVertical,
        "--n-padding": padding,
        "--n-space": space,
        "--n-space-arrow": spaceArrow
      };
    });
    const styleRef = computed(() => {
      const width = props.width === "trigger" ? undefined : formatLength(props.width);
      const style2 = [];
      if (width) {
        style2.push({
          width
        });
      }
      const {
        maxWidth,
        minWidth
      } = props;
      if (maxWidth) {
        style2.push({
          maxWidth: formatLength(maxWidth)
        });
      }
      if (minWidth) {
        style2.push({
          maxWidth: formatLength(minWidth)
        });
      }
      if (!inlineThemeDisabled) {
        style2.push(cssVarsRef.value);
      }
      return style2;
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("popover", undefined, cssVarsRef, props) : undefined;
    NPopover2.setBodyInstance({
      syncPosition
    });
    watch(toRef(props, "show"), (value) => {
      if (props.animated) return;
      if (value) {
        followerEnabledRef.value = true;
      } else {
        followerEnabledRef.value = false;
      }
    });
    function syncPosition() {
      var _a;
      (_a = followerRef.value) === null || _a === undefined ? undefined : _a.syncPosition();
    }
    function handleMouseEnter(e) {
      if (props.trigger === "hover" && props.keepAliveOnHover && props.show) {
        NPopover2.handleMouseEnter(e);
      }
    }
    function handleMouseLeave(e) {
      if (props.trigger === "hover" && props.keepAliveOnHover) {
        NPopover2.handleMouseLeave(e);
      }
    }
    function handleMouseMoveOutside(e) {
      if (props.trigger === "hover" && !getTriggerElement().contains(getPreciseEventTarget(e))) {
        NPopover2.handleMouseMoveOutside(e);
      }
    }
    function handleClickOutside(e) {
      if (props.trigger === "click" && !getTriggerElement().contains(getPreciseEventTarget(e)) || props.onClickoutside) {
        NPopover2.handleClickOutside(e);
      }
    }
    function getTriggerElement() {
      return NPopover2.getTriggerElement();
    }
    provide(popoverBodyInjectionKey, bodyRef);
    provide(drawerBodyInjectionKey, null);
    provide(modalBodyInjectionKey, null);
    function renderContentNode() {
      themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender();
      const shouldRenderDom = props.displayDirective === "show" || props.show || props.animated && displayedRef.value;
      if (!shouldRenderDom) {
        return null;
      }
      let contentNode;
      const renderBody = NPopover2.internalRenderBodyRef.value;
      const {
        value: mergedClsPrefix
      } = mergedClsPrefixRef;
      if (!renderBody) {
        const {
          value: extraClass
        } = NPopover2.extraClassRef;
        const {
          internalTrapFocus
        } = props;
        const hasHeaderOrFooter = !isSlotEmpty(slots.header) || !isSlotEmpty(slots.footer);
        const renderContentInnerNode = () => {
          var _a, _b;
          const body = hasHeaderOrFooter ? h(Fragment, null, resolveWrappedSlot(slots.header, (children) => {
            return children ? h("div", {
              class: [`${mergedClsPrefix}-popover__header`, props.headerClass],
              style: props.headerStyle
            }, children) : null;
          }), resolveWrappedSlot(slots.default, (children) => {
            return children ? h("div", {
              class: [`${mergedClsPrefix}-popover__content`, props.contentClass],
              style: props.contentStyle
            }, slots) : null;
          }), resolveWrappedSlot(slots.footer, (children) => {
            return children ? h("div", {
              class: [`${mergedClsPrefix}-popover__footer`, props.footerClass],
              style: props.footerStyle
            }, children) : null;
          })) : props.scrollable ? (_a = slots.default) === null || _a === undefined ? undefined : _a.call(slots) : h("div", {
            class: [`${mergedClsPrefix}-popover__content`, props.contentClass],
            style: props.contentStyle
          }, slots);
          const maybeScrollableBody = props.scrollable ? h(XScrollbar, {
            contentClass: hasHeaderOrFooter ? undefined : `${mergedClsPrefix}-popover__content ${(_b = props.contentClass) !== null && _b !== undefined ? _b : ""}`,
            contentStyle: hasHeaderOrFooter ? undefined : props.contentStyle
          }, {
            default: () => body
          }) : body;
          const arrow = props.showArrow ? renderArrow({
            arrowClass: props.arrowClass,
            arrowStyle: props.arrowStyle,
            arrowWrapperClass: props.arrowWrapperClass,
            arrowWrapperStyle: props.arrowWrapperStyle,
            clsPrefix: mergedClsPrefix
          }) : null;
          return [maybeScrollableBody, arrow];
        };
        contentNode = h("div", mergeProps({
          class: [`${mergedClsPrefix}-popover`, `${mergedClsPrefix}-popover-shared`, themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass.value, extraClass.map((v) => `${mergedClsPrefix}-${v}`), {
            [`${mergedClsPrefix}-popover--scrollable`]: props.scrollable,
            [`${mergedClsPrefix}-popover--show-header-or-footer`]: hasHeaderOrFooter,
            [`${mergedClsPrefix}-popover--raw`]: props.raw,
            [`${mergedClsPrefix}-popover-shared--overlap`]: props.overlap,
            [`${mergedClsPrefix}-popover-shared--show-arrow`]: props.showArrow,
            [`${mergedClsPrefix}-popover-shared--center-arrow`]: props.arrowPointToCenter
          }],
          ref: bodyRef,
          style: styleRef.value,
          onKeydown: NPopover2.handleKeydown,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave
        }, attrs), internalTrapFocus ? h(VFocusTrap, {
          active: props.show,
          autoFocus: true
        }, {
          default: renderContentInnerNode
        }) : renderContentInnerNode());
      } else {
        contentNode = renderBody(
          // The popover class and overlap class must exists, they will be used
          // to place the body & transition animation.
          // Shadow class exists for reuse box-shadow.
          [`${mergedClsPrefix}-popover-shared`, themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass.value, props.overlap && `${mergedClsPrefix}-popover-shared--overlap`, props.showArrow && `${mergedClsPrefix}-popover-shared--show-arrow`, props.arrowPointToCenter && `${mergedClsPrefix}-popover-shared--center-arrow`],
          bodyRef,
          styleRef.value,
          handleMouseEnter,
          handleMouseLeave
        );
      }
      return withDirectives(contentNode, directivesRef.value);
    }
    return {
      displayed: displayedRef,
      namespace: namespaceRef,
      isMounted: NPopover2.isMountedRef,
      zIndex: NPopover2.zIndexRef,
      followerRef,
      adjustedTo: useAdjustedTo(props),
      followerEnabled: followerEnabledRef,
      renderContentNode
    };
  },
  render() {
    return h(VFollower, {
      ref: "followerRef",
      zIndex: this.zIndex,
      show: this.show,
      enabled: this.followerEnabled,
      to: this.adjustedTo,
      x: this.x,
      y: this.y,
      flip: this.flip,
      placement: this.placement,
      containerClass: this.namespace,
      overlap: this.overlap,
      width: this.width === "trigger" ? "target" : undefined,
      teleportDisabled: this.adjustedTo === useAdjustedTo.tdkey
    }, {
      default: () => {
        return this.animated ? h(Transition, {
          name: "popover-transition",
          appear: this.isMounted,
          // Don't use watch to enable follower, since the transition may
          // make position sync timing very subtle and buggy.
          onEnter: () => {
            this.followerEnabled = true;
          },
          onAfterLeave: () => {
            var _a;
            (_a = this.internalOnAfterLeave) === null || _a === undefined ? undefined : _a.call(this);
            this.followerEnabled = false;
            this.displayed = false;
          }
        }, {
          default: this.renderContentNode
        }) : this.renderContentNode();
      }
    });
  }
});
const bodyPropKeys = Object.keys(popoverBodyProps);
const triggerEventMap = {
  focus: ["onFocus", "onBlur"],
  click: ["onClick"],
  hover: ["onMouseenter", "onMouseleave"],
  manual: [],
  nested: ["onFocus", "onBlur", "onMouseenter", "onMouseleave", "onClick"]
};
function appendEvents(vNode, trigger, events) {
  triggerEventMap[trigger].forEach((eventName) => {
    if (!vNode.props) {
      vNode.props = {};
    } else {
      vNode.props = Object.assign({}, vNode.props);
    }
    const originalHandler = vNode.props[eventName];
    const handler = events[eventName];
    if (!originalHandler) {
      vNode.props[eventName] = handler;
    } else {
      vNode.props[eventName] = (...args) => {
        originalHandler(...args);
        handler(...args);
      };
    }
  });
}
const popoverBaseProps = {
  show: {
    type: Boolean,
    default: undefined
  },
  defaultShow: Boolean,
  showArrow: {
    type: Boolean,
    default: true
  },
  trigger: {
    type: String,
    default: "hover"
  },
  delay: {
    type: Number,
    default: 100
  },
  duration: {
    type: Number,
    default: 100
  },
  raw: Boolean,
  placement: {
    type: String,
    default: "top"
  },
  x: Number,
  y: Number,
  arrowPointToCenter: Boolean,
  disabled: Boolean,
  getDisabled: Function,
  displayDirective: {
    type: String,
    default: "if"
  },
  arrowClass: String,
  arrowStyle: [String, Object],
  arrowWrapperClass: String,
  arrowWrapperStyle: [String, Object],
  flip: {
    type: Boolean,
    default: true
  },
  animated: {
    type: Boolean,
    default: true
  },
  width: {
    type: [Number, String],
    default: undefined
  },
  overlap: Boolean,
  keepAliveOnHover: {
    type: Boolean,
    default: true
  },
  zIndex: Number,
  to: useAdjustedTo.propTo,
  scrollable: Boolean,
  contentClass: String,
  contentStyle: [Object, String],
  headerClass: String,
  headerStyle: [Object, String],
  footerClass: String,
  footerStyle: [Object, String],
  // events
  onClickoutside: Function,
  "onUpdate:show": [Function, Array],
  onUpdateShow: [Function, Array],
  // internal
  internalDeactivateImmediately: Boolean,
  internalSyncTargetWithParent: Boolean,
  internalInheritedEventHandlers: {
    type: Array,
    default: () => []
  },
  internalTrapFocus: Boolean,
  internalExtraClass: {
    type: Array,
    default: () => []
  },
  // deprecated
  onShow: [Function, Array],
  onHide: [Function, Array],
  arrow: {
    type: Boolean,
    default: undefined
  },
  minWidth: Number,
  maxWidth: Number
};
const popoverProps = Object.assign(Object.assign(Object.assign({}, useTheme.props), popoverBaseProps), {
  internalOnAfterLeave: Function,
  internalRenderBody: Function
});
const NPopover = defineComponent({
  name: "Popover",
  inheritAttrs: false,
  props: popoverProps,
  slots: Object,
  __popover__: true,
  setup(props) {
    const isMountedRef = useIsMounted();
    const binderInstRef = ref(null);
    const controlledShowRef = computed(() => props.show);
    const uncontrolledShowRef = ref(props.defaultShow);
    const mergedShowWithoutDisabledRef = useMergedState(controlledShowRef, uncontrolledShowRef);
    const mergedShowConsideringDisabledPropRef = useMemo(() => {
      if (props.disabled) return false;
      return mergedShowWithoutDisabledRef.value;
    });
    const getMergedDisabled = () => {
      if (props.disabled) return true;
      const {
        getDisabled
      } = props;
      if (getDisabled === null || getDisabled === undefined ? undefined : getDisabled()) return true;
      return false;
    };
    const getMergedShow = () => {
      if (getMergedDisabled()) return false;
      return mergedShowWithoutDisabledRef.value;
    };
    const compatibleShowArrowRef = useCompitable(props, ["arrow", "showArrow"]);
    const mergedShowArrowRef = computed(() => {
      if (props.overlap) return false;
      return compatibleShowArrowRef.value;
    });
    let bodyInstance = null;
    const showTimerIdRef = ref(null);
    const hideTimerIdRef = ref(null);
    const positionManuallyRef = useMemo(() => {
      return props.x !== undefined && props.y !== undefined;
    });
    function doUpdateShow(value) {
      const {
        "onUpdate:show": _onUpdateShow,
        onUpdateShow,
        onShow,
        onHide
      } = props;
      uncontrolledShowRef.value = value;
      if (_onUpdateShow) {
        call(_onUpdateShow, value);
      }
      if (onUpdateShow) {
        call(onUpdateShow, value);
      }
      if (value && onShow) {
        call(onShow, true);
      }
      if (value && onHide) {
        call(onHide, false);
      }
    }
    function syncPosition() {
      if (bodyInstance) {
        bodyInstance.syncPosition();
      }
    }
    function clearShowTimer() {
      const {
        value: showTimerId
      } = showTimerIdRef;
      if (showTimerId) {
        (undefined).clearTimeout(showTimerId);
        showTimerIdRef.value = null;
      }
    }
    function clearHideTimer() {
      const {
        value: hideTimerId
      } = hideTimerIdRef;
      if (hideTimerId) {
        (undefined).clearTimeout(hideTimerId);
        hideTimerIdRef.value = null;
      }
    }
    function handleFocus() {
      const mergedDisabled = getMergedDisabled();
      if (props.trigger === "focus" && !mergedDisabled) {
        if (getMergedShow()) return;
        doUpdateShow(true);
      }
    }
    function handleBlur() {
      const mergedDisabled = getMergedDisabled();
      if (props.trigger === "focus" && !mergedDisabled) {
        if (!getMergedShow()) return;
        doUpdateShow(false);
      }
    }
    function handleMouseEnter() {
      const mergedDisabled = getMergedDisabled();
      if (props.trigger === "hover" && !mergedDisabled) {
        clearHideTimer();
        if (showTimerIdRef.value !== null) return;
        if (getMergedShow()) return;
        const delayCallback = () => {
          doUpdateShow(true);
          showTimerIdRef.value = null;
        };
        const {
          delay
        } = props;
        if (delay === 0) {
          delayCallback();
        } else {
          showTimerIdRef.value = (undefined).setTimeout(delayCallback, delay);
        }
      }
    }
    function handleMouseLeave() {
      const mergedDisabled = getMergedDisabled();
      if (props.trigger === "hover" && !mergedDisabled) {
        clearShowTimer();
        if (hideTimerIdRef.value !== null) return;
        if (!getMergedShow()) return;
        const delayedCallback = () => {
          doUpdateShow(false);
          hideTimerIdRef.value = null;
        };
        const {
          duration
        } = props;
        if (duration === 0) {
          delayedCallback();
        } else {
          hideTimerIdRef.value = (undefined).setTimeout(delayedCallback, duration);
        }
      }
    }
    function handleMouseMoveOutside() {
      handleMouseLeave();
    }
    function handleClickOutside(e) {
      var _a;
      if (!getMergedShow()) return;
      if (props.trigger === "click") {
        clearShowTimer();
        clearHideTimer();
        doUpdateShow(false);
      }
      (_a = props.onClickoutside) === null || _a === undefined ? undefined : _a.call(props, e);
    }
    function handleClick() {
      if (props.trigger === "click" && !getMergedDisabled()) {
        clearShowTimer();
        clearHideTimer();
        const nextShow = !getMergedShow();
        doUpdateShow(nextShow);
      }
    }
    function handleKeydown(e) {
      if (!props.internalTrapFocus) return;
      if (e.key === "Escape") {
        clearShowTimer();
        clearHideTimer();
        doUpdateShow(false);
      }
    }
    function setShow(value) {
      uncontrolledShowRef.value = value;
    }
    function getTriggerElement() {
      var _a;
      return (_a = binderInstRef.value) === null || _a === undefined ? undefined : _a.targetRef;
    }
    function setBodyInstance(value) {
      bodyInstance = value;
    }
    provide("NPopover", {
      getTriggerElement,
      handleKeydown,
      handleMouseEnter,
      handleMouseLeave,
      handleClickOutside,
      handleMouseMoveOutside,
      setBodyInstance,
      positionManuallyRef,
      isMountedRef,
      zIndexRef: toRef(props, "zIndex"),
      extraClassRef: toRef(props, "internalExtraClass"),
      internalRenderBodyRef: toRef(props, "internalRenderBody")
    });
    watchEffect(() => {
      if (mergedShowWithoutDisabledRef.value && getMergedDisabled()) {
        doUpdateShow(false);
      }
    });
    const returned = {
      binderInstRef,
      positionManually: positionManuallyRef,
      mergedShowConsideringDisabledProp: mergedShowConsideringDisabledPropRef,
      // if to show popover body
      uncontrolledShow: uncontrolledShowRef,
      mergedShowArrow: mergedShowArrowRef,
      getMergedShow,
      setShow,
      handleClick,
      handleMouseEnter,
      handleMouseLeave,
      handleFocus,
      handleBlur,
      syncPosition
    };
    return returned;
  },
  render() {
    var _a;
    const {
      positionManually,
      $slots: slots
    } = this;
    let triggerVNode;
    let popoverInside = false;
    if (!positionManually) {
      triggerVNode = getFirstSlotVNode(slots, "trigger");
      if (triggerVNode) {
        triggerVNode = cloneVNode(triggerVNode);
        triggerVNode = triggerVNode.type === Text ? h("span", [triggerVNode]) : triggerVNode;
        const handlers = {
          onClick: this.handleClick,
          onMouseenter: this.handleMouseEnter,
          onMouseleave: this.handleMouseLeave,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur
        };
        if ((_a = triggerVNode.type) === null || _a === undefined ? undefined : _a.__popover__) {
          popoverInside = true;
          if (!triggerVNode.props) {
            triggerVNode.props = {
              internalSyncTargetWithParent: true,
              internalInheritedEventHandlers: []
            };
          }
          triggerVNode.props.internalSyncTargetWithParent = true;
          if (!triggerVNode.props.internalInheritedEventHandlers) {
            triggerVNode.props.internalInheritedEventHandlers = [handlers];
          } else {
            triggerVNode.props.internalInheritedEventHandlers = [handlers, ...triggerVNode.props.internalInheritedEventHandlers];
          }
        } else {
          const {
            internalInheritedEventHandlers
          } = this;
          const ascendantAndCurrentHandlers = [handlers, ...internalInheritedEventHandlers];
          const mergedHandlers = {
            onBlur: (e) => {
              ascendantAndCurrentHandlers.forEach((_handlers) => {
                _handlers.onBlur(e);
              });
            },
            onFocus: (e) => {
              ascendantAndCurrentHandlers.forEach((_handlers) => {
                _handlers.onFocus(e);
              });
            },
            onClick: (e) => {
              ascendantAndCurrentHandlers.forEach((_handlers) => {
                _handlers.onClick(e);
              });
            },
            onMouseenter: (e) => {
              ascendantAndCurrentHandlers.forEach((_handlers) => {
                _handlers.onMouseenter(e);
              });
            },
            onMouseleave: (e) => {
              ascendantAndCurrentHandlers.forEach((_handlers) => {
                _handlers.onMouseleave(e);
              });
            }
          };
          appendEvents(triggerVNode, internalInheritedEventHandlers ? "nested" : positionManually ? "manual" : this.trigger, mergedHandlers);
        }
      }
    }
    return h(VBinder, {
      ref: "binderInstRef",
      syncTarget: !popoverInside,
      syncTargetWithParent: this.internalSyncTargetWithParent
    }, {
      default: () => {
        void this.mergedShowConsideringDisabledProp;
        const mergedShow = this.getMergedShow();
        return [this.internalTrapFocus && mergedShow ? withDirectives(h("div", {
          style: {
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }), [[zindexable, {
          enabled: mergedShow,
          zIndex: this.zIndex
        }]]) : null, positionManually ? null : h(VTarget, null, {
          default: () => triggerVNode
        }), h(NPopoverBody, keep(this.$props, bodyPropKeys, Object.assign(Object.assign({}, this.$attrs), {
          showArrow: this.mergedShowArrow,
          show: mergedShow
        })), {
          default: () => {
            var _a2, _b;
            return (_b = (_a2 = this.$slots).default) === null || _b === undefined ? undefined : _b.call(_a2);
          },
          header: () => {
            var _a2, _b;
            return (_b = (_a2 = this.$slots).header) === null || _b === undefined ? undefined : _b.call(_a2);
          },
          footer: () => {
            var _a2, _b;
            return (_b = (_a2 = this.$slots).footer) === null || _b === undefined ? undefined : _b.call(_a2);
          }
        })];
      }
    });
  }
});
function self$3(vars) {
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
    opacityDisabled,
    tagColor,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    borderRadiusSmall: borderRadius,
    fontSizeMini,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    heightMini,
    heightTiny,
    heightSmall,
    heightMedium,
    closeColorHover,
    closeColorPressed,
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
    colorBordered: "rgb(250, 250, 252)",
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
      alpha: 0.12
    }),
    colorBorderedPrimary: changeColor(primaryColor, {
      alpha: 0.1
    }),
    closeIconColorPrimary: primaryColor,
    closeIconColorHoverPrimary: primaryColor,
    closeIconColorPressedPrimary: primaryColor,
    closeColorHoverPrimary: changeColor(primaryColor, {
      alpha: 0.12
    }),
    closeColorPressedPrimary: changeColor(primaryColor, {
      alpha: 0.18
    }),
    borderInfo: `1px solid ${changeColor(infoColor, {
      alpha: 0.3
    })}`,
    textColorInfo: infoColor,
    colorInfo: changeColor(infoColor, {
      alpha: 0.12
    }),
    colorBorderedInfo: changeColor(infoColor, {
      alpha: 0.1
    }),
    closeIconColorInfo: infoColor,
    closeIconColorHoverInfo: infoColor,
    closeIconColorPressedInfo: infoColor,
    closeColorHoverInfo: changeColor(infoColor, {
      alpha: 0.12
    }),
    closeColorPressedInfo: changeColor(infoColor, {
      alpha: 0.18
    }),
    borderSuccess: `1px solid ${changeColor(successColor, {
      alpha: 0.3
    })}`,
    textColorSuccess: successColor,
    colorSuccess: changeColor(successColor, {
      alpha: 0.12
    }),
    colorBorderedSuccess: changeColor(successColor, {
      alpha: 0.1
    }),
    closeIconColorSuccess: successColor,
    closeIconColorHoverSuccess: successColor,
    closeIconColorPressedSuccess: successColor,
    closeColorHoverSuccess: changeColor(successColor, {
      alpha: 0.12
    }),
    closeColorPressedSuccess: changeColor(successColor, {
      alpha: 0.18
    }),
    borderWarning: `1px solid ${changeColor(warningColor, {
      alpha: 0.35
    })}`,
    textColorWarning: warningColor,
    colorWarning: changeColor(warningColor, {
      alpha: 0.15
    }),
    colorBorderedWarning: changeColor(warningColor, {
      alpha: 0.12
    }),
    closeIconColorWarning: warningColor,
    closeIconColorHoverWarning: warningColor,
    closeIconColorPressedWarning: warningColor,
    closeColorHoverWarning: changeColor(warningColor, {
      alpha: 0.12
    }),
    closeColorPressedWarning: changeColor(warningColor, {
      alpha: 0.18
    }),
    borderError: `1px solid ${changeColor(errorColor, {
      alpha: 0.23
    })}`,
    textColorError: errorColor,
    colorError: changeColor(errorColor, {
      alpha: 0.1
    }),
    colorBorderedError: changeColor(errorColor, {
      alpha: 0.08
    }),
    closeIconColorError: errorColor,
    closeIconColorHoverError: errorColor,
    closeIconColorPressedError: errorColor,
    closeColorHoverError: changeColor(errorColor, {
      alpha: 0.12
    }),
    closeColorPressedError: changeColor(errorColor, {
      alpha: 0.18
    })
  });
}
const tagLight = {
  common: derived,
  self: self$3
};
const commonProps = {
  color: Object,
  type: {
    type: String,
    default: "default"
  },
  round: Boolean,
  size: {
    type: String,
    default: "medium"
  },
  closable: Boolean,
  disabled: {
    type: Boolean,
    default: undefined
  }
};
const style$4 = cB("tag", `
 --n-close-margin: var(--n-close-margin-top) var(--n-close-margin-right) var(--n-close-margin-bottom) var(--n-close-margin-left);
 white-space: nowrap;
 position: relative;
 box-sizing: border-box;
 cursor: default;
 display: inline-flex;
 align-items: center;
 flex-wrap: nowrap;
 padding: var(--n-padding);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 transition: 
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 line-height: 1;
 height: var(--n-height);
 font-size: var(--n-font-size);
`, [cM("strong", `
 font-weight: var(--n-font-weight-strong);
 `), cE("border", `
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 border: var(--n-border);
 transition: border-color .3s var(--n-bezier);
 `), cE("icon", `
 display: flex;
 margin: 0 4px 0 0;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 font-size: var(--n-avatar-size-override);
 `), cE("avatar", `
 display: flex;
 margin: 0 6px 0 0;
 `), cE("close", `
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `), cM("round", `
 padding: 0 calc(var(--n-height) / 3);
 border-radius: calc(var(--n-height) / 2);
 `, [cE("icon", `
 margin: 0 4px 0 calc((var(--n-height) - 8px) / -2);
 `), cE("avatar", `
 margin: 0 6px 0 calc((var(--n-height) - 8px) / -2);
 `), cM("closable", `
 padding: 0 calc(var(--n-height) / 4) 0 calc(var(--n-height) / 3);
 `)]), cM("icon, avatar", [cM("round", `
 padding: 0 calc(var(--n-height) / 3) 0 calc(var(--n-height) / 2);
 `)]), cM("disabled", `
 cursor: not-allowed !important;
 opacity: var(--n-opacity-disabled);
 `), cM("checkable", `
 cursor: pointer;
 box-shadow: none;
 color: var(--n-text-color-checkable);
 background-color: var(--n-color-checkable);
 `, [cNotM("disabled", [c("&:hover", "background-color: var(--n-color-hover-checkable);", [cNotM("checked", "color: var(--n-text-color-hover-checkable);")]), c("&:active", "background-color: var(--n-color-pressed-checkable);", [cNotM("checked", "color: var(--n-text-color-pressed-checkable);")])]), cM("checked", `
 color: var(--n-text-color-checked);
 background-color: var(--n-color-checked);
 `, [cNotM("disabled", [c("&:hover", "background-color: var(--n-color-checked-hover);"), c("&:active", "background-color: var(--n-color-checked-pressed);")])])])]);
const tagProps = Object.assign(Object.assign(Object.assign({}, useTheme.props), commonProps), {
  bordered: {
    type: Boolean,
    default: undefined
  },
  checked: Boolean,
  checkable: Boolean,
  strong: Boolean,
  triggerClickOnClose: Boolean,
  onClose: [Array, Function],
  onMouseenter: Function,
  onMouseleave: Function,
  "onUpdate:checked": Function,
  onUpdateChecked: Function,
  // private
  internalCloseFocusable: {
    type: Boolean,
    default: true
  },
  internalCloseIsButtonTag: {
    type: Boolean,
    default: true
  },
  // deprecated
  onCheckedChange: Function
});
const tagInjectionKey = createInjectionKey("n-tag");
const NTag = defineComponent({
  name: "Tag",
  props: tagProps,
  slots: Object,
  setup(props) {
    const contentRef = ref(null);
    const {
      mergedBorderedRef,
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const themeRef = useTheme("Tag", "-tag", style$4, tagLight, props, mergedClsPrefixRef);
    provide(tagInjectionKey, {
      roundRef: toRef(props, "round")
    });
    function handleClick() {
      if (!props.disabled) {
        if (props.checkable) {
          const {
            checked,
            onCheckedChange,
            onUpdateChecked,
            "onUpdate:checked": _onUpdateChecked
          } = props;
          if (onUpdateChecked) onUpdateChecked(!checked);
          if (_onUpdateChecked) _onUpdateChecked(!checked);
          if (onCheckedChange) onCheckedChange(!checked);
        }
      }
    }
    function handleCloseClick(e) {
      if (!props.triggerClickOnClose) {
        e.stopPropagation();
      }
      if (!props.disabled) {
        const {
          onClose
        } = props;
        if (onClose) call(onClose, e);
      }
    }
    const tagPublicMethods = {
      setTextContent(textContent) {
        const {
          value
        } = contentRef;
        if (value) value.textContent = textContent;
      }
    };
    const rtlEnabledRef = useRtl("Tag", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        type,
        size,
        color: {
          color,
          textColor
        } = {}
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          padding,
          closeMargin,
          borderRadius,
          opacityDisabled,
          textColorCheckable,
          textColorHoverCheckable,
          textColorPressedCheckable,
          textColorChecked,
          colorCheckable,
          colorHoverCheckable,
          colorPressedCheckable,
          colorChecked,
          colorCheckedHover,
          colorCheckedPressed,
          closeBorderRadius,
          fontWeightStrong,
          [createKey("colorBordered", type)]: colorBordered,
          [createKey("closeSize", size)]: closeSize,
          [createKey("closeIconSize", size)]: closeIconSize,
          [createKey("fontSize", size)]: fontSize,
          [createKey("height", size)]: height,
          [createKey("color", type)]: typedColor,
          [createKey("textColor", type)]: typeTextColor,
          [createKey("border", type)]: border,
          [createKey("closeIconColor", type)]: closeIconColor,
          [createKey("closeIconColorHover", type)]: closeIconColorHover,
          [createKey("closeIconColorPressed", type)]: closeIconColorPressed,
          [createKey("closeColorHover", type)]: closeColorHover,
          [createKey("closeColorPressed", type)]: closeColorPressed
        }
      } = themeRef.value;
      const closeMarginDiscrete = getMargin(closeMargin);
      return {
        "--n-font-weight-strong": fontWeightStrong,
        "--n-avatar-size-override": `calc(${height} - 8px)`,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-border-radius": borderRadius,
        "--n-border": border,
        "--n-close-icon-size": closeIconSize,
        "--n-close-color-pressed": closeColorPressed,
        "--n-close-color-hover": closeColorHover,
        "--n-close-border-radius": closeBorderRadius,
        "--n-close-icon-color": closeIconColor,
        "--n-close-icon-color-hover": closeIconColorHover,
        "--n-close-icon-color-pressed": closeIconColorPressed,
        "--n-close-icon-color-disabled": closeIconColor,
        "--n-close-margin-top": closeMarginDiscrete.top,
        "--n-close-margin-right": closeMarginDiscrete.right,
        "--n-close-margin-bottom": closeMarginDiscrete.bottom,
        "--n-close-margin-left": closeMarginDiscrete.left,
        "--n-close-size": closeSize,
        "--n-color": color || (mergedBorderedRef.value ? colorBordered : typedColor),
        "--n-color-checkable": colorCheckable,
        "--n-color-checked": colorChecked,
        "--n-color-checked-hover": colorCheckedHover,
        "--n-color-checked-pressed": colorCheckedPressed,
        "--n-color-hover-checkable": colorHoverCheckable,
        "--n-color-pressed-checkable": colorPressedCheckable,
        "--n-font-size": fontSize,
        "--n-height": height,
        "--n-opacity-disabled": opacityDisabled,
        "--n-padding": padding,
        "--n-text-color": textColor || typeTextColor,
        "--n-text-color-checkable": textColorCheckable,
        "--n-text-color-checked": textColorChecked,
        "--n-text-color-hover-checkable": textColorHoverCheckable,
        "--n-text-color-pressed-checkable": textColorPressedCheckable
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("tag", computed(() => {
      let hash2 = "";
      const {
        type,
        size,
        color: {
          color,
          textColor
        } = {}
      } = props;
      hash2 += type[0];
      hash2 += size[0];
      if (color) {
        hash2 += `a${color2Class(color)}`;
      }
      if (textColor) {
        hash2 += `b${color2Class(textColor)}`;
      }
      if (mergedBorderedRef.value) {
        hash2 += "c";
      }
      return hash2;
    }), cssVarsRef, props) : undefined;
    return Object.assign(Object.assign({}, tagPublicMethods), {
      rtlEnabled: rtlEnabledRef,
      mergedClsPrefix: mergedClsPrefixRef,
      contentRef,
      mergedBordered: mergedBorderedRef,
      handleClick,
      handleCloseClick,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    });
  },
  render() {
    var _a, _b;
    const {
      mergedClsPrefix,
      rtlEnabled,
      closable,
      color: {
        borderColor
      } = {},
      round,
      onRender,
      $slots
    } = this;
    onRender === null || onRender === undefined ? undefined : onRender();
    const avatarNode = resolveWrappedSlot($slots.avatar, (children) => children && h("div", {
      class: `${mergedClsPrefix}-tag__avatar`
    }, children));
    const iconNode = resolveWrappedSlot($slots.icon, (children) => children && h("div", {
      class: `${mergedClsPrefix}-tag__icon`
    }, children));
    return h("div", {
      class: [`${mergedClsPrefix}-tag`, this.themeClass, {
        [`${mergedClsPrefix}-tag--rtl`]: rtlEnabled,
        [`${mergedClsPrefix}-tag--strong`]: this.strong,
        [`${mergedClsPrefix}-tag--disabled`]: this.disabled,
        [`${mergedClsPrefix}-tag--checkable`]: this.checkable,
        [`${mergedClsPrefix}-tag--checked`]: this.checkable && this.checked,
        [`${mergedClsPrefix}-tag--round`]: round,
        [`${mergedClsPrefix}-tag--avatar`]: avatarNode,
        [`${mergedClsPrefix}-tag--icon`]: iconNode,
        [`${mergedClsPrefix}-tag--closable`]: closable
      }],
      style: this.cssVars,
      onClick: this.handleClick,
      onMouseenter: this.onMouseenter,
      onMouseleave: this.onMouseleave
    }, iconNode || avatarNode, h("span", {
      class: `${mergedClsPrefix}-tag__content`,
      ref: "contentRef"
    }, (_b = (_a = this.$slots).default) === null || _b === undefined ? undefined : _b.call(_a)), !this.checkable && closable ? h(NBaseClose, {
      clsPrefix: mergedClsPrefix,
      class: `${mergedClsPrefix}-tag__close`,
      disabled: this.disabled,
      onClick: this.handleCloseClick,
      focusable: this.internalCloseFocusable,
      round,
      isButtonTag: this.internalCloseIsButtonTag,
      absolute: true
    }) : null, !this.checkable && this.mergedBordered ? h("div", {
      class: `${mergedClsPrefix}-tag__border`,
      style: {
        borderColor
      }
    }) : null);
  }
});
const NBaseSuffix = defineComponent({
  name: "InternalSelectionSuffix",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    showArrow: {
      type: Boolean,
      default: undefined
    },
    showClear: {
      type: Boolean,
      default: undefined
    },
    loading: {
      type: Boolean,
      default: false
    },
    onClear: Function
  },
  setup(props, {
    slots
  }) {
    return () => {
      const {
        clsPrefix
      } = props;
      return h(NBaseLoading, {
        clsPrefix,
        class: `${clsPrefix}-base-suffix`,
        strokeWidth: 24,
        scale: 0.85,
        show: props.loading
      }, {
        default: () => props.showArrow ? h(NBaseClear, {
          clsPrefix,
          show: props.showClear,
          onClear: props.onClear
        }, {
          placeholder: () => h(NBaseIcon, {
            clsPrefix,
            class: `${clsPrefix}-base-suffix__arrow`
          }, {
            default: () => resolveSlot(slots.default, () => [h(ChevronDownIcon, null)])
          })
        }) : null
      });
    };
  }
});
const style$3 = c([cB("base-selection", `
 --n-padding-single: var(--n-padding-single-top) var(--n-padding-single-right) var(--n-padding-single-bottom) var(--n-padding-single-left);
 --n-padding-multiple: var(--n-padding-multiple-top) var(--n-padding-multiple-right) var(--n-padding-multiple-bottom) var(--n-padding-multiple-left);
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `, [cB("base-loading", `
 color: var(--n-loading-color);
 `), cB("base-selection-tags", "min-height: var(--n-height);"), cE("border, state-border", `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `), cE("state-border", `
 z-index: 1;
 border-color: #0000;
 `), cB("base-suffix", `
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `, [cE("arrow", `
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]), cB("base-selection-overlay", `
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `, [cE("wrapper", `
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]), cB("base-selection-placeholder", `
 color: var(--n-placeholder-color);
 `, [cE("inner", `
 max-width: 100%;
 overflow: hidden;
 `)]), cB("base-selection-tags", `
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `), cB("base-selection-label", `
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `, [cB("base-selection-input", `
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `, [cE("content", `
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]), cE("render-label", `
 color: var(--n-text-color);
 `)]), cNotM("disabled", [c("&:hover", [cE("state-border", `
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]), cM("focus", [cE("state-border", `
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]), cM("active", [cE("state-border", `
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `), cB("base-selection-label", "background-color: var(--n-color-active);"), cB("base-selection-tags", "background-color: var(--n-color-active);")])]), cM("disabled", "cursor: not-allowed;", [cE("arrow", `
 color: var(--n-arrow-color-disabled);
 `), cB("base-selection-label", `
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `, [cB("base-selection-input", `
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `), cE("render-label", `
 color: var(--n-text-color-disabled);
 `)]), cB("base-selection-tags", `
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `), cB("base-selection-placeholder", `
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]), cB("base-selection-input-tag", `
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `, [cE("input", `
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `), cE("mirror", `
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]), ["warning", "error"].map((status) => cM(`${status}-status`, [cE("state-border", `border: var(--n-border-${status});`), cNotM("disabled", [c("&:hover", [cE("state-border", `
 box-shadow: var(--n-box-shadow-hover-${status});
 border: var(--n-border-hover-${status});
 `)]), cM("active", [cE("state-border", `
 box-shadow: var(--n-box-shadow-active-${status});
 border: var(--n-border-active-${status});
 `), cB("base-selection-label", `background-color: var(--n-color-active-${status});`), cB("base-selection-tags", `background-color: var(--n-color-active-${status});`)]), cM("focus", [cE("state-border", `
 box-shadow: var(--n-box-shadow-focus-${status});
 border: var(--n-border-focus-${status});
 `)])])]))]), cB("base-selection-popover", `
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `), cB("base-selection-tag-wrapper", `
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `, [c("&:last-child", "padding-right: 0;"), cB("tag", `
 font-size: 14px;
 max-width: 100%;
 `, [cE("content", `
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]);
const NInternalSelection = defineComponent({
  name: "InternalSelection",
  props: Object.assign(Object.assign({}, useTheme.props), {
    clsPrefix: {
      type: String,
      required: true
    },
    bordered: {
      type: Boolean,
      default: undefined
    },
    active: Boolean,
    pattern: {
      type: String,
      default: ""
    },
    placeholder: String,
    selectedOption: {
      type: Object,
      default: null
    },
    selectedOptions: {
      type: Array,
      default: null
    },
    labelField: {
      type: String,
      default: "label"
    },
    valueField: {
      type: String,
      default: "value"
    },
    multiple: Boolean,
    filterable: Boolean,
    clearable: Boolean,
    disabled: Boolean,
    size: {
      type: String,
      default: "medium"
    },
    loading: Boolean,
    autofocus: Boolean,
    showArrow: {
      type: Boolean,
      default: true
    },
    inputProps: Object,
    focused: Boolean,
    renderTag: Function,
    onKeydown: Function,
    onClick: Function,
    onBlur: Function,
    onFocus: Function,
    onDeleteOption: Function,
    maxTagCount: [String, Number],
    ellipsisTagPopoverProps: Object,
    onClear: Function,
    onPatternInput: Function,
    onPatternFocus: Function,
    onPatternBlur: Function,
    renderLabel: Function,
    status: String,
    inlineThemeDisabled: Boolean,
    ignoreComposition: {
      type: Boolean,
      default: true
    },
    onResize: Function
  }),
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("InternalSelection", mergedRtlRef, mergedClsPrefixRef);
    const patternInputMirrorRef = ref(null);
    const patternInputRef = ref(null);
    const selfRef = ref(null);
    const multipleElRef = ref(null);
    const singleElRef = ref(null);
    const patternInputWrapperRef = ref(null);
    const counterRef = ref(null);
    const counterWrapperRef = ref(null);
    const overflowRef = ref(null);
    const inputTagElRef = ref(null);
    const showTagsPopoverRef = ref(false);
    const patternInputFocusedRef = ref(false);
    const hoverRef = ref(false);
    const themeRef = useTheme("InternalSelection", "-internal-selection", style$3, internalSelectionLight, props, toRef(props, "clsPrefix"));
    const mergedClearableRef = computed(() => {
      return props.clearable && !props.disabled && (hoverRef.value || props.active);
    });
    const filterablePlaceholderRef = computed(() => {
      return props.selectedOption ? props.renderTag ? props.renderTag({
        option: props.selectedOption,
        handleClose: () => {
        }
      }) : props.renderLabel ? props.renderLabel(props.selectedOption, true) : render(props.selectedOption[props.labelField], props.selectedOption, true) : props.placeholder;
    });
    const labelRef = computed(() => {
      const option = props.selectedOption;
      if (!option) return undefined;
      return option[props.labelField];
    });
    const selectedRef = computed(() => {
      if (props.multiple) {
        return !!(Array.isArray(props.selectedOptions) && props.selectedOptions.length);
      } else {
        return props.selectedOption !== null;
      }
    });
    function syncMirrorWidth() {
      var _a;
      const {
        value: patternInputMirrorEl
      } = patternInputMirrorRef;
      if (patternInputMirrorEl) {
        const {
          value: patternInputEl
        } = patternInputRef;
        if (patternInputEl) {
          patternInputEl.style.width = `${patternInputMirrorEl.offsetWidth}px`;
          if (props.maxTagCount !== "responsive") {
            (_a = overflowRef.value) === null || _a === undefined ? undefined : _a.sync({
              showAllItemsBeforeCalculate: false
            });
          }
        }
      }
    }
    function hideInputTag() {
      const {
        value: inputTagEl
      } = inputTagElRef;
      if (inputTagEl) inputTagEl.style.display = "none";
    }
    function showInputTag() {
      const {
        value: inputTagEl
      } = inputTagElRef;
      if (inputTagEl) inputTagEl.style.display = "inline-block";
    }
    watch(toRef(props, "active"), (value) => {
      if (!value) hideInputTag();
    });
    watch(toRef(props, "pattern"), () => {
      if (props.multiple) {
        void nextTick(syncMirrorWidth);
      }
    });
    function doFocus(e) {
      const {
        onFocus
      } = props;
      if (onFocus) onFocus(e);
    }
    function doBlur(e) {
      const {
        onBlur
      } = props;
      if (onBlur) onBlur(e);
    }
    function doDeleteOption(value) {
      const {
        onDeleteOption
      } = props;
      if (onDeleteOption) onDeleteOption(value);
    }
    function doClear(e) {
      const {
        onClear
      } = props;
      if (onClear) onClear(e);
    }
    function doPatternInput(value) {
      const {
        onPatternInput
      } = props;
      if (onPatternInput) onPatternInput(value);
    }
    function handleFocusin(e) {
      var _a;
      if (!e.relatedTarget || !((_a = selfRef.value) === null || _a === undefined ? undefined : _a.contains(e.relatedTarget))) {
        doFocus(e);
      }
    }
    function handleFocusout(e) {
      var _a;
      if ((_a = selfRef.value) === null || _a === undefined ? undefined : _a.contains(e.relatedTarget)) return;
      doBlur(e);
    }
    function handleClear(e) {
      doClear(e);
    }
    function handleMouseEnter() {
      hoverRef.value = true;
    }
    function handleMouseLeave() {
      hoverRef.value = false;
    }
    function handleMouseDown(e) {
      if (!props.active || !props.filterable) return;
      if (e.target === patternInputRef.value) return;
      e.preventDefault();
    }
    function handleDeleteOption(option) {
      doDeleteOption(option);
    }
    const isComposingRef = ref(false);
    function handlePatternKeyDown(e) {
      if (e.key === "Backspace" && !isComposingRef.value) {
        if (!props.pattern.length) {
          const {
            selectedOptions
          } = props;
          if (selectedOptions === null || selectedOptions === undefined ? undefined : selectedOptions.length) {
            handleDeleteOption(selectedOptions[selectedOptions.length - 1]);
          }
        }
      }
    }
    let cachedInputEvent = null;
    function handlePatternInputInput(e) {
      const {
        value: patternInputMirrorEl
      } = patternInputMirrorRef;
      if (patternInputMirrorEl) {
        const inputText = e.target.value;
        patternInputMirrorEl.textContent = inputText;
        syncMirrorWidth();
      }
      if (props.ignoreComposition) {
        if (!isComposingRef.value) {
          doPatternInput(e);
        } else {
          cachedInputEvent = e;
        }
      } else {
        doPatternInput(e);
      }
    }
    function handleCompositionStart() {
      isComposingRef.value = true;
    }
    function handleCompositionEnd() {
      isComposingRef.value = false;
      if (props.ignoreComposition) {
        doPatternInput(cachedInputEvent);
      }
      cachedInputEvent = null;
    }
    function handlePatternInputFocus(e) {
      var _a;
      patternInputFocusedRef.value = true;
      (_a = props.onPatternFocus) === null || _a === undefined ? undefined : _a.call(props, e);
    }
    function handlePatternInputBlur(e) {
      var _a;
      patternInputFocusedRef.value = false;
      (_a = props.onPatternBlur) === null || _a === undefined ? undefined : _a.call(props, e);
    }
    function blur() {
      var _a, _b;
      if (props.filterable) {
        patternInputFocusedRef.value = false;
        (_a = patternInputWrapperRef.value) === null || _a === undefined ? undefined : _a.blur();
        (_b = patternInputRef.value) === null || _b === undefined ? undefined : _b.blur();
      } else if (props.multiple) {
        const {
          value: multipleEl
        } = multipleElRef;
        multipleEl === null || multipleEl === undefined ? undefined : multipleEl.blur();
      } else {
        const {
          value: singleEl
        } = singleElRef;
        singleEl === null || singleEl === undefined ? undefined : singleEl.blur();
      }
    }
    function focus() {
      var _a, _b, _c;
      if (props.filterable) {
        patternInputFocusedRef.value = false;
        (_a = patternInputWrapperRef.value) === null || _a === undefined ? undefined : _a.focus();
      } else if (props.multiple) {
        (_b = multipleElRef.value) === null || _b === undefined ? undefined : _b.focus();
      } else {
        (_c = singleElRef.value) === null || _c === undefined ? undefined : _c.focus();
      }
    }
    function focusInput() {
      const {
        value: patternInputEl
      } = patternInputRef;
      if (patternInputEl) {
        showInputTag();
        patternInputEl.focus();
      }
    }
    function blurInput() {
      const {
        value: patternInputEl
      } = patternInputRef;
      if (patternInputEl) {
        patternInputEl.blur();
      }
    }
    function updateCounter(count) {
      const {
        value
      } = counterRef;
      if (value) {
        value.setTextContent(`+${count}`);
      }
    }
    function getCounter() {
      const {
        value
      } = counterWrapperRef;
      return value;
    }
    function getTail() {
      return patternInputRef.value;
    }
    let enterTimerId = null;
    function clearEnterTimer() {
      if (enterTimerId !== null) (undefined).clearTimeout(enterTimerId);
    }
    function handleMouseEnterCounter() {
      if (props.active) return;
      clearEnterTimer();
      enterTimerId = (undefined).setTimeout(() => {
        if (selectedRef.value) {
          showTagsPopoverRef.value = true;
        }
      }, 100);
    }
    function handleMouseLeaveCounter() {
      clearEnterTimer();
    }
    function onPopoverUpdateShow(show) {
      if (!show) {
        clearEnterTimer();
        showTagsPopoverRef.value = false;
      }
    }
    watch(selectedRef, (value) => {
      if (!value) {
        showTagsPopoverRef.value = false;
      }
    });
    useOnResize(selfRef, props.onResize);
    const {
      inlineThemeDisabled
    } = props;
    const cssVarsRef = computed(() => {
      const {
        size
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          fontWeight,
          borderRadius,
          color,
          placeholderColor,
          textColor,
          paddingSingle,
          paddingMultiple,
          caretColor,
          colorDisabled,
          textColorDisabled,
          placeholderColorDisabled,
          colorActive,
          boxShadowFocus,
          boxShadowActive,
          boxShadowHover,
          border,
          borderFocus,
          borderHover,
          borderActive,
          arrowColor,
          arrowColorDisabled,
          loadingColor,
          // form warning
          colorActiveWarning,
          boxShadowFocusWarning,
          boxShadowActiveWarning,
          boxShadowHoverWarning,
          borderWarning,
          borderFocusWarning,
          borderHoverWarning,
          borderActiveWarning,
          // form error
          colorActiveError,
          boxShadowFocusError,
          boxShadowActiveError,
          boxShadowHoverError,
          borderError,
          borderFocusError,
          borderHoverError,
          borderActiveError,
          // clear
          clearColor,
          clearColorHover,
          clearColorPressed,
          clearSize,
          // arrow
          arrowSize: arrowSize2,
          [createKey("height", size)]: height,
          [createKey("fontSize", size)]: fontSize
        }
      } = themeRef.value;
      const paddingSingleDiscrete = getPadding(paddingSingle);
      const paddingMultipleDiscrete = getPadding(paddingMultiple);
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-border": border,
        "--n-border-active": borderActive,
        "--n-border-focus": borderFocus,
        "--n-border-hover": borderHover,
        "--n-border-radius": borderRadius,
        "--n-box-shadow-active": boxShadowActive,
        "--n-box-shadow-focus": boxShadowFocus,
        "--n-box-shadow-hover": boxShadowHover,
        "--n-caret-color": caretColor,
        "--n-color": color,
        "--n-color-active": colorActive,
        "--n-color-disabled": colorDisabled,
        "--n-font-size": fontSize,
        "--n-height": height,
        "--n-padding-single-top": paddingSingleDiscrete.top,
        "--n-padding-multiple-top": paddingMultipleDiscrete.top,
        "--n-padding-single-right": paddingSingleDiscrete.right,
        "--n-padding-multiple-right": paddingMultipleDiscrete.right,
        "--n-padding-single-left": paddingSingleDiscrete.left,
        "--n-padding-multiple-left": paddingMultipleDiscrete.left,
        "--n-padding-single-bottom": paddingSingleDiscrete.bottom,
        "--n-padding-multiple-bottom": paddingMultipleDiscrete.bottom,
        "--n-placeholder-color": placeholderColor,
        "--n-placeholder-color-disabled": placeholderColorDisabled,
        "--n-text-color": textColor,
        "--n-text-color-disabled": textColorDisabled,
        "--n-arrow-color": arrowColor,
        "--n-arrow-color-disabled": arrowColorDisabled,
        "--n-loading-color": loadingColor,
        // form warning
        "--n-color-active-warning": colorActiveWarning,
        "--n-box-shadow-focus-warning": boxShadowFocusWarning,
        "--n-box-shadow-active-warning": boxShadowActiveWarning,
        "--n-box-shadow-hover-warning": boxShadowHoverWarning,
        "--n-border-warning": borderWarning,
        "--n-border-focus-warning": borderFocusWarning,
        "--n-border-hover-warning": borderHoverWarning,
        "--n-border-active-warning": borderActiveWarning,
        // form error
        "--n-color-active-error": colorActiveError,
        "--n-box-shadow-focus-error": boxShadowFocusError,
        "--n-box-shadow-active-error": boxShadowActiveError,
        "--n-box-shadow-hover-error": boxShadowHoverError,
        "--n-border-error": borderError,
        "--n-border-focus-error": borderFocusError,
        "--n-border-hover-error": borderHoverError,
        "--n-border-active-error": borderActiveError,
        // clear
        "--n-clear-size": clearSize,
        "--n-clear-color": clearColor,
        "--n-clear-color-hover": clearColorHover,
        "--n-clear-color-pressed": clearColorPressed,
        // arrow-size
        "--n-arrow-size": arrowSize2,
        // font-weight
        "--n-font-weight": fontWeight
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("internal-selection", computed(() => {
      return props.size[0];
    }), cssVarsRef, props) : undefined;
    return {
      mergedTheme: themeRef,
      mergedClearable: mergedClearableRef,
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      patternInputFocused: patternInputFocusedRef,
      filterablePlaceholder: filterablePlaceholderRef,
      label: labelRef,
      selected: selectedRef,
      showTagsPanel: showTagsPopoverRef,
      isComposing: isComposingRef,
      // dom ref
      counterRef,
      counterWrapperRef,
      patternInputMirrorRef,
      patternInputRef,
      selfRef,
      multipleElRef,
      singleElRef,
      patternInputWrapperRef,
      overflowRef,
      inputTagElRef,
      handleMouseDown,
      handleFocusin,
      handleClear,
      handleMouseEnter,
      handleMouseLeave,
      handleDeleteOption,
      handlePatternKeyDown,
      handlePatternInputInput,
      handlePatternInputBlur,
      handlePatternInputFocus,
      handleMouseEnterCounter,
      handleMouseLeaveCounter,
      handleFocusout,
      handleCompositionEnd,
      handleCompositionStart,
      onPopoverUpdateShow,
      focus,
      focusInput,
      blur,
      blurInput,
      updateCounter,
      getCounter,
      getTail,
      renderLabel: props.renderLabel,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    };
  },
  render() {
    const {
      status,
      multiple,
      size,
      disabled,
      filterable,
      maxTagCount,
      bordered,
      clsPrefix,
      ellipsisTagPopoverProps,
      onRender,
      renderTag,
      renderLabel
    } = this;
    onRender === null || onRender === undefined ? undefined : onRender();
    const maxTagCountResponsive = maxTagCount === "responsive";
    const maxTagCountNumeric = typeof maxTagCount === "number";
    const useMaxTagCount = maxTagCountResponsive || maxTagCountNumeric;
    const suffix = h(Wrapper, null, {
      default: () => h(NBaseSuffix, {
        clsPrefix,
        loading: this.loading,
        showArrow: this.showArrow,
        showClear: this.mergedClearable && this.selected,
        onClear: this.handleClear
      }, {
        default: () => {
          var _a, _b;
          return (_b = (_a = this.$slots).arrow) === null || _b === undefined ? undefined : _b.call(_a);
        }
      })
    });
    let body;
    if (multiple) {
      const {
        labelField
      } = this;
      const createTag = (option) => h("div", {
        class: `${clsPrefix}-base-selection-tag-wrapper`,
        key: option.value
      }, renderTag ? renderTag({
        option,
        handleClose: () => {
          this.handleDeleteOption(option);
        }
      }) : h(NTag, {
        size,
        closable: !option.disabled,
        disabled,
        onClose: () => {
          this.handleDeleteOption(option);
        },
        internalCloseIsButtonTag: false,
        internalCloseFocusable: false
      }, {
        default: () => renderLabel ? renderLabel(option, true) : render(option[labelField], option, true)
      }));
      const createOriginalTagNodes = () => (maxTagCountNumeric ? this.selectedOptions.slice(0, maxTagCount) : this.selectedOptions).map(createTag);
      const input = filterable ? h("div", {
        class: `${clsPrefix}-base-selection-input-tag`,
        ref: "inputTagElRef",
        key: "__input-tag__"
      }, h("input", Object.assign({}, this.inputProps, {
        ref: "patternInputRef",
        tabindex: -1,
        disabled,
        value: this.pattern,
        autofocus: this.autofocus,
        class: `${clsPrefix}-base-selection-input-tag__input`,
        onBlur: this.handlePatternInputBlur,
        onFocus: this.handlePatternInputFocus,
        onKeydown: this.handlePatternKeyDown,
        onInput: this.handlePatternInputInput,
        onCompositionstart: this.handleCompositionStart,
        onCompositionend: this.handleCompositionEnd
      })), h("span", {
        ref: "patternInputMirrorRef",
        class: `${clsPrefix}-base-selection-input-tag__mirror`
      }, this.pattern)) : null;
      const renderCounter = maxTagCountResponsive ? () => h("div", {
        class: `${clsPrefix}-base-selection-tag-wrapper`,
        ref: "counterWrapperRef"
      }, h(NTag, {
        size,
        ref: "counterRef",
        onMouseenter: this.handleMouseEnterCounter,
        onMouseleave: this.handleMouseLeaveCounter,
        disabled
      })) : undefined;
      let counter;
      if (maxTagCountNumeric) {
        const rest = this.selectedOptions.length - maxTagCount;
        if (rest > 0) {
          counter = h("div", {
            class: `${clsPrefix}-base-selection-tag-wrapper`,
            key: "__counter__"
          }, h(NTag, {
            size,
            ref: "counterRef",
            onMouseenter: this.handleMouseEnterCounter,
            disabled
          }, {
            default: () => `+${rest}`
          }));
        }
      }
      const tags = maxTagCountResponsive ? filterable ? h(VOverflow, {
        ref: "overflowRef",
        updateCounter: this.updateCounter,
        getCounter: this.getCounter,
        getTail: this.getTail,
        style: {
          width: "100%",
          display: "flex",
          overflow: "hidden"
        }
      }, {
        default: createOriginalTagNodes,
        counter: renderCounter,
        tail: () => input
      }) : h(VOverflow, {
        ref: "overflowRef",
        updateCounter: this.updateCounter,
        getCounter: this.getCounter,
        style: {
          width: "100%",
          display: "flex",
          overflow: "hidden"
        }
      }, {
        default: createOriginalTagNodes,
        counter: renderCounter
      }) : maxTagCountNumeric && counter ? createOriginalTagNodes().concat(counter) : createOriginalTagNodes();
      const renderPopover = useMaxTagCount ? () => h("div", {
        class: `${clsPrefix}-base-selection-popover`
      }, maxTagCountResponsive ? createOriginalTagNodes() : this.selectedOptions.map(createTag)) : undefined;
      const popoverProps2 = useMaxTagCount ? Object.assign({
        show: this.showTagsPanel,
        trigger: "hover",
        overlap: true,
        placement: "top",
        width: "trigger",
        onUpdateShow: this.onPopoverUpdateShow,
        theme: this.mergedTheme.peers.Popover,
        themeOverrides: this.mergedTheme.peerOverrides.Popover
      }, ellipsisTagPopoverProps) : null;
      const showPlaceholder = this.selected ? false : this.active ? !this.pattern && !this.isComposing : true;
      const placeholder = showPlaceholder ? h("div", {
        class: `${clsPrefix}-base-selection-placeholder ${clsPrefix}-base-selection-overlay`
      }, h("div", {
        class: `${clsPrefix}-base-selection-placeholder__inner`
      }, this.placeholder)) : null;
      const popoverTrigger = filterable ? h("div", {
        ref: "patternInputWrapperRef",
        class: `${clsPrefix}-base-selection-tags`
      }, tags, maxTagCountResponsive ? null : input, suffix) : h("div", {
        ref: "multipleElRef",
        class: `${clsPrefix}-base-selection-tags`,
        tabindex: disabled ? undefined : 0
      }, tags, suffix);
      body = h(Fragment, null, useMaxTagCount ? h(NPopover, Object.assign({}, popoverProps2, {
        scrollable: true,
        style: "max-height: calc(var(--v-target-height) * 6.6);"
      }), {
        trigger: () => popoverTrigger,
        default: renderPopover
      }) : popoverTrigger, placeholder);
    } else {
      if (filterable) {
        const hasInput = this.pattern || this.isComposing;
        const showPlaceholder = this.active ? !hasInput : !this.selected;
        const showSelectedLabel = this.active ? false : this.selected;
        body = h("div", {
          ref: "patternInputWrapperRef",
          class: `${clsPrefix}-base-selection-label`,
          title: this.patternInputFocused ? undefined : getTitleAttribute(this.label)
        }, h("input", Object.assign({}, this.inputProps, {
          ref: "patternInputRef",
          class: `${clsPrefix}-base-selection-input`,
          value: this.active ? this.pattern : "",
          placeholder: "",
          readonly: disabled,
          disabled,
          tabindex: -1,
          autofocus: this.autofocus,
          onFocus: this.handlePatternInputFocus,
          onBlur: this.handlePatternInputBlur,
          onInput: this.handlePatternInputInput,
          onCompositionstart: this.handleCompositionStart,
          onCompositionend: this.handleCompositionEnd
        })), showSelectedLabel ? h("div", {
          class: `${clsPrefix}-base-selection-label__render-label ${clsPrefix}-base-selection-overlay`,
          key: "input"
        }, h("div", {
          class: `${clsPrefix}-base-selection-overlay__wrapper`
        }, renderTag ? renderTag({
          option: this.selectedOption,
          handleClose: () => {
          }
        }) : renderLabel ? renderLabel(this.selectedOption, true) : render(this.label, this.selectedOption, true))) : null, showPlaceholder ? h("div", {
          class: `${clsPrefix}-base-selection-placeholder ${clsPrefix}-base-selection-overlay`,
          key: "placeholder"
        }, h("div", {
          class: `${clsPrefix}-base-selection-overlay__wrapper`
        }, this.filterablePlaceholder)) : null, suffix);
      } else {
        body = h("div", {
          ref: "singleElRef",
          class: `${clsPrefix}-base-selection-label`,
          tabindex: this.disabled ? undefined : 0
        }, this.label !== undefined ? h("div", {
          class: `${clsPrefix}-base-selection-input`,
          title: getTitleAttribute(this.label),
          key: "input"
        }, h("div", {
          class: `${clsPrefix}-base-selection-input__content`
        }, renderTag ? renderTag({
          option: this.selectedOption,
          handleClose: () => {
          }
        }) : renderLabel ? renderLabel(this.selectedOption, true) : render(this.label, this.selectedOption, true))) : h("div", {
          class: `${clsPrefix}-base-selection-placeholder ${clsPrefix}-base-selection-overlay`,
          key: "placeholder"
        }, h("div", {
          class: `${clsPrefix}-base-selection-placeholder__inner`
        }, this.placeholder)), suffix);
      }
    }
    return h("div", {
      ref: "selfRef",
      class: [`${clsPrefix}-base-selection`, this.rtlEnabled && `${clsPrefix}-base-selection--rtl`, this.themeClass, status && `${clsPrefix}-base-selection--${status}-status`, {
        [`${clsPrefix}-base-selection--active`]: this.active,
        [`${clsPrefix}-base-selection--selected`]: this.selected || this.active && this.pattern,
        [`${clsPrefix}-base-selection--disabled`]: this.disabled,
        [`${clsPrefix}-base-selection--multiple`]: this.multiple,
        // focus is not controlled by selection itself since it always need
        // to be managed together with menu. provide :focus style will cause
        // many redundant codes.
        [`${clsPrefix}-base-selection--focus`]: this.focused
      }],
      style: this.cssVars,
      onClick: this.onClick,
      onMouseenter: this.handleMouseEnter,
      onMouseleave: this.handleMouseLeave,
      onKeydown: this.onKeydown,
      onFocusin: this.handleFocusin,
      onFocusout: this.handleFocusout,
      onMousedown: this.handleMouseDown
    }, body, bordered ? h("div", {
      class: `${clsPrefix}-base-selection__border`
    }) : null, bordered ? h("div", {
      class: `${clsPrefix}-base-selection__state-border`
    }) : null);
  }
});
function self$2(vars) {
  const {
    textColor2,
    textColor3,
    textColorDisabled,
    primaryColor,
    primaryColorHover,
    inputColor,
    inputColorDisabled,
    borderColor,
    warningColor,
    warningColorHover,
    errorColor,
    errorColorHover,
    borderRadius,
    lineHeight,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    actionColor,
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
    lineHeight,
    lineHeightTextarea: lineHeight,
    borderRadius,
    iconSize: "16px",
    groupLabelColor: actionColor,
    groupLabelTextColor: textColor2,
    textColor: textColor2,
    textColorDisabled,
    textDecorationColor: textColor2,
    caretColor: primaryColor,
    placeholderColor,
    placeholderColorDisabled,
    color: inputColor,
    colorDisabled: inputColorDisabled,
    colorFocus: inputColor,
    groupLabelBorder: `1px solid ${borderColor}`,
    border: `1px solid ${borderColor}`,
    borderHover: `1px solid ${primaryColorHover}`,
    borderDisabled: `1px solid ${borderColor}`,
    borderFocus: `1px solid ${primaryColorHover}`,
    boxShadowFocus: `0 0 0 2px ${changeColor(primaryColor, {
      alpha: 0.2
    })}`,
    loadingColor: primaryColor,
    // warning
    loadingColorWarning: warningColor,
    borderWarning: `1px solid ${warningColor}`,
    borderHoverWarning: `1px solid ${warningColorHover}`,
    colorFocusWarning: inputColor,
    borderFocusWarning: `1px solid ${warningColorHover}`,
    boxShadowFocusWarning: `0 0 0 2px ${changeColor(warningColor, {
      alpha: 0.2
    })}`,
    caretColorWarning: warningColor,
    // error
    loadingColorError: errorColor,
    borderError: `1px solid ${errorColor}`,
    borderHoverError: `1px solid ${errorColorHover}`,
    colorFocusError: inputColor,
    borderFocusError: `1px solid ${errorColorHover}`,
    boxShadowFocusError: `0 0 0 2px ${changeColor(errorColor, {
      alpha: 0.2
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
const inputLight = {
  common: derived,
  self: self$2
};
const inputInjectionKey = createInjectionKey("n-input");
const style$2 = cB("input", `
 max-width: 100%;
 cursor: text;
 line-height: 1.5;
 z-index: auto;
 outline: none;
 box-sizing: border-box;
 position: relative;
 display: inline-flex;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 transition: background-color .3s var(--n-bezier);
 font-size: var(--n-font-size);
 font-weight: var(--n-font-weight);
 --n-padding-vertical: calc((var(--n-height) - 1.5 * var(--n-font-size)) / 2);
`, [
  // common
  cE("input, textarea", `
 overflow: hidden;
 flex-grow: 1;
 position: relative;
 `),
  cE("input-el, textarea-el, input-mirror, textarea-mirror, separator, placeholder", `
 box-sizing: border-box;
 font-size: inherit;
 line-height: 1.5;
 font-family: inherit;
 border: none;
 outline: none;
 background-color: #0000;
 text-align: inherit;
 transition:
 -webkit-text-fill-color .3s var(--n-bezier),
 caret-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 text-decoration-color .3s var(--n-bezier);
 `),
  cE("input-el, textarea-el", `
 -webkit-appearance: none;
 scrollbar-width: none;
 width: 100%;
 min-width: 0;
 text-decoration-color: var(--n-text-decoration-color);
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 background-color: transparent;
 `, [c("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb", `
 width: 0;
 height: 0;
 display: none;
 `), c("&::placeholder", `
 color: #0000;
 -webkit-text-fill-color: transparent !important;
 `), c("&:-webkit-autofill ~", [cE("placeholder", "display: none;")])]),
  cM("round", [cNotM("textarea", "border-radius: calc(var(--n-height) / 2);")]),
  cE("placeholder", `
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 overflow: hidden;
 color: var(--n-placeholder-color);
 `, [c("span", `
 width: 100%;
 display: inline-block;
 `)]),
  cM("textarea", [cE("placeholder", "overflow: visible;")]),
  cNotM("autosize", "width: 100%;"),
  cM("autosize", [cE("textarea-el, input-el", `
 position: absolute;
 top: 0;
 left: 0;
 height: 100%;
 `)]),
  // input
  cB("input-wrapper", `
 overflow: hidden;
 display: inline-flex;
 flex-grow: 1;
 position: relative;
 padding-left: var(--n-padding-left);
 padding-right: var(--n-padding-right);
 `),
  cE("input-mirror", `
 padding: 0;
 height: var(--n-height);
 line-height: var(--n-height);
 overflow: hidden;
 visibility: hidden;
 position: static;
 white-space: pre;
 pointer-events: none;
 `),
  cE("input-el", `
 padding: 0;
 height: var(--n-height);
 line-height: var(--n-height);
 `, [c("&[type=password]::-ms-reveal", "display: none;"), c("+", [cE("placeholder", `
 display: flex;
 align-items: center; 
 `)])]),
  cNotM("textarea", [cE("placeholder", "white-space: nowrap;")]),
  cE("eye", `
 display: flex;
 align-items: center;
 justify-content: center;
 transition: color .3s var(--n-bezier);
 `),
  // textarea
  cM("textarea", "width: 100%;", [cB("input-word-count", `
 position: absolute;
 right: var(--n-padding-right);
 bottom: var(--n-padding-vertical);
 `), cM("resizable", [cB("input-wrapper", `
 resize: vertical;
 min-height: var(--n-height);
 `)]), cE("textarea-el, textarea-mirror, placeholder", `
 height: 100%;
 padding-left: 0;
 padding-right: 0;
 padding-top: var(--n-padding-vertical);
 padding-bottom: var(--n-padding-vertical);
 word-break: break-word;
 display: inline-block;
 vertical-align: bottom;
 box-sizing: border-box;
 line-height: var(--n-line-height-textarea);
 margin: 0;
 resize: none;
 white-space: pre-wrap;
 scroll-padding-block-end: var(--n-padding-vertical);
 `), cE("textarea-mirror", `
 width: 100%;
 pointer-events: none;
 overflow: hidden;
 visibility: hidden;
 position: static;
 white-space: pre-wrap;
 overflow-wrap: break-word;
 `)]),
  // pair
  cM("pair", [cE("input-el, placeholder", "text-align: center;"), cE("separator", `
 display: flex;
 align-items: center;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 white-space: nowrap;
 `, [cB("icon", `
 color: var(--n-icon-color);
 `), cB("base-icon", `
 color: var(--n-icon-color);
 `)])]),
  cM("disabled", `
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `, [cE("border", "border: var(--n-border-disabled);"), cE("input-el, textarea-el", `
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 text-decoration-color: var(--n-text-color-disabled);
 `), cE("placeholder", "color: var(--n-placeholder-color-disabled);"), cE("separator", "color: var(--n-text-color-disabled);", [cB("icon", `
 color: var(--n-icon-color-disabled);
 `), cB("base-icon", `
 color: var(--n-icon-color-disabled);
 `)]), cB("input-word-count", `
 color: var(--n-count-text-color-disabled);
 `), cE("suffix, prefix", "color: var(--n-text-color-disabled);", [cB("icon", `
 color: var(--n-icon-color-disabled);
 `), cB("internal-icon", `
 color: var(--n-icon-color-disabled);
 `)])]),
  cNotM("disabled", [cE("eye", `
 color: var(--n-icon-color);
 cursor: pointer;
 `, [c("&:hover", `
 color: var(--n-icon-color-hover);
 `), c("&:active", `
 color: var(--n-icon-color-pressed);
 `)]), c("&:hover", [cE("state-border", "border: var(--n-border-hover);")]), cM("focus", "background-color: var(--n-color-focus);", [cE("state-border", `
 border: var(--n-border-focus);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),
  cE("border, state-border", `
 box-sizing: border-box;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border-radius: inherit;
 border: var(--n-border);
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),
  cE("state-border", `
 border-color: #0000;
 z-index: 1;
 `),
  cE("prefix", "margin-right: 4px;"),
  cE("suffix", `
 margin-left: 4px;
 `),
  cE("suffix, prefix", `
 transition: color .3s var(--n-bezier);
 flex-wrap: nowrap;
 flex-shrink: 0;
 line-height: var(--n-height);
 white-space: nowrap;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 color: var(--n-suffix-text-color);
 `, [cB("base-loading", `
 font-size: var(--n-icon-size);
 margin: 0 2px;
 color: var(--n-loading-color);
 `), cB("base-clear", `
 font-size: var(--n-icon-size);
 `, [cE("placeholder", [cB("base-icon", `
 transition: color .3s var(--n-bezier);
 color: var(--n-icon-color);
 font-size: var(--n-icon-size);
 `)])]), c(">", [cB("icon", `
 transition: color .3s var(--n-bezier);
 color: var(--n-icon-color);
 font-size: var(--n-icon-size);
 `)]), cB("base-icon", `
 font-size: var(--n-icon-size);
 `)]),
  cB("input-word-count", `
 pointer-events: none;
 line-height: 1.5;
 font-size: .85em;
 color: var(--n-count-text-color);
 transition: color .3s var(--n-bezier);
 margin-left: 4px;
 font-variant: tabular-nums;
 `),
  ["warning", "error"].map((status) => cM(`${status}-status`, [cNotM("disabled", [cB("base-loading", `
 color: var(--n-loading-color-${status})
 `), cE("input-el, textarea-el", `
 caret-color: var(--n-caret-color-${status});
 `), cE("state-border", `
 border: var(--n-border-${status});
 `), c("&:hover", [cE("state-border", `
 border: var(--n-border-hover-${status});
 `)]), c("&:focus", `
 background-color: var(--n-color-focus-${status});
 `, [cE("state-border", `
 box-shadow: var(--n-box-shadow-focus-${status});
 border: var(--n-border-focus-${status});
 `)]), cM("focus", `
 background-color: var(--n-color-focus-${status});
 `, [cE("state-border", `
 box-shadow: var(--n-box-shadow-focus-${status});
 border: var(--n-border-focus-${status});
 `)])])]))
]);
cB("input", [cM("disabled", [cE("input-el, textarea-el", `
 -webkit-text-fill-color: var(--n-text-color-disabled);
 `)])]);
function len(s) {
  let count = 0;
  for (const _ of s) {
    count++;
  }
  return count;
}
function isEmptyInputValue(value) {
  return value === "" || value == null;
}
function useCursor(inputElRef) {
  const selectionRef = ref(null);
  function recordCursor() {
    const {
      value: input
    } = inputElRef;
    if (!(input === null || input === undefined ? undefined : input.focus)) {
      reset();
      return;
    }
    const {
      selectionStart,
      selectionEnd,
      value
    } = input;
    if (selectionStart == null || selectionEnd == null) {
      reset();
      return;
    }
    selectionRef.value = {
      start: selectionStart,
      end: selectionEnd,
      beforeText: value.slice(0, selectionStart),
      afterText: value.slice(selectionEnd)
    };
  }
  function restoreCursor() {
    var _a;
    const {
      value: selection
    } = selectionRef;
    const {
      value: inputEl
    } = inputElRef;
    if (!selection || !inputEl) {
      return;
    }
    const {
      value
    } = inputEl;
    const {
      start,
      beforeText,
      afterText
    } = selection;
    let startPos = value.length;
    if (value.endsWith(afterText)) {
      startPos = value.length - afterText.length;
    } else if (value.startsWith(beforeText)) {
      startPos = beforeText.length;
    } else {
      const beforeLastChar = beforeText[start - 1];
      const newIndex = value.indexOf(beforeLastChar, start - 1);
      if (newIndex !== -1) {
        startPos = newIndex + 1;
      }
    }
    (_a = inputEl.setSelectionRange) === null || _a === undefined ? undefined : _a.call(inputEl, startPos, startPos);
  }
  function reset() {
    selectionRef.value = null;
  }
  watch(inputElRef, reset);
  return {
    recordCursor,
    restoreCursor
  };
}
const WordCount = defineComponent({
  name: "InputWordCount",
  setup(_, {
    slots
  }) {
    const {
      mergedValueRef,
      maxlengthRef,
      mergedClsPrefixRef,
      countGraphemesRef
    } = inject(inputInjectionKey);
    const wordCountRef = computed(() => {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (mergedValue === null || Array.isArray(mergedValue)) return 0;
      return (countGraphemesRef.value || len)(mergedValue);
    });
    return () => {
      const {
        value: maxlength
      } = maxlengthRef;
      const {
        value: mergedValue
      } = mergedValueRef;
      return h("span", {
        class: `${mergedClsPrefixRef.value}-input-word-count`
      }, resolveSlotWithTypedProps(slots.default, {
        value: mergedValue === null || Array.isArray(mergedValue) ? "" : mergedValue
      }, () => [maxlength === undefined ? wordCountRef.value : `${wordCountRef.value} / ${maxlength}`]));
    };
  }
});
const inputProps = Object.assign(Object.assign({}, useTheme.props), {
  bordered: {
    type: Boolean,
    default: undefined
  },
  type: {
    type: String,
    default: "text"
  },
  placeholder: [Array, String],
  defaultValue: {
    type: [String, Array],
    default: null
  },
  value: [String, Array],
  disabled: {
    type: Boolean,
    default: undefined
  },
  size: String,
  rows: {
    type: [Number, String],
    default: 3
  },
  round: Boolean,
  minlength: [String, Number],
  maxlength: [String, Number],
  clearable: Boolean,
  autosize: {
    type: [Boolean, Object],
    default: false
  },
  pair: Boolean,
  separator: String,
  readonly: {
    type: [String, Boolean],
    default: false
  },
  passivelyActivated: Boolean,
  showPasswordOn: String,
  stateful: {
    type: Boolean,
    default: true
  },
  autofocus: Boolean,
  inputProps: Object,
  resizable: {
    type: Boolean,
    default: true
  },
  showCount: Boolean,
  loading: {
    type: Boolean,
    default: undefined
  },
  allowInput: Function,
  renderCount: Function,
  onMousedown: Function,
  onKeydown: Function,
  onKeyup: [Function, Array],
  onInput: [Function, Array],
  onFocus: [Function, Array],
  onBlur: [Function, Array],
  onClick: [Function, Array],
  onChange: [Function, Array],
  onClear: [Function, Array],
  countGraphemes: Function,
  status: String,
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array],
  /** private */
  textDecoration: [String, Array],
  attrSize: {
    type: Number,
    default: 20
  },
  onInputBlur: [Function, Array],
  onInputFocus: [Function, Array],
  onDeactivate: [Function, Array],
  onActivate: [Function, Array],
  onWrapperFocus: [Function, Array],
  onWrapperBlur: [Function, Array],
  internalDeactivateOnEnter: Boolean,
  internalForceFocus: Boolean,
  internalLoadingBeforeSuffix: {
    type: Boolean,
    default: true
  },
  /** deprecated */
  showPasswordToggle: Boolean
});
const __unplugin_components_3 = defineComponent({
  name: "Input",
  props: inputProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedBorderedRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const themeRef = useTheme("Input", "-input", style$2, inputLight, props, mergedClsPrefixRef);
    const wrapperElRef = ref(null);
    const textareaElRef = ref(null);
    const textareaMirrorElRef = ref(null);
    const inputMirrorElRef = ref(null);
    const inputElRef = ref(null);
    const inputEl2Ref = ref(null);
    const currentFocusedInputRef = ref(null);
    const focusedInputCursorControl = useCursor(currentFocusedInputRef);
    const textareaScrollbarInstRef = ref(null);
    const {
      localeRef
    } = useLocale("Input");
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = toRef(props, "value");
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const formItem = useFormItem(props);
    const {
      mergedSizeRef,
      mergedDisabledRef,
      mergedStatusRef
    } = formItem;
    const focusedRef = ref(false);
    const hoverRef = ref(false);
    const isComposingRef = ref(false);
    const activatedRef = ref(false);
    let syncSource = null;
    const mergedPlaceholderRef = computed(() => {
      const {
        placeholder,
        pair
      } = props;
      if (pair) {
        if (Array.isArray(placeholder)) {
          return placeholder;
        } else if (placeholder === undefined) {
          return ["", ""];
        }
        return [placeholder, placeholder];
      } else if (placeholder === undefined) {
        return [localeRef.value.placeholder];
      } else {
        return [placeholder];
      }
    });
    const showPlaceholder1Ref = computed(() => {
      const {
        value: isComposing
      } = isComposingRef;
      const {
        value: mergedValue
      } = mergedValueRef;
      const {
        value: mergedPlaceholder
      } = mergedPlaceholderRef;
      return !isComposing && (isEmptyInputValue(mergedValue) || Array.isArray(mergedValue) && isEmptyInputValue(mergedValue[0])) && mergedPlaceholder[0];
    });
    const showPlaceholder2Ref = computed(() => {
      const {
        value: isComposing
      } = isComposingRef;
      const {
        value: mergedValue
      } = mergedValueRef;
      const {
        value: mergedPlaceholder
      } = mergedPlaceholderRef;
      return !isComposing && mergedPlaceholder[1] && (isEmptyInputValue(mergedValue) || Array.isArray(mergedValue) && isEmptyInputValue(mergedValue[1]));
    });
    const mergedFocusRef = useMemo(() => {
      return props.internalForceFocus || focusedRef.value;
    });
    const showClearButton = useMemo(() => {
      if (mergedDisabledRef.value || props.readonly || !props.clearable || !mergedFocusRef.value && !hoverRef.value) {
        return false;
      }
      const {
        value: mergedValue
      } = mergedValueRef;
      const {
        value: mergedFocus
      } = mergedFocusRef;
      if (props.pair) {
        return !!(Array.isArray(mergedValue) && (mergedValue[0] || mergedValue[1])) && (hoverRef.value || mergedFocus);
      } else {
        return !!mergedValue && (hoverRef.value || mergedFocus);
      }
    });
    const mergedShowPasswordOnRef = computed(() => {
      const {
        showPasswordOn
      } = props;
      if (showPasswordOn) {
        return showPasswordOn;
      }
      if (props.showPasswordToggle) return "click";
      return undefined;
    });
    const passwordVisibleRef = ref(false);
    const textDecorationStyleRef = computed(() => {
      const {
        textDecoration
      } = props;
      if (!textDecoration) return ["", ""];
      if (Array.isArray(textDecoration)) {
        return textDecoration.map((v) => ({
          textDecoration: v
        }));
      }
      return [{
        textDecoration
      }];
    });
    const textAreaScrollContainerWidthRef = ref(undefined);
    const updateTextAreaStyle = () => {
      var _a, _b;
      if (props.type === "textarea") {
        const {
          autosize
        } = props;
        if (autosize) {
          textAreaScrollContainerWidthRef.value = (_b = (_a = textareaScrollbarInstRef.value) === null || _a === undefined ? undefined : _a.$el) === null || _b === undefined ? undefined : _b.offsetWidth;
        }
        if (!textareaElRef.value) return;
        if (typeof autosize === "boolean") return;
        const {
          paddingTop: stylePaddingTop,
          paddingBottom: stylePaddingBottom,
          lineHeight: styleLineHeight
        } = (undefined).getComputedStyle(textareaElRef.value);
        const paddingTop = Number(stylePaddingTop.slice(0, -2));
        const paddingBottom = Number(stylePaddingBottom.slice(0, -2));
        const lineHeight = Number(styleLineHeight.slice(0, -2));
        const {
          value: textareaMirrorEl
        } = textareaMirrorElRef;
        if (!textareaMirrorEl) return;
        if (autosize.minRows) {
          const minRows = Math.max(autosize.minRows, 1);
          const styleMinHeight = `${paddingTop + paddingBottom + lineHeight * minRows}px`;
          textareaMirrorEl.style.minHeight = styleMinHeight;
        }
        if (autosize.maxRows) {
          const styleMaxHeight = `${paddingTop + paddingBottom + lineHeight * autosize.maxRows}px`;
          textareaMirrorEl.style.maxHeight = styleMaxHeight;
        }
      }
    };
    const maxlengthRef = computed(() => {
      const {
        maxlength
      } = props;
      return maxlength === undefined ? undefined : Number(maxlength);
    });
    const vm = getCurrentInstance().proxy;
    function doUpdateValue(value, meta) {
      const {
        onUpdateValue,
        "onUpdate:value": _onUpdateValue,
        onInput
      } = props;
      const {
        nTriggerFormInput
      } = formItem;
      if (onUpdateValue) call(onUpdateValue, value, meta);
      if (_onUpdateValue) call(_onUpdateValue, value, meta);
      if (onInput) call(onInput, value, meta);
      uncontrolledValueRef.value = value;
      nTriggerFormInput();
    }
    function doChange(value, meta) {
      const {
        onChange
      } = props;
      const {
        nTriggerFormChange
      } = formItem;
      if (onChange) call(onChange, value, meta);
      uncontrolledValueRef.value = value;
      nTriggerFormChange();
    }
    function doBlur(e) {
      const {
        onBlur
      } = props;
      const {
        nTriggerFormBlur
      } = formItem;
      if (onBlur) call(onBlur, e);
      nTriggerFormBlur();
    }
    function doFocus(e) {
      const {
        onFocus
      } = props;
      const {
        nTriggerFormFocus
      } = formItem;
      if (onFocus) call(onFocus, e);
      nTriggerFormFocus();
    }
    function doClear(e) {
      const {
        onClear
      } = props;
      if (onClear) call(onClear, e);
    }
    function doUpdateValueBlur(e) {
      const {
        onInputBlur
      } = props;
      if (onInputBlur) call(onInputBlur, e);
    }
    function doUpdateValueFocus(e) {
      const {
        onInputFocus
      } = props;
      if (onInputFocus) call(onInputFocus, e);
    }
    function doDeactivate() {
      const {
        onDeactivate
      } = props;
      if (onDeactivate) call(onDeactivate);
    }
    function doActivate() {
      const {
        onActivate
      } = props;
      if (onActivate) call(onActivate);
    }
    function doClick(e) {
      const {
        onClick
      } = props;
      if (onClick) call(onClick, e);
    }
    function doWrapperFocus(e) {
      const {
        onWrapperFocus
      } = props;
      if (onWrapperFocus) call(onWrapperFocus, e);
    }
    function doWrapperBlur(e) {
      const {
        onWrapperBlur
      } = props;
      if (onWrapperBlur) call(onWrapperBlur, e);
    }
    function handleCompositionStart() {
      isComposingRef.value = true;
    }
    function handleCompositionEnd(e) {
      isComposingRef.value = false;
      if (e.target === inputEl2Ref.value) {
        handleInput(e, 1);
      } else {
        handleInput(e, 0);
      }
    }
    function handleInput(e, index2 = 0, event = "input") {
      const targetValue = e.target.value;
      syncMirror(targetValue);
      if (e instanceof InputEvent && !e.isComposing) {
        isComposingRef.value = false;
      }
      if (props.type === "textarea") {
        const {
          value: textareaScrollbarInst
        } = textareaScrollbarInstRef;
        if (textareaScrollbarInst) {
          textareaScrollbarInst.syncUnifiedContainer();
        }
      }
      syncSource = targetValue;
      if (isComposingRef.value) return;
      focusedInputCursorControl.recordCursor();
      const isIncomingValueValid = allowInput(targetValue);
      if (isIncomingValueValid) {
        if (!props.pair) {
          if (event === "input") {
            doUpdateValue(targetValue, {
              source: index2
            });
          } else {
            doChange(targetValue, {
              source: index2
            });
          }
        } else {
          let {
            value
          } = mergedValueRef;
          if (!Array.isArray(value)) {
            value = ["", ""];
          } else {
            value = [value[0], value[1]];
          }
          value[index2] = targetValue;
          if (event === "input") {
            doUpdateValue(value, {
              source: index2
            });
          } else {
            doChange(value, {
              source: index2
            });
          }
        }
      }
      vm.$forceUpdate();
      if (!isIncomingValueValid) {
        void nextTick(focusedInputCursorControl.restoreCursor);
      }
    }
    function allowInput(value) {
      const {
        countGraphemes,
        maxlength,
        minlength
      } = props;
      if (countGraphemes) {
        let graphemesCount;
        if (maxlength !== undefined) {
          if (graphemesCount === undefined) {
            graphemesCount = countGraphemes(value);
          }
          if (graphemesCount > Number(maxlength)) return false;
        }
        if (minlength !== undefined) {
          if (graphemesCount === undefined) {
            graphemesCount = countGraphemes(value);
          }
          if (graphemesCount < Number(maxlength)) return false;
        }
      }
      const {
        allowInput: allowInput2
      } = props;
      if (typeof allowInput2 === "function") {
        return allowInput2(value);
      }
      return true;
    }
    function handleInputBlur(e) {
      doUpdateValueBlur(e);
      if (e.relatedTarget === wrapperElRef.value) {
        doDeactivate();
      }
      if (!(e.relatedTarget !== null && (e.relatedTarget === inputElRef.value || e.relatedTarget === inputEl2Ref.value || e.relatedTarget === textareaElRef.value))) {
        activatedRef.value = false;
      }
      dealWithEvent(e, "blur");
      currentFocusedInputRef.value = null;
    }
    function handleInputFocus(e, index2) {
      doUpdateValueFocus(e);
      focusedRef.value = true;
      activatedRef.value = true;
      doActivate();
      dealWithEvent(e, "focus");
      if (index2 === 0) {
        currentFocusedInputRef.value = inputElRef.value;
      } else if (index2 === 1) {
        currentFocusedInputRef.value = inputEl2Ref.value;
      } else if (index2 === 2) {
        currentFocusedInputRef.value = textareaElRef.value;
      }
    }
    function handleWrapperBlur(e) {
      if (props.passivelyActivated) {
        doWrapperBlur(e);
        dealWithEvent(e, "blur");
      }
    }
    function handleWrapperFocus(e) {
      if (props.passivelyActivated) {
        focusedRef.value = true;
        doWrapperFocus(e);
        dealWithEvent(e, "focus");
      }
    }
    function dealWithEvent(e, type) {
      if (e.relatedTarget !== null && (e.relatedTarget === inputElRef.value || e.relatedTarget === inputEl2Ref.value || e.relatedTarget === textareaElRef.value || e.relatedTarget === wrapperElRef.value)) ;
      else {
        if (type === "focus") {
          doFocus(e);
          focusedRef.value = true;
        } else if (type === "blur") {
          doBlur(e);
          focusedRef.value = false;
        }
      }
    }
    function handleChange(e, index2) {
      handleInput(e, index2, "change");
    }
    function handleClick(e) {
      doClick(e);
    }
    function handleClear(e) {
      doClear(e);
      clearValue();
    }
    function clearValue() {
      if (props.pair) {
        doUpdateValue(["", ""], {
          source: "clear"
        });
        doChange(["", ""], {
          source: "clear"
        });
      } else {
        doUpdateValue("", {
          source: "clear"
        });
        doChange("", {
          source: "clear"
        });
      }
    }
    function handleMouseDown(e) {
      const {
        onMousedown
      } = props;
      if (onMousedown) onMousedown(e);
      const {
        tagName
      } = e.target;
      if (tagName !== "INPUT" && tagName !== "TEXTAREA") {
        if (props.resizable) {
          const {
            value: wrapperEl
          } = wrapperElRef;
          if (wrapperEl) {
            const {
              left,
              top,
              width,
              height
            } = wrapperEl.getBoundingClientRect();
            const resizeHandleSize = 14;
            if (left + width - resizeHandleSize < e.clientX && e.clientX < left + width && top + height - resizeHandleSize < e.clientY && e.clientY < top + height) {
              return;
            }
          }
        }
        e.preventDefault();
        if (!focusedRef.value) {
          focus();
        }
      }
    }
    function handleMouseEnter() {
      var _a;
      hoverRef.value = true;
      if (props.type === "textarea") {
        (_a = textareaScrollbarInstRef.value) === null || _a === undefined ? undefined : _a.handleMouseEnterWrapper();
      }
    }
    function handleMouseLeave() {
      var _a;
      hoverRef.value = false;
      if (props.type === "textarea") {
        (_a = textareaScrollbarInstRef.value) === null || _a === undefined ? undefined : _a.handleMouseLeaveWrapper();
      }
    }
    function handlePasswordToggleClick() {
      if (mergedDisabledRef.value) return;
      if (mergedShowPasswordOnRef.value !== "click") return;
      passwordVisibleRef.value = !passwordVisibleRef.value;
    }
    function handlePasswordToggleMousedown(e) {
      if (mergedDisabledRef.value) return;
      e.preventDefault();
      const preventDefaultOnce = (e2) => {
        e2.preventDefault();
        off("mouseup", undefined, preventDefaultOnce);
      };
      on("mouseup", undefined, preventDefaultOnce);
      if (mergedShowPasswordOnRef.value !== "mousedown") return;
      passwordVisibleRef.value = true;
      const hidePassword = () => {
        passwordVisibleRef.value = false;
        off("mouseup", undefined, hidePassword);
      };
      on("mouseup", undefined, hidePassword);
    }
    function handleWrapperKeyup(e) {
      if (props.onKeyup) call(props.onKeyup, e);
    }
    function handleWrapperKeydown(e) {
      if (props.onKeydown) call(props.onKeydown, e);
      switch (e.key) {
        case "Escape":
          handleWrapperKeydownEsc();
          break;
        case "Enter":
          handleWrapperKeydownEnter(e);
          break;
      }
    }
    function handleWrapperKeydownEnter(e) {
      var _a, _b;
      if (props.passivelyActivated) {
        const {
          value: focused
        } = activatedRef;
        if (focused) {
          if (props.internalDeactivateOnEnter) {
            handleWrapperKeydownEsc();
          }
          return;
        }
        e.preventDefault();
        if (props.type === "textarea") {
          (_a = textareaElRef.value) === null || _a === undefined ? undefined : _a.focus();
        } else {
          (_b = inputElRef.value) === null || _b === undefined ? undefined : _b.focus();
        }
      }
    }
    function handleWrapperKeydownEsc() {
      if (props.passivelyActivated) {
        activatedRef.value = false;
        void nextTick(() => {
          var _a;
          (_a = wrapperElRef.value) === null || _a === undefined ? undefined : _a.focus();
        });
      }
    }
    function focus() {
      var _a, _b, _c;
      if (mergedDisabledRef.value) return;
      if (props.passivelyActivated) {
        (_a = wrapperElRef.value) === null || _a === undefined ? undefined : _a.focus();
      } else {
        (_b = textareaElRef.value) === null || _b === undefined ? undefined : _b.focus();
        (_c = inputElRef.value) === null || _c === undefined ? undefined : _c.focus();
      }
    }
    function blur() {
      var _a;
      if ((_a = wrapperElRef.value) === null || _a === undefined ? undefined : _a.contains((undefined).activeElement)) {
        (undefined).activeElement.blur();
      }
    }
    function select() {
      var _a, _b;
      (_a = textareaElRef.value) === null || _a === undefined ? undefined : _a.select();
      (_b = inputElRef.value) === null || _b === undefined ? undefined : _b.select();
    }
    function activate() {
      if (mergedDisabledRef.value) return;
      if (textareaElRef.value) textareaElRef.value.focus();
      else if (inputElRef.value) inputElRef.value.focus();
    }
    function deactivate() {
      const {
        value: wrapperEl
      } = wrapperElRef;
      if ((wrapperEl === null || wrapperEl === undefined ? undefined : wrapperEl.contains((undefined).activeElement)) && wrapperEl !== (undefined).activeElement) {
        handleWrapperKeydownEsc();
      }
    }
    function scrollTo(options) {
      if (props.type === "textarea") {
        const {
          value: textareaEl
        } = textareaElRef;
        textareaEl === null || textareaEl === undefined ? undefined : textareaEl.scrollTo(options);
      } else {
        const {
          value: inputEl
        } = inputElRef;
        inputEl === null || inputEl === undefined ? undefined : inputEl.scrollTo(options);
      }
    }
    function syncMirror(value) {
      const {
        type,
        pair,
        autosize
      } = props;
      if (!pair && autosize) {
        if (type === "textarea") {
          const {
            value: textareaMirrorEl
          } = textareaMirrorElRef;
          if (textareaMirrorEl) {
            textareaMirrorEl.textContent = `${value !== null && value !== undefined ? value : ""}\r
`;
          }
        } else {
          const {
            value: inputMirrorEl
          } = inputMirrorElRef;
          if (inputMirrorEl) {
            if (value) {
              inputMirrorEl.textContent = value;
            } else {
              inputMirrorEl.innerHTML = "&nbsp;";
            }
          }
        }
      }
    }
    function handleTextAreaMirrorResize() {
      updateTextAreaStyle();
    }
    const placeholderStyleRef = ref({
      top: "0"
    });
    function handleTextAreaScroll(e) {
      var _a;
      const {
        scrollTop
      } = e.target;
      placeholderStyleRef.value.top = `${-scrollTop}px`;
      (_a = textareaScrollbarInstRef.value) === null || _a === undefined ? undefined : _a.syncUnifiedContainer();
    }
    let stopWatchMergedValue1 = null;
    watchEffect(() => {
      const {
        autosize,
        type
      } = props;
      if (autosize && type === "textarea") {
        stopWatchMergedValue1 = watch(mergedValueRef, (value) => {
          if (!Array.isArray(value) && value !== syncSource) {
            syncMirror(value);
          }
        });
      } else {
        stopWatchMergedValue1 === null || stopWatchMergedValue1 === undefined ? undefined : stopWatchMergedValue1();
      }
    });
    let stopWatchMergedValue2 = null;
    watchEffect(() => {
      if (props.type === "textarea") {
        stopWatchMergedValue2 = watch(mergedValueRef, (value) => {
          var _a;
          if (!Array.isArray(value) && value !== syncSource) {
            (_a = textareaScrollbarInstRef.value) === null || _a === undefined ? undefined : _a.syncUnifiedContainer();
          }
        });
      } else {
        stopWatchMergedValue2 === null || stopWatchMergedValue2 === undefined ? undefined : stopWatchMergedValue2();
      }
    });
    provide(inputInjectionKey, {
      mergedValueRef,
      maxlengthRef,
      mergedClsPrefixRef,
      countGraphemesRef: toRef(props, "countGraphemes")
    });
    const exposedProps = {
      wrapperElRef,
      inputElRef,
      textareaElRef,
      isCompositing: isComposingRef,
      clear: clearValue,
      focus,
      blur,
      select,
      deactivate,
      activate,
      scrollTo
    };
    const rtlEnabledRef = useRtl("Input", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        value: size
      } = mergedSizeRef;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          color,
          borderRadius,
          textColor,
          caretColor,
          caretColorError,
          caretColorWarning,
          textDecorationColor,
          border,
          borderDisabled,
          borderHover,
          borderFocus,
          placeholderColor,
          placeholderColorDisabled,
          lineHeightTextarea,
          colorDisabled,
          colorFocus,
          textColorDisabled,
          boxShadowFocus,
          iconSize,
          colorFocusWarning,
          boxShadowFocusWarning,
          borderWarning,
          borderFocusWarning,
          borderHoverWarning,
          colorFocusError,
          boxShadowFocusError,
          borderError,
          borderFocusError,
          borderHoverError,
          clearSize,
          clearColor,
          clearColorHover,
          clearColorPressed,
          iconColor,
          iconColorDisabled,
          suffixTextColor,
          countTextColor,
          countTextColorDisabled,
          iconColorHover,
          iconColorPressed,
          loadingColor,
          loadingColorError,
          loadingColorWarning,
          fontWeight,
          [createKey("padding", size)]: padding,
          [createKey("fontSize", size)]: fontSize,
          [createKey("height", size)]: height
        }
      } = themeRef.value;
      const {
        left: paddingLeft,
        right: paddingRight
      } = getPadding(padding);
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-count-text-color": countTextColor,
        "--n-count-text-color-disabled": countTextColorDisabled,
        "--n-color": color,
        "--n-font-size": fontSize,
        "--n-font-weight": fontWeight,
        "--n-border-radius": borderRadius,
        "--n-height": height,
        "--n-padding-left": paddingLeft,
        "--n-padding-right": paddingRight,
        "--n-text-color": textColor,
        "--n-caret-color": caretColor,
        "--n-text-decoration-color": textDecorationColor,
        "--n-border": border,
        "--n-border-disabled": borderDisabled,
        "--n-border-hover": borderHover,
        "--n-border-focus": borderFocus,
        "--n-placeholder-color": placeholderColor,
        "--n-placeholder-color-disabled": placeholderColorDisabled,
        "--n-icon-size": iconSize,
        "--n-line-height-textarea": lineHeightTextarea,
        "--n-color-disabled": colorDisabled,
        "--n-color-focus": colorFocus,
        "--n-text-color-disabled": textColorDisabled,
        "--n-box-shadow-focus": boxShadowFocus,
        "--n-loading-color": loadingColor,
        // form warning
        "--n-caret-color-warning": caretColorWarning,
        "--n-color-focus-warning": colorFocusWarning,
        "--n-box-shadow-focus-warning": boxShadowFocusWarning,
        "--n-border-warning": borderWarning,
        "--n-border-focus-warning": borderFocusWarning,
        "--n-border-hover-warning": borderHoverWarning,
        "--n-loading-color-warning": loadingColorWarning,
        // form error
        "--n-caret-color-error": caretColorError,
        "--n-color-focus-error": colorFocusError,
        "--n-box-shadow-focus-error": boxShadowFocusError,
        "--n-border-error": borderError,
        "--n-border-focus-error": borderFocusError,
        "--n-border-hover-error": borderHoverError,
        "--n-loading-color-error": loadingColorError,
        // clear-button
        "--n-clear-color": clearColor,
        "--n-clear-size": clearSize,
        "--n-clear-color-hover": clearColorHover,
        "--n-clear-color-pressed": clearColorPressed,
        "--n-icon-color": iconColor,
        "--n-icon-color-hover": iconColorHover,
        "--n-icon-color-pressed": iconColorPressed,
        "--n-icon-color-disabled": iconColorDisabled,
        "--n-suffix-text-color": suffixTextColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("input", computed(() => {
      const {
        value: size
      } = mergedSizeRef;
      return size[0];
    }), cssVarsRef, props) : undefined;
    return Object.assign(Object.assign({}, exposedProps), {
      // DOM ref
      wrapperElRef,
      inputElRef,
      inputMirrorElRef,
      inputEl2Ref,
      textareaElRef,
      textareaMirrorElRef,
      textareaScrollbarInstRef,
      // value
      rtlEnabled: rtlEnabledRef,
      uncontrolledValue: uncontrolledValueRef,
      mergedValue: mergedValueRef,
      passwordVisible: passwordVisibleRef,
      mergedPlaceholder: mergedPlaceholderRef,
      showPlaceholder1: showPlaceholder1Ref,
      showPlaceholder2: showPlaceholder2Ref,
      mergedFocus: mergedFocusRef,
      isComposing: isComposingRef,
      activated: activatedRef,
      showClearButton,
      mergedSize: mergedSizeRef,
      mergedDisabled: mergedDisabledRef,
      textDecorationStyle: textDecorationStyleRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedBordered: mergedBorderedRef,
      mergedShowPasswordOn: mergedShowPasswordOnRef,
      placeholderStyle: placeholderStyleRef,
      mergedStatus: mergedStatusRef,
      textAreaScrollContainerWidth: textAreaScrollContainerWidthRef,
      // methods
      handleTextAreaScroll,
      handleCompositionStart,
      handleCompositionEnd,
      handleInput,
      handleInputBlur,
      handleInputFocus,
      handleWrapperBlur,
      handleWrapperFocus,
      handleMouseEnter,
      handleMouseLeave,
      handleMouseDown,
      handleChange,
      handleClick,
      handleClear,
      handlePasswordToggleClick,
      handlePasswordToggleMousedown,
      handleWrapperKeydown,
      handleWrapperKeyup,
      handleTextAreaMirrorResize,
      getTextareaScrollContainer: () => {
        return textareaElRef.value;
      },
      mergedTheme: themeRef,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    });
  },
  render() {
    var _a, _b;
    const {
      mergedClsPrefix,
      mergedStatus,
      themeClass,
      type,
      countGraphemes,
      onRender
    } = this;
    const $slots = this.$slots;
    onRender === null || onRender === undefined ? undefined : onRender();
    return h("div", {
      ref: "wrapperElRef",
      class: [`${mergedClsPrefix}-input`, themeClass, mergedStatus && `${mergedClsPrefix}-input--${mergedStatus}-status`, {
        [`${mergedClsPrefix}-input--rtl`]: this.rtlEnabled,
        [`${mergedClsPrefix}-input--disabled`]: this.mergedDisabled,
        [`${mergedClsPrefix}-input--textarea`]: type === "textarea",
        [`${mergedClsPrefix}-input--resizable`]: this.resizable && !this.autosize,
        [`${mergedClsPrefix}-input--autosize`]: this.autosize,
        [`${mergedClsPrefix}-input--round`]: this.round && !(type === "textarea"),
        [`${mergedClsPrefix}-input--pair`]: this.pair,
        [`${mergedClsPrefix}-input--focus`]: this.mergedFocus,
        [`${mergedClsPrefix}-input--stateful`]: this.stateful
      }],
      style: this.cssVars,
      tabindex: !this.mergedDisabled && this.passivelyActivated && !this.activated ? 0 : undefined,
      onFocus: this.handleWrapperFocus,
      onBlur: this.handleWrapperBlur,
      onClick: this.handleClick,
      onMousedown: this.handleMouseDown,
      onMouseenter: this.handleMouseEnter,
      onMouseleave: this.handleMouseLeave,
      onCompositionstart: this.handleCompositionStart,
      onCompositionend: this.handleCompositionEnd,
      onKeyup: this.handleWrapperKeyup,
      onKeydown: this.handleWrapperKeydown
    }, h("div", {
      class: `${mergedClsPrefix}-input-wrapper`
    }, resolveWrappedSlot($slots.prefix, (children) => children && h("div", {
      class: `${mergedClsPrefix}-input__prefix`
    }, children)), type === "textarea" ? h(Scrollbar, {
      ref: "textareaScrollbarInstRef",
      class: `${mergedClsPrefix}-input__textarea`,
      container: this.getTextareaScrollContainer,
      triggerDisplayManually: true,
      useUnifiedContainer: true,
      internalHoistYRail: true
    }, {
      default: () => {
        var _a2, _b2;
        const {
          textAreaScrollContainerWidth
        } = this;
        const scrollContainerWidthStyle = {
          width: this.autosize && textAreaScrollContainerWidth && `${textAreaScrollContainerWidth}px`
        };
        return h(Fragment, null, h("textarea", Object.assign({}, this.inputProps, {
          ref: "textareaElRef",
          class: [`${mergedClsPrefix}-input__textarea-el`, (_a2 = this.inputProps) === null || _a2 === undefined ? undefined : _a2.class],
          autofocus: this.autofocus,
          rows: Number(this.rows),
          placeholder: this.placeholder,
          value: this.mergedValue,
          disabled: this.mergedDisabled,
          maxlength: countGraphemes ? undefined : this.maxlength,
          minlength: countGraphemes ? undefined : this.minlength,
          readonly: this.readonly,
          tabindex: this.passivelyActivated && !this.activated ? -1 : undefined,
          style: [this.textDecorationStyle[0], (_b2 = this.inputProps) === null || _b2 === undefined ? undefined : _b2.style, scrollContainerWidthStyle],
          onBlur: this.handleInputBlur,
          onFocus: (e) => {
            this.handleInputFocus(e, 2);
          },
          onInput: this.handleInput,
          onChange: this.handleChange,
          onScroll: this.handleTextAreaScroll
        })), this.showPlaceholder1 ? h("div", {
          class: `${mergedClsPrefix}-input__placeholder`,
          style: [this.placeholderStyle, scrollContainerWidthStyle],
          key: "placeholder"
        }, this.mergedPlaceholder[0]) : null, this.autosize ? h(VResizeObserver, {
          onResize: this.handleTextAreaMirrorResize
        }, {
          default: () => h("div", {
            ref: "textareaMirrorElRef",
            class: `${mergedClsPrefix}-input__textarea-mirror`,
            key: "mirror"
          })
        }) : null);
      }
    }) : h("div", {
      class: `${mergedClsPrefix}-input__input`
    }, h("input", Object.assign({
      type: type === "password" && this.mergedShowPasswordOn && this.passwordVisible ? "text" : type
    }, this.inputProps, {
      ref: "inputElRef",
      class: [`${mergedClsPrefix}-input__input-el`, (_a = this.inputProps) === null || _a === undefined ? undefined : _a.class],
      style: [this.textDecorationStyle[0], (_b = this.inputProps) === null || _b === undefined ? undefined : _b.style],
      tabindex: this.passivelyActivated && !this.activated ? -1 : undefined,
      placeholder: this.mergedPlaceholder[0],
      disabled: this.mergedDisabled,
      maxlength: countGraphemes ? undefined : this.maxlength,
      minlength: countGraphemes ? undefined : this.minlength,
      value: Array.isArray(this.mergedValue) ? this.mergedValue[0] : this.mergedValue,
      readonly: this.readonly,
      autofocus: this.autofocus,
      size: this.attrSize,
      onBlur: this.handleInputBlur,
      onFocus: (e) => {
        this.handleInputFocus(e, 0);
      },
      onInput: (e) => {
        this.handleInput(e, 0);
      },
      onChange: (e) => {
        this.handleChange(e, 0);
      }
    })), this.showPlaceholder1 ? h("div", {
      class: `${mergedClsPrefix}-input__placeholder`
    }, h("span", null, this.mergedPlaceholder[0])) : null, this.autosize ? h("div", {
      class: `${mergedClsPrefix}-input__input-mirror`,
      key: "mirror",
      ref: "inputMirrorElRef"
    }, "\xA0") : null), !this.pair && resolveWrappedSlot($slots.suffix, (children) => {
      return children || this.clearable || this.showCount || this.mergedShowPasswordOn || this.loading !== undefined ? h("div", {
        class: `${mergedClsPrefix}-input__suffix`
      }, [resolveWrappedSlot($slots["clear-icon-placeholder"], (children2) => {
        return (this.clearable || children2) && h(NBaseClear, {
          clsPrefix: mergedClsPrefix,
          show: this.showClearButton,
          onClear: this.handleClear
        }, {
          placeholder: () => children2,
          icon: () => {
            var _a2, _b2;
            return (_b2 = (_a2 = this.$slots)["clear-icon"]) === null || _b2 === undefined ? undefined : _b2.call(_a2);
          }
        });
      }), !this.internalLoadingBeforeSuffix ? children : null, this.loading !== undefined ? h(NBaseSuffix, {
        clsPrefix: mergedClsPrefix,
        loading: this.loading,
        showArrow: false,
        showClear: false,
        style: this.cssVars
      }) : null, this.internalLoadingBeforeSuffix ? children : null, this.showCount && this.type !== "textarea" ? h(WordCount, null, {
        default: (props) => {
          var _a2;
          const {
            renderCount
          } = this;
          if (renderCount) {
            return renderCount(props);
          }
          return (_a2 = $slots.count) === null || _a2 === undefined ? undefined : _a2.call($slots, props);
        }
      }) : null, this.mergedShowPasswordOn && this.type === "password" ? h("div", {
        class: `${mergedClsPrefix}-input__eye`,
        onMousedown: this.handlePasswordToggleMousedown,
        onClick: this.handlePasswordToggleClick
      }, this.passwordVisible ? resolveSlot($slots["password-visible-icon"], () => [h(NBaseIcon, {
        clsPrefix: mergedClsPrefix
      }, {
        default: () => h(EyeIcon, null)
      })]) : resolveSlot($slots["password-invisible-icon"], () => [h(NBaseIcon, {
        clsPrefix: mergedClsPrefix
      }, {
        default: () => h(EyeOffIcon, null)
      })])) : null]) : null;
    })), this.pair ? h("span", {
      class: `${mergedClsPrefix}-input__separator`
    }, resolveSlot($slots.separator, () => [this.separator])) : null, this.pair ? h("div", {
      class: `${mergedClsPrefix}-input-wrapper`
    }, h("div", {
      class: `${mergedClsPrefix}-input__input`
    }, h("input", {
      ref: "inputEl2Ref",
      type: this.type,
      class: `${mergedClsPrefix}-input__input-el`,
      tabindex: this.passivelyActivated && !this.activated ? -1 : undefined,
      placeholder: this.mergedPlaceholder[1],
      disabled: this.mergedDisabled,
      maxlength: countGraphemes ? undefined : this.maxlength,
      minlength: countGraphemes ? undefined : this.minlength,
      value: Array.isArray(this.mergedValue) ? this.mergedValue[1] : undefined,
      readonly: this.readonly,
      style: this.textDecorationStyle[1],
      onBlur: this.handleInputBlur,
      onFocus: (e) => {
        this.handleInputFocus(e, 1);
      },
      onInput: (e) => {
        this.handleInput(e, 1);
      },
      onChange: (e) => {
        this.handleChange(e, 1);
      }
    }), this.showPlaceholder2 ? h("div", {
      class: `${mergedClsPrefix}-input__placeholder`
    }, h("span", null, this.mergedPlaceholder[1])) : null), resolveWrappedSlot($slots.suffix, (children) => {
      return (this.clearable || children) && h("div", {
        class: `${mergedClsPrefix}-input__suffix`
      }, [this.clearable && h(NBaseClear, {
        clsPrefix: mergedClsPrefix,
        show: this.showClearButton,
        onClear: this.handleClear
      }, {
        icon: () => {
          var _a2;
          return (_a2 = $slots["clear-icon"]) === null || _a2 === undefined ? undefined : _a2.call($slots);
        },
        placeholder: () => {
          var _a2;
          return (_a2 = $slots["clear-icon-placeholder"]) === null || _a2 === undefined ? undefined : _a2.call($slots);
        }
      }), children]);
    })) : null, this.mergedBordered ? h("div", {
      class: `${mergedClsPrefix}-input__border`
    }) : null, this.mergedBordered ? h("div", {
      class: `${mergedClsPrefix}-input__state-border`
    }) : null, this.showCount && type === "textarea" ? h(WordCount, null, {
      default: (props) => {
        var _a2;
        const {
          renderCount
        } = this;
        if (renderCount) {
          return renderCount(props);
        }
        return (_a2 = $slots.count) === null || _a2 === undefined ? undefined : _a2.call($slots, props);
      }
    }) : null);
  }
});
function getIsGroup(option) {
  return option.type === "group";
}
function getIgnored(option) {
  return option.type === "ignored";
}
function patternMatched(pattern, value) {
  try {
    return !!(1 + value.toString().toLowerCase().indexOf(pattern.trim().toLowerCase()));
  } catch (_a) {
    return false;
  }
}
function createTmOptions(valueField, childrenField) {
  const options = {
    getIsGroup,
    getIgnored,
    getKey(option) {
      if (getIsGroup(option)) {
        return option.name || option.key || "key-required";
      }
      return option[valueField];
    },
    getChildren(option) {
      return option[childrenField];
    }
  };
  return options;
}
function filterOptions(originalOpts, filter, pattern, childrenField) {
  if (!filter) return originalOpts;
  function traverse(options) {
    if (!Array.isArray(options)) return [];
    const filteredOptions = [];
    for (const option of options) {
      if (getIsGroup(option)) {
        const children = traverse(option[childrenField]);
        if (children.length) {
          filteredOptions.push(Object.assign({}, option, {
            [childrenField]: children
          }));
        }
      } else if (getIgnored(option)) {
        continue;
      } else if (filter(pattern, option)) {
        filteredOptions.push(option);
      }
    }
    return filteredOptions;
  }
  return traverse(originalOpts);
}
function createValOptMap(options, valueField, childrenField) {
  const valOptMap = /* @__PURE__ */ new Map();
  options.forEach((option) => {
    if (getIsGroup(option)) {
      option[childrenField].forEach((selectGroupOption) => {
        valOptMap.set(selectGroupOption[valueField], selectGroupOption);
      });
    } else {
      valOptMap.set(option[valueField], option);
    }
  });
  return valOptMap;
}
const style$1 = c([cB("select", `
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 font-weight: var(--n-font-weight);
 `), cB("select-menu", `
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `, [fadeInScaleUpTransition({
  originalTransition: "background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"
})])]);
const selectProps = Object.assign(Object.assign({}, useTheme.props), {
  to: useAdjustedTo.propTo,
  bordered: {
    type: Boolean,
    default: undefined
  },
  clearable: Boolean,
  clearFilterAfterSelect: {
    type: Boolean,
    default: true
  },
  options: {
    type: Array,
    default: () => []
  },
  defaultValue: {
    type: [String, Number, Array],
    default: null
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  value: [String, Number, Array],
  placeholder: String,
  menuProps: Object,
  multiple: Boolean,
  size: String,
  menuSize: {
    type: String
  },
  filterable: Boolean,
  disabled: {
    type: Boolean,
    default: undefined
  },
  remote: Boolean,
  loading: Boolean,
  filter: Function,
  placement: {
    type: String,
    default: "bottom-start"
  },
  widthMode: {
    type: String,
    default: "trigger"
  },
  tag: Boolean,
  onCreate: Function,
  fallbackOption: {
    type: [Function, Boolean],
    default: undefined
  },
  show: {
    type: Boolean,
    default: undefined
  },
  showArrow: {
    type: Boolean,
    default: true
  },
  maxTagCount: [Number, String],
  ellipsisTagPopoverProps: Object,
  consistentMenuWidth: {
    type: Boolean,
    default: true
  },
  virtualScroll: {
    type: Boolean,
    default: true
  },
  labelField: {
    type: String,
    default: "label"
  },
  valueField: {
    type: String,
    default: "value"
  },
  childrenField: {
    type: String,
    default: "children"
  },
  renderLabel: Function,
  renderOption: Function,
  renderTag: Function,
  "onUpdate:value": [Function, Array],
  inputProps: Object,
  nodeProps: Function,
  ignoreComposition: {
    type: Boolean,
    default: true
  },
  showOnFocus: Boolean,
  // for jsx
  onUpdateValue: [Function, Array],
  onBlur: [Function, Array],
  onClear: [Function, Array],
  onFocus: [Function, Array],
  onScroll: [Function, Array],
  onSearch: [Function, Array],
  onUpdateShow: [Function, Array],
  "onUpdate:show": [Function, Array],
  displayDirective: {
    type: String,
    default: "show"
  },
  resetMenuOnOptionsChange: {
    type: Boolean,
    default: true
  },
  status: String,
  showCheckmark: {
    type: Boolean,
    default: true
  },
  /** deprecated */
  onChange: [Function, Array],
  items: Array
});
const __unplugin_components_1$1 = defineComponent({
  name: "Select",
  props: selectProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedBorderedRef,
      namespaceRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Select", "-select", style$1, selectLight, props, mergedClsPrefixRef);
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = toRef(props, "value");
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const focusedRef = ref(false);
    const patternRef = ref("");
    const compitableOptionsRef = useCompitable(props, ["items", "options"]);
    const createdOptionsRef = ref([]);
    const beingCreatedOptionsRef = ref([]);
    const localOptionsRef = computed(() => {
      return beingCreatedOptionsRef.value.concat(createdOptionsRef.value).concat(compitableOptionsRef.value);
    });
    const resolvedFilterRef = computed(() => {
      const {
        filter
      } = props;
      if (filter) return filter;
      const {
        labelField,
        valueField
      } = props;
      return (pattern, option) => {
        if (!option) return false;
        const label = option[labelField];
        if (typeof label === "string") {
          return patternMatched(pattern, label);
        }
        const value = option[valueField];
        if (typeof value === "string") {
          return patternMatched(pattern, value);
        }
        if (typeof value === "number") {
          return patternMatched(pattern, String(value));
        }
        return false;
      };
    });
    const filteredOptionsRef = computed(() => {
      if (props.remote) {
        return compitableOptionsRef.value;
      } else {
        const {
          value: localOptions
        } = localOptionsRef;
        const {
          value: pattern
        } = patternRef;
        if (!pattern.length || !props.filterable) {
          return localOptions;
        } else {
          return filterOptions(localOptions, resolvedFilterRef.value, pattern, props.childrenField);
        }
      }
    });
    const treeMateRef = computed(() => {
      const {
        valueField,
        childrenField
      } = props;
      const options = createTmOptions(valueField, childrenField);
      return createTreeMate(filteredOptionsRef.value, options);
    });
    const valOptMapRef = computed(() => createValOptMap(localOptionsRef.value, props.valueField, props.childrenField));
    const uncontrolledShowRef = ref(false);
    const mergedShowRef = useMergedState(toRef(props, "show"), uncontrolledShowRef);
    const triggerRef = ref(null);
    const followerRef = ref(null);
    const menuRef = ref(null);
    const {
      localeRef
    } = useLocale("Select");
    const localizedPlaceholderRef = computed(() => {
      var _a;
      return (_a = props.placeholder) !== null && _a !== undefined ? _a : localeRef.value.placeholder;
    });
    const emptyArray = [];
    const memoValOptMapRef = ref(/* @__PURE__ */ new Map());
    const wrappedFallbackOptionRef = computed(() => {
      const {
        fallbackOption
      } = props;
      if (fallbackOption === undefined) {
        const {
          labelField,
          valueField
        } = props;
        return (value) => ({
          [labelField]: String(value),
          [valueField]: value
        });
      }
      if (fallbackOption === false) return false;
      return (value) => {
        return Object.assign(fallbackOption(value), {
          value
        });
      };
    });
    function getMergedOptions(values) {
      const remote = props.remote;
      const {
        value: memoValOptMap
      } = memoValOptMapRef;
      const {
        value: valOptMap
      } = valOptMapRef;
      const {
        value: wrappedFallbackOption
      } = wrappedFallbackOptionRef;
      const options = [];
      values.forEach((value) => {
        if (valOptMap.has(value)) {
          options.push(valOptMap.get(value));
        } else if (remote && memoValOptMap.has(value)) {
          options.push(memoValOptMap.get(value));
        } else if (wrappedFallbackOption) {
          const option = wrappedFallbackOption(value);
          if (option) {
            options.push(option);
          }
        }
      });
      return options;
    }
    const selectedOptionsRef = computed(() => {
      if (props.multiple) {
        const {
          value: values
        } = mergedValueRef;
        if (!Array.isArray(values)) return [];
        return getMergedOptions(values);
      }
      return null;
    });
    const selectedOptionRef = computed(() => {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (!props.multiple && !Array.isArray(mergedValue)) {
        if (mergedValue === null) return null;
        return getMergedOptions([mergedValue])[0] || null;
      }
      return null;
    });
    const formItem = useFormItem(props);
    const {
      mergedSizeRef,
      mergedDisabledRef,
      mergedStatusRef
    } = formItem;
    function doUpdateValue(value, option) {
      const {
        onChange,
        "onUpdate:value": _onUpdateValue,
        onUpdateValue
      } = props;
      const {
        nTriggerFormChange,
        nTriggerFormInput
      } = formItem;
      if (onChange) call(onChange, value, option);
      if (onUpdateValue) call(onUpdateValue, value, option);
      if (_onUpdateValue) {
        call(_onUpdateValue, value, option);
      }
      uncontrolledValueRef.value = value;
      nTriggerFormChange();
      nTriggerFormInput();
    }
    function doBlur(e) {
      const {
        onBlur
      } = props;
      const {
        nTriggerFormBlur
      } = formItem;
      if (onBlur) call(onBlur, e);
      nTriggerFormBlur();
    }
    function doClear() {
      const {
        onClear
      } = props;
      if (onClear) call(onClear);
    }
    function doFocus(e) {
      const {
        onFocus,
        showOnFocus
      } = props;
      const {
        nTriggerFormFocus
      } = formItem;
      if (onFocus) call(onFocus, e);
      nTriggerFormFocus();
      if (showOnFocus) {
        openMenu();
      }
    }
    function doSearch(value) {
      const {
        onSearch
      } = props;
      if (onSearch) call(onSearch, value);
    }
    function doScroll(e) {
      const {
        onScroll
      } = props;
      if (onScroll) call(onScroll, e);
    }
    function updateMemorizedOptions() {
      var _a;
      const {
        remote,
        multiple
      } = props;
      if (remote) {
        const {
          value: memoValOptMap
        } = memoValOptMapRef;
        if (multiple) {
          const {
            valueField
          } = props;
          (_a = selectedOptionsRef.value) === null || _a === undefined ? undefined : _a.forEach((option) => {
            memoValOptMap.set(option[valueField], option);
          });
        } else {
          const option = selectedOptionRef.value;
          if (option) {
            memoValOptMap.set(option[props.valueField], option);
          }
        }
      }
    }
    function doUpdateShow(value) {
      const {
        onUpdateShow,
        "onUpdate:show": _onUpdateShow
      } = props;
      if (onUpdateShow) call(onUpdateShow, value);
      if (_onUpdateShow) call(_onUpdateShow, value);
      uncontrolledShowRef.value = value;
    }
    function openMenu() {
      if (!mergedDisabledRef.value) {
        doUpdateShow(true);
        uncontrolledShowRef.value = true;
        if (props.filterable) {
          focusSelectionInput();
        }
      }
    }
    function closeMenu() {
      doUpdateShow(false);
    }
    function handleMenuAfterLeave() {
      patternRef.value = "";
      beingCreatedOptionsRef.value = emptyArray;
    }
    const activeWithoutMenuOpenRef = ref(false);
    function onTriggerInputFocus() {
      if (props.filterable) {
        activeWithoutMenuOpenRef.value = true;
      }
    }
    function onTriggerInputBlur() {
      if (props.filterable) {
        activeWithoutMenuOpenRef.value = false;
        if (!mergedShowRef.value) {
          handleMenuAfterLeave();
        }
      }
    }
    function handleTriggerClick() {
      if (mergedDisabledRef.value) return;
      if (!mergedShowRef.value) {
        openMenu();
      } else {
        if (!props.filterable) {
          closeMenu();
        } else {
          focusSelectionInput();
        }
      }
    }
    function handleTriggerBlur(e) {
      var _a, _b;
      if ((_b = (_a = menuRef.value) === null || _a === undefined ? undefined : _a.selfRef) === null || _b === undefined ? undefined : _b.contains(e.relatedTarget)) {
        return;
      }
      focusedRef.value = false;
      doBlur(e);
      closeMenu();
    }
    function handleTriggerFocus(e) {
      doFocus(e);
      focusedRef.value = true;
    }
    function handleMenuFocus() {
      focusedRef.value = true;
    }
    function handleMenuBlur(e) {
      var _a;
      if ((_a = triggerRef.value) === null || _a === undefined ? undefined : _a.$el.contains(e.relatedTarget)) return;
      focusedRef.value = false;
      doBlur(e);
      closeMenu();
    }
    function handleMenuTabOut() {
      var _a;
      (_a = triggerRef.value) === null || _a === undefined ? undefined : _a.focus();
      closeMenu();
    }
    function handleMenuClickOutside(e) {
      var _a;
      if (mergedShowRef.value) {
        if (!((_a = triggerRef.value) === null || _a === undefined ? undefined : _a.$el.contains(getPreciseEventTarget(e)))) {
          closeMenu();
        }
      }
    }
    function createClearedMultipleSelectValue(value) {
      if (!Array.isArray(value)) return [];
      if (wrappedFallbackOptionRef.value) {
        return Array.from(value);
      } else {
        const {
          remote
        } = props;
        const {
          value: valOptMap
        } = valOptMapRef;
        if (remote) {
          const {
            value: memoValOptMap
          } = memoValOptMapRef;
          return value.filter((v) => valOptMap.has(v) || memoValOptMap.has(v));
        } else {
          return value.filter((v) => valOptMap.has(v));
        }
      }
    }
    function handleToggleByTmNode(tmNode) {
      handleToggleByOption(tmNode.rawNode);
    }
    function handleToggleByOption(option) {
      if (mergedDisabledRef.value) return;
      const {
        tag,
        remote,
        clearFilterAfterSelect,
        valueField
      } = props;
      if (tag && !remote) {
        const {
          value: beingCreatedOptions
        } = beingCreatedOptionsRef;
        const beingCreatedOption = beingCreatedOptions[0] || null;
        if (beingCreatedOption) {
          const createdOptions = createdOptionsRef.value;
          if (!createdOptions.length) {
            createdOptionsRef.value = [beingCreatedOption];
          } else {
            createdOptions.push(beingCreatedOption);
          }
          beingCreatedOptionsRef.value = emptyArray;
        }
      }
      if (remote) {
        memoValOptMapRef.value.set(option[valueField], option);
      }
      if (props.multiple) {
        const changedValue = createClearedMultipleSelectValue(mergedValueRef.value);
        const index2 = changedValue.findIndex((value) => value === option[valueField]);
        if (~index2) {
          changedValue.splice(index2, 1);
          if (tag && !remote) {
            const createdOptionIndex = getCreatedOptionIndex(option[valueField]);
            if (~createdOptionIndex) {
              createdOptionsRef.value.splice(createdOptionIndex, 1);
              if (clearFilterAfterSelect) patternRef.value = "";
            }
          }
        } else {
          changedValue.push(option[valueField]);
          if (clearFilterAfterSelect) patternRef.value = "";
        }
        doUpdateValue(changedValue, getMergedOptions(changedValue));
      } else {
        if (tag && !remote) {
          const createdOptionIndex = getCreatedOptionIndex(option[valueField]);
          if (~createdOptionIndex) {
            createdOptionsRef.value = [createdOptionsRef.value[createdOptionIndex]];
          } else {
            createdOptionsRef.value = emptyArray;
          }
        }
        focusSelection();
        closeMenu();
        doUpdateValue(option[valueField], option);
      }
    }
    function getCreatedOptionIndex(optionValue) {
      const createdOptions = createdOptionsRef.value;
      return createdOptions.findIndex((createdOption) => createdOption[props.valueField] === optionValue);
    }
    function handlePatternInput(e) {
      if (!mergedShowRef.value) {
        openMenu();
      }
      const {
        value
      } = e.target;
      patternRef.value = value;
      const {
        tag,
        remote
      } = props;
      doSearch(value);
      if (tag && !remote) {
        if (!value) {
          beingCreatedOptionsRef.value = emptyArray;
          return;
        }
        const {
          onCreate
        } = props;
        const optionBeingCreated = onCreate ? onCreate(value) : {
          [props.labelField]: value,
          [props.valueField]: value
        };
        const {
          valueField,
          labelField
        } = props;
        if (compitableOptionsRef.value.some((option) => {
          return option[valueField] === optionBeingCreated[valueField] || option[labelField] === optionBeingCreated[labelField];
        }) || createdOptionsRef.value.some((option) => {
          return option[valueField] === optionBeingCreated[valueField] || option[labelField] === optionBeingCreated[labelField];
        })) {
          beingCreatedOptionsRef.value = emptyArray;
        } else {
          beingCreatedOptionsRef.value = [optionBeingCreated];
        }
      }
    }
    function handleClear(e) {
      e.stopPropagation();
      const {
        multiple
      } = props;
      if (!multiple && props.filterable) {
        closeMenu();
      }
      doClear();
      if (multiple) {
        doUpdateValue([], []);
      } else {
        doUpdateValue(null, null);
      }
    }
    function handleMenuMousedown(e) {
      if (!happensIn(e, "action") && !happensIn(e, "empty") && !happensIn(e, "header")) {
        e.preventDefault();
      }
    }
    function handleMenuScroll(e) {
      doScroll(e);
    }
    function handleKeydown(e) {
      var _a, _b, _c, _d, _e;
      if (!props.keyboard) {
        e.preventDefault();
        return;
      }
      switch (e.key) {
        case " ":
          if (props.filterable) {
            break;
          } else {
            e.preventDefault();
          }
        // eslint-disable-next-line no-fallthrough
        case "Enter":
          if (!((_a = triggerRef.value) === null || _a === undefined ? undefined : _a.isComposing)) {
            if (mergedShowRef.value) {
              const pendingTmNode = (_b = menuRef.value) === null || _b === undefined ? undefined : _b.getPendingTmNode();
              if (pendingTmNode) {
                handleToggleByTmNode(pendingTmNode);
              } else if (!props.filterable) {
                closeMenu();
                focusSelection();
              }
            } else {
              openMenu();
              if (props.tag && activeWithoutMenuOpenRef.value) {
                const beingCreatedOption = beingCreatedOptionsRef.value[0];
                if (beingCreatedOption) {
                  const optionValue = beingCreatedOption[props.valueField];
                  const {
                    value: mergedValue
                  } = mergedValueRef;
                  if (props.multiple) {
                    if (Array.isArray(mergedValue) && mergedValue.includes(optionValue)) ;
                    else {
                      handleToggleByOption(beingCreatedOption);
                    }
                  } else {
                    handleToggleByOption(beingCreatedOption);
                  }
                }
              }
            }
          }
          e.preventDefault();
          break;
        case "ArrowUp":
          e.preventDefault();
          if (props.loading) return;
          if (mergedShowRef.value) {
            (_c = menuRef.value) === null || _c === undefined ? undefined : _c.prev();
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (props.loading) return;
          if (mergedShowRef.value) {
            (_d = menuRef.value) === null || _d === undefined ? undefined : _d.next();
          } else {
            openMenu();
          }
          break;
        case "Escape":
          if (mergedShowRef.value) {
            markEventEffectPerformed(e);
            closeMenu();
          }
          (_e = triggerRef.value) === null || _e === undefined ? undefined : _e.focus();
          break;
      }
    }
    function focusSelection() {
      var _a;
      (_a = triggerRef.value) === null || _a === undefined ? undefined : _a.focus();
    }
    function focusSelectionInput() {
      var _a;
      (_a = triggerRef.value) === null || _a === undefined ? undefined : _a.focusInput();
    }
    function handleTriggerOrMenuResize() {
      var _a;
      if (!mergedShowRef.value) return;
      (_a = followerRef.value) === null || _a === undefined ? undefined : _a.syncPosition();
    }
    updateMemorizedOptions();
    watch(toRef(props, "options"), updateMemorizedOptions);
    const exposedMethods = {
      focus: () => {
        var _a;
        (_a = triggerRef.value) === null || _a === undefined ? undefined : _a.focus();
      },
      focusInput: () => {
        var _a;
        (_a = triggerRef.value) === null || _a === undefined ? undefined : _a.focusInput();
      },
      blur: () => {
        var _a;
        (_a = triggerRef.value) === null || _a === undefined ? undefined : _a.blur();
      },
      blurInput: () => {
        var _a;
        (_a = triggerRef.value) === null || _a === undefined ? undefined : _a.blurInput();
      }
    };
    const cssVarsRef = computed(() => {
      const {
        self: {
          menuBoxShadow
        }
      } = themeRef.value;
      return {
        "--n-menu-box-shadow": menuBoxShadow
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("select", undefined, cssVarsRef, props) : undefined;
    return Object.assign(Object.assign({}, exposedMethods), {
      mergedStatus: mergedStatusRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedBordered: mergedBorderedRef,
      namespace: namespaceRef,
      treeMate: treeMateRef,
      isMounted: useIsMounted(),
      triggerRef,
      menuRef,
      pattern: patternRef,
      uncontrolledShow: uncontrolledShowRef,
      mergedShow: mergedShowRef,
      adjustedTo: useAdjustedTo(props),
      uncontrolledValue: uncontrolledValueRef,
      mergedValue: mergedValueRef,
      followerRef,
      localizedPlaceholder: localizedPlaceholderRef,
      selectedOption: selectedOptionRef,
      selectedOptions: selectedOptionsRef,
      mergedSize: mergedSizeRef,
      mergedDisabled: mergedDisabledRef,
      focused: focusedRef,
      activeWithoutMenuOpen: activeWithoutMenuOpenRef,
      inlineThemeDisabled,
      onTriggerInputFocus,
      onTriggerInputBlur,
      handleTriggerOrMenuResize,
      handleMenuFocus,
      handleMenuBlur,
      handleMenuTabOut,
      handleTriggerClick,
      handleToggle: handleToggleByTmNode,
      handleDeleteOption: handleToggleByOption,
      handlePatternInput,
      handleClear,
      handleTriggerBlur,
      handleTriggerFocus,
      handleKeydown,
      handleMenuAfterLeave,
      handleMenuClickOutside,
      handleMenuScroll,
      handleMenuKeydown: handleKeydown,
      handleMenuMousedown,
      mergedTheme: themeRef,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    });
  },
  render() {
    return h("div", {
      class: `${this.mergedClsPrefix}-select`
    }, h(VBinder, null, {
      default: () => [h(VTarget, null, {
        default: () => h(NInternalSelection, {
          ref: "triggerRef",
          inlineThemeDisabled: this.inlineThemeDisabled,
          status: this.mergedStatus,
          inputProps: this.inputProps,
          clsPrefix: this.mergedClsPrefix,
          showArrow: this.showArrow,
          maxTagCount: this.maxTagCount,
          ellipsisTagPopoverProps: this.ellipsisTagPopoverProps,
          bordered: this.mergedBordered,
          active: this.activeWithoutMenuOpen || this.mergedShow,
          pattern: this.pattern,
          placeholder: this.localizedPlaceholder,
          selectedOption: this.selectedOption,
          selectedOptions: this.selectedOptions,
          multiple: this.multiple,
          renderTag: this.renderTag,
          renderLabel: this.renderLabel,
          filterable: this.filterable,
          clearable: this.clearable,
          disabled: this.mergedDisabled,
          size: this.mergedSize,
          theme: this.mergedTheme.peers.InternalSelection,
          labelField: this.labelField,
          valueField: this.valueField,
          themeOverrides: this.mergedTheme.peerOverrides.InternalSelection,
          loading: this.loading,
          focused: this.focused,
          onClick: this.handleTriggerClick,
          onDeleteOption: this.handleDeleteOption,
          onPatternInput: this.handlePatternInput,
          onClear: this.handleClear,
          onBlur: this.handleTriggerBlur,
          onFocus: this.handleTriggerFocus,
          onKeydown: this.handleKeydown,
          onPatternBlur: this.onTriggerInputBlur,
          onPatternFocus: this.onTriggerInputFocus,
          onResize: this.handleTriggerOrMenuResize,
          ignoreComposition: this.ignoreComposition
        }, {
          arrow: () => {
            var _a, _b;
            return [(_b = (_a = this.$slots).arrow) === null || _b === undefined ? undefined : _b.call(_a)];
          }
        })
      }), h(VFollower, {
        ref: "followerRef",
        show: this.mergedShow,
        to: this.adjustedTo,
        teleportDisabled: this.adjustedTo === useAdjustedTo.tdkey,
        containerClass: this.namespace,
        width: this.consistentMenuWidth ? "target" : undefined,
        minWidth: "target",
        placement: this.placement
      }, {
        default: () => h(Transition, {
          name: "fade-in-scale-up-transition",
          appear: this.isMounted,
          onAfterLeave: this.handleMenuAfterLeave
        }, {
          default: () => {
            var _a, _b, _c;
            if (!(this.mergedShow || this.displayDirective === "show")) {
              return null;
            }
            (_a = this.onRender) === null || _a === undefined ? undefined : _a.call(this);
            return withDirectives(h(NInternalSelectMenu, Object.assign({}, this.menuProps, {
              ref: "menuRef",
              onResize: this.handleTriggerOrMenuResize,
              inlineThemeDisabled: this.inlineThemeDisabled,
              virtualScroll: this.consistentMenuWidth && this.virtualScroll,
              class: [`${this.mergedClsPrefix}-select-menu`, this.themeClass, (_b = this.menuProps) === null || _b === undefined ? undefined : _b.class],
              clsPrefix: this.mergedClsPrefix,
              focusable: true,
              labelField: this.labelField,
              valueField: this.valueField,
              autoPending: true,
              nodeProps: this.nodeProps,
              theme: this.mergedTheme.peers.InternalSelectMenu,
              themeOverrides: this.mergedTheme.peerOverrides.InternalSelectMenu,
              treeMate: this.treeMate,
              multiple: this.multiple,
              size: this.menuSize,
              renderOption: this.renderOption,
              renderLabel: this.renderLabel,
              value: this.mergedValue,
              style: [(_c = this.menuProps) === null || _c === undefined ? undefined : _c.style, this.cssVars],
              onToggle: this.handleToggle,
              onScroll: this.handleMenuScroll,
              onFocus: this.handleMenuFocus,
              onBlur: this.handleMenuBlur,
              onKeydown: this.handleMenuKeydown,
              onTabOut: this.handleMenuTabOut,
              onMousedown: this.handleMenuMousedown,
              show: this.mergedShow,
              showCheckmark: this.showCheckmark,
              resetMenuOnOptionsChange: this.resetMenuOnOptionsChange
            }), {
              empty: () => {
                var _a2, _b2;
                return [(_b2 = (_a2 = this.$slots).empty) === null || _b2 === undefined ? undefined : _b2.call(_a2)];
              },
              header: () => {
                var _a2, _b2;
                return [(_b2 = (_a2 = this.$slots).header) === null || _b2 === undefined ? undefined : _b2.call(_a2)];
              },
              action: () => {
                var _a2, _b2;
                return [(_b2 = (_a2 = this.$slots).action) === null || _b2 === undefined ? undefined : _b2.call(_a2)];
              }
            }), this.displayDirective === "show" ? [[vShow, this.mergedShow], [clickoutside, this.handleMenuClickOutside, undefined, {
              capture: true
            }]] : [[clickoutside, this.handleMenuClickOutside, undefined, {
              capture: true
            }]]);
          }
        })
      })]
    }));
  }
});
function useDialog() {
  const dialog = inject(dialogApiInjectionKey, null);
  if (dialog === null) {
    throwError("use-dialog", "No outer <n-dialog-provider /> founded.");
  }
  return dialog;
}
function self$1() {
  return commonVars$3;
}
const flexLight = {
  self: self$1
};
const flexProps = Object.assign(Object.assign({}, useTheme.props), {
  align: String,
  justify: {
    type: String,
    default: "start"
  },
  inline: Boolean,
  vertical: Boolean,
  reverse: Boolean,
  size: {
    type: [String, Number, Array],
    default: "medium"
  },
  wrap: {
    type: Boolean,
    default: true
  }
});
const __unplugin_components_1 = defineComponent({
  name: "Flex",
  props: flexProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef
    } = useConfig(props);
    const themeRef = useTheme("Flex", "-flex", undefined, flexLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("Flex", mergedRtlRef, mergedClsPrefixRef);
    return {
      rtlEnabled: rtlEnabledRef,
      mergedClsPrefix: mergedClsPrefixRef,
      margin: computed(() => {
        const {
          size
        } = props;
        if (Array.isArray(size)) {
          return {
            horizontal: size[0],
            vertical: size[1]
          };
        }
        if (typeof size === "number") {
          return {
            horizontal: size,
            vertical: size
          };
        }
        const {
          self: {
            [createKey("gap", size)]: gap
          }
        } = themeRef.value;
        const {
          row,
          col
        } = getGap(gap);
        return {
          horizontal: depx(col),
          vertical: depx(row)
        };
      })
    };
  },
  render() {
    const {
      vertical,
      reverse,
      align,
      inline,
      justify,
      margin,
      wrap,
      mergedClsPrefix,
      rtlEnabled
    } = this;
    const children = flatten(getSlot(this), false);
    if (!children.length) return null;
    return h("div", {
      role: "none",
      class: [`${mergedClsPrefix}-flex`, rtlEnabled && `${mergedClsPrefix}-flex--rtl`],
      style: {
        display: inline ? "inline-flex" : "flex",
        flexDirection: (() => {
          if (vertical && !reverse) return "column";
          if (vertical && reverse) return "column-reverse";
          if (!vertical && reverse) return "row-reverse";
          else return "row";
        })(),
        justifyContent: justify,
        flexWrap: !wrap || vertical ? "nowrap" : "wrap",
        alignItems: align,
        gap: `${margin.vertical}px ${margin.horizontal}px`
      }
    }, children);
  }
});
function self(vars) {
  const {
    primaryColor,
    successColor,
    warningColor,
    errorColor,
    infoColor,
    fontWeightStrong
  } = vars;
  return {
    fontWeight: fontWeightStrong,
    rotate: "252deg",
    colorStartPrimary: changeColor(primaryColor, {
      alpha: 0.6
    }),
    colorEndPrimary: primaryColor,
    colorStartInfo: changeColor(infoColor, {
      alpha: 0.6
    }),
    colorEndInfo: infoColor,
    colorStartWarning: changeColor(warningColor, {
      alpha: 0.6
    }),
    colorEndWarning: warningColor,
    colorStartError: changeColor(errorColor, {
      alpha: 0.6
    }),
    colorEndError: errorColor,
    colorStartSuccess: changeColor(successColor, {
      alpha: 0.6
    }),
    colorEndSuccess: successColor
  };
}
const gradientTextLight = {
  common: derived,
  self
};
const style = cB("gradient-text", `
 display: inline-block;
 font-weight: var(--n-font-weight);
 -webkit-background-clip: text;
 background-clip: text;
 color: #0000;
 white-space: nowrap;
 background-image: linear-gradient(var(--n-rotate), var(--n-color-start) 0%, var(--n-color-end) 100%);
 transition:
 --n-color-start .3s var(--n-bezier),
 --n-color-end .3s var(--n-bezier);
`);
const gradientTextProps = Object.assign(Object.assign({}, useTheme.props), {
  size: [String, Number],
  fontSize: [String, Number],
  type: {
    type: String,
    default: "primary"
  },
  color: [Object, String],
  gradient: [Object, String]
});
const __unplugin_components_2 = defineComponent({
  name: "GradientText",
  props: gradientTextProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const compatibleTypeRef = computed(() => {
      const {
        type
      } = props;
      if (type === "danger") return "error";
      return type;
    });
    const styleFontSizeRef = computed(() => {
      let fontSize = props.size || props.fontSize;
      if (fontSize) fontSize = formatLength(fontSize);
      return fontSize || undefined;
    });
    const styleBgImageRef = computed(() => {
      const gradient = props.color || props.gradient;
      if (typeof gradient === "string") {
        return gradient;
      } else if (gradient) {
        const deg = gradient.deg || 0;
        const from = gradient.from;
        const to = gradient.to;
        return `linear-gradient(${deg}deg, ${from} 0%, ${to} 100%)`;
      }
      return undefined;
    });
    const themeRef = useTheme("GradientText", "-gradient-text", style, gradientTextLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        value: type
      } = compatibleTypeRef;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          rotate,
          [createKey("colorStart", type)]: colorStart,
          [createKey("colorEnd", type)]: colorEnd,
          fontWeight
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-rotate": rotate,
        "--n-color-start": colorStart,
        "--n-color-end": colorEnd,
        "--n-font-weight": fontWeight
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("gradient-text", computed(() => compatibleTypeRef.value[0]), cssVarsRef, props) : undefined;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      compatibleType: compatibleTypeRef,
      styleFontSize: styleFontSizeRef,
      styleBgImage: styleBgImageRef,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix,
      onRender
    } = this;
    onRender === null || onRender === undefined ? undefined : onRender();
    return h("span", {
      class: [`${mergedClsPrefix}-gradient-text`, `${mergedClsPrefix}-gradient-text--${this.compatibleType}-type`, this.themeClass],
      style: [{
        fontSize: this.styleFontSize,
        backgroundImage: this.styleBgImage
      }, this.cssVars]
    }, this.$slots);
  }
});
const queryLanguageStore = defineStore({
  id: "query",
  state: () => ({
    selected: {
      label: null,
      value: null
    }
  }),
  actions: {
    getQueryLanguage() {
      return this.selected;
    },
    setQueryLanguage(queryLanguage) {
      this.selected = queryLanguage;
    }
  }
});
var DatabaseEngines = /* @__PURE__ */ ((DatabaseEngines2) => {
  DatabaseEngines2["SQL"] = "sql";
  DatabaseEngines2["BIGQUERY"] = "bigquery";
  DatabaseEngines2["DB2"] = "db2";
  DatabaseEngines2["DB2I"] = "db2i";
  DatabaseEngines2["HIVE"] = "hive";
  DatabaseEngines2["MARIADB"] = "mariadb";
  DatabaseEngines2["MYSQL"] = "mysql";
  DatabaseEngines2["TIDB"] = "tidb";
  DatabaseEngines2["N1QL"] = "n1ql";
  DatabaseEngines2["PLSQL"] = "plsql";
  DatabaseEngines2["POSTGRESQL"] = "postgresql";
  DatabaseEngines2["REDSHIFT"] = "redshift";
  DatabaseEngines2["SINGLESTOREDB"] = "singlestoredb";
  DatabaseEngines2["SNOWFLAKE"] = "snowflake";
  DatabaseEngines2["SPARK"] = "spark";
  DatabaseEngines2["SQLITE"] = "sqlite";
  DatabaseEngines2["TRANSACTSQL"] = "transactsql";
  DatabaseEngines2["TRINO"] = "trino";
  DatabaseEngines2["TSQL"] = "tsql";
  return DatabaseEngines2;
})(DatabaseEngines || {});
const databaseOptions = [
  { label: "Standard SQL", value: DatabaseEngines.SQL },
  { label: "GCP BigQuery", value: DatabaseEngines.BIGQUERY },
  { label: "IBM DB2", value: DatabaseEngines.DB2 },
  { label: "IBM DB2i (experimental)", value: DatabaseEngines.DB2I },
  { label: "Apache Hive", value: DatabaseEngines.HIVE },
  { label: "MariaDB", value: DatabaseEngines.MARIADB },
  { label: "MySQL", value: DatabaseEngines.MYSQL },
  { label: "TiDB", value: DatabaseEngines.TIDB },
  { label: "Couchbase N1QL", value: DatabaseEngines.N1QL },
  { label: "Oracle PL/SQL", value: DatabaseEngines.PLSQL },
  { label: "PostgreSQL", value: DatabaseEngines.POSTGRESQL },
  { label: "Amazon Redshift", value: DatabaseEngines.REDSHIFT },
  { label: "SingleStoreDB", value: DatabaseEngines.SINGLESTOREDB },
  { label: "Snowflake", value: DatabaseEngines.SNOWFLAKE },
  { label: "Spark", value: DatabaseEngines.SPARK },
  { label: "SQLite", value: DatabaseEngines.SQLITE },
  { label: "SQL Server Transact-SQL", value: DatabaseEngines.TRANSACTSQL },
  { label: "Trino", value: DatabaseEngines.TRINO }
];
const _sfc_main$2 = defineComponent({
  setup() {
    const selectedOption = ref(null);
    const store = queryLanguageStore();
    const options = databaseOptions;
    const handleSelectChange = (newValue) => {
      const selected = options.filter((item) => item.value == newValue);
      store.setQueryLanguage(selected[0]);
    };
    return {
      selectedOption,
      options,
      handleSelectChange
    };
  }
});
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_n_space = __unplugin_components_2$1;
  const _component_n_select = __unplugin_components_1$1;
  _push(ssrRenderComponent(_component_n_space, mergeProps({ vertical: "" }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_n_select, {
          size: "large",
          value: _ctx.selectedOption,
          "onUpdate:value": [($event) => _ctx.selectedOption = $event, _ctx.handleSelectChange],
          options: _ctx.options,
          "value-field": "value",
          "label-field": "label",
          "key-field": "value"
        }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_n_select, {
            size: "large",
            value: _ctx.selectedOption,
            "onUpdate:value": [($event) => _ctx.selectedOption = $event, _ctx.handleSelectChange],
            options: _ctx.options,
            "value-field": "value",
            "label-field": "label",
            "key-field": "value"
          }, null, 8, ["value", "onUpdate:value", "options"])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SelectSql.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : undefined;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$1 = defineComponent({
  props: {
    content: {
      type: Object
    }
  },
  directives: {
    prism: {
      mounted() {
      }
    }
  },
  setup(props) {
    const loadHighLight = () => {
      setTimeout(() => {
      }, 50);
    };
    const content = computed(() => {
      var _a, _b;
      loadHighLight();
      return {
        text: (_a = props.content) == null ? undefined : _a.text,
        type: (_b = props.content) == null ? undefined : _b.type
      };
    });
    return {
      content
    };
  }
});
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_n_space = __unplugin_components_2$1;
  _push(ssrRenderComponent(_component_n_space, mergeProps({ vertical: "" }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div data-v-c7efc2be${_scopeId}><pre data-v-c7efc2be${_scopeId}><code id="code" class="${ssrRenderClass(`language-${_ctx.content.type}`)}" data-v-c7efc2be${_scopeId}>
            ${ssrInterpolate(_ctx.content.text || "Ex:  select yousql from here;")}
            </code></pre></div>`);
      } else {
        return [
          createVNode("div", null, [
            createVNode("pre", null, [
              createVNode("code", {
                id: "code",
                class: `language-${_ctx.content.type}`
              }, "\n            " + toDisplayString(_ctx.content.text || "Ex:  select yousql from here;") + "\n            ", 3)
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TextAreaCode.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : undefined;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-c7efc2be"]]);
const converter = async (content, queryLanguage) => {
  var _a;
  try {
    const { data, error } = await useFetch("/converter", {
      method: "POST",
      body: { content, queryLanguage }
    }, "$oyZYVn75Gm");
    if (error.value) {
      console.error("Erro na API:", error.value);
      return {
        status: false,
        message: JSON.stringify(error.value)
      };
    }
    return {
      status: true,
      message: (_a = data.value) == null ? void 0 : _a.data
    };
  } catch (err) {
    console.error("Erro ao consumir API:", err);
    return {
      status: false,
      message: "Internal error"
    };
  }
};
const contentStore = defineStore({
  id: "content",
  state: () => ({
    response: {
      status: false,
      message: ""
    }
  }),
  actions: {
    async getResponse(content, queryLanguage) {
      const response = await converter(content, queryLanguage);
      this.response = response;
    }
  }
});
const _sfc_main = defineComponent({
  components: {
    TextAreaCode: __nuxt_component_1,
    SelectSql: __nuxt_component_0
  },
  setup() {
    const prompt = ref("");
    const response = ref("");
    const loading = ref(false);
    const store = contentStore();
    const queryStory = queryLanguageStore();
    const dialog = useDialog();
    const convert = async () => {
      var _a;
      const inputTextUpper = prompt.value.toUpperCase();
      if (!inputTextUpper) return dialog.info({
        title: "Aten\xE7\xE3o",
        content: "\xC9 necess\xE1rio iformar um sql v\xE1lido",
        positiveText: "OK"
      });
      const querySelected = queryStory.getQueryLanguage();
      if (!querySelected.value || !querySelected.label) return dialog.info({
        title: "Aten\xE7\xE3o",
        content: "\xC9 necess\xE1rio iformar uma liguagem",
        positiveText: "OK"
      });
      loading.value = true;
      await store.getResponse(inputTextUpper, querySelected.label);
      const newQuery = store.response;
      if (!newQuery.status) return dialog.info({
        title: "Aten\xE7\xE3o",
        content: newQuery.message,
        positiveText: "OK"
      });
      response.value = format((_a = newQuery.message.trim()) != null ? _a : "", { language: querySelected.value || DatabaseEngines.SQL, tabWidth: 2, keywordCase: "upper", linesBetweenQueries: 2 });
      loading.value = false;
    };
    return {
      prompt,
      convert,
      response,
      loading
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_n_space = __unplugin_components_2$1;
  const _component_n_flex = __unplugin_components_1;
  const _component_n_gradient_text = __unplugin_components_2;
  const _component_SelectSql = __nuxt_component_0;
  const _component_n_input = __unplugin_components_3;
  const _component_n_button = Button;
  const _component_TextAreaCode = __nuxt_component_1;
  _push(ssrRenderComponent(_component_n_space, mergeProps({
    vertical: "",
    class: "p25"
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_n_flex, { justify: "space-around" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div class="w-50" data-v-126978dd${_scopeId2}>`);
              _push3(ssrRenderComponent(_component_n_gradient_text, {
                gradient: "linear-gradient(90deg, red 0%, green 50%, blue 100%)",
                class: "mb3"
              }, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(` Convert query to: `);
                  } else {
                    return [
                      createTextVNode(" Convert query to: ")
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
              _push3(ssrRenderComponent(_component_SelectSql, null, null, _parent3, _scopeId2));
              _push3(`</div>`);
            } else {
              return [
                createVNode("div", { class: "w-50" }, [
                  createVNode(_component_n_gradient_text, {
                    gradient: "linear-gradient(90deg, red 0%, green 50%, blue 100%)",
                    class: "mb3"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Convert query to: ")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_SelectSql)
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_n_flex, {
          class: "mt10",
          justify: "space-around",
          align: "center"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div class="w-card-input" data-v-126978dd${_scopeId2}>`);
              _push3(ssrRenderComponent(_component_n_space, { vertical: "" }, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent(_component_n_input, {
                      "h-lg": "",
                      type: "textarea",
                      placeholder: "Digite ou cole seu sql aqui",
                      autosize: {
                        minRows: 3
                      },
                      value: _ctx.prompt,
                      "onUpdate:value": ($event) => _ctx.prompt = $event
                    }, null, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode(_component_n_input, {
                        "h-lg": "",
                        type: "textarea",
                        placeholder: "Digite ou cole seu sql aqui",
                        autosize: {
                          minRows: 3
                        },
                        value: _ctx.prompt,
                        "onUpdate:value": ($event) => _ctx.prompt = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
              _push3(`</div>`);
              _push3(ssrRenderComponent(_component_n_button, {
                onClick: _ctx.convert,
                loading: _ctx.loading,
                type: "success"
              }, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(`Converter`);
                  } else {
                    return [
                      createTextVNode("Converter")
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
              _push3(`<div class="w-card-input" data-v-126978dd${_scopeId2}>`);
              _push3(ssrRenderComponent(_component_TextAreaCode, {
                content: { text: _ctx.response, type: "sql" }
              }, null, _parent3, _scopeId2));
              _push3(`</div>`);
            } else {
              return [
                createVNode("div", { class: "w-card-input" }, [
                  createVNode(_component_n_space, { vertical: "" }, {
                    default: withCtx(() => [
                      createVNode(_component_n_input, {
                        "h-lg": "",
                        type: "textarea",
                        placeholder: "Digite ou cole seu sql aqui",
                        autosize: {
                          minRows: 3
                        },
                        value: _ctx.prompt,
                        "onUpdate:value": ($event) => _ctx.prompt = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode(_component_n_button, {
                  onClick: _ctx.convert,
                  loading: _ctx.loading,
                  type: "success"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Converter")
                  ]),
                  _: 1
                }, 8, ["onClick", "loading"]),
                createVNode("div", { class: "w-card-input" }, [
                  createVNode(_component_TextAreaCode, {
                    content: { text: _ctx.response, type: "sql" }
                  }, null, 8, ["content"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_n_flex, { justify: "space-around" }, {
            default: withCtx(() => [
              createVNode("div", { class: "w-50" }, [
                createVNode(_component_n_gradient_text, {
                  gradient: "linear-gradient(90deg, red 0%, green 50%, blue 100%)",
                  class: "mb3"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Convert query to: ")
                  ]),
                  _: 1
                }),
                createVNode(_component_SelectSql)
              ])
            ]),
            _: 1
          }),
          createVNode(_component_n_flex, {
            class: "mt10",
            justify: "space-around",
            align: "center"
          }, {
            default: withCtx(() => [
              createVNode("div", { class: "w-card-input" }, [
                createVNode(_component_n_space, { vertical: "" }, {
                  default: withCtx(() => [
                    createVNode(_component_n_input, {
                      "h-lg": "",
                      type: "textarea",
                      placeholder: "Digite ou cole seu sql aqui",
                      autosize: {
                        minRows: 3
                      },
                      value: _ctx.prompt,
                      "onUpdate:value": ($event) => _ctx.prompt = $event
                    }, null, 8, ["value", "onUpdate:value"])
                  ]),
                  _: 1
                })
              ]),
              createVNode(_component_n_button, {
                onClick: _ctx.convert,
                loading: _ctx.loading,
                type: "success"
              }, {
                default: withCtx(() => [
                  createTextVNode("Converter")
                ]),
                _: 1
              }, 8, ["onClick", "loading"]),
              createVNode("div", { class: "w-card-input" }, [
                createVNode(_component_TextAreaCode, {
                  content: { text: _ctx.response, type: "sql" }
                }, null, 8, ["content"])
              ])
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-126978dd"]]);

export { index as default };
//# sourceMappingURL=index-BYP4SMMt.mjs.map
