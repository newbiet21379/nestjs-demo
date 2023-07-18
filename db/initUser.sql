use nest;
create table if not exists public.users
(
    id          uuid         not null
        primary key,
    role        text,
    email       text,
    country     varchar(255) not null,
    postal_code varchar(20)  not null,
    street      varchar(255) not null,
    created_at  date,
    updated_at  date,
    password    text         not null
);

alter table users
    owner to "user";

