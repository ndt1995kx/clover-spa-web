/* ============================================================
   Sinh ban tinh cho tung ngon ngu tu index.html.
   Dung dung DOM API ma trinh duyet dung (jsdom) chu khong
   thay chuoi bang regex, de ket qua giong het khi bam nut.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const GOC = process.argv[2];
const RA = process.argv[3];
const MIEN = 'https://cloverspa.vn';

const src = fs.readFileSync(GOC, 'utf8');

/* --- Lay object I18N ra khoi the script, can bang ngoac --- */
function bocI18N(s) {
  const i = s.indexOf('var I18N = {');
  if (i < 0) throw new Error('Khong tim thay I18N');
  let j = s.indexOf('{', i), sau = 0, trong = null, esc = false;
  for (let k = j; k < s.length; k++) {
    const c = s[k];
    if (trong) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === trong) trong = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { trong = c; continue; }
    if (c === '{') sau++;
    else if (c === '}') { sau--; if (sau === 0) return s.slice(j, k + 1); }
  }
  throw new Error('I18N khong dong ngoac');
}
const I18N = vm.runInNewContext('(' + bocI18N(src) + ')');

/* --- Cau hinh tung ban --- */
const BAN = [
  { ma: 'VI', thumuc: '',   lang: 'vi', duong: '/',    oglocale: 'vi_VN' },
  { ma: 'VI', thumuc: 'vn', lang: 'vi', duong: '/vn/', oglocale: 'vi_VN', trung: true },
  { ma: 'EN', thumuc: 'en', lang: 'en', duong: '/en/', oglocale: 'en_US' },
  { ma: 'KO', thumuc: 'kr', lang: 'ko', duong: '/kr/', oglocale: 'ko_KR' },
  { ma: 'ZH', thumuc: 'cn', lang: 'zh', duong: '/cn/', oglocale: 'zh_CN' },
  { ma: 'RU', thumuc: 'ru', lang: 'ru', duong: '/ru/', oglocale: 'ru_RU' },
];

/* hreflang tro vao ban chinh tac cua tung ngon ngu.
   Tieng Viet chinh tac la `/`, con `/vn` chi la ban trung giu cho
   duong dan cu khong 404 nen khong dua vao cum hreflang. */
const CUM = BAN.filter(b => !b.trung).map(b => ({ code: b.lang, href: MIEN + b.duong }));

/* --- Doc tu dien tieng Viet tu chinh DOM, giong ham luuVI() --- */
function docVI(doc) {
  const VI = {};
  doc.querySelectorAll('[data-i18n]').forEach(e => { VI[e.dataset.i18n] = e.textContent; });
  doc.querySelectorAll('[data-i18n-t1]').forEach(e => { if (e.firstChild) VI[e.dataset.i18nT1] = e.firstChild.nodeValue; });
  doc.querySelectorAll('[data-i18n-ph]').forEach(e => { VI[e.dataset.i18nPh] = e.placeholder; });
  doc.querySelectorAll('[data-i18n-al]').forEach(e => { VI[e.dataset.i18nAl] = e.getAttribute('aria-label'); });
  doc.querySelectorAll('[data-i18n-alt]').forEach(e => { VI[e.dataset.i18nAlt] = e.alt; });
  VI.doc_title = doc.title;
  const md = doc.querySelector('meta[name="description"]');
  VI.doc_desc = md ? md.content : '';
  return VI;
}

const VI = docVI(new JSDOM(src).window.document);

/* --- Dat mot the vao head, tao moi neu chua co --- */
function datThe(doc, chon, tao, thuoctinh) {
  let e = doc.querySelector(chon);
  if (!e) { e = doc.createElement(tao); doc.head.appendChild(e); }
  for (const k of Object.keys(thuoctinh)) e.setAttribute(k, thuoctinh[k]);
  return e;
}

/* --- Chep anh va file SEO sang thu muc dich de dist/ chay duoc ngay --- */
const GOCDIR = path.dirname(path.resolve(GOC));
fs.mkdirSync(RA, { recursive: true });

/* Chi chep anh ma trang that su goi toi. Thu muc images/ con nhieu anh cu
   khong dung den, khong can day len host. */
