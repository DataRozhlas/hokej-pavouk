!(function (t) {
  var e = {};
  function n(o) {
    if (e[o]) return e[o].exports;
    var r = (e[o] = { i: o, l: !1, exports: {} });
    return t[o].call(r.exports, r, r.exports, n), (r.l = !0), r.exports;
  }
  (n.m = t),
    (n.c = e),
    (n.d = function (t, e, o) {
      n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: o });
    }),
    (n.r = function (t) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (n.t = function (t, e) {
      if ((1 & e && (t = n(t)), 8 & e)) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var o = Object.create(null);
      if (
        (n.r(o),
        Object.defineProperty(o, "default", { enumerable: !0, value: t }),
        2 & e && "string" != typeof t)
      )
        for (var r in t)
          n.d(
            o,
            r,
            function (e) {
              return t[e];
            }.bind(null, r)
          );
      return o;
    }),
    (n.n = function (t) {
      var e =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return n.d(e, "a", e), e;
    }),
    (n.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (n.p = "/themes/mr_frontend/js/"),
    n((n.s = 430));
})({
  430: function (t, e, n) {
    "use strict";
    n.r(e);
    var o = n(70),
      r = n.n(o),
      i = function (t, e) {
        document
          .querySelectorAll("[data-".concat(t, "]"))
          .forEach(function (n) {
            if (n instanceof HTMLElement) {
              var o = n.getAttribute("data-".concat(t));
              if (o)
                try {
                  if (
                    "true" !==
                    n.getAttribute("data-mujrozhlas-player-activated")
                  ) {
                    var r = JSON.parse(o);
                    n.setAttribute("data-mujrozhlas-player-activated", "true"),
                      e(n, r);
                  }
                } catch (t) {
                  console.error(t);
                }
            }
          });
      };
    !(function () {
      for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
        e[n] = arguments[n];
      "complete" === document.readyState
        ? i.apply(void 0, e)
        : document.addEventListener("DOMContentLoaded", function () {
            return i.apply(void 0, e);
          });
    })("mujrozhlas-player", function (t, e) {
      try {
        var n = (function (t) {
          if (
            null != t &&
            "object" === r()(t) &&
            "uuid" in t &&
            "string" == typeof t.uuid &&
            ("episode" === t.type ||
              "serial" === t.type ||
              "station" === t.type)
          )
            return t;
          throw new Error("Invalid configuration for data-mujrozhlas-player");
        })(e);
        !(function (t) {
          var e = t.element,
            n = t.src,
            o = t.maxWidth,
            r = t.height,
            i = t.id,
            u = document.createElement("iframe");
          (u.src = n),
            (u.style.border = "none"),
            (u.style.width = "100%"),
            o && (u.style.maxWidth = "".concat(o, "px")),
            r && (u.style.height = "".concat(r, "px"));
          window.addEventListener(
            "message",
            function (t) {
              var e = t.data;
              e &&
                "id" in e &&
                e.id === i &&
                e.height &&
                (u.style.height = "".concat(e.height, "px"));
            },
            !1
          ),
            e.appendChild(u);
        })({
          element: t,
          src:
            ((o = n.uuid),
            (i = n.type),
            (
              window.MUJROZHLAS_PLAYER_URL ||
              "https://mujrozhlas.cz/embed/<type>/<uuid>"
            )
              .replace("<uuid>", encodeURIComponent(o))
              .replace("<type>", encodeURIComponent(i))),
          id: n.uuid,
          maxWidth: 600,
          height: 1,
        });
      } catch (t) {
        console.error(t);
      }
      var o, i;
    });
  },
  70: function (t, e) {
    function n(t) {
      return (n =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t &&
                "function" == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? "symbol"
                : typeof t;
            })(t);
    }
    function o(e) {
      return (
        "function" == typeof Symbol && "symbol" === n(Symbol.iterator)
          ? (t.exports = o =
              function (t) {
                return n(t);
              })
          : (t.exports = o =
              function (t) {
                return t &&
                  "function" == typeof Symbol &&
                  t.constructor === Symbol &&
                  t !== Symbol.prototype
                  ? "symbol"
                  : n(t);
              }),
        o(e)
      );
    }
    t.exports = o;
  },
});
