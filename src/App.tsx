
import React, { useState, useEffect } from 'react';
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  Post,
} from './api';

const App = () => {
  const { data: posts, isLoading, isError } = useGetPostsQuery();
  const [localPosts, setLocalPosts] = useState<Array<Post>>(posts || []);
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  useEffect(() => {
    setLocalPosts(posts || []);
  }, [posts]);

  const handleCreatePost = async () => {
    const newPost: Partial<Post> = {
      userId: 1, 
      title: 'New Post',
      body: 'This is a new post.',
    };
    const uniqueId = Date.now();
    setLocalPosts((prevPosts: any) => [
      ...prevPosts,
      { ...newPost, id: uniqueId, userId: newPost.userId || 0, title: newPost.title || '' },
    ]);

    await createPost(newPost).unwrap();
  };

  const handleUpdatePost = async (postId: number) => {
    const updatedPost: Partial<Post> = {
      title: 'Updated Post',
      body: 'This post has been updated.',
    };

    setLocalPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? { ...post, ...updatedPost } : post))
    );

    await updatePost({ id: postId, updatedPost }).unwrap();
  };

  const handleDeletePost = async (postId: number) => {
    setLocalPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

    await deletePost(postId).unwrap();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div>
      <h1>Posts</h1>
      <button onClick={handleCreatePost}>Create New Post</button>
      <ul>
        {localPosts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <button onClick={() => handleUpdatePost(post.id)}>Update Post</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete Post</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;





