alter table public.payments
  add column if not exists currency text not null default 'INR' check (currency = 'INR'),
  add column if not exists provider_reference text,
  add column if not exists verified_by uuid references auth.users (id) on delete set null,
  add column if not exists verified_at timestamptz,
  add column if not exists verification_notes text,
  add column if not exists refund_status text not null default 'not_requested' check (refund_status in ('not_requested', 'requested', 'processed', 'rejected', 'completed'));

create or replace function public.prevent_duplicate_payment_verification()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if tg_op = 'UPDATE' and old.payment_status = 'verified' and new.payment_status = 'verified' then
    raise exception 'This payment has already been verified and cannot be verified again.';
  end if;

  if new.payment_method = 'UPI' and new.payment_status = 'verified' and not public.is_admin_user() then
    raise exception 'UPI payments cannot be marked as verified by customers. Admin approval is required.';
  end if;

  if new.payment_method = 'COD' and new.payment_status = 'verified' and not public.is_admin_user() then
    raise exception 'COD payments must be verified by an authorized admin.';
  end if;

  if new.payment_method = 'UPI' and new.payment_status in ('submitted', 'verified') and new.transaction_reference is null then
    raise exception 'UPI payments require a transaction reference before submission or verification.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_payments_upi_verification_guard on public.payments;
create trigger trg_payments_upi_verification_guard
before insert or update on public.payments
for each row execute function public.prevent_duplicate_payment_verification();

create index if not exists idx_payments_payment_status on public.payments (payment_status, payment_method);
create index if not exists idx_payments_verified_by on public.payments (verified_by);
