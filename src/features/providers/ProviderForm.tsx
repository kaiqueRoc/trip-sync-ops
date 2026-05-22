import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProviderInputSchema, type z } from "@trip-sync/contracts";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";

type ProviderFormValues = z.input<typeof CreateProviderInputSchema>;

type ProviderFormProps = {
  onSubmit: (data: z.output<typeof CreateProviderInputSchema>) => void;
  isPending?: boolean;
};

export function ProviderForm({ onSubmit, isPending }: ProviderFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProviderFormValues>({
    resolver: zodResolver(CreateProviderInputSchema),
    defaultValues: {
      name: "",
      slug: "",
      integrationType: "REST",
      baseUrl: "",
      active: true,
    },
  });

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form__row">
        <label>
          Nome
          <input {...register("name")} />
          {errors.name ? (
            <span className="form__error">{errors.name.message}</span>
          ) : null}
        </label>
        <label>
          Slug
          <input {...register("slug")} placeholder="ex: hotelbeds" />
          {errors.slug ? (
            <span className="form__error">{errors.slug.message}</span>
          ) : null}
        </label>
      </div>
      <div className="form__row">
        <label>
          Tipo
          <select {...register("integrationType")}>
            <option value="REST">REST</option>
            <option value="SOAP">SOAP</option>
          </select>
        </label>
        <label>
          Base URL (REST)
          <input {...register("baseUrl")} placeholder="https://…" />
          {errors.baseUrl ? (
            <span className="form__error">{errors.baseUrl.message}</span>
          ) : null}
        </label>
        <label className="checkbox">
          <input type="checkbox" {...register("active")} />
          Ativo
        </label>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando…" : "Registrar provedor"}
      </Button>
    </form>
  );
}
