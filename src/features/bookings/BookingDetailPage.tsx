import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateBookingStatusInputSchema } from "@trip-sync/contracts";
import { useForm } from "react-hook-form";
import type { UpdateBookingStatusInput } from "@trip-sync/contracts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  useBooking,
  useCreateSyncJob,
  useProviders,
  useUpdateBookingStatus,
} from "@/api/queries";
import { formatDateTime, formatMoney } from "@/lib/format";
import { bookingStatusVariant } from "@/lib/status";

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const booking = useBooking(id);
  const providers = useProviders();
  const updateStatus = useUpdateBookingStatus(id ?? "");
  const createSync = useCreateSyncJob();
  const [providerId, setProviderId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateBookingStatusInput>({
    resolver: zodResolver(UpdateBookingStatusInputSchema),
    defaultValues: { status: "CONFIRMED", reason: "" },
  });

  if (booking.isLoading) return <LoadingState />;
  if (booking.isError || !booking.data) {
    return (
      <ErrorState
        message="Reserva não encontrada ou indisponível."
        onRetry={() => void booking.refetch()}
      />
    );
  }

  const b = booking.data;
  const provider = providers.data?.data.find((p) => p.id === b.providerId);

  return (
    <div className="page">
      <PageHeader
        title={b.reference}
        description={`${b.travelerName} · ${b.destination}`}
        actions={
          <Link to="/bookings" className="btn btn--ghost btn--sm">
            ← Voltar
          </Link>
        }
      />

      <div className="grid grid--two">
        <Card title="Detalhes">
          <dl className="detail-list">
            <div>
              <dt>Status</dt>
              <dd>
                <Badge variant={bookingStatusVariant(b.status)}>{b.status}</Badge>
              </dd>
            </div>
            <div>
              <dt>Valor</dt>
              <dd>{formatMoney(b.amountCents, b.currency)}</dd>
            </div>
            <div>
              <dt>Check-in</dt>
              <dd>{formatDateTime(b.checkIn)}</dd>
            </div>
            <div>
              <dt>Check-out</dt>
              <dd>{formatDateTime(b.checkOut)}</dd>
            </div>
            <div>
              <dt>Provedor</dt>
              <dd>{provider?.name ?? "—"}</dd>
            </div>
            <div>
              <dt>Atualizado</dt>
              <dd>{formatDateTime(b.updatedAt)}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Atualizar status">
          <form
            className="form"
            onSubmit={handleSubmit((data) => updateStatus.mutate(data))}
          >
            <label>
              Novo status
              <select {...register("status")}>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </label>
            <label>
              Motivo (opcional)
              <input {...register("reason")} />
              {errors.reason ? (
                <span className="form__error">{errors.reason.message}</span>
              ) : null}
            </label>
            <Button type="submit" disabled={updateStatus.isPending}>
              Atualizar
            </Button>
            {updateStatus.isError ? (
              <p className="form__error">{updateStatus.error.message}</p>
            ) : null}
          </form>
        </Card>
      </div>

      <Card title="Enfileirar sync job">
        <div className="form form--inline">
          <label>
            Provedor
            <select
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
            >
              <option value="">Selecione…</option>
              {providers.data?.data.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <Button
            disabled={!providerId || createSync.isPending}
            onClick={() =>
              createSync.mutate({ bookingId: b.id, providerId })
            }
          >
            Enfileirar sync
          </Button>
        </div>
        {createSync.isSuccess ? (
          <p className="muted">
            Job {createSync.data.id} criado ({createSync.data.status}).
          </p>
        ) : null}
        {createSync.isError ? (
          <p className="form__error">{createSync.error.message}</p>
        ) : null}
      </Card>
    </div>
  );
}
