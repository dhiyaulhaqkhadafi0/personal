"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import type { Session } from '@supabase/supabase-js';
import {
  ArrowLeft, Eye, LoaderCircle, X, AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  emptyTiptapDocument, slugify, extractFirstImageFromTiptap,
  extractVisualSettings, applyVisualSettingsToContentJson,
  extractDistributionSettings, applyDistributionSettingsToContentJson,
  type StudioArticle,
} from '@/lib/blog-types';
import { ArticleRenderer } from '@/components/shared/ArticleRenderer';

import { EditorialBlockquote } from './tiptap-extensions/EditorialBlockquote';
import { EditorialFigure } from './tiptap-extensions/EditorialFigure';
import { StudioArticleRail } from './StudioArticleRail';
import { StudioDocumentHeader } from './StudioDocumentHeader';
import { StudioHeader } from './StudioHeader';
import { StudioSettings } from './StudioSettings';
import { StudioPublishModal } from './StudioPublishModal';
import { StudioSlashMenu } from './StudioSlashMenu';
import { StudioBubbleMenu } from './StudioBubbleMenu';
import { StudioImageToolbar } from './StudioImageToolbar';
import { StudioTemplateModal } from './StudioTemplateModal';
import { StudioUnsavedGuardModal } from './StudioUnsavedGuardModal';
import { StudioAiModal } from './StudioAiModal';
import { StudioRepurposeModal } from './StudioRepurposeModal';
import { type StudioTemplate } from '@/lib/studio-templates';

type SaveState = 'saved' | 'editing' | 'saving' | 'error';

function LoginPanel({ onAuthenticated }: { onAuthenticated: (session: Session) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError || !data.session) {
      setError(authError?.message || 'Login gagal.');
      return;
    }
    onAuthenticated(data.session);
  };

  return (
    <main className="studio-login-shell">
      <div className="studio-login-card">
        <div className="w-16 h-16 rounded-2xl bg-[#14151B] border border-white/15 p-2 flex items-center justify-center mx-auto mb-4 shadow-xl">
          <img
            src="/assets/logo%20AAPE.png"
            alt="AAPE Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="studio-eyebrow">KHADAFI · AAPE PRIVATE WORKSPACE</span>
        <h1>Masuk ke Blog Studio</h1>
        <p>Tulis, desain, dan publikasikan cerita langsung ke khadafidaffa.com.</p>
        <form onSubmit={signIn}>
          <label>
            Email admin
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domain.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          {error && <div className="studio-login-error">{error}</div>}
          <button disabled={busy}>
            {busy ? <LoaderCircle className="studio-spin" /> : <ArrowLeft className="studio-login-arrow" />}
            {busy ? 'Memverifikasi...' : 'Masuk ke Studio'}
          </button>
        </form>
        <small>Akses dibatasi untuk akun pemilik website.</small>
      </div>
    </main>
  );
}

