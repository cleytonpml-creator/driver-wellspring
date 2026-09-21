import { createFileRoute } from "@tanstack/react-router";

type Body = { messages?: { role: "user" | "assistant"; text: string }[]; name?: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, name } = (await request.json()) as Body;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Mensagens obrigatórias", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const instructions = [
          "Você é o apoio de bordo do DriverPulse, um companheiro empático para motoristas e entregadores de van no Brasil.",
          "Responda sempre em português do Brasil, com tom acolhedor, humano e direto. Frases curtas, sem jargão.",
          "Foque em bem-estar emocional, ergonomia na direção, pausas, respiração, hidratação e alongamento prático dentro ou ao lado da van.",
          "Ofereça 1 ou 2 sugestões concretas por resposta. Máximo 120 palavras.",
          "Nunca dê diagnóstico médico; em sinais de risco grave, oriente procurar ajuda profissional ou o CVV 188.",
          name ? `O motorista se chama ${name}. Use o nome dele com naturalidade, sem exagero.` : "",
        ]
          .filter(Boolean)
          .join(" ");

        const input = messages.map((m) => ({
          role: m.role,
          content: [{ type: m.role === "user" ? "input_text" : "output_text", text: m.text }],
        }));

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
            "X-Lovable-AIG-SDK": "fetch",
          },
          body: JSON.stringify({
            model: "openai/gpt-6-astra",
            instructions,
            input,
            stream: true,
            store: false,
            reasoning: { effort: "low" },
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const detail = await upstream.text().catch(() => "");
          const status = upstream.status;
          const msg =
            status === 429
              ? "Muitas mensagens agora. Espere alguns segundos e tente de novo."
              : status === 402
                ? "Os créditos de IA acabaram. Recarregue para continuar conversando."
                : "Não consegui responder agora. Tente novamente em instantes.";
          console.error("AI gateway error", status, detail);
          return new Response(msg, { status: status === 429 || status === 402 ? status : 500 });
        }

        console.log("[chat] upstream ok, streaming");
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = "";

        const transform = new TransformStream<Uint8Array, Uint8Array>({
          transform(chunk, controller) {
            buffer += decoder.decode(chunk, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.startsWith("data:")) continue;
              const payload = line.slice(5).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const evt = JSON.parse(payload) as { type?: string; delta?: string };
                if (evt.type === "response.output_text.delta" && evt.delta) {
                  controller.enqueue(encoder.encode(evt.delta));
                }
              } catch {
                /* ignore partial */
              }
            }
          },
        });

        return new Response(upstream.body.pipeThrough(transform), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
