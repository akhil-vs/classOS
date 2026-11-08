import { getTopicById } from "@classos/curriculum";
import { BoardPageClient } from "./BoardPageClient";

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const params = await searchParams;
  const topic = params.topic ? getTopicById(params.topic) : undefined;
  return <BoardPageClient topic={topic} />;
}