const anhCanDung = new Set();
{
  const d = new JSDOM(src).window.document;
  d.querySelectorAll('[src],[href],[data-img]').forEach(e => {
    ['src', 'href', 'data-img'].forEach(t => {
      const v = e.getAttribute(t);
      if (v && (v.indexOf('images/') === 0 || v.indexOf('files/') === 0)) anhCanDung.add(v);
    });
  });
  /* Anh cua lop phu menu duoc JS ghep duong dan luc chay nen khong nam trong
     thuoc tinh nao. Quet thang trong nguon de khong bo sot khi chep. */
  for (const m of src.matchAll(/(?:images|files)\/[A-Za-z0-9._\/-]+\.(?:jpe?g|png|webp|svg|pdf)/g)) {
    anhCanDung.add(m[0]);
  }
  /* 10 trang menu, dat ten theo dung so P cua file goc (P3..P12) */
  for (let i = 3; i <= 12; i++) {
    const so = ('0' + i).slice(-2);
    anhCanDung.add('images/menu/menu-p' + so + '.webp');
    anhCanDung.add('images/menu/menu-p' + so + '.jpg');
  }
}
let soAnh = 0;
for (const rel of anhCanDung) {
  const tu = path.join(GOCDIR, rel), den = path.join(RA, rel);
  if (!fs.existsSync(tu)) { console.warn('THIEU ANH:', rel); continue; }
  fs.mkdirSync(path.dirname(den), { recursive: true });
  fs.copyFileSync(tu, den);
  soAnh++;
}
for (const f of ['robots.txt', 'sitemap.xml']) {
  const a = path.join(GOCDIR, f);
  if (fs.existsSync(a)) fs.copyFileSync(a, path.join(RA, f));
}

const bienBan = [];

