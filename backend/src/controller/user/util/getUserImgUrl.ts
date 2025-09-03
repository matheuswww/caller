import path from "path";
import fs from "fs";

const IMG_FOLDER = path.join(process.cwd(), "img");
const url = process.env.URL

export default function getImgUrl(id: string): string {
  const files = fs.readdirSync(IMG_FOLDER);
  const file = files.find(f => f.startsWith(id));
  if (!file) {
    return "";
  }
  return `${url}/images/${file}`;
}