export default function BlogStudio() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [articles, setArticles] = useState<StudioArticle[]>([]);
  const [article, setArticle] = useState<StudioArticle | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [initError, setInitError] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState('');

  // Layout states: persisted in localStorage
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // Modals & Tools
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [repurposeModalOpen, setRepurposeModalOpen] = useState(false);

  // Slash Menu state
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });

  // Template Modal state
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templateCreating, setTemplateCreating] = useState(false);

  // Unsaved Guard Modal state
  const [unsavedGuardOpen, setUnsavedGuardOpen] = useState(false);
  const [pendingArticleToSelect, setPendingArticleToSelect] = useState<StudioArticle | null>(null);
  const [guardSaving, setGuardSaving] = useState(false);
  const [guardSaveError, setGuardSaveError] = useState('');

  // Duplication state
  const [isDuplicating, setIsDuplicating] = useState(false);

  const imageInput = useRef<HTMLInputElement>(null);
  const latestArticle = useRef<StudioArticle | null>(null);
  const editRevision = useRef(0);

  // Load layout preferences from localStorage
  useEffect(() => {
    try {
      const savedLayout = localStorage.getItem('khadafi_studio_layout');
      if (savedLayout) {
        const parsed = JSON.parse(savedLayout);
        if (typeof parsed.leftCollapsed === 'boolean') setLeftCollapsed(parsed.leftCollapsed);
        if (typeof parsed.rightCollapsed === 'boolean') setRightCollapsed(parsed.rightCollapsed);
        if (typeof parsed.focusMode === 'boolean') setFocusMode(parsed.focusMode);
      }
    } catch {
      // Ignore localStorage error
    }
  }, []);

  // Persist layout preferences to localStorage
  const saveLayoutPrefs = useCallback((left: boolean, right: boolean, focus: boolean) => {
    try {
      localStorage.setItem('khadafi_studio_layout', JSON.stringify({
        leftCollapsed: left,
        rightCollapsed: right,
        focusMode: focus,
      }));
    } catch {
      // Ignore localStorage error
    }
  }, []);

  const toggleLeft = () => {
    setLeftCollapsed((prev) => {
      const next = !prev;
      saveLayoutPrefs(next, rightCollapsed, focusMode);
      return next;
    });
  };

  const toggleRight = () => {
    setRightCollapsed((prev) => {
      const next = !prev;
      saveLayoutPrefs(leftCollapsed, next, focusMode);
      return next;
    });
  };

  const toggleFocus = useCallback(() => {
    setFocusMode((prev) => {
      const next = !prev;
      saveLayoutPrefs(leftCollapsed, rightCollapsed, next);
      return next;
    });
  }, [leftCollapsed, rightCollapsed, saveLayoutPrefs]);

  // Global Keyboard Shortcut: Ctrl + \ or Cmd + \ for Focus Mode
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        toggleFocus();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [toggleFocus]);

  // Supabase Auth
  useEffect(() => {
    void supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data?.session ?? null);
      })
      .catch((err) => {
        console.error('Supabase auth getSession error:', err);
      })
      .finally(() => {
        setAuthReady(true);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setAuthReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const api = useCallback(async (path: string, init?: RequestInit) => {
    if (!session?.access_token) throw new Error('Silakan login kembali.');
    const response = await fetch(path, {
      ...init,
      headers: {
        ...(init?.body instanceof FormData ? {} : { 'content-type': 'application/json' }),
        Authorization: `Bearer ${session.access_token}`,
        ...init?.headers,
      },
    });
    const body = response.status === 204 ? null : await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(body?.error || 'Sesi tidak valid atau sudah berakhir. Silakan login kembali.');
      }
      if (response.status === 403) {
        throw new Error(body?.error || 'Akun ini tidak memiliki akses ke Blog Studio.');
      }
      throw new Error(body?.error || 'Permintaan gagal.');
    }
    return body;
  }, [session]);

  const createArticle = useCallback(async () => {
    const body = await api('/api/studio/articles', {
      method: 'POST',
      body: JSON.stringify({ title: 'Untitled story' }),
    }) as { article: StudioArticle };
    setArticles((items) => [body.article, ...items]);
    setArticle(body.article);
    setDirty(false);
  }, [api]);

  const loadedUserIdRef = useRef<string | null>(null);

  const loadArticles = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setInitError('');
    setNotice('');
    try {
      const body = (await api('/api/studio/articles')) as { articles: StudioArticle[] };
      setArticles(body.articles || []);
      if (body.articles && body.articles.length > 0) {
        setArticle(body.articles[0]);
      } else {
        await createArticle();
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Studio gagal dimuat.';
      setInitError(msg);
      setNotice(msg);
    } finally {
      setLoading(false);
    }
  }, [session, api, createArticle]);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      loadedUserIdRef.current = null;
      return;
    }
    if (loadedUserIdRef.current !== userId) {
      loadedUserIdRef.current = userId;
      void loadArticles();
    }
  }, [session?.user?.id, loadArticles]);

  const deletedArticleIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    latestArticle.current = article;
  }, [article]);

  const saveNow = useCallback(async (target?: StudioArticle | null): Promise<StudioArticle | null> => {
    const current = target || latestArticle.current;
    if (!current) throw new Error('Tidak ada naskah yang dipilih.');
    if (deletedArticleIds.current.has(current.id)) {
      return null;
    }
    const revision = editRevision.current;
    setSaveState('saving');
    try {
      const body = await api(`/api/studio/articles/${current.id}`, {
        method: 'PATCH',
        body: JSON.stringify(current),
      }) as { article: StudioArticle };
      setArticles((items) => items.map((item) => (item.id === body.article.id ? body.article : item)));
      if (latestArticle.current?.id === body.article.id && revision === editRevision.current) {
        setArticle(body.article);
        setDirty(false);
      }
      setSaveState('saved');
      return body.article;
    } catch (error) {
      setSaveState('error');
      const msg = error instanceof Error ? error.message : 'Perubahan belum tersimpan.';
      setNotice(msg);
      throw error;
    }
  }, [api]);

  useEffect(() => {
    if (!dirty || !article) return;
    if (deletedArticleIds.current.has(article.id)) return;
    const timer = window.setTimeout(() => void saveNow(article).catch(() => {}), 1200);
    return () => window.clearTimeout(timer);
  }, [article, dirty, saveNow]);

  const update = useCallback((patch: Partial<StudioArticle>) => {
    editRevision.current += 1;
    setArticle((current) => (current ? { ...current, ...patch } : current));
    setDirty(true);
    setSaveState('editing');
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        blockquote: false,
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          HTMLAttributes: { class: 'studio-editor-link' },
        },
      }),
      EditorialBlockquote,
      EditorialFigure,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Subjudul...';
          return "Ketik '/' untuk memasukkan blok editorial atau mulai menulis naskah...";
        },
      }),
    ],
    content: emptyTiptapDocument,
    editorProps: {
      attributes: {
        class: 'studio-tiptap prose prose-invert focus:outline-none max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      const wordCount = text ? text.split(/\s+/).length : 0;
      const currentVisual = extractVisualSettings(latestArticle.current?.content_json);
      const currentDist = extractDistributionSettings(latestArticle.current?.content_json);
      const json = editor.getJSON();
      let nextContentJson = applyVisualSettingsToContentJson(json, currentVisual);
      nextContentJson = applyDistributionSettingsToContentJson(nextContentJson, currentDist);
      update({
        content_json: nextContentJson,
        content_html: editor.getHTML(),
        word_count: wordCount,
        reading_time: Math.max(1, Math.ceil(wordCount / 210)),
      });

      // Check for Slash Command trigger
      const { selection } = editor.state;
      const { from } = selection;
      const currentBlockText = selection.$from.parent.textContent;

      if (currentBlockText.startsWith('/') && selection.empty) {
        const query = currentBlockText.slice(1);
        try {
          const coords = editor.view.coordsAtPos(from);
          const top = coords.bottom + 8;
          const left = Math.min(Math.max(16, coords.left), window.innerWidth - 300);
          setSlashPos({ top, left });
          setSlashQuery(query);
          setSlashOpen(true);
        } catch {
          setSlashOpen(false);
        }
      } else {
        setSlashOpen(false);
      }
    },
  });

  const articleId = article?.id;
  useEffect(() => {
    if (editor && article && article.id === articleId) {
      editor.commands.setContent(article.content_json || emptyTiptapDocument, { emitUpdate: false });
    }
  }, [editor, articleId]);

  const preloadImage = (src: string, timeoutMs = 8000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      let timer: NodeJS.Timeout | null = null;

      const cleanup = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        img.onload = null;
        img.onerror = null;
      };

      timer = setTimeout(() => {
        cleanup();
        reject(new Error('Batas waktu memuat gambar habis (timeout 8 detik).'));
      }, timeoutMs);

      img.onload = () => {
        cleanup();
        resolve();
      };

      img.onerror = () => {
        cleanup();
        reject(new Error('Gambar gagal dimuat oleh browser. Format mungkin tidak didukung atau URL tidak valid.'));
      };

      img.src = src;
    });
  };

  const selectArticle = useCallback((next: StudioArticle, skipGuard = false) => {
    // If not skipping guard and there are unsaved local modifications
    const isDirtyOrUnsaved = Boolean(
      latestArticle.current &&
      latestArticle.current.id !== next.id &&
      (dirty || saveState === 'saving' || saveState === 'error')
    );

    if (!skipGuard && isDirtyOrUnsaved) {
      setPendingArticleToSelect(next);
      setGuardSaveError('');
      setUnsavedGuardOpen(true);
      return;
    }

    setDirty(false);
    setArticle(next);
    setNotice('');
  }, [dirty, saveState]);

  const handleGuardSaveAndSwitch = async () => {
    if (!article || !pendingArticleToSelect) return;
    setGuardSaving(true);
    setGuardSaveError('');
    try {
      await saveNow(article);
      const target = pendingArticleToSelect;
      setUnsavedGuardOpen(false);
      setPendingArticleToSelect(null);
      setDirty(false);
      setArticle(target);
      setNotice(`Perubahan tersimpan. Beralih ke naskah "${target.title || 'Untitled story'}".`);
    } catch (err) {
      setGuardSaveError(err instanceof Error ? err.message : 'Gagal menyimpan naskah sebelum berpindah.');
    } finally {
      setGuardSaving(false);
    }
  };

  const handleGuardDiscardAndSwitch = () => {
    if (!pendingArticleToSelect) return;
    const target = pendingArticleToSelect;
    setDirty(false);
    setSaveState('saved');
    setUnsavedGuardOpen(false);
    setPendingArticleToSelect(null);
    setArticle(target);
    setNotice(`Perubahan lokal dibuang. Beralih ke naskah "${target.title || 'Untitled story'}".`);
  };

  const handleGuardStay = () => {
    setUnsavedGuardOpen(false);
    setPendingArticleToSelect(null);
    setGuardSaveError('');
  };

  const createArticleWithTemplate = useCallback(async (template: StudioTemplate) => {
    setTemplateCreating(true);
    try {
      const body = (await api('/api/studio/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: template.defaultTitle,
          content_json: template.content_json,
          content_html: template.content_html,
          excerpt: template.defaultExcerpt,
        }),
      })) as { article: StudioArticle };

      setArticles((items) => [body.article, ...items]);
      setArticle(body.article);
      setDirty(false);
      setTemplateModalOpen(false);
      setNotice(`Naskah baru dibuat dengan template "${template.name}".`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Gagal membuat naskah baru.');
    } finally {
      setTemplateCreating(false);
    }
  }, [api]);

  const handleDuplicateArticle = useCallback(async (target: StudioArticle) => {
    setIsDuplicating(true);
    try {
      if (dirty && latestArticle.current && latestArticle.current.id !== target.id) {
        await saveNow(latestArticle.current).catch(() => {});
      }

      const body = (await api(`/api/studio/articles/${target.id}/duplicate`, {
        method: 'POST',
      })) as { article: StudioArticle };

      setArticles((items) => [body.article, ...items]);
      setArticle(body.article);
      setDirty(false);
      setNotice(`Naskah "${body.article.title}" berhasil diduplikasi sebagai draft.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menduplikasi artikel.';
      setNotice(msg);
    } finally {
      setIsDuplicating(false);
    }
  }, [api, dirty, saveNow]);

  const uploadFile = async (file: File) => {
    const data = new FormData();
    data.append('file', file);
    const body = await api('/api/studio/media', { method: 'POST', body: data }) as { url: string };
    return body.url;
  };

  const insertImage = async (file: File) => {
    try {
      setUploading(true);
      setNotice('Mengunggah gambar ke server...');
      const url = await uploadFile(file);

      setNotice('Memverifikasi tampilan gambar...');
      await preloadImage(url);

      editor?.chain().focus().setImage({
        src: url,
        alt: file.name.replace(/\.[^/.]+$/, ""),
        title: '',
      }).run();
      setNotice('Gambar berhasil disisipkan ke dalam naskah.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Upload gambar gagal.');
    } finally {
      setUploading(false);
      if (imageInput.current) imageInput.current.value = '';
    }
  };

  const handleDeleteArticle = useCallback(async (target: StudioArticle) => {
    try {
      const isCurrent = latestArticle.current?.id === target.id;
      deletedArticleIds.current.add(target.id);

      if (isCurrent) {
        setDirty(false);
        setSaveState('saved');
      }

      await api(`/api/studio/articles/${target.id}`, { method: 'DELETE' });
      const nextArticles = articles.filter((item) => item.id !== target.id);
      setArticles(nextArticles);

      if (isCurrent) {
        if (nextArticles.length > 0) {
          selectArticle(nextArticles[0], true);
        } else {
          await createArticle();
        }
      }
      setNotice(`Naskah "${target.title || 'Untitled story'}" berhasil dihapus.`);
    } catch (err) {
      deletedArticleIds.current.delete(target.id);
      const msg = err instanceof Error ? err.message : 'Gagal menghapus artikel.';
      setNotice(msg);
      throw err;
    }
  }, [api, articles, selectArticle, createArticle]);

  const uploadCover = async (file: File) => {
    if (!article) return;
    try {
      setUploading(true);
      setNotice('Mengunggah cover visual...');
      const url = await uploadFile(file);

      setNotice('Memvalidasi gambar cover...');
      await preloadImage(url);

      const existingSlides = Array.isArray(article.cover_slides) ? article.cover_slides : [];
      const updatedSlides = [url];
      if (article.cover_url && article.cover_url !== url) {
        updatedSlides.push(article.cover_url);
      }
      for (const slide of existingSlides) {
        if (slide && slide !== url && !updatedSlides.includes(slide)) {
          updatedSlides.push(slide);
        }
      }

      update({
        cover_url: url,
        cover_slides: updatedSlides,
      });
      setNotice('Cover visual berhasil diperbarui.');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Upload cover gagal.';
      setNotice(msg);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmPublish = async () => {
    if (!article) return;
    setIsPublishing(true);
    setPublishError('');
    try {
      if (dirty) {
        try {
          await saveNow(article);
        } catch {
          const msg = 'Perubahan belum tersimpan. Publish dibatalkan.';
          setNotice(msg);
          setPublishError(msg);
          setIsPublishing(false);
          return;
        }
      }

      setSaveState('saving');
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
      setArticles((items) => items.map((item) => (item.id === next.id ? next : item)));
      setDirty(false);
      setSaveState('saved');
      setPublishModalOpen(false);
      setNotice(`Artikel berhasil tayang di /blog/${body.slug ?? article.slug}`);
    } catch (error) {
      setSaveState('error');
      const msg = error instanceof Error ? error.message : 'Gagal mempublikasikan artikel.';
      setNotice(msg);
      setPublishError(msg);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleConfirmUnpublish = async () => {
    if (!article) return;
    setIsPublishing(true);
    try {
      const body = await api(
        `/api/studio/articles/${article.id}/publish`,
        { method: 'DELETE' },
      ) as { article?: StudioArticle; ok?: boolean };

      const next: StudioArticle = body.article ?? { ...article, status: 'draft' as const };
      setArticle(next);
      setArticles((items) => items.map((item) => (item.id === next.id ? next : item)));
      setDirty(false);
      setPublishModalOpen(false);
      setNotice('Artikel dikembalikan menjadi draft.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Gagal unpublish artikel.');
    } finally {
      setIsPublishing(false);
    }
  };

  const openInsertBlockMenu = () => {
    if (!editor) return;
    editor.chain().focus().run();
    const { selection } = editor.state;
    try {
      const coords = editor.view.coordsAtPos(selection.from);
      setSlashPos({
        top: Math.max(70, coords.bottom + 8),
        left: Math.min(Math.max(16, coords.left), window.innerWidth - 300),
      });
    } catch {
      setSlashPos({ top: 120, left: 100 });
    }
    setSlashQuery('');
    setSlashOpen(true);
  };

  if (!authReady) {
    return (
      <main className="studio-loading flex items-center justify-center min-h-screen bg-[#090A0D] text-[#94A3B8] gap-3 text-sm">
        <LoaderCircle className="w-5 h-5 text-[#34D399] animate-spin" />
        <span>Menyiapkan Blog Studio...</span>
      </main>
    );
  }

  if (!session) return <LoginPanel onAuthenticated={setSession} />;

  if (initError) {
    const isAuthError =
      initError.toLowerCase().includes('login') ||
      initError.toLowerCase().includes('sesi') ||
      initError.includes('401') ||
      initError.toLowerCase().includes('akses') ||
      initError.includes('403');

    return (
      <main className="studio-error flex flex-col items-center justify-center min-h-screen bg-[#090A0D] text-[#F8FAFC] p-6 text-center select-none">
        <div className="w-14 h-14 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444] mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-base font-bold mb-2">Gagal Memuat Blog Studio</h2>
        <p className="text-xs text-[#94A3B8] max-w-md mb-6 leading-relaxed">
          {initError}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void loadArticles()}
            className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#34D399] text-[#022C22] text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95"
          >
            Coba Lagi
          </button>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              setSession(null);
              setInitError('');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#1F2028] hover:bg-[#2A2B36] text-[#CBD5E1] hover:text-white border border-white/10 text-xs font-medium transition-colors"
          >
            {isAuthError ? 'Login Ulang' : 'Keluar'}
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="studio-loading flex items-center justify-center min-h-screen bg-[#090A0D] text-[#94A3B8] gap-3 text-sm">
        <LoaderCircle className="w-5 h-5 text-[#34D399] animate-spin" />
        <span>Memuat ruang naskah...</span>
      </main>
    );
  }

  if (!article || !editor) {
    return (
      <main className="studio-loading flex flex-col items-center justify-center min-h-screen bg-[#090A0D] text-[#94A3B8] gap-4 text-sm p-6 text-center">
        <LoaderCircle className="w-5 h-5 text-[#34D399] animate-spin" />
        <span>Menyiapkan editor editorial...</span>
        <button
          type="button"
          onClick={() => void loadArticles()}
          className="text-xs text-[#34D399] underline hover:text-[#6EE7B7]"
        >
          Muat ulang naskah
        </button>
      </main>
    );
  }

  const manualCover = article.cover_url || (article.cover_slides && article.cover_slides.length > 0 ? article.cover_slides[0] : null);
  const autoCover = !manualCover ? extractFirstImageFromTiptap(article.content_json) : null;

  const isPublished = article.status === 'published';
  const hasUnpublishedChanges = isPublished && (
    !article.last_published_at ||
    new Date(article.updated_at).getTime() > new Date(article.last_published_at).getTime()
  );

  // Grid layout class based on collapse and focus mode states
  const layoutClass = focusMode
    ? 'studio-shell-focus'
    : leftCollapsed && rightCollapsed
    ? 'studio-shell-canvas-only'
    : leftCollapsed
    ? 'studio-shell-no-left'
    : rightCollapsed
    ? 'studio-shell-no-right'
    : 'studio-shell-standard';

  return (
    <main className={`studio-shell h-screen overflow-hidden bg-[#0A0B0E] text-[#F1F1ED] flex flex-col ${layoutClass}`}>
      {/* 1. Minimal Topbar */}
      <StudioHeader
        article={article}
        saveState={saveState}
        leftCollapsed={leftCollapsed}
        rightCollapsed={rightCollapsed}
        focusMode={focusMode}
        onToggleLeft={toggleLeft}
        onToggleRight={toggleRight}
        onToggleFocus={toggleFocus}
        onOpenPreview={() => setPreviewOpen(true)}
        onOpenPublishModal={() => {
          setPublishError('');
          setPublishModalOpen(true);
        }}
        canUpdate={hasUnpublishedChanges}
        onUndo={() => editor.chain().focus().undo().run()}
        onRedo={() => editor.chain().focus().redo().run()}
        canUndo={editor.can().undo()}
        canRedo={editor.can().redo()}
        onInsertBlockClick={openInsertBlockMenu}
        onOpenAiModal={() => setAiModalOpen(true)}
        onOpenRepurposeModal={() => setRepurposeModalOpen(true)}
        hasSelection={Boolean(editor && !editor.state.selection.empty)}
      />

      {/* Notice Banner */}
      {notice && (
        <div className="studio-notice flex items-center justify-between px-4 py-2 bg-[#181922] border-b border-white/5 text-xs text-[#E2E8F0] z-20">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice('')}
            className="w-5 h-5 flex items-center justify-center text-[#71717A] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Main Studio Workspace Layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Left Sidebar: Article List (Hidden in Focus Mode or when Left Collapsed) */}
        {!focusMode && !leftCollapsed && (
          <aside className="studio-left w-64 lg:w-72 bg-[#0C0D11]/95 border-r border-white/5 flex-shrink-0 z-10 transition-all">
            <StudioArticleRail
              articles={articles}
              currentArticle={article}
              searchQuery={query}
              onSearchChange={setQuery}
              onSelectArticle={(target) => selectArticle(target)}
              onCreateArticle={() => setTemplateModalOpen(true)}
              onSignOut={() => void supabase.auth.signOut()}
              onToggleCollapse={toggleLeft}
              onDeleteArticle={handleDeleteArticle}
              onDuplicateArticle={handleDuplicateArticle}
              isDuplicating={isDuplicating}
              onOpenPublishModal={(target?: StudioArticle) => {
                setPublishError('');
                if (target && target.id !== article.id) {
                  selectArticle(target);
                }
                setPublishModalOpen(true);
              }}
            />
          </aside>
        )}

        {/* Center: Writing Canvas */}
        <section className="studio-center flex-1 flex flex-col min-w-0 bg-[#0E0F14] overflow-hidden relative">
          <div className="studio-editor-scroll flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 py-8 sm:py-12 scrollbar-thin scrollbar-thumb-[#27272A] scrollbar-track-transparent">
            <div
              className={`mx-auto transition-all duration-300 ${
                focusMode ? 'max-w-[880px]' : 'max-w-[760px]'
              }`}
            >
              {/* Document Header (Category, Title, Deck, Divider) */}
              <StudioDocumentHeader article={article} onUpdate={update} />

              {/* Tiptap Writing Canvas */}
              <div className="studio-editor-canvas min-h-[500px]">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          {/* Footer: Word count and status */}
          <footer className="studio-editor-footer flex items-center justify-between px-6 py-2 border-t border-white/5 bg-[#0A0B0E]/80 text-[11px] font-mono text-[#71717A] select-none">
            <div className="flex items-center gap-3">
              <span>{article.word_count || 0} kata</span>
              <span>·</span>
              <span>{article.reading_time || 1} menit baca</span>
            </div>
            <div className="flex items-center gap-2">
              {focusMode && (
                <span className="text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded border border-[#34D399]/20">
                  Mode Fokus Aktif (Ctrl + \)
                </span>
              )}
              <span className="hidden sm:inline">Structured JSON</span>
            </div>
          </footer>
        </section>

        {/* Right Sidebar: Article Settings (Hidden in Focus Mode or when Right Collapsed) */}
        {!focusMode && !rightCollapsed && (
          <aside className="studio-right w-80 lg:w-88 bg-[#0C0D11]/95 border-l border-white/5 flex-shrink-0 z-10 transition-all">
            <StudioSettings
              article={article}
              onUpdate={update}
              autoCoverUrl={autoCover}
              onUploadCover={uploadCover}
              uploading={uploading}
              onToggleCollapse={toggleRight}
            />
          </aside>
        )}
      </div>

      {/* 3. Floating Tools */}
      <StudioSlashMenu
        editor={editor}
        isOpen={slashOpen}
        onClose={() => setSlashOpen(false)}
        onSelectImage={() => imageInput.current?.click()}
        position={slashPos}
        searchQuery={slashQuery}
      />

      <StudioBubbleMenu editor={editor} />
      <StudioImageToolbar editor={editor} />

      {/* Hidden file input for image uploads */}
      <input
        ref={imageInput}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => e.target.files?.[0] && void insertImage(e.target.files[0])}
      />

      {/* 4. Pre-Publish Checklist Modal */}
      <StudioPublishModal
        article={article}
        autoCoverUrl={autoCover}
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onConfirmPublish={handleConfirmPublish}
        onConfirmUnpublish={handleConfirmUnpublish}
        isPublishing={isPublishing}
        publishError={publishError}
      />

      {/* 5. Shared ArticleRenderer Preview Modal */}
      {previewOpen && (
        <div className="studio-preview-modal fixed inset-3 sm:inset-6 z-50 flex flex-col rounded-2xl bg-[#090A0D] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Preview Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#111216]">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#34D399]" />
              <strong className="text-xs font-semibold text-[#F1F1ED]">Pratinjau Editorial</strong>
            </div>

            {/* Device Toggle */}
            <div className="flex items-center gap-1 bg-[#181920] p-1 rounded-lg border border-white/5 text-xs">
              <button
                type="button"
                className={`px-3 py-1 rounded-md transition-colors ${
                  previewDevice === 'desktop' ? 'bg-[#27272A] text-white font-medium' : 'text-[#71717A] hover:text-white'
                }`}
                onClick={() => setPreviewDevice('desktop')}
              >
                Desktop
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded-md transition-colors ${
                  previewDevice === 'mobile' ? 'bg-[#27272A] text-white font-medium' : 'text-[#71717A] hover:text-white'
                }`}
                onClick={() => setPreviewDevice('mobile')}
              >
                Mobile
              </button>
            </div>

            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71717A] hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preview Stage */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#07080A]">
            <div
              className={`mx-auto transition-all ${
                previewDevice === 'mobile'
                  ? 'max-w-[420px] rounded-2xl border border-white/10 p-4 bg-[#0A0B0E] shadow-2xl'
                  : 'max-w-4xl'
              }`}
            >
              <ArticleRenderer
                previewMode
                article={{
                  title: article.title,
                  slug: article.slug,
                  excerpt: article.excerpt,
                  category: article.category,
                  reading_time: article.reading_time,
                  date: article.updated_at,
                  cover_url: article.cover_url,
                  cover_slides: article.cover_slides,
                  content_json: article.content_json,
                  visual_settings: extractVisualSettings(article.content_json),
                  distribution_settings: extractDistributionSettings(article.content_json),
                  theme: article.theme,
                  music_enabled: article.music_enabled,
                  music_uri: article.music_uri,
                }}
                contentHtml={article.content_html}
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. Template Selection Modal */}
      <StudioTemplateModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSelectTemplate={createArticleWithTemplate}
        isCreating={templateCreating}
      />

      {/* 7. Unsaved Changes Guard Modal */}
      <StudioUnsavedGuardModal
        isOpen={unsavedGuardOpen}
        currentArticleTitle={article?.title || ''}
        targetArticleTitle={pendingArticleToSelect?.title || ''}
        onSaveAndSwitch={handleGuardSaveAndSwitch}
        onDiscardAndSwitch={handleGuardDiscardAndSwitch}
        onStay={handleGuardStay}
        isSaving={guardSaving}
        saveError={guardSaveError}
      />

      {/* 8. AI Editorial Co-Pilot Modal */}
      {article && (
        <StudioAiModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          editor={editor}
          article={article}
          onUpdateArticle={update}
          authToken={session?.access_token || ''}
        />
      )}

      {/* 9. AI Content Repurposing Modal */}
      {article && (
        <StudioRepurposeModal
          isOpen={repurposeModalOpen}
          onClose={() => setRepurposeModalOpen(false)}
          editor={editor}
          article={article}
          authToken={session?.access_token || ''}
        />
      )}
    </main>
  );
}
