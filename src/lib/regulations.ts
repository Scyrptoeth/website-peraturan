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
    status?: string;
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

export type RegulationSearchRow = {
  slug: string;
  title: string;
  searchTitle: string;
  documentType: string;
  documentTypeAlias: string;
  number: string;
  year: string;
  id: string;
  kind: string;
  label: string;
  part: string;
  text: string;
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

export type RegulationCollectionRow = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  type: string;
  typeAlias: string;
  year: string;
  status: string;
  sortYear: number;
  generatedAt: string;
};

export const typeSearchAliases: Record<string, string> = {
  UU: "Undang-Undang",
  PP: "Peraturan Pemerintah",
  PERPRES: "Peraturan Presiden",
  "PERMEN ESDM": "Peraturan Menteri ESDM",
  "PERMEN LHK": "Peraturan Menteri LHK",
  PERMENPERIN: "Peraturan Menteri Perindustrian",
  PERMEN: "Peraturan Menteri"
};

export function documentTypeAlias(documentType: string): string {
  return typeSearchAliases[documentType] ?? documentType;
}

export function shortTitle(payload: RegulationPayload): string {
  return `${payload.metadata.document_type} ${payload.metadata.number}/${payload.metadata.year}`;
}

export function regulationStatus(payload: RegulationPayload): string {
  return payload.metadata.status || "Berlaku";
}

export function collectionRow(payload: RegulationPayload): RegulationCollectionRow {
  return {
    slug: payload.metadata.slug,
    title: displayTitle(payload),
    shortTitle: shortTitle(payload),
    description: toTitleCase(payload.metadata.title),
    type: payload.metadata.document_type,
    typeAlias: documentTypeAlias(payload.metadata.document_type),
    year: payload.metadata.year,
    status: regulationStatus(payload),
    sortYear: Number(payload.metadata.year) || 0,
    generatedAt: payload.metadata.generated_at || ""
  };
}

export function newestPublishedRegulations(): RegulationPayload[] {
  return [...regulations].sort((a, b) => {
    const yearDiff = (Number(b.metadata.year) || 0) - (Number(a.metadata.year) || 0);
    if (yearDiff !== 0) return yearDiff;
    return String(b.metadata.generated_at || "").localeCompare(String(a.metadata.generated_at || ""));
  });
}

export function latestAddedRegulations(): RegulationPayload[] {
  return [...regulations].sort((a, b) => {
    const generatedDiff = String(b.metadata.generated_at || "").localeCompare(String(a.metadata.generated_at || ""));
    if (generatedDiff !== 0) return generatedDiff;
    return (Number(b.metadata.year) || 0) - (Number(a.metadata.year) || 0);
  });
}

export function collectionRowsByNewestYear(): RegulationCollectionRow[] {
  return newestPublishedRegulations().map(collectionRow);
}

export function regulationSearchRows(): RegulationSearchRow[] {
  return regulations.flatMap((item) => {
    const title = displayTitle(item);
    const alias = documentTypeAlias(item.metadata.document_type);
    const expandedTitle = title.startsWith(item.metadata.document_type)
      ? `${alias}${title.slice(item.metadata.document_type.length)}`
      : title;
    return item.paragraphs.map((paragraph) => ({
      slug: item.metadata.slug,
      title,
      searchTitle: `${title} ${expandedTitle} ${alias}`,
      documentType: item.metadata.document_type,
      documentTypeAlias: alias,
      number: item.metadata.number,
      year: item.metadata.year,
      id: paragraph.id,
      kind: paragraph.kind,
      label: kindLabel(paragraph.kind),
      part: paragraph.part,
      text: paragraph.text
    }));
  });
}

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
