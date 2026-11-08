import { getTopicById } from "@classos/curriculum";
import { notFound } from "next/navigation";
import { PracticeClient } from "./PracticeClient";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);
  if (!topic) notFound();
  return <PracticeClient topic={topic} />;
}
