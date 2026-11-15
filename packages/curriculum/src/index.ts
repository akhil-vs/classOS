export type {
  BrowseIndex,
  ChapterSummary,
  Misconception,
  ShipGate,
  ShipGateEvaluation,
  StudentInput,
  Subject,
  TopicMode,
  TopicModule,
  TopicStatus,
} from "./types";
export {
  buildBrowseIndex,
  curriculumHealth,
  getAllTopics,
  getManifestPayload,
  getTopicById,
  getTopicsByChapter,
} from "./loader";
export { assertShippedConsistent, evaluateShipGate } from "./shipGate";
export { inventory, inventoryCounts, listInventoryChapters } from "./inventory";
export {
  buildOfflineStatus,
  offlineBanner,
  type ManifestCacheEntry,
  type OfflineBannerKind,
  type OfflineDegradeStatus,
} from "./offlineCache";
export {
  getPilotTopics,
  isPilotTopic,
  predictOptionsForTopic,
  topicAssumptions,
  topicUsesUnits,
} from "./pilot";
