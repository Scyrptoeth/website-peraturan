import uu30 from "../data/regulations/uu-nomor-30-tahun-2009.json";
import uu20 from "../data/regulations/uu-nomor-20-tahun-2014.json";
import pp14 from "../data/regulations/pp-nomor-14-tahun-2012.json";
import pp23 from "../data/regulations/pp-nomor-23-tahun-2014.json";
import pp62 from "../data/regulations/pp-nomor-62-tahun-2012.json";
import pp34 from "../data/regulations/pp-nomor-34-tahun-2018.json";
import pp28 from "../data/regulations/pp-nomor-28-tahun-2025.json";

export type LegalParagraph = {
  id: string;
  kind: string;
  text: string;
  part: "body" | "explanation";
};

export type RegulationPayload = {
  metadata: {
    source_file: string;
    source_sha256: string;
    document_type: string;
    number: string;
    year: string;
    title: string;
    slug: string;
    pdf_info: Record<string, string>;
    generated_at: string;
  };
  quality: {
    paragraph_count: number;
    body_article_count: number;
    explanation_article_count: number;
    chapter_count: number;
    part_count: number;
    letter_count: number;
    number_count: number;
    has_explanation: boolean;
    has_state_gazette: boolean;
    has_supplement: boolean;
    quality_flags: string[];
  };
  paragraphs: LegalParagraph[];
};

export const regulations = [
  uu30 as RegulationPayload,
  uu20 as RegulationPayload,
  pp14 as RegulationPayload,
  pp23 as RegulationPayload,
  pp62 as RegulationPayload,
  pp34 as RegulationPayload,
  pp28 as RegulationPayload
];
export const conversionReports = [uu20 as RegulationPayload];

export function displayTitle(payload: RegulationPayload): string {
  const meta = payload.metadata;
  const base = [meta.document_type, "Nomor", meta.number, "Tahun", meta.year]
    .filter(Boolean)
    .join(" ");
  return meta.title ? `${base} tentang ${toTitleCase(meta.title)}` : base;
}

export function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getRegulationBySlug(slug: string): RegulationPayload | undefined {
  return regulations.find((item) => item.metadata.slug === slug);
}

export function articleAnchors(payload: RegulationPayload): LegalParagraph[] {
  return payload.paragraphs.filter((paragraph) => paragraph.kind === "article" && paragraph.part === "body");
}

export function searchText(payload: RegulationPayload): string {
  return payload.paragraphs.map((paragraph) => paragraph.text).join(" ");
}

export function kindLabel(kind: string): string {
  const labels: Record<string, string> = {
    title: "Judul",
    opening: "Pembukaan",
    decision: "Keputusan",
    chapter: "BAB",
    part: "Bagian",
    subpart: "Paragraf",
    article: "Pasal",
    paragraph: "Ayat",
    letter: "Huruf",
    number: "Angka",
    explanation_heading: "Penjelasan",
    explanation_body: "Penjelasan",
    explanation_item: "Rincian",
    closing: "Penutup",
    body: "Isi"
  };
  return labels[kind] ?? kind;
}
