import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
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
}

/** Campos editáveis (tudo menos id e timestamps gerenciados). */
export type LinktreeUpdate = Partial<
  Omit<LinktreeDoc, "id" | "createdAt" | "updatedAt" | "updatedBy">
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
    photoUrl: data.photoUrl ?? null,
    status: data.status ?? "rascunho",
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
    updatedBy: data.updatedBy ?? "",
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
    photoUrl: null,
    status: "rascunho",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    updatedBy: userEmail,
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

export async function deleteLinktree(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), "linktrees", id));
}
