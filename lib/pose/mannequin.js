// Pose mannequin: a jointed 3D figure drawn as a rough storyboard sketch.
//
// Sections, in order:
//   1. Vector and matrix helpers
//   2. Shape builders (ellipsoid, lofted torso, limb with muscle bulges)
//   3. Joint limits and body profiles
//   4. fig(): skeleton from joint angles, gaze and reach targets, then flesh
//   5. Stroke helpers (seeded wobble, hulls)
//   6. draw(): perspective projection, depth sort, outlines
//   7. Public API: renderFrame, renderSheet, renderLineup
//
// Units are metres and degrees. Axes: x = figure's left, y = up, z = front.
// This is prototype code: formatted, but not yet refactored for readability.
'use strict';
const W = 320,
  H = 200,
  sin = Math.sin,
  cos = Math.cos;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k],
  dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  nrm = (a) => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  },
  lerp = (a, b, t) => add(a, mul(sub(b, a), t));
let BL = [];
function ell(c, A, a, B, b, C, cc, e) {
  const q = e || 1,
    cos = (v) => Math.sign(Math.cos(v)) * Math.abs(Math.cos(v)) ** q,
    sin = (v) => Math.sign(Math.sin(v)) * Math.abs(Math.sin(v)) ** q,
    p = [];
  for (let i = -3; i <= 3; i++)
    for (let j = 0; j < 12; j++) {
      const ph = (i * Math.PI) / 6,
        th = (j * Math.PI) / 6;
      p.push(
        add(c, add(add(mul(A, a * cos(ph) * cos(th)), mul(B, b * sin(ph))), mul(C, cc * cos(ph) * sin(th)))),
      );
    }
  return p;
}
const sph = (c, r) => ell(c, [1, 0, 0], r, [0, 1, 0], r, [0, 0, 1], r);
function hull2(P) {
  P = P.slice().sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]),
    lo = [],
    up = [];
  for (const p of P) {
    while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
    lo.push(p);
  }
  for (let i = P.length - 1; i >= 0; i--) {
    const p = P[i];
    while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop();
    up.push(p);
  }
  lo.pop();
  up.pop();
  return lo.concat(up);
}
const D = Math.PI / 180;
let FACE = [0, 0, 1],
  CLAMPS = [];
const Rx = (t) => [
    [1, 0, 0],
    [0, Math.cos(t), -Math.sin(t)],
    [0, Math.sin(t), Math.cos(t)],
  ],
  Ry = (t) => [
    [Math.cos(t), 0, Math.sin(t)],
    [0, 1, 0],
    [-Math.sin(t), 0, Math.cos(t)],
  ],
  Rz = (t) => [
    [Math.cos(t), -Math.sin(t), 0],
    [Math.sin(t), Math.cos(t), 0],
    [0, 0, 1],
  ];
const mm = (A, B) => A.map((r) => [0, 1, 2].map((j) => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j])),
  mv = (A, v) => A.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]),
  col = (R, i) => [R[0][i], R[1][i], R[2][i]];
const LIM = {
  lum: [
    [-30, 60],
    [-25, 25],
    [-10, 10],
  ],
  tho: [
    [-25, 40],
    [-25, 25],
    [-35, 35],
  ],
  nk: [
    [-50, 50],
    [-40, 40],
    [-70, 70],
  ],
  Sh: [
    [-50, 180],
    [-30, 180],
    [-90, 90],
  ],
  El: [[0, 150]],
  Hip: [
    [-20, 120],
    [-25, 45],
    [-40, 40],
  ],
  Kn: [[0, 150]],
  An: [[-45, 25]],
  hd: [
    [-40, 30],
    [-20, 20],
    [-40, 40],
  ],
};
const BASE = {
  h: 1,
  head: 1,
  leg: 1,
  torso: 1,
  arm: 1,
  neck: 1,
  sh: 1,
  hip: 1,
  rib: 1,
  girth: 1,
  belly: 0,
  breast: 0,
  post: {},
  flex: 1,
};
let P = BASE,
  GS = 1,
  HS = 1;
function lim(o, key, cls) {
  const f = o.flex || P.flex || 1,
    v = o[key],
    arr = Array.isArray(v) ? v : [v || 0],
    po = P.post[cls] || [];
  return LIM[cls].map((r, i) => {
    const x = (arr[i] || 0) + (po[i] || 0),
      c = Math.max(r[0] * f, Math.min(r[1] * f, x));
    if (c !== x) CLAMPS.push(key + '[' + i + '] ' + x + ' -> ' + c);
    return c * D;
  });
}
const ball = (a, g) => mm(mm(Rx(-a[0]), Rz(g * a[1])), Ry(g * a[2])),
  spn = (a) => mm(mm(Ry(a[2]), Rz(-a[1])), Rx(a[0]));
