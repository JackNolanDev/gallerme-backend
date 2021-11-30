--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: art; Type: TABLE; Schema: public; Owner: jacknolan
--

CREATE TABLE public.art (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name character varying(100) NOT NULL,
    size integer,
    data character varying(1600),
    creation_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.art OWNER TO jacknolan;

--
-- Name: color_art_index; Type: TABLE; Schema: public; Owner: jacknolan
--

CREATE TABLE public.color_art_index (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    color_id uuid NOT NULL,
    art_id uuid NOT NULL
);


ALTER TABLE public.color_art_index OWNER TO jacknolan;

--
-- Name: colors; Type: TABLE; Schema: public; Owner: jacknolan
--

CREATE TABLE public.colors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name character varying(100) NOT NULL,
    color character varying(10),
    creation_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.colors OWNER TO jacknolan;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: jacknolan
--

CREATE TABLE public.user_roles (
    role character varying(20) NOT NULL
);


ALTER TABLE public.user_roles OWNER TO jacknolan;

--
-- Name: users; Type: TABLE; Schema: public; Owner: jacknolan
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(80) NOT NULL,
    salt character varying(20) NOT NULL,
    email character varying(50) NOT NULL,
    role character varying(20) NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    date_of_birth date,
    creation_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO jacknolan;

--
-- Data for Name: art; Type: TABLE DATA; Schema: public; Owner: jacknolan
--

COPY public.art (id, user_id, name, size, data, creation_time) FROM stdin;
30ef4f4a-7a98-44b1-a297-cd9797dea666	49cf00e1-6ea0-4499-a11a-94a7f44aaa9d	underwater world of doom!	8	47309c6c54c4411cc4411cc4411cc420461b411cc4411cc447309c20461b27661e411cc4411cc41e096d1e096d411cc41e096d1e096d1e096d1e096d411cc41e096d411cc41e096d1e096d17094c17094c1e096d27661e1e096d411cc4411cc41e096d17094c17094c1e096d1e096d1e096d1e096d1e096d17094c17094c17094c17094c1e096d841f1f1e096d17094c17094c17094c1e096d1e096d1e096d1e096d1e096d0b1b0817094c17094c1e096d17094c17094c17094c0b1b080b1b08	2021-11-22 14:04:10.188143
419e59b5-5cfb-4213-a1d0-ad4ce90ab319	49cf00e1-6ea0-4499-a11a-94a7f44aaa9d	Pink	2	ce6973f5b2b9644447ce838a	2021-11-22 14:04:10.188143
b5713477-ed69-4d61-9bd5-94f0a759792a	612a7328-f8d9-4a9d-aa05-e33030709aa0	Blue Pixel	1	226c91	2021-11-22 14:04:10.188143
\.


--
-- Data for Name: color_art_index; Type: TABLE DATA; Schema: public; Owner: jacknolan
--

COPY public.color_art_index (id, color_id, art_id) FROM stdin;
d3dcdac6-0e72-4b6c-8fbe-dc1845731c04	b7335c32-4ab9-4b3a-8315-f998148df34f	419e59b5-5cfb-4213-a1d0-ad4ce90ab319
64c99db0-12e9-4744-be40-93b24151ba2f	adfe12df-5cac-4f71-a073-29a7b39dc9df	b5713477-ed69-4d61-9bd5-94f0a759792a
\.


--
-- Data for Name: colors; Type: TABLE DATA; Schema: public; Owner: jacknolan
--

COPY public.colors (id, user_id, name, color, creation_time) FROM stdin;
af9118c4-44f4-4c8d-8222-6d60589edf0e	49cf00e1-6ea0-4499-a11a-94a7f44aaa9d	Neat Color	#5cadd6	2021-11-22 14:09:33.48997
39743ff4-ab18-4350-966a-5207c9c1cb5c	49cf00e1-6ea0-4499-a11a-94a7f44aaa9d	Fancy Schmancy Aquamarine	#3ddc97	2021-11-22 14:09:33.48997
b7335c32-4ab9-4b3a-8315-f998148df34f	49cf00e1-6ea0-4499-a11a-94a7f44aaa9d	Pink	#f5b2b9	2021-11-22 14:09:33.48997
adfe12df-5cac-4f71-a073-29a7b39dc9df	612a7328-f8d9-4a9d-aa05-e33030709aa0	BLUE	#226c91	2021-11-22 14:09:33.48997
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: jacknolan
--

COPY public.user_roles (role) FROM stdin;
USER
ADMIN
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: jacknolan
--

COPY public.users (id, username, password, salt, email, role, first_name, last_name, date_of_birth, creation_time) FROM stdin;
49cf00e1-6ea0-4499-a11a-94a7f44aaa9d	user1	would be hashed if this were real	salty	email@example.com	USER	EXAMPLE	USER	2021-11-22	2021-11-22 13:56:10.291778
612a7328-f8d9-4a9d-aa05-e33030709aa0	user2	secret password	salted	email2@example.com	ADMIN	\N	\N	\N	2021-11-22 13:56:10.291778
b8f5209a-e7be-48d2-b50b-dddb5c2bad49	RenaissanceMan	invent0r	salty	renaissanceMan@example.com	USER	Leonardo	da Vinci	1452-04-15	2021-11-22 13:56:10.291778
\.


--
-- Name: art art_pkey; Type: CONSTRAINT; Schema: public; Owner: jacknolan
--

ALTER TABLE ONLY public.art
    ADD CONSTRAINT art_pkey PRIMARY KEY (id);


--
-- Name: color_art_index color_art_index_color_id_art_id_key; Type: CONSTRAINT; Schema: public; Owner: jacknolan
--

ALTER TABLE ONLY public.color_art_index
    ADD CONSTRAINT color_art_index_color_id_art_id_key UNIQUE (color_id, art_id);


--
-- Name: color_art_index color_art_index_pkey; Type: CONSTRAINT; Schema: public; Owner: jacknolan
--

ALTER TABLE ONLY public.color_art_index
    ADD CONSTRAINT color_art_index_pkey PRIMARY KEY (id);


--
-- Name: colors colors_pkey; Type: CONSTRAINT; Schema: public; Owner: jacknolan
--

ALTER TABLE ONLY public.colors
    ADD CONSTRAINT colors_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: jacknolan
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (role);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: jacknolan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: jacknolan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: jacknolan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: art art_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jacknolan
--

ALTER TABLE ONLY public.art
    ADD CONSTRAINT art_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: color_art_index color_art_index_art_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jacknolan
--

ALTER TABLE ONLY public.color_art_index
    ADD CONSTRAINT color_art_index_art_id_fkey FOREIGN KEY (art_id) REFERENCES public.art(id) ON DELETE CASCADE;


--
-- Name: color_art_index color_art_index_color_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jacknolan
--

ALTER TABLE ONLY public.color_art_index
    ADD CONSTRAINT color_art_index_color_id_fkey FOREIGN KEY (color_id) REFERENCES public.colors(id) ON DELETE CASCADE;


--
-- Name: colors colors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jacknolan
--

ALTER TABLE ONLY public.colors
    ADD CONSTRAINT colors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jacknolan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_fkey FOREIGN KEY (role) REFERENCES public.user_roles(role);


--
-- PostgreSQL database dump complete
--

