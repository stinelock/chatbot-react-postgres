import { ChatMessages, ChatInput } from "../components/Chat";

export default function newChat(){
     return (
        <main className="chat-container">
            <h1>Start New Chat Conversation</h1>
          <ChatMessages />
          <ChatInput/>
        </main>
      );
};