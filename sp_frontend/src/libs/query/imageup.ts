import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export const uploadImage = async (file: File | null) => {
  if (file == null) return;
  const fileName = `${Date.now()}-${file.name}`;

  // Storage のパスを指定
  const storageRef = ref(storage, `images/${fileName}`);

  // アップロード
  await uploadBytes(storageRef, file);

  // 公開URL取得
  const url = await getDownloadURL(storageRef);
  return url;
};
