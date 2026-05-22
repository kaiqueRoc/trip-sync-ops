import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookingStatusSchema } from "@trip-sync/contracts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { BookingForm } from "@/features/bookings/BookingForm";
import { useBookings, useCreateBooking } from "@/api/queries";
import { formatDate, formatMoney } from "@/lib/format";
import { bookingStatusVariant } from "@/lib/status";
import type { BookingStatus } from "@/api/types";

export function BookingsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const page = Number(searchParams.get("page") ?? 1);
  const status = searchParams.get("status") as BookingStatus | null;
  const destination = searchParams.get("destination") ?? "";

  const query = useMemo(
    () => ({
      page,
      pageSize: 20,
      ...(status ? { status } : {}),
      ...(destination ? { destination } : {}),
    }),
    [page, status, destination],
  );

  const { data, isLoading, isError, refetch } = useBookings(query);
  const createBooking = useCreateBooking();

  return (
    <div className="page">
      <PageHeader
        title="Reservas"
        description="Listagem e criação de reservas B2B."
        actions={
          <Button variant="secondary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Fechar formulário" : "Nova reserva"}
          </Button>
        }
      />

      {showForm ? (
        <Card title="Nova reserva">
          <BookingForm
            isPending={createBooking.isPending}
            onSubmit={(input) => {
              createBooking.mutate(input, {
                onSuccess: () => {
                  setShowForm(false);
                },
              });
            }}
          />
          {createBooking.isError ? (
            <p className="form__error">{createBooking.error.message}</p>
          ) : null}
        </Card>
      ) : null}

      <Card>
        <div className="filters">
          <label>
            Status
            <select
              value={status ?? ""}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                const val = e.target.value;
                if (val) next.set("status", val);
                else next.delete("status");
                next.set("page", "1");
                setSearchParams(next);
              }}
            >
              <option value="">Todos</option>
              {BookingStatusSchema.options.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Destino
            <input
              value={destination}
              placeholder="Filtrar destino…"
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                const val = e.target.value;
                if (val) next.set("destination", val);
                else next.delete("destination");
                next.set("page", "1");
                setSearchParams(next);
              }}
            />
          </label>
        </div>

        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <ErrorState
            message="Falha ao carregar reservas."
            onRetry={() => void refetch()}
          />
        ) : null}

        {data ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Referência</th>
                  <th>Viajante</th>
                  <th>Destino</th>
                  <th>Período</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <Link to={`/bookings/${b.id}`}>{b.reference}</Link>
                    </td>
                    <td>{b.travelerName}</td>
                    <td>{b.destination}</td>
                    <td>
                      {formatDate(b.checkIn)} — {formatDate(b.checkOut)}
                    </td>
                    <td>{formatMoney(b.amountCents, b.currency)}</td>
                    <td>
                      <Badge variant={bookingStatusVariant(b.status)}>
                        {b.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <Button
                variant="ghost"
                disabled={!data.meta.hasPrev}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.set("page", String(page - 1));
                  setSearchParams(next);
                }}
              >
                Anterior
              </Button>
              <span>
                Página {data.meta.page} de {data.meta.totalPages} ({data.meta.totalItems}{" "}
                itens)
              </span>
              <Button
                variant="ghost"
                disabled={!data.meta.hasNext}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.set("page", String(page + 1));
                  setSearchParams(next);
                }}
              >
                Próxima
              </Button>
            </div>
          </>
        ) : null}
      </Card>
    </div>
  );
}