let EX = [];
function loft(A, up, sd, fr, H, secs, bust) {
  const p = [],
    pt = (t, th) => {
      let k = 0;
      while (k < secs.length - 2 && t > secs[k + 1][0]) k++;
      const a = secs[k],
        b = secs[k + 1];
      let u = Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0])));
      u = u * u * (3 - 2 * u);
      const w = a[1] + (b[1] - a[1]) * u,
        cf = Math.cos(th);
      let d = a[2] + (b[2] - a[2]) * u;
      if (bust && cf > 0) d += bust * Math.exp(-(((t - 0.55) / 0.16) ** 2)) * Math.pow(cf, 0.6);
      return add(add(A, mul(up, H * t)), add(mul(sd, w * Math.sin(th)), mul(fr, d * cf)));
    };
  for (let i = 0; i <= 14; i++) for (let j = 0; j < 20; j++) p.push(pt(i / 14, (j * Math.PI) / 10));
  if (bust) {
    const L = [];
    for (let a = -75; a <= 75; a += 15)
      L.push({ p: pt(0.55, a * D), n: add(mul(sd, Math.sin(a * D)), mul(fr, Math.cos(a * D))) });
    p.lines = [L];
  }
  return p;
}
function shp(A, B, r0, r1, fr0, g, bm, tag, par) {
  const ax = nrm(sub(B, A)),
    fr = nrm(sub(fr0, mul(ax, dot(fr0, ax)))),
    out = mul(crs(fr, ax), g),
    L = sub(B, A),
    p = sph(A, r0 * GS).concat(sph(B, r1 * GS));
  for (let i = 0; i <= 10; i++) {
    const t = i / 10,
      c = add(A, mul(L, t));
    for (let j = 0; j < 16; j++) {
      const th = (j * Math.PI) / 8;
      let r = r0 + (r1 - r0) * t;
      bm.forEach((b) => {
        const w = Math.cos(th - b[0] * D);
        if (w > 0) r += b[2] * Math.exp(-(((t - b[1]) / b[3]) ** 2)) * w;
      });
      p.push(add(c, add(mul(fr, r * GS * Math.cos(th)), mul(out, r * GS * Math.sin(th)))));
    }
  }
  p.tag = tag;
  p.par = par;
  BL.push(p);
}
function ik2(S, T, l1, l2, pole) {
  const v = sub(T, S),
    d = Math.hypot(v[0], v[1], v[2]),
    Dd = Math.min(d, (l1 + l2) * 0.999),
    dir = mul(v, 1 / d),
    e = add(S, mul(dir, Dd)),
    a = (l1 * l1 - l2 * l2 + Dd * Dd) / (2 * Dd),
    hh = Math.sqrt(Math.max(0, l1 * l1 - a * a)),
    pp = nrm(sub(pole, mul(dir, dot(pole, dir))));
  if (d > l1 + l2) CLAMPS.push('out of reach by ' + (d - l1 - l2).toFixed(2));
  return { m: add(add(S, mul(dir, a)), mul(pp, hh)), e };
}
function fig(o) {
  const J = {};
  BL = [];
  EX = [];
  const h = P.h,
    T = h * P.torso,
    Lg = h * P.leg,
    A = h * P.arm;
  GS = h * P.girth;
  HS = P.head;
  const rt = o.root,
    p = rt.p,
    R0 = mm(mm(Ry((rt.yaw || 0) * D), Rx((rt.pitch || 0) * D)), Rz((rt.roll || 0) * D));
  const tA = lim(o, 'tho', 'tho'),
    nA = lim(o, 'nk', 'nk');
  nA[0] += 0.5 * tA[0] + 8 * D;
  nA[1] += 0.5 * tA[1];
  const Rl = mm(R0, spn(lim(o, 'lum', 'lum'))),
    Rt = mm(Rl, spn(tA)),
    np = add(add(add(p, mv(R0, [0, 0.08 * T, 0])), mv(Rl, [0, 0.16 * T, 0])), mv(Rt, [0, 0.34 * T, 0]));
  let hA = lim(o, 'hd', 'hd');
  if (o.look !== 'free') {
    const f = o.flex || P.flex || 1,
      fz = add(col(R0, 2), col(R0, 1)),
      d = Array.isArray(o.look) ? nrm(sub(o.look, add(np, [0, 0.15 * h, 0]))) : nrm([fz[0], 0, fz[2]]),
      tv = (R, v) => [0, 1, 2].map((i) => dot(col(R, i), v)),
      cl = (x, r) => Math.max(r[0] * f * D, Math.min(r[1] * f * D, x)),
      as = (v) => Math.asin(Math.max(-1, Math.min(1, v)));
    let l = tv(mm(Rt, spn(nA)), d);
    nA[0] = cl(nA[0] - 0.35 * as(l[1]), LIM.nk[0]);
    nA[2] = cl(nA[2] + 0.35 * Math.atan2(l[0], l[2]), LIM.nk[2]);
    l = tv(mm(Rt, spn(nA)), d);
    const want = [-as(l[1]), Math.atan2(l[0], l[2])];
    hA = [cl(want[0], LIM.hd[0]), 0, cl(want[1], LIM.hd[2])];
    const miss = Math.abs(hA[0] - want[0]) + Math.abs(hA[2] - want[1]);
    if (miss > 0.05) CLAMPS.push('gaze short of target by ' + Math.round(miss / D) + ' deg');
  }
  const Rn = mm(Rt, spn(nA)),
    Rd = mm(Rn, spn(hA));
  J.pelvis = p;
  J.waist = add(add(p, mv(R0, [0, 0.08 * T, 0])), mv(Rl, [0, 0.16 * T, 0]));
  J.neck = add(J.waist, mv(Rt, [0, 0.34 * T, 0]));
  J.chest = add(J.waist, mv(Rt, [0, 0.19 * T, 0]));
  J.skull = add(J.neck, mv(Rn, [0, 0.1 * P.neck * (0.4 + 0.6 * h), 0]));
  J.head = add(J.skull, mv(Rd, [0, 0.075 * HS, 0.02 * HS]));
  const hb = ell(J.head, col(Rd, 0), 0.08 * HS, col(Rd, 1), 0.115 * HS, col(Rd, 2), 0.097 * HS);
  hb.head = { c: J.head, R: Rd, a: 0.08 * HS, b: 0.115 * HS, d: 0.097 * HS };
  BL.push(hb);
  FACE = mv(Rd, [0, 0, 1]);
  {
    const F = P.breast > 0,
      k = h * P.rib,
      kd = k * P.girth,
      sc = (
        F
          ? [
              [0, 0.12, 0.085],
              [0.3, 0.13, 0.095],
              [0.6, 0.145, 0.1],
              [0.86, 0.14, 0.09],
              [1, 0.06, 0.06],
            ]
          : [
              [0, 0.14, 0.1],
              [0.3, 0.16, 0.115],
              [0.65, 0.18, 0.125],
              [0.88, 0.17, 0.11],
              [1, 0.075, 0.07],
            ]
      ).map((q) => [q[0], q[1] * k, q[2] * kd]);
    const rb = loft(J.waist, col(Rt, 1), col(Rt, 0), col(Rt, 2), 0.34 * T, sc, F ? 0.055 * h * P.breast : 0);
    rb.tag = 'rib';
    BL.push(rb);
  }
  {
    const k = h * P.hip,
      pv = loft(
        add(p, mv(R0, [0, -0.075 * h, 0])),
        col(R0, 1),
        col(R0, 0),
        col(R0, 2),
        0.075 * h + 0.11 * T,
        (P.breast > 0
          ? [
              [0, 0.05, 0.065],
              [0.4, 0.16, 0.105],
              [0.8, 0.135, 0.095],
              [1, 0.115, 0.085],
            ]
          : [
              [0, 0.05, 0.07],
              [0.4, 0.15, 0.105],
              [0.8, 0.14, 0.1],
              [1, 0.125, 0.09],
            ]
        ).map((q) => [q[0], q[1] * k, q[2] * k * P.girth]),
        0,
      );
    pv.tag = 'pelvis';
    BL.push(pv);
  }
  if (P.belly)
    BL.push(
      ell(
        add(add(p, mv(R0, [0, 0.08 * T, 0])), mv(Rl, [0, 0.07 * T, 0.05 * h * P.belly])),
        col(Rl, 0),
        0.15 * h * (0.8 + 0.25 * P.belly),
        col(Rl, 1),
        0.15 * T,
        col(Rl, 2),
        0.12 * h * (0.7 + 0.5 * P.belly),
      ),
    );
  [
    ['l', 1],
    ['r', -1],
  ].forEach(([s, g]) => {
    let Rs = mm(Rt, ball(lim(o, s + 'Sh', 'Sh'), g)),
      ua = mv(Rs, [0, -1, 0]),
      Re = mm(Rs, Rx(-lim(o, s + 'El', 'El')[0])),
      fa = mv(Re, [0, -1, 0]);

    J[s + 'Sh'] = add(add(J.neck, mv(Rt, [g * 0.2 * h * P.sh, -0.075 * T, 0])), mul(ua, 0.03 * h));
    {
      const b = sph(J[s + 'Sh'], 0.058 * GS);
      b.tag = 'sh' + s;
      b.par = 'rib';
      BL.push(b);
    }
    J[s + 'El'] = add(J[s + 'Sh'], mul(ua, 0.29 * A));
    J[s + 'Wr'] = add(J[s + 'El'], mul(fa, 0.26 * A));
    J[s + 'Ha'] = add(J[s + 'Wr'], mul(fa, 0.1 * A));
    let hxI = null,
      hzI = null;
    const tg = o.ik && o.ik[s + 'Wr'];
    if (tg) {
      const r = ik2(
        J[s + 'Sh'],
        tg,
        0.29 * A,
        0.26 * A,
        (o.pole && o.pole[s + 'El']) || mv(Rt, [g * 0.6, -0.6, -0.5]),
      );
      J[s + 'El'] = r.m;
      J[s + 'Wr'] = r.e;
      fa = nrm(sub(r.e, r.m));
      J[s + 'Ha'] = add(r.e, mul(fa, 0.1 * A));
      hxI = nrm(crs(fa, mv(Rt, [0, 1, 0.3])));
      hzI = crs(hxI, fa);
    }
    {
      const hx = hxI || col(Re, 0),
        hz = hzI || col(Re, 2),
        Wp = J[s + 'Wr'],
        ht = o[s + 'Hand'] || 'fist',
        hs = 0.9 * h + 0.1;
      if (ht === 'open') {
        BL.push(ell(add(Wp, mul(fa, 0.085 * hs)), hx, 0.02 * hs, fa, 0.095 * hs, hz, 0.045 * hs, 0.7));
        EX.push({
          A: add(add(Wp, mul(fa, 0.03 * hs)), mul(hz, 0.03 * hs)),
          B: add(add(Wp, mul(fa, 0.085 * hs)), mul(hz, 0.08 * hs)),
          ra: 0.014 * hs,
          rb: 0.011 * hs,
        });
      } else {
        BL.push(ell(add(Wp, mul(fa, 0.05 * hs)), hx, 0.035 * hs, fa, 0.05 * hs, hz, 0.045 * hs, 0.6));
        if (ht === 'v')
          [-1, 1].forEach((q) =>
            EX.push({
              A: add(add(Wp, mul(fa, 0.09 * hs)), mul(hz, q * 0.015 * hs)),
              B: add(add(Wp, mul(fa, 0.175 * hs)), mul(hz, q * 0.05 * hs)),
              ra: 0.012 * hs,
              rb: 0.01 * hs,
            }),
          );
      }
    }
    const Rh = mm(R0, ball(lim(o, s + 'Hip', 'Hip'), g)),
      Rk = mm(Rh, Rx(lim(o, s + 'Kn', 'Kn')[0])),
      Ra = mm(Rk, Rx(-lim(o, s + 'An', 'An')[0]));
    J[s + 'Hip'] = add(p, mv(R0, [g * 0.09 * h * P.hip, 0, 0]));
    {
      const b = ell(
        add(J[s + 'Hip'], mv(R0, [g * 0.01 * h, -0.02 * h, -0.05 * h])),
        col(R0, 0),
        0.08 * GS * P.hip,
        col(R0, 1),
        0.1 * GS * P.hip,
        col(R0, 2),
        0.085 * GS * P.hip,
      );
      b.par = 'pelvis';
      BL.push(b);
    }
    J[s + 'Kn'] = add(J[s + 'Hip'], mul(mv(Rh, [0, -1, 0]), 0.45 * Lg));
    J[s + 'An'] = add(J[s + 'Kn'], mul(mv(Rk, [0, -1, 0]), 0.45 * Lg));
    J[s + 'Toe'] = add(J[s + 'An'], mul(mv(Ra, nrm([0, -0.25, 1])), 0.17 * h));
    const tl = o.ik && o.ik[s + 'An'];
    if (tl) {
      const r = ik2(J[s + 'Hip'], tl, 0.45 * Lg, 0.45 * Lg, mv(R0, [g * 0.25, 0, 1]));
      J[s + 'Kn'] = r.m;
      J[s + 'An'] = r.e;
      J[s + 'Toe'] = add(r.e, mul(nrm((o.foot && o.foot[s]) || mv(R0, [0, -0.25, 1])), 0.17 * h));
    }
    const kf0 = sub(J[s + 'Kn'], lerp(J[s + 'Hip'], J[s + 'An'], 0.5)),
      kf = Math.hypot(kf0[0], kf0[1], kf0[2]) > 0.03 * h ? kf0 : mv(R0, [0, 0, 1]);
    shp(
      J[s + 'Hip'],
      J[s + 'Kn'],
      0.074,
      0.054,
      kf,
      g,
      [
        [15, 0.4, 0.02, 0.3],
        [180, 0.45, 0.012, 0.3],
        [270, 0.18, 0.012, 0.2],
        [180, 0.05, 0.016, 0.15],
        [90, 0.08, 0.018, 0.12],
      ],
      s + 'th',
      'pelvis',
    );
    shp(
      J[s + 'Kn'],
      J[s + 'An'],
      0.05,
      0.034,
      kf,
      g,
      [
        [180, 0.28, 0.036, 0.2],
        [110, 0.2, 0.012, 0.15],
        [250, 0.34, 0.016, 0.16],
      ],
      s + 'sn',
      s + 'th',
    );
    const eb0 = sub(lerp(J[s + 'Sh'], J[s + 'Wr'], 0.5), J[s + 'El']),
      ef = Math.hypot(eb0[0], eb0[1], eb0[2]) > 0.03 * h ? eb0 : mv(Rt, [0, 0, 1]);
    shp(
      J[s + 'Sh'],
      J[s + 'El'],
      0.05,
      0.043,
      ef,
      g,
      [
        [90, 0.12, 0.02, 0.15],
        [0, 0.5, 0.017, 0.22],
        [180, 0.35, 0.016, 0.25],
      ],
      s + 'ua',
      'sh' + s,
    );
    shp(
      J[s + 'El'],
      J[s + 'Wr'],
      0.042,
      0.028,
      ef,
      g,
      [
        [60, 0.2, 0.016, 0.18],
        [260, 0.3, 0.012, 0.2],
      ],
      s + 'fa',
      s + 'ua',
    );
  });
  return J;
}
const LIMBS = [
  ['neck', 'skull', 0.058, 0.05],
  ['waist', 'pelvis', 0.095, 0.11],
];
['l', 'r'].forEach((s) => LIMBS.push([s + 'An', s + 'Toe', 0.045, 0.03, 1]));
const BONES = [
  ['neck', 'skull'],
  ['waist', 'pelvis'],
  ['neck', 'waist'],
  ['lSh', 'rSh'],
  ['lHip', 'rHip'],
];
['l', 'r'].forEach((s) =>
  BONES.push(
    [s + 'Sh', s + 'El'],
    [s + 'El', s + 'Wr'],
    [s + 'Hip', s + 'Kn'],
    [s + 'Kn', s + 'An'],
    [s + 'An', s + 'Toe'],
  ),
);
let rnd;
function rng(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function wob(pts, amp) {
  const p1 = rnd() * 6.28,
    p2 = rnd() * 6.28,
    k = 0.4 + rnd() * 0.5;
  return pts.map((p, i) => [
    p[0] + amp * sin(i * k + p1) + (rnd() - 0.5) * amp * 0.5,
    p[1] + amp * cos(i * k * 0.8 + p2) + (rnd() - 0.5) * amp * 0.5,
  ]);
}
function pd(pts) {
  return 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
}
function strk(pts, cls, n, amp, sw) {
  let s = '';
  for (let i = 0; i < n; i++)
    s +=
      '<path d="' +
      pd(wob(pts, amp)) +
      '" class="' +
      cls +
      '"' +
      (sw ? ' stroke-width="' + sw.toFixed(2) + '"' : '') +
      '/>';
  return s;
}
function seg(a, b, over) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    l = Math.hypot(dx, dy) || 1,
    ux = dx / l,
    uy = dy / l,
    o1 = over * rnd(),
    o2 = over * rnd(),
    A = [a[0] - ux * o1, a[1] - uy * o1],
    B = [b[0] + ux * o2, b[1] + uy * o2],
    r = [];
  for (let i = 0; i <= 4; i++) r.push([A[0] + ((B[0] - A[0]) * i) / 4, A[1] + ((B[1] - A[1]) * i) / 4]);
  return r;
}
function circ(c, r, n, x) {
  const p = [],
    a0 = rnd() * 6.28;
  for (let i = 0; i <= n + (x || 0); i++) {
    const a = a0 + (i * 6.2832) / n;
    p.push([c[0] + r * cos(a), c[1] + r * sin(a)]);
  }
  return p;
}
function tang(c1, r1, c2, r2) {
  const dx = c2[0] - c1[0],
    dy = c2[1] - c1[1],
    d = Math.hypot(dx, dy);
  if (d <= Math.abs(r1 - r2) + 0.01) return null;
  return { th: Math.atan2(dy, dx), ph: Math.acos((r1 - r2) / d) };
}
function hull(c1, r1, c2, r2) {
  const t = tang(c1, r1, c2, r2);
  if (!t) return r1 > r2 ? circ(c1, r1, 24, 3) : circ(c2, r2, 24, 3);
  const p = [],
    n = 10;
  for (let i = 0; i <= n; i++) {
    const a = t.th + t.ph + ((6.2832 - 2 * t.ph) * i) / n;
    p.push([c1[0] + r1 * cos(a), c1[1] + r1 * sin(a)]);
  }
  for (let i = 0; i <= n; i++) {
    const a = t.th - t.ph + (2 * t.ph * i) / n;
    p.push([c2[0] + r2 * cos(a), c2[1] + r2 * sin(a)]);
  }
  p.push(p[0], p[1], p[2]);
  return p;
}
function hatch(a, r1, b, r2) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    len = Math.hypot(dx, dy);
  let s = '';
  if (len < Math.abs(r1 - r2) + 1) {
    const c = r1 > r2 ? a : b,
      R = Math.max(r1, r2);
    if (R < 5) return '';
    for (let k = -3; k <= 3; k++) {
      const an = 0.93 + k * 0.22,
        p = [c[0] + R * 0.95 * cos(an), c[1] + R * 0.95 * sin(an)];
      s += strk([p, [p[0] - R * 0.5, p[1] - R * 0.25]], 'ht', 1, 0.3);
    }
    return s;
  }
  const d = [dx / len, dy / len];
  let n = [-d[1], d[0]];
  if (n[0] * 0.6 + n[1] * 0.8 < 0) n = [-n[0], -n[1]];
  const st = Math.max(3.5, len / 14) / len;
  for (let t = 0.08; t < 0.95; t += st) {
    const r = r1 + (r2 - r1) * t;
    if (r < 2.5) continue;
    const c = [a[0] + dx * t, a[1] + dy * t];
    s += strk(
      [
        [c[0] + n[0] * r * 0.95, c[1] + n[1] * r * 0.95],
        [c[0] + n[0] * r * 0.3 + d[0] * r * 0.5, c[1] + n[1] * r * 0.3 + d[1] * r * 0.5],
      ],
      'ht',
      1,
      0.3,
    );
  }
  return s;
}
function draw(sh) {
  CLAMPS.push('-- ' + sh.name);
  P = Object.assign({}, BASE, sh.prof || {});
  const J = fig(sh.o);
  if (sh.stand) {
    let m = 1e9;
    for (const k in J) m = Math.min(m, J[k][1]);
    const dy = 0.035 * P.h - m;
    for (const k in J) J[k] = [J[k][0], J[k][1] + dy, J[k][2]];
    BL = BL.map((b) => {
      const n = b.map((q) => [q[0], q[1] + dy, q[2]]);
      if (b.lines) n.lines = b.lines.map((L) => L.map((q) => ({ p: [q.p[0], q.p[1] + dy, q.p[2]], n: q.n })));
      n.tag = b.tag;
      n.par = b.par;
      if (b.head) n.head = Object.assign({}, b.head, { c: [b.head.c[0], b.head.c[1] + dy, b.head.c[2]] });
      return n;
    });
    EX = EX.map((e) =>
      Object.assign({}, e, { A: [e.A[0], e.A[1] + dy, e.A[2]], B: [e.B[0], e.B[1] + dy, e.B[2]] }),
    );
  }
  const f = nrm(sub(sh.at, sh.pos)),
    r0 = nrm(crs(f, [0, 1, 0])),
    u0 = crs(r0, f),
    ro = sh.roll || 0,
    r = add(mul(r0, cos(ro)), mul(u0, sin(ro))),
    u = add(mul(r0, -sin(ro)), mul(u0, cos(ro)));
  const cs = (P) => {
    const d = sub(P, sh.pos);
    return [dot(d, r), dot(d, u), dot(d, f)];
  };
  let x0 = 1e9,
    x1 = -1e9,
    y0 = 1e9,
    y1 = -1e9;
  for (const k in J) {
    const q = cs(J[k]),
      z = Math.max(q[2], 0.05),
      pad = (k === 'head' ? 0.16 : 0.08) / z,
      x = q[0] / z,
      y = q[1] / z;
    x0 = Math.min(x0, x - pad);
    x1 = Math.max(x1, x + pad);
    y0 = Math.min(y0, y - pad);
    y1 = Math.max(y1, y + pad);
  }
  let m = 20,
    s = Math.min((W - 2 * m) / (x1 - x0), (H - 2 * m) / (y1 - y0)) * (sh.zoom || 1),
    ox = W / 2 - (s * (x0 + x1)) / 2,
    oy = H / 2 + (s * (y0 + y1)) / 2;
  if (sh.fix) {
    s = sh.fix.s;
    ox = sh.fix.ox;
    oy = sh.fix.oy;
  }
  const P2 = (P) => {
    const q = cs(P),
      z = Math.max(q[2], 0.05);
    return [ox + (s * q[0]) / z, oy - (s * q[1]) / z, z, s / z];
  };
  const ring = (c, ax, rad) => {
    const a = nrm(ax),
      uu = nrm(crs(a, Math.abs(a[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0])),
      vv = crs(a, uu),
      p = [];
    for (let i = 0; i <= 17; i++) {
      const t = (i * 6.2832) / 16;
      p.push(P2(add(c, add(mul(uu, rad * cos(t)), mul(vv, rad * sin(t))))));
    }
    return p;
  };
  let o = '';
  if (sh.fx === 'radial') {
    const c = P2(J[sh.foc]);
    for (let i = 0; i < 48; i++) {
      const a = rnd() * 6.2832,
        r0 = 88 + rnd() * 55;
      o +=
        '<path d="M' +
        (c[0] + cos(a) * r0).toFixed(1) +
        ' ' +
        (c[1] + sin(a) * r0).toFixed(1) +
        'L' +
        (c[0] + cos(a) * 420).toFixed(1) +
        ' ' +
        (c[1] + sin(a) * 420).toFixed(1) +
        '" class="fx"/>';
    }
  }
  if (sh.fx === 'speed') {
    for (let i = 0; i < 34; i++) {
      const x = 12 + rnd() * (W - 24),
        ya = 20 + rnd() * 120,
        l = 30 + rnd() * 90;
      o +=
        '<path d="M' +
        x.toFixed(1) +
        ' ' +
        ya.toFixed(1) +
        'L' +
        (x + (rnd() - 0.5) * 3).toFixed(1) +
        ' ' +
        (ya + l).toFixed(1) +
        '" class="fx"/>';
    }
  }
  if (sh.fx === 'ground') {
    for (let i = 0; i < 16; i++) {
      const a = (i * 6.2832) / 16 + rnd() * 0.3,
        ra = 0.45 + rnd() * 0.2,
        rb = 1 + rnd() * 0.9;
      o += strk(
        seg(P2([cos(a) * ra, 0, sin(a) * ra + 0.1]), P2([cos(a) * rb, 0, sin(a) * rb + 0.1]), 0),
        'fx',
        1,
        0.6,
      );
    }
  }
  if (sh.ground) {
    ['lToe', 'rToe', 'lHa', 'rHa', 'rKn'].forEach((k) => {
      if (J[k][1] < 0.12) {
        const g = [J[k][0], 0, J[k][2]];
        o += strk(seg(P2(add(g, mul(r, -0.22))), P2(add(g, mul(r, 0.26))), 4), 'ink', 2, 0.6, 1.1);
      }
    });
  }
  const items = LIMBS.map((l) => {
    const A = J[l[0]],
      B = J[l[1]],
      a = P2(A),
      b = P2(B);
    const sc = l[1] === 'chin' ? HS : GS;
    return { z: (a[2] + b[2]) / 2, A, B, a, b, ra: l[2] * sc, rb: l[3] * sc, cl: l[4], k: l[1] };
  });
  const TH = {};
  BL.forEach((b) => {
    const q = b.map(P2),
      hl = hull2(q);
    if (b.tag) TH[b.tag] = hl;
    items.push({
      z: q.reduce((t, p) => t + p[2], 0) / q.length,
      blob: hl,
      sc: q[0][3],
      head: b.head,
      lines: b.lines,
      par: b.par,
    });
  });
  EX.forEach((e) => {
    const a = P2(e.A),
      b = P2(e.B);
    items.push({ z: (a[2] + b[2]) / 2, A: e.A, B: e.B, a, b, ra: e.ra, rb: e.rb, cl: 1, k: 'x' });
  });
  (sh.props || []).forEach((pr) => {
    if (pr.t === 'bar') {
      const a = P2(pr.a),
        b = P2(pr.b);
      items.push({ z: (a[2] + b[2]) / 2, A: pr.a, B: pr.b, a, b, ra: pr.r, rb: pr.r, cl: 1, k: 'x' });
    } else {
      let c = pr.c || add(lerp(J[pr.mid[0]], J[pr.mid[1]], 0.5), pr.off || [0, 0, 0]);
      if (pr.floor) c = [c[0], pr.size[1] / 2, c[2]];
      const R = Ry((pr.yaw || 0) * D),
        cn = [];
      for (let i = 0; i < 8; i++)
        cn.push(
          add(
            c,
            mv(R, [
              ((i & 1 ? 1 : -1) * pr.size[0]) / 2,
              ((i & 2 ? 1 : -1) * pr.size[1]) / 2,
              ((i & 4 ? 1 : -1) * pr.size[2]) / 2,
            ]),
          ),
        );
      const q = cn.map(P2);
      let ni = 0;
      q.forEach((p, i) => {
        if (p[2] < q[ni][2]) ni = i;
      });
      items.push({
        z: q.reduce((t, p) => t + p[2], 0) / 8 + (pr.bias || 0),
        blob: hull2(q),
        sc: q[0][3],
        box: [q[ni], q[ni ^ 1], q[ni ^ 2], q[ni ^ 4]],
      });
    }
  });
  items.sort((p, q) => q.z - p.z);
  items.forEach((it) => {
    if (it.blob) {
      const h = it.blob.concat(it.blob.slice(0, 3));
      o +=
        '<path d="' +
        pd(it.blob) +
        'Z" class="pap"/>' +
        (() => {
          const sw = Math.min(2, 0.8 + (it.sc * 0.1) / 24),
            pp = it.par && TH[it.par];
          if (!pp) return strk(h, 'ink', 1, 0.5, sw);
          const inP = (pt) => {
              let c = false;
              for (let i = 0, j = pp.length - 1; i < pp.length; j = i++) {
                const a = pp[i],
                  b = pp[j];
                if (
                  a[1] > pt[1] !== b[1] > pt[1] &&
                  pt[0] < ((b[0] - a[0]) * (pt[1] - a[1])) / (b[1] - a[1]) + a[0]
                )
                  c = !c;
              }
              return c;
            },
            dn = [];
          for (let i = 0; i < it.blob.length; i++) {
            const a = it.blob[i],
              b = it.blob[(i + 1) % it.blob.length],
              n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 3));
            for (let k = 0; k < n; k++)
              dn.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
          }
          let st = dn.findIndex((q) => inP(q));
          if (st < 0) return strk(h, 'ink', 1, 0.5, sw);
          let r = '',
            sg = [];
          for (let i = 1; i <= dn.length; i++) {
            const q = dn[(st + i) % dn.length];
            if (!inP(q)) sg.push(q);
            else {
              if (sg.length > 2) r += strk(sg, 'ink', 1, 0.4, sw);
              sg = [];
            }
          }
          if (sg.length > 2) r += strk(sg, 'ink', 1, 0.4, sw);
          return r;
        })();
      if (it.lines)
        it.lines.forEach((L) => {
          let sg = [];
          L.forEach((q) => {
            if (dot(q.n, sub(sh.pos, q.p)) > 0) sg.push(P2(q.p));
            else {
              if (sg.length > 1) o += strk(sg, 'ink', 1, 0.25, 1);
              sg = [];
            }
          });
          if (sg.length > 1) o += strk(sg, 'ink', 1, 0.25, 1);
        });
      if (it.box)
        [1, 2, 3].forEach((i) => {
          o += strk(seg(it.box[0], it.box[i], 2), 'ink', 1, 0.4, 1);
        });
      if (it.head) {
        const H = it.head,
          sw = Math.min(1.6, 0.7 + (it.sc * 0.1) / 30),
          arc = (fn) => {
            let sg = [],
              r = '';
            for (let t = -90; t <= 90; t += 10) {
              const l = fn(t * D),
                w = add(H.c, mv(H.R, l)),
                nn = mv(H.R, [l[0] / (H.a * H.a), l[1] / (H.b * H.b), l[2] / (H.d * H.d)]);
              if (dot(nn, sub(sh.pos, w)) > 0) sg.push(P2(w));
              else {
                if (sg.length > 1) r += strk(sg, 'ink', 1, 0.25, sw);
                sg = [];
              }
            }
            if (sg.length > 1) r += strk(sg, 'ink', 1, 0.25, sw);
            return r;
          };
        o += arc((t) => [0, H.b * sin(t), H.d * cos(t)]) + arc((t) => [H.a * sin(t), -0.012, H.d * cos(t)]);
      }
      return;
    }
    const r1 = it.ra * it.a[3],
      r2 = it.rb * it.b[3],
      R = Math.max(r1, r2),
      sw = Math.min(2.1, 0.7 + R / 24),
      amp = Math.min(1.3, 0.35 + R * 0.03),
      t = tang(it.a, r1, it.b, r2);
    o += '<path d="' + pd(hull(it.a, r1, it.b, r2)) + 'Z" class="pap"/>';
    if (it.cl || !t) o += strk(hull(it.a, r1, it.b, r2), 'ink', it.cl === 2 ? 1 : 2, amp, sw);
    else
      [1, -1].forEach((g) => {
        const an = t.th + g * t.ph,
          p = [it.a[0] + r1 * cos(an), it.a[1] + r1 * sin(an)],
          q = [it.b[0] + r2 * cos(an), it.b[1] + r2 * sin(an)],
          shd = cos(an) * 0.6 + sin(an) * 0.8 > 0;
        o += strk(seg(p, q, 5), 'ink', shd ? 2 : 1, amp, shd ? sw * 1.45 : sw);
      });

    if (it.k === 'chin') {
      const up = nrm(sub(J.head, J.neck)),
        fc = FACE,
        sd = crs(up, fc);
      for (let k = 9; k <= 2; k++) {
        const d = nrm(add(add(up, mul(fc, -0.35)), mul(sd, k * 0.42))),
          tip = P2(add(J.head, mul(nrm(add(d, mul(fc, -0.45))), 0.21)));
        o += strk(
          [
            P2(add(J.head, mul(nrm(add(d, mul(sd, 0.25))), 0.1))),
            tip,
            P2(add(J.head, mul(nrm(add(d, mul(sd, -0.25))), 0.1))),
          ],
          'ink',
          2,
          0.4,
          sw,
        );
      }
      o += strk(
        seg(P2(add(J.head, mul(fc, 0.1 * HS))), P2(add(J.head, add(mul(fc, 0.135 * HS), mul(up, -0.03)))), 1),
        'ink',
        1,
        0.3,
        sw,
      );
      o +=
        '<g class="c">' +
        strk(ring(J.head, up, 0.1 * HS), 'con', 1, 0.3) +
        strk(ring(J.head, sd, 0.1 * HS), 'con', 1, 0.3) +
        '</g>';
    }
    if (it.k.slice(1) === 'Ha' && sh.open && sh.open.indexOf(it.k[0]) >= 0) {
      const hd = nrm(sub(it.B, it.A)),
        pv = nrm(crs(hd, r));
      for (let k = -1.5; k <= 1.5; k++) {
        o += strk(
          seg(P2(add(it.B, mul(pv, k * 0.022))), P2(add(it.B, mul(nrm(add(hd, mul(pv, k * 0.4))), 0.1))), 1),
          'ink',
          2,
          0.4,
          sw * 1.2,
        );
      }
    }
    o +=
      '<g class="c">' +
      strk(ring(lerp(it.A, it.B, 0.5), sub(it.B, it.A), (it.ra + it.rb) / 2), 'con', 1, 0.3) +
      '</g>';
  });
  o += '<g class="c">';
  BONES.forEach((b) => {
    o += strk(seg(P2(J[b[0]]), P2(J[b[1]]), 0), 'bone', 1, 0.4);
  });
  for (const k in J) {
    if (k === 'head') continue;
    const p = P2(J[k]);
    o +=
      '<circle cx="' +
      p[0].toFixed(1) +
      '" cy="' +
      p[1].toFixed(1) +
      '" r="' +
      Math.max(1.4, Math.min(4, 0.022 * p[3])).toFixed(1) +
      '" class="jt"/>';
  }
  const lp = sh.loa.map((k) => P2(J[k]));
  let d = 'M' + lp[0][0].toFixed(1) + ' ' + lp[0][1].toFixed(1);
  for (let i = 1; i < lp.length - 1; i++) {
    const e =
      i === lp.length - 2 ? lp[i + 1] : [(lp[i][0] + lp[i + 1][0]) / 2, (lp[i][1] + lp[i + 1][1]) / 2];
    d +=
      'Q' + lp[i][0].toFixed(1) + ' ' + lp[i][1].toFixed(1) + ' ' + e[0].toFixed(1) + ' ' + e[1].toFixed(1);
  }
  o += '<path d="' + d + '" class="loa"/></g>';
  const e = 8;
  if (!sh.noframe)
    [
      [
        [e, e],
        [W - e, e],
      ],
      [
        [W - e, e],
        [W - e, H - e],
      ],
      [
        [W - e, H - e],
        [e, H - e],
      ],
      [
        [e, H - e],
        [e, e],
      ],
    ].forEach((l) => {
      o += strk(seg(l[0], l[1], 7), 'ink', 2, 0.7, 1.3);
    });
  return o;
}
// ---- 7. Public API -------------------------------------------------------
const PROFILES = require('./profiles.json');
const PAPER = '#F1EFE8';
const css = (con) =>
  '.ink{fill:none;stroke:#2C2C2A;stroke-linecap:round;stroke-linejoin:round;opacity:.85}.fx{fill:none;stroke:#2C2C2A;stroke-width:.6;opacity:.5}.con{fill:none;stroke:#185FA5;stroke-width:.7;opacity:.75}.bone{fill:none;stroke:#993C1D;stroke-width:.9;opacity:.85}.loa{fill:none;stroke:#D85A30;stroke-width:2.4;opacity:.5}.jt{fill:#D85A30}.pap{fill:' +
  PAPER +
  ';stroke:none}text{font:11px sans-serif;fill:#2C2C2A}' +
  (con ? '' : '.c{display:none}');
