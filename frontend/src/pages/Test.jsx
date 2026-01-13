import { useState } from "react";

export default function Test() {
  const [file, setFile] = useState(null);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <input
        type="file"
        onChange={(e) => {
          console.log(e);
          setFile(e.target.files[0]);
        }}
      />
    </div>
  );
}
