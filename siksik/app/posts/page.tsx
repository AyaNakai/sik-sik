"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Post = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
};

export default function PostsPage() {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");

  const fetchPosts = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("ユーザー取得に失敗しました");
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(`取得エラー: ${error.message}`);
      return;
    }

    setPosts(data ?? []);
  };

  const handleSave = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("ログインユーザーが見つかりません");
      return;
    }

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      title,
    });

    if (error) {
      setMessage(`保存エラー: ${error.message}`);
      return;
    }

    setTitle("");
    setMessage("保存できました");
    fetchPosts();
  };
  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(`削除エラー: ${error.message}`);
      return;
    }

    setMessage("削除しました");
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main style={{ padding: "24px" }}>
      <h1>本一覧</h1>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを入力"
        />
        <button onClick={handleSave}>保存</button>
      </div>

      {message && <p>{message}</p>}

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title}
            <button onClick={() => handleDelete(post.id)}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}