// PasswordInput.tsx
import { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleShow = () => {
    setShow((prev) => !prev);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="w-full pr-12 border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}
