import React, { useState } from "react";
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";

export default function FileDrop() {
  const [file, setFile] = useState([]);
  console.log(file);

  return (
    <div className="App">
      <FilePond
        files={file}
        onupdatefiles={setFile}
        maxFiles={1}
        name="files"
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  );
}
