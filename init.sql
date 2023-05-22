DROP TABLE IF EXISTS details_commandes CASCADE;
DROP TABLE IF EXISTS commandes CASCADE;
DROP TABLE IF EXISTS produits CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;
DROP TABLE IF EXISTS panier CASCADE;

-- Table "utilisateurs"
CREATE TABLE utilisateurs (
  id_utilisateur SERIAL PRIMARY KEY,
  nom VARCHAR(50) NOT NULL,
  prenom VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL
);

-- Table "produits"
CREATE TABLE produits (
  id_produit SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prix NUMERIC(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image TEXT DEFAULT NULL
);

CREATE TABLE stock_products (
  id_stock_product SERIAL PRIMARY KEY,
  id_produit INT NOT NULL REFERENCES produits(id_produit) ON DELETE CASCADE,
  taille_s INT NOT NULL,
  taille_m INT NOT NULL,
  taille_l INT NOT NULL,
  taille_xl INT NOT NULL
);

-- Table "commandes"
CREATE TABLE commandes (
  id_commande SERIAL PRIMARY KEY,
  id_utilisateur INT NOT NULL REFERENCES utilisateurs(id_utilisateur),
  date_commande TIMESTAMP NOT NULL DEFAULT NOW(),
  adresse_livraison TEXT NOT NULL,
  etat_livraison TEXT NOT NULL
);

-- Table "details_commandes"
CREATE TABLE details_commandes (
  id_detail_commande SERIAL PRIMARY KEY,
  id_commande INT NOT NULL REFERENCES commandes(id_commande) ON DELETE CASCADE,
  id_produit INT NOT NULL REFERENCES produits(id_produit) ON DELETE CASCADE,
  quantite INT NOT NULL,
  taille VARCHAR(2) NOT NULL,
  prix_unitaire NUMERIC(10, 2) NOT NULL
);


-- Table "panier"
CREATE TABLE panier (
  id_panier SERIAL PRIMARY KEY,
  id_utilisateur INT NOT NULL,
  id_produit INT NOT NULL REFERENCES produits(id_produit),
  quantite INT NOT NULL,
  taille VARCHAR(2) NOT NULL,
  prix_unitaire NUMERIC(10, 2) NOT NULL
);

INSERT INTO produits VALUES
(1,'Straight Regular Jeans','20.99','pantalon','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F35%2Fab%2F35ab68c1b85dddca60628313e019c1c2851e7a5f.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(2,'Tapered Regular Jeans Blue denim clair','29.99','pantalon','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F9c%2Fa0%2F9ca0d5e9264dc0134140c974c6a468d0afc2fc90.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(3,'Tapered Regular Jeans Blue denim','29.99','pantalon','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fbc%2F07%2Fbc0758aaa1ee54672a737ce5a2ea889a2e6c569c.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_jeans_regular%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(4,'Tapered Regular Jeans Blanc','29.99','pantalon','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F28%2F79%2F28790c84fe2116689ad0e681a01ce909f6e5437c.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_jeans_regular%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(5,'Relaxed Jeans Gris denim','39.99','pantalon','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F96%2F54%2F965479a3a0ad7aed6e881ea8603e742851b0b658.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_jeans_relaxed%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(6,'Relaxed Jeans Noir','39.99','pantalon','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fbd%2F74%2Fbd746bc642870f002cbfcd5d578df85448b0a99f.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(7,'Pantalon Jogger Slim Fit','29.99','pantalon','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F59%2F5f%2F595fc37804dbc16d44b91eea8392d028d9bd2489.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(8,'Pantalon jogger cargo','34.99','pantalon','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F4c%2F62%2F4c62a43ee9c864fc69d3d2633abd789e69fcc0f3.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_trousers_cargo%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(9,'Pantalon de costume Beige','39.99','pantalon','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fd0%2Fcd%2Fd0cd7bbb329746e75171bc8926753dbfc28caff7.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_blazerssuits_trousers%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(10,'Pantalon de costume Noir','39.99','pantalon','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Ff4%2F13%2Ff413f3b799ef297fdeada781c981b630b1106d48.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_blazerssuits_trousers%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(11,'Chemise Oxford Regular Fit Kaki','25.99','chemise','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F70%2Fae%2F70aeae4f9cd7cecddf467403e362232682787d12.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(12,'Chemise Oxford Regular Fit Bleu marine','25.99','chemise','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Ffb%2F33%2Ffb33302abb4f01b6accfa10c517d580a3276862a.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(13,'Chemise en lin mélangé Vert/rayures blanches','19.99','chemise','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F5c%2F9e%2F5c9e2cea8bb17c43854e6e95516effa1c992e8d6.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(14,'Chemise en lin mélangé Bleu','19.99','chemise','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F17%2Fb2%2F17b2c82a88dced05af747d946f2f69ef86c9187f.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(15,'Chemise à motif Noir','14.99','chemise','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F34%2Ff0%2F34f037fe25cdbed7bcff75c6df0a929efdba802b.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_shirts_shortsleeved%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(16,'Chemise à motif fleuri','14.99','chemise','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F32%2F51%2F32516b7aca5e7da0ec9460d55acc86f8cdd734d6.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_shirts_shortsleeved%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(17,'Chemise à motif palmier','14.99','chemise','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F8e%2F1e%2F8e1e0dee4a179ac84dc388add3266c1f2bc3117a.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_shirts_shortsleeved%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(18,'Chemise Oversized à motif marron','19.99','chemise','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fdf%2F5f%2Fdf5f7714a003355c5528302b41b463fa54940e52.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_shirts_shortsleeved%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(19,'Chemise Orange/rayures violettes','19.99','chemise','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F04%2F1d%2F041d527d9d0d54ca707830a8861aa97cbbc463a5.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(20,'Chemise Bleu clair/carreaux blancs','19.99','chemise','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F5d%2F46%2F5d46f71249adefd9e70044e4305d2d1f2997290b.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(21,'Veste de sport coupe-vent noir','39.99','veste','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Ffd%2F74%2Ffd74cb68d9ed6c551a59fc2f66e46dfd85b8c09e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(22,'Veste Regular Fit','69.99','veste','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F22%2F38%2F2238b559a73d60ab7766f064cffce80276e10e70.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(23,'Bomber noir','34.99','veste','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fe3%2Fa8%2Fe3a8271acf38f9ec4863dea6e0eef850546967b9.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_jacketscoats_bomberjackets%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(24,'Bomber gris clair','34.99','veste','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F81%2F34%2F8134c3f12c751c353d024cf4014fe2afd22d08c2.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_jacketscoats_bomberjackets%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(25,'Veste en jean Bleu denim foncé','49.99','veste','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Ffc%2Fbb%2Ffcbb0e3d0d86ae060a94db1ec413ba891dc000b5.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(26,'Veste en jean Noir','49.99','veste','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F6a%2F84%2F6a847f5b1e3fbc6aa7ad6f3fd7691e40693f6493.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(27,'Surchemise en velours côtelé Noir','49.99','veste','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fa9%2Fd0%2Fa9d07be4888930498082f5525555f2f1bcb9fd8e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(28,'Surchemise en velours côtelé Crème','49.99','veste','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fc1%2F1a%2Fc11ac7a6d486749fc2b5e97d7b4c1a94f099fdbd.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(29,'Doudoune Noir','49.99','veste','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F7d%2F95%2F7d95ca96a0fe432924082f9bc092c15dcea808c6.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(30,'Cravate en satin Noir','9.99','accessoire','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F3b%2Fff%2F3bff6b5232f06846a741aeadff83cfce1d12cba9.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_accessories_ties_bowties_handkerchiefs%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(31,'Cravate en satin Bleu Foncé','9.99','accessoire','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F32%2F69%2F326979e1b6c940651e88742e74897c01858ae3bc.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_accessories_ties_bowties_handkerchiefs%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(32,'Nœud papillon en satin','9.99','accessoire','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F7e%2F1c%2F7e1cc5f01abd2709b50eb621aa607541d26aad71.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_accessories_ties_bowties_handkerchiefs%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(33,'Ceinture Noire','14.99','accessoire','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fb4%2F80%2Fb4800d4d79a2fac37b007ad5b79700fb3d6b2574.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(34,'Ceinture Marron','14.99','accessoire','https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F2a%2F5f%2F2a5f2b96106697610dc6590fbe8dbeff1188e131.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]'),
(35,'Ceinture élastique en tissu Noir','14.99','accessoire','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F5e%2F74%2F5e7406075fe317b84cefdbe99086063b1f285c19.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_accessories_beltsandbraces%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(36,'Ceinture élastique en tissu Beige clair','14.99','accessoire','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F64%2F22%2F6422ea14b79615e5554797e06968d7ebeeb10bc4.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_accessories_beltsandbraces%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(37,'Ceinture en cuir Noir','19.99','accessoire','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F69%2F41%2F694188e9f849f89058776d3d3c79ab72a2f7809a.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D'),
(38,'Ceinture en cuir Brun','19.99','accessoire','https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F7e%2F68%2F7e686f1373ab16ead61efcc45408b0ce47c33584.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D');


INSERT INTO stock_products (id_stock_produit, id_produit, taille_s, taille_m, taille_l, taille_xl)
VALUES
  (1, 1, 8, 8, 3, 3),
  (2, 2, 8, 2, 9, 6),
  (3, 3, 7, 3, 3, 6),
  (4, 4, 7, 10, 4, 10),
  (5, 5, 10, 1, 10, 6),
  (6, 6, 1, 5, 3, 7),
  (7, 7, 6, 9, 6, 9),
  (8, 8, 6, 7, 10, 7),
  (9, 9, 9, 2, 2, 4),
  (10, 10, 9, 3, 1, 4),
  (11, 11, 9, 3, 4, 3),
  (12, 12, 3, 7, 6, 8),
  (13, 13, 4, 10, 3, 3),
  (14, 14, 8, 9, 10, 10),
  (15, 15, 2, 8, 4, 6),
  (16, 16, 10, 5, 7, 9),
  (17, 17, 1, 7, 6, 5),
  (18, 18, 2, 6, 9, 8),
  (19, 19, 4, 3, 1, 9),
  (20, 20, 5, 5, 1, 6),
  (21, 21, 8, 3, 7, 3),
  (22, 22, 5, 5, 9, 4),
  (23, 23, 1, 1, 6, 9),
  (24, 24, 8, 7, 1, 6),
  (25, 25, 10, 3, 1, 1),
  (26, 26, 9, 9, 9, 5),
  (27, 27, 1, 1, 5, 5),
  (28, 28, 6, 8, 10, 7),
  (29, 29, 3, 4, 6, 1),
  (30, 30, 1, 5, 4, 4),
  (31, 31, 8, 10, 4, 5),
  (32, 32, 4, 8, 1, 1),
  (33, 33, 2, 6, 4, 1),
  (34, 34, 6, 4, 10, 9),
  (35, 35, 10, 4, 7, 9),
  (36, 36, 2, 10, 1, 8),
  (37, 37, 10, 4, 8, 5),
  (38, 38, 5, 5, 1, 6);
