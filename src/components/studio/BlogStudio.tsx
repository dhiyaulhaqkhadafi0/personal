"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import type { Session } from '@supabase/supabase-js';
import {
  ArrowLeft, Bold, Check, ChevronDown, Code2, Eye, Heading2, ImageIcon,
  Italic, Link2, List, ListOrdered, LoaderCircle, LogOut, Menu, Minus, Music2,
  Plus, Quote, Redo2, Save, Search, Send, Settings2, Strikethrough, Trash2,
  Undo2, Upload, X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { emptyTiptapDocument, slugify, type StudioArticle } from '@/lib/blog-types';
import { ArticleRenderer } from '@/components/shared/ArticleRenderer';

type SaveState = 'saved' | 'editing' | 'saving' | 'error';
type SettingsTab = 'article' | 'experience' | 'seo';

function formatRelativeTime(value: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return 'baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} jam lalu`;
  return `${Math.floor(minutes / 1440)} hari lalu`;
}

function LoginPanel({ onAuthenticated }: { onAuthenticated: (session: Session) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError || !data.session) { setError(authError?.message || 'Login gagal.'); return; }
    onAuthenticated(data.session);
  };

  return <main className="studio-login-shell">
    <div className="studio-login-card">
      <div className="studio-brand-mark">K</div>
      <span className="studio-eyebrow">KHADAFI · PRIVATE WORKSPACE</span>
      <h1>Masuk ke Blog Studio</h1>
      <p>Tulis, desain, dan publikasikan cerita langsung ke khadafidaffa.com.</p>
      <form onSubmit={signIn}>
        <label>Email admin<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@domain.com" /></label>
        <label>Password<input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></label>
        {error && <div className="studio-login-error">{error}</div>}
        <button disabled={busy}>{busy ? <LoaderCircle className="studio-spin" /> : <ArrowLeft className="studio-login-arrow" />} {busy ? 'Memverifikasi...' : 'Masuk ke Studio'}</button>
      </form>
      <small>Akses dibatasi untuk akun pemilik website.</small>
    </div>
  </main>;
}

