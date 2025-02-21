import { mergeProps, withCtx, defineComponent, createTextVNode, createVNode, renderSlot, h, ref, provide, computed, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc, a9 as Button, S as Scrollbar, y as useConfig, z as useTheme, ac as createTheme, o as cB, h as createInjectionKey, C as useThemeClass, aa as warn, ab as iconLight, ae as typographyLight, B as createKey, ad as scrollbarLight, U as derived, E as cM, q as c } from './server.mjs';
import { composite } from 'seemly';
import { _ as __unplugin_components_2, f as formatLength } from './Space-Bo1T0CPB.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'pinia';
import 'vue-router';
import '@css-render/vue3-ssr';
import 'prismjs';
import 'lodash-es';
import '@css-render/plugin-bem';
import 'css-render';
import 'vooks';
import 'vdirs';
import 'vueuc';
import 'evtd';

const style$4 = cB("icon", `
 height: 1em;
 width: 1em;
 line-height: 1em;
 text-align: center;
 display: inline-block;
 position: relative;
 fill: currentColor;
 transform: translateZ(0);
`, [cM("color-transition", {
  transition: "color .3s var(--n-bezier)"
}), cM("depth", {
  color: "var(--n-color)"
}, [c("svg", {
  opacity: "var(--n-opacity)",
  transition: "opacity .3s var(--n-bezier)"
})]), c("svg", {
  height: "1em",
  width: "1em"
})]);
const iconProps = Object.assign(Object.assign({}, useTheme.props), {
  depth: [String, Number],
  size: [Number, String],
  color: String,
  component: [Object, Function]
});
const NIcon = defineComponent({
  _n_icon__: true,
  name: "Icon",
  inheritAttrs: false,
  props: iconProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Icon", "-icon", style$4, iconLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        depth
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: self2
      } = themeRef.value;
      if (depth !== undefined) {
        const {
          color,
          [`opacity${depth}Depth`]: opacity
        } = self2;
        return {
          "--n-bezier": cubicBezierEaseInOut,
          "--n-color": color,
          "--n-opacity": opacity
        };
      }
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-color": "",
        "--n-opacity": ""
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("icon", computed(() => `${props.depth || "d"}`), cssVarsRef, props) : undefined;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedStyle: computed(() => {
        const {
          size,
          color
        } = props;
        return {
          fontSize: formatLength(size),
          color
        };
      }),
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    };
  },
  render() {
    var _a;
    const {
      $parent,
      depth,
      mergedClsPrefix,
      component,
      onRender,
      themeClass
    } = this;
    if ((_a = $parent === null || $parent === undefined ? undefined : $parent.$options) === null || _a === undefined ? undefined : _a._n_icon__) {
      warn("icon", "don't wrap `n-icon` inside `n-icon`");
    }
    onRender === null || onRender === undefined ? undefined : onRender();
    return h("i", mergeProps(this.$attrs, {
      role: "img",
      class: [`${mergedClsPrefix}-icon`, themeClass, {
        [`${mergedClsPrefix}-icon--depth`]: depth,
        [`${mergedClsPrefix}-icon--color-transition`]: depth !== undefined
      }],
      style: [this.cssVars, this.mergedStyle]
    }), component ? h(component) : this.$slots);
  }
});
function self(vars) {
  const {
    baseColor,
    textColor2,
    bodyColor,
    cardColor,
    dividerColor,
    actionColor,
    scrollbarColor,
    scrollbarColorHover,
    invertedColor
  } = vars;
  return {
    textColor: textColor2,
    textColorInverted: "#FFF",
    color: bodyColor,
    colorEmbedded: actionColor,
    headerColor: cardColor,
    headerColorInverted: invertedColor,
    footerColor: actionColor,
    footerColorInverted: invertedColor,
    headerBorderColor: dividerColor,
    headerBorderColorInverted: invertedColor,
    footerBorderColor: dividerColor,
    footerBorderColorInverted: invertedColor,
    siderBorderColor: dividerColor,
    siderBorderColorInverted: invertedColor,
    siderColor: cardColor,
    siderColorInverted: invertedColor,
    siderToggleButtonBorder: `1px solid ${dividerColor}`,
    siderToggleButtonColor: baseColor,
    siderToggleButtonIconColor: textColor2,
    siderToggleButtonIconColorInverted: textColor2,
    siderToggleBarColor: composite(bodyColor, scrollbarColor),
    siderToggleBarColorHover: composite(bodyColor, scrollbarColorHover),
    // hack for inverted background
    __invertScrollbar: "true"
  };
}
const layoutLight = createTheme({
  name: "Layout",
  common: derived,
  peers: {
    Scrollbar: scrollbarLight
  },
  self
});
const positionProp = {
  type: String,
  default: "static"
};
const style$3 = cB("layout", `
 color: var(--n-text-color);
 background-color: var(--n-color);
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 flex: auto;
 overflow: hidden;
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
`, [cB("layout-scroll-container", `
 overflow-x: hidden;
 box-sizing: border-box;
 height: 100%;
 `), cM("absolute-positioned", `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]);
const layoutProps = {
  embedded: Boolean,
  position: positionProp,
  nativeScrollbar: {
    type: Boolean,
    default: true
  },
  scrollbarProps: Object,
  onScroll: Function,
  contentClass: String,
  contentStyle: {
    type: [String, Object],
    default: ""
  },
  hasSider: Boolean,
  siderPlacement: {
    type: String,
    default: "left"
  }
};
const layoutInjectionKey = createInjectionKey("n-layout");
function createLayoutComponent(isContent) {
  return defineComponent({
    name: isContent ? "LayoutContent" : "Layout",
    props: Object.assign(Object.assign({}, useTheme.props), layoutProps),
    setup(props) {
      const scrollableElRef = ref(null);
      const scrollbarInstRef = ref(null);
      const {
        mergedClsPrefixRef,
        inlineThemeDisabled
      } = useConfig(props);
      const themeRef = useTheme("Layout", "-layout", style$3, layoutLight, props, mergedClsPrefixRef);
      function scrollTo(options, y) {
        if (props.nativeScrollbar) {
          const {
            value: scrollableEl
          } = scrollableElRef;
          if (scrollableEl) {
            if (y === undefined) {
              scrollableEl.scrollTo(options);
            } else {
              scrollableEl.scrollTo(options, y);
            }
          }
        } else {
          const {
            value: scrollbarInst
          } = scrollbarInstRef;
          if (scrollbarInst) {
            scrollbarInst.scrollTo(options, y);
          }
        }
      }
      provide(layoutInjectionKey, props);
      const handleNativeElScroll = (e) => {
        var _a;
        const target = e.target;
        target.scrollLeft;
        target.scrollTop;
        (_a = props.onScroll) === null || _a === undefined ? undefined : _a.call(props, e);
      };
      const hasSiderStyle = {
        display: "flex",
        flexWrap: "nowrap",
        width: "100%",
        flexDirection: "row"
      };
      const exposedMethods = {
        scrollTo
      };
      const cssVarsRef = computed(() => {
        const {
          common: {
            cubicBezierEaseInOut
          },
          self: self2
        } = themeRef.value;
        return {
          "--n-bezier": cubicBezierEaseInOut,
          "--n-color": props.embedded ? self2.colorEmbedded : self2.color,
          "--n-text-color": self2.textColor
        };
      });
      const themeClassHandle = inlineThemeDisabled ? useThemeClass("layout", computed(() => {
        return props.embedded ? "e" : "";
      }), cssVarsRef, props) : undefined;
      return Object.assign({
        mergedClsPrefix: mergedClsPrefixRef,
        scrollableElRef,
        scrollbarInstRef,
        hasSiderStyle,
        mergedTheme: themeRef,
        handleNativeElScroll,
        cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
        themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
        onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
      }, exposedMethods);
    },
    render() {
      var _a;
      const {
        mergedClsPrefix,
        hasSider
      } = this;
      (_a = this.onRender) === null || _a === undefined ? undefined : _a.call(this);
      const hasSiderStyle = hasSider ? this.hasSiderStyle : undefined;
      const layoutClass = [this.themeClass, isContent && `${mergedClsPrefix}-layout-content`, `${mergedClsPrefix}-layout`, `${mergedClsPrefix}-layout--${this.position}-positioned`];
      return h("div", {
        class: layoutClass,
        style: this.cssVars
      }, this.nativeScrollbar ? h("div", {
        ref: "scrollableElRef",
        class: [`${mergedClsPrefix}-layout-scroll-container`, this.contentClass],
        style: [this.contentStyle, hasSiderStyle],
        onScroll: this.handleNativeElScroll
      }, this.$slots) : h(Scrollbar, Object.assign({}, this.scrollbarProps, {
        onScroll: this.onScroll,
        ref: "scrollbarInstRef",
        theme: this.mergedTheme.peers.Scrollbar,
        themeOverrides: this.mergedTheme.peerOverrides.Scrollbar,
        contentClass: this.contentClass,
        contentStyle: [this.contentStyle, hasSiderStyle]
      }), this.$slots));
    }
  });
}
const __unplugin_components_0 = createLayoutComponent(false);
const __unplugin_components_6 = createLayoutComponent(true);
const style$2 = cB("layout-footer", `
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 color: var(--n-text-color);
 background-color: var(--n-color);
 box-sizing: border-box;
`, [cM("absolute-positioned", `
 position: absolute;
 left: 0;
 right: 0;
 bottom: 0;
 `), cM("bordered", `
 border-top: solid 1px var(--n-border-color);
 `)]);
const layoutFooterProps = Object.assign(Object.assign({}, useTheme.props), {
  inverted: Boolean,
  position: positionProp,
  bordered: Boolean
});
const __unplugin_components_7 = defineComponent({
  name: "LayoutFooter",
  props: layoutFooterProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Layout", "-layout-footer", style$2, layoutLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: self2
      } = themeRef.value;
      const vars = {
        "--n-bezier": cubicBezierEaseInOut
      };
      if (props.inverted) {
        vars["--n-color"] = self2.footerColorInverted;
        vars["--n-text-color"] = self2.textColorInverted;
        vars["--n-border-color"] = self2.footerBorderColorInverted;
      } else {
        vars["--n-color"] = self2.footerColor;
        vars["--n-text-color"] = self2.textColor;
        vars["--n-border-color"] = self2.footerBorderColor;
      }
      return vars;
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("layout-footer", computed(() => props.inverted ? "a" : "b"), cssVarsRef, props) : undefined;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    };
  },
  render() {
    var _a;
    const {
      mergedClsPrefix
    } = this;
    (_a = this.onRender) === null || _a === undefined ? undefined : _a.call(this);
    return h("div", {
      class: [`${mergedClsPrefix}-layout-footer`, this.themeClass, this.position && `${mergedClsPrefix}-layout-footer--${this.position}-positioned`, this.bordered && `${mergedClsPrefix}-layout-footer--bordered`],
      style: this.cssVars
    }, this.$slots);
  }
});
const style$1 = cB("layout-header", `
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 box-sizing: border-box;
 width: 100%;
 background-color: var(--n-color);
 color: var(--n-text-color);
`, [cM("absolute-positioned", `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 `), cM("bordered", `
 border-bottom: solid 1px var(--n-border-color);
 `)]);
const headerProps$1 = {
  position: positionProp,
  inverted: Boolean,
  bordered: {
    type: Boolean,
    default: false
  }
};
const __unplugin_components_1 = defineComponent({
  name: "LayoutHeader",
  props: Object.assign(Object.assign({}, useTheme.props), headerProps$1),
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Layout", "-layout-header", style$1, layoutLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: self2
      } = themeRef.value;
      const vars = {
        "--n-bezier": cubicBezierEaseInOut
      };
      if (props.inverted) {
        vars["--n-color"] = self2.headerColorInverted;
        vars["--n-text-color"] = self2.textColorInverted;
        vars["--n-border-color"] = self2.headerBorderColorInverted;
      } else {
        vars["--n-color"] = self2.headerColor;
        vars["--n-text-color"] = self2.textColor;
        vars["--n-border-color"] = self2.headerBorderColor;
      }
      return vars;
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("layout-header", computed(() => props.inverted ? "a" : "b"), cssVarsRef, props) : undefined;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    };
  },
  render() {
    var _a;
    const {
      mergedClsPrefix
    } = this;
    (_a = this.onRender) === null || _a === undefined ? undefined : _a.call(this);
    return h("div", {
      class: [`${mergedClsPrefix}-layout-header`, this.themeClass, this.position && `${mergedClsPrefix}-layout-header--${this.position}-positioned`, this.bordered && `${mergedClsPrefix}-layout-header--bordered`],
      style: this.cssVars
    }, this.$slots);
  }
});
const style = cB("h", `
 font-size: var(--n-font-size);
 font-weight: var(--n-font-weight);
 margin: var(--n-margin);
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
`, [c("&:first-child", {
  marginTop: 0
}), cM("prefix-bar", {
  position: "relative",
  paddingLeft: "var(--n-prefix-width)"
}, [cM("align-text", {
  paddingLeft: 0
}, [c("&::before", {
  left: "calc(-1 * var(--n-prefix-width))"
})]), c("&::before", `
 content: "";
 width: var(--n-bar-width);
 border-radius: calc(var(--n-bar-width) / 2);
 transition: background-color .3s var(--n-bezier);
 left: 0;
 top: 0;
 bottom: 0;
 position: absolute;
 `), c("&::before", {
  backgroundColor: "var(--n-bar-color)"
})])]);
const headerProps = Object.assign(Object.assign({}, useTheme.props), {
  type: {
    type: String,
    default: "default"
  },
  prefix: String,
  alignText: Boolean
});
const createHeader = (level) => defineComponent({
  name: `H${level}`,
  props: headerProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Typography", "-h", style, typographyLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        type
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          headerFontWeight,
          headerTextColor,
          [createKey("headerPrefixWidth", level)]: prefixWidth,
          [createKey("headerFontSize", level)]: fontSize,
          [createKey("headerMargin", level)]: margin,
          [createKey("headerBarWidth", level)]: barWidth,
          [createKey("headerBarColor", type)]: barColor
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-font-size": fontSize,
        "--n-margin": margin,
        "--n-bar-color": barColor,
        "--n-bar-width": barWidth,
        "--n-font-weight": headerFontWeight,
        "--n-text-color": headerTextColor,
        "--n-prefix-width": prefixWidth
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass(`h${level}`, computed(() => props.type[0]), cssVarsRef, props) : undefined;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      themeClass: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.themeClass,
      onRender: themeClassHandle === null || themeClassHandle === undefined ? undefined : themeClassHandle.onRender
    };
  },
  render() {
    var _a;
    const {
      prefix,
      alignText,
      mergedClsPrefix,
      cssVars,
      $slots
    } = this;
    (_a = this.onRender) === null || _a === undefined ? undefined : _a.call(this);
    return h(`h${level}`, {
      class: [`${mergedClsPrefix}-h`, `${mergedClsPrefix}-h${level}`, this.themeClass, {
        [`${mergedClsPrefix}-h--prefix-bar`]: prefix,
        [`${mergedClsPrefix}-h--align-text`]: alignText
      }],
      style: cssVars
    }, $slots);
  }
});
createHeader("1");
createHeader("2");
createHeader("3");
const NH4 = createHeader("4");
createHeader("5");
createHeader("6");
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_n_layout = __unplugin_components_0;
  const _component_n_layout_header = __unplugin_components_1;
  const _component_n_space = __unplugin_components_2;
  const _component_n_icon = NIcon;
  const _component_n_h4 = NH4;
  const _component_n_button = Button;
  const _component_n_layout_content = __unplugin_components_6;
  const _component_n_layout_footer = __unplugin_components_7;
  _push(ssrRenderComponent(_component_n_layout, mergeProps({ style: { "min-height": "100vh", "color": "#fff" } }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_n_layout_header, { style: { "background-color": "#1f1f27", "padding": "16px" } }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div class="navbar" data-v-cccb47c5${_scopeId2}>`);
              _push3(ssrRenderComponent(_component_n_space, {
                align: "center",
                justify: "space-between",
                style: { "width": "100%" }
              }, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent(_component_n_space, { align: "center" }, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(ssrRenderComponent(_component_n_icon, { size: "24" }, {
                            default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                              if (_push6) ;
                              else {
                                return [];
                              }
                            }),
                            _: 1
                          }, _parent5, _scopeId4));
                          _push5(ssrRenderComponent(_component_n_h4, { style: { "margin": "0", "color": "#fff" } }, {
                            default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                              if (_push6) {
                                _push6(`Convert Query To`);
                              } else {
                                return [
                                  createTextVNode("Convert Query To")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent5, _scopeId4));
                        } else {
                          return [
                            createVNode(_component_n_icon, { size: "24" }, {
                              default: withCtx(() => []),
                              _: 1
                            }),
                            createVNode(_component_n_h4, { style: { "margin": "0", "color": "#fff" } }, {
                              default: withCtx(() => [
                                createTextVNode("Convert Query To")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                    _push4(ssrRenderComponent(_component_n_space, {
                      align: "center",
                      size: "medium"
                    }, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(ssrRenderComponent(_component_n_button, {
                            text: "",
                            class: "!text-white"
                          }, {
                            default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                              if (_push6) {
                                _push6(`Home`);
                              } else {
                                return [
                                  createTextVNode("Home")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent5, _scopeId4));
                        } else {
                          return [
                            createVNode(_component_n_button, {
                              text: "",
                              class: "!text-white"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Home")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode(_component_n_space, { align: "center" }, {
                        default: withCtx(() => [
                          createVNode(_component_n_icon, { size: "24" }, {
                            default: withCtx(() => []),
                            _: 1
                          }),
                          createVNode(_component_n_h4, { style: { "margin": "0", "color": "#fff" } }, {
                            default: withCtx(() => [
                              createTextVNode("Convert Query To")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_n_space, {
                        align: "center",
                        size: "medium"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_n_button, {
                            text: "",
                            class: "!text-white"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Home")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
              _push3(`</div>`);
            } else {
              return [
                createVNode("div", { class: "navbar" }, [
                  createVNode(_component_n_space, {
                    align: "center",
                    justify: "space-between",
                    style: { "width": "100%" }
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_n_space, { align: "center" }, {
                        default: withCtx(() => [
                          createVNode(_component_n_icon, { size: "24" }, {
                            default: withCtx(() => []),
                            _: 1
                          }),
                          createVNode(_component_n_h4, { style: { "margin": "0", "color": "#fff" } }, {
                            default: withCtx(() => [
                              createTextVNode("Convert Query To")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_n_space, {
                        align: "center",
                        size: "medium"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_n_button, {
                            text: "",
                            class: "!text-white"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Home")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_n_layout_content, { style: { "padding": "16px" } }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
            } else {
              return [
                renderSlot(_ctx.$slots, "default", {}, undefined, true)
              ];
            }
          }),
          _: 3
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_n_layout_footer, { style: { "text-align": "center", "background-color": "#1f1f27", "padding": "16px" } }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<p data-v-cccb47c5${_scopeId2}>\xA9 2024 Convert Query To. All rights reserved by Eduardo Oliveira.</p>`);
            } else {
              return [
                createVNode("p", null, "\xA9 2024 Convert Query To. All rights reserved by Eduardo Oliveira.")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_n_layout_header, { style: { "background-color": "#1f1f27", "padding": "16px" } }, {
            default: withCtx(() => [
              createVNode("div", { class: "navbar" }, [
                createVNode(_component_n_space, {
                  align: "center",
                  justify: "space-between",
                  style: { "width": "100%" }
                }, {
                  default: withCtx(() => [
                    createVNode(_component_n_space, { align: "center" }, {
                      default: withCtx(() => [
                        createVNode(_component_n_icon, { size: "24" }, {
                          default: withCtx(() => []),
                          _: 1
                        }),
                        createVNode(_component_n_h4, { style: { "margin": "0", "color": "#fff" } }, {
                          default: withCtx(() => [
                            createTextVNode("Convert Query To")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_n_space, {
                      align: "center",
                      size: "medium"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_n_button, {
                          text: "",
                          class: "!text-white"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Home")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ])
            ]),
            _: 1
          }),
          createVNode(_component_n_layout_content, { style: { "padding": "16px" } }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default", {}, undefined, true)
            ]),
            _: 3
          }),
          createVNode(_component_n_layout_footer, { style: { "text-align": "center", "background-color": "#1f1f27", "padding": "16px" } }, {
            default: withCtx(() => [
              createVNode("p", null, "\xA9 2024 Convert Query To. All rights reserved by Eduardo Oliveira.")
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-cccb47c5"]]);

export { _default as default };
//# sourceMappingURL=default-CYAs_Efm.mjs.map
