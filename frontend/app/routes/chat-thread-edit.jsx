import { useRouteLoaderData, Form, Link, redirect } from "react-router";

const api_url = import.meta.env.VITE_API_URL;

export async function clientAction({ params, request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const trimmedTitle = title?.trim();

  if (!trimmedTitle) {
    return { error: "Threads must have a title" };
  }

  try {
    const response = await fetch(`${api_url}/api/threads/${params.threadId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: trimmedTitle }),
    });

    if (!response.ok) {
      return { error: `Failed to update thread: ${response.status}` };
    }

    return redirect("..");
  } catch (error) {
    return { error: error.message };
  }
}

export default function ChatThreadEdit() {
  //avoid fetching thread data again, use the data from the parent route (chat-thread.jsx) instead
  const { thread } = useRouteLoaderData("routes/chat-thread");

  return (
    <Form method="POST">
      <input name="title" defaultValue={thread.title}></input>
      <button type="submit">Save</button>
      <Link to="">Cancel</Link>
    </Form>
  );
}
