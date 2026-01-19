import type { FC, FormEventHandler } from 'react'

type CreatePostFormProps = {
  newMessage: string
  posting: boolean
  postError: string | null
  onSubmit: FormEventHandler<HTMLFormElement>
  onChangeMessage: (value: string) => void
}

const CreatePostForm: FC<CreatePostFormProps> = ({
  newMessage,
  posting,
  postError,
  onSubmit,
  onChangeMessage,
}) => (
  <form
    onSubmit={onSubmit}
    className="w-full max-w-xl space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
  >
    <label className="block text-sm font-semibold text-gray-800" htmlFor="new-post">
      New post
    </label>
    <textarea
      id="new-post"
      value={newMessage}
      onChange={(e) => onChangeMessage(e.target.value)}
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm  text-black shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      rows={3}
      placeholder="Share something..."
    />
    {postError && (
      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {postError}
      </div>
    )}
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={posting}
        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {posting ? 'Posting...' : 'Post'}
      </button>
    </div>
  </form>
)

export default CreatePostForm
