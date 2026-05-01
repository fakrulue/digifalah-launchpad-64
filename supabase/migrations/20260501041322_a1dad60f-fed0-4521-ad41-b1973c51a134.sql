-- Grant super_admin role to the first registered user (the site owner)
-- and ensure newly-registered users via the auth trigger don't lose roles.
INSERT INTO public.user_roles (user_id, role)
SELECT '33f5d3c8-e0d9-44ec-85b7-59e978748fdf'::uuid, 'super_admin'::app_role
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = '33f5d3c8-e0d9-44ec-85b7-59e978748fdf'::uuid
    AND role = 'super_admin'::app_role
);