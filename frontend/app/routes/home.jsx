import { ChatInput, ChatMessages} from "../components/Chat";

//DU ER NÅET TIL STEP 11

export default function Home() {
  return (
    <main className="chat-container">
      <ChatMessages />
      <ChatInput />
    </main>
  );
}
