import { getGap, depx } from 'seemly';
import { defineComponent, h, Comment, computed } from 'vue';
import { a8 as flatten, y as useConfig, z as useTheme, J as useRtl, B as createKey, af as commonVars$4 } from './server.mjs';

const pureNumberRegex = /^(\d|\.)+$/;
const numberRegex = /(\d|\.)+/;
function formatLength(length, {
  c = 1,
  offset = 0,
  attachPx = true
} = {}) {
  if (typeof length === "number") {
    const result = (length + offset) * c;
    if (result === 0) return "0";
    return `${result}px`;
  } else if (typeof length === "string") {
    if (pureNumberRegex.test(length)) {
      const result = (Number(length) + offset) * c;
      if (attachPx) {
        if (result === 0) return "0";
        return `${result}px`;
      } else {
        return `${result}`;
      }
    } else {
      const result = numberRegex.exec(length);
      if (!result) return length;
      return length.replace(numberRegex, String((Number(result[0]) + offset) * c));
    }
  }
  return length;
}
function getSlot(instance, slotName = "default", fallback = []) {
  const slots = instance.$slots;
  const slot = slots[slotName];
  if (slot === undefined) return fallback;
  return slot();
}
function self() {
  return commonVars$4;
}
const spaceLight = {
  self
};
function ensureSupportFlexGap() {
  return true;
}
const spaceProps = Object.assign(Object.assign({}, useTheme.props), {
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
  wrapItem: {
    type: Boolean,
    default: true
  },
  itemClass: String,
  itemStyle: [String, Object],
  wrap: {
    type: Boolean,
    default: true
  },
  // internal
  internalUseGap: {
    type: Boolean,
    default: undefined
  }
});
const __unplugin_components_2 = defineComponent({
  name: "Space",
  props: spaceProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef
    } = useConfig(props);
    const themeRef = useTheme("Space", "-space", undefined, spaceLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("Space", mergedRtlRef, mergedClsPrefixRef);
    return {
      useGap: ensureSupportFlexGap(),
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
      itemClass,
      itemStyle,
      margin,
      wrap,
      mergedClsPrefix,
      rtlEnabled,
      useGap,
      wrapItem,
      internalUseGap
    } = this;
    const children = flatten(getSlot(this), false);
    if (!children.length) return null;
    const horizontalMargin = `${margin.horizontal}px`;
    const semiHorizontalMargin = `${margin.horizontal / 2}px`;
    const verticalMargin = `${margin.vertical}px`;
    const semiVerticalMargin = `${margin.vertical / 2}px`;
    const lastIndex = children.length - 1;
    const isJustifySpace = justify.startsWith("space-");
    return h("div", {
      role: "none",
      class: [`${mergedClsPrefix}-space`, rtlEnabled && `${mergedClsPrefix}-space--rtl`],
      style: {
        display: inline ? "inline-flex" : "flex",
        flexDirection: (() => {
          if (vertical && !reverse) return "column";
          if (vertical && reverse) return "column-reverse";
          if (!vertical && reverse) return "row-reverse";
          else return "row";
        })(),
        justifyContent: ["start", "end"].includes(justify) ? `flex-${justify}` : justify,
        flexWrap: !wrap || vertical ? "nowrap" : "wrap",
        marginTop: useGap || vertical ? "" : `-${semiVerticalMargin}`,
        marginBottom: useGap || vertical ? "" : `-${semiVerticalMargin}`,
        alignItems: align,
        gap: useGap ? `${margin.vertical}px ${margin.horizontal}px` : ""
      }
    }, !wrapItem && (useGap || internalUseGap) ? children : children.map((child, index) => child.type === Comment ? child : h("div", {
      role: "none",
      class: itemClass,
      style: [itemStyle, {
        maxWidth: "100%"
      }, useGap ? "" : vertical ? {
        marginBottom: index !== lastIndex ? verticalMargin : ""
      } : rtlEnabled ? {
        marginLeft: isJustifySpace ? justify === "space-between" && index === lastIndex ? "" : semiHorizontalMargin : index !== lastIndex ? horizontalMargin : "",
        marginRight: isJustifySpace ? justify === "space-between" && index === 0 ? "" : semiHorizontalMargin : "",
        paddingTop: semiVerticalMargin,
        paddingBottom: semiVerticalMargin
      } : {
        marginRight: isJustifySpace ? justify === "space-between" && index === lastIndex ? "" : semiHorizontalMargin : index !== lastIndex ? horizontalMargin : "",
        marginLeft: isJustifySpace ? justify === "space-between" && index === 0 ? "" : semiHorizontalMargin : "",
        paddingTop: semiVerticalMargin,
        paddingBottom: semiVerticalMargin
      }]
    }, child)));
  }
});

export { __unplugin_components_2 as _, formatLength as f, getSlot as g };
//# sourceMappingURL=Space-Bo1T0CPB.mjs.map
