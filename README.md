# Luxina - Website Booking Film 

Project ini bertujuan untuk belajar dan menerapkan konsep REST API menggunakan Next.js, Supabase, dan TMDB API. Aplikasi ini menampilkan data film dari TMDB dan pengguna bisa login, menyimpan watchlist, dan memesan tiket bioskop.

## Fitur Utama

- Autentikasi user (signup/login) dengan Supabase
- Generate kode unik untuk setiap user (format: LXN001, LXN002, ...)
- Menampilkan daftar film populer dari TMDB API
- Menampilkan Video Trailer dari TMDB dihubungkan dengan Youtube
- Menyimpan dan mengelola watchlist film per user
- Sistem pemesanan tiket bioskop (pilih bioskop, jam, kursi, dll)
- Status tiket: ACTIVE, CANCELED, USED
- Website Responsive

## Target Pembelajaran

- Menggunakan REST API (TMDB API) untuk fetch data
- Menggunakan API Supabase untuk login, insert, update, delete data
- Menerapkan RLS (Row Level Security) untuk keamanan data per user
- Menghubungkan frontend (Next.js) dengan backend (API eksternal & Supabase)

## Tools & Framework

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Auth + Database)
- [TMDB API](https://developer.themoviedb.org/reference/intro/authentication)
- [Vercel](https://vercel.com/) (Deploy)

## Demo Website

### Link Website
[Luxina | Website Booking Film](https://luxina-dinarmakbar.vercel.app/dashboard)

 ### Akun Demo

Gunakan akun untuk melakukan percobaan login dan fitur pemesanan:

📧 Email   : `andisaputra@example.com`  
🔐 Password: `andisaputra123`

## Struktur Database (Supabase)

#### Tabel: `users`

```sql
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone_number TEXT,
  membership TEXT CHECK (membership IN ('VIP', 'MEMBER', 'REGULAR')) DEFAULT 'REGULAR',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```
Fungsi function generate_user_code() untuk membuat user code dengan fromat LXN001,LXN002,...

```sql
CREATE OR REPLACE FUNCTION generate_user_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  last_code TEXT;
  last_number INT;
BEGIN
  -- ambil code terakhir
  SELECT code INTO last_code
  FROM public.users
  WHERE code LIKE 'LXN%'
  ORDER BY created_at DESC
  LIMIT 1;

  -- urutan nomor
  IF last_code IS NOT NULL THEN
    last_number := CAST(SUBSTRING(last_code FROM 4) AS INT);
  ELSE
    last_number := 0;
  END IF;

  new_code := 'LXN' || LPAD((last_number + 1)::TEXT, 3, '0');
  NEW.code := new_code;

  -- Enkripsi password
  NEW.password := crypt(NEW.password, gen_salt('bf'));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_code
BEFORE INSERT ON public.users
FOR EACH ROW
WHEN (NEW.code IS NULL OR NEW.password IS NOT NULL)
EXECUTE FUNCTION generate_user_code();
```

#### Tabel: `cinemas`

```sql
create table public.cinemas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  studio_name text not null,
  seats integer not null check (seats > 0),
  seat_rows text[] default array[]::text[],
  seat_numbers integer[] default array[]::integer[],
  excluded_seats text[] default array[]::text[],
  booked_seats text[] default array[]::text[],
  time_list jsonb default '[]',
  created_at timestamp with time zone default now()
);
```

#### Tabel: `ticket_orders`

```sql
create table public.ticket_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  movie_id text not null,
  movie_title text not null,
  show_date date not null,
  show_time time not null,
  cinema_id uuid not null references public.cinemas(id) on delete cascade,
  cinema_name text,
  studio_name text,
  location text,
  people integer not null check (people > 0),
  seats text[] not null,
  total_price integer not null check (total_price >= 0),
  status text check (status in ('ACTIVE', 'CANCELED', 'USED')) default 'ACTIVE',
  created_at timestamp with time zone default now()
);
```

### Tabel: `watchlist`

``` sql
create table watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  movie_id bigint not null,
  movie_title text not null,
  movie_poster text,
  created_at timestamp with time zone default now()
);
```

## Setup Project

### 1. Clone repository

```bash
git clone https://github.com/nulldynmrr/luxina-frontend-mini-project.git
cd nama-repo
npm install
```

### 2. Tambahkan file `.env`

Buat file `.env` di root folder dan isi dengan:

```env
// api tmdb
NEXT_PUBLIC_APIKEY = your_apikey_tmdb
NEXT_PUBLIC_BASEURL= your_baseurl_tmdb
NEXT_PUBLIC_BASEIMGURL = your_baseimgurl_tmdb
NEXT_PUBLIC_TOKEN = your_toke_tmdb

// api supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_ANON_KEY=your_anon_key
```

### 3. Jalankan Project

```bash
npm run dev
```


