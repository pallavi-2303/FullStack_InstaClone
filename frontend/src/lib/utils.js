import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const readFileAsDataUrl=(file)=>{
  return new Promise((resolve) => {
    const reader = new FileReader();

    // When the file is successfully read
    reader.onloadend = () => {
    if(typeof reader.result==="string")
      resolve(reader.result);
    };

    // Read the file as a Data URL
    reader.readAsDataURL(file);
});
}

