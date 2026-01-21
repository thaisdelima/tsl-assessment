import { useState, type FC } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import WallPost from '../components/WallPost'
import CreatePostForm from '../components/CreatePostForm'
import { listMessages, createMessage } from '../lib/api'
import { useAuth } from '../context/AuthContext'

type Post = {
  id: number
  user: string
  content: string
  created_at: string
}

const Home: FC = () => {
  const queryClient = useQueryClient()
  const { data: postsData, isLoading: loadingPosts, error: postsError } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: listMessages,
  })
  const [newMessage, setNewMessage] = useState('')
  const [postError, setPostError] = useState<string | null>(null)
  const { user, token } = useAuth()

  const createPostMutation = useMutation<Post, Error, string>({
    mutationFn: (content: string) => {
      if (!token) {
        throw new Error('You need to be authenticated to post.')
      }
      return createMessage(content, token)
    },
    onSuccess: (created) => {
      queryClient.setQueryData<Post[]>(['posts'], (prev) => (prev ? [created, ...prev] : [created]))
    },
  })

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) {
      setPostError('Enter a message to post.')
      return
    }
    setPostError(null)
    try {
      await createPostMutation.mutateAsync(newMessage)
      setNewMessage('')
    } catch {
      // Error handled via mutation state
    }
  }

  const posts = postsData ?? []
  const postsErrorMessage = postsError?.message ?? null
  const mutationError = createPostMutation.error?.message ?? null
  const displayPostError = postError ?? mutationError

  return (
    <main className="mx-auto flex max-w-3xl flex-col  gap-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900">Wall</h1>
      <div className="w-full flex max-w-3xl flex-col items-center justify-center gap-4 p-4">

      {user ? (
        <CreatePostForm
          newMessage={newMessage}
          posting={createPostMutation.isPending}
          postError={displayPostError}
          onSubmit={handleCreatePost}
          onChangeMessage={setNewMessage}
        />
      ) : (
        <div className="w-full max-w-xl rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Login to post messages.
        </div>
      )}

      {loadingPosts && <p className="text-gray-600">Loading posts...</p>}

      {postsErrorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          {postsErrorMessage}
        </div>
      )}

      {!loadingPosts && !postsError && posts.length === 0 && (
        <p className="text-gray-600">No posts found.</p>
      )}

      {!loadingPosts &&
        !postsError &&
        posts.map((post) => <WallPost key={post.id} post={post} />)}
      </div>
    </main>
  )
}

export default Home