function ToolbarButton({ label, active, onClick, children }: { label: string; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" title={label} aria-label={label} className={`studio-tool ${active ? 'active' : ''}`} onClick={onClick}>{children}</button>;
}

export default function BlogStudio() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [articles, setArticles] = useState<StudioArticle[]>([]);
  const [article, setArticle] = useState<StudioArticle | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState('');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('article');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);
  const latestArticle = useRef<StudioArticle | null>(null);
  const editRevision = useRef(0);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const api = useCallback(async (path: string, init?: RequestInit) => {
    if (!session?.access_token) throw new Error('Silakan login kembali.');
    const response = await fetch(path, {
      ...init,
      headers: { ...(init?.body instanceof FormData ? {} : { 'content-type': 'application/json' }), Authorization: `Bearer ${session.access_token}`, ...init?.headers },
    });
    const body = response.status === 204 ? null : await response.json();
    if (!response.ok) throw new Error(body?.error || 'Permintaan gagal.');
    return body;
  }, [session]);

  const createArticle = useCallback(async () => {
    const body = await api('/api/studio/articles', { method: 'POST', body: JSON.stringify({ title: 'Untitled story' }) }) as { article: StudioArticle };
    setArticles((items) => [body.article, ...items]); setArticle(body.article); setDirty(false); setLeftOpen(false);
  }, [api]);

  useEffect(() => {
    if (!session) return;
    void (async () => {
      setLoading(true); setNotice('');
      try {
        const body = await api('/api/studio/articles') as { articles: StudioArticle[] };
        setArticles(body.articles);
        if (body.articles[0]) setArticle(body.articles[0]); else await createArticle();
      } catch (error) { setNotice(error instanceof Error ? error.message : 'Studio gagal dimuat.'); }
      finally { setLoading(false); }
    })();
  }, [session, api, createArticle]);

  useEffect(() => { latestArticle.current = article; }, [article]);

  const saveNow = useCallback(async (target?: StudioArticle | null) => {
    const current = target || latestArticle.current; if (!current) return;
    const revision = editRevision.current; setSaveState('saving');
    try {
      const body = await api(`/api/studio/articles/${current.id}`, { method: 'PATCH', body: JSON.stringify(current) }) as { article: StudioArticle };
      setArticles((items) => items.map((item) => item.id === body.article.id ? body.article : item));
      if (latestArticle.current?.id === body.article.id && revision === editRevision.current) { setArticle(body.article); setDirty(false); }
      setSaveState('saved');
    } catch (error) { setSaveState('error'); setNotice(error instanceof Error ? error.message : 'Perubahan belum tersimpan.'); }
  }, [api]);

  useEffect(() => {
    if (!dirty || !article) return;
    const timer = window.setTimeout(() => void saveNow(article), 1200);
    return () => window.clearTimeout(timer);
  }, [article, dirty, saveNow]);

  const update = useCallback((patch: Partial<StudioArticle>) => {
    editRevision.current += 1;
    setArticle((current) => current ? { ...current, ...patch } : current);
    setDirty(true);
    setSaveState('editing');
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Mulai tulis idemu di sini...' }),
      Image.configure({ HTMLAttributes: { class: 'studio-editor-image' } }),
    ],
    content: emptyTiptapDocument,
    editorProps: { attributes: { class: 'studio-tiptap' } },
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      const wordCount = text ? text.split(/\s+/).length : 0;
      update({ content_json: editor.getJSON(), content_html: editor.getHTML(), word_count: wordCount, reading_time: Math.max(1, Math.ceil(wordCount / 210)) });
    },
  });

  const articleId = article?.id;
  useEffect(() => {
    const current = latestArticle.current;
    if (editor && current && current.id === articleId) {
      editor.commands.setContent(current.content_json || emptyTiptapDocument, { emitUpdate: false });
    }
  }, [editor, articleId]);

  const selectArticle = (next: StudioArticle) => {
    if (dirty && article) void saveNow(article);
    setArticle(next); setDirty(false); setLeftOpen(false); setNotice('');
  };

  const uploadFile = async (file: File) => {
    const data = new FormData(); data.append('file', file);
    const body = await api('/api/studio/media', { method: 'POST', body: data }) as { url: string };
    return body.url;
  };

  const insertImage = async (file: File) => {
    try { setUploading(true); const url = await uploadFile(file); editor?.chain().focus().setImage({ src: url, alt: file.name }).run(); setNotice('Gambar berhasil ditambahkan.'); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Upload gagal.'); }
    finally { setUploading(false); }
  };

  const uploadCover = async (file: File) => {
    if (!article) return;
    try { setUploading(true); const url = await uploadFile(file); update({ cover_url: article.cover_url || url, cover_slides: [...(article.cover_slides || []), url] }); setNotice('Cover berhasil ditambahkan.'); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Upload gagal.'); }
    finally { setUploading(false); }
  };

  const publishArticle = async () => {
    if (!article) return;
    setSaveState('saving');
    try {
      // Ensure latest draft is saved before publishing
      if (dirty) await saveNow(article);
      // RPC returns { ok, id, slug } — the actual article state update
      // comes from refreshing the article list or optimistic update
      const body = await api(
        `/api/studio/articles/${article.id}/publish`,
        { method: 'POST' },
      ) as { ok: boolean; id: string; slug: string; article?: StudioArticle };
      const nowIso = new Date().toISOString();
      const next: StudioArticle = body.article ?? {
        ...article,
        status: 'published' as const,
        last_published_at: nowIso,
        updated_at: nowIso,
      };
      setArticle(next);
      setArticles((items) => items.map((item) => item.id === next.id ? next : item));
      setDirty(false);
      setSaveState('saved');
      setNotice(`Artikel tayang di /blog/${body.slug ?? article.slug}`);
    } catch (error) {
      setSaveState('error');
      setNotice(error instanceof Error ? error.message : 'Gagal mempublikasikan artikel.');
    }
  };

  const unpublishArticle = async () => {
    if (!article || !window.confirm('Kembalikan artikel ke draft? Artikel akan hilang dari halaman publik.')) return;
    try {
      const body = await api(
        `/api/studio/articles/${article.id}/publish`,
        { method: 'DELETE' },
      ) as { article?: StudioArticle; ok?: boolean };
      const next: StudioArticle = body.article ?? { ...article, status: 'draft' as const };
      setArticle(next);
      setArticles((items) => items.map((item) => item.id === next.id ? next : item));
      setDirty(false);
      setNotice('Artikel dikembalikan menjadi draft.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Gagal unpublish artikel.');
    }
  };

  const deleteArticle = async () => {
    if (!article || !window.confirm(`Hapus artikel “${article.title}”?`)) return;
    try {
      await api(`/api/studio/articles/${article.id}`, { method: 'DELETE' });
      const remaining = articles.filter((item) => item.id !== article.id); setArticles(remaining);
      if (remaining[0]) setArticle(remaining[0]); else await createArticle();
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Artikel gagal dihapus.'); }
  };

  if (!authReady) return <main className="studio-loading"><LoaderCircle className="studio-spin" /> Menyiapkan Blog Studio...</main>;
  if (!session) return <LoginPanel onAuthenticated={setSession} />;
  if (loading || !article || !editor) return <main className="studio-loading"><LoaderCircle className="studio-spin" /> Memuat ruang menulis...</main>;

  const filtered = articles.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

  const articleRail = <div className="studio-rail-content">
    <div className="studio-brand"><div className="studio-brand-mark">K</div><div><strong>Khadafi</strong><span>Blog Studio</span></div></div>
    <button className="studio-new" onClick={() => void createArticle()}><Plus /> Artikel baru</button>
    <div className="studio-search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari artikel..." /></div>
    <div className="studio-rail-heading"><span>Semua artikel</span><span>{articles.length}</span></div>
    <div className="studio-article-list">
      {filtered.map((item) => <button key={item.id} className={`studio-article-row ${item.id === article.id ? 'active' : ''}`} onClick={() => selectArticle(item)}><span className={`studio-status-dot ${item.status}`} /><span><strong>{item.title || 'Untitled story'}</strong><small>{item.status === 'published' ? 'Published' : 'Draft'} · {formatRelativeTime(item.updated_at)}</small></span></button>)}
    </div>
    <div className="studio-owner"><span className="studio-owner-avatar">DK</span><span><strong>Daffa Khadafi</strong><small>Owner workspace</small></span><button title="Keluar" onClick={() => void supabase.auth.signOut()}><LogOut /></button></div>
  </div>;

  const settings = <div className="studio-settings-content">
    <div className="studio-settings-head"><div><strong>Article settings</strong><span>Atur detail dan experience</span></div><Settings2 /></div>
    <div className="studio-settings-tabs">{(['article', 'experience', 'seo'] as SettingsTab[]).map((tab) => <button key={tab} className={settingsTab === tab ? 'active' : ''} onClick={() => setSettingsTab(tab)}>{tab === 'article' ? 'Artikel' : tab === 'experience' ? 'Experience' : 'SEO'}</button>)}</div>
    <div className="studio-settings-scroll">
      {settingsTab === 'article' && <section className="studio-setting-group"><h3>Publishing</h3>
        <label>Slug<div className="studio-slug"><span>/blog/</span><input value={article.slug} onChange={(e) => update({ slug: slugify(e.target.value) })} /></div></label>
        <label>Kategori<select value={article.category} onChange={(e) => update({ category: e.target.value })}><option>Ideas</option><option>AI & Technology</option><option>Building in Public</option><option>Creator Economy</option><option>Personal Notes</option></select></label>
        <label>Ringkasan <em>{article.excerpt.length}/220</em><textarea rows={5} maxLength={220} value={article.excerpt} placeholder="Buat orang ingin membaca lebih jauh..." onChange={(e) => update({ excerpt: e.target.value })} /></label>
      </section>}
      {settingsTab === 'experience' && <>
        <section className="studio-setting-group"><h3>Cover experience</h3>
          <div className="studio-cover" style={article.cover_url ? { backgroundImage: `url(${article.cover_url})` } : undefined}>{!article.cover_url && <><ImageIcon /><span>Belum ada cover</span></>}<label><Upload /> {uploading ? 'Mengunggah...' : 'Upload cover'}<input type="file" accept="image/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && void uploadCover(e.target.files[0])} /></label></div>
          {article.cover_slides?.length > 0 && <div className="studio-cover-list">{article.cover_slides.map((url, index) => <div key={url} className="studio-cover-thumb" style={{ backgroundImage: `url(${url})` }}><span>{index + 1}</span><button onClick={() => { const next = article.cover_slides.filter((item) => item !== url); update({ cover_slides: next, cover_url: article.cover_url === url ? (next[0] || '') : article.cover_url }); }}><X /></button></div>)}</div>}
          <label>Theme<select value={article.theme} onChange={(e) => update({ theme: e.target.value as StudioArticle['theme'] })}><option value="midnight">Midnight</option><option value="light">Editorial Light</option><option value="adaptive">Adaptive</option></select></label>
          <label>Accent<div className="studio-accents">{['silver', 'violet', 'blue', 'lime'].map((accent) => <button key={accent} className={article.accent === accent ? 'active' : ''} data-accent={accent} onClick={() => update({ accent })}><i />{accent}</button>)}</div></label>
        </section>
        <section className="studio-setting-group"><div className="studio-setting-row"><h3>Reading atmosphere</h3><button className={`studio-switch ${article.music_enabled ? 'active' : ''}`} onClick={() => update({ music_enabled: !article.music_enabled })}><span /></button></div>
          <label>Mood<select value={article.music_mood} onChange={(e) => update({ music_mood: e.target.value })}><option>Future Ambient</option><option>Midnight Coding</option><option>Rainy Window</option><option>Soft Piano</option><option>Deep Focus</option></select></label>
          <label>Spotify playlist URI<input value={article.music_uri} placeholder="spotify:playlist:..." onChange={(e) => update({ music_uri: e.target.value })} /></label>
          <p className="studio-setting-note"><Music2 /> Player tetap menunggu interaksi pembaca sebelum dimuat.</p>
        </section>
      </>}
      {settingsTab === 'seo' && <section className="studio-setting-group"><h3>Search preview</h3>
        <label>SEO title <em>{article.seo_title.length}/60</em><input maxLength={60} value={article.seo_title} placeholder={article.title} onChange={(e) => update({ seo_title: e.target.value })} /></label>
        <label>Meta description <em>{article.seo_description.length}/160</em><textarea rows={5} maxLength={160} value={article.seo_description} placeholder={article.excerpt || 'Deskripsi hasil pencarian...'} onChange={(e) => update({ seo_description: e.target.value })} /></label>
        <div className="studio-serp"><span>khadafidaffa.com › blog › {article.slug}</span><strong>{article.seo_title || article.title}</strong><p>{article.seo_description || article.excerpt || 'Deskripsi artikel akan terlihat di sini.'}</p></div>
      </section>}
    </div>
  </div>;

  return <main className="studio-shell">
    <aside className={`studio-left ${leftOpen ? 'open' : ''}`}>{articleRail}</aside>
    {(leftOpen || rightOpen) && <button aria-label="Tutup panel" className="studio-mobile-overlay" onClick={() => { setLeftOpen(false); setRightOpen(false); }} />}
    <section className="studio-center">
      <header className="studio-topbar">
        <button className="studio-mobile-button" onClick={() => setLeftOpen(true)}><Menu /></button>
        <span className="studio-current-title">{article.title || 'Untitled story'}</span>
        <span className={`studio-save-state ${saveState}`}>{saveState === 'saving' ? <LoaderCircle className="studio-spin" /> : saveState === 'saved' ? <Check /> : saveState === 'error' ? <X /> : <i />}{saveState === 'saving' ? 'Menyimpan' : saveState === 'saved' ? 'Tersimpan' : saveState === 'error' ? 'Belum tersimpan' : 'Mengedit'}</span>
        <div className="studio-top-actions">
          <button onClick={() => setPreviewOpen(true)}><Eye /> Preview</button>
          <button className="studio-mobile-button" onClick={() => setRightOpen(true)}><Settings2 /></button>
          {article.status === 'published' ? (
            <>
              {(!article.last_published_at || new Date(article.updated_at).getTime() > new Date(article.last_published_at).getTime()) ? (
                <button className="studio-publish" onClick={() => void publishArticle()}><Save /> Perbarui</button>
              ) : (
                <button className="studio-publish" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}><Check /> Terbaru</button>
              )}
              <button className="studio-delete" title="Unpublish" onClick={() => void unpublishArticle()}><Minus /></button>
            </>
          ) : (
            <button className="studio-publish" onClick={() => void publishArticle()}><Send /> Publish</button>
          )}
          <button className="studio-delete" title="Delete" onClick={() => void deleteArticle()}><Trash2 /></button>
        </div>
      </header>
      <div className={`studio-notice${notice ? '' : ' empty'}`}>
        {notice && <><span>{notice}</span><button onClick={() => setNotice('')}><X /></button></>}
      </div>
      <div className="studio-toolbar">
        <div className="studio-block-menu"><Plus /> Tambah blok <ChevronDown /></div><span className="studio-divider" />
        <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold /></ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic /></ToolbarButton>
        <ToolbarButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough /></ToolbarButton>
        <ToolbarButton label="Link" active={editor.isActive('link')} onClick={() => { const href = window.prompt('Tempel URL tujuan', 'https://'); if (href) editor.chain().focus().extendMarkRange('link').setLink({ href, target: '_blank' }).run(); }}><Link2 /></ToolbarButton><span className="studio-divider" />
        <ToolbarButton label="Heading" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 /></ToolbarButton>
        <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List /></ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered /></ToolbarButton>
        <ToolbarButton label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote /></ToolbarButton>
        <ToolbarButton label="Code" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 /></ToolbarButton>
        <ToolbarButton label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus /></ToolbarButton>
        <ToolbarButton label="Image" onClick={() => imageInput.current?.click()}><ImageIcon /></ToolbarButton><span className="studio-divider" />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo2 /></ToolbarButton><ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo2 /></ToolbarButton>
        <input ref={imageInput} hidden type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && void insertImage(e.target.files[0])} />
      </div>
      <div className="studio-editor-scroll"><article className="studio-editor-page">
        <div className="studio-editor-meta"><span>{article.status === 'published' ? 'Published' : 'Draft'}</span><span>{article.category}</span><i /> <span>{article.reading_time} min read</span></div>
        <textarea 
          className="studio-title-input" 
          rows={1} 
          value={article.title} 
          placeholder="Judul artikel" 
          onChange={(e) => { 
            const title = e.target.value; 
            update({ title, seo_title: article.seo_title || title, slug: article.slug.startsWith('untitled-') ? slugify(title) : article.slug }); 
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onFocus={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          style={{ overflow: 'hidden', resize: 'none' }}
        />
        <div className="studio-title-rule" /><EditorContent editor={editor} />
        <button className="studio-inline-add" onClick={() => editor.chain().focus().insertContent('<p></p>').run()}><Plus /> Tambah paragraf</button>
      </article></div>
      <footer className="studio-editor-footer"><span>{article.word_count} kata</span><span>{article.reading_time} menit baca</span><span>Konten tersimpan sebagai structured JSON</span></footer>
    </section>
    <aside className={`studio-right ${rightOpen ? 'open' : ''}`}>{settings}</aside>
    {previewOpen && <div className="studio-preview-modal"><div className="studio-preview-head"><strong>Article preview</strong><div><button className={previewDevice === 'desktop' ? 'active' : ''} onClick={() => setPreviewDevice('desktop')}>Desktop</button><button className={previewDevice === 'mobile' ? 'active' : ''} onClick={() => setPreviewDevice('mobile')}>Mobile</button></div><button onClick={() => setPreviewOpen(false)}><X /></button></div><div className={`studio-preview-stage ${previewDevice}`}><ArticleRenderer previewMode article={{ title: article.title, excerpt: article.excerpt, category: article.category, reading_time: article.reading_time, date: article.updated_at, cover_url: article.cover_url, cover_slides: article.cover_slides, theme: article.theme, music_enabled: article.music_enabled, music_uri: article.music_uri }} contentHtml={article.content_html} /></div></div>}
  </main>;
}
