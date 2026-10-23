'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { isClean } from '../lib/profanity';

const PRACTICES = [
  { key: 'prayer', label: 'صليت النهارده' },
  { key: 'bible', label: 'قريت من الكتاب المقدس' },
  { key: 'meeting', label: 'حضرت اجتماع أو مدرسة أحد' },
];
const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

// ستريك لطيف: يوم سماح واحد مسموح جوه السلسلة
function streakOf(days) {
  const set = new Set(days);
  const d = new Date();
  if (!set.has(iso(d))) d.setDate(d.getDate() - 1);
  let n = 0, grace = true;
  for (let i = 0; i < 400; i++) {
    if (set.has(iso(d))) n++;
    else if (grace && n > 0) grace = false;
    else break;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export default function Home() {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(undefined);
  const [rows, setRows] = useState([]);
  const [nick, setNick] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setProfile(session === null ? null : undefined); return; }
    (async () => {
      const { data: p } = await supabase.from('profiles').select('nickname,is_admin').eq('id', session.user.id).maybeSingle();
      setProfile(p ?? null);
      if (p) {
        const { data: c } = await supabase.from('checkins').select('day,practice');
        setRows(c ?? []);
      }
    })();
  }, [session]);

  const signIn = () => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });

  async function saveNick(e) {
    e.preventDefault(); setMsg('');
    const n = nick.trim();
    if (n.length < 2 || n.length > 24) return setMsg('الاسم من حرفين لـ 24 حرف.');
    if (!isClean(n)) return setMsg('الاسم ده فيه لفظ مش مناسب هنا. جرّب اسم تاني.');
    const { error } = await supabase.from('profiles').insert({ id: session.user.id, nickname: n });
    if (error) return setMsg(error.code === '23505' ? 'الاسم ده واخده حد. جرّب اسم تاني.' : 'حصلت مشكلة، حاول تاني.');
    setProfile({ nickname: n, is_admin: false });
  }

  async function toggle(key) {
    const day = iso(new Date());
    const has = rows.some((r) => r.day === day && r.practice === key);
    if (has) {
      const { error } = await supabase.from('checkins').delete().eq('user_id', session.user.id).eq('day', day).eq('practice', key);
      if (!error) setRows(rows.filter((r) => !(r.day === day && r.practice === key)));
    } else {
      const { error } = await supabase.from('checkins').insert({ user_id: session.user.id, day, practice: key });
      if (!error) setRows([...rows, { day, practice: key }]);
    }
  }

  if (session === undefined || (session && profile === undefined)) return <main><h1>خطوة</h1><p className="muted">لحظة...</p></main>;

  if (!session) return (
    <main>
      <h1>خطوة</h1>
      <p>خطوة صغيرة كل يوم، سوا. من غير لوم ومن غير ضغط.</p>
      <button className="primary" onClick={signIn}>الدخول بحساب جوجل</button>
      <p className="muted">بنسجّل اسمك المستعار بس. الاعتراف والحالة المزاجية خاصين بيك دايماً.</p>
    </main>
  );

  if (!profile) return (
    <main>
      <h1>خطوة</h1>
      <form className="card" onSubmit={saveNick}>
        <p>اختار اسم مستعار هيظهر لأصحابك:</p>
        <input value={nick} onChange={(e) => setNick(e.target.value)} maxLength={24} placeholder="مثلاً: مسافر" />
        {msg && <p className="err">{msg}</p>}
        <button className="primary" type="submit">يلا نبدأ</button>
      </form>
    </main>
  );

  const today = iso(new Date());
  const streak = streakOf(rows.filter((r) => r.practice === 'prayer').map((r) => r.day));
  return (
    <main>
      <h1>خطوة</h1>
      <p>أهلاً يا {profile.nickname}</p>
      <div className="card">
        <div className="streak">{streak} يوم</div>
        <div className="muted">{streak === 0 ? 'النهارده بداية جديدة. خطوة واحدة تكفي.' : 'كمّل، وأي يوم فاتك مش بيكسر حاجة.'}</div>
      </div>
      {PRACTICES.map((p) => {
        const on = rows.some((r) => r.day === today && r.practice === p.key);
        return <button key={p.key} className={on ? 'on' : ''} onClick={() => toggle(p.key)}>{on ? '✓ ' : ''}{p.label}</button>;
      })}
      <p><button className="link" onClick={() => supabase.auth.signOut()}>تسجيل الخروج</button></p>
    </main>
  );
}
