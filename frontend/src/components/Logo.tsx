import { ImageWithFallback } from "./figma/ImageWithFallback";
import logoImage from "figma:asset/5f48e534e0aade3830f8f6bbcf0cb6e8b63ab534.png";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img
        src={logoImage}
        alt="Портал благополучия логотип"
        className="w-full h-full object-contain"
      />
    </div>
  );
}