import { useState } from "react";
import mediaUpload from "../../utils/mediaUpload";

export default function Test() {
  const [file, setFile] = useState(null);

  async function uploadImage() {
    const link = await mediaUpload(file);
    console.log(link);
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <input
        type="file"
        onChange={(e) => {
          console.log(e);
          setFile(e.target.files[0]);
        }}
      />
      <button
        className="bg-accent text-white px-4 py-2 rounded-lg"
        onClick={uploadImage}
      >
        Upload
      </button>
    </div>
  );
}