for (const b of BAN) {
  const dom = new JSDOM(src);
  const doc = dom.window.document;
  const tra = k => {
    const bang = b.ma === 'VI' ? VI : (I18N[b.ma] || VI);
    return bang[k] != null ? bang[k] : VI[k];
  };

  /* --- Dich noi dung, dung dung thu tu nhu doiNgonNgu() --- */
  let dem = 0;
  if (b.ma !== 'VI') {
    doc.querySelectorAll('[data-i18n]').forEach(e => { const v = tra(e.dataset.i18n); if (v != null) { e.textContent = v; dem++; } });
    doc.querySelectorAll('[data-i18n-t1]').forEach(e => { const v = tra(e.dataset.i18nT1); if (v != null && e.firstChild) { e.firstChild.nodeValue = v; dem++; } });
    doc.querySelectorAll('[data-i18n-ph]').forEach(e => { const v = tra(e.dataset.i18nPh); if (v != null) { e.placeholder = v; dem++; } });
    doc.querySelectorAll('[data-i18n-al]').forEach(e => { const v = tra(e.dataset.i18nAl); if (v != null) { e.setAttribute('aria-label', v); dem++; } });
    doc.querySelectorAll('[data-i18n-alt]').forEach(e => { const v = tra(e.dataset.i18nAlt); if (v != null) { e.alt = v; dem++; } });
  }

  /* --- Phan head --- */
  doc.documentElement.lang = b.lang;
  /* Bao cho JS trong trang biet ban nay dang o ngon ngu nao, de phan chu do JS
     sinh ra luc chay (lop phu menu) khong bi roi ve tieng Viet. */
  doc.documentElement.setAttribute('data-ngonngu', b.ma);
  doc.title = tra('doc_title');
  datThe(doc, 'meta[name="description"]', 'meta', { name: 'description', content: tra('doc_desc') });

  /* Ban /vn la ban trung, canonical tro ve / de Google gop lai mot moi */
  datThe(doc, 'link[rel="canonical"]', 'link', { rel: 'canonical', href: b.trung ? MIEN + '/' : MIEN + b.duong });

  /* Cum hreflang: xoa het roi dat lai cho day du va tro dung ban chinh tac */
  doc.querySelectorAll('link[rel="alternate"][hreflang]').forEach(e => e.remove());
  const moc = doc.querySelector('link[rel="canonical"]');
  const them = (code, href) => {
    const l = doc.createElement('link');
    l.setAttribute('rel', 'alternate');
    l.setAttribute('hreflang', code);
    l.setAttribute('href', href);
    moc.parentNode.insertBefore(l, moc.nextSibling);
  };
  them('x-default', MIEN + '/');
  [...CUM].reverse().forEach(c => them(c.code, c.href));

  /* Open Graph theo dung ngon ngu cua ban nay */
  datThe(doc, 'meta[property="og:locale"]', 'meta', { property: 'og:locale', content: b.oglocale });
  datThe(doc, 'meta[property="og:url"]', 'meta', { property: 'og:url', content: MIEN + b.duong });
  /* og:title giu dung mau cua ban goc: "Clover Spa · <cau hero dong 2>".
     Ban tieng Viet nho vay giu nguyen chu khong bi thay bang title SEO. */
  const ogTitle = 'Clover Spa · ' + tra('hero_l2');
  datThe(doc, 'meta[property="og:title"]', 'meta', { property: 'og:title', content: ogTitle });
  datThe(doc, 'meta[name="twitter:title"]', 'meta', { name: 'twitter:title', content: ogTitle });
  /* Mo ta chia se: ban tieng Viet giu nguyen cau da viet tay, cac ban khac
     dung mo ta da dich vi khong co ban dich rieng cho cau ngan nay. */
  if (b.ma !== 'VI') {
    datThe(doc, 'meta[property="og:description"]', 'meta', { property: 'og:description', content: tra('doc_desc') });
    datThe(doc, 'meta[name="twitter:description"]', 'meta', { name: 'twitter:description', content: tra('doc_desc') });
  }
  doc.querySelectorAll('meta[property="og:locale:alternate"]').forEach(e => e.remove());
  CUM.filter(c => c.code !== b.lang).forEach(c => {
    const m = doc.createElement('meta');
    m.setAttribute('property', 'og:locale:alternate');
    m.setAttribute('content', BAN.find(x => x.lang === c.code).oglocale);
    doc.head.appendChild(m);
  });

  /* JSON-LD: inLanguage theo ban nay */
  const ld = doc.querySelector('script[type="application/ld+json"]');
  if (ld) ld.textContent = ld.textContent.replace('"inLanguage":"vi"', '"inLanguage":"' + b.lang + '"');

  /* Nut ngon ngu: danh dau ban dang xem, va cho moi nut mot duong dan that
     de Google bo duoc sang cac ban khac thay vi chi thay nut chay bang JS */
  /* Duong dan tuong doi chu khong tuyet doi: nhu vay chay dung ca khi site
     nam o goc ten mien (cloverspa.vn) lan khi nam trong thu muc con
     (ban xem thu tren GitHub Pages o /clover-spa-web/). */
  const lui = b.thumuc ? '../' : '';
  doc.querySelectorAll('.langs button').forEach(nut => {
    nut.setAttribute('aria-current', nut.dataset.short === b.ma ? 'true' : 'false');
    const dich = BAN.find(x => x.ma === nut.dataset.short && !x.trung);
    if (dich) nut.setAttribute('data-href', (lui + dich.duong.slice(1)) || './');
  });

  /* Lop phu menu ghep duong dan anh bang JS luc chay, khong qua thuoc tinh,
     nen phai bao rieng cho no biet phai lui may cap thu muc. */
  const lp = doc.getElementById('menuLb');
  if (lp) lp.setAttribute('data-base', b.thumuc ? '../' : '');

  /* Duong dan tuong doi: trang trong thu muc con phai lui mot cap moi thay anh */
  if (b.thumuc) {
    doc.querySelectorAll('[src],[href],[data-img]').forEach(e => {
      ['src', 'href', 'data-img'].forEach(t => {
        const v = e.getAttribute(t);
        if (v && (v.indexOf('images/') === 0 || v.indexOf('files/') === 0)) e.setAttribute(t, '../' + v);
      });
    });
  }

  /* --- Ghi file --- */
  const thumucRa = b.thumuc ? path.join(RA, b.thumuc) : RA;
  fs.mkdirSync(thumucRa, { recursive: true });
  const duongFile = path.join(thumucRa, 'index.html');
  fs.writeFileSync(duongFile, '<!DOCTYPE html>\n' + doc.documentElement.outerHTML, 'utf8');

  bienBan.push({
    ban: b.thumuc || '(goc)',
    lang: b.lang,
    khoaDaDich: dem,
    bytes: fs.statSync(duongFile).size,
    title: doc.title,
  });
}

console.log(JSON.stringify(bienBan, null, 1));
console.log('Da chep', soAnh, 'anh sang', RA);
console.log('So khoa trong tu dien VI:', Object.keys(VI).length);
for (const m of Object.keys(I18N)) {
  const thieu = Object.keys(VI).filter(k => I18N[m][k] == null);
  console.log('  ' + m + ': thieu ' + thieu.length + ' khoa' + (thieu.length ? ' -> ' + thieu.slice(0, 10).join(', ') : ''));
}
