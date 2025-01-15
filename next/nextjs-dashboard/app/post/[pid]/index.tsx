interface Post {
  id: string
  title: string
  content: string
}
 
// Next.js 会在请求到来时使缓存失效，最多每60秒一次。
export const revalidate = 60
 
// 我们将在构建时仅预渲染 `generateStaticParams` 中的参数。
// 如果请求的路径尚未生成，Next.js 将按需服务器渲染页面。
export const dynamicParams = true // 或 false，以在未知路径上返回404
 
export async function generateStaticParams() {
  const posts: Post[] = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )
  return posts.map((post) => ({
    id: String(post.id),
  }))
}
 
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const post: Post = await fetch(`https://api.vercel.app/blog/${id}`).then(
    (res) => res.json()
  )
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}