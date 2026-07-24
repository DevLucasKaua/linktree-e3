import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  Timestamp,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { getTemplate } from "@/templates/registry";
import type { LinktreeConfig } from "@/templates/types";

export type LinktreeStatus = "rascunho" | "publicado";

/** Documento completo em linktrees/{id}: config renderizável + metadados. */
export interface LinktreeDoc extends LinktreeConfig {
  id: string;
  /** Foto do cliente como data URI JPEG (armazenada no próprio documento). */
  photoUrl: string | null;
  status: LinktreeStatus;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  updatedBy: string;
  /** Preenchido = está na lixeira (soft delete). */
  deletedAt: Timestamp | null;
  /** Último export ZIP; base do aviso "alterado desde o export". */
  lastExportedAt: Timestamp | null;
}

/** Campos editáveis (tudo menos id e timestamps/metadados gerenciados). */
export type LinktreeUpdate = Partial<
  Omit<
    LinktreeDoc,
    "id" | "createdAt" | "updatedAt" | "updatedBy" | "deletedAt" | "lastExportedAt"
  >
>;

function fromSnapshot(snap: QueryDocumentSnapshot): LinktreeDoc {
  const data = snap.data();
  return {
    id: snap.id,
    clientName: data.clientName ?? "",
    slug: data.slug ?? "",
    bio: data.bio ?? "",
    templateId: data.templateId ?? "e3-classic",
    palette: data.palette ?? getTemplate(data.templateId).defaultPalette,
    links: data.links ?? [],
    socials: data.socials ?? [],
    publishedUrl: data.publishedUrl ?? "",
    contact: {
      phone: data.contact?.phone ?? "",
      email: data.contact?.email ?? "",
      org: data.contact?.org ?? "",
    },
    tracking: {
      ga4Id: data.tracking?.ga4Id ?? "",
      metaPixelId: data.tracking?.metaPixelId ?? "",
      gtmId: data.tracking?.gtmId ?? "",
    },
    fontId: data.fontId ?? "",
    photoUrl: data.photoUrl ?? null,
    status: data.status ?? "rascunho",
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
    updatedBy: data.updatedBy ?? "",
    deletedAt: data.deletedAt ?? null,
    lastExportedAt: data.lastExportedAt ?? null,
  };
}

const linktreesRef = () => collection(getDb(), "linktrees");

/** Cria um rascunho com os padrões do template escolhido; retorna o id. */
export async function createLinktree(
  templateId: string,
  userEmail: string
): Promise<string> {
  const template = getTemplate(templateId);
  const created = await addDoc(linktreesRef(), {
    clientName: "Novo cliente",
    slug: "",
    bio: "",
    templateId: template.id,
    palette: template.defaultPalette,
    links: [],
    socials: [],
    publishedUrl: "",
    contact: { phone: "", email: "", org: "" },
    tracking: { ga4Id: "", metaPixelId: "", gtmId: "" },
    fontId: "",
    photoUrl: null,
    status: "rascunho",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    updatedBy: userEmail,
    deletedAt: null,
    lastExportedAt: null,
  });
  return created.id;
}

export async function getLinktree(id: string): Promise<LinktreeDoc | null> {
  const snap = await getDoc(doc(getDb(), "linktrees", id));
  return snap.exists()
    ? fromSnapshot(snap as QueryDocumentSnapshot)
    : null;
}

export async function listLinktrees(): Promise<LinktreeDoc[]> {
  const snaps = await getDocs(
    query(linktreesRef(), orderBy("updatedAt", "desc"))
  );
  return snaps.docs.map(fromSnapshot);
}

export async function updateLinktree(
  id: string,
  changes: LinktreeUpdate,
  userEmail: string
): Promise<void> {
  await updateDoc(doc(getDb(), "linktrees", id), {
    ...changes,
    updatedAt: serverTimestamp(),
    updatedBy: userEmail,
  });
}

/** Exclusão definitiva (usada na lixeira). */
export async function deleteLinktree(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), "linktrees", id));
}

/** Move para a lixeira (reversível via restoreLinktree). */
export async function softDeleteLinktree(id: string): Promise<void> {
  await updateDoc(doc(getDb(), "linktrees", id), {
    deletedAt: serverTimestamp(),
  });
}

export async function restoreLinktree(id: string): Promise<void> {
  await updateDoc(doc(getDb(), "linktrees", id), { deletedAt: null });
}

/**
 * Registra o export ZIP: status publicado + lastExportedAt, em uma escrita só
 * e SEM bumpar updatedAt — senão o aviso "alterado desde o export" dispararia
 * logo após o próprio export.
 */
export async function markExported(id: string): Promise<void> {
  await updateDoc(doc(getDb(), "linktrees", id), {
    status: "publicado",
    lastExportedAt: serverTimestamp(),
  });
}

/** true se houve edição depois do último export ZIP (com folga para as escritas do export). */
export function hasUnexportedChanges(linktree: LinktreeDoc): boolean {
  if (!linktree.lastExportedAt || !linktree.updatedAt) return false;
  const SLACK_MS = 2000;
  return (
    linktree.updatedAt.toMillis() >
    linktree.lastExportedAt.toMillis() + SLACK_MS
  );
}

/** Cria uma cópia (rascunho) de um linktree existente; retorna o novo id. */
export async function duplicateLinktree(
  source: LinktreeDoc,
  userEmail: string
): Promise<string> {
  const created = await addDoc(linktreesRef(), {
    clientName: `${source.clientName} (cópia)`,
    slug: source.slug ? `${source.slug}-copia` : "",
    bio: source.bio,
    templateId: source.templateId,
    palette: source.palette,
    links: source.links.map((link) => ({ ...link, id: crypto.randomUUID() })),
    socials: source.socials.map((social) => ({
      ...social,
      id: crypto.randomUUID(),
    })),
    // A cópia será publicada em outra URL; contato e pixels acompanham o cliente.
    publishedUrl: "",
    contact: { ...source.contact },
    tracking: { ...source.tracking },
    fontId: source.fontId,
    photoUrl: source.photoUrl,
    status: "rascunho",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    updatedBy: userEmail,
    deletedAt: null,
    lastExportedAt: null,
  });
  return created.id;
}

/** true se outro linktree (diferente de excludeId) já usa este slug. */
export async function isSlugTaken(
  slug: string,
  excludeId: string
): Promise<boolean> {
  if (!slug) return false;
  const snaps = await getDocs(
    query(linktreesRef(), where("slug", "==", slug), limit(2))
  );
  return snaps.docs.some((snap) => snap.id !== excludeId);
}
