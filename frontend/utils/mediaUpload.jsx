import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function mediaUpload(file) {
  return new Promise((resolve, reject) => {
    if (file == null) {
      reject("No file selected");
    } else {
      const timestamp = new Date().getTime();
      const fileName = timestamp + file.name; // save file name with timestamp(current time in ms)
      supabase.storage
        .from("OUEvents Images")
        .upload(fileName, file, {
          upsert: false,
          cacheControl: "3600",
        })
        .then(() => {
          const publicUrl = supabase.storage
            .from("OUEvents Images")
            .getPublicUrl(fileName).data.publicUrl;
          resolve(publicUrl);
        })
        .catch(() => {
          reject("An error occured");
        });
    }
  });
}
