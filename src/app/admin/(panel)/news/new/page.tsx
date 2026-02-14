'use client';

import { PostForm } from '@/components/admin/post-form';

export default function NewPostPage() {
  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Add New Post</h1>
            <p className="text-muted-foreground">Fill out the form to create a new news article or announcement.</p>
        </div>
        <PostForm />
    </div>
  );
}
