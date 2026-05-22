import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@trip-sync/contracts";
import { useForm } from "react-hook-form";
import type { CreateBookingInput } from "@trip-sync/contracts";
import { Button } from "@/components/ui/Button";
import { useProviders } from "@/api/queries";

type BookingFormProps = {
  onSubmit: (data: CreateBookingInput) => void;
  isPending?: boolean;
};

function toDatetimeLocal(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 16);
}

const localDatetime = z
  .string()
  .min(1)
  .transform((value) => new Date(value).toISOString());

const BookingFormSchema = z
  .object({
    travelerName: z.string().min(2).max(120),
    destination: z.string().min(2).max(200),
    checkIn: localDatetime,
    checkOut: localDatetime,
    amountCents: z.number().int().positive(),
    currency: z.string().length(3),
    providerId: z.string().cuid().optional(),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "checkOut deve ser após checkIn",
    path: ["checkOut"],
  });

type BookingFormOutput = z.output<typeof BookingFormSchema>;

export function BookingForm({ onSubmit, isPending }: BookingFormProps) {
  const providers = useProviders();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      travelerName: "",
      destination: "",
      checkIn: toDatetimeLocal(7),
      checkOut: toDatetimeLocal(10),
      amountCents: 10000,
      currency: "BRL",
    },
  });

  return (
    <form
      className="form"
      onSubmit={handleSubmit((data: BookingFormOutput) =>
        onSubmit(data as CreateBookingInput),
      )}
    >
      <div className="form__row">
        <label>
          Viajante
          <input {...register("travelerName")} />
          {errors.travelerName ? (
            <span className="form__error">{errors.travelerName.message}</span>
          ) : null}
        </label>
        <label>
          Destino
          <input {...register("destination")} />
          {errors.destination ? (
            <span className="form__error">{errors.destination.message}</span>
          ) : null}
        </label>
      </div>

      <div className="form__row">
        <label>
          Check-in
          <input
            type="datetime-local"
            {...register("checkIn")}
            onChange={(e) => setValue("checkIn", e.target.value)}
          />
          {errors.checkIn ? (
            <span className="form__error">{errors.checkIn.message}</span>
          ) : null}
        </label>
        <label>
          Check-out
          <input
            type="datetime-local"
            {...register("checkOut")}
            onChange={(e) => setValue("checkOut", e.target.value)}
          />
          {errors.checkOut ? (
            <span className="form__error">{errors.checkOut.message}</span>
          ) : null}
        </label>
      </div>

      <div className="form__row">
        <label>
          Valor (centavos)
          <input type="number" {...register("amountCents", { valueAsNumber: true })} />
          {errors.amountCents ? (
            <span className="form__error">{errors.amountCents.message}</span>
          ) : null}
        </label>
        <label>
          Moeda
          <input maxLength={3} {...register("currency")} />
        </label>
        <label>
          Provedor (opcional)
          <select {...register("providerId")}>
            <option value="">— Nenhum —</option>
            {providers.data?.data.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando…" : "Criar reserva"}
      </Button>
    </form>
  );
}
