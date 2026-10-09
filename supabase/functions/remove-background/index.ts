import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const HF_API_TOKEN = Deno.env.get("HF_API_TOKEN") || Deno.env.get("HUGGING_FACE_TOKEN") || "";

    let imageBytes: Uint8Array | null = null;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") || formData.get("image");
      if (file && file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        imageBytes = new Uint8Array(arrayBuffer);
      }
    } else if (contentType.includes("application/json")) {
      const body = await req.json();
      if (body.image) {
        // Base64 image or URL
        if (body.image.startsWith("data:")) {
          const base64Data = body.image.split(",")[1];
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          imageBytes = bytes;
        } else if (body.image.startsWith("http")) {
          const imgRes = await fetch(body.image);
          const arrayBuffer = await imgRes.arrayBuffer();
          imageBytes = new Uint8Array(arrayBuffer);
        }
      }
    } else {
      const arrayBuffer = await req.arrayBuffer();
      if (arrayBuffer.byteLength > 0) {
        imageBytes = new Uint8Array(arrayBuffer);
      }
    }

    if (!imageBytes) {
      return new Response(JSON.stringify({ error: "Nenhuma imagem válida fornecida." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call Hugging Face Inference API with briaai/RMBG-1.4
    const modelUrl = "https://api-inference.huggingface.co/models/briaai/RMBG-1.4";
    const headers: Record<string, string> = {
      "Content-Type": "application/octet-stream",
    };

    if (HF_API_TOKEN) {
      headers["Authorization"] = `Bearer ${HF_API_TOKEN}`;
    }

    const hfRes = await fetch(modelUrl, {
      method: "POST",
      headers,
      body: imageBytes,
    });

    if (!hfRes.ok) {
      const errorText = await hfRes.text();
      console.error("Erro na API Hugging Face:", hfRes.status, errorText);

      // Retorna a imagem original se o serviço do modelo estiver indisponível ou em carregamento
      return new Response(imageBytes, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "image/png",
          "X-Fallback": "true"
        },
      });
    }

    const outputBlob = await hfRes.arrayBuffer();

    return new Response(outputBlob, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "image/png",
      },
    });
  } catch (err: any) {
    console.error("Exceção na Edge Function remove-background:", err);
    return new Response(JSON.stringify({ error: err.message || "Erro interno na remoção de fundo." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
