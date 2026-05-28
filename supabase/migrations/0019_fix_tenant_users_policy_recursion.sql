-- Fix RLS recursion on tenant_users.
-- Previous policy referenced tenant_users from within tenant_users policy itself,
-- which can trigger "infinite recursion detected in policy".

drop policy if exists "Tenant members can read tenant users" on public.tenant_users;

create policy "Tenant members can read tenant users"
on public.tenant_users
for select
using (
  tenant_users.user_id = (select auth.uid())
);

