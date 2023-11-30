import EditorJS from '@editorjs/editorjs'
import { useEffect, useRef, useState } from 'react'
import { useDebounce } from './hooks/useDebounce'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Warning from '@editorjs/warning'
import Delimiter from '@editorjs/delimiter'
import List from '@editorjs/list'
import ImageTool from '@editorjs/image'
import CodeTool from '@editorjs/code';
import Underline from '@editorjs/underline'
import TextSpoiler from 'editorjs-inline-spoiler-tool'
import Emoji from './editorjs/plugins/Emoji'

export function App () {
    const editorJSInstance = useRef(null)
    const [data, setData] = useState(null)
    const codeRef = useRef(data)

    const initEditorJS = () => {
        const editor = new EditorJS({
            holderId: 'editorJS',
            onReady: () => {
                editorJSInstance.current = editor
            },
            tools: {
                header: Header,
                quote: Quote,
                warning: Warning,
                delimiter: Delimiter,
                list: List,
                imageTool: ImageTool,
                codeTool: CodeTool,
                underline: Underline,
                textSpoiler: TextSpoiler,
                emoji: Emoji
            },
            data: {},
            autofocus: true,
            // onChange: async () => await editorJSInstance.current.save().then(data => setData(data)).catch(err => console.log(err))

            onChange: useDebounce(async () => {
                await editorJSInstance.current.save().then(data => setData(data))
            }, 1000)
        })
    }

    useEffect(() => {
        if (editorJSInstance.current === null) {
            initEditorJS()
        }

        return () => {
            editorJSInstance?.current?.destroy()
            editorJSInstance.current = null
        }
    }, [])

    const copyToClipboard = () => {
        var texte = document.getElementById("paraCode").innerText;
        navigator.clipboard.writeText(texte)
          .then(() => {
            console.log('Texte copié avec succès !');
          })
          .catch(err => {
            console.log('Erreur lors de la copie du texte :', err);
          });
    }

    return <>
        <section className="editor">
            <div id="editorJS"></div>
        </section>
        <section className="viewer">
            <button
                onClick={copyToClipboard}
                className="copy-to-clipboard btn">
                <figure>
                    <svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 448 512">
                        <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"/>
                    </svg>
                </figure>
            </button>
            <p id="paraCode" ref={codeRef}>{JSON.stringify(data ?? [], null, 4)}</p>
        </section>
    </>
}