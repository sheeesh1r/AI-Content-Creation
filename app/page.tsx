"use client";

import { useEffect, useState } from "react";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

type UploadState = "idle" | "uploading" | "generating" | "ready" | "error";

type Uploads = {
  product?: File;
  logo?: File;
  reference?: File;
};

export default function Home() {
  const [uploads, setUploads] = useState<Uploads>({});
  const [status, setStatus] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [previews, setPreviews] = useState<{
    product: string | null;
    logo: string | null;
    reference: string | null;
  }>({ product: null, logo: null, reference: null });

  useEffect(() => {
    const productUrl = uploads.product ? URL.createObjectURL(uploads.product) : null;
    const logoUrl = uploads.logo ? URL.createObjectURL(uploads.logo) : null;
    const referenceUrl = uploads.reference
      ? URL.createObjectURL(uploads.reference)
      : null;

    setPreviews({ product: productUrl, logo: logoUrl, reference: referenceUrl });

    return () => {
      if (productUrl) URL.revokeObjectURL(productUrl);
      if (logoUrl) URL.revokeObjectURL(logoUrl);
      if (referenceUrl) URL.revokeObjectURL(referenceUrl);
    };
  }, [uploads.product, uploads.logo, uploads.reference]);

  const handleFileChange = (key: keyof Uploads, file?: File) => {
    setError(null);
    setImageUrl(null);

    if (!file) {
      setUploads((prev) => ({ ...prev, [key]: undefined }));
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload PNG, JPG, or WEBP images.");
      return;
    }

    setUploads((prev) => ({ ...prev, [key]: file }));
  };

  const validate = () => {
    if (!uploads.product || !uploads.logo || !uploads.reference) {
      setError("Please upload all three images before generating.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setStatus("uploading");
    setError(null);
    setImageUrl(null);

    const formData = new FormData();
    formData.append("product", uploads.product as File);
    formData.append("logo", uploads.logo as File);
    formData.append("reference", uploads.reference as File);

    try {
    const responsePromise = fetch("/api/generate", {
      method: "POST",
      body: formData
    });

    // After the upload is initiated, switch to generation state.
    setStatus("generating");

    const response = await responsePromise;

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Generation failed.");
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;

    // Fetch blob to force download across browsers, then create a temporary link.
    const response = await fetch(imageUrl, { mode: "cors" });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "ad.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <h1>BFL Flux 2 Ad Generator</h1>
      <p>Upload your assets, generate a single ad image, and download the result.</p>

      <div className="card">
        <div className="grid">
          <div>
            <label htmlFor="product">Product image</label>
            <input
              id="product"
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              onChange={(e) => handleFileChange("product", e.target.files?.[0])}
            />
            <div className="preview">
              {previews.product ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previews.product} alt="Product preview" />
              ) : (
                <span>Preview</span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="logo">Logo image</label>
            <input
              id="logo"
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              onChange={(e) => handleFileChange("logo", e.target.files?.[0])}
            />
            <div className="preview">
              {previews.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previews.logo} alt="Logo preview" />
              ) : (
                <span>Preview</span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="reference">Reference ad image</label>
            <input
              id="reference"
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              onChange={(e) => handleFileChange("reference", e.target.files?.[0])}
            />
            <div className="preview">
              {previews.reference ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previews.reference} alt="Reference preview" />
              ) : (
                <span>Preview</span>
              )}
            </div>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "uploading" || status === "generating"}
          >
            Generate
          </button>
          {status !== "idle" && (
            <div className="status">
              {(status === "uploading" || status === "generating") && (
                <span className="spinner" />
              )}
              <span>
                {status === "uploading" && "Uploading…"}
                {status === "generating" && "Generating…"}
                {status === "ready" && "Ready"}
                {status === "error" && "Error"}
              </span>
            </div>
          )}
        </div>

        {imageUrl && (
          <div className="result">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Generated ad" />
            <button type="button" onClick={handleDownload}>
              Download
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
