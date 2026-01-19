import type { FC } from 'react'

type WallPostProps = {
  post: {
    id: number
    user: string
    content: string
    created_at: string
  }
}

const WallPost: FC<WallPostProps> = ({ post }) => {
  const parsedDate = new Date(post.created_at)
  const formattedDate = Number.isNaN(parsedDate.getTime())
    ? post.created_at
    : parsedDate.toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      })

  return (
    <article className="w-full max-w-xl rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-base leading-relaxed text-gray-900">{post.content}</p>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        <span className="text-sm font-semibold text-gray-900">{post.user}</span> 
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>
    </article>
  )
}

export default WallPost