import uu30 from "../data/regulations/uu-nomor-30-tahun-2009.json";
import uu20 from "../data/regulations/uu-nomor-20-tahun-2014.json";
import pp14 from "../data/regulations/pp-nomor-14-tahun-2012.json";
import pp23 from "../data/regulations/pp-nomor-23-tahun-2014.json";
import pp62 from "../data/regulations/pp-nomor-62-tahun-2012.json";
import pp34 from "../data/regulations/pp-nomor-34-tahun-2018.json";
import pp28 from "../data/regulations/pp-nomor-28-tahun-2025.json";
import pp22 from "../data/regulations/pp-nomor-22-tahun-2021.json";
import permenperin54 from "../data/regulations/permenperin-nomor-54-tahun-2024.json";
import permenEsdm11 from "../data/regulations/permen-esdm-nomor-11-tahun-2021.json";
import permenEsdm10 from "../data/regulations/permen-esdm-nomor-10-tahun-2021.json";
import perpres79 from "../data/regulations/perpres-nomor-79-tahun-2023.json";
import perpres55 from "../data/regulations/perpres-nomor-55-tahun-2019.json";
import pp50 from "../data/regulations/pp-nomor-50-tahun-2012.json";
import permenLhk6 from "../data/regulations/permen-lhk-nomor-6-tahun-2021.json";
import perpres16 from "../data/regulations/perpres-nomor-16-tahun-2018.json";
import pp29 from "../data/regulations/pp-nomor-29-tahun-2021.json";
import uu7 from "../data/regulations/uu-nomor-7-tahun-2014.json";
import uu17 from "../data/regulations/uu-nomor-17-tahun-2006.json";
import perpres54_2018 from "../data/regulations/perpres-nomor-54-tahun-2018.json";
import uu20_2001 from "../data/regulations/uu-nomor-20-tahun-2001.json";
import uu31_1999 from "../data/regulations/uu-nomor-31-tahun-1999.json";
import perpres12_2021 from "../data/regulations/perpres-nomor-12-tahun-2021.json";

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
    extraction_method?: string;
    pdf_info: Record<string, string>;
    generated_at: string;
  };
  quality: {
    paragraph_count: number;
    body_article_count: number;
    explanation_article_count: number;
    body_article_sequence_gap_count?: number;
    explanation_article_sequence_gap_count?: number;
    chapter_count: number;
    part_count: number;
    letter_count: number;
    number_count: number;
    has_explanation: boolean;
    has_state_gazette: boolean;
    has_supplement: boolean;
    skipped_attachment_paragraph_count?: number;
    skipped_noise_paragraph_count?: number;
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
  pp28 as RegulationPayload,
  pp22 as RegulationPayload,
  permenperin54 as RegulationPayload,
  permenEsdm11 as RegulationPayload,
  permenEsdm10 as RegulationPayload,
  perpres79 as RegulationPayload,
  perpres55 as RegulationPayload,
  pp50 as RegulationPayload,
  permenLhk6 as RegulationPayload,
  perpres16 as RegulationPayload,
  pp29 as RegulationPayload,
  uu7 as RegulationPayload,
  uu17 as RegulationPayload,
  perpres54_2018 as RegulationPayload,
  uu20_2001 as RegulationPayload,
  uu31_1999 as RegulationPayload,
  perpres12_2021 as RegulationPayload
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
