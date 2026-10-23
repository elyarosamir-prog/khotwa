// فلتر الألفاظ. القائمة دي بداية فقط: وسّعها (عربي، عامية، فرانكو) قبل فتح الموقع.
const BLOCKED = ['كلب', 'حمار', 'غبي', 'stupid', 'idiot'];

export function normalize(s) {
  return s
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0640]/g, '')      // التشكيل والتطويل
    .replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/[^a-z0-9\u0600-\u06FF]/g, '')     // الفواصل والرموز
    .replace(/(.)\1+/g, '$1');                  // الحروف المتكررة
}

export function isClean(text) {
  const t = normalize(text);
  return !BLOCKED.some((w) => t.includes(normalize(w)));
}