function bars(a, b, r, step) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]),
    n = Math.max(1, Math.round(L / step)),
    out = [];
  for (let i = 0; i < n; i++) out.push({ t: 'bar', a: lerp(a, b, i / n), b: lerp(a, b, (i + 1) / n), r });
  return out;
}
// Expand compound props (ladder, railing) into bars; boxes and bars pass through.
function expandProps(props) {
  let out = [];
  props.forEach((p) => {
    if (p.t === 'ladder') {
      const hw = p.halfWidth || 0.22,
        sp = p.rungSpacing || 0.3;
      [-hw, hw].forEach((x) => {
        out = out.concat(bars(add(p.base, [x, 0, 0]), add(p.top, [x, 0, 0]), 0.025, 0.45));
      });
      const hgt = p.top[1] - p.base[1];
      for (let k = 1; sp * k < hgt - 0.05; k++) {
        const c = lerp(p.base, p.top, (sp * k) / hgt);
        out.push({ t: 'bar', a: add(c, [-hw, 0, 0]), b: add(c, [hw, 0, 0]), r: 0.015 });
      }
    } else if (p.t === 'railing') {
      const hgt = p.height || 1.05,
        sp = p.balusterSpacing || 0.16,
        up = (y) => (q) => [q[0], q[1] + y, q[2]],
        L = Math.hypot(p.to[0] - p.from[0], p.to[2] - p.from[2]);
      out = out.concat(
        bars(up(hgt)(p.from), up(hgt)(p.to), 0.03, 0.4),
        bars(up(0.08)(p.from), up(0.08)(p.to), 0.02, 0.4),
      );
      for (let d = 0.1; d <= L - 0.1 + 1e-6; d += sp) {
        const c = lerp(p.from, p.to, d / L);
        out.push({ t: 'bar', a: up(0.08)(c), b: up(hgt)(c), r: 0.012 });
      }
    } else out.push(p);
  });
  return out;
}
// Convert a scene record (see README) into the renderer's internal form.
function toInternal(sc) {
  const prof = typeof sc.profile === 'string' ? PROFILES[sc.profile] : sc.profile || {};
  if (!prof) throw new Error('Unknown profile: ' + sc.profile);
  const c = sc.camera;
  return {
    name: sc.name,
    prof,
    pos: c.pos,
    at: c.at,
    roll: (c.rollDeg || 0) * D,
    zoom: c.zoom || 1,
    stand: sc.stand,
    ground: sc.ground,
    props: expandProps(sc.props || []),
    loa: sc.lineOfAction || ['head', 'neck', 'pelvis'],
    o: sc.pose,
  };
}
// Render one scene as a standalone SVG. Returns {svg, warnings}.
function renderFrame(scene, opts) {
  opts = opts || {};
  rnd = rng(opts.seed || 11);
  CLAMPS = [];
  const k = opts.scale || 3,
    body = draw(toInternal(scene));
  return {
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      W * k +
      '" height="' +
      H * k +
      '" viewBox="0 0 ' +
      W +
      ' ' +
      H +
      '"><style>' +
      css(opts.construction) +
      '</style><rect width="' +
      W +
      '" height="' +
      H +
      '" fill="' +
      PAPER +
      '"/>' +
      body +
      '</svg>',
    warnings: CLAMPS.filter((c) => c.slice(0, 2) !== '--'),
  };
}
// Render several scenes as a labelled contact sheet.
function renderSheet(scenes, opts) {
  opts = opts || {};
  const cols = opts.cols || 3,
    rows = Math.ceil(scenes.length / cols),
    cw = W + 10,
    ch = H + 26;
  let out =
    '<svg xmlns="http://www.w3.org/2000/svg" width="' +
    cols * cw * 2 +
    '" height="' +
    rows * ch * 2 +
    '" viewBox="0 0 ' +
    cols * cw +
    ' ' +
    rows * ch +
    '"><style>' +
    css(opts.construction) +
    '</style><rect width="100%" height="100%" fill="#fff"/>';
  scenes.forEach((sc, i) => {
    rnd = rng(opts.seed || 11);
    CLAMPS = [];
    const x = 5 + (i % cols) * cw,
      y = 5 + Math.floor(i / cols) * ch;
    out +=
      '<svg x="' +
      x +
      '" y="' +
      y +
      '" width="' +
      W +
      '" height="' +
      H +
      '" viewBox="0 0 ' +
      W +
      ' ' +
      H +
      '"><rect width="' +
      W +
      '" height="' +
      H +
      '" fill="' +
      PAPER +
      '"/>' +
      draw(toInternal(sc)) +
      '</svg><text x="' +
      (x + 4) +
      '" y="' +
      (y + H + 15) +
      '">' +
      sc.name +
      '</text>';
  });
  return out + '</svg>';
}
// Render every profile standing side by side at a common scale.
function renderLineup(opts) {
  opts = opts || {};
  rnd = rng(opts.seed || 11);
  CLAMPS = [];
  const names = opts.profiles || Object.keys(PROFILES),
    yaw = opts.yaw === undefined ? 35 : opts.yaw,
    WL = 60 + names.length * 93,
    HL = 300,
    cx = (names.length - 1) * 0.42;
  let out =
    '<svg xmlns="http://www.w3.org/2000/svg" width="' +
    WL * 2 +
    '" height="' +
    HL * 2 +
    '" viewBox="0 0 ' +
    WL +
    ' ' +
    HL +
    '"><style>' +
    css(opts.construction) +
    'text{text-anchor:middle}</style><rect width="' +
    WL +
    '" height="' +
    HL +
    '" fill="' +
    PAPER +
    '"/><path d="M20 251H' +
    (WL - 20) +
    '" class="ink" stroke-width="1"/>';
  names.forEach((n, i) => {
    const x = i * 0.84;
    out +=
      draw({
        name: n,
        prof: PROFILES[n],
        stand: 1,
        noframe: 1,
        pos: [cx, 1, 30],
        at: [cx, 1, 0],
        fix: { s: 3300, ox: WL / 2, oy: 140 },
        loa: ['head', 'neck', 'pelvis'],
        o: {
          root: { p: [x, 1, 0], yaw },
          lSh: [5, 8, 0],
          lEl: 15,
          rSh: [-5, 8, 0],
          rEl: 15,
          lHip: [3, -1, 0],
          rHip: [-3, -1, 0],
          lHand: 'open',
          rHand: 'open',
        },
      }) +
      '<text x="' +
      (WL / 2 + 110 * (x - cx)).toFixed(0) +
      '" y="270">' +
      n +
      '</text>';
  });
  return out + '</svg>';
}
module.exports = {
  renderFrame,
  renderSheet,
  renderLineup,
  PROFILES,
  LIMITS: LIM,
  FRAME: { width: W, height: H },
};
