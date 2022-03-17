import invariant from 'tiny-invariant'

import * as annexes from '~/routes/__posts/00-annexes/index.md'
import * as chapter01 from '~/routes/__posts/01-voting-clarity-smart-contract/index.md'
import * as chapter02 from '~/routes/__posts/02-build-the-voting-client/index.md'

const chapters = {
  '01-voting-clarity-smart-contract': chapter01,
  '02-build-the-voting-client': chapter02,
  '00-annexes': annexes,
}

export type ChaptersList = keyof typeof chapters

export interface PostAttributes {
  title: string
  description: string
  publicationDate: string
  lastEditDate: string
  wip: boolean
}

export interface Post extends PostAttributes {
  slug: string
  chapter: {
    title: string
    slug: string
  }
}

export interface ChapterAttributes {
  title: string
  description: string
  posts: { [key: string]: PostAttributes }
}

export interface ChapterInfo {
  title: string
  description: string
  slug: string
  posts: Post[]
}

function isValidChapter(
  attributes: Record<string, any>,
): attributes is ChapterAttributes {
  return attributes?.title && attributes?.description && attributes?.posts
}

function getDate(dateString: string) {
  const [d, m, y] = dateString.split('/').map((s) => parseInt(s))
  return new Date(Date.UTC(y, m - 1, d)).toString()
}

export function getChapterInfo(slug: keyof typeof chapters): ChapterInfo {
  const { attributes } = chapters[slug]
  invariant(
    isValidChapter(attributes),
    `${slug} is missing title, description or other metadata`,
  )

  return {
    slug,
    title: attributes.title,
    description: attributes.description,
    posts: Object.entries(attributes.posts).map(([slugPost, post]) => ({
      title: post.title,
      description: post.description,
      publicationDate: getDate(post.publicationDate),
      lastEditDate: getDate(post.lastEditDate),
      slug: slugPost,
      wip: post.wip,
      chapter: {
        slug,
        title: attributes.title,
      },
    })),
  }
}

export async function getChapters() {
  return Object.keys(chapters).map((chapter) =>
    getChapterInfo(chapter as keyof typeof chapters),
  )
}
