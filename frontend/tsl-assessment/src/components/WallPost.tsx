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
    : parsedDate.toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
      })

  return (
    <article className="w-full max-w-xl rounded-xl border border-blue-200 bg-white p-4 shadow-sm hover:bg-blue-50">
      <div className="flex flex-row items-center justify-start gap-2">
        <span className="text-sm font-semibold text-gray-900">{post.user}:</span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-base text-start leading-relaxed text-gray-900">{post.content}</p>
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>
    </article>
  )
}

export default WallPost