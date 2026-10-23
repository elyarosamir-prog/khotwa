# خطوة: النسخة التجريبية الأولى

## الخطوات
1. **Supabase:** أنشئ مشروع جديد > SQL Editor > الصق محتوى `supabase/schema.sql` وشغّله.
2. **دخول جوجل:** في Google Cloud Console أنشئ OAuth Client (Web). في Supabase > Authentication > Providers فعّل Google والصق الـ Client ID والـ Secret. انسخ Callback URL من Supabase وحطه في Authorized redirect URIs عند جوجل.
3. **GitHub:** ارفع محتوى المجلد ده على مستودع جديد.
4. **Vercel:** استورد المستودع، وأضف متغيرين `NEXT_PUBLIC_SUPABASE_URL` و`NEXT_PUBLIC_SUPABASE_ANON_KEY` من Supabase > Project Settings > API.
5. **بعد النشر:** في Supabase > Authentication > URL Configuration حط رابط Vercel في Site URL وRedirect URLs.
6. **أنت أدمن:** سجّل دخول مرة، ثم في SQL Editor: `update profiles set is_admin = true where nickname = 'اسمك';`

## ناقص عمداً (النسخة الجاية)
الجروبات ولوحة الترتيب، لوحة الأدمن، الصور، الآيات، الإشعارات، الاعتراف والتناول، وفحص الألفاظ على السيرفر. وقائمة الألفاظ في `lib/profanity.js` بداية فقط ومحتاجة توسيع.
