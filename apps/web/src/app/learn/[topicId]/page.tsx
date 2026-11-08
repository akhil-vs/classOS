import { getTopicById } from "@classos/curriculum";
import { notFound } from "next/navigation";
import { LearnClient } from "./LearnClient";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);
  if (!topic) notFound();
  return <LearnClient topic={topic} />;
}
