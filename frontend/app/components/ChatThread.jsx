import { useParams } from "react-router";

export default function ChatThread() {
  const { threadId } = useParams();

  return (
    <div className="chat-thread-header">
      <h1>Chat conversation #{threadId}</h1>
    </div>
  );
}
