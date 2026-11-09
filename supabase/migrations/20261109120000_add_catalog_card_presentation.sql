-- Admin-editable public catalog card presentation.
-- Images reference files committed under public/img; uploads are intentionally out of scope.
alter table public.subcategories
  add column if not exists card_image_url text,
  add column if not exists card_badge text,
  add column if not exists card_description text;

alter table public.subcategories
  add constraint subcategories_card_image_path_check
    check (
      card_image_url is null
      or (
        length(card_image_url) <= 500
        and card_image_url ~ '^/img/[A-Za-z0-9._/-]+$'
        and position('..' in card_image_url) = 0
      )
    ),
  add constraint subcategories_card_badge_length_check
    check (card_badge is null or length(card_badge) <= 40),
  add constraint subcategories_card_description_length_check
    check (card_description is null or length(card_description) <= 240);
