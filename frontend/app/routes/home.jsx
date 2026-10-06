import { ChatInput, ChatMessages} from "../components/Chat";

export default function Home() {
  return (
    <main className="chat-container">
      <ChatMessages />
      <ChatInput />
    </main>
  );
}
