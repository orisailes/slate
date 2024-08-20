import React, { useMemo, useCallback, useEffect } from 'react'
import { faker } from '@faker-js/faker'
import { createEditor, Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

const HEADINGS = 100
const PARAGRAPHS = 7
const initialValue: Descendant[] = []

for (let h = 0; h < HEADINGS; h++) {
  initialValue.push({
    type: 'heading',
    children: [{ text: faker.lorem.sentence() }],
  })

  for (let p = 0; p < PARAGRAPHS; p++) {
    initialValue.push({
      type: 'paragraph',
      children: [{ text: faker.lorem.paragraph() }],
    })
  }
}

const HugeDocumentExample = () => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  // useEffect(() => {
  //   console.log('hhelo')
  //   if (editor) {
  //     document.addEventListener('keydown', event => {
  //       if (event.key === 'KeyZ' && event.ctrlKey) {
  //         console.log('command z')
  //       }
  //
  //       if (event.key === 'KeyZ' && event.shiftKey) {
  //         console.log('command shift z')
  //       }
  //     })
  //   }
  // }, [editor])
  return (
    <>
      <button
        onClick={() => {
          editor.undo()
        }}
      >
        undo
      </button>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable renderElement={renderElement} spellCheck autoFocus />
      </Slate>
    </>
  )
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'heading':
      return <p {...attributes}>{children}</p>
    default:
      return <p {...attributes}>{children}</p>
  }
}

export default HugeDocumentExample
