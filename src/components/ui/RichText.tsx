import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from 'lexical'
import React from 'react'

interface RichTextProps {
  content?: SerializedEditorState | null
  className?: string
}

function renderNode(node: DefaultNodeTypes, index: number): React.ReactNode {
  if (!node) return null

  switch (node.type) {
    case 'paragraph':
      return (
        <p key={index} className="mb-4 last:mb-0">
          {(node as any).children?.map((child: any, i: number) => renderNode(child, i))}
        </p>
      )
    case 'heading': {
      const level = (node as any).tag ?? 'h2'
      const Tag = level as keyof React.JSX.IntrinsicElements
      return (
        <Tag key={index} className="font-display mb-3">
          {(node as any).children?.map((child: any, i: number) => renderNode(child, i))}
        </Tag>
      )
    }
    case 'list': {
      const listType = (node as any).listType
      const Tag = listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag key={index} className={`mb-4 pl-5 ${listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
          {(node as any).children?.map((child: any, i: number) => renderNode(child, i))}
        </Tag>
      )
    }
    case 'listitem':
      return (
        <li key={index} className="mb-1">
          {(node as any).children?.map((child: any, i: number) => renderNode(child, i))}
        </li>
      )
    case 'text': {
      const text = (node as any).text ?? ''
      const format = (node as any).format ?? 0
      let el: React.ReactNode = text
      if (format & 1) el = <strong>{el}</strong>
      if (format & 2) el = <em>{el}</em>
      if (format & 8) el = <u>{el}</u>
      if (format & 16) el = <s>{el}</s>
      return <span key={index}>{el}</span>
    }
    case 'link': {
      const url = (node as any).fields?.url ?? (node as any).url ?? '#'
      const newTab = (node as any).fields?.newTab ?? false
      return (
        <a
          key={index}
          href={url}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          className="underline text-blue-600 hover:text-blue-800"
        >
          {(node as any).children?.map((child: any, i: number) => renderNode(child, i))}
        </a>
      )
    }
    case 'autolink': {
      const url = (node as any).fields?.url ?? (node as any).url ?? '#'
      return (
        <a
          key={index}
          href={url}
          className="underline text-blue-600 hover:text-blue-800"
        >
          {(node as any).children?.map((child: any, i: number) => renderNode(child, i))}
        </a>
      )
    }
    case 'linebreak':
      return <br key={index} />
    default:
      return null
  }
}

export function RichText({ content, className }: RichTextProps) {
  if (!content?.root?.children) return null

  return (
    <div className={className}>
      {(content.root.children as DefaultNodeTypes[]).map((node, i) => renderNode(node, i))}
    </div>
  )
}
