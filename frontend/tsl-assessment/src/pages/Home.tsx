import { useEffect, useState, type FC } from 'react'
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
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [postsError, setPostsError] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)
  const { user, token } = useAuth()

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await listMessages()
        setPosts(data as Post[])
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido'
        setPostsError(message)
      } finally {
        setLoadingPosts(false)
      }
    }

    loadPosts()
  }, [])

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setPostError('Você precisa estar autenticado para postar.')
      return
    }
    if (!newMessage.trim()) {
      setPostError('Digite uma mensagem para postar.')
      return
    }
    setPosting(true)
    setPostError(null)
    try {
      const created = await createMessage(newMessage, token)
      setPosts((prev) => [created as Post, ...prev])
      setNewMessage('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao publicar'
      setPostError(message)
    } finally {
      setPosting(false)
    }
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col  gap-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900">Mural</h1>
      <div className="w-full flex max-w-3xl flex-col items-center justify-center gap-4 p-4">

      {user ? (
        <CreatePostForm
          newMessage={newMessage}
          posting={posting}
          postError={postError}
          onSubmit={handleCreatePost}
          onChangeMessage={setNewMessage}
        />
      ) : (
        <div className="w-full max-w-xl rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Login to post messages.
        </div>
      )}

      {loadingPosts && <p className="text-gray-600">Carregando posts...</p>}

      {postsError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          {postsError}
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