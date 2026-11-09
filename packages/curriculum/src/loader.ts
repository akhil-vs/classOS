import { inventory, listInventoryChapters } from "./inventory";
import { evaluateShipGate } from "./shipGate";
import { geometryTopics } from "./topics/geometry";
import { linearTopics } from "./topics/linear";
import { quadraticTopics } from "./topics/quadratic";
import { reactionTopics } from "./topics/reactions";
import { stubTopics } from "./topics/stubs";
import type {
  BrowseIndex,
  ChapterSummary,
  Subject,
  TopicModule,
} from "./types";

const ALL_TOPICS: TopicModule[] = [
  ...quadraticTopics,
  ...linearTopics,
  ...geometryTopics,
  ...reactionTopics,
  ...stubTopics,
];

function chapterId(subject: Subject, classLevel: number, title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const prefix =
    subject === "mathematics" ? "math" : subject === "physics" ? "phy" : "chem";
  return `${prefix}.${classLevel}.${slug}`;
}

export function getAllTopics(): TopicModule[] {
  return ALL_TOPICS;
}

export function getTopicById(id: string): TopicModule | undefined {
  return ALL_TOPICS.find((topic) => topic.id === id);
}

export function getTopicsByChapter(
  subject: Subject,
  classLevel: number,
  chapter: string,
): TopicModule[] {
  return ALL_TOPICS.filter(
    (topic) =>
      topic.subject === subject &&
      topic.classLevel === classLevel &&
      topic.chapter === chapter,
  );
}

export function buildBrowseIndex(): BrowseIndex {
  const subjects: Subject[] = ["mathematics", "physics", "chemistry"];
  const classes = [9, 10, 11, 12];
  const chapters: ChapterSummary[] = [];

  for (const subject of subjects) {
    for (const classLevel of classes) {
      for (const entry of listInventoryChapters(subject, classLevel)) {
        const topicIds = getTopicsByChapter(
          subject,
          classLevel,
          entry.title,
        ).map((topic) => topic.id);
        chapters.push({
          id: chapterId(subject, classLevel, entry.title),
          subject,
          classLevel,
          title: entry.title,
          phase: entry.phase,
          topicIds,
        });
      }
    }
  }

  return {
    classes,
    subjects,
    chapters,
    topics: ALL_TOPICS,
  };
}

export function getManifestPayload(id: string) {
  const topic = getTopicById(id);
  if (topic) {
    return { type: "topic" as const, module: topic };
  }

  const chapter = buildBrowseIndex().chapters.find((item) => item.id === id);
  if (chapter) {
    return {
      type: "chapter" as const,
      chapter,
      topics: chapter.topicIds
        .map((topicId) => getTopicById(topicId))
        .filter((item): item is TopicModule => Boolean(item)),
    };
  }

  return null;
}

export function curriculumHealth() {
  const shipped = ALL_TOPICS.filter((topic) => topic.status === "shipped");
  return {
    inventoryUnits: inventory.counts.totalTrackedUnits,
    implementedTopics: ALL_TOPICS.length,
    shippedTopics: shipped.length,
    shipGateReady: ALL_TOPICS.filter((topic) => evaluateShipGate(topic).canShip)
      .length,
  };
}
