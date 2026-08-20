# 💍 Mur de photos de mariage

Site React (Vite) où les invités déposent leurs photos sans créer de compte.
Stockage gratuit via Supabase, hébergement gratuit via Vercel.

Suis les étapes dans l'ordre, ça prend environ 15-20 minutes la première fois.

---

## Étape 1 — Personnaliser les prénoms

Ouvre `src/config.js` et remplace les valeurs :

```js
export const CONFIG = {
  partner1: 'Prénom',
  partner2: 'Prénom',
  dateLabel: '12 Septembre 2026',
}
```

---

## Étape 2 — Créer le projet Supabase (stockage gratuit)

1. Va sur https://supabase.com et crée un compte gratuit (pas de carte bancaire requise).
2. Clique **New project**, choisis un nom (ex. `mariage-photos`) et un mot de passe de base de données (garde-le de côté, tu n'en auras normalement pas besoin après).
3. Attends ~1-2 minutes que le projet soit prêt.
4. Dans le menu de gauche, va dans **SQL Editor** → **New query**.
5. Ouvre le fichier `supabase-setup.sql` (fourni dans ce projet), copie tout son contenu, colle-le dans l'éditeur, puis clique **Run**.
   - Ça crée automatiquement : le bucket de stockage des photos, la table qui garde les prénoms/messages, et les autorisations pour que les invités puissent déposer des photos sans compte.
6. Va ensuite dans **Settings** (roue crantée) → **API**.
   - Copie la valeur **Project URL**
   - Copie la valeur **anon public** (clé API publique)

Garde ces deux valeurs sous la main, tu en as besoin à l'étape suivante et à l'étape 4.

---

## Étape 3 — Tester en local (optionnel mais recommandé)

Si tu as Node.js installé sur ton ordinateur :

```bash
npm install
cp .env.example .env
```

Ouvre `.env` et colle tes deux valeurs Supabase :

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=ta-cle-anon-publique
```

Puis :

```bash
npm run dev
```

Ouvre l'adresse affichée (ex. `http://localhost:5173`) et essaie d'envoyer une photo.

---

## Étape 4 — Mettre le site en ligne avec une vraie URL

### 4a. Créer un dépôt GitHub

1. Va sur https://github.com et crée un compte si tu n'en as pas.
2. Clique **New repository**, donne-lui un nom (ex. `mur-photos-mariage`), laisse-le en **Public** ou **Private**, ne coche aucune case d'initialisation, clique **Create repository**.
3. Sur ton ordinateur, dans le dossier du projet :

```bash
git init
git add .
git commit -m "Premier envoi du site"
git branch -M main
git remote add origin https://github.com/TON-NOM-UTILISATEUR/mur-photos-mariage.git
git push -u origin main
```

(Remplace l'URL par celle affichée sur la page de ton dépôt GitHub.)

### 4b. Déployer sur Vercel

1. Va sur https://vercel.com et connecte-toi avec ton compte GitHub (gratuit).
2. Clique **Add New** → **Project**.
3. Choisis le dépôt `mur-photos-mariage` que tu viens de créer, clique **Import**.
4. Vercel détecte automatiquement que c'est un projet Vite — laisse les réglages par défaut.
5. Avant de cliquer sur Deploy, ouvre la section **Environment Variables** et ajoute :
   - `VITE_SUPABASE_URL` → colle ton Project URL
   - `VITE_SUPABASE_ANON_KEY` → colle ta clé anon public
6. Clique **Deploy**. Après ~1 minute, Vercel te donne une URL du type :

   `https://mur-photos-mariage.vercel.app`

C'est cette URL que tu partages avec tes invités (par QR code, SMS, ou sur le carton d'invitation).

---

## Étape 5 — Mettre à jour le site plus tard

Si tu modifies le code (par exemple changer les prénoms), il suffit de :

```bash
git add .
git commit -m "Mise à jour"
git push
```

Vercel redéploie automatiquement le site à chaque `push`.

---

## Limites à connaître

- Le plan gratuit Supabase inclut **1 Go de stockage** — largement de quoi tenir un mariage (photos compressées automatiquement avant l'envoi, ~200-500 Ko chacune).
- Le plan gratuit Vercel n'a pas de limite de temps ni de trafic gênante pour cet usage.
- Ni Supabase ni Vercel ne demandent de carte bancaire pour ces plans gratuits.
- Ce site est ouvert à toute personne ayant le lien — ne le partage donc que via un canal privé (SMS, invitation, QR code affiché sur place), pas publiquement sur les réseaux sociaux.
