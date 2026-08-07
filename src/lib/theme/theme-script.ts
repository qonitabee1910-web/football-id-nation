export const THEME_COOKIE_NAME = "idn_theme";
export const THEME_STORAGE_KEY = "idn_theme";

export function getThemeInlineScript(): string {
  const c = THEME_COOKIE_NAME;
  const s = THEME_STORAGE_KEY;
  return `(()=>{try{const t=(document.cookie.match(/(?:^|; )${c}=([^;]+)/)||[])[1]||localStorage.getItem("${s}")||"system";const d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme:dark)").matches);document.documentElement.classList.toggle("dark",d);try{if(!document.cookie.includes("${c}="))document.cookie="${c}="+t+";path=/;max-age=31536000";localStorage.setItem("${s}",t)}catch(e){}}catch(e){}})();`;
}
