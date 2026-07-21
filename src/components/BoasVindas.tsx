import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { marcarOnboardingVisto } from "@/lib/onboarding.functions";
import { PASSOS_AJUDA } from "@/lib/ajuda-conteudo";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Aparece no primeiro acesso do corretor. Depois de concluído, não aparece mais.
export function BoasVindas({ open }: { open: boolean }) {
  const qc = useQueryClient();
  const marcar = useServerFn(marcarOnboardingVisto);
  const [i, setI] = useState(0);
  const [aberto, setAberto] = useState(open);

  useEffect(() => {
    setAberto(open);
  }, [open]);

  const mut = useMutation({
    mutationFn: () => marcar(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meus"] });
      setAberto(false);
    },
  });

  const passo = PASSOS_AJUDA[i];
  const ultimo = i === PASSOS_AJUDA.length - 1;

  return (
    <Dialog open={aberto} onOpenChange={() => {}}>
      <DialogContent className="max-w-sm [&>button]:hidden">
        <div className="flex flex-col items-center px-2 py-4 text-center">
          <div className="mb-3 text-5xl">{passo.emoji}</div>
          <h2 className="mb-2 text-lg font-bold">{passo.titulo}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{passo.texto}</p>

          <div className="my-5 flex gap-1.5">
            {PASSOS_AJUDA.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-2 rounded-full ${idx === i ? "bg-primary" : "bg-muted-foreground/30"}`}
              />
            ))}
          </div>

          <div className="flex w-full gap-2">
            {!ultimo && (
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => mut.mutate()}
                disabled={mut.isPending}
              >
                Pular
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={() => (ultimo ? mut.mutate() : setI(i + 1))}
              disabled={mut.isPending}
            >
              {ultimo ? "Começar!" : "Próximo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}