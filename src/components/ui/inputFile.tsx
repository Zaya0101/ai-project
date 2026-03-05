"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DeleteIcon from "@/app/Icons/DeleteIcon";

type ImageUploadProps = {
  setResult: (text: string) => void;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:999"
).replace(/\/+$/, "");

function withTimeout(ms: number) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { controller, cancel: () => clearTimeout(id) };
}

export default function ImageUpload({ setResult }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: basic size guard (50MB backend limit)
    if (file.size > 20 * 1024 * 1024) {
      setResult("Зураг хэт том байна. 20MB-аас бага зураг сонгоорой.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setResult("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleGenerate = async () => {
    if (!preview || loading) return;
    setLoading(true);
    setResult("Analyzing image...");

    // Render free plan унтсан байвал эхний request удааширч магадгүй
    const { controller, cancel } = withTimeout(60_000);
    try {
      const res = await fetch(`${API_BASE}/ingredients-from-image`, {
        // Зам нь Backend-тэй яг ижил
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: preview }),
        signal: controller.signal,
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(
            `Backend зам олдсонгүй (404): ${API_BASE}/ingredients-from-image`
          );
        }
        throw new Error("Сервер алдаа заалаа");
      }

      const data = await res.json();
      setResult(data.ingredients || "No result");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setResult(err.message);
      } else {
        setResult("An unknown error occurred");
      }
    } finally {
      cancel();
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="cursor-pointer"
      />

      {preview && (
        <div className="relative w-50 h-50">
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover rounded border"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute bottom-2 right-2 w-6 h-6 bg-white flex items-center cursor-pointer justify-center rounded-sm"
            aria-label="Remove image"
            title="Remove image"
          >
            <DeleteIcon />
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          className="cursor-pointer"
          onClick={handleGenerate}
          disabled={!preview || loading}
        >
          {loading ? "Analyzing..." : "Generate"}
        </Button>
      </div>
    </div>
  );
}
