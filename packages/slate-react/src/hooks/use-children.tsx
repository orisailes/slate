import React, { useCallback } from 'react'
import { Ancestor, Descendant, Editor, Element, Range } from 'slate'
import {
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
} from '../components/editable'

import ElementComponent from '../components/element'
import TextComponent from '../components/text'
import { ReactEditor } from '../plugin/react-editor'
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps'
import { useDecorate } from './use-decorate'
import { SelectedContext } from './use-selected'
import { useSlateStatic } from './use-slate-static'
import { FixedSizeList as List } from 'react-window'

const useChildren = (props: {
  decorations: Range[]
  node: Ancestor
  renderElement?: (props: RenderElementProps) => JSX.Element
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  selection: Range | null
}) => {
  const {
    decorations,
    node,
    renderElement,
    renderPlaceholder,
    renderLeaf,
    selection,
  } = props

  const decorate = useDecorate()
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, node)

  const isLeafBlock =
    Element.isElement(node) &&
    !editor.isInline(node) &&
    Editor.hasInlines(editor, node)

  const rowRenderer = useCallback(
    ({ index, style }) => {
      const p = path.concat(index)
      const n = node.children[index] as Descendant
      const key = ReactEditor.findKey(editor, n)
      const range = Editor.range(editor, p)
      const sel = selection && Range.intersection(range, selection)
      const ds = decorate([n, p])

      for (const dec of decorations) {
        const d = Range.intersection(dec, range)
        if (d) {
          ds.push(d)
        }
      }

      NODE_TO_INDEX.set(n, index)
      NODE_TO_PARENT.set(n, node)

      if (Element.isElement(n)) {
        return (
          <SelectedContext.Provider key={`provider-${key.id}`} value={!!sel}>
            <div style={style}>
              <ElementComponent
                decorations={ds}
                element={n}
                renderElement={renderElement}
                renderPlaceholder={renderPlaceholder}
                renderLeaf={renderLeaf}
                selection={sel}
              />
            </div>
          </SelectedContext.Provider>
        )
      } else {
        return (
          <div style={style}>
            <TextComponent
              decorations={ds}
              key={key.id}
              isLast={isLeafBlock && index === node.children.length - 1}
              parent={node}
              renderPlaceholder={renderPlaceholder}
              renderLeaf={renderLeaf}
              text={n}
            />
          </div>
        )
      }
    },
    [
      decorate,
      decorations,
      editor,
      isLeafBlock,
      node,
      path,
      renderElement,
      renderLeaf,
      renderPlaceholder,
      selection,
    ]
  )

  return (
    <List
      height={500} // Adjust height as needed
      itemCount={node.children.length}
      itemSize={60} // Adjust item height as needed or calculate dynamically
      width={'100%'}
    >
      {rowRenderer}
    </List>
  )
}

export default useChildren
