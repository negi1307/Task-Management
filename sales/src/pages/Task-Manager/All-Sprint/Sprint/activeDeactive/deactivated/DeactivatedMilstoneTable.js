import React, { useState } from 'react'
// import { Editor } from 'react-draft-wysiwyg';
import { Container, Form } from 'react-bootstrap';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import './App.css';

const DeactivatedSprintTable = () => {
    // const [text, setText] = useState('');

    // const handleTextChange = (e) => {
    //     setText(e.target.value);
    // };
    // const [editorState, setEditorState] = useState(
    //     () => EditorState.createEmpty(),
    // );
    // console.log(editorState, 'stttttt')

    return (
        <div>Deactivate Sprint

            {/* <div className="App">
                <header className="App-header">
                    Rich Text Editor Example
                </header>

                <Editor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}

                />
            </div> */}
        </div>
    )
}

export default DeactivatedSprintTable