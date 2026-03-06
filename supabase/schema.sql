-- books テーブル
create table if not exists books (
  id text primary key, -- ISBN
  title text not null,
  author text not null,
  publisher text not null default '',
  published_date text not null default '',
  cover_url text,
  total_count integer not null default 0,
  current_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- user_books テーブル
create table if not exists user_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null references books(id) on delete cascade,
  added_at timestamptz not null default now(),
  finished_at timestamptz,
  unique(user_id, book_id)
);

-- RLS 有効化
alter table books enable row level security;
alter table user_books enable row level security;

-- books は全員が読める
create policy "books are publicly readable"
  on books for select
  using (true);

-- user_books は自分のレコードのみ
create policy "users can manage own books"
  on user_books for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 本を追加する DB Function（total_count / current_count 更新）
create or replace function add_user_book(
  p_user_id uuid,
  p_isbn text,
  p_title text,
  p_author text,
  p_publisher text,
  p_published_date text,
  p_cover_url text
) returns void
language plpgsql
security definer
as $$
begin
  -- books upsert
  insert into books (id, title, author, publisher, published_date, cover_url, total_count, current_count)
  values (p_isbn, p_title, p_author, p_publisher, p_published_date, p_cover_url, 1, 1)
  on conflict (id) do update
    set total_count = books.total_count + 1,
        current_count = books.current_count + 1;

  -- user_books insert
  insert into user_books (user_id, book_id)
  values (p_user_id, p_isbn)
  on conflict (user_id, book_id) do nothing;
end;
$$;

-- 本を読了にする Function
create or replace function finish_user_book(
  p_user_id uuid,
  p_isbn text
) returns void
language plpgsql
security definer
as $$
begin
  update user_books
  set finished_at = now()
  where user_id = p_user_id and book_id = p_isbn and finished_at is null;

  if found then
    update books
    set current_count = greatest(0, current_count - 1)
    where id = p_isbn;
  end if;
end;
$$;
