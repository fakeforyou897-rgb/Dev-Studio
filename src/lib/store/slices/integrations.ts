import { StateCreator } from "zustand";
import { ForgeState } from "../types";
import * as db from "@/lib/api";
import { toast } from "sonner";

export const createIntegrationSlice: StateCreator<ForgeState, [["zustand/persist", unknown]], [], Partial<ForgeState>> = (set, get) => ({
  upsertConnector: async (conn) => {
    const previous = get().connectors;
    set((s) => ({
      connectors: s.connectors.some(x => x.id === conn.id)
        ? s.connectors.map((x: any) => x.id === conn.id ? conn : x)
        : [conn, ...s.connectors]
    }));
    try {
      const saved = await db.upsertConnector({ ...conn, user_id: '', type: conn.type as any } as any);
      if (saved?.id && saved.id !== conn.id) {
        set((s) => ({ connectors: s.connectors.map(x => x.id === conn.id ? { ...x, id: saved.id as string } : x) }));
      }
      toast.success('Connector saved!');
    } catch (err: any) {
      set({ connectors: previous });
      toast.error(`Failed to save: ${err.message}`);
    }
  },
  deleteConnector: async (id) => {
    const previous = get().connectors;
    set((s) => ({ connectors: s.connectors.filter(x => x.id !== id) }));

    toast.promise(
      db.deleteConnector(id),
      {
        loading: 'Deleting connector...',
        success: 'Connector deleted!',
        error: (err) => {
          set({ connectors: previous });
          return `Failed to delete: ${err.message}`;
        }
      }
    );
  },

  upsertSocialDraft: async (draft) => {
    const previous = get().socialDrafts;
    set((s) => ({
      socialDrafts: s.socialDrafts.some(x => x.id === draft.id)
        ? s.socialDrafts.map((x: any) => x.id === draft.id ? draft : x)
        : [draft, ...s.socialDrafts]
    }));
    try {
      const saved = await db.upsertSocialDraft({ 
        ...draft, 
        user_id: '', 
        platform: draft.platform as any,
        media_urls: draft.mediaUrls 
      } as any);
      if (saved?.id && saved.id !== draft.id) {
        set((s) => ({ socialDrafts: s.socialDrafts.map(x => x.id === draft.id ? { ...x, id: saved.id as string } : x) }));
      }
      toast.success('Draft saved!');
    } catch (err: any) {
      set({ socialDrafts: previous });
      toast.error(`Failed to save: ${err.message}`);
    }
  },
  deleteSocialDraft: async (id) => {
    const previous = get().socialDrafts;
    set((s) => ({ socialDrafts: s.socialDrafts.filter(x => x.id !== id) }));

    toast.promise(
      db.deleteSocialDraft(id),
      {
        loading: 'Deleting draft...',
        success: 'Draft deleted!',
        error: (err) => {
          set({ socialDrafts: previous });
          return `Failed to delete: ${err.message}`;
        }
      }
    );
  },

  upsertMailTemplate: async (mail) => {
    const previous = get().mailTemplates;
    set((s) => ({
      mailTemplates: s.mailTemplates.some(x => x.id === mail.id)
        ? s.mailTemplates.map((x: any) => x.id === mail.id ? mail : x)
        : [mail, ...s.mailTemplates]
    }));
    try {
      const saved = await db.upsertMailTemplate({ 
        ...mail, 
        user_id: '', 
        channel: mail.channel as any 
      } as any);
      if (saved?.id && saved.id !== mail.id) {
        set((s) => ({ mailTemplates: s.mailTemplates.map(x => x.id === mail.id ? { ...x, id: saved.id as string } : x) }));
      }
      toast.success('Mail template saved!');
    } catch (err: any) {
      set({ mailTemplates: previous });
      toast.error(`Failed to save: ${err.message}`);
    }
  },
  deleteMailTemplate: async (id) => {
    const previous = get().mailTemplates;
    set((s) => ({ mailTemplates: s.mailTemplates.filter(x => x.id !== id) }));

    toast.promise(
      db.deleteMailTemplate(id),
      {
        loading: 'Deleting template...',
        success: 'Template deleted!',
        error: (err) => {
          set({ mailTemplates: previous });
          return `Failed to delete: ${err.message}`;
        }
      }
    );
  },
});
