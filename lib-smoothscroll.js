function t() {
	if (document.body) {
		var t = document.body,
			o = document.documentElement,
			n = window.innerHeight,
			r = t.scrollHeight;
		if (x = document.compatMode.indexOf("CSS") >= 0 ? o : t, w = t, e(), k = !0, top != self) b = !0;
		else if (r > n && (t.offsetHeight <= n || o.offsetHeight <= n)) {
			var a = !1,
				i = function () {
					a || o.scrollHeight == document.height || (a = !0, setTimeout(function () {
						o.style.height = document.height + "px", a = !1
					}, 500))
				};
			if (o.style.height = "auto", setTimeout(i, 10), x.offsetHeight <= n) {
				var l = document.createElement("div");
				l.style.clear = "both", t.appendChild(l)
			}
		}
		H.fixedBackground || v || (t.style.backgroundAttachment = "scroll", o.style.backgroundAttachment = "scroll")
	}
}

function o(e, t, o, n) {
	if (n || (n = 1e3), d(t, o), 1 != H.accelerationMax) {
		var r = +new Date,
			a = r - C;
		if (a < H.accelerationDelta) {
			var i = (1 + 30 / a) / 2;
			i > 1 && (i = Math.min(i, H.accelerationMax), t *= i, o *= i)
		}
		C = +new Date
	}
	if (M.push({
			x: t,
			y: o,
			lastX: 0 > t ? .99 : -.99,
			lastY: 0 > o ? .99 : -.99,
			start: +new Date
		}), !T) {
		var l = e === document.body,
			c = function () {
				for (var r = +new Date, a = 0, i = 0, u = 0; u < M.length; u++) {
					var s = M[u],
						d = r - s.start,
						f = d >= H.animationTime,
						h = f ? 1 : d / H.animationTime;
					H.pulseAlgorithm && (h = p(h));
					var m = s.x * h - s.lastX >> 0,
						w = s.y * h - s.lastY >> 0;
					a += m, i += w, s.lastX += m, s.lastY += w, f && (M.splice(u, 1), u--)
				}
				l ? window.scrollBy(a, i) : (a && (e.scrollLeft += a), i && (e.scrollTop += i)), t || o || (M = []), M.length ? N(c, e, n / H.frameRate + 1) : T = !1
			};
		N(c, e, 0), T = !0
	}
}

function n(e) {
	k || t();
	var n = e.target,
		r = l(n);
	if (!r || e.defaultPrevented || s(w, "embed") || s(n, "embed") && /\.pdf/i.test(n.src)) return !0;
	var a = e.wheelDeltaX || 0,
		i = e.wheelDeltaY || 0;
	return a || i || (i = e.wheelDelta || 0), !H.touchpadSupport && f(i) ? !0 : (Math.abs(a) > 1.2 && (a *= H.stepSize / 120), Math.abs(i) > 1.2 && (i *= H.stepSize / 120), o(r, -a, -i), void e.preventDefault())
}

function r(e) {
	var t = e.target,
		n = e.ctrlKey || e.altKey || e.metaKey || e.shiftKey && e.keyCode !== D.spacebar;
	if (/input|textarea|select|embed/i.test(t.nodeName) || t.isContentEditable || e.defaultPrevented || n) return !0;
	if (s(t, "button") && e.keyCode === D.spacebar) return !0;
	var r, a = 0,
		i = 0,
		c = l(w),
		u = c.clientHeight;
	switch (c == document.body && (u = window.innerHeight), e.keyCode) {
		case D.up:
			i = -H.arrowScroll;
			break;
		case D.down:
			i = H.arrowScroll;
			break;
		case D.spacebar:
			r = e.shiftKey ? 1 : -1, i = -r * u * .9;
			break;
		case D.pageup:
			i = .9 * -u;
			break;
		case D.pagedown:
			i = .9 * u;
			break;
		case D.home:
			i = -c.scrollTop;
			break;
		case D.end:
			var d = c.scrollHeight - c.scrollTop - u;
			i = d > 0 ? d + 10 : 0;
			break;
		case D.left:
			a = -H.arrowScroll;
			break;
		case D.right:
			a = H.arrowScroll;
			break;
		default:
			return !0
	}
	o(c, a, i), e.preventDefault()
}

function a(e) {
	w = e.target
}

function i(e, t) {
	for (var o = e.length; o--;) E[A(e[o])] = t;
	return t
}

function l(e) {
	var t = [],
		o = x.scrollHeight;
	do {
		var n = E[A(e)];
		if (n) return i(t, n);
		if (t.push(e), o === e.scrollHeight) {
			if (!b || x.clientHeight + 10 < o) return i(t, document.body)
		} else if (e.clientHeight + 10 < e.scrollHeight && (overflow = getComputedStyle(e, "").getPropertyValue("overflow-y"), "scroll" === overflow || "auto" === overflow)) return i(t, e)
	} while (e = e.parentNode)
}

function c(e, t, o) {
	window.addEventListener(e, t, o || !1)
}

function u(e, t, o) {
	window.removeEventListener(e, t, o || !1)
}

function s(e, t) {
	return (e.nodeName || "").toLowerCase() === t.toLowerCase()
}

function d(e, t) {
	e = e > 0 ? 1 : -1, t = t > 0 ? 1 : -1, (y.x !== e || y.y !== t) && (y.x = e, y.y = t, M = [], C = 0)
}

function f(e) {
	if (e) {
		e = Math.abs(e), S.push(e), S.shift(), clearTimeout(z);
		var t = h(S[0], 120) && h(S[1], 120) && h(S[2], 120);
		return !t
	}
}

function h(e, t) {
	return Math.floor(e / t) == e / t
}

function m(e) {
	var t, o, n;
	return e *= H.pulseScale, 1 > e ? t = e - (1 - Math.exp(-e)) : (o = Math.exp(-1), e -= 1, n = 1 - Math.exp(-e), t = o + n * (1 - o)), t * H.pulseNormalize
}

function p(e) {
	return e >= 1 ? 1 : 0 >= e ? 0 : (1 == H.pulseNormalize && (H.pulseNormalize /= m(1)), m(e))
}
var w, g = {
		frameRate: 150,
		animationTime: 600,
		stepSize: 120,
		pulseAlgorithm: !0,
		pulseScale: 8,
		pulseNormalize: 1,
		accelerationDelta: 20,
		accelerationMax: 1,
		keyboardSupport: !0,
		arrowScroll: 50,
		touchpadSupport: !0,
		fixedBackground: !0,
		excluded: ""
	},
	v = !1,
	b = !1,
	y = {
		x: 0,
		y: 0
	},
	k = !1,
	x = document.documentElement,
	S = [120, 120, 120],
	D = {
		left: 37,
		up: 38,
		right: 39,
		down: 40,
		spacebar: 32,
		pageup: 33,
		pagedown: 34,
		end: 35,
		home: 36
	},
	H = g,
	M = [],
	T = !1,
	C = +new Date,
	E = {};
setInterval(function () {
	E = {}
}, 1e4);
var z, A = function () {
		var e = 0;
		return function (t) {
			return t.uniqueID || (t.uniqueID = e++)
		}
	}(),
	N = function () {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (e, t, o) {
			window.setTimeout(e, o || 1e3 / 60)
		}
	}(),
	K = /chrome/i.test(window.navigator.userAgent),
	L = null;
"onwheel" in document.createElement("div") ? L = "wheel" : "onmousewheel" in document.createElement("div") && (L = "mousewheel"), L && K && (c(L, n), c("mousedown", a), c("load", t))
